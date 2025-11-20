CREATE TABLE
    IF NOT EXISTS fan_controller (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        channels INTEGER,
        channel_wattage INTEGER,
        pwm BOOLEAN,
        form_factor TEXT,
        color TEXT
    )