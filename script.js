console.log("SCRIPT LOADED");

const btn = document.getElementById("launchBtn");

console.log("BUTTON FOUND:", btn);

btn.addEventListener("click", () => {
    console.log("RT CLICKED");
    alert("RT works");
});
