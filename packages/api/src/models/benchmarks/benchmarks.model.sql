CREATE TABLE
    IF NOT EXISTS benchmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        part_number TEXT,
        brand TEXT,
        model TEXT,
        rank INTEGER,
        benchmark INTEGER,
        samples INTEGER,
        url TEXT
    )