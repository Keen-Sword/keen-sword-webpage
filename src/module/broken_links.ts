export function highlightBrokenLinks(): void {
    if (localStorage.getItem("linkChecking") === "disabled")
        return;

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