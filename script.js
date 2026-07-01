const API_URL = "https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec";

const startButton = document.getElementById("launchBtn");
const startMenu = document.getElementById("startMenu");
const subMenu = document.getElementById("subMenu");

// Toggle Start Menu
startButton.addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.classList.toggle("open");
    subMenu.classList.remove("open");
});

// Close menus when clicking elsewhere
document.addEventListener("click", () => {
    startMenu.classList.remove("open");
    subMenu.classList.remove("open");
});

async function buildMenu() {

    const response = await fetch(API_URL);
    const data = await response.json();

    const categories = {};

    data.forEach(item => {

        if (!item.enabled) return;

        if (!categories[item.category]) {
            categories[item.category] = [];
        }

        categories[item.category].push(item);

    });

    startMenu.innerHTML = "";

    Object.keys(categories)
        .sort()
        .forEach(category => {

            const cat = document.createElement("div");
            cat.className = "category";
            cat.textContent = category + " ▶";

            cat.addEventListener("mouseenter", () => {

                subMenu.innerHTML = "";

                categories[category]
                    .sort((a,b)=>a.label.localeCompare(b.label))
                    .forEach(link=>{

                        const a=document.createElement("a");
                        a.href=link.url;
                        a.target="_blank";
                        a.textContent=link.label;

                        subMenu.appendChild(a);

                    });

                const rect = cat.getBoundingClientRect();

                subMenu.style.left = rect.right + "px";
                subMenu.style.top = rect.top + "px";

                subMenu.classList.add("open");

            });

            startMenu.appendChild(cat);

        });

}

buildMenu();
