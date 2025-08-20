import { routes } from "./routes";

const app = document.getElementById("app");
let currentPageModule = null;

/** Utilities **/
const sameOrigin = (url) =>
  new URL(url, location.origin).origin === location.origin;
const stripTrailing = (s) =>
  s.endsWith("/") && s !== "/" ? s.slice(0, -1) : s;

function pathToRegex(path) {
  // "/movie/:id" -> /^\/movie\/(?<id>[^/]+)$/
  const keys = [];
  const pattern = path
    .split("/")
    .map((seg) => {
      if (seg.startsWith(":")) {
        keys.push(seg.slice(1));
        return `(?<${seg.slice(1)}>[^/]+)`;
      }
      return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return { regex: new RegExp(`^${pattern}$`), keys };
}

function parseQuery(qs) {
  const out = {};
  const sp = new URLSearchParams(qs);
  for (const [k, v] of sp.entries()) out[k] = v;
  return out;
}

const compiled = routes.map((r) => ({ ...r, ...pathToRegex(r.path) }));

async function loadPageAssets(pageName) {
  // Remove previous page assets
  document.querySelectorAll("[data-route-asset]")?.forEach((el) => el.remove());

  // Inject CSS
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `/src/pages/${pageName}/${pageName}.css`;
  css.setAttribute("data-route-asset", "");
  document.head.appendChild(css);

  // Fetch and render HTML
  const htmlRes = await fetch(`/src/pages/${pageName}/${pageName}.html`, {
    cache: "no-cache",
  });

  if (!htmlRes.ok) throw new Error(`HTML not found for page: ${pageName}`);
  const html = await htmlRes.text();
  app.innerHTML = html;

  // Import page JS module if it exists
  try {
    const mod = await import(
      /* @vite-ignore */
      `/src/pages/${pageName}/${pageName}.js?ts=${Date.now()}`
    );
    return mod;
  } catch (e) {
    // Optional JS; ignore 404
    return null;
  }
}

function matchRoute(pathname) {
  const path = stripTrailing(pathname);
  for (const r of compiled) {
    const m = path.match(r.regex);
    if (m) {
      const params = m.groups || {};
      return { route: r, params };
    }
  }
  return null;
}

async function render(url, { replace = false } = {}) {
  const u = new URL(url, location.origin);
  const q = parseQuery(u.search);
  const matched = matchRoute(u.pathname);

  // 404 if no match
  if (!matched) {
    await loadPageAssets("404");
    document.title = "Not Found";
    history[replace ? "replaceState" : "pushState"]({}, "", u);
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }

  const ctx = {
    path: u.pathname,
    query: q,
    params: matched.params,
    route: matched.route,
  };

  // Guard
  if (typeof matched.route.beforeEnter === "function") {
    const allowed = await matched.route.beforeEnter(ctx);
    if (!allowed) return; // Cancel nav
  }

  // Teardown previous page
  if (currentPageModule?.destroy) {
    try {
      currentPageModule.destroy();
    } catch {}
  }

  // Load assets + page module
  currentPageModule = await loadPageAssets(matched.route.page);
  document.title = matched.route.title || document.title;

  // Run page init if provided
  if (currentPageModule?.init) {
    await currentPageModule.init(ctx);
  }

  // Update active nav
  document.querySelectorAll("a[data-link]").forEach((a) => {
    a.setAttribute(
      "aria-current",
      a.pathname === u.pathname ? "page" : "false",
    );
  });

  // Push/replace history after successful render
  history[replace ? "replaceState" : "pushState"]({}, "", u);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "instant" });
}

/** Link interception **/
addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || a.target === "_blank" || a.hasAttribute("download")) return;
  if (!sameOrigin(href)) return;
  if (!a.hasAttribute("data-link")) return; // only intercept marked links
  e.preventDefault();
  render(href);
});

/** Back/forward **/
addEventListener("popstate", () => render(location.href, { replace: true }));

/** Expose programmatic nav **/
window.navigate = (href, opts) => render(href, opts);

// Initial render
render(location.href, { replace: true });
