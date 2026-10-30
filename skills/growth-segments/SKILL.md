---
name: growth-segments
description: Find where an online shop can grow, from Quomerce data - countries, devices, traffic sources or new vs returning visitors that convert well but get little traffic, and big segments that convert badly. Use when someone asks where to grow, which country or channel to push, where to spend on ads, which segment converts best, or how mobile compares with desktop.
---

# Where can the shop grow?

Read the `quomerce-data` skill first.

## Steps

1. Find the website, its time zone and currency. Period: what the person said, else the last 28 whole
   days (`custom`, ending yesterday).
2. The shop's average: `tracking_overview` without filters.
3. Each segment against it. Either:
   - SQL (when the `sql_*` tools exist): the `conversion_by_country_device`, `conversion_by_source`
     and `new_vs_returning` recipes from `sql_schema`; or
   - tools: `tracking_overview` with one filter at a time (`device`, then the top `country` values,
     then `visitor_kind: "new"` and `"returning"`), and `tracking_funnel` with
     `breakdown: "country"`.
   For channels and campaigns, `tracking_traffic_sources` gives every one in a single call, with
   conversion and revenue per row. For landing pages, `tracking_entry_pages` does the same (see
   `landing-pages`).
4. Sort the segments into:
   - **grow here:** conversion at least about 1.3x the average, traffic under about 10 % of sessions;
   - **fix here:** traffic over about 15 % of sessions, conversion under about 0.7x the average. For
     these, `tracking_funnel` filtered to the segment shows the step where it falls behind.
5. Ignore segments under 200 sessions or 10 orders: say they are too small to tell.

Traffic sources need more care than countries or devices: a lot of social traffic arrives as
`direct` or as a Google search for the shop's name. For sources, follow `traffic-sources`.

When the `segment-scout` agent is available, give it the shop and period and use its result.

## What to write

- At most two "grow here" and two "fix here" lines. Each: the segment, its conversion against the
  average, its share of visits, and what to do ("raise the budget for Google Ads in Czechia", "check the
  mobile checkout, it loses most at payment").
- Say conversion counts visits with consent only, and orders the browser reported.
