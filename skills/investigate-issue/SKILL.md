---
name: investigate-issue
description: Explain one error or broken thing on a shop (a JavaScript error, failed request, broken font, garbled text or dead click) using Quomerce data, who it hits, what it costs and how to fix it. Use when someone asks about an error, an issue, a bug on their shop, what is broken, or what a Quomerce issue means.
---

# Investigate an issue

Read the `quomerce-data` skill first.

## Steps

1. Find the website. If the person gave an issue link, the fingerprint is the last part of
   `/tracking/issues/<fingerprint>`. Otherwise call `tracking_issues` (range `7d` unless they said
   otherwise, `sort: "sessions"`) and pick the issue they mean, or the top one if they asked "what is
   broken?".
2. `tracking_issue` with that fingerprint and the same range. Read:
   - the trend (new? growing? since when?),
   - the breakdowns (one browser, device or page type?),
   - the message and stack,
   - the sessions it hit.
3. Pick one or two of those sessions and call `tracking_session_story` for each (short text, with the
   link to its recording; `tracking_session` only when you need the full technical detail). Read what the visitor did
   before and after the error: did they retry, leave, or still order?
4. If a replay tool such as `show_session_replay` is available, show one replay of an affected session,
   so the person can watch it happen. If not, link the session page in the dashboard.
5. If the person wants to look across many sessions ("what do these 40 have in common?"), hand that to
   the `issue-investigator` agent when it is available.

## What to write

- What breaks, in shop words: "On the payment step, the BLIK button does nothing on iPhones."
- Who it hits and since when: sessions, share of visitors on that page, browsers or devices.
- What it costs: the revenue impact estimate ("about"), or that no visitor was blocked.
- The likely cause, read from the message and stack: the shop's own code, a third-party script, a
  failed file, a slow or failing request. Say if it comes from an outside service the shop cannot fix.
- How to fix it: one or two steps a developer can act on. Quote the error message and the file or
  request it points to. If the shop's code is open in this session, look at the matching file.
- Link the issue page: `.../tracking/issues/<fingerprint>`.
