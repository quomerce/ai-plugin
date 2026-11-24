# Quomerce for AI agents

Your AI assistant watches real shoppers on your shop, tries the shop itself, and tells you three
things: **what is broken**, **where you can sell more**, and **whether a change worked**.

It connects your assistant to [Quomerce](https://www.quomerce.com), which records what visitors do on
your shop: every visit as a story and a replay, the checkout, errors and orders. The assistant reads
your data (read-only), picks the recordings worth watching, looks at what shoppers saw, repeats their
steps on your live shop in a browser, and only then counts. You get a few findings you can watch for
yourself, not a page of numbers.

Works in Claude (Claude Code, Cowork, claude.ai), ChatGPT, Codex, Gemini CLI, Antigravity, Cursor,
GitHub Copilot and any other app that reads [Agent Skills](https://agentskills.io) and connects to
MCP servers. See [Install](#install).

## Three questions

| Skill | Ask, for example | What it does |
|---|---|---|
| [`whats-broken`](skills/whats-broken/SKILL.md) | "Is anything broken for my shoppers?" "Why do people leave checkout?" "Why did sales drop on Tuesday?" | Finds shoppers who wanted to buy and did not, watches their recordings, tries the same steps on your shop, and counts how many it hits. At most three findings, each with a recording to watch and a fix. |
| [`sell-more`](skills/sell-more/SKILL.md) | "How can I sell more?" "What should I cross-sell?" "Which promotion for Black Friday?" | Watches shoppers who almost bought, reads what your buyers buy together and how big their baskets are, looks at your product page and cart, and proposes three changes with the money each could bring. |
| [`did-it-work`](skills/did-it-work/SKILL.md) | "Did the new checkout help?" "Is the BLIK problem gone?" | Checks the change is live and works, watches shoppers who went through it since, and compares the one figure it was meant to move, fairly. |

**The weekly review:** ask "Quomerce weekly review for myshop.com". The assistant runs the first two
and gives you at most four things to do this week. The AI assistant page in the Quomerce dashboard has
the prompt ready to copy; make it a weekly task where your app can schedule one.

## How it works

Every skill follows the same loop:

1. **Find leads** in Quomerce: shoppers who clearly wanted to buy and did not, money leaks, problems
   already seen in recordings, errors that cost orders.
2. **Watch** two or three recordings per lead: the visit as text, then screenshots of the moment it
   went wrong.
3. **Try it live** in a browser, as that shopper did: same device, same page, same clicks.
4. **Count** only then, with one number and its base ("38 of 410 shoppers who reached checkout").
5. **Write** a few findings, each one something you can watch, with what to do about it.

The assistant never places an order or pays on your shop, never types real personal data, and stops
at a captcha. Its test visits are bots to Quomerce, so they never show up in your figures.

## Install

You need a Quomerce account with at least one tracked website: sign up at
https://www.quomerce.com. The first time the assistant uses Quomerce, you sign in with your Quomerce
account (OAuth). It sees only the shops your account belongs to, and can only read.

INSTALL_SECTION

### A browser

Testing the live shop needs a browser tool. Many apps have one built in. Where yours does not, add
Microsoft's [Playwright MCP server](https://github.com/microsoft/playwright-mcp) (it runs on your
computer with Node.js 18 or newer):

```bash
npx @playwright/mcp@latest
```

Without a browser the skills still work from the recordings, and say which findings were not tested
live.

## What is inside

```
skills/                 the three skills, in the Agent Skills format
  whats-broken/
  sell-more/
  did-it-work/
agents/                 two helpers for apps that run subagents: session-watcher, shop-tester
shared/                 references every skill needs, copied into each skill's references/
MANIFESTS_TREE
```

No hooks, no local programs, no API keys to paste. The plugin sends nothing by itself: when the
assistant calls a Quomerce tool, it reads your shop's data through the Quomerce API under your sign-in.

## Privacy

Quomerce never records what visitors type into forms, and the skills never write a shopper's personal
data. See the [Privacy Policy](https://www.quomerce.com/privacy) and
[Terms](https://www.quomerce.com/terms).

## Working on this repository

- Edit `shared/*.md`, never the copies in `skills/*/references/`. Then run
  `node scripts/sync-shared.mjs`.
- `node scripts/check.mjs` checks the skills against the Agent Skills format, the references they name,
  the copies, and that every manifest carries the same version. CI runs it on every pull request.
- A release raises the version in every manifest at once.

Questions or problems: open an issue in this repository.

## License

MIT, see [LICENSE](LICENSE).
