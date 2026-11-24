# Queries for selling more

For `sql_query`, one website at a time. `{tz:String}` and `{currency:String}` are filled in with the
shop's own. Values in `orders.value` and `events.amount` are in **major units** (`129.99`), unlike the
tracking tools. Replace the `<…>` parts with literal numbers: the checker does not accept
`WITH 10 AS name`. `sql_schema` has more recipes (`viewed_not_added`, `hour_of_week`,
`orders_by_day_of_month`, `time_to_purchase`, `new_vs_returning`, `shipping_choice`).

## Basket size

The average order and how orders spread:

```sql
SELECT count() AS orders, round(avg(value)) AS average_order,
  arrayMap(x -> round(x), quantiles(0.1, 0.25, 0.5, 0.75, 0.9)(toFloat64(value))) AS p10_p25_p50_p75_p90,
  round(avg(arraySum(arrayMap(i -> JSONExtractUInt(i, 'quantity'), JSONExtractArrayRaw(items)))), 2) AS units_per_order,
  round(countIf(length(JSONExtractArrayRaw(items)) >= 2) / count() * 100, 1) AS orders_with_2_products_pct
FROM orders
WHERE placed_at >= now() - INTERVAL 28 DAY AND has_value = 1 AND currency IN ({currency:String}, '')
```

Orders in steps, to see where they bunch up. `<STEP>` is about a tenth of the median order:

```sql
SELECT floor(value / <STEP>) * <STEP> AS from_major, count() AS orders
FROM orders
WHERE placed_at >= now() - INTERVAL 28 DAY AND has_value = 1 AND currency IN ({currency:String}, '')
GROUP BY from_major
ORDER BY from_major
```

Orders just under a threshold (free delivery, a gift, a discount tier). `<T>` is the threshold, `<T80>`
is 80 % of it:

```sql
SELECT count() AS orders,
  countIf(value >= <T80> AND value < <T>) AS just_under,
  round(avgIf(<T> - value, value >= <T80> AND value < <T>)) AS average_gap,
  countIf(value >= <T>) AS at_or_over
FROM orders
WHERE placed_at >= now() - INTERVAL 28 DAY AND has_value = 1 AND currency IN ({currency:String}, '')
```

## Bought together

Pairs of products in the same order, over 90 days (pairs are rare; a shorter period finds none):

```sql
WITH lines AS (
  SELECT DISTINCT order_key, JSONExtractString(item, 'product', 'id') AS pid,
    JSONExtractString(item, 'product', 'name') AS pname
  FROM orders ARRAY JOIN JSONExtractArrayRaw(items) AS item
  WHERE placed_at >= now() - INTERVAL 90 DAY AND JSONExtractString(item, 'product', 'id') != '')
SELECT a.pid AS product, any(a.pname) AS product_name, b.pid AS bought_with, any(b.pname) AS bought_with_name,
  uniqExact(a.order_key) AS orders_together
FROM lines AS a
JOIN lines AS b USING (order_key)
WHERE a.pid < b.pid
GROUP BY product, bought_with
ORDER BY orders_together DESC
LIMIT 20
```

A pair seen in two or three orders is a hint, not a rule. Read it next to how many orders each
product has on its own.

## Viewed, not bought

The busiest product pages and how often a view becomes an add to cart:

```sql
SELECT e.product_id AS product, any(e.page_path) AS page,
  uniqExactIf(e.session_id, e.type = 'product_viewed') AS viewed_in,
  uniqExactIf(e.session_id, e.type = 'cart_added') AS added_in,
  round(added_in / viewed_in * 100, 1) AS add_pct
FROM events AS e
WHERE e.ts >= now() - INTERVAL 28 DAY AND e.type IN ('product_viewed', 'cart_added') AND e.product_id != ''
GROUP BY product
HAVING viewed_in >= 30
ORDER BY viewed_in DESC
LIMIT 20
```

Compare a product with others of its kind and price, not with the shop's average. A product far below
its neighbours is the page to open.

## What the shop already promises

Text the shop's pages held, read from recordings: delivery, returns, warranty, instalments, a
free-delivery threshold. Put words in the shop's own language in the list (for a Polish shop
`'dostaw', 'darmow', 'zwrot', 'raty', 'gwarancj'`; for an English one `'delivery', 'shipping', 'free',
'return', 'warranty'`):

```sql
SELECT any(e.page_type) AS page_type, substring(t.text, 1, 120) AS text_seen, uniqExact(t.session_id) AS sessions
FROM screen_text AS t
JOIN (SELECT DISTINCT page_load_id, page_type FROM events
  WHERE ts >= now() - INTERVAL 7 DAY AND type = 'page_view') AS e USING (page_load_id)
WHERE t.ts >= now() - INTERVAL 7 DAY
  AND multiSearchAnyCaseInsensitive(t.text, ['<word>', '<word>'])
GROUP BY text_seen
ORDER BY sessions DESC
LIMIT 20
```

Text in the page is not always on the screen: check what a shopper actually sees on a phone, live or in
a screenshot. Checkout and account pages are masked and hold no text.
