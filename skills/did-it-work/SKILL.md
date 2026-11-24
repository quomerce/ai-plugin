---
name: did-it-work
description: Check whether a change on an online shop worked - a fix, a new checkout or cart, a redesign, a new payment or delivery method, a price change, an upsell, a promotion or a test - by trying it on the live shop, watching Quomerce recordings of shoppers who went through it since, checking the old problem is gone, and comparing the one figure the change was meant to move before and after. Use when someone asks whether a change, release, fix, campaign or experiment helped or hurt, whether a problem is gone, or to follow up on a finding from whats-broken or an idea from sell-more.
license: MIT
compatibility: Needs the Quomerce MCP server (https://api.quomerce.com/mcp). A browser tool (Playwright MCP or the app's own browser) lets it check the change live.
metadata:
  author: Quomerce
  version: "1.0.0"
---

# Did the change work?

A change works when it is live, shoppers use it, the problem it was for is gone, and the figure it
was meant to move moved. Check them in that order: the first two need no waiting, and a change that is
broken live needs no statistics.

Read `references/quomerce-basics.md` before the first Quomerce call, and
`references/live-testing.md` before you open the shop in a browser.

## 1. What changed

You need three things. Ask for what you were not told, and never guess the day:

- **When** it went live (a day, or a day and hour).
- **Where**: the page, the step, the element, the devices.
- **What it was for**: a problem to go away (an error, a behaviour, a reason in the highlights, a money
  leak) or a figure to rise (a step's conversion, baskets, add to cart on a page).

If it follows a finding or an idea from earlier in the conversation or memory, take all three from
there, with the recordings and the counts it had.

`n` = whole days since the change, today not counted, at most 46. Under 3: too early for figures, but
do steps 2 and 3.

## 2. Is it live, and does it work?

In a browser (`references/live-testing.md`), on a phone and on a desktop: open the changed spot. Is
the change there? Does it do what it should? Does the step after it still work (the button still adds
to the cart, the next page still loads, no new console errors)? For a fix, repeat the exact steps that
reproduced the problem.

Missing or broken: that is the answer. Say what you saw, with a screenshot, and stop.

## 3. Watch shoppers who went through it since

Find sessions from the change day on that reached the changed spot, with `tracking_sessions`: `url` or
`entry_path` for a page, `journey`, `clicked_selector` with `clicked_path` for a new element (from
`tracking_heatmap`), `behaviour` for a behaviour, `reached_step` for a step. Watch three:
`tracking_session_story`, then `tracking_session_screenshots` at the spot.

- Did they see it and use it? For a new element, its clicks in `tracking_heatmap` since the change.
- For a fix: does anyone still hit the old problem? `tracking_issue` for its fingerprint (when it was
  last seen, sessions per day after the change), `tracking_highlights` with the old `reason`,
  `tracking_leaks` for the old leak, `tracking_behaviours` with the old `key`.
- Anything new that got in the way? `tracking_issue_groups` with `status: "new"` from the change day,
  on that page.

## 4. The one figure, before and after

Two periods of `n` days: before ends the day before the change, after starts on the change day. Both
`custom`, with no `compare`. Measure only what the change was for:

| Change | Figure | From |
|---|---|---|
| A fix for an error | shoppers hit per day; the conversion of the step it was on | `tracking_issue`, `tracking_funnel` |
| Cart or checkout | that step's conversion | `tracking_funnel` |
| Payment | shoppers stuck at payment; the payment step by method | `tracking_funnel` (`stuck_at_payment`, `breakdown: "payment_method"`) |
| A form | that field's drop and error rate | `tracking_forms` |
| Product page, upsell, cross-sell | add to cart on that page; average order; products per order | `tracking_entry_pages`, `tracking_heatmap`, the basket query in `sql_schema` or the `sell-more` skill |
| A promotion | orders and average order, and the weeks after (did it only move sales earlier?) | `tracking_overview` |
| Speed | that page type's loading and reaction times on the device | `tracking_pages` |

Then what else differs between the two periods: `tracking_calendar` for both (holidays, paydays,
shopping days), and `tracking_traffic_sources` for both if a campaign started or stopped.

Be fair:

- At least 200 sessions and 10 orders in each period before a conversion verdict. Short of that:
  too early. Work out the day the after period will have enough at today's pace and say it.
- Whole weeks on both sides when you can (`n` = 7, 14, 21…), so weekdays match.
- Name what else changed between the periods. It may explain part of the difference.

## 5. Write

First line, one of: **Worked**, **No visible change**, **Made it worse**, **Too early: check again
on <date>**.

- **Live:** what you saw on the phone and the desktop.
- **Shoppers:** what three shoppers did at the spot, with one or two recording links; whether the old
  problem still shows up.
- **The figure:** before and after, each with its base ("62 of 540 → 81 of 525 shoppers who opened
  the cart"), and what else differed.
- **Next:** keep it, roll it back, or what to adjust, and when to look again.

Under about 300 words. If your app can schedule a task, offer to run this check again on that date.
