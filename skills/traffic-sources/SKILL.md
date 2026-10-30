---
name: traffic-sources
description: Work out where a shop's visitors and buyers really come from in Quomerce data - including traffic hidden as "direct" or as a Google search for the shop's name (TikTok, Instagram, YouTube, links in bios and chats), ad clicks, e-mail, AI assistants - and how many visits buyers need before they order. Use when someone asks where traffic or sales come from, which channel works, whether ads are running, why "direct" is so big, or before any advice about ads or marketing.
---

# Where do visitors and buyers really come from?

Read the `quomerce-data` and `quomerce-sql` skills first. The queries below are written for Quomerce
SQL. Replace `Europe/Warsaw` with the shop's time zone from `get_website`. Without the `sql_*` tools,
use only the first step and say the hidden traffic could not be checked. For one campaign, use
`campaign-check`.

## First: what Quomerce already classifies

`tracking_traffic_sources` for the period. It sorts sessions into `channels` (`paid_search`,
`organic_search`, `paid_social`, `social`, `email`, `referral`, `other_paid`, `direct`,
`unrecognized`, `not_collected`) and `rows` by source / medium with their campaigns, each with
sessions, orders, conversion and revenue. Its trust order is the UTM tag, then the ad-click id, then
the referring site. Read `coverage` before any share:

- `coverage.orders.without_session`: orders with no visible session (no consent, or a payment page
  that never sent the shopper back). They are in no channel. If they are a large part of
  `coverage.orders.total`, every channel's share of orders is a share of the visible part only.
- `coverage.not_collected`: sessions whose landing page was never read. Unknown, not direct.
- `coverage.conflicts`: the UTM tag and the click id or referrer disagreed. See `campaign-check`.

For one channel or source, `tracking_traffic_source_detail` gives its landing pages, campaigns, the
issues its visitors hit and sessions to open. Then use the queries below for what the classification
cannot see.

## Why the channel is not the whole story

Even with UTM tags, click ids and referrers read, a lot stays hidden:

- **Apps hide where they come from.** A link opened from TikTok, Instagram, Messenger, WhatsApp or an
  e-mail app often arrives with no referrer, so it is counted as `direct`.
- **Social shows up as Google.** Someone who watches a video and then types the shop's name into
  Google is a Google visit. A Google visit that lands on the **home page** is almost always a search
  for the shop's name, not a generic search. Generic searches land on products or categories.
- **Ad clicks are only visible when tagged.** A Google Ads click carries `gclid` (or `gbraid` /
  `wbraid`), a Meta ad `fbclid`, a Microsoft ad `msclkid` or the shop's own `utm_medium=cpc`. No such
  visits means **no ads are running that send people here**, whatever the source column says.
  TikTok ads show only with UTM tags for now.
- **A visit back from a payment page** (tpay.com, przelewy24.pl, payu.com, paypal.com and the like) is
  a buyer returning from paying, not a source of new people.
- **A visitor is one browser.** Quomerce cannot see one person moving from phone to computer. Never
  say "they watch on the phone and buy on the computer" from this data.

## Steps

Run the three queries together, for the last 28 days (or the period asked).

### 1. Real channels

```sql
SELECT multiIf(
    entry_url LIKE '%gclid=%' OR entry_url LIKE '%gbraid=%' OR entry_url LIKE '%wbraid=%'
      OR entry_url LIKE '%msclkid=%' OR utm_medium IN ('cpc', 'ppc', 'paid', 'paidsocial', 'paid_social'), 'ad click',
    match(referrer_domain, '(tpay|przelewy24|payu|paypal|stripe|paynow|imoje|blik|klarna|adyen)\\.'), 'back from payment',
    utm_source != '', concat('tagged: ', utm_source, if(utm_medium != '', concat(' / ', utm_medium), '')),
    match(referrer_domain, '(tiktok|facebook|instagram|youtube|threads|pinterest|linkedin|reddit|wykop)\\.')
      OR referrer_domain IN ('t.co', 'x.com', 'linktr.ee', 'l.messenger.com')
      OR browser IN ('Facebook App', 'Instagram App', 'TikTok App') OR entry_url LIKE '%fbclid=%', 'social (seen)',
    match(referrer_domain, '(chatgpt|perplexity|claude|copilot|gemini)\\.'), 'AI assistants',
    match(referrer_domain, '(^|\\.)(google|bing|duckduckgo|yahoo|ecosia|yandex|brave)\\.'),
      if(entry_page_type = 'home', 'search, landed on home (shop name)', 'search, landed deeper'),
    source = 'direct', if(entry_page_type = 'home', 'no referrer, home page', 'no referrer, deeper page'),
    'other sites') AS channel,
  count() AS visits,
  round(countIf(device_type = 'mobile') / visits * 100) AS mobile_pct,
  countIf(o.orders > 0) AS ordering_visits,
  round(ordering_visits / visits * 100, 2) AS conversion_pct
FROM sessions AS s
LEFT JOIN (SELECT session_id, count() AS orders FROM orders
  WHERE placed_at >= now() - INTERVAL 29 DAY GROUP BY session_id) AS o USING (session_id)
WHERE s.session_date >= today() - 28
GROUP BY channel
ORDER BY visits DESC
LIMIT 20
```

