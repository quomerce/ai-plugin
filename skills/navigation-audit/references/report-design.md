# The Quomerce report

`assets/report-template.html` is the Quomerce report: the dashboard's look on paper. Warm-neutral
paper, white sheets on hairlines, near-black green ink; jade for links and actions, amethyst for
data, the bright mint only on the dark cover. Geist for text, Urbanist for titles and big figures,
the Quomerce mark and wordmark at the top and bottom. It reads on a phone, follows the reader's light
or dark setting, and prints on A4 in light with **Save as PDF**.

Keep it as it is: the `<style>`, the icon sprite, the colours, fonts and the logo. Add no scripts,
no other stylesheets, no trackers and no other brand's logo (write the shop's name as text). A report
that needs something the components do not have is said in words, not with new CSS.

## Making the file

**With Node** (Claude Code, Cowork, Codex, any app with a shell):

1. Write the body to `body.html` in a folder of its own: everything inside `<main>`, from the
   masthead to the footer, built from the template's components. Pictures go in `images/` beside it
   and are named `src="images/…"`.
2. Build:

   ```bash
   node <this skill>/scripts/build-report.mjs --body body.html --out <host>-navigation-audit-<date>.html --lang pl --title "Audyt nawigacji myshop.pl" --description "One sentence: what the report found."
   ```

   It puts the body into the template, embeds the pictures so the report is one file, and warns
   about pictures it could not find and `{{…}}` placeholders left over. Fix those and build again.

**Without Node:** copy the template, replace everything between `<!-- report:start -->` and
`<!-- report:end -->` with the body, and fill in `<html lang>`, `<title>` and the description. Keep
the pictures in `images/` next to the file and send the folder, or embed them as `data:` URIs.

**Title:** two to four words, the report and the shop: "Audyt nawigacji myshop.pl",
"Navigation audit myshop.com".

## Components

The template holds one of each, in order, with a comment on what goes where. Copy from there; the
class names are the contract.

| Component | Classes | Use |
|---|---|---|
| Masthead | `qm-masthead`, `qm-wordmark`, `qm-print` | The wordmark, the report's name and date, Save as PDF. Always. |
| Cover | `qm-cover qm-ink`, `qm-kicker`, `qm-lead`, `qm-cover-meta` | The shop's host, the title, the answer in one or two sentences, then period, sessions, orders, prepared by. Always. |
| Section | `qm-section` with an `id`, `qm-section-head`, `h2`, `qm-thesis` | Every part after the cover. An area's `h2` starts with `<span class="qm-num">1</span>`; other sections have no number. |
| Figure strip | `qm-strip` > `qm-cell` > `qm-cell-label`, `qm-figure`, `qm-cell-hint` | Three or four headline figures in the summary, rarely elsewhere. `is-down` / `is-up` on a hint colour a change; `<small>` in a figure holds the comparison ("vs 3.80%"). |
| Top changes | `qm-priorities` > `li` > `h3 a`, `p`, `qm-chips` | The summary's five changes, linked to their sections. |
| Chips | `qm-chip` with `data-certainty` (`certain`, `likely`, `check`) or `data-effort` (`quick`, `medium`, `large`) | Under an area's thesis: level, who fixes it, size. Under each top change: size and who. |
| Contents | `qm-toc` | One row per section after it; areas carry their number in the `span`. |
| Facts | `qm-facts` (or `qm-list` in plain text) | What we see: one fact per item, a bold lead-in when there are several kinds. |
| Block | `qm-block`, `qm-block-title` with the `i-see` or `i-where` icon | "What we see" and "Where to see it". |
| Links | `qm-links` > `qm-link` with `data-kind` `recording`, `page` or `heatmap` and the matching icon (`i-recording`, `i-page`, `i-heatmap`) | Where to see it. Label each with what it shows, not "link". |
| Remedy | `qm-block qm-block--change` > `qm-changes` | What to change, numbered. The last block of every area. |
| Picture | `qm-shot` (add `qm-shot--phone` for a phone screen) > `img`, `figcaption` | A screenshot you saved. Two or three side by side: wrap them in `qm-shots`. |
| Picture link | `qm-shot` > `qm-shot-link` | A picture you saw but could not save: a heatmap or recording in Quomerce. |
| Bars | `qm-chart` > `qm-chart-title`, `qm-bars` > `li style="--v:NN%"`, `qm-chart-note` | Shares and reach: entry pages, next steps, click rates, how far views scroll. `--v` is the bar's length: the share itself, or the value against the largest row. `is-focus` marks the row the text is about, `is-bad` a row that is the problem, `is-muted` a row that is context. The note names the source and period. |
| Table | `qm-table-wrap` > `qm-table`, `class="num"` on figures | The proposed menu, the measurement table, anything with columns. |
| Note | `qm-note` | A caveat ("correlation, not cause") or how to read something. Not for findings. |
| Plan | `qm-plan` > `qm-plan-col` > `h3`, `p`, `qm-checklist` | Three horizons with boxes to tick. |
| Sources | `qm-sources` | Recordings with date, device and how they came in; reports used, in words; shop pages. |
| Footer | `qm-footer` | The wordmark and one line. Always. |

