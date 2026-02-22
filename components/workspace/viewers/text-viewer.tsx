"use client"

import { useState } from "react"
import { Bold, Italic, Heading2, List, ListOrdered, Undo2, Redo2, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextViewerProps {
  fileName: string
}

const TEXT_CONTENT: Record<string, string> = {
  "AAPL — Q4 Notes.txt": `# AAPL Q4 2025 Earnings Review

## Key Takeaways
- Revenue beat consensus by $2.1B driven by iPhone 16 Pro Max demand
- Services revenue hit all-time high of $25.3B (+14% YoY)
- Greater China revenue stabilized at $17.2B after 3 quarters of decline
- Gross margin expanded 80bps to 46.9% on favorable mix shift

## iPhone Segment
- Units estimated at 52M vs. 50M expected
- ASP increased 4% YoY driven by Pro mix shift
- Apple Intelligence features driving upgrade cycle in developed markets
- India production ramp on track - now 14% of iPhone production

## Services
- App Store growth re-accelerated to 16% YoY
- Apple TV+ subscriber count crossed 45M (unconfirmed)
- Financial services (Apple Card, Pay Later) gross margin improving
- Advertising revenue from App Store search growing double digits

## What We Got Wrong
- Wearables segment weaker than modeled (-3% vs. +2% expected)
- iPad refresh cycle not yet materializing in numbers
- R&D spend higher than expected at $7.8B - likely Vision Pro related

## Action Items
- [ ] Update DCF model with new guidance range
- [ ] Revise iPhone unit estimates for FY2026
- [ ] Schedule call with supply chain contacts re: India ramp
- [ ] Review Services margin trajectory assumptions`,

  "NVDA — Thesis.txt": `# NVIDIA Investment Thesis

## Core Thesis
NVIDIA is the primary beneficiary of the AI infrastructure buildout cycle, with a dominant position in training and inference accelerators. The transition to Blackwell Ultra architecture in 2026 extends the competitive moat and drives another product cycle upgrade.

## Bull Case ($200, +30%)
- Hyperscaler capex exceeds current estimates by 15-20%
- Blackwell Ultra captures meaningful share of inference workloads
- Software/CUDA ecosystem creates durable competitive advantage
- Data sovereignty requirements drive sovereign AI buildout
- Enterprise adoption of AI accelerates beyond current projections

## Base Case ($165, +8%)
- AI capex growth moderates to 25-30% in 2026
- Blackwell ramp on track, sustaining >70% gross margins
- Competitive threats from custom silicon (AVGO, MRVL) are manageable
- China restrictions limit TAM by ~10% but alternative markets offset

## Bear Case ($105, -32%)
- Capex cycle peaks in mid-2026, creating air pocket in orders
- AMD MI400 gains meaningful share in inference
- Customer pushback on pricing as competition increases
- Regulatory risk from export controls intensifies

## Key Metrics to Watch
1. Data center revenue growth trajectory (need >40% YoY to sustain multiple)
2. Inference vs. training revenue mix (inference = more sustainable demand)
3. Gross margin trajectory through Blackwell ramp
4. Customer concentration risk (top 5 = ~50% of revenue)
5. China/restricted market exposure and alternative demand sources

## Position Sizing
Current: 6.2% of fund (started at 4.5% in Q3 2024)
Recommended: Maintain at 5.5-6.5% range
Stop-loss consideration at $120 (25% drawdown from current)`,

  "IC Meeting — Feb 10, 2026": `# Investment Committee Meeting Notes
## February 10, 2026 | 9:00 AM EST

### Attendees
PM, Head of Research, Senior Analysts (Tech, HC, Energy), Risk Manager, COO

---

### Portfolio Review
- YTD Return: +4.2% (vs. S&P +3.8%)
- Gross Exposure: 165%
- Net Exposure: 72%
- Top Contributors: NVDA (+180bps), LLY (+95bps), JPM (+45bps)
- Top Detractors: XOM (-65bps), META (-40bps)

### New Position Proposals

**ADD: AVGO (Broadcom) - Senior Tech Analyst**
- Thesis: Custom silicon opportunity underappreciated, VMware integration ahead of schedule
- Entry: $185-190 range, PT $240
- Sizing: 3% initial, scale to 5% on pullback
- Vote: APPROVED (4-1)

**TRIM: XOM (Exxon Mobil) - Energy Analyst**
- Rationale: Crude weakness, Permian cost inflation higher than modeled
- Action: Reduce from 3.5% to 2.0%
- Vote: APPROVED (5-0)

### Risk Discussion
- VaR (95%) at 1.8% - within tolerance
- Factor exposure: Momentum overweight flagged by risk manager
- Sector concentration in Tech at 38% - at upper limit of guidelines
- Decision: No forced reduction but no new tech initiations until below 35%

### Action Items
- [ ] Execute AVGO entry orders (limit at $188)
- [ ] Begin XOM reduction over 3-day TWAP
- [ ] Risk team to run scenario on 10% tech correction impact
- [ ] Research to prepare GLP-1 competitive landscape update for next IC

### Next Meeting: February 24, 2026`,

  "Trade Ideas — Week of Feb 9": `# Trade Ideas — Week of February 9, 2026

## High Conviction

### Long AVGO $185 / Short AMD $155 (Pair Trade)
- Custom silicon vs. commodity GPU play
- AVGO's VMware synergies + custom AI ASIC wins create differentiated growth
- AMD's MI400 launch delays create near-term headwinds
- Spread target: $45 expansion (currently $30)
- Risk: AMD MI400 early positive reviews

### Overweight LLY into SURMOUNT-5 Data
- Head-to-head trial vs. Wegovy readout expected Q2
- Street pricing in 60% probability of superiority
- Our analysis suggests 75% probability based on mechanism of action
- Size: Add 1.5% to bring to 5.5% total position
- Risk: Non-inferior but not superior result

## Monitoring

### Potential CPI Fade (Feb 12)
- Consensus: +0.3% MoM core
- If hot (>0.35%): Short TLT, add to financials (JPM, GS)
- If cool (<0.25%): Add duration, reduce cyclical tilt
- Position size: 50bps tactical allocation either direction

### MSFT Azure Growth Watch
- Channel checks suggest Q2 Azure growth of 33-35% (street at 31%)
- If confirmed: Add 1% to position ahead of earnings
- Source: 3 enterprise CIO surveys + cloud consulting firm data

## Closed Ideas
- Short TSLA $280 -> Covered at $265 (+$15, +5.4%) -- TARGET HIT
- Long GS $480 -> Sold at $502 (+$22, +4.6%) -- IC-directed trim`,

  "Risk Committee Notes": `# Risk Committee Notes
## February 7, 2026

### Portfolio Risk Metrics
- Portfolio Beta: 1.12 (target: 0.9-1.15)
- Sharpe Ratio (trailing 12M): 1.85
- Max Drawdown (trailing 6M): -4.2%
- Correlation to S&P 500: 0.78
- Active Share: 62%

### Stress Test Results
| Scenario | Impact |
|----------|--------|
| 2022 Rate Shock Replay | -12.8% |
| 2020 COVID Crash (first 30 days) | -18.5% |
| Tech Sector -20% | -9.2% |
| Oil Spike to $120/bbl | -3.4% |
| China Invasion of Taiwan | -22.1% |

### Key Risks Identified
1. **Concentration Risk**: Top 5 positions = 28% of NAV (limit: 30%)
2. **Sector Risk**: Tech overweight at 38% (limit: 40%)
3. **Liquidity Risk**: All positions can be liquidated in <3 days
4. **Counterparty Risk**: Prime broker exposure diversified across 2 PBs

### Recommendations
- Implement tail hedge via SPX put spread (5% OTM, 3M tenor, 25bps cost)
- Review NVDA position sizing if it exceeds 7% of NAV
- Add VIX call spread as portfolio insurance (15/25 strike, Mar expiry)

### Compliance Items
- All positions within regulatory limits
- 13F filing prepared for Feb 14 deadline
- No material non-public information concerns flagged`,
}

function getDefaultContent(fileName: string) {
  return `# ${fileName}\n\nNotes and analysis for this document will be added here. Click to edit and start adding your research notes, meeting minutes, or analysis.`
}

export function TextViewer({ fileName }: TextViewerProps) {
  const initialContent = TEXT_CONTENT[fileName] ?? getDefaultContent(fileName)
  const [content, setContent] = useState(initialContent)
  const [isSaved, setIsSaved] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsSaved(false)
  }

  const handleSave = () => {
    setIsSaved(true)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-8 shrink-0 items-center gap-3 border-b border-border bg-background px-3">
        <span className="text-[10px] font-medium text-foreground">{fileName}</span>
        {!isSaved && (
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" title="Unsaved changes" />
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Undo">
            <Undo2 className="h-3 w-3" />
          </button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Redo">
            <Redo2 className="h-3 w-3" />
          </button>
          <span className="h-3 w-px bg-border" />
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Bold">
            <Bold className="h-3 w-3" />
          </button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Italic">
            <Italic className="h-3 w-3" />
          </button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Heading">
            <Heading2 className="h-3 w-3" />
          </button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Bullet list">
            <List className="h-3 w-3" />
          </button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Numbered list">
            <ListOrdered className="h-3 w-3" />
          </button>
          <span className="h-3 w-px bg-border" />
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-0.5 text-[10px] transition-colors",
              isSaved
                ? "text-muted-foreground"
                : "text-foreground bg-accent hover:bg-accent/80",
            )}
          >
            <Save className="h-3 w-3" />
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto bg-background p-6">
        <div className="mx-auto max-w-[680px]">
          <textarea
            value={content}
            onChange={handleChange}
            className="min-h-full w-full resize-none bg-transparent font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
            style={{ minHeight: "calc(100vh - 200px)" }}
            placeholder="Start typing..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-accent/30 px-3">
        <span className="text-[9px] text-muted-foreground">
          {content.split("\n").length} lines | {content.length} chars
        </span>
        <span className="text-[9px] text-muted-foreground">
          Markdown
        </span>
      </div>
    </div>
  )
}
