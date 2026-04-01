# KilledAI Pipeline Skills

## Project Context

KilledAI is a documentation project that catalogs AI startups that have failed, shut down, or gone out of business. It is NOT malicious — it's inspired by "Killed by Google" and exists to document patterns and lessons from AI startup failures.

**What we collect**: Stories of AI startups (especially AI wrapper companies) that shut down, went bankrupt, were acqui-hired with product killed, pivoted away from their original AI product, or ran out of funding.

**What counts as "killed"**: Company shut down entirely, product discontinued, acqui-hired with product killed, pivoted so far the original product is dead, ran out of funding.

**Data lives at**: `data/startups/{slug}.json` (one file per startup), `data/index.json` (master index).

**Failure categories**: platform-absorbed, no-moat, funding, pricing, market, competition, technical, regulatory, acqui-hired, other.

---

## /discover {focus?}

Search for failed AI startups. Accepts an optional focus to narrow the search.

**Examples**:
- `/discover` — broad search across all sources
- `/discover Nordic AI startups` — search specifically for failed AI startups from Sweden, Norway, Denmark, Finland, Iceland
- `/discover healthcare AI` — search for failed healthcare AI companies
- `/discover 2024 shutdowns` — focus on startups that died in 2024
- `/discover GPT wrappers` — focus on thin ChatGPT/GPT wrapper startups that failed

### How to run

1. **Read the focus** (if provided) and tailor search terms accordingly. If no focus, do a broad search.

2. **Deploy up to 3 search agents in parallel**, each covering different source types. Adapt search terms to the focus:

   **Agent 1 — News & Articles**: Search TechCrunch, The Verge, VentureBeat, Ars Technica, and regional/industry-specific outlets matching the focus. Example terms: "{focus} AI startup shut down", "{focus} AI company failed", "{focus} AI startup closed".

   **Agent 2 — Community & Postmortems**: Search Hacker News, Reddit, Twitter/X for discussions, founder postmortems, and shutdown announcements. Example terms: "{focus} AI startup postmortem", "{focus} AI startup dead".

   **Agent 3 — Databases & Trackers**: Search Crunchbase, Product Hunt, and relevant databases. Also check if platform launches (OpenAI, Google, Anthropic features) killed startups in this area. Example terms: "{focus} AI startups failed list", "{focus} AI company closed Crunchbase".

3. **For each candidate found**:
   a. Run dedup check: `.venv/bin/python3 scripts/dedup.py --name "Startup Name" --tagline "what it did"`
   b. If NOT a duplicate (exit 0): create a JSON file at `data/startups/{slug}.json` following the schema in `scripts/utils/schema.py`. Include all info found during discovery. Set status to "published" if you have enough info for a full story, otherwise "draft".
   c. If duplicate (exit 1): skip it, note it was already indexed.

4. **After all candidates processed**: run `.venv/bin/python3 scripts/build_index.py`

5. **Report**: List all new startups added, their categories, and any duplicates skipped.

---

## /research {slug}

Deep-dive research on a specific startup to fill in all structured data.

1. Read `data/startups/{slug}.json`
2. Use WebSearch and WebFetch to find and verify:
   - Exact founding date and shutdown date
   - Total funding raised, funding stage, lead investors
   - Employee count at peak
   - Detailed description of what the product did
   - Primary failure category (one of: platform-absorbed, no-moat, funding, pricing, market, competition, technical, regulatory, acqui-hired, other)
   - All relevant source URLs (articles, blog posts, postmortems, Crunchbase profiles)
   - Relevant tags (e.g., "chatgpt-wrapper", "developer-tools", "healthcare-ai")
3. Update the JSON file with all findings
4. Set status to "researched"
5. Set confidence based on source quality:
   - "high": 3+ corroborating sources including official announcement
   - "medium": 1-2 reliable sources
   - "low": unverified or single rumor source
6. Run: `.venv/bin/python3 scripts/build_index.py`

---

## /write {slug}

Generate the narrative story for a researched startup.

1. Read `data/startups/{slug}.json` — it should have status "researched"
2. Write a `story` field: 1-3 paragraphs covering:
   - What the startup built and its initial traction
   - What went wrong and why it failed (the core narrative)
   - What happened to the team/investors/users afterward (if known)
   - Tone: factual, past tense, respectful — no mockery or celebration of failure
   - Reference specific dates, funding amounts, and user numbers when available
3. Write a concise `description` field (2-3 sentences summarizing the story)
4. Set status to "published"
5. Update `updated_at` to current ISO timestamp
6. Run: `.venv/bin/python3 scripts/build_index.py`

---

## /snapshot {slug}

Archive source URLs for a startup to prevent link rot.

1. Run: `.venv/bin/python3 scripts/snapshot.py {slug}`
2. This fetches each source URL and saves HTML to `data/snapshots/{slug}/`
3. Verify the snapshots were saved by checking the directory

---

## /index

Rebuild the master index from all startup JSON files.

Run: `.venv/bin/python3 scripts/build_index.py`

This reads all `data/startups/*.json`, validates them, extracts index fields, sorts by shutdown date (newest first), and writes `data/index.json`.

---

## /pipeline {focus?}

Run the full discovery-to-publish pipeline. Accepts an optional focus (same as /discover).

1. Run /discover {focus} to find new startups
2. For each newly created draft (check data/startups/ for status: "draft"):
   a. Run /research {slug}
   b. Run /write {slug}
   c. Run /snapshot {slug}
3. Run /index to rebuild the master index
4. Run `npm run prepare-data` to update the frontend data
5. Report summary: how many new startups found, how many researched, how many published

---

## /publish

Build the frontend and deploy to Cloudflare Pages.

1. Prepare data: `.venv/bin/python3 scripts/build_index.py`
2. Copy data for build:
   ```
   mkdir -p public/data/startups
   cp data/index.json public/data/
   cp data/startups/*.json public/data/startups/
   ```
3. Build: `npm run build`
4. Deploy: `npx wrangler pages deploy dist --project-name=killedai`
5. Report the deployed URL

Note: For automatic deploys, connect the arnare23/KilledAI repo in the Cloudflare Dashboard under Pages. Build command: `npm run prepare-data && npm run build`, output directory: `dist`.
