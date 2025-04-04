// HTML Stuff
function loadCommonHTML() {
    var topbar = document.getElementById("topbar");

    if (!topbar) {
        console.warn("Could not find the topbar!")
    } else {
        topbar.setHTMLUnsafe( 
        '<h1>Project Keen Sword</h1>' +
        '<ul class="topbar-selector">' +
        '    <li class="topbar-selector-item"><a class="topbar-selector-item-link" href="/">Home</a></li>' +
        '    <li class="topbar-selector-item"><a class="topbar-selector-item-link" href="/blog">Blog</a></li>' +
        '    <li class="topbar-selector-item"><a class="topbar-selector-item-link" href="/gallery">Gallery</a></li>' +
        '    <li class="topbar-selector-item"><a class="topbar-selector-item-link" href="/contact">Contact</a></li>' +
        '    <li class="topbar-selector-item"><a class="topbar-selector-item-link" href="/characters">Characters</a></li>' +
        '    <li class="topbar-selector-item"><a class="topbar-selector-item-link" href="/nations">Nations</a></li>' +
        `    <div><button class="mode-change-button" onclick="toggleDarkMode()"><span id="darkModeButton" class="material-symbols-outlined" style="font-size: 1.75em">dark_mode</span></button></div>` +
        '</ul>');
    }
}

// Dark Mode
function setDarkMode(enable) {
    const button = document.getElementById("darkModeButton");

    if (enable) {
        document.documentElement.style.setProperty('--col-bg', '#1a1a1a');
        document.documentElement.style.setProperty('--col-bg-2', '#222222');
        document.documentElement.style.setProperty('--col-fg', '#e0e0e0');
        localStorage.setItem('darkMode', 'enabled');
        button.innerHTML = "light_mode";
    } else {
        document.documentElement.style.setProperty('--col-bg', '#f4f0e8');
        document.documentElement.style.setProperty('--col-bg-2', '#dedad2');
        document.documentElement.style.setProperty('--col-fg', '#111111');
        localStorage.setItem('darkMode', 'disabled');
        button.innerHTML = "dark_mode";
    }
}

function toggleDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    setDarkMode(!isDarkMode);
}


// Main
function main() {
    console.log("Loading common HTML elements")
    loadCommonHTML();

    console.log("Toggeling Dark Mode")
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.style.transition = "none";
        setDarkMode(true);
        setTimeout(() => {
            document.body.style.transition = "background-color 0.4s ease, color 0.4s ease";
        }, 50);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    main();
});