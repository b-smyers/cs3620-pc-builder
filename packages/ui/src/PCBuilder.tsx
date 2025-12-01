import { useEffect, useState } from "react";
import { api } from "./services/api";
import type { BasePart, Computer } from "./types/types";
import { Layout } from "./layout/layout";

const computerKeys: (keyof Computer)[] = [
  "keyboard",
  "speakers",
  "memory",
  "thermal_paste",
  "pc_case",
  "monitor",
  "cpu_cooler",
  "motherboard",
  "video_card",
  "cpu",
  "mouse",
  "webcam",
  "external_hard_drive",
  "os",
  "headphones",
  "power_supply",
  "internal_hard_drive",
  "sound_card",
];

const emptyComputer: Computer = Object.fromEntries(
  computerKeys.map((key) => [key, undefined])
) as Computer;

const parts = [
  {
    type: "Keyboard",
    endpoint: "keyboard",
  },
  {
    type: "Speakers",
    endpoint: "speakers",
  },
  {
    type: "Memory",
    endpoint: "memory",
  },
  {
    type: "Thermal Paste",
    endpoint: "thermal-paste",
  },
  {
    type: "PC Case",
    endpoint: "pc-case",
  },
  {
    type: "Monitor",
    endpoint: "monitor",
  },
  {
    type: "CPU Cooler",
    endpoint: "cpu-cooler",
  },
  {
    type: "Motherboard",
    endpoint: "motherboard",
  },
  {
    type: "Video Card",
    endpoint: "video-card",
  },
  {
    type: "CPU",
    endpoint: "cpu",
  },
  {
    type: "Mouse",
    endpoint: "mouse",
  },
  {
    type: "Webcam",
    endpoint: "webcam",
  },
  {
    type: "External Hard Drive",
    endpoint: "external-hard-drive",
  },
  {
    type: "OS",
    endpoint: "os",
  },
  {
    type: "Headphones",
    endpoint: "headphones",
  },
  {
    type: "Power Supply",
    endpoint: "power-supply",
  },
  {
    type: "Internal Hard Drive",
    endpoint: "internal-hard-drive",
  },
  {
    type: "Sound Card",
    endpoint: "sound-card",
  },
];

