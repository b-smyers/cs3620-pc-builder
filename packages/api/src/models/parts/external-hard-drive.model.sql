CREATE TABLE
    IF NOT EXISTS external_hard_drive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        type TEXT,
        interface TEXT,
        capacity INTEGER,
        price_per_gb NUMERIC,
        color TEXT
    )