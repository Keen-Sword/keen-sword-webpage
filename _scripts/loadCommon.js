function main() {
    console.log("Loading common HTML elements")

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
        '</ul>');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    main();
});