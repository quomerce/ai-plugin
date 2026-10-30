---
name: page-ux
description: Read how visitors use one page of an online shop from Quomerce heatmaps - which elements they click, how far they scroll, which clicks go with orders, and buttons that do nothing. Use when someone asks whether people click a banner, button or filter, how far they scroll, whether the page is too long, what to put at the top, which element sells, or to review a product, category, cart or home page.
---

# Page UX: clicks, scroll and revenue on one page

Read the `quomerce-data` skill first.

## Steps

1. Find the website. Period: the last 28 whole days unless the person said otherwise. A heatmap needs
   volume; under about 300 page views say the picture is rough.
2. The page: the path the person named (no host, no query: `/produkt/abc`), else call
   `tracking_heatmap` without `path` and pick from `pages` (the busiest paths). For a page type rather
   than one path, take its busiest path from `tracking_pages` or `tracking_entry_pages`.
3. `tracking_heatmap` with `path` and `device: "mobile"`, then the same with `device: "desktop"`. Most
   shops get most visits on phones, and the two layouts are different pages.
4. Read:
   - `zones`: per element, `clicks`, `click_rate` (share of page views with a click on it) and `text`.
     The top 5 to 10 zones say what the page is used for. `hidden_zones` were clicked too rarely to
     show.
   - `scroll.reached[i]`: the share of page views that reached i × 5 % of the page height. Find where
     it falls under 50 % and under 25 %, and what sits below that line.
   - `revenue.zones`: per element, `conversion_rate` and `revenue_per_click_session` against the
     page's own (`page_ordered_sessions` / `page_sessions`). An element whose clickers order much more
     often than the page's visitors is what buyers use: make it easier to find. One clicked a lot by
     people who rarely order is a distraction, or a sign of a problem (a size chart opened again and
     again).
   - `widths`: page views by screen width. If they spread widely (small phones and tablets, laptops
     and large screens), say the layout differs between them and the dashboard can narrow the map to
     one width.
5. Dead clicks: `tracking_issue_groups` with `kind: "dead_click"`, and `tracking_issue` for the groups
   whose page is this one. A dead click on an element that is also in the top zones (match it by its
   text) is a broken or misleading element: an image that looks like a button, a disabled "add to
   cart" with no message.
6. To see it happen: `tracking_sessions` with `clicked_selector` (from a zone), `clicked_nth` and
   `clicked_path`, then `tracking_session_story` for two or three of them.

## Reading it

- Clicks show interest, not success. Always read them with the revenue figures and the sessions.
- Elements clicked by under 1 % of views are noise, unless they are what the person asked about.
- A main action (add to cart, the size picker) below the 50 % scroll line on mobile is a finding.
- An element with the same selector repeated (product tiles) has one zone per position (`nth`). Look
  at position 0 against later ones: tiles far down a list are clicked less because they are seen less.

## What to write

- What visitors use the page for, in one sentence, on mobile and on desktop.
- 2 or 3 findings with numbers: "Only 38 % of mobile visitors scroll to the reviews, but those who open
  them order 2.1x as often. Move a review summary next to the price."
- A dead or misleading element, if any.
- Link: `https://app.quomerce.com/app/a/<account_id>/websites/<website_id>/tracking/heatmaps?path=<path>`.
