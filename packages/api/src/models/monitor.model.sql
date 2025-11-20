CREATE TABLE
    IF NOT EXISTS monitor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        screen_size INTEGER,
        resolution TEXT,
        refresh_rate INTEGER,
        response_time NUMERIC,
        panel_type TEXT,
        aspect_ratio TEXT
    )