const scrollDownBtn = document.getElementById("scroll-down-btn");
const marqueeWrapper = document.querySelector(".marquee"),
  marquee = document.querySelector(".marquee__text"),
  marqueeWrapperWidth = marqueeWrapper.offsetWidth,
  marqueeWidth = marquee.scrollWidth;
const projectsDisplay = document.querySelectorAll(".item-project");
const projectImages = document.querySelectorAll(".item-project__img");

export function init() {
  let imageId = 1;
  const interval = setInterval(move, 12);

  for (const image of projectImages) {
    image.src = `/images/projects/0${imageId}.webp`;
    image.style.height = "auto";
    image.style.width = "100%";
    image.style.maxWidth = "100%";
    image.classList.remove("skeleton");

    imageId++;
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
