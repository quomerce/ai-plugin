---
name: setup-check
description: Check that Quomerce is installed and sending complete data on a shop, and say exactly what to fix. Use when someone asks if Quomerce works, is installed correctly, why there is no data, no orders, no replays or no funnel, or after they install the script or the Shopify or IdoSell app.
---

# Setup check

Read the `quomerce-data` skill first.

## Steps

1. Find the website. If it is not tracked yet, tracking must be turned on in the dashboard
   (website → Install & setup). Stop there and say so.
2. `tracking_setup`. Go through the `checklist`, in this order, and explain each item that is false:
   - `snippet`: no events arrived. The script is missing, blocked, or on a domain that is not in the
     site's allowed domains.
   - `page_types`: Quomerce cannot tell product, cart and checkout pages apart. Rules can be added on
     the Setup page, or the shop can call `qm.page({ type })`.
   - `commerce_events`: no add-to-cart or checkout events. Check the commerce mode below.
   - `purchases`: no order in 30 days. Order figures will show "no purchase data".
   - `order_details`: orders arrive without an order id or a value, so revenue is incomplete.
   - `replay`: no replays. Usually visitors did not give consent, or consent is never passed to Quomerce.
3. Read the rest of the result for the cause:
   - `consent.consented_share` low (under about 30 %): the cookie banner may not call
     `qm("consent", …)`, or most visitors decline. Visits without consent are not counted.
   - `commerce_mode`: `auto` detects events from the shop's GA4 dataLayer and built-in rules; `manual`
     sends only the shop's own `qm.commerce` calls. Both modes in the same week means the shop changed
     its code.
   - `sdk_versions`: very old versions on many sessions mean a cached or hard-coded old script.
   - `health.bot_share_7d` very high: most traffic is automated.
4. Give the fix for the shop's platform:
   - **Shopify**: the Quomerce app's theme embed must be turned on in the theme editor (App embeds),
     and its web pixel sends the checkout steps and the order.
   - **IdoSell**: the snippet goes on every page; page types are read from IdoSell's own page markers.
   - **Own site or other platform**: the snippet must be in the `<head>` of every page; see the
     `install-tracking` skill and https://docs.quomerce.com/install/snippet/.
   - Checking an install by hand: https://docs.quomerce.com/install/verify/.

## What to write

- First line: working, partly working, or not working.
- Then each problem with its fix, the most important first (no data at all, then orders, then the rest).
- What works, in one line.
