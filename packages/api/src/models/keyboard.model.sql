CREATE TABLE
    IF NOT EXISTS keyboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        style TEXT,
        switches TEXT,
        backlit TEXT,
        tenkeyless BOOLEAN,
        connection_type TEXT,
        color TEXT
    )