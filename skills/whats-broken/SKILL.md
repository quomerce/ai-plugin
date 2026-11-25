---
name: whats-broken
description: Find where shopping breaks on an online shop - the places where shoppers who wanted to buy got stuck, hit an error, could not pay or gave up - by picking their Quomerce recordings, watching them, trying the same steps on the live shop in a browser, and only then counting how many shoppers it hits. Use when someone asks if anything is broken, where people drop off or abandon the cart or checkout, why visitors do not buy, why payments fail, why sales dropped, what an error or Quomerce issue means, or asks for the weekly review.
license: MIT
compatibility: Needs the Quomerce MCP server (https://api.quomerce.com/mcp). A browser tool (Playwright MCP or the app's own browser) lets it test the live shop; without one it works from recordings only.
metadata:
  author: Quomerce
  version: "1.0.0"
---

# Is shopping broken somewhere?

The answer is a short list of places where shoppers get stuck. Each one is **seen in recordings**,
**tried on the live shop** where you can, and only then **counted**. It is not a dashboard: if you
are about to write a table of rates, go and watch a session instead.

Read `references/quomerce-basics.md` before the first Quomerce call, and
`references/live-testing.md` before you open the shop in a browser.

## 1. The shop and the period

- The shop: the host or id you were given, else `find_websites`. Then `get_website`.
- The period: the last 14 whole days, ending yesterday. Recordings of shoppers who reached the cart
  are kept 30 days, so a newer period has more to watch. A day the person named: that day.
- The person named one thing (an error, an issue link, a page, a payment method, a session): it is the
  only lead. Go to step 3. An issue link ends in `/tracking/issues/<fingerprint>`: start with
  `tracking_issue`. A link ending in `issues/behaviour-<key>` is a behaviour: `tracking_behaviours`
  with that `key`.

## 2. Collect leads

A lead is a place where shoppers who wanted to buy stopped, with sessions to watch. Call these
together; they do not depend on each other:

| Call | Gives |
|---|---|
| `tracking_leaks` | money leaks found by rules, each with recordings at the moment |
| `tracking_highlights` | shoppers with clear intent who did not order, why, and where (`by_stage`) |
| `tracking_behaviours` (no `key`) | `seen_in_recordings`: problems already seen in recordings, with sessions; behaviours that `converts_worse` |
| `tracking_issue_groups` with `status: "priority"`, `section: "sales"` | errors on product, cart and checkout pages that cost orders |
| `tracking_funnel` | the step that loses the most shoppers, and `stuck_at_payment` |

Do not report any of this. Turn it into **at most five leads**, each a place, what seems to happen
there, and sessions to watch. Put first:

1. a lead two sources agree on (a leak and a highlight group at the same step; an issue whose sessions
   are also in the highlights);
2. payment, checkout and cart before product pages, before browsing;
3. more shoppers before fewer.

Leave out: analytics and ad tags (`outside`), behaviours with `no_clear_difference`, oddities seen
once. A funnel step with no sessions before a step that has some is a step the shop does not send,
not a drop: note it under **Missing data**.

A lead with no sessions yet (a funnel step, a form field) gets them from `tracking_sessions`:
`reached_step: N, not_step: N + 1` left at that step; or from `tracking_next_step_detail`,
`tracking_issue`, or `tracking_sessions` with `behaviour`.

## 3. Watch two or three recordings per lead

For each session:

1. `tracking_session_story`. Find the moment: an error, a click that did nothing, back from the
   payment page, a long pause, the last page before leaving.
2. `tracking_session_screenshots` with `at` set to that moment and the screen before it. Look: a
   button under a banner, an error message, a price that changed, a delivery option missing, an empty
   cart, a spinner that never ends.
3. One line: what the shopper tried, what they saw, what they did next, and the recording link at the
   moment (`…/sessions/<id>?at=<time>`).

Then decide the lead:

- **Real**: two of three show the same thing.
- **Normal shopping**: comparing, reading, leaving to think. Drop it.
- **Unclear**: watch one more. Still unclear: drop it.

More than about six sessions to watch: hand them to a subagent (`session-watcher`) if your app has
one, with the website, the period, the lead and the session ids.

## 4. Try it on the live shop

For each real lead, do what the shoppers did, in a browser (`references/live-testing.md`): their
device, their page, their clicks. Stop before paying. Write down **reproduced**, **not reproduced**
(and what may differ), **could not reach** or **not tested**.

Then walk the main path once even without a lead, on a phone: home, a top product, add to cart, cart,
checkout, up to choosing the payment method. Something broken that you find yourself is a new lead:
find shoppers who hit it with `tracking_sessions` (`url`, `reached_step`) and watch one.

## 5. Count it

Only now: how many shoppers hit it in the period, out of how many reached that spot. Take the count
from where the lead came from (the highlight group's `similar`, the leak's sessions, the issue group's
sessions, the total of the `tracking_sessions` filter you used). Money only where a tool priced it
(`tracking_leaks`, an issue's revenue impact), with "about". A handful of shoppers in 14 days is
rare: keep it only if it stops everyone who meets it.

## 6. Write

At most three findings, the one that stops the most buyers first:

**What breaks, in shop words.** For example: "On iPhones the Pay button sits under the chat bubble."

- **Seen:** what shoppers did, with one or two recording links at the moment.
- **Tested:** reproduced on a phone, not reproduced, or not tested, with your steps in one line.
- **How many:** "38 of 410 shoppers who reached checkout, 10–23 Nov", and about how much money if a
  tool priced it.
- **Fix:** one or two concrete steps, and who does it (developer, content, payment provider). Quote
  the error message and the file or request it points to when there is one.

Then one line **Checked and fine** (what you watched or tested that works), and one line **Missing
data** only if the shop does not send something. Use `show_session_replay` for the one recording that
makes the top finding obvious, where the app can show it.

Under about 400 words. No tables of metrics, no tool names, no ids. If nothing real turned up, say so
and list what you watched and tried: that is a good answer, not a failure.

## Narrower questions

- **"Why did sales drop?"** First split the change: `tracking_overview` with `compare: true`,
  `tracking_calendar` and `get_uptime` for the same days. Fewer visitors: name the source that fell
  (`tracking_traffic_sources` with `compare: true`) and the day; that is a traffic question, not
  something broken. The same visitors buying less: find the step that fell, then steps 2 to 6 for
  that step and the days around the drop.
- **Payments.** `stuck_at_payment` in `tracking_funnel` gives the shoppers who tried to pay three
  times or more and never ordered, by method, device and browser, with examples to watch. Try the
  same method on the live shop up to the provider's page only.
- **One error.** `tracking_issue` for its trend, pages, browsers and stack, then steps 3 to 6.
- **The weekly review.** Last 7 days. At most two findings here, then run the `sell-more` skill for
  at most two ideas, so the review is four items at most.
- **The shop's code is open** (a coding agent in the shop's repository): after a finding, find the
  file from the stack or the element, propose the fix, and once it is live try it on the live shop
  as in step 4.
