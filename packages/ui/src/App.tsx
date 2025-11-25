import { useEffect, useState } from "react";
import axios from 'axios';

interface BaseItem {
  id: number;
  name: string;
  price: string;
}

interface Computer {
  "keyboard"?: BaseItem;
  "speakers"?: BaseItem;
  "memory"?: BaseItem;
  "thermal-paste"?: BaseItem;
  "pc-case"?: BaseItem;
  "monitor"?: BaseItem;
  "cpu-cooler"?: BaseItem;
  "motherboard"?: BaseItem;
  "video-card"?: BaseItem;
  "cpu"?: BaseItem;
  "mouse"?: BaseItem;
  "webcam"?: BaseItem;
  "external-hard-drive"?: BaseItem;
  "os"?: BaseItem;
  "headphones"?: BaseItem;
  "power-supply"?: BaseItem;
  "internal-hard-drive"?: BaseItem;
  "sound-card"?: BaseItem;
}

const computerKeys: (keyof Computer)[] = [
  "keyboard",
  "speakers",
  "memory",
  "thermal-paste",
  "pc-case",
  "monitor",
  "cpu-cooler",
  "motherboard",
  "video-card",
  "cpu",
  "mouse",
  "webcam",
  "external-hard-drive",
  "os",
  "headphones",
  "power-supply",
  "internal-hard-drive",
  "sound-card"
];

const emptyComputer: Computer = Object.fromEntries(
  computerKeys.map(key => [key, undefined])
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
  }
]

function App() {
  const [selectedPartType, setSelectedPartType] = useState(parts[0].type)
  const [data, setData] = useState<Partial<BaseItem>[]>([])
  const [loading, setLoading] = useState(false)
  const [computer, setComputer] = useState<Computer>(emptyComputer)

  const updateComputer = (partial: Partial<Computer>) =>
    setComputer((prev) => ({ ...prev, ...partial }))

  async function getData(endpoint: string) {
    try {
      setLoading(true)
      const response = await axios.get(`api/${endpoint}`)
      const raw = response.data.data

      const arr = Array.isArray(raw) ? raw : Object.values(raw)

      setData(arr)
      const found = parts.find((p) => p.endpoint === endpoint);
      if (found) setSelectedPartType(found.type);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData(parts[0].endpoint)
  }, [])

  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 items-center">
        <h1 className="font-bold text-2xl">My Computer</h1>
        <div className="flex flex-col w-full h-full bg-stone-700 rounded-3xl p-4 gap-4 overflow-auto">
          <div className="border-b-2 flex justify-end font-bold text-2xl">
            <p>
            Total: ${
              Object.entries(computer).reduce((sum, [_, part]) =>
                sum + Number(part?.price ?? 0)
              , 0).toFixed(2)
            }
            </p>
          </div>

          {Object.entries(computer).map(([partType, part]) => (
            part ?
              (<div className="group flex flex-row justify-between items-center">
                <p className="font-bold">
                  {part.name}
                </p>
                <div className="flex flex-row gap-4 items-center">
                  <p>
                    ${part.price ?? '0.00'}
                  </p>
                  <button
                    onClick={() => updateComputer({ [partType]: undefined })}
                    className="!bg-red-500 font-bold"
                  >
                    X
                  </button>
                </div>
              </div>
              ) : (
                <div className="flex flex-row justify-between items-center text-stone-400">
                  <p className="capitalize">
                    Add {partType.replaceAll('_', ' ')}
                  </p>
                  <button
                    onClick={() => getData(partType.toLowerCase().replaceAll(' ', '-'))}
                    className="!text-white font-bold"
                  >
                    +
                  </button>
                </div>
              )
          )
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 items-center gap-4 p-8">
        <h1 className="font-bold text-2xl">Parts</h1>
        <div className="grid grid-cols-3 w-full gap-2">
          {parts.map((part) => (
            <button
              className={`break-all capitalize ${part.type != selectedPartType && '!bg-stone-700'}`}
              onClick={() => getData(part.endpoint)}
            >
              {part.type}
            </button>
          ))}
        </div>
        <div className="flex flex-col w-full overflow-auto flex-grow">
          <h1 className="font-bold text-2xl text-center">{selectedPartType}</h1>
          {!loading ? (data && data.map((item) => (
            <div className="flex flex-row items-center justify-between py-1 px-4">
              <p>
                {item.name}
              </p>
              <div className="flex flex-row gap-2 items-center">
                <p>
                  ${item.price ?? '-.--'}
                </p>
                <button
                  onClick={() => updateComputer({ [selectedPartType.replaceAll(' ', '-').toLowerCase()]: item })}
                  className="font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="italic">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;