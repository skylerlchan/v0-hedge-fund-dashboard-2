"use client"

import {
  Clock,
  ExternalLink,
  FileSpreadsheet,
  Minus,
  ArrowUp,
  ArrowDown,
  Check,
  AlertTriangle,
  Gauge,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type ThesisAlignment = "confirms" | "challenges" | "neutral"
type PriceAction = "raise" | "lower" | "maintain"

interface StockInsight {
  ticker: string
  company: string
  sector: string
  currentTP: number
  suggestedTP: number | null
  priceAction: PriceAction
  lastPrice: number
  thesisAlignment: ThesisAlignment
  thesisSummary: string
  rationale: string
  /** 0-100 confidence signal */
  confidence: number
}

interface Headline {
  title: string
  source: string
  time: string
}

interface ThemeCluster {
  id: string
  theme: string
  category: string
  summary: string
  headlines: Headline[]
  insights: StockInsight[]
}

export type FocusFilter =
  | "none"
  | "high-confidence"
  | "against-thesis"
  | "in-line"
  | "no-change"
  | "raise-tp"
  | "lower-tp"
  | "large-holdings"

function insightMatchesFocus(insight: StockInsight, filter: FocusFilter): boolean {
  switch (filter) {
    case "none": return true
    case "high-confidence": return insight.confidence >= 80
    case "against-thesis": return insight.thesisAlignment === "challenges"
    case "in-line": return insight.thesisAlignment === "confirms"
    case "no-change": return insight.priceAction === "maintain"
    case "raise-tp": return insight.priceAction === "raise"
    case "lower-tp": return insight.priceAction === "lower"
    case "large-holdings": return insight.lastPrice > 0 // placeholder -- we use a weight proxy below
    default: return true
  }
}

/** Simulated portfolio weights for the "large holdings" filter */
const PORTFOLIO_WEIGHT: Record<string, number> = {
  NVDA: 6.2, MSFT: 5.1, GOOGL: 3.8, AAPL: 5.4, META: 3.1,
  LLY: 4.1, UNH: 3.6, JNJ: 2.4, XOM: 3.2, CVX: 2.1,
  JPM: 4.5, GS: 2.8,
}

function insightMatchesFocusWithWeight(insight: StockInsight, filter: FocusFilter): boolean {
  if (filter === "large-holdings") {
    return (PORTFOLIO_WEIGHT[insight.ticker] ?? 0) >= 2.5
  }
  return insightMatchesFocus(insight, filter)
}

function getExcelPath(ticker: string, sector: string) {
  return `/positions/${sector.toLowerCase()}/${ticker.toLowerCase()}_model.xlsx`
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; abbr: string }> = {
  Bloomberg: { bg: "bg-[#FF6600]/15", text: "text-[#FF6600]", abbr: "B" },
  Reuters: { bg: "bg-[#FF8000]/15", text: "text-[#FF8000]", abbr: "R" },
  "STAT News": { bg: "bg-[#1a8fc4]/15", text: "text-[#1a8fc4]", abbr: "ST" },
  WSJ: { bg: "bg-[#0080C6]/15", text: "text-[#0080C6]", abbr: "WSJ" },
  FT: { bg: "bg-[#FCD0B1]/20", text: "text-[#c9742e]", abbr: "FT" },
  CNBC: { bg: "bg-[#005594]/15", text: "text-[#2080c0]", abbr: "C" },
  "Nikkei Asia": { bg: "bg-[#c0392b]/15", text: "text-[#c0392b]", abbr: "NK" },
  "Barron's": { bg: "bg-[#1a6b3c]/15", text: "text-[#1a6b3c]", abbr: "BA" },
  "The Information": { bg: "bg-[#6b5b95]/15", text: "text-[#6b5b95]", abbr: "TI" },
}

function SourceBadge({ source }: { source: string }) {
  const config = SOURCE_COLORS[source] ?? { bg: "bg-muted", text: "text-muted-foreground", abbr: source[0] }
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center justify-center rounded px-1.5 text-[9px] font-bold uppercase tracking-wider leading-none",
        config.bg,
        config.text,
      )}
      title={source}
    >
      {config.abbr}
    </span>
  )
}

