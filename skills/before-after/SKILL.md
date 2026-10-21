---
name: before-after
description: Check whether a change on an online shop helped, using Quomerce data, by comparing two equal periods before and after the day of the change. Use when someone asks if a new version, a redesign, a new payment method, a price change, a campaign or a fix made things better or worse.
---

# Did the change help?

Read the `quomerce-data` skill first.

## Steps

1. Ask for the day the change went live if the person did not say it. Without it, do not guess.
2. Days since the change, today not counted: `n` (at most 46). Fewer than 3: say it is too early.
3. Two periods of `n` days: before = the `n` days ending the day before the change, after = the `n`
   days from the change day. Both `custom` ranges.
4. Call for each period: `tracking_overview`, `tracking_funnel`, and what the change was about (for a
   payment change the funnel's `stuck_at_payment`, for a form `tracking_forms`, for speed `tracking_pages`,
   for a fix `tracking_issue` of that issue).
5. `tracking_calendar` for both periods: a holiday, a payday window or Black Friday in one period
   and not the other can explain the difference by itself.

## What to write

- First line: helped, hurt, or too early to say.
- The figures that matter, before → after, each with its base (sessions, orders).
- Below 200 sessions or 10 orders in a period, say the sample is too small.
- Name other things that differ between the periods (calendar days, a campaign, an issue) and say they
  could explain part of the change.
