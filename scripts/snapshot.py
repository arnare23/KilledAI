#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.utils.schema import Startup

PROJECT_ROOT = Path(__file__).resolve().parent.parent
STARTUPS_DIR = PROJECT_ROOT / "data" / "startups"
SNAPSHOTS_DIR = PROJECT_ROOT / "data" / "snapshots"


def sanitize_filename(url: str) -> str:
    """Convert a URL into a safe filesystem name."""
    name = re.sub(r"https?://", "", url)
    name = re.sub(r"[^\w\-.]", "_", name)
    return name[:200] + ".html"


def snapshot(slug: str) -> None:
    startup_path = STARTUPS_DIR / f"{slug}.json"
    if not startup_path.exists():
        print(f"No startup file found: {startup_path}", file=sys.stderr)
        sys.exit(1)

    raw = json.loads(startup_path.read_text(encoding="utf-8"))
    startup = Startup(**raw)

    slug_dir = SNAPSHOTS_DIR / slug
    slug_dir.mkdir(parents=True, exist_ok=True)

    with httpx.Client(timeout=30, follow_redirects=True) as client:
        for source in startup.sources:
            filename = sanitize_filename(source.url)
            out_path = slug_dir / filename
            try:
                resp = client.get(source.url)
                resp.raise_for_status()
                out_path.write_text(resp.text, encoding="utf-8")
                source.snapshot_path = str(out_path.relative_to(PROJECT_ROOT))
                print(f"  Saved: {source.snapshot_path}")
            except httpx.HTTPError as e:
                print(f"  Failed to fetch {source.url}: {e}", file=sys.stderr)

    # Write updated JSON back
    startup_path.write_text(
        json.dumps(startup.model_dump(), indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Updated {startup_path.name} with snapshot paths")


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: snapshot.py <slug>", file=sys.stderr)
        sys.exit(1)
    snapshot(sys.argv[1])


if __name__ == "__main__":
    main()
