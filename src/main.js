import "./router/index.js";
import { isMobile } from "./utils/isMobile.js";

const header = document.querySelector("header");
const headerLogo = document.querySelector(".header__logo");
const headerMenu = document.querySelector(".header__menu");
const headerList = document.querySelector(".header__list");
const headerMenuBtn = document.querySelector(".header__menu_button");

header?.addEventListener("click", (e) => {
  const link = e.target.closest(".header__link");

  if (link && header.contains(link)) {
    setActiveLink(link.href);
  }
});

headerLogo?.addEventListener("click", () => {
  setActiveLink(headerLogo.href);
});

if (isMobile()) {
  headerMenuBtn.addEventListener("click", () => {
    headerMenu.classList.toggle("_active");
    document.body.classList.toggle("_lock");
  });

  headerList.addEventListener("click", (e) => {
    const isLink = e.target.classList.contains("header__link");

    if (isLink) {
      headerMenu.classList.remove("_active");
      document.body.classList.remove("_lock");
    }
  });
}

window.onpopstate = () => {
  setActiveLink(window.location.href);
};

setActiveLink(window.location.href);

function setActiveLink(urlHref) {
  document.querySelectorAll(".header__item").forEach((item) => {
    const link = item.querySelector("a");
    if (!link) return;

    if (link.href === urlHref) {
      item.classList.add("_active");
    } else {
      item.classList.remove("_active");
    }
  });
}