Icons are drawn once in the sprite and used as `<svg class="qm-i" aria-hidden="true"><use
href="#i-…"/></svg>`: `i-recording`, `i-page`, `i-heatmap`, `i-data`, `i-see`, `i-where`, `i-change`,
`i-print`; the mark is `#qm-logo`.

## Pictures

- **Live screenshots** are the pictures a report can carry. Take them on a phone (390 × 844) as
  files: Playwright's `browser_take_screenshot` with a `filename`, or your browser's own save. A
  phone screenshot at 780 px wide is sharp enough; convert large PNGs to JPEG when you can. Six to
  eight pictures, under 12 MB in all.
- **Quomerce pictures** (heatmaps, recording screenshots) reach you to look at, not as files. Never
  pretend one is in the report: use the picture link to the heatmap page
  (`…/tracking/heatmaps?path=<path>`) or the recording at the moment (`…/sessions/<id>?at=<time>`),
  and say in the caption what it shows. A scroll finding can also be bars: the page's key elements
  and the share of views that reach each, "about", read off the picture's lines.
- Each picture has `alt` (what it shows) and a caption (what to look at, and where it comes from:
  live shop, device, date).
- Nothing personal in a picture: no name, address, e-mail or order in a form or account page. Crop
  it or leave it out.

## Writing

- **The shop's words.** Its menu labels, list names and buttons, quoted as the shop writes them
  ("Mata do jogi", „Dodaj do koszyka”), not "PLP", "PDP" or "CTA".
- **Short and plain.** Lead with the answer. One idea per sentence. No "seamless", "leverage",
  "optimise the experience", no superlatives, no blame.
