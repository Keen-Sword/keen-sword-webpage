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

// Gallery
function hasMatch(content: string, positiveTerms: string[]): boolean {
    if (positiveTerms.length === 0)
        return true;
    return positiveTerms.every(term => content.includes(term));
}
function searchBarSearch(): void {
    const searchBar = document.getElementById("search-input") as HTMLInputElement;
    const searchTerm = searchBar.value.toLowerCase().trim();

    const terms = searchTerm.split(";").map(term => term.trim()).filter(term => term.length > 0);
    const positiveTerms = terms.filter(term => !term.startsWith("-"));
    const negativeTerms = terms.filter(term => term.startsWith("-")).map(term => term.slice(1).trim());

    const galleryItems = document.querySelectorAll(".lazy-image-wrapper");

    galleryItems.forEach(rawItem => {
        let item = rawItem as HTMLDivElement;
        let content = item.querySelector("img")!.dataset.keywords?.toLowerCase() ?? "";

        const matchesPositive = hasMatch(content, positiveTerms);
        const matchesNegative = negativeTerms.some(term => content.includes(term));

        if (matchesPositive && !matchesNegative)
            item.style.display = "";
        else
            item.style.display = "none";
    });
}
function addSearchBar(): void {
    const searchBar = document.getElementById("search-input") as HTMLInputElement;
    searchBar.addEventListener("input", searchBarSearch);

    const container = document.getElementById("search-bar-container");
    if (!container)
        return;

    searchBarSearch();
}

document.addEventListener("DOMContentLoaded", async function() {
    lazyLoadImages();
    addSearchBar();
});