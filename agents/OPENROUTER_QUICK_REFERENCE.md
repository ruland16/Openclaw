# OpenRouter Model Quick Reference

## 🎯 Agent Model Assignments

| Agent | Model | Cost/Token | Status | Best For |
|-------|-------|------------|--------|----------|
| **Lui** | `deepseek/deepseek-chat` | $0.00000014/$0.00000028 | ✅ Active | Coordination, routing |
| **Warren** | `deepseek/deepseek-chat` | $0.00000014/$0.00000028 | ✅ Active | Strategy, analysis |
| **Brains** | `google/gemma-4-31b-it:free` | **FREE** | ⚡ Free | Memory work |
| **Buzz** | `qwen/qwen3.5-9b` | $0.00000005/$0.00000015 | 💸 Ultra-cheap | Creative content |
| **Lens** | `amazon/nova-micro-v1` | $0.000000035/$0.00000014 | 💸 Ultra-cheap | Media automation |
| **Elon** | `qwen/qwen3-coder:free` | **FREE** | ⚡ Free | Coding, tech |
| **Goldie** | `google/gemma-4-26b-a4b-it:free` | **FREE** | ⚡ Free | Marketing |
| **June** | `meta-llama/llama-3.3-70b-instruct:free` | **FREE** | ⚡ Free | Life management |

## 💰 Monthly Cost Estimate
- **Free (4 agents)**: $0.00
- **Ultra-low (2 agents)**: $0.04-0.20
- **Low-cost (2 agents)**: $0.20-0.40
- **TOTAL**: **$0.24 - $0.60**

## ⚡ Performance Notes
- **Free models**: May have rate limits, good for background tasks
- **Paid models**: Better reliability, faster response
- **Mixed strategy**: Optimizes cost vs performance

## 🔄 Fallback Models
If free models unavailable:
- Brains → `google/gemma-4-31b-it` (paid)
- Elon → `qwen/qwen3-coder` (paid)
- Goldie → `google/gemma-4-26b-a4b-it` (paid)
- June → `meta-llama/llama-3.3-70b-instruct` (paid)

## 📊 Monitoring
Track:
1. Response times per agent
2. Token usage/costs
3. Task completion rates
4. Model availability

---
*Updated: 2026-04-11*