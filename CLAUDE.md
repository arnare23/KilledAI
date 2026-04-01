# KilledAI

## What This Project Is

KilledAI is a research and documentation project that catalogs AI startups — particularly AI wrapper companies — that have failed, shut down, or gone out of business. The name is inspired by "Killed by Google" and similar projects. There is nothing malicious about it; the goal is to document the stories, reasons, and patterns behind AI startup failures so others can learn from them.

## Project Goals

- **Find every documented case** of an AI wrapper startup that failed, pivoted away, or shut down
- **Document why** each startup failed — common reasons include dependency on upstream API providers, lack of moat, pricing pressure, feature absorption by platform providers, funding dry-ups, and market saturation
- **Identify patterns** across failures to surface insights about the AI startup ecosystem
- **Present the data** in a useful, searchable, and browsable format

## What Counts as "Killed"

- Company shut down entirely
- Product discontinued or abandoned
- Acqui-hired with product killed
- Pivoted so far from original AI wrapper concept that the original product is effectively dead
- Ran out of funding and ceased operations

## Research Approach

- Search tech news outlets (TechCrunch, The Verge, Ars Technica, etc.)
- Monitor startup trackers (Crunchbase, PitchBook, Product Hunt graveyards)
- Check community sources (Hacker News, Reddit r/startups, Twitter/X)
- Track OpenAI/Anthropic/Google changelog announcements that killed wrapper businesses
- Look for "shutdown" announcements, postmortems, and founder retrospectives

## Data to Capture Per Startup

- **Name** of the startup
- **What it did** (one-line description)
- **Founded / Shutdown dates**
- **Funding raised** (if known)
- **Primary cause of failure** (categorized)
- **Source links** to announcements, articles, postmortems
- **Summary** of the story

## Failure Categories

- `platform-absorbed` — The upstream AI provider (OpenAI, Google, etc.) shipped the same feature natively
- `no-moat` — Too easy to replicate, no defensible differentiation
- `funding` — Ran out of money, couldn't raise next round
- `pricing` — Margins crushed by API costs or race to bottom
- `market` — Market too small, no product-market fit
- `competition` — Outcompeted by better-funded or better-positioned rivals
- `technical` — Underlying model limitations, reliability issues
- `regulatory` — Legal or compliance issues forced shutdown
- `acqui-hired` — Team acquired, product killed
- `other` — Doesn't fit neatly into above categories

## Development

### Quick Start
npm install          # Frontend deps
npm run dev          # Start dev server at localhost:5173

### Pipeline Commands
/discover            # Find new failed AI startups
/research {slug}     # Deep-dive research on a startup
/write {slug}        # Generate narrative story
/snapshot {slug}     # Archive source URLs
/index               # Rebuild master index
/pipeline            # Full discovery-to-publish run
/publish             # Build + deploy to Firebase

### File Structure
data/startups/{slug}.json   # One JSON per startup (source of truth)
data/index.json             # Master index (auto-generated)
data/snapshots/{slug}/      # Archived source HTML
scripts/                    # Python pipeline tools
src/                        # Frontend (Vite + vanilla TS)

### GitHub
Remote: arnare23/KilledAI
Push via: git push origin main

### Firebase
Project: killedai-site
Deploy: npm run deploy
