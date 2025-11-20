CREATE TABLE
    IF NOT EXISTS speakers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        `configuration` NUMERIC,
        wattage NUMERIC,
        frequency_response TEXT,
        color TEXT
    )