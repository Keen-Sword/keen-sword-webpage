"use strict";
var searchMode = true;
var carouselState = new WeakMap();

function toggleSearchMode() {
    const searchLogicButon = document.getElementById("search-logic");

    if (searchMode) {
        searchMode = false;
        searchLogicButon.style.backgroundColor = "var(--col-bg-2)";
    }
    else {
        searchMode = true;
        searchLogicButon.style.backgroundColor = "var(--col-accent-1)";
    }

    searchBarSearch();
}

function createAndCopyLink() {
    const searchBar = document.getElementById("search-input");
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

function hasMatch(content, positiveTerms) {
    if (positiveTerms.length === 0)
        return true;

    console.log(searchMode)
    if (searchMode)
        return positiveTerms.some(term => content.includes(term));
    else
        return positiveTerms.every(term => content.includes(term));
}

function searchBarSearch() {
    const searchBar = document.getElementById("search-input");
    const searchTerm = searchBar.value.toLowerCase().trim();

    const terms = searchTerm.split(";").map(term => term.trim()).filter(term => term.length > 0);
    const positiveTerms = terms.filter(term => !term.startsWith("-"));
    const negativeTerms = terms.filter(term => term.startsWith("-")).map(term => term.slice(1).trim());

    const galleryItems = document.querySelectorAll(".lazy-image-wrapper");

    galleryItems.forEach(item => {
        let content = ""
        if (item.dataset.imgtype === "carousel") {
            const caption = item.querySelector("p").textContent.toLowerCase();
            const keywords = item.querySelector(".gallery-carousel-container").dataset.keywords.toLowerCase();

            content = `${caption} ${keywords}`;
        } else if (item.dataset.imgtype === "single") {
            const caption = item.querySelector("p").textContent.toLowerCase();
            const alt = item.querySelector("img").alt.toLowerCase();
            const keywords = item.querySelector("img").dataset.keywords.toLowerCase();
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

function addSearchBar() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchVersion = urlParams.get("v") ?? "";
    const searchQuery = urlParams.get("q") ?? "";
    const searchType = urlParams.get("e") ?? "";
    const searchBar = document.getElementById("search-input");

    if (searchType.toLowerCase() === "false")
        toggleSearchMode();

    searchBar.value = searchQuery;
    searchBar.addEventListener("input", searchBarSearch);
    searchBarSearch();
}

// Caruousel images
function changeSlide(button, direction) {
    const parent = button.parentElement;
    const container = parent.querySelector(".gallery-carousel-container");
    const slides = parent.querySelectorAll(".gallery-carousel-image");

    if (!carouselState.has(container))
        carouselState.set(container, 0);

    let currentSlide = carouselState.get(container);
    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    carouselState.set(container, currentSlide);
    container.style.transform = `translateX(-${currentSlide * 100}%)`;
}

document.addEventListener("DOMContentLoaded", function() {
    addSearchBar();
});