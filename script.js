const API_URL = "https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec";

const btn = document.getElementById("launchBtn");
const menu = document.getElementById("menu");
const subMenu = document.getElementById("subMenu");

let hideTimer = null;

btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
});

document.addEventListener("click", () => {
    menu.classList.remove("open");
    subMenu.classList.remove("open");
});

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

    resetHideTimer();
}

function resetHideTimer() {
    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
        menu.classList.remove("open");
        subMenu.classList.remove("open");
    }, 1000);
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

    // keep menu alive while interacting
    menu.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    subMenu.addEventListener("mouseenter", () => clearTimeout(hideTimer));

    menu.addEventListener("mouseleave", resetHideTimer);
    subMenu.addEventListener("mouseleave", resetHideTimer);
}

loadMenu();
