---
name: ultra-dive
description: The weekly deep review of an online shop from Quomerce data - where it loses money, where it can grow (countries, devices, sources, visitor groups) and what would lift conversion - as 3 to 5 findings with numbers, money and next steps. Use when someone asks for the weekly review, an ultra dive, a deep dive, a full analysis of the shop, "what should I do this week?", or runs /quomerce:ultra-dive (often on a schedule).
---

# Ultra dive: the weekly review

Read the `quomerce-data` skill first. It explains ranges, money, orders and consent.

The person wants a short list of things worth doing this week, each backed by numbers they can
check. Not a report of every figure. Work through the fixed checklist, then use the free part only
where something stands out.

## 0. Set up

1. The shop: the argument (a host such as `goblinpc.pl`, or a website id), else `find_websites`. If
   there are several tracked shops and none was named, review each one briefly, or ask.
2. `get_website` for the time zone and currency.
3. The period: the last 7 whole local days, as a `custom` range ending yesterday, with
   `compare: true`. On a schedule, do the same; never include today.
4. `tracking_setup` once. Note what the shop does not send (no purchases, no payment events, few
   consented visits). Say it once at the end, do not report it as a problem every week.

## 1. The fixed checklist

Call independent tools together. Budget: about 25 tool calls in total.

| Area | Call | Look for |
|---|---|---|
| Overall | `tracking_overview` | revenue, orders, conversion, sessions against last week |
| Context | `tracking_calendar` (same range, compare) | holidays, paydays, trading Sundays, shopping days in either week |
| Funnel | `tracking_funnel` with `breakdown: "device"`, then `"source"` | the step whose conversion fell most, and in which segment |
| Broken things | `tracking_issues` (`limit: 10`) | new or growing issues on cart, checkout or payment, with revenue impact |
| Payment | `tracking_payment_retries` | visitors stuck at payment, by method, device and browser, against last week |
| Forms | `tracking_forms` | a checkout field with many errors or refills |
| Speed | `tracking_pages` | a page type and device with poor LCP or INP and real traffic |
| Uptime | `get_uptime` (`hours: 168`) | downtime or a certificate near expiry |

## 2. Growth

Find one or two places to push. Use the overview with one filter at a time (`country`, `device`,
`source`) for the biggest values, or one SQL query (see `quomerce-sql`, recipes
`conversion_by_country_device` and `conversion_by_source`).

- **Grow here:** a segment with conversion clearly above the shop's average and small traffic.
  "More ads for Germany on desktop."
- **Fix here:** a segment with a lot of traffic and conversion clearly below average.

When the `segment-scout` agent is available (Claude Code, Cowork), hand this part to it.

## 3. The free part

If something above stands out and the tools do not explain it, dig with at most 3 SQL queries or
5 session stories (`tracking_sessions`, then `tracking_session_story`). When the
`payment-investigator` or `issue-investigator` agent is available, hand the reading of many sessions
to it.

## Evidence rules

- A conversion difference needs at least 200 sessions in the group and 10 orders to compare. Below
  that, say "too few visits to tell".
- Always compare: with last week, or with the rest of the shop.
- Money is an estimate: say "about". Never add up revenue impacts of different issues.
- A busy or quiet day next to a payday, a holiday or a trading Sunday: name it as a possible reason,
  not as the cause.
- A visitor who did not go on is not a lost customer. Do not present lost revenue as a fact.
- At most 5 findings. Drop the weakest rather than adding a sixth.

## What to write

Keep it under about 350 words. Use this shape every week, so it can be compared:

1. **Verdict**, one sentence: better, worse or about the same as last week, and the main reason.
2. **Do this week**, 3 to 5 findings, most money first. Each: what happens, the number with its base
   ("47 of 1,006 visitors"), about how much money, one concrete step, and a link to the dashboard page
   or a recording.
3. **Grow here**, 1 or 2 segments.
4. **Checked and fine**, one line.
5. **Missing data**, one line, only if something is not sent.

Links: `https://app.quomerce.com/app/a/<account_id>/websites/<website_id>/tracking/<page>`, where
`<page>` is `overview`, `funnel`, `payments`, `forms`, `issues/<fingerprint>`, `sessions/<session_id>`,
`pages` or `heatmaps`. `tracking_session` and `tracking_session_story` return the session's own `url`.

## Running it every week

In Cowork, make this a scheduled task, for example every Friday at 16:00, with the command
`/quomerce:ultra-dive <shop host>`. The Quomerce dashboard's AI assistant page has the command ready to
copy.
