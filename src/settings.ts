import { ButtonManager, ButtonState } from "./module/button.js";
import { setDarkMode } from "./module/dark_mode.js";

function toggleDarkMode(): void {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    setDarkMode(!isDarkMode);
}

function addSettingButtons() {
    const darkModeButtonContainer = document.getElementById("dark-mode-container")!;
    const darkModeButton = document.createElement("button");

    new ButtonManager(darkModeButtonContainer, darkModeButton, [
        new ButtonState("light_mode", true, toggleDarkMode),
        new ButtonState("dark_mode", true, toggleDarkMode)
    ]);
}

document.addEventListener("DOMContentLoaded", function() {
    addSettingButtons();
});