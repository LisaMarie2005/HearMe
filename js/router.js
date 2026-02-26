import { sanitizePage } from "./params.js";

export function navigateTo(page) {
    const safe = sanitizePage(page);
    const url = new URL(window.location.href);
    url.searchParams.set("page", safe);
    window.history.pushState({}, "", url);
    return safe;
}

export function onPopState(handler) {
    window.addEventListener("popstate", handler);
}

// ─── Share room via URL ──────────────────────────────────────────────────────

/**
 * Encode the room state into a shareable URL.
 * Uses compact keys to keep the URL reasonable.
 */
export function encodeRoomToURL(state) {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("page", "room");
    url.searchParams.set("shared", "1");

    // Profile
    if (state.profile.name) url.searchParams.set("n", state.profile.name);
    if (state.profile.genre) url.searchParams.set("g", state.profile.genre);
    if (state.profile.bio) url.searchParams.set("b", state.profile.bio);
    url.searchParams.set("f", String(state.profile.frame ?? 0));

    // Radio colors
    if (state.radioColors) {
        url.searchParams.set("rc", JSON.stringify(state.radioColors));
    }

    // Background & Shelf
    url.searchParams.set("bg", state.bgColor);
    if (state.shelfColor) url.searchParams.set("sc", state.shelfColor);

    // Playlists (compact JSON)
    const compactPlaylists = state.playlists.map((pl) => ({
        n: pl.name,
        c: pl.color,
        s: pl.songs.map((s) => ({ n: s.name, a: s.artist, c: s.color, id: s.id })),
    }));
    url.searchParams.set("pl", JSON.stringify(compactPlaylists));

    return url.toString();
}

/**
 * Decode shared room data from URL parameters.
 * Returns null if not a shared URL.
 */
export function decodeRoomFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("shared")) return null;

    const profile = {
        name: params.get("n") || "",
        genre: params.get("g") || "",
        bio: params.get("b") || "",
        photo: null,
        frame: parseInt(params.get("f") || "0", 10),
    };

    let radioColors = null;
    try {
        radioColors = JSON.parse(params.get("rc") || "null");
    } catch {
        radioColors = null;
    }

    const bgColor = params.get("bg") || "#c8e8ed";
    const shelfColor = params.get("sc") || null;

    let playlists = [];
    try {
        const raw = JSON.parse(params.get("pl") || "[]");
        playlists = raw.map((p, i) => ({
            id: `pl-shared-${i}`,
            name: p.n || "Playlist",
            color: p.c || "#f4a0a0",
            songs: (p.s || []).map((s) => ({
                id: s.id || `s-${Math.random().toString(36).slice(2)}`,
                name: s.n,
                artist: s.a,
                color: s.c || "#ccc",
            })),
        }));
    } catch {
        playlists = [];
    }

    return { profile, radioColors, bgColor, shelfColor, playlists };
}

