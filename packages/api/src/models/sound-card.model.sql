CREATE TABLE
    IF NOT EXISTS sound_card (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        channels NUMERIC,
        digital_audio INTEGER,
        snr INTEGER,
        sample_rate INTEGER,
        chipset TEXT,
        interface TEXT
    )