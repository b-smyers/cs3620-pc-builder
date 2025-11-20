CREATE TABLE
    IF NOT EXISTS cpu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        core_count INTEGER,
        core_clock NUMERIC,
        boost_clock NUMERIC,
        tdp INTEGER,
        graphics TEXT,
        smt BOOLEAN
    )