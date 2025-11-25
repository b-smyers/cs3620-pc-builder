export interface BasePart {
    id: number;
    name: string;
    price: string;
}

export interface Computer {
    "keyboard"?: BasePart;
    "speakers"?: BasePart;
    "memory"?: BasePart;
    "thermal_paste"?: BasePart;
    "pc_case"?: BasePart;
    "monitor"?: BasePart;
    "cpu_cooler"?: BasePart;
    "motherboard"?: BasePart;
    "video_card"?: BasePart;
    "cpu"?: BasePart;
    "mouse"?: BasePart;
    "webcam"?: BasePart;
    "external_hard_drive"?: BasePart;
    "os"?: BasePart;
    "headphones"?: BasePart;
    "power_supply"?: BasePart;
    "internal_hard_drive"?: BasePart;
    "sound_card"?: BasePart;
}

export enum Part {
    KEYBOARD = "keyboard",
    SPEAKERS = "speakers",
    MEMORY = "memory",
    THERMAL_PASTE = "thermal-paste",
    PC_CASE = "pc-case",
    MONITOR = "monitor",
    CPU_COOLER = "cpu-cooler",
    MOTHERBOARD = "motherboard",
    VIDEO_CARD = "video-card",
    CPU = "cpu",
    MOUSE = "mouse",
    WEBCAM = "webcam",
    EXTERNAL_HARD_DRIVE = "external-hard-drive",
    OS = "os",
    HEADPHONES = "headphones",
    POWER_SUPPLY = "power-supply",
    INTERNAL_HARD_DRIVE = "internal-hard-drive",
    SOUND_CARD = "sound-card"
}