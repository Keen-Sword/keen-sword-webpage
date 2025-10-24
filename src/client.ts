var carouselState = new WeakMap();

function createLightbox(): void {
    if (document.getElementById("lightbox"))
        return;

    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = "lightbox";

    const img = document.createElement("img");
    lightbox.appendChild(img);

    // --- Buttons container ---
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "lightbox-buttons";

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "🡻";
    downloadBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent closing the lightbox

        const link = document.createElement("a");
        link.href = img.src;
        link.download = img.src.split("/").pop() || "image";
        link.click();
    });

    const shareBtn = document.createElement("button");
    shareBtn.textContent = "➦";
    shareBtn.addEventListener("click", async (e) => {
        e.stopPropagation(); // prevent closing the lightbox

        const location = img.src.split("/");
        const shareUrl = `/s/${location[location.length - 1].replace(".png", "")}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: "Share Image", url: shareUrl });
            } catch (err) {
                console.error("Share cancelled or failed:", err);
            }
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert("Embed link copied to clipboard!");
            });
        }
    });

    buttonContainer.appendChild(downloadBtn);
    buttonContainer.appendChild(shareBtn);
    lightbox.appendChild(buttonContainer);

    // Click to close
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