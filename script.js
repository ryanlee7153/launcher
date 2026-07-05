const API_URL = "https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec";

console.log("SCRIPT LOADED");

const btn = document.getElementById("launchBtn");
const menu = document.getElementById("startMenu");
const subMenu = document.getElementById("subMenu");

let hideTimer = null;

/* =========================
   FORCE HIDE SUBMENU (REAL FIX)
========================= */

function hideSubmenu() {
    subMenu.innerHTML = "";
    subMenu.style.display = "none";
}

function showSubmenu(items, x, y) {

    subMenu.innerHTML = "";

    subMenu.style.display = "flex";
    subMenu.style.flexDirection = "column";
    subMenu.style.position = "fixed";
    subMenu.style.left = (x + 10) + "px";
    subMenu.style.top = y + "px";
    subMenu.style.background = "#1e1e1e";
    subMenu.style.border = "1px solid #333";
    subMenu.style.padding = "6px";
    subMenu.style.minWidth = "200px";
    subMenu.style.zIndex = "9999";

    items.forEach(item => {

        const row = document.createElement("div");
        row.textContent = item.label;

        row.style.padding = "8px 10px";
        row.style.cursor = "pointer";
        row.style.color = "white";
        row.style.whiteSpace = "nowrap";

        row.onmouseenter = () => row.style.background = "#2a2a2a";
        row.onmouseleave = () => row.style.background = "transparent";

        row.onclick = () => {
            window.open(item.url, "_blank");
        };

        subMenu.appendChild(row);
    });
}

/* =========================
   CLOSE EVERYTHING (IMPORTANT)
========================= */

function closeAll() {
    menu.classList.remove("open");
    hideSubmenu();
}

/* =========================
   TOGGLE BUTTON
========================= */

btn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (menu.classList.contains("open")) {
        closeAll();
    } else {
        menu.classList.add("open");
    }
});

document.addEventListener("click", closeAll);

/* =========================
   AUTO HIDE
========================= */

function startHideTimer() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(closeAll, 1000);
}

function cancelHideTimer() {
    clearTimeout(hideTimer);
}

/* =========================
   LOAD MENU
========================= */

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

        div.onmouseenter = () => {

            cancelHideTimer();

            const rect = div.getBoundingClientRect();
            showSubmenu(groups[cat], rect.right, rect.top);
        };

        menu.appendChild(div);
    });

    menu.onmouseleave = startHideTimer;
    menu.onmouseenter = cancelHideTimer;

    subMenu.onmouseenter = cancelHideTimer;
    subMenu.onmouseleave = startHideTimer;
}

loadMenu();
