---
name: ultra-dive
description: The weekly deep review of an online shop - Quomerce data plus outside research - covering where it loses money, where its visitors and buyers really come from, how it compares with competitors and their prices, its online presence (TikTok, YouTube, reviews), and a clear strategy (fix conversion, bring visitors back, or get more traffic, and which ads) with a small test plan. Use when someone asks for the weekly review, an ultra dive, a deep dive, a full analysis of the shop, "what should I do this week?", "how do I sell more?", or runs /quomerce:ultra-dive (often on a schedule).
---

# Ultra dive: the weekly review

Read the `quomerce-data` skill first. It explains ranges, money, orders and consent.

The person wants to know what to do to sell more, backed by numbers they can check. That needs three
things: what Quomerce sees on the shop, where its visitors really come from, and what the market
around it looks like. A review that only reads the dashboard is not an ultra dive.

## 0. Set up

1. The shop: the argument (a host such as `goblinpc.pl`, or a website id), else `find_websites`. If
   there are several tracked shops and none was named, review each one briefly, or ask.
2. `get_website` for the time zone and currency.
3. The period: the last 7 whole local days, as a `custom` range ending yesterday, with
   `compare: true`. On a schedule, do the same; never include today. Traffic and market questions use
   the last 28 days, since a week is too few orders.
4. `tracking_setup` once. Note what the shop does not send (no purchases, no payment events, few
   consented visits). Say it once at the end, do not report it as a problem every week.
5. What the person already told you about the shop (in this chat, project instructions or memory):
   where sales come from, what they sell, past tests. Use it, and check it against the data.

## 1. The shop this week (Quomerce)

Call independent tools together.

| Area | Call | Look for |
|---|---|---|
| Overall | `tracking_overview` | revenue, orders, conversion, sessions against last week |
| Context | `tracking_calendar` (same range, compare) | holidays, paydays, trading Sundays, shopping days in either week |
| Funnel | `tracking_funnel` with `breakdown: "device"` | the step whose conversion fell most, and in which segment |
| Broken things | `tracking_issues` (`limit: 10`) | new or growing issues on cart, checkout or payment, with revenue impact |
| Payment | `stuck_at_payment` in the `tracking_funnel` result above | visitors stuck at payment, by method, device and browser, against last week |
| Forms | `tracking_forms` | a checkout field with many errors or refills |
| Speed | `tracking_pages` | a page type and device with poor LCP or INP and real traffic |
| Uptime | `get_uptime` (`hours: 168`) | downtime or a certificate near expiry |

## 2. Where visitors and buyers come from

Follow the `traffic-sources` skill: real channels, bursts, and the buyer's path. This is what tells
you whether ads run at all, how much social traffic hides as "direct" or as a search for the shop's
name, and whether buyers need several visits. When the `segment-scout` agent is available, hand it the
segment comparison (countries, devices, new vs returning) at the same time.

## 3. The shop's market (open web)

Follow the `market-research` skill, giving it the top products, average order value and burst dates
from steps 1 and 2. When the `market-researcher` agent is available, hand this to it and carry on with
step 4's reading meanwhile. If web search and fetching are not available, say so under **Missing
data** and base the strategy on Quomerce alone, saying so.

On a weekly schedule, competitors and prices change slowly: if last week's review is in the
conversation, refresh only prices of the top products and the shop's recent posts.

## 4. Dig where something stands out

If something above stands out and the tools do not explain it, dig with at most 3 SQL queries or
5 session stories (`tracking_sessions`, then `tracking_session_story`). When the
`payment-investigator` or `issue-investigator` agent is available, hand the reading of many sessions
to it.

## 5. The strategy

Follow the `growth-strategy` skill with everything above: price the three levers (fix conversion,
bring visitors back, more new visitors) in the shop's money, pick one and, if it needs one, the
channel, with reasons, why not the others, what must be fixed first so a test can be judged, and a
4-week test.

## Evidence rules

- A conversion difference needs at least 200 sessions in the group and 10 orders to compare. Below
  that, say "too few visits to tell".
- Always compare: with last week, with the rest of the shop, or with competitors.
- Money is an estimate: say "about". Never add up revenue impacts of different issues.
- A busy or quiet day next to a payday, a holiday or a trading Sunday: name it as a possible reason,
  not as the cause.
- A visitor who did not go on is not a lost customer. Do not present lost revenue as a fact.
- Never advise on an ad campaign you have not seen in the data (no ad clicks means no campaign).
- Quomerce sees one browser, not one person: do not claim people switch devices.
- Every outside fact has its link. What could not be read is said, not guessed.
- At most 4 findings in "Do this week". Drop the weakest rather than adding a fifth.

## What to write

Keep it under about 600 words. Use this shape every week, so it can be compared:

1. **Verdict**, one sentence: better, worse or about the same as last week, and the main reason.
2. **Strategy**, from step 5: push this, why (with numbers), why not the others, the test.
3. **Do this week**, 2 to 4 findings, most money first. Each: what happens, the number with its base
   ("47 of 1,006 visitors"), about how much money, one concrete step, and a link to the dashboard page
   or a recording.
4. **Where buyers come from**, 2 or 3 lines: the real channels, what is hidden, how many visits
   buyers need, the tagging step if traffic is hidden.
5. **Market**, 3 or 4 lines: price position on the top products, competitors, online presence, with
   links.
6. **Checked and fine**, one line.
7. **Missing data**, one line, only if something is not sent or could not be read.

Links: `https://app.quomerce.com/app/a/<account_id>/websites/<website_id>/tracking/<page>`, where
`<page>` is `overview`, `funnel`, `funnel/payments`, `forms`, `issues/<fingerprint>`, `sessions/<session_id>`,
`pages` or `heatmaps`. `tracking_session` and `tracking_session_story` return the session's own `url`.

If you ran interactively and one fact would change the strategy (for example where the shop posts, or
whether it ever ran ads), end with that one question.

## Running it every week

In Cowork, make this a scheduled task, for example every Friday at 16:00, with the command
`/quomerce:ultra-dive <shop host>`. The Quomerce dashboard's AI assistant page has the command ready to
copy.
