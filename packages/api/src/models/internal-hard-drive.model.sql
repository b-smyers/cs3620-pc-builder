CREATE TABLE
    IF NOT EXISTS internal_hard_drive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        capacity INTEGER,
        price_per_gb NUMERIC,
        `type` TEXT,
        cache INTEGER,
        form_factor TEXT,
        interface TEXT
    )