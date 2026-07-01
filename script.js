console.log("SCRIPT LOADED");

fetch("https://script.google.com/macros/s/AKfycbyeK2cjWy5DTMBVY-qKjcPbEmitrFreFswnw46hu5Je3HW9axUiyuzcDmiiuJGwA0a69A/exec")
  .then(r => r.json())
  .then(data => {
    console.log("DATA FROM APPS SCRIPT:", data);
  })
  .catch(err => {
    console.error("FETCH ERROR:", err);
  });
