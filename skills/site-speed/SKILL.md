---
name: site-speed
description: Check whether an online shop is slow where it matters, from the Core Web Vitals Quomerce measures on real visits (LCP, INP, CLS) by page type, path and device, and whether slow visits order less. Use when someone asks if the shop is slow, about page speed, Core Web Vitals, PageSpeed or Lighthouse scores, whether speed costs sales, or which page to speed up first.
---

# Site speed on real visits

Read the `quomerce-data` skill first.

Quomerce measures speed in real visitors' browsers, so the numbers differ from a PageSpeed or
Lighthouse test of one page load. Real visits are what matter for sales.

## Steps

1. Find the website. Period: the last 28 whole days, with `compare: true`.
2. `tracking_pages`. Read:
   - `page_types` and `top_paths`: per row, `views`, `exit_rate`, `js_errors_per_1000_views` and
     `vitals` per device with the 75th percentile (`lcp_p75`, `inp_p75` in ms, `cls_p75`).
   - `speed.ratings`: per device and metric, how measurements split into good, needs improvement and
     poor.
   - `speed.series`: the trend. A step up on one day usually means something was deployed or added
     (a new script, an app, a large image).
3. Google's bands, at the 75th percentile:

   | Metric | Good | Poor |
   |---|---|---|
   | LCP (main content shown) | ≤ 2,500 ms | > 4,000 ms |
   | INP (reaction to a tap or click) | ≤ 200 ms | > 500 ms |
   | CLS (layout jumping) | ≤ 0.1 | > 0.25 |

4. Pick the rows that matter: poor or needing improvement **and** with real traffic, on the pages that
   lead to orders (product, category, cart, checkout). A slow page few people see is not a priority.
5. Does it cost orders? With the `sql_*` tools, run the `speed_vs_conversion` recipe from `sql_schema`
   and, as a second query, the same split by `device_type`. Without them, compare the conversion of
   the device that is slow (`tracking_overview` with `device`) with the other, and say this is only a
   hint.

## Reading it

- **Device mixes everything.** Phones are slower and convert worse for many reasons. Slow visits
  ordering less across all devices proves nothing; slow visits ordering less **on the same device** is
  a real hint. Still say "goes with", not "causes".
- A p75 from under about 100 measurements is rough. Say so.
- High `js_errors_per_1000_views` on a slow page: the two are often the same script. See
  `issue-triage`.
- A poor INP on cart or checkout is worse than a poor LCP on the home page: it is the buy button
  reacting late.

## What to write

- One line: fast, mostly fine, or slow, and on which device.
- Up to three pages to speed up, each with its views, the poor metric and its value against the band,
  and the likely cause to check (large hero images for LCP, heavy third-party scripts or chat widgets
  for INP, images and banners without set sizes for CLS).
- Whether slow visits order less on the same device, if you could check.
- Link: `https://app.quomerce.com/app/a/<account_id>/websites/<website_id>/tracking/pages`.
