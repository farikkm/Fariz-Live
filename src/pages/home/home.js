export function init() {
  document.getElementById("go-movie")?.addEventListener("click", () => {
    window.navigate("/contacts");
  });
}

export function destroy() {
  // cleanup if needed
}
