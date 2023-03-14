const changeThemeBtn = document.querySelector("[data-change-theme-btn]");
const btnImage = document.querySelector("[data-change-theme-btn-image]");

// THEMES
window.addEventListener("load", () => {
  if (localStorage.getItem("theme")) {
    setThemeBasedOnLocalStorage();
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setDarkTheme();
  }
});

changeThemeBtn.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
  setThemeBasedOnLocalStorage();
});

function setThemeBasedOnLocalStorage() {
  if (localStorage.getItem("theme") === "dark") {
    setDarkTheme();
  } else {
    setLightTheme();
  }
}

function setDarkTheme() {
  document.body.classList.add("dark");
  btnImage.src = "assets/images/icon-sun.svg";
  btnImage.alt = "sun icon";
}

function setLightTheme() {
  document.body.classList.remove("dark");
  btnImage.src = "assets/images/icon-moon.svg";
  btnImage.alt = "moon icon";
}
