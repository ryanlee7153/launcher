const API_URL = "https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec";

console.log("SCRIPT LOADED");

const btn = document.getElementById("launchBtn");
const menu = document.getElementById("startMenu");
const subMenu = document.getElementById("subMenu");

let hideTimer = null;

/* OPEN/CLOSE MENU */
btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
    subMenu.classList.remove("open");
});

document.addEventListener("click", () => {
    menu.classList.remove("open");
    subMenu.classList.remove("open");
});

/* AUTO HIDE */
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

/* SUBMENU */
function showSubmenu(category, items, x, y) {

    subMenu.innerHTML = "";

    items.forEach(item => {

        const pin = item.pin ? String(item.pin).trim() : "";

        const link = document.createElement("div");
        link.className = "menu-item";
        link.textContent = item.label;

        link.addEventListener("click", () => {

            // DEBUG
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

        subMenu.appendChild(link);
    });

    subMenu.style.position = "fixed";
    subMenu.style.left = (x + 10) + "px";
    subMenu.style.top = y + "px";

    subMenu.classList.add("open");
}

/* LOAD MENU */
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

            showSubmenu(cat, groups[cat], rect.right, rect.top);

        });

        menu.appendChild(div);
    });

    menu.addEventListener("mouseenter", cancelHideTimer);
    subMenu.addEventListener("mouseenter", cancelHideTimer);

    menu.addEventListener("mouseleave", startHideTimer);
    subMenu.addEventListener("mouseleave", startHideTimer);
}

loadMenu();
