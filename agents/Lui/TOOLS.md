# TOOLS.md - Model Configuration

## Agent Model Assignments (Hybrid Setup)

**Last Updated:** April 14, 2026  
**Strategy:** Best-in-class models per role, privacy-first for sensitive agents

---

### 🔒 LOCAL Models (Privacy-Critical)

| Agent | Model | Size | Purpose |
|-------|-------|------|---------|
| **Goldie** | `gemma4:latest` | 9.6 GB | Marketing copy, Shopify optimization (shares instance with June) |
| **June** | `gemma4:latest` | 9.6 GB | Family management, scheduling, personal data |

**Why Local:** These agents handle sensitive data (family info, personal context, marketing experiments). Running on same local instance = zero extra VRAM cost.

---

### ☁️ CLOUD Models (Performance-Critical)

| Agent | Model | Purpose | Rationale |
|-------|-------|---------|------------|
| **Lui** (COO) | `kimi-k2.5:cloud` | Sub-agent coordination, 1,500+ parallel tool calls | **Only model built for orchestration** |
| **Elon** (CTO) | `qwen3.5:cloud` | Technical frameworks, app specs, architecture | Best reasoning + coding in cloud |
| **Brains** (CMO) | `qwen3.5:cloud` | Memory audit, large context reasoning | Vision support for stored screenshots |
| **Warren** (Strategy) | `glm-5.1:cloud` | Strategic frameworks, opportunity pipelines | Structured logical analysis |
| **Buzz** (YouTube) | `qwen3.5:cloud` | YouTube strategy, thumbnail/frame analysis | Visual understanding |
| **Lens** (Media) | `minimax-m2.7:cloud` | Production pipeline, TTS coordination | Speed > deep reasoning |

**Why Cloud:** Maximum performance for complex tasks. Brains, Buzz, and Elon share `qwen3.5:cloud` — no extra config needed.

---

## Available Models

### Local (Ollama)
```bash
ollama list

NAME                  SIZE      MODIFIED
qwen3.5:latest        6.6 GB    Available
gemma4:latest         9.6 GB    Available
```

### Cloud (via Ollama Proxy)
- `qwen3.5:cloud` - Best reasoning & tool use
- `kimi-k2.5:cloud` - Multimodal & content (vision)
- `minimax-m2.7:cloud` - Fast coding
- `glm-5.1:cloud` - General reasoning

---

## Configuration Location

**File:** `/home/user/.openclaw/openclaw.json`

**Key sections:**
```json
{
  "agents": {
    "list": [
      {"id": "june", "model": "ollama/gemma4:latest"},
      {"id": "brains", "model": "ollama/gemma4:latest"},
      {"id": "lui", "model": "ollama/qwen3.5:cloud"},
      ...
    ]
  }
}
```

---

## Changing Models

### For a Single Agent
Edit `/home/user/.openclaw/openclaw.json`:
```json
{
  "id": "agent-name",
  "model": "ollama/<model-name>"
}
```

Then restart gateway:
```bash
openclaw gateway restart
```

### Pull New Local Models
```bash
ollama pull <model-name>
# e.g., ollama pull qwen3.5:latest
```

### Test Agent Connectivity
Spawn a test task:
```
/sessions_spawn --agent=<agent-id> --task="Confirm your model is working"
```

---

## Performance Notes

### Local Models
- ✅ **Pros:** Complete privacy, no API costs, works offline
- ⚠️ **Cons:** Slower, depends on hardware, limited model selection
- **Best for:** Sensitive personal data, simple Q&A, memory operations

### Cloud Models
- ✅ **Pros:** Fast, best-in-class reasoning, advanced features (vision, tools)
- ⚠️ **Cons:** Data leaves machine, requires internet
- **Best for:** Complex reasoning, coding, content creation, strategy

---

## Troubleshooting

### Agent Not Responding
1. Check model is available: `ollama list`
2. Restart gateway: `openclaw gateway restart`
3. Check agent config in `openclaw.json`

### Gateway Connection Issues
```bash
openclaw gateway status
openclaw gateway restart
```

### Model Not Found
Pull the model:
```bash
ollama pull <model-name>
```

---

## Security Notes

- **Agent-to-agent messaging:** Enabled (`tools.agentToAgent.enabled=true`)
- **Local models:** June & Brains handle sensitive data locally
- **Cloud models:** Business/creative work uses cloud for performance
- **No sensitive data** should be sent to cloud agents (finances, health, passwords)

---

## Quick Reference

**Need privacy?** → Use June or Brains (local)  
**Need speed/power?** → Use Lui, Warren, Elon, Goldie (cloud)  
**Need vision/multimodal?** → Use Buzz or Lens (kimi-k2.5:cloud)  
**Need coding?** → Use Elon (minimax-m2.7:cloud - fastest)
