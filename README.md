# Nationsbenefits Crossword

The visual letter-by-letter grid, plus Name + Email capture on the leaderboard.

## Deploy (no editing needed)
Unzip this folder and drag the whole folder onto Netlify's "Deploy manually" screen at
app.netlify.com. That's it — Netlify installs the one dependency automatically and the
leaderboard (backed by Netlify Blobs) works immediately.

## What's in here
- `index.html` — the crossword grid (auto-generated from the WORDS list), timer, scoring,
  leaderboard, CSV export
- `netlify/functions/leaderboard.js` — stores scores centrally so the leaderboard is shared
  across every reader and device, not just one browser
- `netlify.toml`, `package.json` — config, nothing to change

## Editing the clues
Open `index.html`, find the `WORDS` array near the top of the `<script>` tag. Each entry is
`{ answer: "...", clue: "..." }` — the grid, numbering, and Across/Down lists rebuild themselves
from this list automatically.

## Scoring
```js
const POINTS_PER_CORRECT_WORD = 100;
const TIME_BONUS_WINDOW_SECONDS = 600;
const TIME_BONUS_MAX = 300;
```

## Leaderboard & CSV
- Finishing the puzzle asks for Name + Email, then "Submit to leaderboard."
- The public leaderboard shows Name + Score only — emails are collected but not shown publicly.
- "Export CSV" downloads Rank, Name, Email, Score, Correct, Total, Time, and Submitted-At, so you
  can contact winners directly.
- Note: the Export CSV button is visible to anyone on the page. Fine for an internal newsletter
  link; if you share more widely later, remove that button (`exportCsvBtn` in `index.html`) and
  export yourself by visiting `your-site-url/api/leaderboard`.
