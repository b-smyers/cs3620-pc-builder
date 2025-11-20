CREATE TABLE
    IF NOT EXISTS pc_case (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        `name` TEXT,
        price NUMERIC,
        `type` TEXT,
        color TEXT,
        psu TEXT,
        side_panel TEXT,
        external_525_bays INTEGER,
        internal_35_bays INTEGER
    )