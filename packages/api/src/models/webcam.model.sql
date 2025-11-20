CREATE TABLE
    IF NOT EXISTS webcam (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        resolutions TEXT,
        connection TEXT,
        focus_type TEXT,
        os TEXT,
        fov NUMERIC
    )