---
name: why-did-sales-drop
description: Find out why a shop's orders, revenue, conversion or traffic changed, using Quomerce data. Use when someone asks why sales dropped or rose, why conversion fell, why there were fewer orders or visitors on a day or week, or what changed.
---

# Why did sales change?

Read the `quomerce-data` skill first.

The goal is to split one change into its causes: fewer visitors, or the same visitors buying less, and
in that case where they stopped and what broke.

## Steps

1. Find the website and its time zone and currency.
2. Fix the period. "Yesterday" is `range: "yesterday"`; "last week" is a `custom` range of those seven
   local days; otherwise use what the person said. Always `compare: true`. If the period includes
   today, say today is not over.
3. `tracking_calendar` for the same range with `compare: true`. Note holidays, trading Sundays,
   paydays and shopping days in either period: they can explain a change by themselves.
4. `tracking_overview` for the period. Decide which moved:
   - **sessions** fell → a traffic question. Go to step 5.
   - **conversion** fell with steady sessions → a buying question. Go to step 6.
   - both → do both, traffic first.
   - orders unavailable → say so, use sessions and the funnel only, and suggest `setup-check`.
5. Traffic: call `tracking_funnel` with `breakdown: "source"`, then `"device"`, then `"country"`. Name
   the source or segment that lost the most sessions. Check `get_uptime` for the period: downtime
   explains a sudden drop better than anything else.
6. Buying: `tracking_funnel` (with `compare: true`) to find the step whose conversion fell most. Then
   break that step down by `device`, `browser` and `payment_method` to see if one segment explains it.
   If the step is payment, `tracking_payment_retries` shows visitors who tried to pay and never ordered.
7. Look for a cause at that step: `tracking_issues` for the period sorted by `sessions`; prefer issues
   that are new or that started near the drop, and on the cart, checkout or payment pages. Open the top
   candidate with `tracking_issue`.
8. If one segment and one issue line up (for example, iPhone Safari and a checkout script error that
   started the same day), that is the likely cause.

## What to write

- First line: the main cause in plain words, with how sure you are ("very likely", "possible").
- Then the evidence: the numbers before and after, the step, the segment, the issue.
- Then what to do: one or two concrete steps, and the dashboard page to look at.
- If a calendar day lines up (a holiday, the end of a payday window, Black Friday last year), name it as a
  possible reason, not as the cause.
- If nothing explains it (no issue, no segment, no downtime, no calendar day), say so honestly. Suggest
  outside causes to check: a campaign that ended, prices, stock, a change on the shop. To check whether
  one change helped or hurt, use the `before-after` skill.
