import { navigateTo, onPopState } from "./router.js";
import {
    state,
    setPage,
    startNewPlaylist,
    commitDraft,
    addSongToDraft,
    removeSongFromDraft,
    setBgColor,
    setBgImage,
    setProfile,
} from "./state.js";
import {
    renderPage,
    renderRoom,
    renderPlaylistColorGrid,
    renderBgColorGrid,
    renderSongSearch,
    renderEditPlaylist,
    updateWizardLabels,
} from "./render.js";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function goTo(page) {
    const safe = navigateTo(page);
    setPage(safe);
    renderAll();
}

function renderAll() {
    renderPage(state.page);
    if (state.page === "room") {
        renderRoom();
    } else if (state.page === "playlist-color") {
        renderPlaylistColorGrid(state.draft?.color ?? "#f4a0a0");
    } else if (state.page === "playlist-songs") {
        renderSongSearch("");
        renderEditPlaylist();
    } else if (state.page === "bg-picker") {
        renderBgColorGrid(state.bgColor);
    }
}

// ─── Global click delegation ───────────────────────────────────────────────────
document.addEventListener("click", (e) => {

    // ── Nav buttons (data-nav attribute) ──────────────────────────────────────
    const navEl = e.target.closest("[data-nav]");
    if (navEl) {
        e.preventDefault();
        const target = navEl.dataset.nav;

        if (target === "playlist-name") {
            startNewPlaylist();
            updateWizardLabels("New Playlist");
            goTo("playlist-name");
            return;
        }

        goTo(target);
        return;
    }

    // ── Add playlist button (shelf) ────────────────────────────────────────────
    if (e.target.id === "btn-add-playlist" || e.target.closest("#btn-add-playlist")) {
        startNewPlaylist();
        updateWizardLabels("New Playlist");
        goTo("playlist-name");
        return;
    }

    // ── Playlist spine click (open edit) ───────────────────────────────────────
    const spine = e.target.closest(".playlist-spine");
    if (spine) {
        // TODO: open edit view for existing playlist
        return;
    }

    // ── Wizard: Name → Next ────────────────────────────────────────────────────
    if (e.target.id === "btn-name-next") {
        const nameInput = document.getElementById("input-playlist-name");
        const name = nameInput?.value.trim() || "New Playlist";
        if (state.draft) state.draft.name = name;
        updateWizardLabels(name);
        goTo("playlist-color");
        return;
    }

    // ── Wizard: Color swatch selected ─────────────────────────────────────────
    const colorSwatch = e.target.closest("[data-playlist-color]");
    if (colorSwatch) {
        const color = colorSwatch.dataset.playlistColor;
        if (state.draft) state.draft.color = color;
        // Update sidebar color
        ["wizard-color-label"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.style.background = color;
        });
        renderPlaylistColorGrid(color);
        return;
    }

    // ── Wizard: Color → Next ───────────────────────────────────────────────────
    if (e.target.id === "btn-color-next") {
        goTo("playlist-songs");
        return;
    }

    // ── Wizard: Add song to draft ──────────────────────────────────────────────
    const addSongBtn = e.target.closest("[data-song-id]");
    if (addSongBtn) {
        const songId = addSongBtn.dataset.songId;
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
        const song = MOCK_SONGS.find((s) => s.id === songId);
        if (song) {
            addSongToDraft(song);
            renderEditPlaylist();
        }
        return;
    }

    // ── Wizard: Remove song from draft ────────────────────────────────────────
    const removeSongBtn = e.target.closest("[data-remove-song-id]");
    if (removeSongBtn) {
        removeSongFromDraft(removeSongBtn.dataset.removeSongId);
        renderEditPlaylist();
        return;
    }

    // ── Wizard: Done (commit + go to room) ────────────────────────────────────
    if (e.target.id === "btn-songs-done") {
        commitDraft();
        goTo("room");
        return;
    }

    // ── BG colour swatch ──────────────────────────────────────────────────────
    const bgSwatch = e.target.closest("[data-bg-color]");
    if (bgSwatch) {
        setBgColor(bgSwatch.dataset.bgColor);
        renderBgColorGrid(state.bgColor);
        document.body.style.background = state.bgColor;
        return;
    }

    // ── Poster area click ─────────────────────────────────────────────────────
    if (e.target.id === "poster-area" || e.target.closest("#poster-area")) {
        document.getElementById("poster-input")?.click();
        return;
    }

    // ── Profile photo click ───────────────────────────────────────────────────
    if (e.target.id === "profile-photo-btn" || e.target.closest("#profile-photo-btn")) {
        document.getElementById("profile-photo-input")?.click();
        return;
    }
});

// ─── Search input ──────────────────────────────────────────────────────────────
document.addEventListener("input", (e) => {
    // Playlist name live-updates the sidebar label
    if (e.target.id === "input-playlist-name") {
        const name = e.target.value || "New Playlist";
        if (state.draft) state.draft.name = name;
        updateWizardLabels(name);
        return;
    }

    // Song search
    if (e.target.id === "song-search-input") {
        renderSongSearch(e.target.value);
        return;
    }
});

// ─── File inputs ───────────────────────────────────────────────────────────────
document.getElementById("bg-image-input")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        setBgImage(ev.target.result);
        document.body.style.background = `url(${ev.target.result}) center/cover no-repeat`;
    };
    reader.readAsDataURL(file);
});

document.getElementById("poster-input")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const area = document.getElementById("poster-area");
        if (area) {
            area.style.backgroundImage = `url(${ev.target.result})`;
            area.style.backgroundSize = "cover";
            area.style.backgroundPosition = "center";
            area.querySelector("span").style.display = "none";
        }
    };
    reader.readAsDataURL(file);
});

document.getElementById("profile-photo-input")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const slot = document.getElementById("profile-photo-btn");
        if (slot) {
            slot.style.backgroundImage = `url(${ev.target.result})`;
            slot.style.backgroundSize = "cover";
            slot.style.backgroundPosition = "center";
            slot.innerHTML = "";
        }
    };
    reader.readAsDataURL(file);
});

// ─── Pop state ─────────────────────────────────────────────────────────────────
onPopState(() => {
    const params = new URLSearchParams(window.location.search);
    setPage(params.get("page") ?? "room");
    renderAll();
});

// ─── Boot ──────────────────────────────────────────────────────────────────────
function init() {
    setPage("room");
    renderAll();
}

init();
