/* ============================================================
   80/20 AI — Subscribe page behavior
   - Reads ?email= and ?recommendations= from the URL (like beehiiv)
   - Pre-fills the email field
   - Reveals the recommendations step when recommendations=true
   - Client-side only: no data leaves the page (this is a static duplicate)
   ============================================================ */

(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var prefillEmail = params.get("email") || "";
  var showRecs = params.get("recommendations") === "true";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ---- Pre-fill email fields from the URL --------------------------------
  var emailInputs = document.querySelectorAll('input[type="email"]');
  if (prefillEmail) {
    emailInputs.forEach(function (input) { input.value = prefillEmail; });
  }

  // ---- Current year in the footer ----------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ---- Toast helper -------------------------------------------------------
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    // Force reflow so the transition runs when toggling the class.
    void toast.offsetWidth;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
      window.setTimeout(function () { toast.hidden = true; }, 260);
    }, 3200);
  }

  // ---- Recommendations section -------------------------------------------
  var recsSection = document.getElementById("recommendations");

  function revealRecommendations() {
    if (!recsSection) return;
    recsSection.hidden = false;
    recsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // If the URL asks for the recommendations step, show it immediately.
  if (showRecs && recsSection) {
    recsSection.hidden = false;
  }

  // ---- Subscribe handling -------------------------------------------------
  function handleSubscribe(form) {
    var input = form.querySelector('input[type="email"]');
    var field = form.querySelector(".field");
    var value = (input && input.value ? input.value : "").trim();

    if (!EMAIL_RE.test(value)) {
      if (field) {
        field.classList.add("invalid");
        window.setTimeout(function () { field.classList.remove("invalid"); }, 1600);
      }
      if (input) input.focus();
      showToast("Please enter a valid email address.");
      return;
    }

    // Keep every email field in sync with the confirmed address.
    emailInputs.forEach(function (el) { el.value = value; });

    showToast("You're in! Check " + value + " to confirm. 🎉");

    // Beehiiv shows the recommendations step right after a successful signup.
    if (recsSection) {
      revealRecommendations();
    }
  }

  ["subscribe-form", "subscribe-form-cta"].forEach(function (id) {
    var form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      handleSubscribe(form);
    });
  });

  // ---- Recommendation actions --------------------------------------------
  var recContinue = document.getElementById("rec-continue");
  var recSkip = document.getElementById("rec-skip");

  function finishWithRecommendations() {
    var checked = document.querySelectorAll('#rec-list input[type="checkbox"]:checked');
    var count = checked.length;
    if (count > 0) {
      showToast("Subscribed to 80/20 AI + " + count + " more. All set! ✅");
    } else {
      showToast("You're subscribed to 80/20 AI. All set! ✅");
    }
    if (recsSection) {
      window.setTimeout(function () {
        document.getElementById("subscribe").scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }

  if (recContinue) {
    recContinue.addEventListener("click", finishWithRecommendations);
  }
  if (recSkip) {
    recSkip.addEventListener("click", function () {
      document.querySelectorAll('#rec-list input[type="checkbox"]').forEach(function (cb) {
        cb.checked = false;
      });
      showToast("You're subscribed to 80/20 AI. All set! ✅");
      window.setTimeout(function () {
        document.getElementById("subscribe").scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    });
  }
})();
