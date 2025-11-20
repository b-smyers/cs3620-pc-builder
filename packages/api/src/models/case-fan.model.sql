CREATE TABLE
    IF NOT EXISTS case_fan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        size TEXT,
        color TEXT,
        rpm TEXT,
        airflow TEXT,
        noise_level TEXT,
        pwm BOOLEAN
    )