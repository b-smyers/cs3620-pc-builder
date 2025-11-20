CREATE TABLE
    IF NOT EXISTS ups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        capacity_w INTEGER,
        capacity_va INTEGER
    )