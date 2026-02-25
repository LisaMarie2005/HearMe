import { SWATCH_COLORS, BG_COLORS } from "./params.js";
import { state } from "./state.js";

// ─── Mock song catalogue ──────────────────────────────────────────────────────
const MOCK_SONGS = [
    { id: "s1", name: "Chill Vibes", artist: "Lo-Fi Dreams", color: "#b2c8f4" },
    { id: "s2", name: "Night Drive", artist: "City Sounds", color: "#c8b2f4" },
    { id: "s3", name: "Golden Hour", artist: "Sunset Trio", color: "#f4e0a0" },
    { id: "s4", name: "Rainy Day", artist: "The Couch", color: "#a0c8a0" },
    { id: "s5", name: "Coffee Shop", artist: "Acoustic Days", color: "#f4c0a0" },
    { id: "s6", name: "Midnight Jazz", artist: "The Late Set", color: "#c0a0f4" },
    { id: "s7", name: "Summer Breeze", artist: "Beach Waves", color: "#a0f4e8" },
    { id: "s8", name: "Focus Mode", artist: "Study Beats", color: "#f4a0a0" },
    { id: "s9", name: "Electric Groove", artist: "Neon Collective", color: "#f4f4a0" },
    { id: "s10", name: "Quiet Storm", artist: "Velvet Mood", color: "#c8c8f4" },
    { id: "s11", name: "Morning Light", artist: "Sunrise Ensemble", color: "#f0e8c0" },
    { id: "s12", name: "Wanderlust", artist: "Road Trippers", color: "#a0d4f4" },
];

// ─── Page visibility ──────────────────────────────────────────────────────────
const ALL_PAGES = ["room", "playlist-name", "playlist-color", "playlist-songs", "bg-picker"];

export function renderPage(page) {
    ALL_PAGES.forEach((id) => {
        const el = document.getElementById(`page-${id}`);
        if (!el) return;
        el.hidden = id !== page;
        el.style.display = id === page ? "" : "none";
    });
    window.scrollTo({ top: 0, behavior: "instant" });
}

// ─── Room view ────────────────────────────────────────────────────────────────
export function renderRoom() {
    // Background
    document.body.style.background =
        state.bgImage
            ? `url(${state.bgImage}) center/cover no-repeat`
            : state.bgColor;

    // Shelf
    renderShelf();

    // Profile board
    const nameEl = document.getElementById("profile-name-display");
    const genreEl = document.getElementById("profile-genre-display");
    const bioEl = document.getElementById("profile-bio-display");
    if (nameEl) nameEl.textContent = state.profile.name || "Name";
    if (genreEl) genreEl.textContent = state.profile.genre || "Favourite genre";
    if (bioEl) bioEl.textContent = state.profile.bio || "Bio";
}

function renderShelf() {
    const container = document.getElementById("playlist-spines");
    if (!container) return;
    container.innerHTML = "";

    state.playlists.forEach((pl) => {
        const spine = document.createElement("div");
        spine.className = "playlist-spine";
        spine.style.background = pl.color;
        spine.textContent = pl.name;
        spine.dataset.playlistId = pl.id;
        container.appendChild(spine);
    });

    // Add "+" button
    const addBtn = document.createElement("button");
    addBtn.className = "btn-add-playlist";
    addBtn.textContent = "+";
    addBtn.id = "btn-add-playlist";
    container.appendChild(addBtn);
}

// ─── Wizard sidebar label (updates live while typing) ─────────────────────────
export function updateWizardLabels(name) {
    ["wizard-sidebar-label", "wizard-color-label", "wizard-songs-label"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = name || "New Playlist";
    });
}

// ─── Colour swatch grids ─────────────────────────────────────────────────────
export function renderPlaylistColorGrid(selectedColor) {
    _renderSwatchGrid("playlist-color-grid", SWATCH_COLORS, selectedColor, "playlist-swatch");
}

export function renderBgColorGrid(selectedColor) {
    _renderSwatchGrid("bg-color-grid", BG_COLORS, selectedColor, "bg-swatch");
}

function _renderSwatchGrid(containerId, colors, selected, dataAttr) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = "";
    colors.forEach((color) => {
        const swatch = document.createElement("div");
        swatch.className = "color-swatch" + (color === selected ? " selected" : "");
        swatch.style.background = color;
        swatch.dataset[dataAttr === "playlist-swatch" ? "playlistColor" : "bgColor"] = color;
        grid.appendChild(swatch);
    });
}

// ─── Song search results ──────────────────────────────────────────────────────
export function renderSongSearch(query) {
    const results = document.getElementById("song-search-results");
    if (!results) return;
    results.innerHTML = "";

    const q = query.trim().toLowerCase();
    const filtered = q
        ? MOCK_SONGS.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.artist.toLowerCase().includes(q)
        )
        : MOCK_SONGS;

    filtered.forEach((song) => {
        results.appendChild(_buildSongItem(song));
    });
}

function _buildSongItem(song) {
    const item = document.createElement("div");
    item.className = "song-item";

    const thumb = document.createElement("div");
    thumb.className = "song-thumb";
    thumb.style.background = song.color;

    const info = document.createElement("div");
    info.className = "song-info";
    info.innerHTML = `<div class="song-name">${song.name}</div><div class="song-artist">${song.artist}</div>`;

    const btn = document.createElement("button");
    btn.className = "btn-add-song";
    btn.textContent = "+";
    btn.dataset.songId = song.id;
    btn.title = `Add ${song.name}`;

    item.appendChild(thumb);
    item.appendChild(info);
    item.appendChild(btn);
    return item;
}

// ─── Edit playlist panel ──────────────────────────────────────────────────────
export function renderEditPlaylist() {
    const list = document.getElementById("edit-playlist-list");
    if (!list) return;
    list.innerHTML = "";

    const songs = state.draft?.songs ?? [];
    if (songs.length === 0) {
        list.innerHTML = '<p style="font-size:0.8rem;color:#666;padding:0.5rem;">No songs yet — add some!</p>';
        return;
    }

    songs.forEach((song) => {
        const item = document.createElement("div");
        item.className = "edit-item";

        const minusBtn = document.createElement("button");
        minusBtn.className = "btn-remove-song";
        minusBtn.textContent = "−";
        minusBtn.dataset.removeSongId = song.id;

        const thumb = document.createElement("div");
        thumb.className = "edit-thumb";
        thumb.style.background = song.color;

        const info = document.createElement("div");
        info.className = "edit-info";
        info.innerHTML = `<div class="song-name">${song.name}</div><div class="song-artist">${song.artist}</div>`;

        const handle = document.createElement("span");
        handle.className = "drag-handle";
        handle.textContent = "≡";

        item.appendChild(minusBtn);
        item.appendChild(thumb);
        item.appendChild(info);
        item.appendChild(handle);
        list.appendChild(item);
    });
}
