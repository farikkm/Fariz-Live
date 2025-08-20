import "./router/index.js";

const header = document.querySelector("header");

setActiveLink(window.location.href);

header?.addEventListener("click", (e) => {
  const link = e.target.closest(".header__link");

  if (link && header.contains(link)) {
    setActiveLink(link.href);
  }
});

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

window.onpopstate = () => {
  setActiveLink(window.location.href);
};
