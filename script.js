const API_URL = "https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec";

console.log("SCRIPT LOADED");

const btn = document.getElementById("launchBtn");
const menu = document.getElementById("menu");

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("open");
});

document.addEventListener("click", () => {
  menu.classList.remove("open");
  closePopup();
});

let popup;

function closePopup() {
  if (popup) popup.remove();
  popup = null;
}

function openPopup(category, items) {
  closePopup();

  popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.left = "300px";
  popup.style.bottom = "80px";
  popup.style.width = "250px";
  popup.style.background = "#2b2b2b";
  popup.style.border = "1px solid #444";
  popup.style.padding = "10px";
  popup.style.color = "white";

  const title = document.createElement("div");
  title.textContent = category;
  title.style.fontWeight = "bold";
  title.style.marginBottom = "10px";

  popup.appendChild(title);

  items.forEach(i => {
    const a = document.createElement("a");
    a.href = i.url;
    a.target = "_blank";
    a.textContent = i.label;
    a.style.display = "block";
    a.style.color = "#4ea3ff";
    a.style.textDecoration = "none";
    a.style.marginBottom = "5px";
    popup.appendChild(a);
  });

  document.body.appendChild(popup);
}

async function loadMenu() {
  const res = await fetch(API_URL);
  const data = await res.json();

  menu.innerHTML = "";

  const groups = {};

  data.forEach(item => {
    if (!item.category || !item.label || !item.url) return;
    if (!item.enabled) return;

    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  Object.keys(groups).sort().forEach(cat => {
    const c = document.createElement("div");
    c.className = "category";
    c.textContent = cat + " ▶";

    c.addEventListener("click", (e) => {
      e.stopPropagation();
      openPopup(cat, groups[cat]);
    });

    menu.appendChild(c);
  });
}

loadMenu();
