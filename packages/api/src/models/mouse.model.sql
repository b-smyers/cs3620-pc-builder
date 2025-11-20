CREATE TABLE
    IF NOT EXISTS mouse (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        tracking_method TEXT,
        connection_type TEXT,
        max_dpi INTEGER,
        hand_orientation TEXT,
        color TEXT
    )