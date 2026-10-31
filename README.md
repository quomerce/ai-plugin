# Quomerce plugin for Claude

Ask Claude about your online shop. This plugin connects Claude to [Quomerce](https://www.quomerce.com),
which records what visitors do on your shop: sessions, the checkout funnel, orders, errors, session
replays and uptime. Claude reads your own data (read-only) and explains it in plain words.

It works in Claude Code, in Cowork and in claude.ai chat.

## What you can ask

| Skill | Ask, for example |
|---|---|
| `ultra-dive` | "What should I do this week?" The weekly review: lost money, real traffic sources, competitors and prices, and a strategy with a test plan. |
| `store-checkup` | "How did my shop do this week?" |
| `why-did-sales-drop` | "Why were orders down yesterday?" |
| `investigate-issue` | "What is this checkout error and who does it hit?" |
| `checkout-funnel` | "Where do people leave checkout?" |
| `stuck-at-payment` | "Why do people come back from BLIK without ordering?" |
| `growth-segments` | "Which country or device should I push?" |
| `traffic-sources` | "Where do my buyers really come from? Why is direct so big?" |
| `campaign-check` | "Is my Black Friday campaign working? Are my UTM tags right?" |
| `landing-pages` | "Which landing pages waste my ad traffic? Where should my ads point?" |
| `what-next` | "What do people do after adding to cart? Where do they go from checkout?" |
| `page-ux` | "Does anyone click this banner? How far do people scroll on product pages?" |
| `site-speed` | "Is my shop slow? Does speed cost me sales?" |
| `issue-triage` | "What is broken and what should my developer fix first?" |
| `market-research` | "Who are my competitors and am I cheaper?" (needs web search) |
| `growth-strategy` | "Conversion, traffic or ads: what should I push, and which ads?" |
| `before-after` | "Did the new checkout help?" |
| `session-stories` | "Show me what people do before they leave checkout." |
| `quomerce-sql` | "Count orders by hour of the week." (needs Quomerce SQL on your account) |
| `setup-check` | "Is Quomerce installed right? Why are there no orders?" |
| `install-tracking` | "Add Quomerce to my Next.js shop." (Claude Code, in your shop's code) |

`quomerce-data` loads with them and teaches Claude how to read Quomerce numbers: shop time zone,
money in minor units, orders that are not reported, visits without consent.

Each skill is also a slash command, for example `/quomerce:store-checkup`.

Five agents (Claude Code and Cowork) do the heavy reading in their own context, so the main
conversation stays short: `issue-investigator` and `payment-investigator` read many sessions and report
what they share, `segment-scout` compares countries, devices and sources, `landing-scout` reads the
weakest landing pages with their heatmaps and sessions, and `market-researcher` searches the web for
the shop's prices, competitors and social profiles. In claude.ai chat the skills
do the same work themselves.

## The weekly review

Run `/quomerce:ultra-dive your-shop.com` once a week. To have it run on its own, make it a scheduled task
in Cowork, for example every Friday afternoon. The AI assistant page in the Quomerce dashboard has the
command ready to copy.

## What it contains

- **MCP server** `https://api.quomerce.com/mcp`. You sign in with your Quomerce account (OAuth) the first
  time Claude uses it. Claude sees only the shops your account is a member of, and can only read.
- **Skills** in `skills/`.
- **Agents** in `agents/`.

The outside research (`market-research`, and that part of `ultra-dive`) uses Claude's own web search
and page fetching. Turn web search on where your Claude app has a switch for it; without it, the review
says it could not check the market.

No hooks, no local programs, no API keys to paste.

## Install

You need a Quomerce account with at least one tracked website. Sign up at https://www.quomerce.com.

Claude Code:

```
/plugin marketplace add quomerce/ai-plugin
/plugin install quomerce@quomerce
```

Then run `/mcp` and sign in to `quomerce` if Claude asks.

## Privacy

The plugin sends nothing by itself. When Claude calls a Quomerce tool, it reads your shop's data through
the Quomerce API under your sign-in. Quomerce never records what visitors type into forms. See the
[Privacy Policy](https://www.quomerce.com/privacy) and [Terms](https://www.quomerce.com/terms).

## Support

Questions or problems: open an issue in this repository.

## License

MIT, see [LICENSE](LICENSE).