// --------------- DATA ---------------

const themeClusters: ThemeCluster[] = [
  {
    id: "1",
    theme: "AI Infrastructure Spending Accelerates Beyond Expectations",
    category: "AI / Semis",
    summary:
      "A cluster of data points across earnings, supply chain reports, and capex guidance revisions all point to the same conclusion: the AI infrastructure buildout is running hotter and longer than the market anticipated six months ago. NVIDIA's Q1 revenue guide of $43B beat consensus by 15%, while Microsoft disclosed a 40% sequential increase in unfulfilled Azure AI commitments. Separately, Taiwanese supply chain sources report Blackwell orders extending into 2027, and Morgan Stanley's semiconductor team raised their industry capex estimate for 2026 by 18%. The convergence of bottom-up company data and top-down industry checks creates an unusually strong signal.",
    headlines: [
      { title: "NVIDIA Forecasts Record Revenue on Surging AI Chip Demand", source: "Bloomberg", time: "12 min ago" },
      { title: "Microsoft Azure AI Backlog Grows 40% as Capacity Lags Demand", source: "Bloomberg", time: "4h ago" },
      { title: "TSMC Reports Surge in Blackwell Wafer Orders Through 2027", source: "Reuters", time: "2h ago" },
      { title: "Morgan Stanley Raises 2026 Semi Capex Estimate by 18%", source: "Barron's", time: "3h ago" },
    ],
    insights: [
      { ticker: "NVDA", company: "NVIDIA Corp.", sector: "Technology", currentTP: 920, suggestedTP: 1025, priceAction: "raise", lastPrice: 878, thesisAlignment: "confirms", thesisSummary: "AI infrastructure supercycle intact", rationale: "Four independent signals confirm Blackwell demand extends the cycle 18-24 months beyond prior estimates. Revenue beat, supply chain checks, and sell-side revisions all align. Raise TP to reflect higher through-cycle earnings power.", confidence: 92 },
      { ticker: "MSFT", company: "Microsoft Corp.", sector: "Technology", currentTP: 480, suggestedTP: 465, priceAction: "lower", lastPrice: 462, thesisAlignment: "challenges", thesisSummary: "Azure as primary AI monetization vehicle", rationale: "Azure growth decelerated to 28% despite the demand surge, suggesting capacity constraints are binding. Backlog growth is encouraging long-term but near-term revenue conversion is slower than thesis assumed.", confidence: 68 },
      { ticker: "GOOGL", company: "Alphabet Inc.", sector: "Technology", currentTP: 195, suggestedTP: 210, priceAction: "raise", lastPrice: 182, thesisAlignment: "confirms", thesisSummary: "GCP share gains vs. Azure", rationale: "MSFT capacity constraints create a window for GCP to capture overflow enterprise AI workloads. Multiple data points confirm the supply-demand gap that underpins our relative value thesis.", confidence: 74 },
    ],
  },
  {
    id: "2",
    theme: "Rate Path Uncertainty Pressures Financial Sector Multiples",
    category: "Macro / Rates",
    summary:
      "The hawkish tone of the January Fed minutes caught markets off guard, pushing the 2-year yield up 8bps and repricing the terminal rate. Three FOMC members indicated a preference for holding rates steady through all of 2026 if services inflation does not materially improve. Concurrently, Goldman Sachs raised its S&P 500 year-end target to 6,500 on the back of strong earnings, but the bullish equity call is predicated on two 25bp cuts that now look increasingly unlikely. The disconnect between equity optimism and rates reality creates a tension that is most acutely felt in financials, where NII and IB fee recovery assumptions are being re-evaluated.",
    headlines: [
      { title: "Fed Minutes Signal Cautious Approach to Rate Cuts in 2026", source: "Reuters", time: "34 min ago" },
      { title: "Goldman Sachs Raises S&P 500 Year-End Target to 6,500", source: "CNBC", time: "5h ago" },
      { title: "2-Year Treasury Yield Climbs to 4.52% on Hawkish Fed Tone", source: "Bloomberg", time: "1h ago" },
    ],
    insights: [
      { ticker: "JPM", company: "JPMorgan Chase", sector: "Financials", currentTP: 235, suggestedTP: 220, priceAction: "lower", lastPrice: 228, thesisAlignment: "challenges", thesisSummary: "NII expansion from rate normalization", rationale: "Our bull case assumed two 25bp cuts by mid-year boosting loan demand. Three Fed members now prefer no cuts at all in 2026. Higher-for-longer erodes the NII tailwind and compresses the multiple. Lower TP.", confidence: 78 },
      { ticker: "GS", company: "Goldman Sachs", sector: "Financials", currentTP: 510, suggestedTP: 485, priceAction: "lower", lastPrice: 498, thesisAlignment: "challenges", thesisSummary: "IB fee recovery driven by rate normalization", rationale: "Delayed easing means M&A and IPO pipeline remains suppressed. Goldman's own bullish equity target ironically depends on rate cuts that their rates desk sees as unlikely. IB recovery thesis pushed out by at least one quarter.", confidence: 72 },
      { ticker: "XOM", company: "Exxon Mobil", sector: "Energy", currentTP: 125, suggestedTP: null, priceAction: "maintain", lastPrice: 114, thesisAlignment: "confirms", thesisSummary: "Real asset inflation hedge", rationale: "Persistent inflation and hawkish Fed support our thesis that energy acts as a natural portfolio hedge in this regime. No TP change needed, but conviction increases with each hawkish data point.", confidence: 81 },
    ],
  },
  {
    id: "3",
    theme: "GLP-1 Platform Expansion Reshapes Healthcare Landscape",
    category: "Healthcare",
    summary:
      "Eli Lilly's SYNERGY-NASH Phase 3 trial data exceeded all expectations with a 68% resolution rate, blowing past Madrigal's 42% benchmark and opening a potentially massive new TAM for the GLP-1 drug class. The NASH market remains almost entirely untapped with only one approved therapy. Simultaneously, Apple's record $110B buyback and 18% services growth signal that mega-cap capital allocation priorities remain shareholder-friendly, though the immediate healthcare read-through is limited. The LLY data is the dominant signal here, with clear implications for competitive positioning across pharma and managed care names.",
    headlines: [
      { title: "Eli Lilly GLP-1 Drug Mounjaro Shows Promise in NASH Trial", source: "STAT News", time: "1h ago" },
      { title: "NASH Treatment Market Projected to Reach $40B by 2032", source: "Reuters", time: "2h ago" },
      { title: "Madrigal Pharma Shares Drop 12% on Competitive Data Read", source: "Bloomberg", time: "1h ago" },
    ],
    insights: [
      { ticker: "LLY", company: "Eli Lilly & Co.", sector: "Healthcare", currentTP: 880, suggestedTP: 1020, priceAction: "raise", lastPrice: 812, thesisAlignment: "confirms", thesisSummary: "GLP-1 platform optionality into adjacencies", rationale: "NASH indication materially expands TAM beyond our base case. Trial data exceeds bear-case efficacy hurdle by 26pts across three corroborating data points. Raise TP significantly to reflect new peak revenue estimates of $8-12B incremental.", confidence: 94 },
      { ticker: "UNH", company: "UnitedHealth Group", sector: "Healthcare", currentTP: 590, suggestedTP: null, priceAction: "maintain", lastPrice: 568, thesisAlignment: "neutral", thesisSummary: "MCO cost management and membership growth", rationale: "NASH treatment adoption may modestly reduce chronic liver disease costs over time, but the effect is too long-dated and uncertain to revise near-term TP. Monitor for formulary decisions in H2.", confidence: 45 },
      { ticker: "JNJ", company: "Johnson & Johnson", sector: "Healthcare", currentTP: 168, suggestedTP: 158, priceAction: "lower", lastPrice: 162, thesisAlignment: "challenges", thesisSummary: "Pharma pipeline diversification", rationale: "LLY's strong NASH data further marginalizes JNJ's competitive position in metabolic disease. Madrigal's 12% drop shows market is repricing the entire competitive set. Our pipeline diversification thesis weakens as the GLP-1 moat deepens.", confidence: 70 },
    ],
  },
  {
    id: "4",
    theme: "Big Tech Capital Returns Signal Confidence in Cash Flow Durability",
    category: "Corporate",
    summary:
      "Apple's authorization of an additional $110 billion in share repurchases -- the largest buyback program in corporate history -- alongside a 4% dividend increase sends a powerful signal about management's confidence in the durability of the services-led business model. Services revenue reached an all-time high of $26.7B, growing 18% year-over-year and now representing 28% of total revenue. The installed base of active devices exceeded 2.3 billion globally. Apple Intelligence adoption at 74% of iPhone 16 users suggests the AI feature set will drive a meaningful upgrade cycle. This theme reinforces the broader narrative that mega-cap tech companies are generating more cash than they can productively reinvest.",
    headlines: [
      { title: "Apple Announces $110B Share Buyback Program, Largest in History", source: "WSJ", time: "2h ago" },
      { title: "Apple Services Revenue Hits All-Time High of $26.7B", source: "Bloomberg", time: "2h ago" },
      { title: "Apple Intelligence Adoption Reaches 74% of iPhone 16 Users", source: "The Information", time: "3h ago" },
    ],
    insights: [
      { ticker: "AAPL", company: "Apple Inc.", sector: "Technology", currentTP: 240, suggestedTP: 260, priceAction: "raise", lastPrice: 228, thesisAlignment: "confirms", thesisSummary: "Services margin expansion + capital return", rationale: "Record buyback accelerates EPS compounding. Services at 28% of revenue with higher margins confirms the mix-shift thesis. Three data points -- buyback, services record, AI adoption -- all reinforce. Raise TP to reflect buyback-adjusted earnings growth.", confidence: 88 },
      { ticker: "META", company: "Meta Platforms", sector: "Technology", currentTP: 590, suggestedTP: null, priceAction: "maintain", lastPrice: 572, thesisAlignment: "neutral", thesisSummary: "AI-driven ad targeting efficiency", rationale: "AAPL's capital return story is company-specific and doesn't directly inform our META ad monetization thesis. No cross-read.", confidence: 40 },
    ],
  },
  {
    id: "5",
    theme: "Permian Basin Consolidation Enters Final Phase",
    category: "Energy",
    summary:
      "Exxon's $8.4B acquisition of 120,000 net acres in the Delaware Basin marks a decisive step in the Permian consolidation endgame. The deal makes Exxon the largest single-operator acreage holder in the basin, with breakeven economics below $40/barrel WTI providing a substantial margin of safety. Analysts expect Chevron and ConocoPhillips to respond with deals of their own as remaining high-quality acreage becomes scarce. The deal prices Permian acreage at a premium to recent transactions, effectively resetting comparable valuations for all operators in the basin.",
    headlines: [
      { title: "ExxonMobil Expands Permian Basin with $8.4B Acquisition", source: "FT", time: "3h ago" },
      { title: "Permian Acreage Prices Hit Record on XOM Deal Premium", source: "Reuters", time: "4h ago" },
      { title: "Chevron, ConocoPhillips Seen as Likely Responsive Acquirers", source: "WSJ", time: "5h ago" },
    ],
    insights: [
      { ticker: "XOM", company: "Exxon Mobil", sector: "Energy", currentTP: 125, suggestedTP: 138, priceAction: "raise", lastPrice: 114, thesisAlignment: "confirms", thesisSummary: "Permian consolidation and FCF growth", rationale: "Accretive acquisition at sub-$40 breakeven validates our Permian consolidation thesis. Record acreage pricing confirms scarcity value. Raise TP to reflect added production capacity and improved cost curve positioning.", confidence: 86 },
      { ticker: "CVX", company: "Chevron Corp.", sector: "Energy", currentTP: 180, suggestedTP: 188, priceAction: "raise", lastPrice: 168, thesisAlignment: "confirms", thesisSummary: "Permian acreage value re-rating", rationale: "XOM deal reprices Permian acreage higher, which directly benefits CVX's existing Delaware Basin position. Multiple sources confirm CVX is evaluating responsive M&A. Modest TP increase on comp-based re-rating.", confidence: 72 },
    ],
  },
  {
    id: "6",
    theme: "China Tech Nationalism Escalates Geopolitical Risk for US Semis",
    category: "Geopolitical",
    summary:
      "Beijing's $150B stimulus package for domestic semiconductor manufacturing and AI development represents a significant escalation in China's push for tech self-sufficiency. The package targets mature node chips (28nm and above) where Chinese foundries are rapidly closing the gap, and includes new provisions restricting foreign cloud providers from serving Chinese government agencies. US chipmakers face dual headwinds: increased competition in mature nodes and potential loss of Asia-Pacific cloud revenue. The timing -- alongside NVIDIA's strong earnings -- creates a mixed signal for AI chip names with significant China exposure.",
    headlines: [
      { title: "China Announces $150B Stimulus Package Targeting Tech Sector", source: "Nikkei Asia", time: "6h ago" },
      { title: "Beijing Restricts Foreign Cloud Providers from Government Use", source: "Reuters", time: "5h ago" },
      { title: "Chinese Foundries Close Gap in 28nm Chip Production Yields", source: "Bloomberg", time: "6h ago" },
    ],
    insights: [
      { ticker: "NVDA", company: "NVIDIA Corp.", sector: "Technology", currentTP: 1025, suggestedTP: null, priceAction: "maintain", lastPrice: 878, thesisAlignment: "challenges", thesisSummary: "Uncontested AI chip leadership", rationale: "China stimulus accelerates domestic chip alternatives, adding long-term competitive risk. Three separate policy actions signal a coordinated effort. No TP change yet given strong near-term demand, but flagging as a risk to monitor closely.", confidence: 55 },
      { ticker: "AAPL", company: "Apple Inc.", sector: "Technology", currentTP: 260, suggestedTP: 250, priceAction: "lower", lastPrice: 228, thesisAlignment: "challenges", thesisSummary: "Greater China revenue stability", rationale: "Cloud restrictions and tech nationalism add pressure to AAPL's 18% China revenue exposure. Three policy vectors -- subsidies, cloud restrictions, foundry buildout -- all point the same direction. Lower TP modestly to reflect incremental geopolitical risk premium.", confidence: 65 },
    ],
  },
]

