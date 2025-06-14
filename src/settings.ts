import { ButtonManager, ButtonState } from "./module/button.js";
import { setDarkMode } from "./module/dark_mode.js";

function toggleDarkMode(): void {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    setDarkMode(!isDarkMode);
}

function toggleLinkChecking(): void {
    const isLinkChecking = localStorage.getItem("linkChecking") === "enabled";
    if (isLinkChecking)
        localStorage.setItem("linkChecking", "disabled");
    else
        localStorage.setItem("linkChecking", "enabled");
}

function addSettingButtons() {
    const darkModeButtonContainer = document.getElementById("dark-mode-container")!;
    const darkModeButton = document.createElement("button");

    const linkCheckerButtonContainer = document.getElementById("link-check-container")!;
    const linkCheckerButton = document.createElement("button");

    new ButtonManager(darkModeButtonContainer, darkModeButton, [
        new ButtonState("light_mode", "Light Mode", true, toggleDarkMode),
        new ButtonState("dark_mode", "Dark Mode", true, toggleDarkMode)
    ]).setState(localStorage.getItem("darkMode") === "enabled" ? 1 : 0);
    new ButtonManager(linkCheckerButtonContainer, linkCheckerButton, [
        new ButtonState("link", "Check for broken link", true, toggleLinkChecking),
        new ButtonState("link_off", "Do not check for broken links", false, toggleLinkChecking)
    ]).setState(localStorage.getItem("linkChecking") === "enabled" ? 0 : 1);
}

document.addEventListener("DOMContentLoaded", function() {
    addSettingButtons();
});