(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sticky nav border + mobile menu
  var nav = document.querySelector(".nav");
  var links = document.querySelector(".nav-links");
  var toggle = document.querySelector(".nav-toggle");
  function closeMenu() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && links.classList.contains("open")) { closeMenu(); toggle.focus(); }
  });

  // Scroll progress bar + nav border
  var bar = document.createElement("div");
  bar.className = "progress";
  document.body.appendChild(bar);
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 8);
    var h = root.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Cursor spotlight on cards (pointer devices only)
  if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  }

  // Typewriter word in hero (visual only; the h1 has a stable screen-reader label)
  var rot = document.querySelector(".rotator");
  if (rot && !reduced) {
    var words = rot.dataset.words.split(",");
    var wi = words.length - 1, deleting = true, text = rot.textContent;
    (function tick() {
      if (deleting) {
        text = text.slice(0, -1);
        if (!text.length) { deleting = false; wi = (wi + 1) % words.length; }
      } else {
        text = words[wi].slice(0, text.length + 1);
      }
      rot.textContent = text;
      var delay = deleting ? 40 : 85;
      if (!deleting && text === words[wi]) { deleting = true; delay = 1800; }
      setTimeout(tick, text === "AI systems" ? 2200 : delay);
    })();
  }

  var reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in", "done"); });
    return;
  }

  // Stagger reveals inside grids
  document.querySelectorAll(".research, .projects, .skills, .pubs, .awards, .gallery, .two, .timeline, .charts").forEach(function (grid) {
    Array.prototype.forEach.call(grid.querySelectorAll(":scope > .reveal"), function (el, i) {
      el.style.setProperty("--d", Math.min(i * 60, 360) + "ms");
    });
  });

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add("in");
      setTimeout(function () { el.classList.add("done"); }, 900);
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  reveals.forEach(function (el) { io.observe(el); });

  // Active nav link
  var navLinks = document.querySelectorAll(".nav-links a");
  var navIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + entry.target.id;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("section[id]").forEach(function (s) { navIO.observe(s); });
})();
