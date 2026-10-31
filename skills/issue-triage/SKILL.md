---
name: issue-triage
description: Put an online shop's errors and broken things in order of what to fix first, from the Quomerce Issues page - new, spiking, regressed and escalating problems, the shop's own code against outside scripts, with sessions and estimated revenue impact. Use when someone asks what is broken on the shop, what to fix first, for a list of bugs for their developer, whether a fix worked, or which errors they can ignore.
---

# Issue triage: what to fix first

Read the `quomerce-data` skill first. For one issue in depth, use `investigate-issue`.

## Steps

1. Find the website. Period: what the person said, else the last 7 whole days, with `compare: true`.
2. Call these together:
   - `tracking_issue_groups` with `status: "priority"` (what the Issues page puts first) and
     `section: "sales"` (mostly product, cart or checkout pages);
   - `tracking_issue_groups` with `status: "spiking"`;
   - `tracking_issue_groups` with `status: "open"`, `origin: "first_party"` (the shop's own code and
     files, which its developer can fix).
   The `counts` in any of them give the size of each tab.
3. Order the list:
   1. **Regressed** (marked fixed, seen again) and **escalating** (ignored, getting worse): someone
      already decided about these, and the decision no longer holds.
   2. **Sales section**, by sessions hit, then by revenue impact.
   3. **New** groups, first seen in the period.
   4. The rest of the shop's own code.
   5. **Outside** section (analytics and ad tags, often blocked by the visitor): no revenue impact,
      mention in one line, if at all. An ad tag that never loads does matter to the shop's ads, but
      it does not stop anyone buying.
4. For the top 3 to 5 groups, `tracking_issue` with one of their fingerprints: the trend, the browsers
   and devices it hits, the page, and a stack. Read one session story of a hit session when the
   message alone does not say what the shopper saw.
5. A fix to check: `tracking_issue_groups` with `status: "fixed"`. A group marked fixed and not seen
   since is fixed; one seen again is already `regressed` in the open list.

## Reading it

- Revenue impact is an estimate (affected sessions against similar unaffected ones). Say "about", and
  never add the impacts of different groups together.
- A group hitting one browser or one device only is usually the shop's code using something that
  browser lacks. Name the browser and version.
- `dead_click` groups are buttons or links that did nothing when clicked. `page-ux` shows how often
  they are clicked compared with the rest of the page.
- `font` and `text_corruption` mean the shopper saw broken letters, often only on checkout or in one
  language.
- Groups seen in one session are left out unless `include_seen_once: true`. Do not use it for a
  priority list.

## What to write

A list a developer can work from, at most 7 items, most important first. Each: what the shopper sees,
where (page, device, browser), how many sessions in the period and the trend, about how much revenue,
status (new, regressed…), and where to look (file and line from the stack, or the failing URL). End
with one line on what was left out and why ("12 errors from ad and analytics tags, no effect on
buying").

Link: `https://app.quomerce.com/app/a/<account_id>/websites/<website_id>/tracking/issues` and
`.../issues/<fingerprint>` per item.
