console.log("SCRIPT LOADED");

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("launchBtn");

    console.log("BUTTON FOUND:", btn);

    if (!btn) {
        console.error("launchBtn NOT FOUND - check index.html");
        return;
    }

    btn.addEventListener("click", () => {
        console.log("RT CLICKED");
        alert("RT works");
    });

});