// --------------- COMPONENTS ---------------

const PRICE_ACTION_CONFIG: Record<PriceAction, { label: string; color: string; bgColor: string; Icon: typeof ArrowUp }> = {
  raise: { label: "Raise TP", color: "text-positive", bgColor: "bg-positive/10", Icon: ArrowUp },
  lower: { label: "Lower TP", color: "text-negative", bgColor: "bg-negative/10", Icon: ArrowDown },
  maintain: { label: "Maintain TP", color: "text-muted-foreground", bgColor: "bg-muted", Icon: Minus },
}

const THESIS_CONFIG: Record<ThesisAlignment, { label: string; color: string; bgColor: string; Icon: typeof Check }> = {
  confirms: { label: "In-line with thesis", color: "text-positive", bgColor: "bg-positive/8", Icon: Check },
  challenges: { label: "Against thesis", color: "text-negative", bgColor: "bg-negative/8", Icon: AlertTriangle },
  neutral: { label: "Thesis unaffected", color: "text-muted-foreground", bgColor: "bg-muted/60", Icon: Minus },
}

function ConfidenceSignal({ value }: { value: number }) {
  const color =
    value >= 80 ? "text-positive" :
    value >= 60 ? "text-[#c9a227]" :
    "text-muted-foreground"
  const bgColor =
    value >= 80 ? "bg-positive/10" :
    value >= 60 ? "bg-[#c9a227]/10" :
    "bg-muted"
  const label =
    value >= 80 ? "High" :
    value >= 60 ? "Med" :
    "Low"

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
              bgColor,
              color,
            )}
          >
            <Gauge className="h-2.5 w-2.5" />
            {value}
            <span className="text-[9px] font-medium opacity-70">{label}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground border-border">
          <p className="text-xs">Confidence: {value}/100 — Based on source count, data convergence, and signal strength</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function InsightRow({ insight, focusFilter = "none" }: { insight: StockInsight; focusFilter?: FocusFilter }) {
  const priceConfig = PRICE_ACTION_CONFIG[insight.priceAction]
  const thesisConfig = THESIS_CONFIG[insight.thesisAlignment]
  const excelPath = getExcelPath(insight.ticker, insight.sector)
  const tpChange = insight.suggestedTP ? insight.suggestedTP - insight.currentTP : 0
  const tpChangePercent = insight.suggestedTP ? ((tpChange / insight.currentTP) * 100) : 0
  const upside = insight.suggestedTP
    ? ((insight.suggestedTP - insight.lastPrice) / insight.lastPrice * 100)
    : ((insight.currentTP - insight.lastPrice) / insight.lastPrice * 100)

  const isActive = focusFilter === "none" || insightMatchesFocusWithWeight(insight, focusFilter)
  const isFocusMode = focusFilter !== "none"

  return (
    <div
      className={cn(
        "py-3 first:pt-1.5 last:pb-1.5 rounded-md transition-all duration-300",
        isFocusMode && isActive && "relative ring-1 ring-foreground/10 bg-gradient-to-r from-foreground/[0.03] to-transparent my-1 px-3 -mx-1",
        isFocusMode && !isActive && "opacity-25 saturate-0",
      )}
    >
      {/* Top: Ticker, confidence, thesis badge, TP action badge, excel button */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="font-mono text-xs font-semibold text-foreground">{insight.ticker}</span>
        <span className="text-[11px] text-muted-foreground/70">{insight.company}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <ConfidenceSignal value={insight.confidence} />
          {/* Thesis alignment badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
              thesisConfig.bgColor,
              thesisConfig.color,
            )}
          >
            <thesisConfig.Icon className="h-2.5 w-2.5" />
            {thesisConfig.label}
          </span>
          {/* Price action badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              priceConfig.bgColor,
              priceConfig.color,
            )}
          >
            <priceConfig.Icon className="h-2.5 w-2.5" />
            {priceConfig.label}
          </span>
          {/* Excel link */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={excelPath}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-[#21a366]/30 bg-[#21a366]/10 px-2 py-0.5 text-[10px] font-medium text-[#21a366] transition-colors hover:bg-[#21a366]/20 hover:border-[#21a366]/50"
                  aria-label={`Open ${insight.ticker} position model spreadsheet`}
                >
                  <FileSpreadsheet className="h-3 w-3" />
                  See model
                </a>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-popover text-popover-foreground border-border">
                <p className="text-xs font-mono">Positions / {insight.sector} / {insight.ticker.toLowerCase()}_model.xlsx</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Middle: Target price row */}
      <div className="flex items-center gap-4 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Last</span>
          <span className="font-mono text-[11px] text-muted-foreground">${insight.lastPrice}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">TP</span>
          <span className="font-mono text-[11px] text-muted-foreground">${insight.currentTP}</span>
          {insight.suggestedTP && (
            <>
              <span className="text-muted-foreground/40">{"-->"}</span>
              <span className={cn("font-mono text-[11px] font-semibold", priceConfig.color)}>
                ${insight.suggestedTP}
              </span>
              <span className={cn("font-mono text-[10px]", priceConfig.color)}>
                ({tpChangePercent > 0 ? "+" : ""}{tpChangePercent.toFixed(1)}%)
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Upside</span>
          <span className={cn("font-mono text-[11px] font-medium", upside > 0 ? "text-positive" : "text-negative")}>
            {upside > 0 ? "+" : ""}{upside.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Bottom: Thesis + Rationale */}
      <div className="flex items-start gap-2">
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground/60 pt-px">Thesis</span>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-[11px] leading-relaxed text-muted-foreground cursor-default">
                <span className={cn("font-medium", thesisConfig.color)}>{insight.thesisSummary}</span>
                <span className="text-muted-foreground/60">{" -- "}</span>
                <span>{insight.rationale}</span>
              </p>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm bg-popover text-popover-foreground border-border">
              <p className="text-xs leading-relaxed">{insight.rationale}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {category}
    </span>
  )
}

function ThemeCard({ cluster }: { cluster: ThemeCluster }) {
  const uniqueSources = [...new Set(cluster.headlines.map((h) => h.source))]
  const sourceCount = uniqueSources.length

  return (
    <article className="group border-b border-border px-6 py-5 transition-colors hover:bg-card/60">
      {/* Theme header */}
      <div className="mb-2 flex items-center gap-2.5">
        <CategoryBadge category={cluster.category} />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {cluster.headlines[0].time}
        </span>
        <div className="flex items-center gap-1">
          {uniqueSources.map((source) => (
            <SourceBadge key={source} source={source} />
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground/60">
          {sourceCount} source{sourceCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Theme title */}
      <h3 className="mb-3 text-[15px] font-semibold leading-snug text-foreground">
        {cluster.theme}
      </h3>

      {/* Headline cluster */}
      <div className="mb-3 rounded-md border border-border/60 bg-secondary/30 px-3 py-2">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1 block">
          {cluster.headlines.length} related headlines
        </span>
        <ul className="space-y-1">
          {cluster.headlines.map((h, i) => (
            <li key={i} className="flex items-start gap-2 group/headline">
              <SourceBadge source={h.source} />
              <span className="text-[12px] leading-snug text-foreground/80 flex-1">{h.title}</span>
              <span className="text-[10px] text-muted-foreground/50 shrink-0">{h.time}</span>
              <button
                type="button"
                className="shrink-0 rounded p-0.5 text-muted-foreground/40 opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover/headline:opacity-100"
                aria-label="Open article"
              >
                <ExternalLink className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Theme synthesis */}
      <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground">
        {cluster.summary}
      </p>

      {/* Stock Insights */}
      <div className="rounded-lg border border-border bg-secondary/40 px-4 py-2">
        <div className="mb-1 flex items-center gap-3 border-b border-border/60 pb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Target Price & Thesis Review
          </span>
          <span className="text-[10px] text-muted-foreground/50">
            {cluster.insights.length} position{cluster.insights.length !== 1 ? "s" : ""} affected
          </span>
        </div>
        <div className="divide-y divide-border/40">
          {cluster.insights.map((insight) => (
            <InsightRow key={insight.ticker} insight={insight} />
          ))}
        </div>
      </div>
    </article>
  )
}

export function MorningBrief() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
    </div>
  )
}

function PortfolioStat({
  label,
  value,
  positive,
}: {
  label: string
  value: string
  positive?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-mono text-xs font-medium",
          positive ? "text-positive" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  )
}
