# Quomerce plugin for Claude

Ask Claude about your online shop. This plugin connects Claude to [Quomerce](https://www.quomerce.com),
which records what visitors do on your shop: sessions, the checkout funnel, orders, errors, session
replays and uptime. Claude reads your own data (read-only) and explains it in plain words.

It works in Claude Code, in Cowork and in claude.ai chat.

## What you can ask

| Skill | Ask, for example |
|---|---|
| `store-checkup` | "How did my shop do this week?" |
| `why-did-sales-drop` | "Why were orders down yesterday?" |
| `investigate-issue` | "What is this checkout error and who does it hit?" |
| `checkout-funnel` | "Where do people leave checkout?" |
| `setup-check` | "Is Quomerce installed right? Why are there no orders?" |
| `install-tracking` | "Add Quomerce to my Next.js shop." (Claude Code, in your shop's code) |

`quomerce-data` loads with them and teaches Claude how to read Quomerce numbers: shop time zone,
money in minor units, orders that are not reported, visits without consent.

Each skill is also a slash command, for example `/quomerce:store-checkup`.

The `issue-investigator` agent (Claude Code and Cowork) reads many sessions at once and reports what
they have in common, so the main conversation stays short.

## What it contains

- **MCP server** `https://api.quomerce.com/mcp`. You sign in with your Quomerce account (OAuth) the first
  time Claude uses it. Claude sees only the shops your account is a member of, and can only read.
- **Skills** in `skills/`.
- **Agent** in `agents/`.

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
