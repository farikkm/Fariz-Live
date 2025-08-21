const scrollDownBtn = document.getElementById("scroll-down-btn");

export function init() {
  scrollDownBtn.addEventListener("click", () =>
    scrollDown(document.body.scrollHeight - window.innerHeight),
  );

  const marqueeWrapper = document.querySelector(".marquee"),
    marquee = document.querySelector(".marquee__text"),
    marqueeWrapperWidth = marqueeWrapper.offsetWidth,
    marqueeWidth = marquee.scrollWidth;

  function move() {
    var currentTX = getComputedStyle(marquee).transform.split(",");
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

  const interval = setInterval(move, 12);
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
