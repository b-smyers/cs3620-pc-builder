CREATE TABLE
    IF NOT EXISTS video_card (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        chipset TEXT,
        memory INTEGER,
        core_clock INTEGER,
        boost_clock INTEGER,
        color TEXT,
        `length` INTEGER
    )