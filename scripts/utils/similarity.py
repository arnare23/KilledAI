#!/usr/bin/env python3
from rapidfuzz.fuzz import token_set_ratio

DUPLICATE_THRESHOLD = 80


def check_duplicate(
    name: str,
    tagline: str,
    existing: list[dict],
) -> tuple[bool, dict | None, float]:
    """Compare name+tagline against existing entries.

    Returns (is_duplicate, closest_match, score).
    """
    candidate = f"{name} {tagline}"
    best_score = 0.0
    best_match = None

    for entry in existing:
        existing_text = f"{entry['name']} {entry['tagline']}"
        score = token_set_ratio(candidate, existing_text)
        if score > best_score:
            best_score = score
            best_match = entry

    is_duplicate = best_score > DUPLICATE_THRESHOLD
    return is_duplicate, best_match, best_score
