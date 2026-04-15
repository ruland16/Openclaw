# Vector Memory Setup

PostgreSQL + pgvector + Gemini embeddings for semantic memory search.

## Prerequisites

- PostgreSQL 14+ with pgvector extension
- Node.js 18+ OR Python 3.8+
- Gemini API key (for embeddings)

## Installation Steps

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo apt install postgresql-14-pgvector  # or your version
```

**macOS:**
```bash
brew install postgresql@17
brew services start postgresql@17
brew install pgvector  # May need manual build
```

### 2. Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE openclaw_memory;
CREATE USER openclaw WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE openclaw_memory TO openclaw;

# Exit
\q
```

### 3. Initialize Schema

```bash
psql -U openclaw -d openclaw_memory -f scripts/init-db.sql
```

### 4. Configure Environment

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=openclaw_memory
export PGUSER=openclaw
export PGPASSWORD=your_password
export GEMINI_API_KEY=your_gemini_api_key
```

### 5. Install Dependencies

**Python (recommended):**
```bash
pip install psycopg2-binary
# OR
pip install psycopg2
```

**Node.js (alternative):**
```bash
cd scripts
npm init -y
npm install pg
```

### 6. Test Connection

**Python:**
```bash
python3 -c "import psycopg2; conn = psycopg2.connect('dbname=openclaw_memory'); print('✓ Connected'); conn.close()"
```

**Node.js:**
```bash
node -e "const { Pool } = require('pg'); new Pool().query('SELECT NOW()').then(r => console.log('✓ Connected:', r.rows[0].now)).catch(e => console.error('✗ Failed:', e.message))"
```

## Usage

### Store a Memory

**Python:**
```bash
python3 scripts/memory_store.py "Important decision about project X" \
  --label="Decisions" \
  --category="memory" \
  --source="conversation" \
  --meta='{"agent":"lui","project":"x"}'
```

**Node.js:**
```bash
node scripts/memory_store.js "Important decision about project X" \
  --label="Decisions" \
  --category="memory" \
  --source="conversation" \
  --meta='{"agent":"lui","project":"x"}'
```

### Search Memories

**Python:**
```bash
python3 scripts/memory_search.py "project decisions" --limit=5 --category="memory" --min-score=0.3
```

**Node.js:**
```bash
node scripts/memory_search.js "project decisions" --limit=5 --category="memory" --min-score=0.3
```

### Flush Daily Notes (Bulk Import)

**Python:**
```bash
# Dry run (preview)
python3 scripts/memory_flush.py --dry-run

# Actual flush
python3 scripts/memory_flush.py

# Force re-flush all files
python3 scripts/memory_flush.py --force
```

**Node.js:**
```bash
# Dry run (preview)
node scripts/memory_flush.js --dry-run

# Actual flush
node scripts/memory_flush.js

# Force re-flush all files
node scripts/memory_flush.js --force
```

## File Tracking

The flush tracker stores processed file hashes at:
- `memory/vector-flush-tracker.json`

This prevents re-flushing unchanged files. Use `--force` to override.

## Integration with OpenClaw

Add to your agent's skill config or tool calls:

```javascript
// Example: Search memories before responding
const results = await searchMemories(query, { limit: 5, minScore: 0.3 });
```

## Scripts Reference

| Script | Language | Purpose |
|--------|----------|---------|
| `memory_store.py` | Python | Store single memory |
| `memory_search.py` | Python | Semantic search |
| `memory_flush.py` | Python | Bulk flush daily notes |
| `memory_store.js` | Node.js | Store single memory |
| `memory_search.js` | Node.js | Semantic search |
| `memory_flush.js` | Node.js | Bulk flush daily notes |

**Recommendation:** Use Python scripts - they were the original implementation and are fully tested.

## Troubleshooting

**pgvector not found:**
```sql
-- Check available extensions
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- Install manually if needed
CREATE EXTENSION vector;
```

**Gemini API errors:**
- Ensure `GEMINI_API_KEY` is set
- Check API quota at https://makersuite.google.com/

**Permission denied:**
```sql
GRANT CREATE ON SCHEMA public TO openclaw;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO openclaw;
```

**Connection refused:**
- Check PostgreSQL is running: `sudo service postgresql status`
- Check `pg_hba.conf` allows local connections
- Verify port 5432 is not blocked
