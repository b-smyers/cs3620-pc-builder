CREATE TABLE
    IF NOT EXISTS headphones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        type TEXT,
        frequency_response TEXT,
        microphone BOOLEAN,
        wireless BOOLEAN,
        enclosure_type TEXT,
        color TEXT
    )