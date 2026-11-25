---
name: navigation-audit
description: Audit how shoppers find their way around an online shop - search, the menu, category lists, filters and paging, the home page, the product page layout on phones, and ad landing pages - from Quomerce paths, heatmaps and recordings and the live shop, and deliver it as a Quomerce-branded report (one HTML file that prints to PDF) with the top changes in order, the evidence for each, a plan and today's figures to measure against. Use when someone asks for a navigation, UX, layout, mobile or findability audit, why shoppers get lost or leave category pages, whether search, the menu or filters work, what to change on a landing page, or wants an audit or report on a shop to hand to its owner or team.
license: MIT
compatibility: Needs the Quomerce MCP server (https://api.quomerce.com/mcp) and an app that can write a file or show an HTML page. A browser tool (Playwright MCP or the app's own browser) reads the live shop and takes its screenshots; Quomerce SQL and Node.js help.
metadata:
  author: Quomerce
  version: "1.0.0"
---

# Navigation and layout audit

The answer is a **report**, not a chat reply: four to seven areas where shoppers lose their way, each
proven, each with changes concrete enough to hand to a developer, in the Quomerce template. Its worth
is that every line is true for this shop. Each fact is one of three kinds, and the report says which:

- **counted** in the shop's Quomerce data, with its base and period;
- **seen** in recordings of real shoppers, with a link to the moment;
- **tried** on the live shop, with a screenshot.

Taste is not a finding. "The menu looks dated" is out; "4 taps to the second-busiest category, and
shoppers in recordings do it twice" is in.

Read `references/quomerce-basics.md` before the first Quomerce call, `references/live-testing.md`
before you open the shop, `references/sql.md` before writing SQL, `references/areas.md` for what to
check in each area, and `references/report-design.md` before you write the report.

## 1. The shop, the period, the reader

- The shop: the host or id you were given, else `find_websites`; then `get_website` (time zone,
  currency, the account id for links).
- The period: the last 28 whole days, ending yesterday. If tracking started later, from its first
  day. Recordings: the last 14 days, so there is something to watch.
- `tracking_calendar` for the period: a sale (Black Friday, a summer sale) or a holiday changes
  traffic and lists. Say so under **Limits**, and plan big changes for after the busy season.
- The reader: write in the language the person writes in, unless they say the report is for someone
  who reads another (a Polish shop's owner: Polish). "Prepared by" is the name the person gives,
  else Quomerce.

## 2. Map how shoppers move

Before any page, learn where shoppers come in and where they go next. Call these together, on phones
(`device: "mobile"`) unless said otherwise:

| Call | Gives |
|---|---|
| `tracking_overview`, once per device (`mobile`, `desktop`) | sessions, conversion and revenue per device: how much worse phones do |
| `tracking_entry_pages`, without and with `device: "mobile"` | the doors: share of sessions by entry page type and busiest paths, single-page share, how many reach a product, conversion per door |
| `tracking_next_steps` with `point` = `home`, `category`, `search`, `product` | the first step after each page type: a product, another list, search, or nothing |
| `tracking_traffic_sources`, then `tracking_entry_pages` with `channel: "paid_search"` (and `paid_social`) | the paid landings, and how they do against the shop |
| `tracking_leaks` | `paid_landing` and `broken_page` leaks are navigation leads with recordings |
| `tracking_behaviours` (no `key`) | `list_ping_pong` (three or more products opened from a list and left within seconds) and `dead_end` (a page left at once for the one before), with where they happen and whether they convert worse; `seen_in_recordings` for layout problems already seen |
| SQL, `references/sql.md` | search use and what it does to buying; "not found" pages; how deep shoppers page through lists |

From this, write down in a few lines: the share of phones, the doors in order, the page type after
which most shoppers leave, and **the four to seven areas to dig into**, the most shoppers first. The
usual areas are search, category lists, the menu, the home page, the product page, paid landings,
content pages and broken links (`references/areas.md`). Skip an area the data shows works.

## 3. Read the shop as a shopper

Open the live shop on a phone (390 × 844), then once on a computer (1440 × 900). Close the cookie
banner as a shopper would; never order, sign up or pay (`references/live-testing.md`). Note what is
there before judging it:

- **Arrival:** what covers the page in the first seconds (cookie banner, discount pop-up, both).
- **Header and search:** a search field or only an icon; on which pages.
- **Menu:** open every top-level item and write the tree down: levels, labels, whether each panel
  starts with "see all", labels that are cut off, items that are really filters (colour, size,
  thickness), brands or categories in more than one place, what is missing (sale, new, bestsellers,
  gifts in season). Count the taps to the three busiest lists from step 2.
- **Search:** search the shop's best seller by name, the same word misspelt, a category word, and a
  word without accents. Note suggestions, the results, and the "nothing found" page.
- **The busiest list:** products on the first screen, where filters and sorting sit, numbered pages
  or "load more", what a tile shows, a filter combination that gives zero, and whether going back
  from a product returns to the same place.
- **The busiest product page:** where the name, price, variants and the buy button fall on a phone;
  breadcrumbs; anything floating over the button.
- **The top paid landing:** how far down the first product is.
- **Links in category texts and the footer:** follow the ones that look like searches or old pages.

Take a phone screenshot of each thing that becomes a finding, as a file (see **Pictures** in
`references/report-design.md`).

## 4. Heatmaps of the doors

`tracking_heatmap` with `image: true` and `device: "mobile"` for the pages that matter, at most six:
the home page, the busiest list, the busiest sale list, search results, the busiest product page,
the top paid landing. Add the home page on desktop when you compare search between devices. Each
takes 10–40 s.

Read three things. **Clicks:** the click rate of navigation elements (menu, search, filters,
sorting, next page, carousel arrows, pop-up buttons), and elements clicked a lot by shoppers who
then do not order. **Reach:** which of the page's key elements (category tiles, name and price, the
buy button, the first product) sit above the 75 % line and which below 50 %. **Arrival:** overlays
clicked in most views. You can see these pictures but not save them: the report links to the
heatmap and says what it shows.

## 5. Watch the shoppers in each area

For every area, two or three recordings that show the problem:

- `tracking_sessions` narrows to them: `entry_path`, `url`, `clicked_selector` with `clicked_path`,
  `journey`, `device`, `has_frustration`; `tracking_next_step_detail` for one row of next steps.
- `tracking_highlights` with `reason` `search_failed`, `compared`, `long_look`, `stuck` or
  `came_back`.
- `tracking_behaviours` with `key` (`list_ping_pong`, `dead_end`), or `tracking_sessions` with
  `behaviour` and `behaviour_place`, for that behaviour's sessions on one page.

Read each with `tracking_session_story`, then `tracking_session_screenshots` at the moment. One line
each: what the shopper tried, what they saw, what they did next, and the link with `?at=`. Say how
many of the watched recordings show it ("2 of 3"). An area no recording confirms is **to check**, or
it goes. More than about six recordings in all: hand them to `session-watcher` where your app has
it.

## 6. Count, decide and prioritise

- Every area keeps only facts that are counted, seen or tried. Give each area one level:
  **counted** (the main claim is a number from the data), **seen** (shown in recordings, two of
  three), **to check** (one recording, or a lead you could not try).
- Each change is for this shop: name its menu items, labels, pages and links. Check live that it is
  not there already. No dark patterns (fake countdowns, pre-ticked extras), and no change of
  addresses without redirects and the person who looks after search engines.
- Who fixes it: developer, shop content, marketing. How big: a **quick fix** (settings and content,
  up to two weeks), **2–6 weeks** (the theme or template), or **after the season** (structure,
  addresses, product data).
- Rank by shoppers reached × how hard it stops them × effort, cheap first when close. The top five
  go in the summary.
- For every change, the figure it should move and its value today, from a tool or query that can be
  run again: that table is how the change is judged later.

## 7. Write the report

Follow `references/report-design.md`. Its parts, in order:

1. **Cover:** the shop, the title, the answer in one or two sentences, the period, sessions, orders,
   who prepared it.
2. **Summary:** two sentences, three or four headline figures, the top five changes.
3. **Contents.** 4. **Where the data comes from.** 5. **How shoppers move:** devices, doors, next
   steps, search.
6. **The areas**, most shoppers first. Each: the problem in shop words as its title, one or two
   sentences with the number, the level, owner and size; **What we see**; **Where to see it**
   (recordings, pages, heatmaps); a screenshot, a link card or bars; **What to change**, numbered.
7. **Plan:** quick fixes, 2–6 weeks, after the season, as boxes to tick.
8. **How to measure:** figure, today's value, the change it tracks.
9. **Limits:** period, consent, sale season, correlation, nothing tested yet.
10. **Sources:** every recording, report and page the findings rest on.

As long as the evidence, no longer: three to six facts and three to six changes per area. No tool
names, ids or SQL in the text.

Save it as `<host>-navigation-audit-<YYYY-MM-DD>.html` in the working folder, or where the person
asks, and build it with `scripts/build-report.mjs` where you can run Node (it embeds the pictures
and flags placeholders left). Where your app can publish or show an HTML page (an artifact, a
canvas), do that too. In the chat, give the five top changes in five lines and where the report is,
not the report again. Mention once that **Save as PDF** at the top prints it on A4.

## Narrower requests

- **One area** ("audit our search", "is our menu any good", "review this landing page"): steps 1
  and 2 for what concerns it, steps 3 to 6 for that area, and the same report with one area,
  without the plan columns.
- **Another report in this design:** when the person wants the findings of `whats-broken` or
  `sell-more` as a document, use the same template and `references/report-design.md`, one area
  section per finding.
- **No browser:** work from heatmap pictures and recordings, mark what you could not try as **to
  check**, and say in **Limits** that the live shop was not opened.
- **No file:** an app that can neither write a file nor show a page gets the same report as
  Markdown, and one line saying the branded file needs an app that can save files.
