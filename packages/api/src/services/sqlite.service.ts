import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbFile: string =
  process.env.NODE_ENV !== "test" ? "database.db" : ":memory:";

// SQL schema files
const tables = [
  {
    sql: path.join(__dirname, "../models/parts", "keyboard.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "keyboard.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "speakers.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "speakers.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "memory.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "memory.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "thermal-paste.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "thermal-paste.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "pc-case.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "pc-case.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "monitor.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "monitor.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "cpu-cooler.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "cpu-cooler.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "motherboard.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "motherboard.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "video-card.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "video-card.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "cpu.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "cpu.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "mouse.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "mouse.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "webcam.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "webcam.json"),
  },
  {
    sql: path.join(
      __dirname,
      "../models/parts",
      "external-hard-drive.model.sql"
    ),
    dataset: path.join(__dirname, "../data/parts", "external-hard-drive.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "os.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "os.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "headphones.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "headphones.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "power-supply.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "power-supply.json"),
  },
  {
    sql: path.join(
      __dirname,
      "../models/parts",
      "internal-hard-drive.model.sql"
    ),
    dataset: path.join(__dirname, "../data/parts", "internal-hard-drive.json"),
  },
  {
    sql: path.join(__dirname, "../models/parts", "sound-card.model.sql"),
    dataset: path.join(__dirname, "../data/parts", "sound-card.json"),
  },
  {
    sql: path.join(__dirname, "../models/benchmarks", "benchmarks.model.sql"),
    dataset: [
      path.join(__dirname, "../data/benchmarks", "cpu.csv"),
      path.join(__dirname, "../data/benchmarks", "gpu.csv"),
      path.join(__dirname, "../data/benchmarks", "hdd.csv"),
      path.join(__dirname, "../data/benchmarks", "ram.csv"),
      path.join(__dirname, "../data/benchmarks", "ssd.csv"),
    ],
  },
  {
    sql: path.join(__dirname, "../models/parts", "computer.model.sql"),
  },
  {
    sql: path.join(__dirname, "../models", "users.model.sql"),
  },
];

const db = new Database(dbFile);
db.pragma("journal_mode = WAL");
console.log("Database connected");

console.log("Initializing database...");
// Execute schemas
for (const table of tables) {
  const schema = fs.readFileSync(table.sql, "utf-8");

  try {
    db.exec(schema);
  } catch (error: any) {
    console.error(`Model error: ${table.sql}\nSQLite3 error:${error.message}`);
    process.exit(1);
  }

  // Skip dataset import if none specified
  if (!table.dataset) continue;

  // Get the table name
  const base = path.basename(table.sql).replace(".model.sql", "");
  const tableName = base.replace(/-/g, "_");

  // Check if table already has data
  const countStmt = db.prepare(
    `SELECT COUNT(*) as count FROM \`${tableName}\``
  );
  const { count } = countStmt.get() as any;

  if (count > 0) {
    console.log(
      `Table ${tableName} already has ${count} records, skipping import.`
    );
    continue;
  }

  // Import jsop/csv datasets
  const modelFiles = Array.isArray(table.dataset)
    ? table.dataset
    : [table.dataset];

  for (const datasetPath of modelFiles) {
    if (!fs.existsSync(datasetPath)) {
      console.log(`No dataset found at ${datasetPath}, skipping.`);
      continue;
    }

    let rows;
    try {
      if (datasetPath.endsWith(".json")) {
        rows = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));
      } else if (datasetPath.endsWith(".csv")) {
        const csvData = fs.readFileSync(datasetPath, "utf-8");
        const lines = csvData.split("\n").filter((line) => line.trim() !== "");
        const headers = lines[0].split(",").map((h) => h.toLowerCase().trim().replace(' ', '_'));
        rows = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
          return obj;
        });
      } else {
        console.log(`Unsupported dataset format for ${datasetPath}, skipping.`);
        continue;
      }
    } catch (err) {
      console.error(`Failed to parse dataset for ${tableName}: ${err}`);
      process.exit(1);
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      console.log(`Dataset for ${tableName} is empty or invalid, skipping.`);
      continue;
    }

    // convert column names to lowercase with underscores
    const columns = Object.keys(rows[0]).map((col) =>
      col.trim().toLowerCase().replace(/ /g, "_")
    );
    const placeholders = columns.map(() => "?").join(", ");
    const insertSQL = `INSERT INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;

    const insert = db.prepare(insertSQL);
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        // Coerce all values to strings (or JSON for arrays/objects)
        const values = columns.map((c) => {
          const val = item[c];
          if (val === null || val === undefined) return null; // preserve null
          if (typeof val === "object") return JSON.stringify(val); // arrays/objects
          return String(val); // numbers, booleans, etc.
        });
        insert.run(values);
      }
    });

    try {
      insertMany(rows);
      console.log(`Imported ${rows.length} records into ${tableName}`);
    } catch (err) {
      console.error(`Failed to import dataset for ${tableName}: ${err}`);
      process.exit(1);
    }
  }
}

console.log("Dataset import complete.");

// Export the database instance
export default db;
