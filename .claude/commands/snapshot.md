---
description: Archive source URLs for a startup
---

# Snapshot Sources

Archive all source URLs for: **$ARGUMENTS**

## Process

1. Run the snapshot script:
   ```
   python scripts/snapshot.py $ARGUMENTS
   ```

2. Report which sources were successfully archived and which failed.

3. If any sources fail, try to find alternative/mirror URLs via WebSearch and update the sources list in `data/startups/$ARGUMENTS.json`, then re-run the snapshot.
