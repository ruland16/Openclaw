# Model Assignments

Generated: 2026-04-14

## Agent Model Assignments

| Agent | Role | Primary Model | Fallback | Rationale |
|-------|------|---------------|----------|-----------|
| **Lui** | Orchestrator/COO | `qwen3.5:cloud` | `glm-5.1:cloud` | Balanced reasoning + tool use for coordination |
| **Warren** | Strategy Chief | `kimi-k2.5:cloud` | `qwen3.5:cloud` | Multimodal reasoning for market analysis |
| **Brains** | Chief Memory Officer | `glm-5.1:cloud` | `qwen3.5:cloud` | Consistent, accurate memory operations |
| **Lens** | Media Producer | `qwen3.5:latest` (local) | `qwen3.5:cloud` | Vision capabilities + cost savings |
| **Elon** | CTO | `minimax-m2.7:cloud` | `qwen3.5:cloud` | Fast coding + agentic tool use |
| **Buzz** | CCO YouTube | `qwen3.5:cloud` | `glm-5.1:cloud` | Content analytics + strategy |
| **Goldie** | Marketing Chief | `minimax-m2.7:cloud` | `qwen3.5:cloud` | High-volume copy + campaigns |
| **June** | Personal Life Manager | `gemma4:latest` (local) | `glm-5.1:cloud` | Privacy + adequate for personal tasks |

## Fallback Strategy

**Local model agents have cloud fallbacks when:**
- VRAM is insufficient for complex tasks
- Local model is overloaded/slow
- User requests faster response for urgent tasks
- Task exceeds local model capabilities

**Fallback Priority:**
1. Same model family cloud version (e.g., qwen3.5:latest → qwen3.5:cloud)
2. Balanced generalist (glm-5.1:cloud)
3. Fast specialist (minimax-m2.7:cloud)

## How to Apply

### Per-Session Override
```bash
openclaw session_status --session <sessionKey> --model qwen3.5:cloud
```

### When Spawning Subagents
```bash
openclaw sessions_spawn --task "<task>" --model qwen3.5:cloud
```

### Tool Call (from within agent)
```
session_status(model="qwen3.5:cloud")
```

## Model Capabilities Summary

| Model | Type | Size | Strengths | Best For |
|-------|------|------|-----------|----------|
| `kimi-k2.5:cloud` | Cloud | - | Multimodal reasoning, subagents | Complex analysis, research |
| `qwen3.5:cloud` | Cloud | - | Reasoning, coding, vision | General orchestration, analytics |
| `glm-5.1:cloud` | Cloud | - | Reasoning, code generation | Memory, consistency tasks |
| `minimax-m2.7:cloud` | Cloud | - | Fast coding, productivity | Development, marketing copy |
| `qwen3.5:latest` | Local | 6.6 GB | Vision, reasoning | Media processing (privacy) |
| `gemma4:latest` | Local | 9.6 GB | Reasoning | Personal tasks (privacy) |

## Local Model Test Results (2026-04-14)

**Test Status:** ✅ PASSED

| Model | Test | Result | Details |
|-------|------|--------|----------|
| `gemma4:latest` | GPU Load | ✅ Success | 11 GB on GPU, 100% GPU acceleration, 32k context |
| `gemma4:latest` | Response | ✅ Working | Model stays cached ~5 min after load |
| `qwen3.5:latest` | Availability | ✅ Ready | 6.6 GB, loads on demand |

**Performance Notes:**
- Cold start: 15-30 seconds (model load from disk)
- Cached requests: Fast (model stays in GPU memory ~5 min)
- GPU utilization: 100% (full acceleration)
- Context window: 32k tokens

**Recommendations:**
- Local models are production-ready for Lens and June
- Expect ~20s delay on first request after idle period
- Subsequent requests within 5 min window are instant
- Privacy benefit: No data leaves the machine
