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
  var gallery = document.getElementById("galleryGrid");
  if (gallery) {
    // Real fashion photography (Unsplash). Each tile keeps a blue/yellow
    // gradient as a graceful fallback if an image can't load.
    var IMG = "?auto=format&fit=crop&w=600&h=800&q=70";
    var tiles = [
      { label: "Sculptural Tailoring", id: "1490481651871-ab68de25d43d", c1: "#3b82f6", c2: "#0a1326" },
      { label: "Editorial Knitwear",   id: "1483985988355-763728e1935b", c1: "#ffd23f", c2: "#3b82f6" },
      { label: "Evening Drape",        id: "1539109136881-3be0616acf4b", c1: "#60a5fa", c2: "#0a1326" },
      { label: "Street Layering",      id: "1469334031218-e382a71b716b", c1: "#1e3a8a", c2: "#3b82f6" },
      { label: "Studio Portrait",      id: "1496747611176-843222e1e57c", c1: "#ffd23f", c2: "#1e3a8a" },
      { label: "Minimal Lines",        id: "1485462537746-965f33f7f6a7", c1: "#3b82f6", c2: "#60a5fa" },
      { label: "Texture & Form",       id: "1515886657613-9f3515b0c78f", c1: "#ffe071", c2: "#3b82f6" },
      { label: "Runway Moment",        id: "1487412720507-e7ab37603c6f", c1: "#60a5fa", c2: "#0a1326" }
    ];
    tiles.forEach(function (t) {
      var div = document.createElement("div");
      div.className = "tile";
      div.style.background = "linear-gradient(150deg, " + t.c1 + ", " + t.c2 + ")";
      var img = document.createElement("img");
      img.loading = "lazy";
      img.alt = t.label + " — fashion concept";
      img.src = "https://images.unsplash.com/photo-" + t.id + IMG;
      // If the photo fails to load, hide it so the gradient shows through.
      img.addEventListener("error", function () { img.remove(); });
      div.appendChild(img);
      var span = document.createElement("span");
      span.textContent = t.label;
      div.appendChild(span);
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
