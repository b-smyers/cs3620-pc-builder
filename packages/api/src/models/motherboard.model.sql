CREATE TABLE
    IF NOT EXISTS motherboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        socket TEXT,
        form_factor TEXT,
        max_memory INTEGER,
        memory_slots INTEGER,
        color TEXT
    )