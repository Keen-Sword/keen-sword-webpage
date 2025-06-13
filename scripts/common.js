"use strict";

// HTML Stuff
function loadCommonHTML() {
    let topbar = document.getElementById("topbar");

    if (!topbar) {
        console.warn("Could not find the topbar!")
    } else {
        topbar.setHTMLUnsafe(
        "<h1 onclick='goHomeOrDropdown()'>Project Keen Sword</h1>" +
        "<nav id='topbar-selector' class='topbar-selector'>" +
        "    <li class='topbar-selector-item'><a class='topbar-selector-item-link' href='/'>Home</a></li>" +
        "    <li class='topbar-selector-item'><a class='topbar-selector-item-link' href='/blog'>Blog</a></li>" +
        "    <li class='topbar-selector-item'><a class='topbar-selector-item-link' href='/gallery'>Gallery</a></li>" +
        "    <li class='topbar-selector-item'><a class='topbar-selector-item-link' href='/contact'>Contact</a></li>" +
        "    <li class='topbar-selector-item'><a class='topbar-selector-item-link' href='/characters'>Characters</a></li>" +
        "    <li class='topbar-selector-item'><a class='topbar-selector-item-link' href='/nations'>Nations</a></li>" +
        "    <div><button class='mode-change-button' onclick='toggleDarkMode()'><span id='darkModeButton' class='material-symbols-outlined' style='font-size: 1.75em'>dark_mode</span></button></div>" +
        "</nav>");
    }
}

// Dark Mode
function setDarkMode(enable) {
    const button = document.getElementById("darkModeButton");

    if (enable) {
        document.documentElement.style.setProperty("--col-bg", "#1a1a1a");
        document.documentElement.style.setProperty("--col-bg-2", "#222222");
        document.documentElement.style.setProperty("--col-fg", "#e0e0e0");
        localStorage.setItem("darkMode", "enabled");
        button.innerHTML = "light_mode";
    } else {
        document.documentElement.style.setProperty("--col-bg", "#f4f0e8");
        document.documentElement.style.setProperty("--col-bg-2", "#dedad2");
        document.documentElement.style.setProperty("--col-fg", "#111111");
        localStorage.setItem("darkMode", "disabled");
        button.innerHTML = "dark_mode";
    }
}

// Broken Links
function highlightBrokenLinks() {
    document.querySelectorAll("a").forEach(link => {
        if (!link.href)
            return;
        if (link.classList.contains("topbar-selector-item-link"))
            return;

        const linkUrl = new URL(link.href, location.href);
        if (linkUrl.origin !== location.origin)
            return;

        fetch(link.href, { method: "HEAD" })
            .then(res => {
                if (!res.ok)
                    link.classList.add("broken-link");
            })
            .catch(() => {
                link.classList.add("broken-link");
            });
    });
}

// Button Stuff
function toggleDarkMode() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    setDarkMode(!isDarkMode);
}
function goBack() {
    history.back();
}
function goHomeOrDropdown() {
    const selector = document.getElementById("topbar-selector")

    if (!selector)
        window.location.assign("https://keen-sword.net");

    const style = getComputedStyle(selector)
    if (style.display === "flex")
        window.location.assign("https://keen-sword.net");
    else if (style.display === "none")
        selector.style.display = "block";
    else
        selector.style.display = "none";
}
function findOrCreateLightbox() {
    const oldLightbox = document.getElementById("lightbox");
    if (oldLightbox)
        return oldLightbox;

    const lightbox = document.createElement("div");
    const lightboxImg = document.createElement("img");
    lightbox.id = "lightbox";
    lightboxImg.id = "lightbox-img";
    lightbox.className = "lightbox";

    lightbox.appendChild(lightboxImg);
    lightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    document.getElementById("content").appendChild(lightbox);
    return lightbox;
}
function createLightbox() {
    if (document.getElementById("lightbox"))
        return;

    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = "lightbox";

    const img = document.createElement("img");
    lightbox.appendChild(img);

    lightbox.addEventListener("click", () => {
        lightbox.classList.remove("show");
        img.src = "";
    });

    document.getElementById("content").appendChild(lightbox);
}
function openLightbox(imageSrc) {
    createLightbox();

    const lightbox = document.getElementById("lightbox");
    const img = lightbox.querySelector("img");

    img.src = imageSrc;
    lightbox.classList.add("show");
}

// Lazy Load
function lazyLoadImages() {
    const images = document.querySelectorAll("img.lazy");

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting)
                return;

            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");

            img.onload = () => {
                img.style.opacity = 1;

                const spinnerContainer = img.closest(".lazy-image-wrapper").querySelector(".spinner-container");
                if (spinnerContainer)
                    spinnerContainer.remove();
            };

            observer.unobserve(img);
        });
    });

    images.forEach(img => {
        const wrapper = img.closest(".lazy-image-wrapper");
        if (!wrapper) {
            console.warn("Could not find a container for a lazy loading image!")
            return
        }

        imageObserver.observe(img);
        if (img.classList.contains("lazy-spinnerless"))
            return

        const spinnerContainer = document.createElement("div")
        const spinner = document.createElement("div")
        spinner.className = "spinner"
        spinnerContainer.className = "spinner-container"
        spinnerContainer.appendChild(spinner)
        img.parentElement.insertBefore(spinnerContainer, img.parentElement.firstChild)
    });
}

// Text Aids
function japaneseTextReadability() {
    let fontDownloaded = false;

    document.querySelectorAll("p, li").forEach(paragraph => {
        const originalText = paragraph.textContent;
        const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g;
        let modified = false;

        const newHTML = originalText.replace(japaneseRegex, match => {
            modified = true;
            return `<span class="jp">${match}</span>`;
        });

        if (modified) {
            paragraph.innerHTML = newHTML;

            if (!fontDownloaded) {
                const link = document.createElement("link");
                link.href = "https://fonts.googleapis.com/css?family=Noto+Sans+JP:400";
                link.rel = "stylesheet";
                document.head.appendChild(link);
                fontDownloaded = true;
            }
        }
    });
}

// Main
function main() {
    console.log("Loading common HTML elements..");
    loadCommonHTML();

    console.log("Toggeling Dark Mode..");
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.style.transition = "none";
        setDarkMode(true);
        setTimeout(() => {
            document.body.style.transition = "background-color 0.4s ease, color 0.4s ease";
        }, 50);
    }

    console.log("Highlighting broken links..");
    highlightBrokenLinks();

    console.log("Improving CJK readability..")
    japaneseTextReadability();

    console.log("Adding lazy loading images..")
    lazyLoadImages();
}


document.addEventListener("DOMContentLoaded", function() {
    main();
});