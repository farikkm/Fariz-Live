// isMobile.js
// Идея: собрать несколько "сигналов" и решить по большинству.
// Так меньше ложных срабатываний, чем у чистого UA-match.

const _mq = (q) =>
  typeof window !== "undefined" && "matchMedia" in window
    ? window.matchMedia(q).matches
    : false;

export function isMobile() {
  // 1) Аппаратные и media-сигналы
  const hasCoarsePointer = _mq("(pointer: coarse)");
  const noHover = _mq("(hover: none)");
  const narrowViewport = _mq("(max-width: 768px)");

  // 2) Тач-способности
  const hasTouchPoints =
    typeof navigator !== "undefined"
      ? (navigator.maxTouchPoints || navigator.msMaxTouchPoints || 0) > 0
      : false;
  const ontouch = typeof window !== "undefined" && "ontouchstart" in window;

  // 3) Современные данные UA (Chromium-браузеры)
  const uaDataMobile =
    typeof navigator !== "undefined" && navigator.userAgentData
      ? navigator.userAgentData.mobile === true
      : null;

  // 4) Классический UA как *последний* аргумент
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const uaMobileMatch =
    /\b(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)\b/i.test(
      ua,
    );

  // iPadOS нюанс: iPadOS часто маскируется под "MacIntel"
  const isIPadOS = (() => {
    if (typeof navigator === "undefined") return false;
    const platform = navigator.platform || "";
    const isMacLike = /Mac/i.test(platform);
    return isMacLike && (navigator.maxTouchPoints || 0) > 1;
  })();

  // Подсчёт баллов
  let score = 0;
  const add = (cond) => {
    if (cond) score++;
  };

  add(hasCoarsePointer);
  add(noHover);
  add(narrowViewport);
  add(hasTouchPoints || ontouch);
  add(uaMobileMatch);
  add(isIPadOS);
  // uaDataMobile — сильный сигнал: считаем за 2 балла
  if (uaDataMobile === true) score += 2;
  if (uaDataMobile === false) score -= 1; // явный десктоп по UA-Data

  // Порог: 3+ сигналов = mobile
  const mobile = score >= 3;

  return mobile;
}

// Пример:
// if (isMobile()) { document.body.classList.add("is-mobile"); }
