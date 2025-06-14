var isBlogsKnown = false;
var currentPostId: number = null!;
var highestPostId: number = null!;

function loadPost(id: number, firstLoad=false): void {
    if (id < 0 || id > (highestPostId ?? 0))
        return;
    if (id === currentPostId && !firstLoad)
        return;

    console.log(`Loading post #${id}..`)

    fetch(`/blog/content/${id}.html`, { method: "GET" })
        .then(res => {
            return res.text();
        })
        .then(html => {
            if (!html)
                return;

            const adjustedHtml = "<div class='blog-entry'>" + html + "<br><br><br></div>";
            const mainElement = document.getElementById("content");
            mainElement!.innerHTML = adjustedHtml;
        })

    currentPostId = id;
    createNavbar();
}

async function getBlogPosts(): Promise<any> {
    return await fetch("./data/blog.json", { method: "GET" })
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

function createNavbar(): void {
    const navbar = document.getElementById("navbar");

    if (!navbar) {
        console.warn("Could not find the navbar!");
        return;
    }

    const numbers = [];
    const firstPost = 0;
    const lastPost = highestPostId;

    const addItem = (value: number, isCurrent = false) => {
        numbers.push(
            `<li class="navbar-selector-item navbar-selector-item-clickable ${isCurrent ? "navbar-selected-post" : ""}"><p onClick="loadPost(${value})">${value}</p></li>`
        );
    };

    let navHTML = "<nav class='navbar-selector'>";
    navHTML += `<li class="navbar-selector-item  navbar-selector-item-clickable"><p onClick="loadPost(${currentPostId-1})">⟨</p></li>`

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
    navHTML += `<li class="navbar-selector-item  navbar-selector-item-clickable"><p onClick="loadPost(${currentPostId+1})">⟩</p></li>`;
    navHTML += "</nav>";

    navbar.innerHTML = navHTML;
}

async function loadBlogInterface(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const blogData = await getBlogPosts();
    if (!blogData)
        return;

    console.debug(blogData);
    highestPostId = blogData.current;
    currentPostId = Math.max(Math.min(Number(urlParams.get("p") ?? highestPostId), highestPostId), 0);

    createNavbar();
    loadPost(currentPostId, true);
}

document.addEventListener("DOMContentLoaded", async function() {
    await loadBlogInterface();
});