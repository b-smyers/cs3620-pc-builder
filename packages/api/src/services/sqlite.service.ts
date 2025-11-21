import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbFile: string =
  process.env.NODE_ENV !== "test" ? "database.db" : ":memory:";

// SQL schema files
const modelFiles: string[] = [
  path.join(__dirname, "../models", "keyboard.model.sql"),
  path.join(__dirname, "../models", "speakers.model.sql"),
  path.join(__dirname, "../models", "memory.model.sql"),
  path.join(__dirname, "../models", "thermal-paste.model.sql"),
  path.join(__dirname, "../models", "pc-case.model.sql"),
  path.join(__dirname, "../models", "monitor.model.sql"),
  path.join(__dirname, "../models", "cpu-cooler.model.sql"),
  path.join(__dirname, "../models", "motherboard.model.sql"),
  path.join(__dirname, "../models", "video-card.model.sql"),
  path.join(__dirname, "../models", "cpu.model.sql"),
  path.join(__dirname, "../models", "mouse.model.sql"),
  path.join(__dirname, "../models", "webcam.model.sql"),
  path.join(__dirname, "../models", "external-hard-drive.model.sql"),
  path.join(__dirname, "../models", "os.model.sql"),
  path.join(__dirname, "../models", "headphones.model.sql"),
  path.join(__dirname, "../models", "power-supply.model.sql"),
  path.join(__dirname, "../models", "internal-hard-drive.model.sql"),
  path.join(__dirname, "../models", "sound-card.model.sql"),
  path.join(__dirname, "../models", "computer.model.sql"),
];

const db = new Database(dbFile);
db.pragma("journal_mode = WAL");
console.log("Database connected");

// Execute schemas
for (const filePath of modelFiles) {
  const schema = fs.readFileSync(filePath, "utf-8");

  try {
    db.exec(schema);
  } catch (error: any) {
    console.error(`Model error: ${filePath}\nSQLite3 error:${error.message}`);
    process.exit(1);
  }
}

console.log("All schemas executed successfully");

// Check if dataset is missing, add it if its missing
console.log("Starting dataset import…");

const datasetDir = path.join(__dirname, "../dataset");

for (const modelPath of modelFiles) {
  const base = path.basename(modelPath).replace(".model.sql", "");
  const table = base.replace(/-/g, "_");
  const datasetPath = path.join(datasetDir, base + ".json");

  // Check if table already has data
  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM \`${table}\``);
  const { count } = countStmt.get() as any;

  if (count > 0) {
    console.log(`Table ${table} already has ${count} records, skipping import.`);
    continue;
  }

  // No records? Then we try loading dataset
  if (!fs.existsSync(datasetPath)) {
    console.log(`No dataset found for ${table}, skipping.`);
    continue;
  }

  let rows;
  try {
    rows = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));
  } catch (err) {
    console.error(`Failed to parse JSON for ${table}: ${err}`);
    process.exit(1);
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    console.log(`Dataset for ${table} is empty or invalid, skipping.`);
    continue;
  }

  const columns = Object.keys(rows[0]);
  const placeholders = columns.map(() => "?").join(", ");
  const insertSQL = `INSERT INTO ${table} (${columns.join(
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
    console.log(`Imported ${rows.length} records into ${table}`);
  } catch (err) {
    console.error(`Failed to import dataset for ${table}: ${err}`);
    process.exit(1);
  }
}


console.log("Dataset import complete.");

// Export the database instance
export default db;
