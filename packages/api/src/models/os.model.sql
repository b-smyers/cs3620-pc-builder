CREATE TABLE
    IF NOT EXISTS os (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        mode TEXT,
        max_memory INTEGER
    )