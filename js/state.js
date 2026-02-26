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

// ─── Radio colors ────────────────────────────────────────────────────────────
export function setRadioColors(colors) {
    Object.assign(state.radioColors, colors);
}

// ─── Frame ───────────────────────────────────────────────────────────────────
export function setFrame(index) {
    state.profile.frame = index;
}

// ─── Shelf ───────────────────────────────────────────────────────────────────
export function setShelfColor(color) {
    state.shelfColor = color;
}

// ─── Hydrate from shared data ────────────────────────────────────────────────
export function hydrateState(shared) {
    if (shared.profile) Object.assign(state.profile, shared.profile);
    if (shared.bgColor) state.bgColor = shared.bgColor;
    if (shared.radioColors) Object.assign(state.radioColors, shared.radioColors);
    if (shared.shelfColor) state.shelfColor = shared.shelfColor;
    if (shared.playlists && shared.playlists.length) state.playlists = shared.playlists;
}

// ─── Player state ────────────────────────────────────────────────────────────
state.player = {
    currentSong: null,
    isPlaying: false,
    currentPlaylistIndex: -1,
    currentSongIndex: -1,
};

export function playSong(song, playlistIndex = -1, songIndex = -1) {
    state.player.currentSong = song;
    state.player.isPlaying = true;
    state.player.currentPlaylistIndex = playlistIndex;
    state.player.currentSongIndex = songIndex;
}

export function togglePlayPause() {
    if (!state.player.currentSong) return;
    state.player.isPlaying = !state.player.isPlaying;
}

export function playNext() {
    const pi = state.player.currentPlaylistIndex;
    if (pi < 0 || pi >= state.playlists.length) return;
    const pl = state.playlists[pi];
    if (!pl || !pl.songs.length) return;
    let si = state.player.currentSongIndex + 1;
    if (si >= pl.songs.length) si = 0; // loop
    state.player.currentSongIndex = si;
    state.player.currentSong = pl.songs[si];
    state.player.isPlaying = true;
}

export function playPrev() {
    const pi = state.player.currentPlaylistIndex;
    if (pi < 0 || pi >= state.playlists.length) return;
    const pl = state.playlists[pi];
    if (!pl || !pl.songs.length) return;
    let si = state.player.currentSongIndex - 1;
    if (si < 0) si = pl.songs.length - 1; // loop
    state.player.currentSongIndex = si;
    state.player.currentSong = pl.songs[si];
    state.player.isPlaying = true;
}