### 2. Bursts (virals, mentions, TV, newsletters)

```sql
WITH hourly AS (
  SELECT toStartOfHour(started_at, 'Europe/Warsaw') AS hour, count() AS visits,
    round(countIf(device_type = 'mobile') / visits * 100) AS mobile_pct,
    round(countIf(entry_page_type = 'home') / visits * 100) AS home_pct,
    round(countIf(source = 'direct' OR match(referrer_domain, '(^|\\.)google\\.')) / visits * 100) AS direct_or_google_pct
  FROM sessions WHERE session_date >= today() - 28
  GROUP BY hour)
SELECT hour, visits, mobile_pct, home_pct, direct_or_google_pct,
  round(visits / (SELECT median(visits) FROM hourly), 1) AS times_usual
FROM hourly
ORDER BY times_usual DESC
LIMIT 10
```

Hours at 3x the usual or more, over 85 % mobile, mostly home page, and almost all direct or Google
are the fingerprint of a **social video or post going viral**. Note the dates and hours: the
`market-research` skill can match them to the shop's posts.

### 3. The buyer's path

```sql
WITH buyers AS (
  SELECT s.visitor_id AS visitor_id, min(o.placed_at) AS ordered_at FROM orders AS o
  JOIN sessions AS s USING (session_id)
  WHERE o.placed_at >= now() - INTERVAL 28 DAY AND s.session_date >= today() - 29
  GROUP BY s.visitor_id)
SELECT first_source, first_landing, first_device, count() AS buyers,
  round(avg(visits), 1) AS avg_visits_up_to_order, round(avg(days), 1) AS avg_days_to_order
FROM (
  SELECT s.visitor_id AS visitor_id, argMin(s.source, s.started_at) AS first_source,
    argMin(s.entry_page_type, s.started_at) AS first_landing,
    argMin(s.device_type, s.started_at) AS first_device, count() AS visits,
    dateDiff('day', min(s.started_at), any(b.ordered_at)) AS days
  FROM sessions AS s JOIN buyers AS b USING (visitor_id)
  WHERE s.session_date >= today() - 90 AND s.started_at <= b.ordered_at
  GROUP BY s.visitor_id)
GROUP BY first_source, first_landing, first_device
ORDER BY buyers DESC
LIMIT 15
```

This counts only visits up to the first order, in the same browser. Buyers who need several visits
over several days are the case for retargeting and e-mail; buyers who order in the first visit are
not.

## Reading it

- **"Social (seen)" is the floor, not the size.** If there are viral-looking bursts, or "no referrer,
  home page" plus "search, landed on home" are most of the visits, say most social traffic is hidden
  and give the share as "probably most of these", not as a number.
- **Small groups:** under 200 visits or 10 ordering visits, say "too few to tell", except to note that
  something exists (a tagged e-mail with 3 orders from 21 visits is worth one line).
- **No ad clicks** means ads are off or untagged. Do not give advice on raising bids, budgets or
  targeting of a campaign you have not seen.

## The fix to suggest when traffic is hidden

Tag every link the shop controls with UTM, so the next review can count it:

- TikTok / Instagram bio link: `?utm_source=tiktok&utm_medium=social&utm_campaign=bio`
- Links under each video or in stories: the same with `utm_campaign=<video or date>`
- Newsletter and reminders: `utm_source=newsletter&utm_medium=email`
- Ads: auto-tagging on in Google Ads; `utm_source=meta&utm_medium=paid_social` on Meta; on TikTok ads,
  UTM parameters in the ad URL.

Google's [URL builder](https://ga-dev-tools.google/campaign-url-builder/) makes the links.

## What to write

Three to five lines in shop-owner words: where visits and orders really come from, what is probably
hidden and why, how many visits buyers need, and the one tagging step if traffic is hidden. Add a small
table only when asked.
