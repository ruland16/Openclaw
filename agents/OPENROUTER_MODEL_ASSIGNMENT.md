# OpenRouter Model Assignment Plan
## Created: 2026-04-11
## Author: Lui (COO)

## Overview
Optimized model assignments for all 8 agents using OpenRouter models for maximum cost-effectiveness while maintaining performance.

## Model Assignments

| Agent | Role | OpenRouter Model | Cost (per token) | Context | Rationale |
|-------|------|------------------|------------------|---------|-----------|
| **Lui** | COO/Orchestrator | `deepseek/deepseek-chat` | Prompt: $0.00000014<br>Completion: $0.00000028 | 128k | High reasoning needed for coordination. Good balance of cost/performance. |
| **Warren** | Strategy Chief | `deepseek/deepseek-chat` | Prompt: $0.00000014<br>Completion: $0.00000028 | 128k | Strategic thinking benefits from consistent model with Lui. |
| **Brains** | Memory Officer | `google/gemma-4-31b-it:free` | **FREE** | 262k | Memory work is background/stable. Free model with large context ideal. |
| **Buzz** | Creative/YouTube | `qwen/qwen3.5-9b` | Prompt: $0.00000005<br>Completion: $0.00000015 | 256k | Very cheap, good for creative content generation. |
| **Lens** | Media Producer | `amazon/nova-micro-v1` | Prompt: $0.000000035<br>Completion: $0.00000014 | 128k | Extremely cheap, good for technical/automation tasks. |
| **Elon** | CTO | `qwen/qwen3-coder:free` | **FREE** | 262k | Free coding model specialized for technical tasks. |
| **Goldie** | Marketing Chief | `google/gemma-4-26b-a4b-it:free` | **FREE** | 262k | Free model good for marketing content generation. |
| **June** | Life Manager | `meta-llama/llama-3.3-70b-instruct:free` | **FREE** | 65k | Free 70B model good for personal organization tasks. |

## Cost Analysis

### Monthly Cost Estimates (Assuming Moderate Usage):
- **Free Models (4 agents)**: $0.00
- **Ultra-Low Cost (2 agents)**: ~$0.02-0.10 each = $0.04-0.20 total
- **DeepSeek Models (2 agents)**: ~$0.10-0.20 each = $0.20-0.40 total

**Total Estimated Monthly Cost**: $0.24 - $0.60

### Compared to Previous Setup:
- **Previous**: All 8 agents on DeepSeek = ~$0.80-1.60/month
- **New**: Mixed free/low-cost = ~$0.24-0.60/month
- **Savings**: 60-70% cost reduction

## Implementation Notes

### Free Model Considerations:
1. **Rate Limits**: Free models may have rate limits or queue times
2. **Availability**: Free models may have intermittent availability
3. **Performance**: Slightly slower response times possible
4. **Best for**: Background tasks, non-time-critical work

### Low-Cost Model Advantages:
1. **Reliability**: Paid models have better uptime
2. **Speed**: Faster response times
3. **Consistency**: More predictable performance
4. **Best for**: Critical coordination, user-facing tasks

### Agent-Specific Rationale:
1. **Lui & Warren**: Need highest reliability for coordination/strategy
2. **Brains, Goldie, June**: Memory/marketing/life tasks are stable, can use free
3. **Buzz & Lens**: Creative/media tasks benefit from cheap specialized models
4. **Elon**: Technical work benefits from free coding model

## Configuration Steps

To implement this configuration:

1. Update each agent's session configuration to use assigned OpenRouter model
2. Set up OpenRouter API key in environment
3. Test each agent with new model assignment
4. Monitor performance and adjust if needed
5. Update ORGANIZATION.md with new model assignments

## Fallback Strategy

If any free model becomes unavailable:
1. **Primary fallback**: Use corresponding paid version (remove `:free`)
2. **Secondary fallback**: Use `deepseek/deepseek-chat` for all
3. **Monitor costs**: Track usage to ensure budget compliance

## Performance Monitoring

Key metrics to track:
1. Response times per agent
2. Token usage and costs
3. Task completion rates
4. User satisfaction with agent outputs
5. Model availability/uptime

## Review Schedule
- **Weekly**: Check cost vs budget
- **Monthly**: Review model performance, consider adjustments
- **Quarterly**: Re-evaluate entire model strategy based on new OpenRouter offerings

---
*Last updated: 2026-04-11 by Lui*