CREATE TABLE
    IF NOT EXISTS case_accessory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        `type` TEXT,
        form_factor NUMERIC
    )