export function PCBuilder() {
  const [selectedPartType, setSelectedPartType] = useState(parts[0].type);
  const [data, setData] = useState<BasePart[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [computerLoading, setComputerLoading] = useState(false);
  const [computer, setComputer] = useState<Computer>(emptyComputer);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  async function updateComputer(partial: Partial<Computer>) {
    console.log("partial:", partial);

    const before = computer;
    const after = { ...computer, ...partial };

    if (!loggedIn) {
      await login(username, password);
      if (!loggedIn) return;
    }

    setComputer(after);

    try {
      setComputerLoading(true);
      console.log("Updating computer:", partial);

      const field = Object.keys(partial)[0] as keyof Computer;     // e.g. "cpu"
      const value = partial[field];              // object or undefined
      const isRemove = value === undefined;

      const partType = field.replaceAll("_", "-");

      await api.post(`computer/${partType}`, {
        id: isRemove ? null : value.id,
      });
    } catch (error) {
      console.log(error);
      setComputer(before);
      setLoggedIn(false);
    } finally {
      setComputerLoading(false);
    }
  }

  async function getPart(
    endpoint: string,
    id: string
  ): Promise<BasePart | undefined> {
    try {
      console.log("Getting:", endpoint);
      const response = await api.get(`${endpoint}/${id}`);
      const raw = response.data.data;

      return raw as BasePart;
    } catch (error) {
      console.log(error);
    }
  }

  async function getData(endpoint: string) {
    try {
      setDataLoading(true);
      const response = await api.get(`${endpoint}`);
      const raw = response.data.data;

      const arr = Array.isArray(raw) ? raw : Object.values(raw);

      setData(arr);
      const found = parts.find((p) => p.endpoint === endpoint);
      if (found) setSelectedPartType(found.type);
    } finally {
      setDataLoading(false);
    }
  }

  async function getComputer() {
    try {
      console.log("Getting computer");
      const response = await api.get("/computer");
      const raw = response.data.data;
      console.log("setting computer", raw);

      const partKeys: (keyof Computer)[] = [
        "keyboard",
        "speakers",
        "memory",
        "thermal_paste",
        "pc_case",
        "monitor",
        "cpu_cooler",
        "motherboard",
        "video_card",
        "cpu",
        "mouse",
        "webcam",
        "external_hard_drive",
        "os",
        "headphones",
        "power_supply",
        "internal_hard_drive",
        "sound_card",
      ];

      const newComputer: Computer = {} as Computer;

      for (const key of partKeys) {
        const columnName = `${key}_id`; // e.g., "keyboard_id"
        const endpoint = key.replaceAll("_", "-"); // match API endpoint
        const id = raw[columnName as keyof typeof raw];
        if (id) {
          newComputer[key] = await getPart(endpoint, id);
        } else {
          newComputer[key] = undefined;
        }
      }

      console.log("set computer", newComputer);
      setComputer(newComputer);
    } catch (error) {
      console.log(error);
      setLoggedIn(false);
    }
  }

  async function login(username: string, password: string) {
    try {
      console.log("logging in");
      await api.post("/login", { username, password });

      await getComputer();

      setLoggedIn(true);
    } catch (error) {
      setLoggedIn(false);
    }
  }

  useEffect(() => {
    getData(parts[0].endpoint);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 items-center">
        <h1 className="font-bold text-2xl">Account</h1>
        {!loggedIn ? (
          <>
            <p className="text-center">
              You are currently logged out, your changes will not be saved.
              <br />
              Create or login to your account to save your computer.
            </p>
            <div className="flex flex-row gap-2 w-full">
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-stone-400 rounded-xl p-2 flex-1"
              />
              <input
                type="text"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-stone-400 rounded-xl p-2 flex-1"
              />
              <button
                onClick={() => login(username, password)}
                className="px-4 py-2 whitespace-nowrap"
              >
                Login
              </button>
            </div>
          </>
        ) : (
          <p>You are logged in, your changes will be saved.</p>
        )}

        <h1 className="font-bold text-2xl">My Computer</h1>
        <div className="flex flex-col w-full h-full bg-stone-700 rounded-3xl p-4 gap-4 overflow-auto">
          <div className="border-b-2 flex justify-end font-bold text-2xl">
            <p>
              Total: $
              {Object.entries(computer)
                .reduce((sum, [_, part]) => sum + Number(part?.price ?? 0), 0)
                .toFixed(2)}
            </p>
          </div>

          {!computerLoading ? (
            Object.entries(computer).map(([partType, part]) =>
              part ? (
                <div className="group flex flex-row justify-between items-center">
                  <p className="font-bold">{part.name}</p>
                  <div className="flex flex-row gap-4 items-center">
                    <p>${part.price ?? "0.00"}</p>
                    <button
                      onClick={() =>
                        updateComputer({ [partType]: undefined })
                      }
                      className="!bg-red-500 font-bold"
                    >
                      X
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row justify-between items-center text-stone-400">
                  <p className="capitalize">
                    Add {partType.replaceAll("-", " ")}
                  </p>
                  <button
                    onClick={() =>
                      getData(partType.toLowerCase().replaceAll("_", "-"))
                    }
                    className="!text-white font-bold"
                  >
                    +
                  </button>
                </div>
              )
            )
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="italic">Loading...</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 items-center gap-4 p-8">
        <h1 className="font-bold text-2xl">Parts</h1>
        <div className="grid grid-cols-3 w-full gap-2">
          {parts.map((part) => (
            <button
              className={`break-all capitalize ${part.type != selectedPartType && "!bg-stone-700"}`}
              onClick={() => getData(part.endpoint)}
            >
              {part.type}
            </button>
          ))}
        </div>
        <div className="flex flex-col w-full overflow-auto flex-grow">
          <h1 className="font-bold text-2xl text-center">
            {selectedPartType}
          </h1>
          {!dataLoading ? (
            data &&
            data.map((item) => (
              <div className="flex flex-row items-center justify-between py-1 px-4">
                <p>{item.name}</p>
                <div className="flex flex-row gap-2 items-center">
                  <p>${item.price ?? "-.--"}</p>
                  <button
                    onClick={() =>
                      updateComputer({
                        [selectedPartType.toLowerCase().replaceAll(" ", "_")]:
                          item,
                      })
                    }
                    className="font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="italic">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
