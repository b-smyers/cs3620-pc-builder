CREATE TABLE
    IF NOT EXISTS memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price NUMERIC,
        speed TEXT,
        modules TEXT,
        price_per_gb NUMERIC,
        color TEXT,
        first_word_latency NUMERIC,
        cas_latency INTEGER
    )