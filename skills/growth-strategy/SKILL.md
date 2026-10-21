---
name: growth-strategy
description: Decide what a shop should push to sell more - fixing conversion, bringing back visitors who did not buy, or getting more new visitors - and which channel (Google Search or Shopping, YouTube, TikTok, Meta, e-mail, own content), with reasons from Quomerce data and the market, and a small test plan. Use when someone asks how to sell more, whether to focus on conversion or traffic, which ads to try, where to spend a marketing budget, or as the strategy part of the weekly review.
---

# What to push to sell more

Read the `quomerce-data` skill first. This skill decides; it needs facts from three others. Use what
is already in the conversation, else run them:

- `traffic-sources`: where visitors and buyers really come from, hidden social traffic, whether any
  ads run now, how many visits buyers need.
- `market-research`: prices against competitors, the shop's online presence, how competitors get
  customers.
- The funnel and what is broken (`checkout-funnel`, `stuck-at-payment`, `tracking_issues`).

If the person told you something about the shop (in this chat, project instructions or memory, such
as "our sales come from TikTok"), it counts as a fact; check it against the data and say if the data
disagrees.

## 1. Price the three levers in money

Use the shop's own numbers for the last 28 days: visits, orders, average order value.

1. **Fix conversion.** What a realistic fix is worth: for example, mobile converting half as well as
   desktop on 80 % of visits; if mobile reached three quarters of desktop's rate, that is about N more
   orders a month. Only count a leak that has evidence (a broken step, a payment problem, a form
   field), never "conversion could be higher".
2. **Bring back visitors who did not buy.** Carts and checkouts without an order, and how many visits
   buyers need. Many visits over several days, and many abandoned carts, make this lever big.
3. **More new visitors.** What extra traffic is worth at today's conversion, and where it could come
   from: the channel that already works (more of the same content), or a new one.

Fix first what loses buyers who are already paying (payment, checkout errors): every other lever
pours more people into the same hole. Otherwise pick the lever with the most money per effort.

## 2. Pick the channel, if the lever needs one

| What the data shows | Channel that fits | Why |
|---|---|---|
| Bursts and hidden social traffic, the shop already posts videos that do well | Paid boost of its best organic videos on the same platform (TikTok Spark Ads, Instagram/Facebook Reels), and the same videos on YouTube Shorts | the creative is proven; the audience is the one that already buys |
| Buyers need several visits over days; high price; many abandoned carts | Retargeting of past visitors (Google Demand Gen or YouTube, Meta), and e-mail or reminder messages | the money is in people who already came |
| People search for the category, and the shop's prices are competitive | Google Shopping, then search ads on product terms | demand already exists; price is what wins the click |
| The shop is more expensive than competitors on the same product | Not search or Shopping on generic terms | the comparison is one click away; push what makes it different instead |
| Many visits search the shop's name | No paid brand ads, unless a competitor bids on the name | those clicks are free already |
| A tagged e-mail or reminder converts well on small numbers | Grow the list and send more of it | it is the cheapest channel |

Compare at least two options against the shop's facts, pick one, and say why the others lose.
Do not recommend Performance Max or broad automatic campaigns for a first test on a small budget: they
mix in free brand traffic and make results look better than they are.

## 3. Check the test can be judged

Before any paid test, list what must be true, and which of them is not yet:

- Orders are counted reliably: Quomerce's orders roughly match the shop's own admin. If buyers who pay
  often do not come back from the payment page, the ad platform will not see the sale either; send
  paid orders from the payment provider's notification or the shop's server (Google Ads offline
  conversions, Meta Conversions API, TikTok Events API).
- In the EU, consent mode or the platform's consent setting is on, or retargeting lists stay empty.
- Every link the shop controls carries UTM tags (see `traffic-sources`), so the test shows up as its
  own source in Quomerce.
- The platform has enough signal to learn from: with only a few orders a week, optimise for an earlier
  step (checkout started) first.

## 4. The test plan

One channel, 4 weeks, a fixed budget. Give a budget as a rule the owner can apply ("about your margin
on two orders"), not a number you cannot back. The success line: cost per order under the margin on
one order, read from the ad platform and checked against Quomerce's tagged source. Say what you will
look at in the next weekly review.

## Rules

- Every claim about the shop comes from Quomerce or from a source you read in this run. A guess is
  written as a guess ("probably", "worth checking").
- Never advise on a campaign you have not seen: no ad clicks in the data means no campaign to adjust.
- Quomerce sees one browser, not one person: do not claim people switch devices.
- No industry benchmarks without a source read in this run.

## What to write

At most about 200 words, in shop-owner words:

1. **Push this:** the lever and the channel in one sentence.
2. **Why:** three or four reasons, each with a number from the shop or a linked fact from the market.
3. **Why not the others:** one line each.
4. **First fix this, or the test can't be judged:** only what is missing.
5. **The test:** channel, length, budget rule, success line.
