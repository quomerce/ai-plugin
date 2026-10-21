---
name: stuck-at-payment
description: Find visitors who go to the payment page again and again and never order, using Quomerce data, and what they have in common (payment method, device, browser). Use when someone asks why payments fail, why people come back from the payment page without ordering, about a payment gateway (BLIK, card, transfer, PayU, Przelewy24, Tpay, Stripe), or about checkout retries.
---

# Stuck at payment

Read the `quomerce-data` skill first.

A visitor is stuck when their last 3 or more tries to pay in a row ended with no order. They wanted to
buy, so each one is a sale the shop nearly made.

## Steps

1. Find the website. Period: what the person said, else `7d`, with `compare: true`.
2. `tracking_payment_retries`. If it says `available: false`, the shop does not report when a visitor
   goes to pay: say so and suggest the `setup-check` skill.
3. Read: stuck visitors against last week, the share of visitors who went to pay, the value of their
   carts, how many came back to the shop, and the split by method, device and browser.
4. If one method, device or browser holds most of them, compare it with its share of all payments:
   `tracking_funnel` with `breakdown: "payment_method"` (or `"browser"`).
5. Read 3 of the `examples` with `tracking_session_story`. Look at what happens after the return
   from payment: an error, a "failure" status, the same method again, another method.
6. For more than 3 sessions, use the `payment-investigator` agent when it is available.

## What to write

- First line: how many visitors got stuck and the value of their carts ("about").
- What they share, with numbers ("6 of 8 on iPhone Safari, all with BLIK").
- The likely cause, marked as a guess unless the stories show it: a method that refuses, a bank page
  that fails on one browser, a return page that does not confirm the order.
- One step to take, for example "make a test payment with BLIK on an iPhone", and the link to the
  Funnel page, where they are shown under the funnel: `.../tracking/funnel`.
