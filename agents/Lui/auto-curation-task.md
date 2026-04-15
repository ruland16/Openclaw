# Auto-Curation Task for MEMORY.md

Your job is to auto-curate MEMORY.md.

## STEP 1: Find Recent Daily Notes
Run: ls ~/.openclaw/workspace/memory/*.md | sort | tail -10
then read each one.

## STEP 2: Read Current MEMORY.md
Read the full MEMORY.md file.

## STEP 3: Identify Changes
- What is stale (old stats, outdated project info)
- What is new (decisions, clients, launches)
- What should be removed

## STEP 4: Rewrite MEMORY.md
- Keep the same sections
- Update numbers
- Add new sections for major new things
- Remove outdated info
- Update the Last Updated date
- Max 400 lines

## STEP 5: Flush to Vector DB
Run: python3 ~/.openclaw/workspace/skills/vector-memory/scripts/memory_flush.py

## STEP 6: Update projects.md
Update any status changes found.

## Report
Announce a brief summary when done.
