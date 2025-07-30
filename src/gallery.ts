import { ButtonManager, ButtonState } from "./module/button.js";

var searchMode = true;

// Search bar
function toggleSearchMode(): void {
    if (searchMode)
        searchMode = false;
    else
        searchMode = true;

    searchBarSearch();
}

function createAndCopyLink(): void {
    const searchBar = document.getElementById("search-input")! as HTMLInputElement;
    const baseUrl = "https://keen-sword.net/gallery";
    const query = encodeURIComponent(searchBar.value.trim());
    const logic = searchMode ? "true" : "false";

    const fullUrl = `${baseUrl}?v=1&q=${query}&e=${logic}`;

    navigator.clipboard.writeText(fullUrl)
        .then(() => {
            alert("Link copied to clipboard.");
        })
        .catch(err => {
            console.error("Failed to copy link: ", err);
        });
}

function hasMatch(content: string, positiveTerms: string[]): boolean {
    if (positiveTerms.length === 0)
        return true;

    if (searchMode)
        return positiveTerms.some(term => content.includes(term));
    else
        return positiveTerms.every(term => content.includes(term));
}

function searchBarSearch(): void {
    const searchBar = document.getElementById("search-input") as HTMLInputElement;
    const searchTerm = searchBar.value.toLowerCase().trim();

    const terms = searchTerm.split(";").map(term => term.trim()).filter(term => term.length > 0);
    const positiveTerms = terms.filter(term => !term.startsWith("-"));
    const negativeTerms = terms.filter(term => term.startsWith("-")).map(term => term.slice(1).trim());

    const galleryItems = document.querySelectorAll(".lazy-image-wrapper");

    galleryItems.forEach(rawItem => {
        let content = ""
        let item = rawItem as HTMLDivElement;

        if (item.dataset.imgtype === "carousel") {
            const caption = item.querySelector("p")!.textContent?.toLowerCase();
            const container = item.querySelector(".gallery-carousel-container") as HTMLDivElement;
            const keywords = container.dataset.keywords?.toLowerCase();

            content = `${caption} ${keywords}`;
        } else if (item.dataset.imgtype === "single") {
            const caption = item.querySelector("p")!.textContent?.toLowerCase();
            const alt = item.querySelector("img")!.alt.toLowerCase();
            const keywords = item.querySelector("img")!.dataset.keywords?.toLowerCase();

            content = `${caption} ${alt} ${keywords}`;
        }

        const matchesPositive = hasMatch(content, positiveTerms);
        const matchesNegative = negativeTerms.some(term => content.includes(term));

        if (matchesPositive && !matchesNegative)
            item.style.display = "";
        else
            item.style.display = "none";
    });
}

function addSearchBar(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const searchVersion = urlParams.get("v") ?? "";
    const searchQuery = urlParams.get("q") ?? "";
    const searchType = urlParams.get("e") ?? "";
    const searchBar = document.getElementById("search-input") as HTMLInputElement;

    if (searchType.toLowerCase() === "false")
        toggleSearchMode();

    searchBar.value = searchQuery;
    searchBar.addEventListener("input", searchBarSearch);
    searchBarSearch();
}

function addButtons(): void {
    const container = document.getElementById("search-bar-container");

    if (!container)
        return;

    const shareButton = document.createElement("button");
    const searchModeButton = document.createElement("button");

    new ButtonManager(container, shareButton, [
        new ButtonState("share", "Share", true, createAndCopyLink)
    ]);
    new ButtonManager(container, searchModeButton, [
        new ButtonState("graph_6", "Exclusive Search", true, toggleSearchMode),
        new ButtonState("graph_5", "Inclusive Search", true, toggleSearchMode)
    ]);
}

function deleteNoScript() {
    console.log("Deleting Noscript");
    const noScriptElements = document.querySelectorAll("noscript")
    noScriptElements.forEach((element) => {
        element.remove();
    })
}

document.addEventListener("DOMContentLoaded", async function() {
    deleteNoScript();
    addButtons();
    addSearchBar();
});