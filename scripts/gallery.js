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

function searchBarSearch() {
    const searchBar = document.getElementById('search-input');
    const searchTerm = searchBar.value.toLowerCase().trim();
    const searchTerms = searchTerm.split(';').map(term => term.trim());
    const galleryItems = document.querySelectorAll('.gallery-wrapper');

    galleryItems.forEach(item => {
        const caption = item.querySelector('p').textContent.toLowerCase();
        const alt = item.querySelector('img').alt.toLowerCase();
        const keywords = item.querySelector('img').dataset.keywords.toLowerCase();
        
        const matchesSearchTerms = searchTerms.some(term => 
            caption.includes(term) || alt.includes(term) || keywords.includes(term)
        );

        if (matchesSearchTerms) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function addSearchBar() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("q") ?? "";
    const searchBar = document.getElementById('search-input');

    searchBar.value = searchQuery;
    searchBar.addEventListener('input', searchBarSearch);
    searchBarSearch();
}


document.addEventListener("DOMContentLoaded", function() {
    addSearchBar();
    lazyLoadImages();
});