---
name: sell-more
description: Find where an online shop can sell more to the visitors it already has - product pages that leave questions open, cross-selling and bundles from what buyers really buy together, upsells to a free-delivery threshold, promotions timed to when this shop's buyers buy, and changes that help shoppers decide (proof near the price, delivery certainty, less risk) - by watching Quomerce recordings of shoppers who almost bought, reading the shop's own order and click data, and looking at the live shop. Use when someone asks how to raise conversion or average order value, how to sell more, what to change on a product or cart page, for upsell, cross-sell, bundle or promotion ideas, what to test next, or asks for the weekly review.
license: MIT
compatibility: Needs the Quomerce MCP server (https://api.quomerce.com/mcp). Works best with Quomerce SQL and a browser tool (Playwright MCP or the app's own browser).
metadata:
  author: Quomerce
  version: "1.0.0"
---

# Where can the shop sell more?

Nothing is broken here; that is the `whats-broken` skill. Here shoppers could have bought and
hesitated, and buyers could have bought more. Find what they were missing, and propose **three
changes**, each tied to what real shoppers did and to a number from this shop, each one testable.

Read `references/quomerce-basics.md` before the first Quomerce call, `references/live-testing.md`
before you open the shop in a browser, and `references/sql.md` before writing SQL.

## 1. Know the shop

- The shop and `get_website`. Data: the last 28 whole days, ending yesterday (baskets need volume).
  Recordings: the last 14 days.
- Look at the live shop on a phone, as a shopper: the home page, the best-selling product page (step
  3 names it; until then the busiest product path from `tracking_heatmap` without `path`), and the
  cart with that product in it. Note what is there and what is not:
  - price, delivery cost and delivery date next to the buy button;
  - rating and number of reviews near the price;
  - a free-delivery threshold, and whether the cart shows how far away it is;
  - "goes with" or "bought together" suggestions, bundles, a better and a cheaper option;
  - returns, warranty, pay-later or instalments, for a basket of this size;
  - sizes, stock, variants;
  - pop-ups on arrival, and what they offer.
  Screenshot the product page's first screen.
- No browser: `tracking_heatmap` with `image: true` for that product page on mobile, and the shop's
  own texts from the `screen_text` query in `references/sql.md`.

## 2. Watch the shoppers who almost bought

- `tracking_highlights` once without filters: `by_reason` and `by_stage` say what this shop has.
  Then list the reasons that matter here with `reason`, the biggest first: `compared`, `long_look`,
  `cart_removed`, `left_cart`, `came_back`, `form_pause`, `search_failed`. Shops differ: one where
  every cart goes straight to checkout has no `cart` stage at all.
- `tracking_next_steps` with `point: "cart"` and `point: "product"`: pages shoppers escape to at the
  moment of buying (delivery, returns, size guide, FAQ) are questions the page does not answer.
- Watch four to six of them: `tracking_session_story`, then `tracking_session_screenshots` at the
  hesitation (on product pages the cursor's last two seconds are drawn in red: what were they looking
  at?). One line each: what they seemed to weigh, and where they left.

Look for the question they share: what will it cost with delivery, when will it arrive, will it fit,
which of these two, is it any good (no reviews), is it cheaper elsewhere (left to search), too little
for free delivery (removed an item or left at the total).

## 3. Read the money in the shop's data

With `sql_query` (queries in `references/sql.md`), else from the tools named:

- **Basket size.** The average order and how orders spread. How many orders fall just under the
  free-delivery threshold you saw in step 1. Many: an upsell to the threshold.
- **Bought together.** Products that share an order. A clear pair: suggest one with the other, or
  bundle them.
- **Viewed, not bought.** Products many open and few add to the cart: that page's offer (price,
  photos, information, reviews). Open it live and look at its heatmap.
- **What buyers use.** `tracking_heatmap` for the top product page on mobile: elements whose clickers
  order much more often than the page's visitors (`conversion_rate` against the page's) belong higher
  and bigger. The buy button below the 50 % scroll line is a finding.
- **When they buy.** Orders by weekday and hour, around paydays (`tracking_calendar`): when to run a
  promotion or send an e-mail.
- **Coming back.** How many visits and days buyers need, how many orders come from returning
  visitors: reminders, a saved cart, a reason to come back.

Every idea needs a number from this shop. No industry averages.

## 4. Turn it into three changes

Each change joins what shoppers did (step 2), a number (step 3), the change, why it should work, and
how to measure it. Use a principle only when the data points at it, never as a checklist:

- **Answer the question where it is asked**: delivery date and cost, returns, size, next to the buy
  button. Certainty sells.
- **Proof next to the price**: the rating and how many reviews; "bought 40 times this month" only if
  it is true.
- **Make the next step to more value easy**: progress to free delivery in the cart; one suggestion
  that buyers really buy together, priced to close the gap.
- **Help a choice**: a bundle, or a good, better, best line-up where shoppers go back and forth
  between two similar products.
- **Lower the risk**: free returns, pay later or instalments for large baskets, the warranty shown
  before the cart.
- **Promotions with a reason and an end**: timed to when this shop's buyers buy; a threshold offer
  just above today's average basket ("10 % off from 300 zł") rather than a discount on everything.

Never suggest dark patterns: fake scarcity, fake countdowns, pre-ticked extras, costs revealed at the
end, "No, I don't want to save money" buttons. They break EU consumer rules and cost trust.

Check on the live shop that the change is not there already. If it is there but hidden (below the
first screen on a phone), the change is to move it.

Rank by rough money a month: shoppers it reaches × a modest lift you state × the average order.
Write the assumption ("if 1 in 20 of them adds the monitor…") and call it an estimate. Cheap changes
first when the money is close.

## 5. Write

One line: where the shop leaves the most money and why. Then three changes, most money first:

**The change.** For example: "In the cart, show 'Free delivery from 199 zł: you are 23 zł away'."

- **Why:** what shoppers do now, with one recording link, and the number ("31 % of orders are
  150–199 zł").
- **Worth:** about how much a month, with the assumption.
- **Test it:** what to measure and for how long; on the day it goes live, ask for the `did-it-work`
  skill.
- **Effort:** a setting, a theme change, or a developer's task.

Under about 400 words. No tables of metrics, no tool names, no ids.

## Narrower questions

- **One page** ("review my product page"): step 1 for that page, its heatmap on mobile and desktop,
  three sessions that left it, then step 4 for that page alone.
- **A promotion for a date** (Black Friday, a payday, a holiday): basket spread, when buyers buy, the
  calendar. Propose the mechanic (threshold, bundle or gift) and its threshold from the numbers.
- **Average order value only:** steps 3 and 4 with basket size and bought together.
- **The weekly review:** at most two ideas, after the `whats-broken` findings.
