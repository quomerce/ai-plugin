---
name: store-checkup
description: A quick health check of an online shop from Quomerce data, with the 3 to 5 things that matter most. Use when someone asks how their shop or store is doing, for a weekly or daily summary, a status report, "anything I should know?", or "how was yesterday/this week/this month?".
---

# Store checkup

Read the `quomerce-data` skill first. It explains ranges, money and orders.

## Steps

1. Find the website (`find_websites`, then `get_website` for time zone and currency).
2. Pick the period: what the person asked, else `7d`. Always pass `compare: true`.
3. Call these (they are independent, so call them together):
   - `tracking_overview` for sessions, orders, revenue, conversion, the funnel and top issues;
   - `tracking_issue_groups` with the same range, `limit: 10`, for what is failing most;
   - `tracking_behaviours` with the same range, for shopper behaviour that goes with fewer orders
     (only `converts_worse` counts);
   - `get_uptime` with `hours` matching the period (at most 168) for downtime and certificate problems.
4. Only if something stands out, look one level deeper:
   - conversion or orders moved more than about 15 %: `tracking_funnel` with `breakdown: "device"` to see
     which step and which device moved;
   - a new or spiking issue near cart or checkout: `tracking_issue` for its trend and pages.

## What to write

- One sentence verdict first: better, worse or about the same as the period before, and why.
- Then 3 to 5 findings, the most costly first. Each one: what happened, the number, what it means for
  the shop's money, and one next step. Example:
  "Checkout errors doubled since Tuesday: about 140 visitors hit a payment script error, worth roughly
  2,300 zł in lost orders. Look at the issue on the Issues page."
- End with what looks fine, in one line, so the reader knows it was checked.
- If orders are unavailable, say so once and suggest `setup-check`, then report the rest.
- Keep it under about 200 words unless asked for more.
