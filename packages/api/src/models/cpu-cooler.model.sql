CREATE TABLE
    IF NOT EXISTS cpu_cooler (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        rpm TEXT,
        noise_level TEXT,
        color TEXT,
        `size` INTEGER
    )