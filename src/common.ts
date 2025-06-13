import { setDarkMode } from "./module/dark_mode.js";

// HTML Stuff
function loadCommonHTML(): void {
    const topbar = document.getElementById("topbar");

    if (!topbar) {
        console.warn("Could not find the topbar!")
    } else {
        const heading = document.createElement('h1');
        heading.textContent = 'Project Keen Sword';
        heading.onclick = goHomeOrDropdown;

        const nav = document.createElement('nav');
        nav.id = 'topbar-selector';
        nav.className = 'topbar-selector';

        const links = [
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: 'Gallery', path: '/gallery' },
            { name: 'Contact', path: '/contact' },
            { name: 'Characters', path: '/characters' },
            { name: 'Nations', path: '/nations' },
            { name: 'Settings', path: '/settings' }
        ];

        links.forEach(link => {
        const li = document.createElement('li');
        li.className = 'topbar-selector-item';

        const a = document.createElement('a');
        a.className = 'topbar-selector-item-link';
        a.href = link.path;
        a.textContent = link.name;

        li.appendChild(a);
            nav.appendChild(li);
        });

        topbar.innerHTML = '';
        topbar.appendChild(heading);
        topbar.appendChild(nav);
    }
}

// Broken Links
function highlightBrokenLinks(): void {
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

// Lazy Load
function lazyLoadImages(): void {
    const images = document.querySelectorAll("img.lazy");

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting)
                return;

            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src ?? "";
            img.classList.remove("lazy");

            img.onload = () => {
                img.style.opacity = "1";

                const spinnerContainer = img.closest(".lazy-image-wrapper")!.querySelector(".spinner-container");
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
        img.parentElement?.insertBefore(spinnerContainer, img.parentElement.firstChild)
    });
}

// Text Aids
function japaneseTextReadability(): void {
    let fontDownloaded = false;

    document.querySelectorAll("p, li").forEach(paragraph => {
        const originalText = paragraph.textContent ?? "";
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
function main(): void {
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

    console.log("Improving Hiragana and Katakana..")
    japaneseTextReadability();

    console.log("Adding lazy loading images..")
    lazyLoadImages();
}

document.addEventListener("DOMContentLoaded", function() {
    main();
});