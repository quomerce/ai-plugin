---
name: checkout-funnel
description: Show where visitors leave on the way to an order and why, using the Quomerce funnel, paths and form data. Use when someone asks where people drop off, why visitors do not buy, about cart or checkout abandonment, what people do after adding to cart or where they go from checkout, which checkout fields cause trouble, or how to improve conversion.
---

# Checkout funnel

Read the `quomerce-data` skill first.

## Steps

1. Find the website. Use the range asked for, else `30d` (a funnel needs volume). `compare: true`.
2. `tracking_funnel`. Find the step with the biggest loss in sessions, not only in percent: losing 40 %
   of 5,000 matters more than losing 60 % of 50. Skip steps the shop does not report (see
   `quomerce-data`).
3. Break that step down with `breakdown` = `device`, then `browser`, then `payment_method` (only for
   the payment step). Look for one segment far below the rest.
4. `tracking_journeys` (default: from the landing page) shows at which step people leave and which
   pages they visit on the way. With `direction: "order"` it shows the steps before ordering. A detour
   to a shipping, returns or FAQ page before leaving often means missing information.
   `tracking_next_steps` with `point: "cart"`, `"checkout"` or `"payment"` shows what sessions did
   right after that stage; rows add up to 100 %. Run it once with `not_step: 6` and once with
   `reached_step: 6` to see which next step goes with ordering. `none` means no later page view was
   recorded, **not** "left": an untracked confirmation page or a payment page that never sent the
   shopper back look the same. Open a row with `tracking_next_step_detail` for its pages, issues and
   sessions. What the common rows usually mean:
   - cart → product or category: comparing or adding more; a problem only if most never come back;
   - cart or checkout → a shipping, returns, payment or FAQ page: information missing at the moment
     of buying; put the answer on that page;
   - checkout → cart: often a coupon field, a shipping cost seen for the first time, or a required
     account;
   - payment → checkout or cart: the payment failed or was cancelled; follow `stuck-at-payment`.
5. `tracking_behaviours`. A behaviour with `verdict: "converts_worse"` is a reason backed by data:
   paying again and again, a page left at once, a long pause at a checkout field. Open it with `key`
   for where it happens and sessions to read. Ignore the others (see `quomerce-data`).
6. `tracking_forms` for the checkout form: fields with high drop, error or refill rates are the ones
   to fix. Never ask for or mention what visitors typed; Quomerce never records it.
7. `tracking_issue_groups` for the same range, `section: "sales"`. Look at the issues seen on cart, checkout and payment pages;
   one that hits many sessions at the losing step may explain the drop (`investigate-issue`).

## What to write

- The one step that loses the most orders, with numbers.
- Why, as far as the data shows: a segment, a form field, a page people escape to, a behaviour, an
  error.
- Two or three changes to try, the cheapest first. Example: "Phone number is left empty by 31 % of
  visitors who leave at checkout. Make it optional or explain why you need it."
- Link the funnel, journeys or forms page.
