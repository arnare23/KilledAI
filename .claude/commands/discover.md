---
description: Find new failed AI startups
---

# Discover Failed AI Startups

Search the web for AI wrapper startups and AI startups that have failed, shut down, pivoted away, or gone out of business.

**Focus area**: $ARGUMENTS

## Process

1. **Check existing entries** — Read `data/index.json` to know what's already tracked so you don't duplicate work.

2. **Search broadly** — Use WebSearch with multiple queries:
   - "AI startup shutdown $ARGUMENTS"
   - "AI wrapper company failed $ARGUMENTS"
   - "AI startup postmortem $ARGUMENTS"
   - "killed by ChatGPT $ARGUMENTS"
   - "AI company ran out of funding $ARGUMENTS"

3. **Deduplicate** — For each candidate, run: `python scripts/dedup.py --name "Name" --tagline "What it did"` to check against existing entries.

4. **Create draft entries** — For genuinely new finds, create a JSON file at `data/startups/{slug}.json` with status "draft" and confidence "low". Follow this schema exactly:

```json
{
  "name": "",
  "slug": "",
  "tagline": "",
  "description": "",
  "story": "",
  "founded": "",
  "shutdown": "",
  "funding_raised": "Unknown",
  "funding_stage": "",
  "employee_count": null,
  "category": "",
  "tags": [],
  "url": "",
  "sources": [
    { "url": "", "title": "", "date": "", "snapshot_path": null }
  ],
  "status": "draft",
  "confidence": "low",
  "created_at": "",
  "updated_at": ""
}
```

Valid categories: `platform-absorbed`, `no-moat`, `funding`, `pricing`, `market`, `competition`, `technical`, `regulatory`, `acqui-hired`, `other`.

5. **Rebuild index** — Run `python scripts/build_index.py` after adding new entries.

6. **Report** — Summarize what was found: new entries added, already-tracked entries skipped, and any promising leads that need deeper research via `/research`.