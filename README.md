# Fasting

An interactive explainer of what happens in the human body during fasting — mechanism, not rules.

**Live:** https://fastingmap.pages.dev

## What it does

No diet lists, no protocols, no "fast X days, eat Y". The page walks through the physiology of a fast —
glycogen, insulin, glucagon, fatty acids, ketones, autophagy, electrolytes — deeply enough that the
conclusions become obvious on their own. The body is treated as a physical system the reader learns to read.

- **Timeline map** — ten clickable stations. Each opens a panel with a hand-drawn-style SVG diagram,
  the mechanism, key figures (with their source) and "what this means": a conclusion derived from the
  mechanism, never an instruction.
- **Interactive fuel chart** — a 0–72 h slider over schematic curves for blood glucose, insulin, glucagon,
  free fatty acids, ketone bodies and liver glycogen. Curves are labelled *approximate, illustrative*.
  Moving the slider highlights the station in focus and the processes running alongside it.
- **Video** — click-to-load `youtube-nocookie.com` embed; nothing loads from YouTube until you click.
- **Four languages** — Hungarian (default), Romanian, German, English. Switch in the header.

## The stations

| # | Station | Window (varies between individuals) | Core idea |
|---|---|---|---|
| 1 | Fed state | ≈ 0–4 h | Glucose absorbed, insulin high, storage mode; lipolysis blocked |
| 2 | Post-absorptive | ≈ 4–12 h | Insulin falls, glucagon rises, liver glycogen releases glucose |
| 3 | Metabolic switch | ≈ 12–36 h | Liver glycogen runs low, lipolysis rises, fatty acids fuel muscle |
| 4 | Gluconeogenesis | ≈ 4 h + | Liver makes glucose from glycerol, lactate, amino acids |
| 5 | Ketogenesis | ≈ 12 h + | Liver converts fatty acids to β-hydroxybutyrate and acetoacetate |
| 6 | The brain on ketones | ≈ 2+ days | Brain shifts part of its fuel from glucose to ketones over days |
| 7 | Protein sparing | ≈ 3+ days | Less glucose demand → less gluconeogenesis from protein |
| 8 | Autophagy | uncertain in humans | mTOR ↓ / AMPK ↑; timing data mostly from animal and cell studies |
| 9 | Hormones and electrolytes | ≈ 12 h + | Growth hormone and noradrenaline ↑; glycogen-bound water and sodium lost |
| 10 | Breaking the fast / refeeding | when the fast ends | Insulin returns; phosphate/potassium shift into cells; refeeding syndrome |

## Colour schemes

Three palettes on a dark warm background, switchable in the header (`data-pal` on `<html>`).
Each defines its own colours for the glucose, insulin, glucagon, fatty-acid, ketone and glycogen curves.

| Name | Feel |
|---|---|
| **Ember** (default) | amber / copper — energy |
| **Ketone** | teal / indigo — fat-derived fuel |
| **Dawn** | soft gold / rose |

All cards use a glass panel (`backdrop-filter` + `-webkit-backdrop-filter`, blur 15px; 11px on phones)
over a fixed, colourful `body::before` gradient layer.

## Running it

It is a single static file. Open `index.html` directly in a browser, or serve the folder:

```sh
python -m http.server 8000
```

Deployed as a static site on Cloudflare Pages (project `fasting`). No build step.

## Structure

```
index.html   everything inline: CSS, SVG, JS, all four language packs
README.md
LICENSE
```

Inside `index.html`:

- `META`, `STATIONS`, `CURVES`, `DIAGRAMS`, `SOURCES` — language-independent data: numbers, time windows,
  curve points, diagram geometry, citations.
- `L` — one object per language (`hu`, `ro`, `de`, `en`) holding every UI string, station text,
  figure label and diagram label. `<html lang>`, `<title>` and the meta description follow the selected language.
- No frameworks, no dependencies, no tracking, no analytics. Language and palette choice are remembered
  in `localStorage` when available (wrapped in `try/catch`; the page works without it).
- Fonts: Fraunces (headings) and IBM Plex Mono (figures) from Google Fonts with `latin-ext`, system-ui fallback.

## Sources

- Cahill GF Jr. Starvation in man. *N Engl J Med.* 1970;282(12):668–675.
- Cahill GF Jr. Fuel metabolism in starvation. *Annu Rev Nutr.* 2006;26:1–22.
- Owen OE et al. Brain metabolism during fasting. *J Clin Invest.* 1967;46(10):1589–1595.
- Landau BR et al. Contributions of gluconeogenesis to glucose production in the fasted state. *J Clin Invest.* 1996;98(2):378–385.
- Anton SD et al. Flipping the metabolic switch. *Obesity.* 2018;26(2):254–268.
- Ho KY et al. Fasting enhances growth hormone secretion… *J Clin Invest.* 1988;81(4):968–975.
- Zauner C et al. Resting energy expenditure in short-term starvation… *Am J Clin Nutr.* 2000;71(6):1511–1515.
- Olsson KE, Saltin B. Variation in total body water with muscle glycogen changes in man. *Acta Physiol Scand.* 1970;80(1):11–18.
- Mizushima N, Komatsu M. Autophagy: renovation of cells and tissues. *Cell.* 2011;147(4):728–741.
- Alirezaei M et al. Short-term fasting induces profound neuronal autophagy. *Autophagy.* 2010;6(6):702–710.
- StatPearls (NCBI Bookshelf): Physiology, Insulin; Physiology, Glucagon; Biochemistry, Gluconeogenesis; Biochemistry, Ketogenesis; Refeeding Syndrome.
- OpenStax, *Anatomy and Physiology 2e*, Chapter 24: Metabolism and Nutrition.
- Berg, Tymoczko, Gatto, Stryer. *Biochemistry.* W. H. Freeman.
- NICE CG32. Nutrition support for adults.

## Disclaimer

Educational material, not medical advice. People with diabetes (especially on insulin or SGLT2 inhibitors),
pregnant or breastfeeding people, people with a history of eating disorders, people who are underweight,
and anyone on regular medication should talk to a doctor before fasting.

## Licence

MIT — see [`LICENSE`](LICENSE).
