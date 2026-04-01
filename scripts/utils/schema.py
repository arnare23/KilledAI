#!/usr/bin/env python3
from pydantic import BaseModel
from typing import Literal


class StartupSource(BaseModel):
    url: str
    title: str
    date: str  # ISO date string
    snapshot_path: str | None = None


class Startup(BaseModel):
    name: str
    slug: str
    tagline: str
    description: str = ""
    story: str = ""
    founded: str  # "YYYY-MM" or "YYYY-MM-DD"
    shutdown: str
    funding_raised: str = "Unknown"
    funding_stage: str = ""
    employee_count: int | None = None
    category: Literal[
        "platform-absorbed",
        "no-moat",
        "funding",
        "pricing",
        "market",
        "competition",
        "technical",
        "regulatory",
        "acqui-hired",
        "other",
    ]
    tags: list[str] = []
    url: str = ""
    sources: list[StartupSource] = []
    status: Literal["draft", "researched", "published", "unverified", "rejected"] = "draft"
    rejection_reason: str | None = None
    confidence: Literal["high", "medium", "low"] = "low"
    created_at: str
    updated_at: str


class StartupIndex(BaseModel):
    name: str
    slug: str
    tagline: str
    founded: str
    shutdown: str
    category: str
    funding_raised: str
    status: str
    confidence: str


class IndexFile(BaseModel):
    version: int = 1
    generated_at: str
    count: int
    startups: list[StartupIndex]
