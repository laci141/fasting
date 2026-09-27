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
- **Left sidebar menu** — language (HU RO DE EN), colour scheme, and grouped links to the 10 stations, the fuel chart,
  the videos and the sources. On desktop it collapses to a narrow icon rail (the state is remembered); on phones it
  is an off-canvas drawer opened with the ☰ button.
- **Video library** — 16 slots in a responsive grid, each a lazy-loaded `youtube-nocookie.com` player with a
  two-line title (see *Videos* below).
- **Key figures with sources** — every figure that comes from a study links straight to it (opens in a new tab).
- **Four languages** — Hungarian (default), Romanian, German, English. Switch in the sidebar.

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

Three palettes on a dark warm background, switchable in the sidebar (`data-pal` on `<html>`).
Each defines its own colours for the glucose, insulin, glucagon, fatty-acid, ketone and glycogen curves.

| Name | Feel |
|---|---|
| **Ember** (default) | amber / copper — energy |
| **Ketone** | teal / indigo — fat-derived fuel |
| **Dawn** | soft gold / rose |

All cards use a glass panel (`backdrop-filter` + `-webkit-backdrop-filter`, blur 15px; 11px on phones)
over a fixed, colourful `body::before` gradient layer.

## Videos

The video library is driven by the `VIDEOS` array near the top of the `<script>` in `index.html`:

```js
const VIDEOS=[
  {id:"fWesBvvF3rU", t:["",""]},   // slot 1
  {id:"", t:["",""]},              // slot 2 … slot 16
  …
];
```

- `id` — the part after `watch?v=` in the YouTube URL (`youtube.com/watch?v=fWesBvvF3rU` → `"fWesBvvF3rU"`).
  Leave it `""` and the card shows a translated *Coming soon* placeholder instead of a player.
- `t` — the two title lines under the video. An empty first line shows the placeholder *Video N*.
- Keep exactly 16 entries. Players load from `youtube-nocookie.com`, lazily, with no autoplay.

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

- `VIDEOS`, `META`, `STATIONS`, `CURVES`, `DIAGRAMS`, `SOURCES` — language-independent data: video slots, numbers, time windows,
  curve points, diagram geometry, citations.
- `L` — one object per language (`hu`, `ro`, `de`, `en`) holding every UI string, station text,
  figure label and diagram label. `<html lang>`, `<title>` and the meta description follow the selected language.
- No frameworks, no dependencies, no tracking, no analytics. Language and palette choice are remembered
  in `localStorage` when available (wrapped in `try/catch`; the page works without it).
- Fonts: Fraunces (headings) and IBM Plex Mono (figures) from Google Fonts with `latin-ext`, system-ui fallback.

## Sources

Every link was checked (HTTP 200). PubMed IDs were confirmed through NCBI E-utilities.

- Cahill GF Jr. Starvation in man. *N Engl J Med.* 1970;282(12):668–675. https://pubmed.ncbi.nlm.nih.gov/4915800/
- Cahill GF Jr. Fuel metabolism in starvation. *Annu Rev Nutr.* 2006;26:1–22. https://pubmed.ncbi.nlm.nih.gov/16848698/
- Owen OE et al. Brain metabolism during fasting. *J Clin Invest.* 1967;46(10):1589–1595. https://pubmed.ncbi.nlm.nih.gov/6061736/
- Felig P et al. Amino acid metabolism during prolonged starvation. *J Clin Invest.* 1969;48(3):584–594. https://pubmed.ncbi.nlm.nih.gov/5773094/
- Owen OE et al. Protein, fat, and carbohydrate requirements during starvation: anaplerosis and cataplerosis. *Am J Clin Nutr.* 1998;68(1):12–34. https://pubmed.ncbi.nlm.nih.gov/9665093/
- Landau BR et al. Contributions of gluconeogenesis to glucose production in the fasted state. *J Clin Invest.* 1996;98(2):378–385. https://pubmed.ncbi.nlm.nih.gov/8755648/
- Anton SD et al. Flipping the metabolic switch. *Obesity.* 2018;26(2):254–268. https://pubmed.ncbi.nlm.nih.gov/29086496/
- Ho KY et al. Fasting enhances growth hormone secretion and amplifies the complex rhythms of growth hormone secretion in man. *J Clin Invest.* 1988;81(4):968–975. https://pubmed.ncbi.nlm.nih.gov/3127426/
- Zauner C et al. Resting energy expenditure in short-term starvation is increased as a result of an increase in serum norepinephrine. *Am J Clin Nutr.* 2000;71(6):1511–1515. https://pubmed.ncbi.nlm.nih.gov/10837292/
- Pan JW et al. Human brain beta-hydroxybutyrate and lactate increase in fasting-induced ketosis. *J Cereb Blood Flow Metab.* 2000;20(10):1502–1507. https://pubmed.ncbi.nlm.nih.gov/11043913/
- Olsson KE, Saltin B. Variation in total body water with muscle glycogen changes in man. *Acta Physiol Scand.* 1970;80(1):11–18. https://pubmed.ncbi.nlm.nih.gov/5475323/
- Mizushima N, Komatsu M. Autophagy: renovation of cells and tissues. *Cell.* 2011;147(4):728–741. https://pubmed.ncbi.nlm.nih.gov/22078875/
- Alirezaei M et al. Short-term fasting induces profound neuronal autophagy. *Autophagy.* 2010;6(6):702–710. https://pubmed.ncbi.nlm.nih.gov/20534972/
- StatPearls: Physiology, Fasting — https://www.ncbi.nlm.nih.gov/books/NBK534877/
- StatPearls: Physiology, Glucagon — https://www.ncbi.nlm.nih.gov/books/NBK537082/
- StatPearls: Biochemistry, Glycogen — https://www.ncbi.nlm.nih.gov/books/NBK539802/
- StatPearls: Biochemistry, Gluconeogenesis — https://www.ncbi.nlm.nih.gov/books/NBK544346/
- StatPearls: Biochemistry, Ketogenesis — https://www.ncbi.nlm.nih.gov/books/NBK493179/
- StatPearls: Refeeding Syndrome — https://www.ncbi.nlm.nih.gov/books/NBK564513/
- OpenStax, *Anatomy and Physiology 2e*, Chapter 24: Metabolism and Nutrition. https://openstax.org/books/anatomy-and-physiology-2e/pages/24-introduction
- NICE CG32. Nutrition support for adults — Recommendations, box 1. https://www.nice.org.uk/guidance/cg32/chapter/Recommendations
- Berg, Tymoczko, Gatto, Stryer. *Biochemistry.* W. H. Freeman. (no verified link)

## Disclaimer

Educational material, not medical advice. People with diabetes (especially on insulin or SGLT2 inhibitors),
pregnant or breastfeeding people, people with a history of eating disorders, people who are underweight,
and anyone on regular medication should talk to a doctor before fasting.

## Licence

MIT — see [`LICENSE`](LICENSE).
