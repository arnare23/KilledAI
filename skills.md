# KilledAI Pipeline Skills

## /discover

Search the web for recently failed, shut down, or abandoned AI startups. Deploy up to 3 search agents in parallel:

**Agent 1 -- Tech News**: Search TechCrunch, The Verge, Ars Technica, VentureBeat for articles about AI startup shutdowns, failures, pivots, and closures. Search terms: "AI startup shut down", "AI company failed", "AI wrapper closed", "AI startup pivot", "AI startup funding", "AI startup layoffs".

**Agent 2 -- Community**: Search Hacker News, Reddit (r/startups, r/artificial, r/machinelearning), and Twitter/X for discussions about AI startups dying, postmortems, and founder retrospectives. Search terms: "AI startup postmortem", "why my AI startup failed", "AI company shutdown announcement".

**Agent 3 -- Trackers**: Search Crunchbase, Product Hunt, and tech databases for AI companies that have closed, been acquired (with product killed), or gone inactive. Also check OpenAI, Google, and Anthropic changelogs for feature launches that may have killed wrapper startups.

For each candidate found:
1. Run dedup check: `.venv/bin/python3 scripts/dedup.py --name "Startup Name" --tagline "what it did"`
2. If NOT a duplicate (exit 0), create a draft JSON file at `data/startups/{slug}.json` with:
   - name, slug (kebab-case via python-slugify), tagline
   - Any dates/funding found during discovery
   - source URLs from the articles found
   - status: "draft", confidence: "low"
   - created_at and updated_at: current ISO timestamp
3. If duplicate (exit 1), skip and note it was already indexed
4. After all candidates processed, run: `.venv/bin/python3 scripts/build_index.py`

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

## /write {slug}

Generate the narrative story for a researched startup.

1. Read `data/startups/{slug}.json` -- it should have status "researched"
2. Write a `story` field: 1-3 paragraphs covering:
   - What the startup built and its initial traction
   - What went wrong and why it failed (the core narrative)
   - What happened to the team/investors/users afterward (if known)
   - Tone: factual, past tense, respectful -- no mockery or celebration of failure
   - Reference specific dates, funding amounts, and user numbers when available
3. Write a concise `description` field (2-3 sentences summarizing the story)
4. Set status to "published"
5. Update `updated_at` to current ISO timestamp
6. Run: `.venv/bin/python3 scripts/build_index.py`

## /snapshot {slug}

Archive source URLs for a startup to prevent link rot.

1. Run: `.venv/bin/python3 scripts/snapshot.py {slug}`
2. This fetches each source URL and saves HTML to `data/snapshots/{slug}/`
3. Verify the snapshots were saved by checking the directory

## /index

Rebuild the master index from all startup JSON files.

Run: `.venv/bin/python3 scripts/build_index.py`

This reads all `data/startups/*.json`, validates them, extracts index fields, sorts by shutdown date (newest first), and writes `data/index.json`.

## /pipeline

Run the full discovery-to-publish pipeline.

1. Run /discover to find new startups
2. For each newly created draft (check data/startups/ for status: "draft"):
   a. Run /research {slug}
   b. Run /write {slug}
   c. Run /snapshot {slug}
3. Run /index to rebuild the master index
4. Report summary: how many new startups found, how many researched, how many published

## /publish

Build the frontend and deploy to Firebase Hosting.

1. Prepare data: `.venv/bin/python3 scripts/build_index.py`
2. Copy data for build:
   ```
   mkdir -p public/data/startups
   cp data/index.json public/data/
   cp data/startups/*.json public/data/startups/
   ```
3. Build: `npm run build`
4. Deploy: `firebase deploy --only hosting`
5. Report the deployed URL
