let searchMode = true;

function lazyLoadImages() {
    const images = document.querySelectorAll('img.lazy');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting)
                return;

            const img = entry.target;
            const wrapper = img.closest('.gallery-wrapper');

            img.src = img.dataset.src;
            img.onload = () => {
                img.style.opacity = 1;
                const spinner = wrapper.querySelector('.spinner');
                if (spinner) spinner.remove();
            };

            img.classList.remove("lazy");
            observer.unobserve(img);
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

function toggleSearchMode() {
    const searchLogicButon = document.getElementById('search-logic');
    
    if (searchMode) {
        searchMode = false;
        searchLogicButon.style.backgroundColor = "var(--col-bg-2)";
    }
    else {
        searchMode = true;
        searchLogicButon.style.backgroundColor = "var(--col-accent-1)";
    }

    searchBarSearch();
}

function createAndCopyLink() {
    const searchBar = document.getElementById('search-input');
    const searchLogicButon = document.getElementById('search-logic');
    
    const baseUrl = "https://keen-sword.net/gallery";
    const query = encodeURIComponent(searchBar.value.trim());
    const logic = searchLogicButon.checked ? "false" : "true";

    const fullUrl = `${baseUrl}?v=1&q=${query}&e=${logic}`;

    navigator.clipboard.writeText(fullUrl)
        .then(() => {
            alert("Link copied to clipboard.");
        })
        .catch(err => {
            console.error("Failed to copy link: ", err);
        });
}


function hasMatch(content, positiveTerms) {
    if (positiveTerms.length === 0)
        return true;

    console.log(searchMode)
    if (searchMode)
        return positiveTerms.some(term => content.includes(term))
    return positiveTerms.every(term => content.includes(term))
}

function searchBarSearch() {
    const searchBar = document.getElementById('search-input');
    const searchTerm = searchBar.value.toLowerCase().trim();

    const terms = searchTerm.split(';').map(term => term.trim()).filter(term => term.length > 0);
    const positiveTerms = terms.filter(term => !term.startsWith('-'));
    const negativeTerms = terms.filter(term => term.startsWith('-')).map(term => term.slice(1).trim());

    const galleryItems = document.querySelectorAll('.gallery-wrapper');

    galleryItems.forEach(item => {
        const caption = item.querySelector('p').textContent.toLowerCase();
        const alt = item.querySelector('img').alt.toLowerCase();
        const keywords = item.querySelector('img').dataset.keywords.toLowerCase();
        const content = `${caption} ${alt} ${keywords}`;

        const matchesPositive = hasMatch(content, positiveTerms);
        const matchesNegative = negativeTerms.some(term => content.includes(term));

        if (matchesPositive && !matchesNegative) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function addSearchBar() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchVersion = urlParams.get("v") ?? "";
    const searchQuery = urlParams.get("q") ?? "";
    const searchType = urlParams.get("e") ?? "";
    const searchBar = document.getElementById('search-input');

    if (searchType.toLowerCase() == "false") {
        toggleSearchMode();
    }

    searchBar.value = searchQuery;
    searchBar.addEventListener('input', searchBarSearch);
    searchBarSearch();
}


document.addEventListener("DOMContentLoaded", function() {
    addSearchBar();
    lazyLoadImages();
});