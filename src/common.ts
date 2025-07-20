import { setDarkMode } from "./module/dark_mode.js";
import { highlightBrokenLinks } from "./module/broken_links.js";

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
            //{ name: 'Blog', path: '/blog' },
            { name: 'Gallery', path: '/gallery' },
            // { name: 'Contact', path: '/contact' },
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

function darkModeOnLoad() {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.style.transition = "none";
        setDarkMode(true);
        setTimeout(() => {
            document.body.style.transition = "background-color 0.4s ease, color 0.4s ease";
        }, 50);
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    darkModeOnLoad();
    highlightBrokenLinks();
    loadCommonHTML();
    lazyLoadImages();
});