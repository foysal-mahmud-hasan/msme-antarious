---
name: Memory Conventions
description: Ownership matrix and naming rules for this project's .claude/memory system
type: project
---

## Ownership matrix (strict)

| File | Owns | Does NOT own |
|------|------|--------------|
| LAWS.md | Non-negotiable standing rules (design, brand, platform) | One-off decisions → decisions.md |
| decisions.md | *Why* a structural choice was made | Evergreen rules → patterns.md |
| patterns.md | Evergreen rules/patterns to apply | Decisions, one-off migrations, bugs |
| feedback.md | User corrections + preferences | Architectural patterns, procedures |
| bugs_fixed.md | Root cause + lesson for significant bugs | Feature descriptions |
| session_status.md | Current unreleased work + branch state | Shipped sessions |
| projectSummary.md | Feature narratives per conversation | Shipped features → CHANGELOG |
| docs/ | Reference docs, audits, plans | Live work → session_status.md |

## Frontmatter (every file except MEMORY.md)
```yaml
---
name: Human-Readable Name
description: One-line purpose (used to judge relevance later — be specific)
type: project | feedback | reference
---
```

## Entry format inside live files
`## YYYY-MM-DD — Title` — reverse chronological, latest at top.

## What NOT to save
- File paths / code structure (grep it).
- Git history / who-changed-what (`git log` is authoritative).
- Anything already in CLAUDE.md, AGENTS.md, or LAWS.md.
- Temporary task state or current conversation context.
- Step-by-step fix code (the fix lives in the code; the commit has the context).

## Note on two memory systems
- **This `.claude/memory/`** is checked into the repo — shared team-level project laws/decisions.
- The per-user auto-memory (outside the repo) is private and personal. Project laws belong HERE so they travel with the code.
