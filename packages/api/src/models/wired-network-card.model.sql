CREATE TABLE
    IF NOT EXISTS wired_network_card (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        interface TEXT,
        color TEXT
    )