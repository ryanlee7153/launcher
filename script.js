const API_URL = "https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec";

console.log("SCRIPT LOADED");

const btn = document.getElementById("launchBtn");
const menu = document.getElementById("startMenu");
const subMenu = document.getElementById("subMenu");

let hideTimer = null;

/* =========================
   OPEN / CLOSE MAIN MENU
========================= */

btn.addEventListener("click", (e) => {
    e.stopPropagation();

    menu.classList.toggle("open");
    subMenu.classList.remove("open");
});

/* Close everything when clicking outside */
document.addEventListener("click", () => {
    menu.classList.remove("open");
    subMenu.classList.remove("open");
});

/* =========================
   AUTO-HIDE TIMER (1 sec)
========================= */

function startHideTimer() {
    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
        menu.classList.remove("open");
        subMenu.classList.remove("open");
    }, 1000);
}

function cancelHideTimer() {
    clearTimeout(hideTimer);
}

/* =========================
   SUBMENU RENDER
========================= */

function showSubmenu(category, items, x, y) {

    subMenu.innerHTML = "";

    items.forEach(i => {
        const a = document.createElement("a");
        a.href = i.url;
        a.target = "_blank";
        a.textContent = i.label;
        subMenu.appendChild(a);
    });

    // FORCE POSITION NEXT TO CATEGORY
    subMenu.style.position = "fixed";
    subMenu.style.left = (x + 10) + "px";
    subMenu.style.top = y + "px";

    subMenu.classList.add("open");
}

/* =========================
   LOAD MENU FROM APPS SCRIPT
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

        div.addEventListener("mouseenter", () => {

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

    /* =========================
       HIDE BEHAVIOR
    ========================= */

    menu.addEventListener("mouseenter", cancelHideTimer);
    subMenu.addEventListener("mouseenter", cancelHideTimer);

    menu.addEventListener("mouseleave", startHideTimer);
    subMenu.addEventListener("mouseleave", startHideTimer);
}

loadMenu();
