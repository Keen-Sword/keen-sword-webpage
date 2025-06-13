export function setDarkMode(enable: boolean): void {
    if (enable) {
        document.documentElement.style.setProperty("--col-bg", "#1a1a1a");
        document.documentElement.style.setProperty("--col-bg-2", "#222222");
        document.documentElement.style.setProperty("--col-fg", "#e0e0e0");
        localStorage.setItem("darkMode", "enabled");
    } else {
        document.documentElement.style.setProperty("--col-bg", "#f4f0e8");
        document.documentElement.style.setProperty("--col-bg-2", "#dedad2");
        document.documentElement.style.setProperty("--col-fg", "#111111");
        localStorage.setItem("darkMode", "disabled");
    }
}