# What to check, area by area

Each area lists what to **count**, what to **watch**, what to **try** on the live shop, and the
changes that usually follow. A change belongs in the report only when this shop's numbers,
recordings or pages point at it: these are places to look, not a checklist to copy. Phones first:
most shoppers are on one, a thumb at a time, one screen at a time.

Two ideas run through all of them:

- **Every page is a door.** Most shoppers land on a product or a list, not the home page, so the way
  on must start from wherever they land.
- **Shorten the way to what shoppers use most.** The busiest lists, search and filters should be
  one tap away, not behind panels.

## Search

**Count**
- Share of sessions that search, per device, and how often they order against the others (SQL,
  "Search use"). Shoppers who search mean to buy, so a higher rate is intent, not proof that search
  sells: say so.
- Sessions on a "nothing found" page, and how many still ordered (SQL, "Not found").
- Click rate on the search field or icon on the home page, phone against computer (heatmap).
- After search results: the share that opens a product (`tracking_next_steps`, `point: "search"`).
- Search terms with no results, when the shop reports searches (SQL). Never quote a term that
  looks personal (an e-mail address, a name, a phone number).

**Watch** `tracking_highlights` with `reason: "search_failed"`; sessions on the not-found page
(`tracking_sessions` with `url`): what they searched and what they did next.

**Try** the best seller's name, the same word misspelt, a category word, a word without accents
and a plural. Look for suggestions while typing, results grouped by category, and what the "nothing
found" page offers.

**Changes that usually follow**
- On phones, an open search field under the header on the home page and lists, not only an icon.
- Suggestions while typing: products with picture and price, and matching categories.
- Once a month, the terms with no results from the shop's admin, and synonyms for the commonest.
- A "nothing found" page that helps: search again, the main categories, best sellers, contact.
- Fix links in texts that lead to an empty search.
- Above many results, counts by category ("Mats (24) · Accessories (12)").

## Category lists, filters, sorting, paging

**Count**
- List views per session on the busiest lists, by device, and how far the deepest tenth goes (SQL,
  "How deep shoppers page"). Five or more views a session on a phone is paging, not browsing.
- Click rates of "next page", page numbers, "Filter", "Apply", sorting (heatmap of the list).
- After a list: the share that opens a product, goes to another list, or leaves
  (`tracking_next_steps`, `point: "category"`).
- Filters that end in "no products found" (SQL, "Not found", on list pages).
- `list_ping_pong` in `tracking_behaviours`: several products opened from a list and left within
  seconds. On a shop that lists each colour as its own product, this is shoppers comparing colours.

**Watch** a session that pages deep; one that opens several variants of one product; one that
opens filters and gives up.

**Try** two filters that together give nothing (is the option still offered?); how many products
fit on the first phone screen; open a product and go back (same place in the list, or page 1?).

**Changes that usually follow**
- "Show more" with a counter ("48 of 300"), returning to the same place after a product.
- The filters shoppers use most as buttons above the list, one tap each.
- In the filter panel: hide options with no results, a button that says how many products it will
  show, chosen filters as chips above the list.
- Colours as variants of one product: swatches on the tile, a colour switch next to the price.
- Lighter tiles: picture, name, price and what the law asks for. In the EU a discount shows the
  lowest price of the last 30 days: keep that, drop repeats ("SALE" and "-41 %" say the same).

## Menu and categories

**Count**
- How often the menu is opened on the home page on phones (heatmap: the menu button).
- Taps from the home page to the three busiest lists (live).
- Where a tap on a top-level item leads: to the full list, or into a panel (`tracking_next_steps`
  and recordings).
- Brand and sale lists as entry pages, and how they convert (`tracking_entry_pages` with
  `entry_page_type: "category"`): a list that converts well and is missing from the menu is a lead.

**Watch** recordings that open the menu several times, or go back and forth between panels
(`clicked_selector` on the menu item with `clicked_path`).

**Try** open every panel and write the tree: levels, labels, "see all" or not, cut labels,
duplicates, attributes posing as categories (colour, size, thickness), what is missing in this
season (sale, new, best sellers, gifts).

**Changes that usually follow**
- "See all" as the first row of every panel.
- The sale, best sellers, new and, in season, gifts at the top level when shoppers use them.
- Attributes out of the menu and into the list's filters.
- One place for brands; one place for each category; short labels that fit.
- The proposed menu as a table: top-level item and what is in it.

## Home page

**Count**
- After the home page: nothing, a list, a product, search (`tracking_next_steps`, `point: "home"`).
- Which blocks sit above the 75 % and 50 % lines on a phone (heatmap): category tiles, best sellers,
  the blog.
- Carousel arrows clicked many times in a view, by shoppers who then do not order.
- Overlays at arrival: the cookie banner's and the pop-up's click rates. Both at once is a finding.

**Changes that usually follow**
- A row of category tiles right under the header.
- Grids of four to six products with "see all" instead of carousels.
- In season, the gift or sale tile high up.
- The whole promotion bar clickable, not only its last word.
- Pop-ups later or on leaving, never together with the cookie banner.

## Product page

**Count**
- Where the name, price, variants and the buy button fall against the 75 % and 50 % lines on a
  phone (heatmap). A buy button most views never reach is a finding, unless a sticky button does
  the job (its click rate).
- Overlays over the button (a discount pop-up, a chat bubble) and their click rate.
- After a product: leaves, another product, back to the list, the cart (`tracking_next_steps`,
  `point: "product"`).

**Changes that usually follow**
- On phones: picture, then name, rating and price, then variants, then the button, then delivery
  and returns, then the description.
- Nothing floating over the buy button.
- Breadcrumbs without technical levels ("BY PURPOSE").
- Under the button, the other colours and what goes with it, so the shopper does not go back to the
  list to compare.

## Ad and campaign landings

**Count**
- For each paid landing (`tracking_entry_pages` with `channel: "paid_search"` or `"paid_social"`):
  sessions, the share that leaves after one page, the share that opens a product, conversion against
  the shop. `tracking_leaks` names the ones that do significantly worse.
- How far down the first product is on a phone (live and heatmap).
- The same products listed under several addresses (live; the busiest lists from SQL).

**Changes that usually follow**
- Products on the first screen: a two-line brand text with "more", one bar instead of promotion
  cards.
- Quick filters for the product lines the ad promised.
- One address for one list, the others redirected (301), the campaigns updated. With the person who
  looks after search engines.
- No pop-up on arrival from an ad.

## Content pages (blog, guides)

**Count** entry share, one-page share, share that reaches a product (`tracking_entry_pages` with
`entry_page_type: "other"`).

**Changes that usually follow** a block of the products an article is about, and links in the text.

## Small things that break the way

- Links that lead to "not found" or to an empty search (SQL, "Not found", then live).
- `dead_end` in `tracking_behaviours`: pages shoppers leave at once for the page before; often empty
  or broken.
- Sign-in loops: a "wrong login or password" message seen many times in `screen_text`; a clear
  "forgot password" and guest checkout help.
- Script errors on lists and product pages (`tracking_issue_groups`): mention them only when they
  break something you saw, or before adding new search or filters that depend on scripts.
