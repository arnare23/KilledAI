---
description: Deep-dive research on a specific startup
---

# Research a Startup

Deep-dive research on: **$ARGUMENTS**

## Process

1. **Load existing data** — Read `data/startups/$ARGUMENTS.json`. If it doesn't exist, tell the user to run `/discover` first or provide more context.

2. **Search for details** — Use WebSearch to find:
   - Founder postmortems and shutdown announcements
   - TechCrunch, The Verge, Ars Technica coverage
   - Crunchbase/PitchBook funding details
   - Hacker News discussions and Reddit threads
   - Twitter/X announcements from founders
   - Any "lessons learned" or retrospective blog posts

3. **Enrich the data** — Update the JSON file with:
   - Detailed `description` (2-3 sentences)
   - Complete `story` (a narrative paragraph covering founding, growth, what went wrong, and shutdown)
   - Accurate `founded` and `shutdown` dates (as precise as possible)
   - `funding_raised` and `funding_stage`
   - `employee_count` if findable
   - Correct `category` with reasoning
   - Relevant `tags`
   - All discovered `sources` with URLs, titles, and dates

4. **Update metadata** — Set `status` to "researched", update `confidence` based on source quality (high = multiple reliable sources, medium = some sources, low = sparse info), update `updated_at` timestamp.

5. **Rebuild index** — Run `python scripts/build_index.py`.

6. **Report** — Summarize key findings and note any gaps or uncertainties.
