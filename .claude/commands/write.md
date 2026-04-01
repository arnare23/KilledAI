---
description: Generate narrative story for a startup entry
---

# Write Startup Story

Generate a compelling narrative for: **$ARGUMENTS**

## Process

1. **Read the data** — Load `data/startups/$ARGUMENTS.json`. It should already have research data (status "researched"). If status is still "draft", suggest running `/research $ARGUMENTS` first.

2. **Write the story** — Craft a narrative `story` field (150-300 words) that covers:
   - What the startup did and the problem it tried to solve
   - Its trajectory: founding, growth, peak moments
   - What went wrong: the specific failure cause(s)
   - The shutdown: how it ended
   - The lesson or takeaway

   **Tone**: Editorial, factual, concise. Like a well-written obituary in a tech publication. No marketing language, no dramatization. Let the facts tell the story.

3. **Polish the description** — Ensure `description` is a tight 1-2 sentence summary that captures the essential arc.

4. **Update metadata** — Set `status` to "published", update `updated_at` timestamp.

5. **Rebuild index** — Run `python scripts/build_index.py`.

6. **Show the story** — Print the final story text for review.
