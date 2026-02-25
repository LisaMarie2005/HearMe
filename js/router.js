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
