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


def compute_lifetime_months(founded: str, shutdown: str) -> int | None:
    """Compute months between founded and shutdown dates.

    Accepts "YYYY" or "YYYY-MM" formats. If only year, assumes January.
    """
    try:
        parts_f = founded.split("-")
        parts_s = shutdown.split("-")
        f_year = int(parts_f[0])
        f_month = int(parts_f[1]) if len(parts_f) >= 2 else 1
        s_year = int(parts_s[0])
        s_month = int(parts_s[1]) if len(parts_s) >= 2 else 1
        months = (s_year - f_year) * 12 + (s_month - f_month)
        return months if months >= 0 else None
    except (ValueError, IndexError):
        return None


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
            lifetime = startup.lifetime_months
            if lifetime is None:
                lifetime = compute_lifetime_months(startup.founded, startup.shutdown)
            index_entry = StartupIndex(
                name=startup.name,
                slug=startup.slug,
                tagline=startup.tagline,
                founded=startup.founded,
                shutdown=startup.shutdown,
                category=startup.category,
                funding_raised=startup.funding_raised,
                lifetime_months=lifetime,
                total_loss=startup.total_loss,
                status=startup.status,
                confidence=startup.confidence,
                created_at=startup.created_at,
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
