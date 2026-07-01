const API_URL = "https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec";

const btn = document.getElementById("launchBtn");
const menu = document.getElementById("menu");
const subMenu = document.getElementById("subMenu");

let hideTimer = null;

function openMenu() {
    menu.classList.add("open");
}

function closeAll() {
    menu.classList.remove("open");
    subMenu.classList.remove("open");
}

function startHideTimer() {
    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
        closeAll();
    }, 1000);
}

function cancelHideTimer() {
    clearTimeout(hideTimer);
}

btn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (menu.classList.contains("open")) {
        closeAll();
    } else {
        openMenu();
    }
});

document.addEventListener("click", closeAll);

function showSubmenu(category, items, x, y) {

    subMenu.innerHTML = "";

    items.forEach(i => {
        const a = document.createElement("a");
        a.href = i.url;
        a.target = "_blank";
        a.textContent = i.label;
        subMenu.appendChild(a);
    });

    subMenu.style.left = (x + 220) + "px";
    subMenu.style.top = y + "px";

    subMenu.classList.add("open");
}

async function loadMenu() {

    const res = await fetch(API_URL);
    const data = await res.json();

    const groups = {};

    data.forEach(item => {
        if (!item.enabled) return;

        if (!groups[item.category]) {
            groups[item.category] = [];
        }

        groups[item.category].push(item);
    });

    menu.innerHTML = "";

    Object.keys(groups).sort().forEach(cat => {

        const div = document.createElement("div");
        div.className = "category";
        div.textContent = cat + " ▶";

        div.addEventListener("mouseenter", (e) => {

            cancelHideTimer();

            const rect = div.getBoundingClientRect();

            showSubmenu(
                cat,
                groups[cat],
                rect.right,
                rect.top
            );

        });

        menu.appendChild(div);
    });

    // IMPORTANT: start hide timer when leaving BOTH areas
    menu.addEventListener("mouseleave", startHideTimer);
    subMenu.addEventListener("mouseleave", startHideTimer);

    // cancel timer when re-entering
    menu.addEventListener("mouseenter", cancelHideTimer);
    subMenu.addEventListener("mouseenter", cancelHideTimer);
}

loadMenu();
