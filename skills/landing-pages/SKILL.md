---
name: landing-pages
description: Find which landing pages of an online shop waste traffic and which ones sell, from Quomerce entry pages - where sessions land (home, category, product, search), how many leave after one page, how far they get and how many order. Use when someone asks which landing pages work, where ads or posts should point, why visitors leave at once, about bounce rate, or which page to fix first.
---

# Landing pages: where visitors land and what they do next

Read the `quomerce-data` skill first.

## Steps

1. Find the website, its time zone and currency. Period: what the person said, else the last 28 whole
   days (`custom`, ending yesterday), with `compare: true`.
2. `tracking_entry_pages`. Read `totals` first: it is the shop's average for every rate. Then each row
   of `page_types` and its `paths`:
   - `single_page_rate`: left after one page. On a product page that came from an ad, it is money
     spent on nothing.
   - `reached_product_rate`, `reached_cart_rate`, `reached_checkout_rate`: how far the sessions that
     landed here got. An order counts as every step.
   - `orders.conversion_rate`, `orders.revenue_per_session`: what a visit landing here is worth.
   - `converts_worse: true`: at least 30 sessions converting clearly worse than the rest of the view.
     These are the rows to report. It is an association, not proof the page is the cause.
   - `compare`: the same row in the period before. A path that fell from one period to the next
     usually changed (new design, sold out, price) or got different traffic.
3. For the type that matters most, call again with `entry_page_type` to get up to 100 of its paths.
4. Who lands there decides much of the result. For the worst row, call `tracking_entry_pages` again
   with one filter at a time: `channel` (`paid_social`, `paid_search`, `social`…), `device`,
   `visitor_kind: "new"`. A page that converts badly only for paid social is an ad problem (wrong
   audience or a promise the page does not keep), not a page problem.
5. See what visitors did on the worst path: `tracking_heatmap` with that `path` (and `device`), see the
   `page-ux` skill, and two or three sessions with `tracking_sessions` (`entry_path`), then
   `tracking_session_story`. When the `landing-scout` agent is available, hand it steps 4 and 5.

## Reading it

- Compare like with like. A home page always has a higher single-page rate than a product page, and a
  search page always converts better: its visitors already know what they want. Compare a path with
  other paths of the same type, or with itself last period.
- Under 200 sessions or 10 orders in a row: "too few visits to tell". `converts_worse` already needs 30
  sessions, but a fair verdict needs more.
- Orders without a visible session are only in `coverage.orders`, in no row. If that is a large part
  of the shop's orders, say the rows show only part of the sales.
- `coverage.without_entry_url`: sessions with no landing page recorded (a pixel-only session). They are
  in `other`, never under a path.
- A landing on `cart`, `checkout` or `thank_you` is a visitor coming back from a payment page or an
  e-mail reminder, not a landing page to optimise.

## What to write

- One line: where most visits land and how that compares with what sells.
- Up to three pages to fix, each with its sessions, what visitors do there (leave at once, never reach
  the cart), how it compares with the average for its type, and one concrete step ("the ad promises
  free delivery, the page shows it only in the cart: put it next to the price").
- One page that sells well and gets little traffic: point more ads, posts or links at it.
- Link: `https://app.quomerce.com/app/a/<account_id>/websites/<website_id>/tracking/sources/entry`.
