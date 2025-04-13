var isBlogsKnown = false;
var currentPostId = null;
var highestPostId = null;

async function getBlogPosts() {
    return await fetch("./blog/blog.json", { method: "GET" })
        .then(response => {
            return response.json(); 
        })
        .then(json => {
            if (isBlogsKnown)
                return null;

            isBlogsKnown = true;
            return json;
        });
}

function createNavbar() {
    const navbar = document.getElementById("navbar");

    if (!navbar) {
        console.warn("Could not find the navbar!");
        return;
    }

    const numbers = [];
    const firstPost = 0;
    const lastPost = highestPostId;

    const addItem = (value, isCurrent = false) => {
        numbers.push(
            `<li class="navbar-selector-item${isCurrent ? ' navbar-selected-post' : ''}"><p>${value}</p></li>`
        );
    };

    let navHTML = '<nav class="navbar-selector">';
    navHTML += `<li class="navbar-selector-item"><p>⟨</p></li>`;

    addItem(firstPost, currentPostId === firstPost);

    let middleStart = currentPostId - 2;
    let middleEnd = currentPostId + 2;

    if (middleStart < firstPost + 1) {
        middleEnd += (firstPost + 1 - middleStart);
        middleStart = firstPost + 1;
    }
    if (middleEnd > lastPost - 1) {
        middleStart -= (middleEnd - (lastPost - 1));
        middleEnd = lastPost - 1;
    }

    middleStart = Math.max(middleStart, firstPost + 1);
    middleEnd = Math.min(middleEnd, lastPost - 1);

    if (middleStart > firstPost + 1) {
        numbers.push(`<li class="navbar-selector-item"><p>...</p></li>`);
    }
    for (let i = middleStart; i <= middleEnd; i++) {
        addItem(i, i === currentPostId);
    }

    if (middleEnd < lastPost - 1)
        numbers.push(`<li class="navbar-selector-item"><p>...</p></li>`);
    if (lastPost !== firstPost)
        addItem(lastPost, currentPostId === lastPost);

    navHTML += numbers.join("");
    navHTML += `<li class="navbar-selector-item"><p>⟩</p></li>`;
    navHTML += '</nav>';

    navbar.innerHTML = navHTML;
}

async function loadBlogInterface() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogData = await getBlogPosts();
    if (!blogData)
        return;

    console.log(blogData);
    highestPostId = blogData.current;
    currentPostId = Math.max(Math.min(Number(urlParams.get("p")) ?? blogData.current, highestPostId), 0);

    createNavbar();
}

document.addEventListener("DOMContentLoaded", async function() {
    await loadBlogInterface();
});