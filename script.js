async function loadContent() {
  const status = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  };

  try {
    const res = await fetch("content.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} loading content.json`);
    const data = await res.json();

    document.querySelectorAll("[data-bind]").forEach(el => {
      const key = el.getAttribute("data-bind");
      if (data[key] != null) el.innerHTML = data[key];
    });

    document.querySelectorAll("[data-bind-href]").forEach(el => {
      const key = el.getAttribute("data-bind-href");
      if (data[key]) el.setAttribute("href", data[key]);
    });

    status("packages-status", "");
    status("policies-status", "");
    status("studio-policies-status", "");

  } catch (e) {
    console.warn("content.json load failed:", e);
    status("packages-status", "Failed to load packages (content.json not available).");
    status("policies-status", "Failed to load policies (content.json not available).");
    status("studio-policies-status", "Failed to load studio policies (content.json not available).");
  }
}

function setupMobileNav() {
  const btn = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

function setupDropdowns() {
  document.querySelectorAll(".dropdown").forEach(dd => {
    const btn = dd.querySelector(".dropbtn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const open = dd.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.addEventListener("click", (e) => {
    document.querySelectorAll(".dropdown").forEach(dd => {
      if (!dd.contains(e.target)) {
        dd.classList.remove("open");
        const btn = dd.querySelector(".dropbtn");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

loadContent();
setupMobileNav();
setupDropdowns();
setYear();