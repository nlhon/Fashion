/* ===== Atelier AI — front-end interactions ===== */
(function () {
  "use strict";

  /* --- Year --- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Nav: scroll state + mobile toggle --- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 20);
  });
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- Reveal on scroll --- */
  var revealTargets = document.querySelectorAll(
    ".card, .step, .quote, .price, .tile, .section__head"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* --- Gallery tiles --- */
  var gallery = document.getElementById("gallery");
  if (gallery) {
    var tiles = [
      { label: "Sculptural Trench", c1: "#c084fc", c2: "#7dd3fc" },
      { label: "Neo-Heritage Knit", c1: "#e8b4c8", c2: "#e9c46a" },
      { label: "Liquid Eveningwear", c1: "#7dd3fc", c2: "#1d2b4a" },
      { label: "Utility Tailoring", c1: "#7d8597", c2: "#2a2438" },
      { label: "Bloom Print Capsule", c1: "#e8b4c8", c2: "#c084fc" },
      { label: "Chrome Streetwear", c1: "#9aa0a6", c2: "#3a3550" },
      { label: "Soft Avant Drape", c1: "#e9c46a", c2: "#e8b4c8" },
      { label: "Cyber Atelier", c1: "#7dd3fc", c2: "#c084fc" }
    ];
    tiles.forEach(function (t) {
      var div = document.createElement("div");
      div.className = "tile";
      div.style.background = "linear-gradient(150deg, " + t.c1 + ", " + t.c2 + ")";
      div.innerHTML = "<span>" + t.label + "</span>";
      gallery.appendChild(div);
    });
  }

  /* --- Vibe chips --- */
  var activeVibe = "Avant-garde";
  var chipWrap = document.getElementById("vibeChips");
  if (chipWrap) {
    chipWrap.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      chipWrap.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      activeVibe = chip.dataset.vibe;
    });
  }

  /* --- Studio concept generator (client-side demo) --- */
  var palettes = {
    "Avant-garde": ["#1b1b2f", "#e94560", "#0f3460", "#f5f5f5"],
    "Minimalist": ["#f4f1ea", "#d8cfc4", "#8d8378", "#2b2b2b"],
    "Streetwear": ["#111111", "#ff5e3a", "#ffd166", "#e0e0e0"],
    "Romantic": ["#f5e1e6", "#e8b4c8", "#c084fc", "#7d5a75"],
    "Futuristic": ["#0d1b2a", "#7dd3fc", "#c0c0c0", "#e0aaff"],
    "Heritage": ["#3a2f24", "#9a7b4f", "#e9c46a", "#d8cfc4"]
  };
  var fabricsByVibe = {
    "Avant-garde": ["bonded neoprene", "raw silk", "laser-cut leather", "structured felt"],
    "Minimalist": ["organic cotton poplin", "merino wool", "tencel twill", "matte crepe"],
    "Streetwear": ["heavyweight fleece", "ripstop nylon", "garment-dyed jersey", "denim"],
    "Romantic": ["silk chiffon", "guipure lace", "crushed velvet", "tulle"],
    "Futuristic": ["iridescent technical knit", "coated mesh", "thermo-bonded jersey", "reflective shell"],
    "Heritage": ["herringbone tweed", "boiled wool", "waxed cotton", "corduroy"]
  };
  var details = ["sculptural shoulders", "asymmetric closures", "tonal topstitching", "convertible panels",
    "exposed seams", "draped cowl", "oversized patch pockets", "corseted waist", "raw hems", "modular layering"];
  var silhouettes = ["A-line", "column", "oversized", "tailored", "deconstructed", "cocoon", "bias-cut", "structured boxy"];

  function pick(arr, n) {
    var copy = arr.slice(), out = [];
    n = Math.min(n, copy.length);
    for (var i = 0; i < n; i++) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    return out;
  }
  function titleFrom(prompt, vibe) {
    var words = prompt.trim().split(/\s+/).filter(Boolean);
    var key = words.slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
    var suffix = { "Avant-garde": "Manifesto", "Minimalist": "Essential", "Streetwear": "Drop",
      "Romantic": "Reverie", "Futuristic": "Protocol", "Heritage": "Archive" }[vibe] || "Edit";
    return (key || "Untitled") + " " + suffix;
  }

  var btn = document.getElementById("generateBtn");
  var output = document.getElementById("studioOutput");

  function renderLoading() {
    output.innerHTML =
      '<div class="loading"><div class="loading__spinner"></div>' +
      "<p>Composing your concept brief…</p></div>";
  }

  function renderBrief(prompt, vibe) {
    var pal = palettes[vibe] || palettes["Minimalist"];
    var swatches = pal.map(function (c) {
      return '<span class="swatch" style="background:' + c + '"></span>';
    }).join("");
    var fabrics = pick(fabricsByVibe[vibe] || [], 2);
    var det = pick(details, 3);
    var sil = pick(silhouettes, 1)[0];
    var clean = prompt.trim() || "an effortless modern garment";

    output.innerHTML =
      '<div class="brief">' +
        '<div class="brief__head">' +
          '<h3 class="brief__title">' + titleFrom(prompt, vibe) + "</h3>" +
          '<span class="brief__tag">' + vibe + "</span>" +
        "</div>" +
        '<div class="brief__row"><h4>Concept</h4><p>A ' + sil.toLowerCase() +
          " interpretation of " + clean + ", expressed through a " + vibe.toLowerCase() +
          " lens with intentional restraint and a strong signature line.</p></div>" +
        '<div class="brief__row"><h4>Palette</h4><div class="swatches">' + swatches + "</div></div>" +
        '<div class="brief__row"><h4>Materials</h4><div class="brief__pills"><span>' +
          fabrics.join("</span><span>") + "</span></div></div>" +
        '<div class="brief__row"><h4>Signature details</h4><div class="brief__pills"><span>' +
          det.join("</span><span>") + "</span></div></div>" +
        '<div class="brief__row"><h4>Styling note</h4><p>Pair with sculptural accessories and a confident, ' +
          "editorial silhouette for the campaign hero look.</p></div>" +
      "</div>";
  }

  if (btn) {
    btn.addEventListener("click", function () {
      var prompt = document.getElementById("promptInput").value;
      renderLoading();
      setTimeout(function () { renderBrief(prompt, activeVibe); }, 900);
    });
  }

  /* --- Signup form --- */
  var form = document.getElementById("signupForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("formNote");
      var email = document.getElementById("emailInput").value;
      note.textContent = "✦ You're on the list, " + email.split("@")[0] + "! We'll be in touch soon.";
      form.reset();
    });
  }
})();
