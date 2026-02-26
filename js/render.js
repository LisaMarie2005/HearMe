import { SWATCH_COLORS, BG_COLORS, FRAME_IMAGES, RADIO_PRESETS } from "./params.js";
import { state } from "./state.js";

// ─── Page visibility ──────────────────────────────────────────────────────────
const ALL_PAGES = [
    "room", "playlist-name", "playlist-color", "playlist-songs",
    "bg-picker", "radio-picker", "frame-picker", "shelf-picker",
];

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

    // Frame image
    const frameImg = document.getElementById("profile-frame-img");
    if (frameImg) {
        const frameFile = FRAME_IMAGES[state.profile.frame] || FRAME_IMAGES[0];
        frameImg.src = `./photos/frames/${frameFile}`;
    }

    // Profile photo
    const photoSlot = document.getElementById("profile-photo-btn");
    if (photoSlot && state.profile.photo) {
        photoSlot.style.backgroundImage = `url(${state.profile.photo})`;
        photoSlot.style.backgroundSize = "cover";
        photoSlot.style.backgroundPosition = "center";
        photoSlot.innerHTML = "";
    }

    // Radio image
    const boombox = document.getElementById("boombox");
    if (boombox && state.radioColors) {
        boombox.style.setProperty("--radio-body", state.radioColors.body);
        boombox.style.setProperty("--radio-speaker", state.radioColors.speaker);
        boombox.style.setProperty("--radio-handle", state.radioColors.handle);
        boombox.style.setProperty("--radio-buttons", state.radioColors.buttons);
        boombox.style.setProperty("--radio-detail", state.radioColors.detail);
    }

    // Shelf styling
    const shelf = document.querySelector(".shelf");
    if (shelf && state.shelfColor) {
        shelf.style.setProperty("--shelf-wood", state.shelfColor);
    }
}

function renderShelf() {
    const container = document.getElementById("playlist-spines");
    if (!container) return;
    container.innerHTML = "";

    state.playlists.forEach((pl, index) => {
        const spine = document.createElement("div");
        spine.className = "playlist-spine";
        spine.style.background = pl.color;
        spine.textContent = pl.name;
        spine.dataset.playlistId = pl.id;
        spine.dataset.playlistIndex = index;
        spine.title = `Open ${pl.name}`;
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

export function updateWizardColor(color) {
    ["wizard-sidebar-label", "wizard-color-label", "wizard-songs-label"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.background = color || "#f4a0a0";
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

// ─── Radio customizer ─────────────────────────────────────────────────────────
export function renderRadioCustomizer() {
    // Sync color inputs with state
    const ids = { body: "radio-color-body", speaker: "radio-color-speaker", handle: "radio-color-handle", buttons: "radio-color-buttons", detail: "radio-color-detail" };
    for (const [key, id] of Object.entries(ids)) {
        const el = document.getElementById(id);
        if (el) el.value = state.radioColors[key];
    }

    // Render preset chips
    const presetRow = document.getElementById("radio-presets");
    if (presetRow) {
        presetRow.innerHTML = "";
        RADIO_PRESETS.forEach((preset, i) => {
            const chip = document.createElement("div");
            chip.className = "preset-chip";
            chip.dataset.presetIndex = i;
            chip.innerHTML = `<div class="preset-dot" style="background:${preset.body}"></div><div class="preset-dot" style="background:${preset.speaker}"></div><span>${preset.name}</span>`;
            presetRow.appendChild(chip);
        });
    }
}

// ─── Shelf customizer ─────────────────────────────────────────────────────────
export function renderShelfCustomizer() {
    const el = document.getElementById("shelf-color-main");
    if (el) el.value = state.shelfColor;
}

// ─── Frame picker ─────────────────────────────────────────────────────────────
export function renderFramePicker() {
    const grid = document.getElementById("frame-picker-grid");
    if (!grid) return;
    grid.innerHTML = "";

    FRAME_IMAGES.forEach((file, i) => {
        const card = document.createElement("div");
        card.className = "picker-card" + (i === state.profile.frame ? " selected" : "");
        card.dataset.frameIndex = i;

        const img = document.createElement("img");
        img.src = `./photos/frames/${file}`;
        img.alt = `Frame style ${i + 1}`;

        card.appendChild(img);
        grid.appendChild(card);
    });
}

// ─── Song search results ──────────────────────────────────────────────────────
export function renderSongSearch(query, songLibrary = []) {
    const results = document.getElementById("song-search-results");
    if (!results) return;
    results.innerHTML = "";

    const q = query.trim().toLowerCase();
    const filtered = q
        ? songLibrary.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.artist.toLowerCase().includes(q)
        )
        : songLibrary;

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
