---
name: quomerce-sql
description: Answer a question about a shop that the Quomerce dashboard and tracking tools do not answer, by writing Quomerce SQL (sql_schema, sql_explain, sql_query) safely and correctly. Use when someone asks to count, group or compare something custom ("orders by hour of the week", "how long do buyers take to decide?", "which shipping method leads to fewer orders?"), or when another Quomerce skill needs a figure no tool returns.
---

# Quomerce SQL

Read the `quomerce-data` skill first.

## Tools or SQL?

Use a tracking tool when one answers the question: it applies the dashboard's rules and the person
can open the same page. Use SQL only for what no tool returns. If the `sql_*` tools are missing, the
shop's account does not have SQL: say so and answer with the tools.

## Steps

1. `sql_schema` once per conversation. It lists the tables (`sessions`, `events`, `errors`,
   `orders`), their columns, how to read them, and `recipes`: example queries. Start from the closest
   recipe instead of writing from scratch.
2. Replace `Europe/Warsaw` and `PLN` in a recipe with the shop's time zone and currency from
   `get_website`.
3. For a query over more than 7 days of `events`, run `sql_explain` first. If it reads hundreds of
   millions of rows, narrow the range.
4. `sql_query` with the shop's `website_id`. The website is fixed by the call: write no `site_id`
   filter.

## Rules that keep the numbers right

- **Time first.** Every query filters on time: `session_date` for `sessions`, `ts` for `events` and
  `errors`, `placed_at` for `orders`. 28 days is a good default; at most 92.
- **Aggregate.** Return a few rows of counts, never raw events or visitor lists.
- **Orders come from `orders`**, never from `events` with `type = 'purchase'`. `orders` already
  removes duplicates and bots.
- **Consent and bots are already applied** in these tables. Do not try to add the others back.
- **Local days:** `toDate(ts, '<time zone>')`, `toHour(ts, '<time zone>')`, never plain `toDate(ts)`.
- **Money:** `orders.value` is in major units of `currency`; keep only the shop's currency (or
  empty) when adding revenue up.
- `windowFunnel` and `sequenceMatch` need `toDateTime(ts)`, not `ts`.
- Name an output differently from a column you compare it with (`fp`, not `fingerprint`).
- If the checker refuses a query, it says what to write instead: follow it.

## What to write

Give the answer in words first, then a small table. Say the period, the time zone and what was
counted ("visits with consent", "orders the browser reported"). Do not show the SQL unless asked.
