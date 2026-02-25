import { getInitialState, sanitizePage } from "./params.js";

export const state = getInitialState();

// ─── Page navigation ─────────────────────────────────────────────────────────
export function setPage(page) {
    state.page = sanitizePage(page);
}

// ─── Playlist helpers ─────────────────────────────────────────────────────────
export function addPlaylist(name = "Playlist", color = "#f4a0a0") {
    const id = `pl-${Date.now()}`;
    state.playlists.push({ id, name, color, songs: [] });
    return id;
}

export function updatePlaylist(id, patch) {
    const pl = state.playlists.find((p) => p.id === id);
    if (pl) Object.assign(pl, patch);
}

export function removePlaylist(id) {
    state.playlists = state.playlists.filter((p) => p.id !== id);
}

export function getPlaylist(id) {
    return state.playlists.find((p) => p.id === id) ?? null;
}

// ─── Active wizard playlist ───────────────────────────────────────────────────
export function startNewPlaylist() {
    // Prepare a temporary "draft" playlist object in state
    state.draft = { name: "New Playlist", color: "#f4a0a0", songs: [] };
}

export function commitDraft() {
    if (!state.draft) return;
    const id = `pl-${Date.now()}`;
    state.playlists.push({ id, ...state.draft });
    state.draft = null;
    return id;
}

export function discardDraft() {
    state.draft = null;
}

// ─── Songs ───────────────────────────────────────────────────────────────────
export function addSongToDraft(song) {
    if (!state.draft) return;
    if (!state.draft.songs.find((s) => s.id === song.id)) {
        state.draft.songs.push(song);
    }
}

export function removeSongFromDraft(songId) {
    if (!state.draft) return;
    state.draft.songs = state.draft.songs.filter((s) => s.id !== songId);
}

// ─── Background ──────────────────────────────────────────────────────────────
export function setBgColor(color) {
    state.bgColor = color;
    state.bgImage = null;
}

export function setBgImage(dataUrl) {
    state.bgImage = dataUrl;
}

// ─── Profile ─────────────────────────────────────────────────────────────────
export function setProfile(patch) {
    Object.assign(state.profile, patch);
}
