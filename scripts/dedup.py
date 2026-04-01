#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.utils.similarity import check_duplicate

PROJECT_ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = PROJECT_ROOT / "data" / "index.json"


def main() -> None:
    parser = argparse.ArgumentParser(description="Check for duplicate startup entries")
    parser.add_argument("--name", required=True, help="Startup name to check")
    parser.add_argument("--tagline", required=True, help="Startup tagline to check")
    args = parser.parse_args()

    if not INDEX_PATH.exists():
        print("No index.json found. Run build_index.py first.", file=sys.stderr)
        sys.exit(2)

    index_data = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    existing = index_data.get("startups", [])

    is_dup, match, score = check_duplicate(args.name, args.tagline, existing)

    if is_dup:
        print(f"DUPLICATE (score: {score:.1f}): {match['name']} — {match['tagline']}")
        sys.exit(1)
    else:
        print(f"NEW entry (closest score: {score:.1f})")
        sys.exit(0)


if __name__ == "__main__":
    main()
