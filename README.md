# 80/20 AI — Subscribe page (duplicate)

A static, front-end recreation of the **80/20 AI** newsletter subscribe page
(`8020ai.co/subscribe?recommendations=true&email=...`).

> **Note on fidelity.** The live site is hosted on beehiiv and was not reachable
> from the build environment (blocked by the network egress policy), so this is a
> faithful reconstruction from public research — beehiiv's standard subscribe
> layout plus the 80/20 AI brand (daily 3-minute AI brief, 90,000+ subscribers,
> "the top 20% of AI that matters"). Copy, palette, and testimonials are
> illustrative stand-ins, not scraped from the original.

## What it replicates

- **Sticky header** with the `80/20 AI` wordmark and primary nav.
- **Hero + subscribe form** with social proof and trust copy.
- **URL-driven behavior**, matching the query string in the target URL:
  - `?email=` pre-fills the email input on every form on the page.
  - `?recommendations=true` reveals beehiiv's post-signup "recommendations"
    step (subscribe to related newsletters) — which also appears automatically
    after a successful signup.
- Logo strip, stats band, "what you get" features, testimonials, dark bottom
  CTA, and footer.
- Client-side email validation, a success toast, and a fully responsive layout.

## Run it

It's a static site — no build step. Open `index.html` directly, or serve the
folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/?recommendations=true&email=you@example.com
```

## Files

| File         | Purpose                                             |
|--------------|-----------------------------------------------------|
| `index.html` | Page structure and content                          |
| `styles.css` | All styling (design tokens, layout, responsive)     |
| `script.js`  | URL parsing, email prefill, recommendations, toast  |

All behavior is client-side; no data is sent anywhere.
