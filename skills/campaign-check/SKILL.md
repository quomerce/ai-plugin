---
name: campaign-check
description: Check how one ad campaign, newsletter or channel is doing on an online shop from Quomerce traffic sources - its visits, orders, conversion and revenue against the shop, where it lands, what errors its visitors hit, and whether its links are tagged correctly. Use when someone asks whether a campaign, ad, newsletter, influencer link or channel works, compares campaigns, asks why a campaign has visits and no orders, or asks if their UTM tags are right.
---

# Campaign check

Read the `quomerce-data` skill first. For where traffic comes from overall, use `traffic-sources`.

## Steps

1. Find the website, its time zone and currency. Period: the campaign's dates if known, else the last
   28 whole days, with `compare: true`.
2. `tracking_traffic_sources` without filters. It gives the shop's totals, `channels` and `rows`
   (source / medium with their busiest `campaigns`), and `coverage`. Find the campaign the person means
   by its name (campaign matching ignores case), source or medium. If it is not there, see "Not found".
3. `tracking_traffic_source_detail` named the same way (`campaign`, or `source` + `medium`, or
   `channel`): its sessions and orders, `entry_pages` with the orders each led to, `campaigns`, the
   `issues` its sessions hit, and `samples` (sessions to open, recordings first).
4. Compare it with the shop: conversion and revenue per session against `tracking_traffic_sources`
   totals, and against the other campaigns of the same channel. A paid campaign converting below the
   shop's organic traffic is normal for cold audiences; below the other paid campaigns is a finding.
5. Where it falls:
   - `tracking_funnel` with the same `campaign` (or `source`/`medium`) filter: the step where its
     visitors stop.
   - `tracking_entry_pages` with the same filter: a landing page with a high `single_page_rate` is a
     promise the page does not keep.
   - two or three `samples` with `tracking_session_story`.

## Tagging checks

Report these once, in one line each, only when they apply:

- `conflict_sessions` on a row (or `coverage.conflicts`): the UTM tag and the ad click or referrer
  disagree, for example `utm_source=newsletter` on a Google Ads click. Usually a link copied from one
  channel into another.
- A Google click id with no UTM is counted as `other_paid` with no campaign. Turn on auto-tagging and
  use UTM, or the campaign cannot be told apart.
- `fbclid` alone is counted as `social`, never paid. Meta ads need `utm_medium=paid_social` (or
  `cpc`) to show as paid.
- Campaign names that differ only in case or spelling (`Black_Friday`, `black-friday`) split one
  campaign into several. Campaign filters ignore case, but not spelling.
- `coverage.not_collected`: sessions whose landing page was never read (older records, pixel-only
  sessions). Their source is unknown, not direct.

## Not found

No row with that campaign means no consented visit carried it in the period. Say which of these is
likely: the links have no UTM tags (check the ad's final URL), the tag is spelled differently (list
the campaigns of the matching source), the ad points at another domain, or visitors did not give
cookie consent (`tracking_setup` shows the consented share).

## Reading it

- Orders belong to the session that placed them. A buyer who clicked an ad on Monday and came back
  directly on Thursday counts under direct. Say the campaign's orders are the ones placed in the visit
  from the campaign, so it may help more than this shows.
- Orders without a visible session are in `coverage`, in no campaign.
- Under 200 sessions or 10 orders: say what happened, not a rate.
- Quomerce does not see ad spend. Ask for it, or give revenue per session so the person can compare it
  with cost per click.

## What to write

- One line: working, not yet clear, or not working, against the shop and the other campaigns.
- Sessions, orders, conversion, revenue and revenue per session, with the comparison.
- Where its visitors stop and one change (landing page, offer, audience).
- Tagging problems, if any, with the exact fix.
- Link: `https://app.quomerce.com/app/a/<account_id>/websites/<website_id>/tracking/sources`.
