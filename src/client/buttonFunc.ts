var carouselState = new WeakMap();

function goBack(): void {
    history.back();
}
function goHomeOrDropdown(): void {
    const selector = document.getElementById("topbar-selector")

    if (!selector) {
        window.location.assign("https://keen-sword.net");
        return;
    }

    const style = getComputedStyle(selector)
    if (style.display === "flex")
        window.location.assign("https://keen-sword.net");
    else if (style.display === "none")
        selector.style.display = "block";
    else
        selector.style.display = "none";
}

function findOrCreateLightbox(): HTMLElement {
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

    document.getElementById("content")!.appendChild(lightbox);
    return lightbox;
}
function createLightbox(): void {
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

    document.getElementById("content")!.appendChild(lightbox);
}
function openLightbox(imageSrc: string): void {
    createLightbox();

    const lightbox = document.getElementById("lightbox")!;
    const img = lightbox.querySelector("img")!;

    img.src = imageSrc;
    lightbox.classList.add("show");
}

function changeSlide(button: HTMLElement, direction: number) {
    const parent = button.parentElement!;
    const container = parent.querySelector(".gallery-carousel-container")! as HTMLDivElement;
    const slides = parent.querySelectorAll(".gallery-carousel-image")!;

    if (!carouselState.has(container))
        carouselState.set(container, 0);

    let currentSlide = carouselState.get(container);
    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    carouselState.set(container, currentSlide);
    container.style.transform = `translateX(-${currentSlide * 100}%)`;
}