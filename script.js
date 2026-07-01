const API_URL = "https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec";

console.log("SCRIPT LOADED");

const btn = document.getElementById("launchBtn");
const menu = document.getElementById("startMenu");
const subMenu = document.getElementById("subMenu");

let hideTimer = null;

/* =========================
   TOGGLE MAIN MENU
========================= */

btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
    subMenu.classList.remove("open");
});

document.addEventListener("click", () => {
    menu.classList.remove("open");
    subMenu.classList.remove("open");
});

/* =========================
   AUTO HIDE
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
   SHOW SUBMENU (HARD RESET LAYOUT)
========================= */

function showSubmenu(items, x, y) {

    // FORCE RESET EVERYTHING
    subMenu.innerHTML = "";

    subMenu.style.position = "fixed";
    subMenu.style.left = (x + 10) + "px";
    subMenu.style.top = y + "px";
    subMenu.style.background = "#1e1e1e";
    subMenu.style.border = "1px solid #333";
    subMenu.style.padding = "6px";
    subMenu.style.display = "flex";
    subMenu.style.flexDirection = "column";
    subMenu.style.minWidth = "200px";
    subMenu.style.zIndex = "9999";

    items.forEach(item => {

        const pin = item.pin ? String(item.pin).trim() : "";

        const row = document.createElement("div");

        // HARD INLINE STYLING (removes ALL CSS dependency issues)
        row.style.padding = "8px 10px";
        row.style.cursor = "pointer";
        row.style.color = "white";
        row.style.whiteSpace = "nowrap";

        row.textContent = item.label;

        row.onmouseenter = () => row.style.background = "#2a2a2a";
        row.onmouseleave = () => row.style.background = "transparent";

        row.onclick = () => {

            if (pin !== "") {
                const entered = prompt("Enter PIN:");
                if (entered !== pin) return alert("Incorrect PIN");
            }

            window.open(item.url, "_blank");
        };

        subMenu.appendChild(row);
    });

    subMenu.classList.add("open");
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

        div.onmouseenter = (e) => {

            cancelHideTimer();

            const rect = div.getBoundingClientRect();

            showSubmenu(groups[cat], rect.right, rect.top);
        };

        menu.appendChild(div);
    });

    menu.onmouseenter = cancelHideTimer;
    subMenu.onmouseenter = cancelHideTimer;

    menu.onmouseleave = startHideTimer;
    subMenu.onmouseleave = startHideTimer;
}

loadMenu();
