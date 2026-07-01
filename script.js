const API_URL = "https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec";

console.log("JS is running");

const btn = document.getElementById("launchBtn");
const menu = document.getElementById("menu");

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("open");
});

document.addEventListener("click", () => {
  menu.classList.remove("open");
});

async function loadMenu() {
  try {
    console.log("Fetching data...");
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("DATA:", data);

    menu.innerHTML = "";

    const groups = {};

    data.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    Object.keys(groups).sort().forEach(cat => {
      const catDiv = document.createElement("div");
      catDiv.className = "category";
      catDiv.textContent = cat;

      const sub = document.createElement("div");
      sub.className = "submenu";

      groups[cat]
        .sort((a, b) => a.label.localeCompare(b.label))
        .forEach(i => {
          const a = document.createElement("a");
          a.href = i.url;
          a.target = "_blank";
          a.textContent = i.label;
          sub.appendChild(a);
        });

      catDiv.appendChild(sub);
      menu.appendChild(catDiv);
    });

  } catch (err) {
    console.error("ERROR:", err);
  }
}

loadMenu();
