#!/usr/bin/env python3
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.utils.schema import IndexFile, Startup, StartupIndex

PROJECT_ROOT = Path(__file__).resolve().parent.parent
STARTUPS_DIR = PROJECT_ROOT / "data" / "startups"
INDEX_PATH = PROJECT_ROOT / "data" / "index.json"


def build_index() -> None:
    json_files = sorted(STARTUPS_DIR.glob("*.json"))
    if not json_files:
        print("No startup JSON files found in data/startups/")
        sys.exit(1)

    entries: list[tuple[str, StartupIndex]] = []
    errors = 0

    for path in json_files:
        try:
            raw = json.loads(path.read_text(encoding="utf-8"))
            startup = Startup(**raw)
            index_entry = StartupIndex(
                name=startup.name,
                slug=startup.slug,
                tagline=startup.tagline,
                founded=startup.founded,
                shutdown=startup.shutdown,
                category=startup.category,
                funding_raised=startup.funding_raised,
                status=startup.status,
                confidence=startup.confidence,
            )
            entries.append((startup.shutdown, index_entry))
        except Exception as e:
            print(f"Error validating {path.name}: {e}", file=sys.stderr)
            errors += 1

    # Sort by shutdown date descending
    entries.sort(key=lambda x: x[0], reverse=True)

    index = IndexFile(
        generated_at=datetime.now(timezone.utc).isoformat(),
        count=len(entries),
        startups=[entry for _, entry in entries],
    )

    INDEX_PATH.write_text(
        json.dumps(index.model_dump(), indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Indexed {len(entries)} startups → data/index.json")
    if errors:
        print(f"  ({errors} file(s) had validation errors)", file=sys.stderr)


if __name__ == "__main__":
    build_index()
