CREATE TABLE
    IF NOT EXISTS optical_drive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        bd INTEGER,
        dvd INTEGER,
        cd INTEGER,
        bd_write TEXT,
        dvd_write TEXT,
        cd_write TEXT
    )