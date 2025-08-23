const scrollDownBtn = document.getElementById("scroll-down-btn");
const marqueeWrapper = document.querySelector(".marquee"),
  marquee = document.querySelector(".marquee__text"),
  marqueeWrapperWidth = marqueeWrapper.offsetWidth,
  marqueeWidth = marquee.scrollWidth;
const projectImages = document.querySelectorAll(".item-project__img");
const projectsWrapper = document.querySelector(".projects__items");

const projects = [
  {
    link: "http://95.47.125.157:9999/ru/",
    title: "Family Park",
    img: "/images/projects/01.webp",
    desc: "Web app for shopping mall",
  },
  {
    link: "https://yes-express-kohl.vercel.app/",
    title: "Yes Express",
    img: "/images/projects/02.webp",
    desc: "Web app for courier app",
  },
  {
    link: "https://recipe-app-gules-pi.vercel.app/",
    title: "Recipes App",
    img: "/images/projects/03.webp",
    desc: "Web app for searching recipes",
  },
  {
    link: "https://weather-app-rho-indol-59.vercel.app/",
    title: "Weather App",
    img: "/images/projects/04.webp",
    desc: "Web app for tracking current weather condition",
  },
];

const createProjectCard = (project) => {
  return `
    <a href="${project.link}" style="display: block" target="_blank" class="project__item item-project">
      <img class="item-project__img skeleton" src="${project.img}" style="width: 100%; height: auto" alt="project-image" />
      <h4 class="item-project__title">${project.title}</h4>
      <span class="item-project__desc">${project.desc}</span>
    </a>
  `;
};

export function init() {
  const interval = setInterval(move, 12);

  projectsWrapper.innerHTML = "";
  for (const project of projects) {
    const projectCard = createProjectCard(project);
    projectsWrapper.insertAdjacentHTML("beforeend", projectCard);
  }

  scrollDownBtn.addEventListener("click", () =>
    scrollDown(document.documentElement.scrollHeight - window.innerHeight),
  );

  function move() {
    let currentTX = getComputedStyle(marquee).transform.split(",");
    if (currentTX[4] === undefined) {
      currentTX = -1;
    } else {
      currentTX = parseFloat(currentTX[4]) - 1;
    }

    if (-currentTX >= marqueeWidth) {
      marquee.style.transform = "translateX(" + marqueeWrapperWidth + "px)";
    } else {
      marquee.style.transform = "translateX(" + currentTX + "px)";
    }
  }

  async function loadPreviews() {
    const res = await fetch(
      "https://api.github.com/repos/farikkm/Positivus/contents",
    );
    const files = await res.json();

    console.log(files);
  }

  loadPreviews();
}

export function destroy() {
  scrollDownBtn.removeEventListener("click", scrollDown);
}

function scrollDown(topValue) {
  window.scrollTo({
    top: topValue,
    behavior: "smooth",
  });
}
