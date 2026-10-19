---
name: install-tracking
description: Add the Quomerce tracking script to a shop's own code (Next.js, React, plain HTML, any framework), with page types, consent and purchase events. Use when a developer asks to install, add or set up Quomerce, the Quomerce snippet or SDK in their codebase, or to send orders, cart events or consent to Quomerce.
---

# Install Quomerce tracking in a codebase

This skill changes the shop's code. Show the person each change and let them review it before they ship.

## Get the current instructions first

The install docs change; do not rely on memory. Fetch
https://docs.quomerce.com/llms-full.txt (every docs page in one file) and follow it. The pages that
matter most are `install/snippet`, `install/nextjs`, `install/consent`, `events/commerce-modes`,
`events/manual`, `events/page-types` and `install/verify`.

## Steps

1. **The key.** Ask for the site's public key (`pk_live_…`). It is on the website's
   **Install & setup** page in https://app.quomerce.com. The **AI agent** tab there has a ready prompt
   with the key in it. The key is public (it can send data, never read it), so it may live in code.
2. **Find the layout.** Locate the one place that renders `<head>` for every page (Next.js
   `app/layout.tsx`, a theme's `theme.liquid`, a base template). Add the snippet from the docs there,
   once. Do not install it from npm; it is served by Quomerce.
   - Shopify shops should use the Quomerce Shopify app instead of code. Stop and say so.
3. **Page types.** If the URLs do not make product, cart and checkout pages obvious, call
   `qm("page", { type })` on those pages (`home`, `category`, `search`, `product`, `cart`,
   `checkout`, `thank_you`, `account`, `other`). In a single-page app call it on every route change,
   before the page view.
4. **Commerce events.** Check how the shop reports purchases today:
   - It already pushes GA4 ecommerce events to `dataLayer` (`add_to_cart`, `begin_checkout`,
     `purchase`…): keep the default `commerce: "auto"`. Nothing else is needed.
   - It does not: pass `commerce: "manual"` to `init` and add `qm.commerce.*` calls where the shop
     adds to cart, starts checkout, picks payment and confirms the order. In `auto` mode those calls
     are ignored, so never mix the two.
   - The purchase call needs the order id, the value in **major units** (`2899.99`) and the currency.
5. **Consent.** If the shop has a cookie banner, call `qm("consent", { analytics, replay })` from its
   callback on every page, with the visitor's choice. Without it, Quomerce counts nobody in its figures.
6. **TypeScript.** Copy the types from https://ingest-prod.quomerce.com/sdk/v0/qm.d.ts if the project
   uses TypeScript.
7. **Check.** Run the site, open a page and confirm requests go to `ingest-prod.quomerce.com`. Then,
   if the Quomerce tools are connected, run the `setup-check` skill; data shows up within a minute.

## Rules

- The script must never break the shop: no `await` on it, no code that depends on it loading.
- Never send personal data (names, e-mails, phone numbers, addresses) in events or custom properties.
- Use `qm.identify(customerId)` only with an internal id; Quomerce hashes it.
