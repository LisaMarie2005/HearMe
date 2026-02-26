// ─── PALETTE for colour swatches ─────────────────────────────────────────────
export const SWATCH_COLORS = [
    "#f4a0a0", "#8b2020", "#4caf50", "#b2f0e8", "#c0524e",
    "#7c5cad", "#f4c842", "#f4872a", "#4a90d9", "#aaaaaa",
    "#d4a0d4", "#3a7a3a", "#f08080", "#5c5c8a", "#e8d5a3",
    "#2e8b8b", "#a0c4f4", "#c4a0f4",
];

// ─── BACKGROUND colours ───────────────────────────────────────────────────────
export const BG_COLORS = [
    "#c8e8ed", "#f4a0a0", "#b2e8b2", "#f4e8a0", "#c8b2f0",
    "#f4c8a0", "#a0c8f4", "#f4a0d4", "#aaaaaa", "#d4c8b2",
    "#8b2020", "#4caf50", "#2e6b9e", "#7c5cad", "#c0524e",
    "#b5813b", "#3a7a3a", "#f08080",
];

// ─── Frame images (photos/frames/) ────────────────────────────────────────────
export const FRAME_IMAGES = [
    "Group 27.png",
    "image-removebg-preview (1) 1.png",
    "image-removebg-preview (2) 1.png",
    "image-removebg-preview 1.png",
    "image_2026-02-12_132945066-removebg-preview 1.png",
    "image_2026-02-12_133121176-removebg-preview 1.png",
];

// ─── Radio colour presets ─────────────────────────────────────────────────────
export const RADIO_PRESETS = [
    { name: "Classic Red", body: "#e74c3c", speaker: "#2c3e50", handle: "#7f8c8d", buttons: "#f39c12", detail: "#ecf0f1" },
    { name: "Ocean Blue", body: "#2980b9", speaker: "#1a252f", handle: "#95a5a6", buttons: "#e67e22", detail: "#ecf0f1" },
    { name: "Purple Haze", body: "#8e44ad", speaker: "#2c2c54", handle: "#a0a0a0", buttons: "#e74c3c", detail: "#f5f5f5" },
    { name: "Mint Fresh", body: "#1abc9c", speaker: "#2d3436", handle: "#b2bec3", buttons: "#fdcb6e", detail: "#ffffff" },
    { name: "Sunset", body: "#e67e22", speaker: "#34495e", handle: "#bdc3c7", buttons: "#c0392b", detail: "#fef9ef" },
    { name: "Midnight", body: "#2c3e50", speaker: "#1a1a2e", handle: "#636e72", buttons: "#00cec9", detail: "#dfe6e9" },
    { name: "Bubblegum", body: "#fd79a8", speaker: "#6c5ce7", handle: "#b2bec3", buttons: "#fdcb6e", detail: "#ffffff" },
    { name: "Forest", body: "#27ae60", speaker: "#2d3436", handle: "#6c5ce7", buttons: "#f39c12", detail: "#dfe6e9" },
];

export const DEFAULT_RADIO_COLORS = {
    body: "#e74c3c",
    speaker: "#2c3e50",
    handle: "#7f8c8d",
    buttons: "#f39c12",
    detail: "#ecf0f1",
};

export const DEFAULT_PLAYLIST = {
    id: "default",
    name: "Playlist #1",
    color: "#f4a0a0",
    songs: [],
};

export const DEFAULT_STATE = {
    page: "room",
    bgColor: "#c8e8ed",
    bgImage: null,
    playlists: [{ ...DEFAULT_PLAYLIST }],
    activePlaylist: null, // id of playlist being edited in wizard
    profile: { name: "", genre: "", bio: "", photo: null, frame: 0 },
    radioColors: { ...DEFAULT_RADIO_COLORS },
    shelfColor: "#b5813b", // Main wood color
};

// Deep-clone the default state
export function getInitialState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

export const PAGES = [
    "room", "playlist-name", "playlist-color", "playlist-songs",
    "bg-picker", "radio-picker", "frame-picker",
];

export function sanitizePage(page) {
    return PAGES.includes(page) ? page : "room";
}