- **Numbers** with their base and period, at least once per section ("8,584 list views in 1,368
  sessions"), in the report language's format: English 34,849 · 2.52% · 1–24 Nov 2026; Polish 34 849
  · 2,52% · 1–24 listopada 2026; German 34.849 · 2,52 % · 1.–24. November 2026. Money converted from
  minor units, with the currency. "About" (ok., etwa) for anything read off a picture.
- **Say how you know.** Counted, seen in recordings ("in 2 of 3 recordings watched"), or tried on the
  live shop. A correlation is called one.
- **Titles** name the place and the problem: "Search: hidden on phones, and a failed search ends on
  an empty page".
- **Changes** are instructions for this shop, one line each, in the imperative: what, where, on
  which device.
- No tool names, ids, SQL or industry averages in the text. Sources name reports in words ("paths
  after each page type", "entry pages", "heatmaps of …").

## Fixed labels

| Key | English | Polski | Deutsch |
|---|---|---|---|
| Print button | Save as PDF | Zapisz jako PDF | Als PDF speichern |
| Report name | Navigation audit | Audyt nawigacji | Navigations-Audit |
| Title | Navigation and layout audit | Audyt nawigacji i layoutu | Audit von Navigation und Layout |
| Cover meta | Period · Sessions · Orders · Prepared by | Okres · Sesje · Zamówienia · Przygotował(a) | Zeitraum · Sitzungen · Bestellungen · Erstellt von |
| Sections | Summary · Contents · Where the data comes from · How shoppers move through the shop | Podsumowanie · Spis treści · Skąd dane · Jak klienci poruszają się po sklepie | Zusammenfassung · Inhalt · Woher die Daten stammen · Wie Kunden sich durch den Shop bewegen |
| Top changes | The changes with the most impact, in order | Zmiany o największym wpływie, w kolejności | Die wirksamsten Änderungen, nach Reihenfolge |
| Blocks | What we see · Where to see it · What to change | Co widać · Gdzie to zobaczyć · Co zmienić | Was wir sehen · Wo man es sieht · Was zu ändern ist |
| Links | Recording: · Page: · Heatmap: · Open in Quomerce | Nagranie: · Strona: · Heatmapa: · Otwórz w Quomerce | Aufnahme: · Seite: · Heatmap: · In Quomerce öffnen |
| Level | Counted in the data · Seen in recordings · To check | Policzone w danych · Widziane w nagraniach · Do sprawdzenia | In den Daten gezählt · In Aufnahmen gesehen · Zu prüfen |
| Who | Developer · Shop content · Marketing · Payments · Tracking setup | Programista · Treści w sklepie · Marketing · Płatności · Konfiguracja śledzenia | Entwickler · Shop-Inhalte · Marketing · Zahlungen · Tracking-Einrichtung |
| Size | Quick fix · 2–6 weeks · After the season | Szybka poprawka · 2–6 tygodni · Po sezonie | Schnelle Korrektur · 2–6 Wochen · Nach der Saison |
| Plan | Plan · Quick fixes · Medium · Larger | Plan wdrożenia · Szybkie poprawki · Średnie · Większe | Plan · Schnelle Korrekturen · Mittel · Größer |
| Measure | How to measure the effect · Figure · Today · Change it tracks | Jak zmierzyć efekt · Wskaźnik · Dziś · Której zmiany dotyczy | Wie man die Wirkung misst · Kennzahl · Heute · Zugehörige Änderung |
| End | Limits of this analysis · Sources · Recordings · Quomerce reports used · Shop pages | Ograniczenia analizy · Źródła · Nagrania sesji · Raporty Quomerce użyte w audycie · Strony sklepu | Grenzen dieser Analyse · Quellen · Aufnahmen · Verwendete Quomerce-Berichte · Shop-Seiten |
| Sign-in note | Recordings open after signing in to Quomerce. | Nagrania otwierają się po zalogowaniu do Quomerce. | Aufnahmen öffnen sich nach der Anmeldung bei Quomerce. |
| Footer | Prepared with Quomerce from recordings of real shoppers and the live shop. | Przygotowano w Quomerce na podstawie nagrań prawdziwych klientów i żywej strony sklepu. | Mit Quomerce erstellt, aus Aufnahmen echter Kunden und dem Live-Shop. |
| Heatmap note | How to read heatmaps: blue to red is the number of clicks; dashed lines show where 75, 50 and 25% of page views stopped scrolling. | Jak czytać heatmapy: kolor od niebieskiego do czerwonego to liczba kliknięć, a przerywane linie pokazują, do którego miejsca dotarło 75%, 50% i 25% odsłon. | So liest man Heatmaps: Blau bis Rot ist die Zahl der Klicks; gestrichelte Linien zeigen, wo 75, 50 und 25 % der Seitenaufrufe aufhörten zu scrollen. |

Another language: translate these the same way, short and plain.

## Sharing

- In a Claude app that publishes pages (artifacts), publish the built file: it already follows the
  page rules (colour tokens with a dark mode, fonts from Google Fonts, no scripts but the print
  button, readable at phone width).
- Elsewhere, give the person the file's path. It opens in any browser, and **Save as PDF** prints
  it on A4.
- Recording and heatmap links open only for people signed in to Quomerce with access to the shop.
  The Sources section says so; for a reader without access, the screenshots and the text have to
  carry the finding on their own.
