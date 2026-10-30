---
name: what-next
description: Show what visitors do right after a stage of an online shop - after the cart, checkout, payment, a product, a category, search or the home page - using Quomerce paths, and which next step goes with orders and which with leaving. Use when someone asks what people do after adding to cart, where they go from checkout, why they come back from payment, whether they go back to compare products, or where search sends them.
---

# What do visitors do next?

Read the `quomerce-data` skill first.

## Steps

1. Find the website. Period: what the person said, else the last 28 whole days, with `compare: true`.
2. Pick the stage (`point`): `cart`, `checkout`, `payment` (the shop sent the shopper away to pay),
   `product`, `category`, `search`, `home` or `account`. If the person did not say, start at `cart`,
   then `checkout`.
3. `tracking_next_steps` with that `point`. Each session that saw the stage is counted once, in the row
   of the first different page after its first view of it. Rows add up to 100 %.
   - A row is a page type (`product`, `category`, `checkout`…), an untyped page by its path (`/dostawa`,
     `/faq`), `again` or `none`.
   - `none`: no later page view was recorded. It is **not** "left": an order confirmation page that is
     not tracked, a payment page that never sent them back, or a visitor who closed the tab all look
     the same. Sessions still active are counted apart.
   - Orders on a row are orders in the same session, not caused by the step.
4. Narrow the group when the question is about buyers or non-buyers: `reached_step: 6` (ordered) or
   `not_step: 6` (did not order), or the furthest funnel step the person asks about. Comparing the two
   shows which next step goes with ordering.
5. Open the rows that matter with `tracking_next_step_detail` (`point`, `step`): the pages behind it,
   the issues seen in the same sessions, and sessions to watch. Read two or three with
   `tracking_session_story`. For many sessions, hand them to the `issue-investigator` agent when it is
   available.

## What the common rows usually mean

- **Cart → product or category:** comparing or adding more. Normal, unless it is most of the cart's
  sessions and few of them come back: then the cart may not say enough (size, delivery, total).
- **Cart or checkout → a shipping, returns, payment or FAQ page:** missing information at the moment
  of buying. Put that answer on the cart or checkout page.
- **Checkout → cart:** often a coupon code field, a shipping cost seen for the first time, or a
  required account. Check the forms (`tracking_forms`) and the issues in the detail.
- **Payment → checkout or cart:** the payment failed or was cancelled. Follow `stuck-at-payment`.
- **Search → search:** the first results were not good. Look at what the detail shows.
- **Product → home:** the product page was a dead end (sold out, no price, wrong product).

## What to write

- The stage and the 3 or 4 biggest rows, with shares and sessions ("31 % of 1,240 sessions went back
  to a product from the cart").
- Which next step goes with orders and which does not, when you compared buyers with non-buyers.
- One or two changes, with a session or recording to watch.
- Link: `https://app.quomerce.com/app/a/<account_id>/websites/<website_id>/tracking/journeys`.
