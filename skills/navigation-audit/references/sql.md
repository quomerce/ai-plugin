# Queries for the navigation audit

For `sql_query`, one website at a time. `{tz:String}` and `{currency:String}` are filled in with the
shop's own. Every table holds consented, non-bot visits only, as the dashboard counts them. Filter on
time first, and write `IN (SELECT …)`, not `IN table`. Replace the `<…>` parts with literal values.
One website runs at most two queries at a time: send them one after another, not all at once.
Without SQL (a customer account where it is off), take the same figures from the tools named under
each query.

## Search use, and what it goes with

Share of sessions that search, per device, and how often they order against the others. A shop that
reports searches sends `search_performed`; any shop has `page_type = 'search'` on its results page.

```sql
SELECT s.device_type AS device, count() AS sessions,
  countIf(f.searched = 1) AS searched,
  round(searched / sessions * 100, 1) AS searched_pct,
  round(countIf(f.searched = 1 AND o.orders > 0) / searched * 100, 1) AS conv_searched_pct,
  round(countIf(f.searched = 0 AND o.orders > 0) / (sessions - searched) * 100, 1) AS conv_others_pct
FROM sessions AS s
LEFT JOIN (SELECT session_id, 1 AS searched FROM events
  WHERE ts >= now() - INTERVAL 29 DAY
    AND (type = 'search_performed' OR (type = 'page_view' AND page_type = 'search'))
  GROUP BY session_id) AS f USING (session_id)
LEFT JOIN (SELECT session_id, count() AS orders FROM orders
  WHERE placed_at >= now() - INTERVAL 29 DAY GROUP BY session_id) AS o USING (session_id)
WHERE s.session_date >= today() - 28
GROUP BY device
ORDER BY sessions DESC
LIMIT 10
```

Shoppers who search already mean to buy: report the gap as how valuable they are, not as what search
does. Without SQL: `tracking_next_steps` with `point: "search"` gives the sessions that searched.

## Not found

Pages whose text says nothing was found: a search with no results, a product that is gone, filters
that leave nothing. Put the shop's own words in the list (Polish `'nie znaleziono', 'nie został
znaleziony', 'brak wyników', 'brak produktów'`; English `'not found', 'no results', 'no products',
'0 results'`; German `'nicht gefunden', 'keine ergebnisse', 'keine produkte'`):

```sql
SELECT e.page_path AS page, any(e.page_type) AS page_type, uniqExact(t.session_id) AS sessions,
  uniqExactIf(t.session_id, t.session_id IN (SELECT session_id FROM orders
    WHERE placed_at >= now() - INTERVAL 29 DAY)) AS still_ordered,
  any(substring(t.text, 1, 90)) AS text_seen
FROM screen_text AS t
JOIN (SELECT DISTINCT page_load_id, page_path, page_type FROM events
  WHERE ts >= now() - INTERVAL 28 DAY AND type = 'page_view') AS e USING (page_load_id)
WHERE t.ts >= now() - INTERVAL 28 DAY
  AND multiSearchAnyCaseInsensitive(t.text, ['<words>', '<words>'])
GROUP BY page
ORDER BY sessions DESC
LIMIT 20
```

`screen_text` only holds recorded visits that reached a product page or ordered, so these counts are
a floor. A page that only ever says "not found" (`/noproduct.php`, `/404`) can be counted in full
from page views:

```sql
SELECT page_path AS page, uniqExact(session_id) AS sessions,
  uniqExactIf(session_id, session_id IN (SELECT session_id FROM orders
    WHERE placed_at >= now() - INTERVAL 29 DAY)) AS still_ordered
FROM events
WHERE ts >= now() - INTERVAL 28 DAY AND type = 'page_view' AND page_path IN ('<path>', '<path>')
GROUP BY page
LIMIT 10
```

Sessions that still ordered after a "not found" page meant to buy: say so, they are the case for
fixing it. Then watch two of them (`tracking_sessions` with `url`) to see what led there. Without
SQL: the `broken_page` kind of `tracking_leaks`, and `dead_end` in `tracking_behaviours`.

## How deep shoppers page

List views per session on the busiest lists, by device. A shop that pages with a query string
(`?page=2`, `?counter=1`) counts every page of a list under one path; a shop that pages with paths
(`/mats/page/2`) shows each page apart, so add them up.

```sql
SELECT page_path AS list, device, sum(per) AS views, count() AS sessions,
  round(views / sessions, 2) AS views_per_session,
  quantileExact(0.9)(per) AS p90_views
FROM (SELECT session_id, page_path, any(device_type) AS device, count() AS per
  FROM events
  WHERE ts >= now() - INTERVAL 28 DAY AND type = 'page_view' AND page_type = 'category'
  GROUP BY session_id, page_path)
GROUP BY list, device
HAVING sessions >= 100
ORDER BY sessions DESC
LIMIT 20
```

`p90_views` is how many views the most persistent tenth needs. Read it with the list's heatmap: a
"next page" button among its hottest elements confirms it. Without SQL: the heatmap of the list on
phones (click rate of the paging buttons).

## Search terms with no results

Only when the shop reports searches with their result count. Check first:

```sql
SELECT countIf(toString(props.term) != '') AS with_term,
  countIf(props.results::Nullable(Float64) IS NOT NULL) AS with_result_count
FROM events
WHERE ts >= now() - INTERVAL 28 DAY AND type = 'search_performed'
```

Both above zero:

```sql
SELECT lower(trimBoth(toString(props.term))) AS term, count() AS searches,
  uniqExact(session_id) AS sessions
FROM events
WHERE ts >= now() - INTERVAL 28 DAY AND type = 'search_performed'
  AND props.results::Nullable(Float64) = 0
GROUP BY term
ORDER BY sessions DESC
LIMIT 30
```

Never quote a term that looks like personal data (an e-mail address, a name, a phone number, an
order number). Otherwise the report suggests the shop reads these terms in its own admin.

## Sign-in loops

How many visits saw a wrong-password message, in the shop's words:

```sql
SELECT uniqExact(session_id) AS sessions, count() AS times_seen
FROM screen_text
WHERE ts >= now() - INTERVAL 28 DAY
  AND multiSearchAnyCaseInsensitive(text, ['<words of the message>'])
```

A floor, like every `screen_text` count.
