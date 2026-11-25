# Quomerce for AI agents

Your AI assistant watches real shoppers on your shop, tries the shop itself, and tells you
**what is broken** and **where you can sell more**, or writes a full **navigation audit** as a
Quomerce report you can hand to your team.

It connects your assistant to [Quomerce](https://www.quomerce.com), which records what visitors do on
your shop: every visit as a story and a replay, the checkout, errors and orders. The assistant reads
your data (read-only), picks the recordings worth watching, looks at what shoppers saw, repeats their
steps on your live shop in a browser, and only then counts. You get a few findings you can watch for
yourself, not a page of numbers.

Works in Claude (Claude Code, Cowork, claude.ai), ChatGPT and Codex, Antigravity and Gemini CLI,
Cursor, GitHub Copilot, Grok, Devin and any other app that reads [Agent Skills](https://agentskills.io)
and connects to MCP servers. See [Install](#install).

## What you can ask

| Skill | Ask, for example | What it does |
|---|---|---|
| [`whats-broken`](skills/whats-broken/SKILL.md) | "Is anything broken for my shoppers?" "Why do people leave checkout?" "Why did sales drop on Tuesday?" | Finds shoppers who wanted to buy and did not, watches their recordings, tries the same steps on your shop, and counts how many it hits. At most three findings, each with a recording to watch and a fix. |
| [`sell-more`](skills/sell-more/SKILL.md) | "How can I sell more?" "What should I cross-sell?" "Which promotion for Black Friday?" | Watches shoppers who almost bought, reads what your buyers buy together and how big their baskets are, looks at your product page and cart, and proposes three changes with the money each could bring. |
| [`navigation-audit`](skills/navigation-audit/SKILL.md) | "Audit the navigation of myshop.com." "Why do people leave our category pages?" "Is our search any good on phones?" | Maps where shoppers come in and where they go next, reads the heatmaps of the main pages, watches recordings, reads the menu, search, lists and product page on a phone, and writes a report in the Quomerce design: the top changes in order, the evidence for each, a plan and today's figures to measure against. One HTML file that prints to PDF. |

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

The skills and the Quomerce connection install together as a plugin where your app has plugins.
Where it does not, add the skills and the connection separately ([any other app](#any-other-app)).

### Claude Code

```
/plugin marketplace add quomerce/ai-plugin
/plugin install quomerce@quomerce
```

Then run `/mcp` and sign in to `quomerce`.

### Claude (claude.ai, desktop, Cowork)

**Customize → Plugins**, add the marketplace `quomerce/ai-plugin` from GitHub, install **Quomerce**,
then **Connect** it on the plugin's Connectors tab. On Team and Enterprise plans an Owner adds it
first.

### Codex (CLI, IDE, ChatGPT desktop app)

```bash
codex plugin marketplace add quomerce/ai-plugin
```

Then install **Quomerce** from the plugin list. Codex asks you to sign in to Quomerce; if it does
not, run `codex mcp login quomerce`.

### ChatGPT

A workspace admin imports the plugin for everyone: **Plugins → Import marketplace**, with the GitHub
repository `quomerce/ai-plugin`. On your own, **Plugins → + → Add custom MCP server** with
`https://api.quomerce.com/mcp` connects Quomerce without the skills: ChatGPT still follows the
server's own short guide, but not the skills' full steps.

### Antigravity

```bash
agy plugin install https://github.com/quomerce/ai-plugin
```

Gemini CLI, where you still have it: `gemini extensions install https://github.com/quomerce/ai-plugin`.

### Cursor

Import the repository `https://github.com/quomerce/ai-plugin` as a plugin (a team admin can share
it), or use [any other app](#any-other-app).

### GitHub Copilot

```bash
copilot plugin install quomerce/ai-plugin
```

In VS Code: **Chat: Install Plugin from Source**, then `https://github.com/quomerce/ai-plugin`.

### Grok

Grok Build reads this repository as a Claude plugin:

```bash
grok plugin marketplace add quomerce/ai-plugin
grok plugin install quomerce --trust
```

On grok.com, add a custom connector with `https://api.quomerce.com/mcp`: the connection without the
skills.

### Devin

```bash
devin plugins install quomerce/ai-plugin
```

### Any other app

Add the skills with the [skills](https://github.com/vercel-labs/skills) installer, which knows where
each app keeps them:

```bash
npx skills add quomerce/ai-plugin
```

Then add the MCP server `https://api.quomerce.com/mcp` in your app's MCP settings, as a remote server
of type `http` (also called streamable HTTP). If the app cannot sign in with OAuth, create a token in
Quomerce under **Account settings → AI assistant access (MCP)** and send it as
`Authorization: Bearer qm_mcp_…`.

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
skills/                 the skills, in the Agent Skills format
  whats-broken/
  sell-more/
  navigation-audit/     also assets/report-template.html (the Quomerce report) and
                        scripts/build-report.mjs (fills it, embeds the pictures)
agents/                 two helpers for apps that run subagents: session-watcher, shop-tester
shared/                 references every skill needs, copied into each skill's references/

.claude-plugin/         Claude Code, Claude apps, Grok Build, Devin, ChatGPT's import, npx skills
.mcp.json               the Quomerce MCP server, for those
plugin.json, mcp.json   Agent Plugins: Codex and ChatGPT, Cursor, GitHub Copilot
.agents/plugins/        the Codex marketplace
.antigravity-plugin/    Antigravity, with mcp_config.json
gemini-extension.json   Gemini CLI
```

The helpers in `agents/` load in Claude Code, Cowork, Grok Build, Devin and Antigravity. Elsewhere the
skills do the same work themselves.

No hooks, no API keys to paste, and nothing runs on its own: the one script, the navigation audit's
report builder, runs only when the assistant builds a report, and reads only the template and the
report's own folder. The plugin sends nothing by itself: when the assistant calls a Quomerce tool, it
reads your shop's data through the Quomerce API under your sign-in.

## Privacy

Quomerce never records what visitors type into forms, and the skills never write a shopper's personal
data. See the [Privacy Policy](https://www.quomerce.com/privacy) and
[Terms](https://www.quomerce.com/terms).

## Working on this repository

- Edit `shared/*.md`, never the copies in `skills/*/references/`. Then run
  `node scripts/sync-shared.mjs`.
- `node scripts/check.mjs` checks the skills against the Agent Skills format, the references, assets
  and scripts they name, the copies, the report template's markers, and that every manifest carries
  the same version. CI runs it on every pull request.
- The report template (`skills/navigation-audit/assets/report-template.html`) carries the Quomerce
  dashboard's tokens from quomerce-app's `apps/web/src/index.css`. Change them there first.
- A release raises the version in every manifest at once.

Questions or problems: open an issue in this repository.

## License

MIT, see [LICENSE](LICENSE).
