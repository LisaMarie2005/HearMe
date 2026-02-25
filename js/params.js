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
    profile: { name: "", genre: "", bio: "" },
};

// Deep-clone the default state
export function getInitialState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

export const PAGES = ["room", "playlist-name", "playlist-color", "playlist-songs", "bg-picker"];

export function sanitizePage(page) {
    return PAGES.includes(page) ? page : "room";
}
