import { useEffect, useState } from "react";
import { api } from "./services/api";
import { Layout } from "./layout/layout";

const PartTypes = {
  CPU: "CPU",
  GPU: "GPU",
  RAM: "RAM",
  HDD: "HDD",
  SSD: "SSD",
};

type PartType = (typeof PartTypes)[keyof typeof PartTypes];

interface Part {
  id: number;
  type: PartType;
  part_number: string;
  brand: string;
  model: string;
  rank: number;
  benchmark: number;
  samples: number;
  url: string;
}

export function PartLeaderboard() {
  const [selectedPartType, setSelectedPartType] = useState<PartType>(
    PartTypes.CPU
  );
  const [sortOrder, setSortOrder] = useState("ASC");
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState<Part[]>([]);

  async function getData(partType: PartType) {
    try {
      setDataLoading(true);
      const response = await api.get(`benchmarks/${partType}`);
      const raw = response.data.data;

      const arr = Array.isArray(raw) ? raw : Object.values(raw);

      setData(arr as any);
    } finally {
      setDataLoading(false);
    }
  }

  async function sortColumn(column: string) {
    try {
      setDataLoading(true);
      if (sortOrder == "ASC") {
        setSortOrder("DESC");
      } else {
        setSortOrder("ASC");
      }
      const response = await api.get(
        `benchmarks/${selectedPartType}?sort=${column}&sortOrder=${sortOrder}`
      );
      const raw = response.data.data;

      const arr = Array.isArray(raw) ? raw : Object.values(raw);

      setData(arr as any);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    getData(selectedPartType);
  }, [selectedPartType]);

  return (
    <Layout>
        <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 items-center">
          <h1 className="font-bold text-2xl">Parts Leaderboard</h1>
          <div className="flex flex-row gap-2 w-full">
            {Object.values(PartTypes).map((partType) => (
              <button
                className={`break-all capitalize flex-grow ${partType != selectedPartType && "!bg-stone-700"}`}
                onClick={() => setSelectedPartType(partType)}
              >
                {partType}
              </button>
            ))}
          </div>
          <div className="flex flex-col w-full h-full bg-stone-700 rounded-3xl p-4 gap-4 overflow-auto">
            {!dataLoading ? (
              <table>
                <thead>
                  <tr>
                    <th
                      className="underline"
                      onClick={() => sortColumn("brand")}
                    >
                      Brand
                    </th>
                    <th
                      className="underline"
                      onClick={() => sortColumn("model")}
                    >
                      Model
                    </th>
                    <th
                      className="underline"
                      onClick={() => sortColumn("rank")}
                    >
                      User Rank
                    </th>
                    <th
                      className="underline"
                      onClick={() => sortColumn("benchmark")}
                    >
                      Benchmark Score
                    </th>
                    <th
                      className="underline"
                      onClick={() => sortColumn("samples")}
                    >
                      Popularity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((part) => (
                      <tr>
                        <td className="text-center">{part.brand}</td>
                        <td className="text-center">
                          <a
                            className="hover:cursor-pointer"
                            target="_blank"
                            href={part.url}
                          >
                            {part.model}
                          </a>
                        </td>
                        <td className="text-center">{part.rank}</td>
                        <td className="text-center">{part.benchmark}</td>
                        <td className="text-center">
                          {part.samples?.toLocaleString("en-US")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
