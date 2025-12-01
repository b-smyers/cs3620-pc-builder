CREATE TABLE
    IF NOT EXISTS power_supply (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        type TEXT,
        efficiency TEXT,
        wattage INTEGER,
        modular TEXT,
        color TEXT
    )