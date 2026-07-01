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

/* close on outside click */
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
   SUBMENU BUILDER (FIXED)
========================= */

function showSubmenu(items, x, y) {

    subMenu.innerHTML = "";

    // FORCE COLUMN LAYOUT HERE (not CSS-dependent)
    subMenu.style.display = "flex";
    subMenu.style.flexDirection = "column";
    subMenu.style.position = "fixed";
    subMenu.style.left = (x + 10) + "px";
    subMenu.style.top = y + "px";
    subMenu.style.minWidth = "200px";

    items.forEach(item => {

        const pin = item.pin ? String(item.pin).trim() : "";

        const div = document.createElement("div");
        div.textContent = item.label;

        div.style.padding = "8px 10px";
        div.style.cursor = "pointer";
        div.style.whiteSpace = "nowrap";
        div.style.color = "white";

        div.addEventListener("mouseenter", () => {
            div.style.background = "#2a2a2a";
        });

        div.addEventListener("mouseleave", () => {
            div.style.background = "transparent";
        });

        div.addEventListener("click", () => {

            console.log("CLICK:", item.label, "PIN:", pin);

            if (pin !== "") {

                const entered = prompt("Enter PIN:");

                if (entered !== pin) {
                    alert("Incorrect PIN");
                    return;
                }
            }

            window.open(item.url, "_blank");
        });

        subMenu.appendChild(div);
    });

    subMenu.classList.add("open");
}

/* =========================
   LOAD MENU
========================= */

async function loadMenu() {

    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("DATA:", data);

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

            showSubmenu(groups[cat], rect.right, rect.top);

        });

        menu.appendChild(div);
    });

    menu.addEventListener("mouseenter", cancelHideTimer);
    subMenu.addEventListener("mouseenter", cancelHideTimer);

    menu.addEventListener("mouseleave", startHideTimer);
    subMenu.addEventListener("mouseleave", startHideTimer);
}

loadMenu();
