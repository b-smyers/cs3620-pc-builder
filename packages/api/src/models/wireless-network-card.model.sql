CREATE TABLE
    IF NOT EXISTS wireless_network_card (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        protocol TEXT,
        interface TEXT,
        color TEXT
    )