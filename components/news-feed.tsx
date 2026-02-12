"use client"

import {
  Clock,
  ExternalLink,
  FileSpreadsheet,
  TrendingDown,
  TrendingUp,
  Minus,
  ArrowUp,
  ArrowDown,
  Check,
  AlertTriangle,
  ShieldAlert,
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
  /** Current target price */
  currentTP: number
  /** Suggested new target price (null = no change) */
  suggestedTP: number | null
  priceAction: PriceAction
  /** Current market price for context */
  lastPrice: number
  thesisAlignment: ThesisAlignment
  thesisSummary: string
  rationale: string
}

interface NewsItem {
  id: string
  headline: string
  source: string
  time: string
  category: string
  summary: string
  insights: StockInsight[]
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

const newsItems: NewsItem[] = [
  {
    id: "1",
    headline: "NVIDIA Forecasts Record Revenue on Surging AI Chip Demand",
    source: "Bloomberg",
    time: "12 min ago",
    category: "Earnings",
    summary:
      "NVIDIA projects Q1 revenue of $43B, beating consensus estimates by roughly 15%, marking the fifth consecutive quarter of upside surprise. CEO Jensen Huang pointed to unprecedented demand from hyperscaler customers for the new Blackwell architecture, noting that supply chain constraints remain the primary bottleneck rather than any softening in order momentum. The company also raised its full-year capex guidance to $12B, signaling confidence that the current AI infrastructure buildout cycle has at least another 18-24 months of runway. Analysts at Morgan Stanley and Bernstein both reiterated Overweight ratings within hours of the release, with price targets now clustered in the $950-1,050 range.",
    insights: [
      { ticker: "NVDA", company: "NVIDIA Corp.", sector: "Technology", currentTP: 920, suggestedTP: 1025, priceAction: "raise", lastPrice: 878, thesisAlignment: "confirms", thesisSummary: "AI infrastructure supercycle intact", rationale: "Revenue beat and raised capex guide validate our core thesis that Blackwell demand extends the cycle 18-24 months beyond prior estimates. Raise TP to reflect higher through-cycle earnings power." },
      { ticker: "MSFT", company: "Microsoft Corp.", sector: "Technology", currentTP: 480, suggestedTP: 495, priceAction: "raise", lastPrice: 462, thesisAlignment: "confirms", thesisSummary: "Azure AI co-pilot monetization on track", rationale: "NVDA demand confirms hyperscaler spend is accelerating, which flows through to Azure AI workload volumes. Modest TP increase warranted." },
      { ticker: "GOOGL", company: "Alphabet Inc.", sector: "Technology", currentTP: 195, suggestedTP: null, priceAction: "maintain", lastPrice: 182, thesisAlignment: "neutral", thesisSummary: "GCP share gains thesis unaffected", rationale: "Positive for broad AI sentiment, but NVDA results don't specifically de-risk or confirm our GCP market share thesis. Maintain current TP." },
    ],
  },
  {
    id: "2",
    headline: "Fed Minutes Signal Cautious Approach to Rate Cuts in 2026",
    source: "Reuters",
    time: "34 min ago",
    category: "Macro",
    summary:
      "Federal Reserve officials expressed concern about persistent services inflation during their January meeting, with several governors noting that shelter and healthcare costs continue to run above the 2% target annualized pace. The minutes suggest the path to rate normalization may extend well through Q3, with at most one 25bp cut priced in before September. Markets are repricing terminal rate expectations, with the 2-year yield climbing 8bps to 4.52% on the release. The tone was notably more hawkish than the December meeting, with three members indicating they would prefer to hold rates steady for the remainder of 2026 if inflation data does not improve materially.",
    insights: [
      { ticker: "JPM", company: "JPMorgan Chase", sector: "Financials", currentTP: 235, suggestedTP: 220, priceAction: "lower", lastPrice: 228, thesisAlignment: "challenges", thesisSummary: "NII expansion from rate normalization", rationale: "Our bull case assumed two 25bp cuts by mid-year boosting loan demand. Higher-for-longer erodes the net interest income tailwind and compresses multiple. Lower TP." },
      { ticker: "GS", company: "Goldman Sachs", sector: "Financials", currentTP: 510, suggestedTP: 485, priceAction: "lower", lastPrice: 498, thesisAlignment: "challenges", thesisSummary: "IB fee recovery driven by rate normalization", rationale: "Delayed easing means M&A and IPO pipeline remains suppressed. Our IB fee recovery thesis is pushed out by at least one quarter." },
      { ticker: "XOM", company: "Exxon Mobil", sector: "Energy", currentTP: 125, suggestedTP: null, priceAction: "maintain", lastPrice: 114, thesisAlignment: "confirms", thesisSummary: "Real asset inflation hedge", rationale: "Persistent inflation supports our thesis that energy acts as a natural portfolio hedge. No TP change needed, but conviction increases." },
    ],
  },
  {
    id: "3",
    headline: "Eli Lilly GLP-1 Drug Mounjaro Shows Promise in NASH Trial",
    source: "STAT News",
    time: "1h ago",
    category: "Healthcare",
    summary:
      "Phase 3 trial data from the SYNERGY-NASH study shows a 68% resolution rate of non-alcoholic steatohepatitis with at least one stage of fibrosis improvement, significantly exceeding the 42% benchmark set by Madrigal's resmetirom in its pivotal trial. The study enrolled 1,240 patients across 180 sites globally and met all primary and secondary endpoints. Eli Lilly intends to file for an expanded indication with the FDA by mid-2026, which analysts estimate could add $8-12B in peak annual revenue on top of the existing obesity and diabetes franchise. The NASH market remains largely untapped, with only one approved therapy, and Lilly's dual GIP/GLP-1 mechanism appears to offer a differentiated safety profile that managed care payers are expected to cover broadly.",
    insights: [
      { ticker: "LLY", company: "Eli Lilly & Co.", sector: "Healthcare", currentTP: 880, suggestedTP: 1020, priceAction: "raise", lastPrice: 812, thesisAlignment: "confirms", thesisSummary: "GLP-1 platform optionality into adjacencies", rationale: "NASH indication materially expands TAM beyond our base case. Trial data exceeds bear-case efficacy hurdle by 26pts. Raise TP significantly to reflect new peak revenue estimates." },
      { ticker: "UNH", company: "UnitedHealth Group", sector: "Healthcare", currentTP: 590, suggestedTP: null, priceAction: "maintain", lastPrice: 568, thesisAlignment: "neutral", thesisSummary: "MCO cost management and membership growth", rationale: "NASH treatment adoption may modestly reduce chronic liver disease costs over time, but effect is too long-dated to revise near-term TP. Monitor for formulary impact." },
      { ticker: "JNJ", company: "Johnson & Johnson", sector: "Healthcare", currentTP: 168, suggestedTP: 158, priceAction: "lower", lastPrice: 162, thesisAlignment: "challenges", thesisSummary: "Pharma pipeline diversification", rationale: "LLY's strong NASH data further marginalizes JNJ's competitive position in metabolic disease. Our pipeline diversification thesis weakens as the GLP-1 moat deepens." },
    ],
  },
  {
    id: "4",
    headline: "Apple Announces $110B Share Buyback Program, Largest in History",
    source: "WSJ",
    time: "2h ago",
    category: "Corporate",
    summary:
      "Apple has authorized an additional $110 billion in share repurchases, the largest buyback program in corporate history, alongside a 4% dividend increase to $0.27 per share. The announcement came as part of Apple's fiscal Q2 earnings, which also revealed that services revenue reached an all-time high of $26.7B, growing 18% year-over-year and now representing 28% of total revenue. CFO Luca Maestri indicated that the company's installed base of active devices exceeded 2.3 billion globally, with paid subscriptions crossing 1.1 billion. Apple Intelligence adoption has reached 74% of iPhone 16 users, with management expressing confidence that the AI feature set will drive a meaningful upgrade cycle through FY2027.",
    insights: [
      { ticker: "AAPL", company: "Apple Inc.", sector: "Technology", currentTP: 240, suggestedTP: 260, priceAction: "raise", lastPrice: 228, thesisAlignment: "confirms", thesisSummary: "Services margin expansion + capital return", rationale: "Record buyback accelerates EPS compounding. Services at 28% of revenue with higher margins confirms the mix-shift thesis. Raise TP to reflect buyback-adjusted earnings growth." },
      { ticker: "META", company: "Meta Platforms", sector: "Technology", currentTP: 590, suggestedTP: null, priceAction: "maintain", lastPrice: 572, thesisAlignment: "neutral", thesisSummary: "AI-driven ad targeting efficiency", rationale: "AAPL buyback is company-specific; doesn't inform our META ad monetization thesis either way. Maintain TP." },
    ],
  },
  {
    id: "5",
    headline: "ExxonMobil Expands Permian Basin Operations with $8.4B Acquisition",
    source: "FT",
    time: "3h ago",
    category: "Energy",
    summary:
      "Exxon has agreed to acquire an additional 120,000 net acres in the Delaware Basin from a privately held operator for $8.4B in an all-cash transaction, adding an estimated 650,000 BOE/day of peak production capacity. The deal makes Exxon the largest single-operator acreage holder in the Permian and is expected to be accretive to earnings and free cash flow within the first year. Management stated on the deal call that breakeven economics on the acquired acreage sit below $40/barrel WTI, providing a substantial margin of safety at current prices. Several sell-side analysts view the move as a strong signal that Permian consolidation is entering its final phase, with Chevron and ConocoPhillips likely to respond with deals of their own.",
    insights: [
      { ticker: "XOM", company: "Exxon Mobil", sector: "Energy", currentTP: 125, suggestedTP: 138, priceAction: "raise", lastPrice: 114, thesisAlignment: "confirms", thesisSummary: "Permian consolidation and FCF growth", rationale: "Accretive acquisition at sub-$40 breakeven validates our Permian consolidation thesis. Raise TP to reflect added production capacity and improved cost curve positioning." },
      { ticker: "CVX", company: "Chevron Corp.", sector: "Energy", currentTP: 180, suggestedTP: 188, priceAction: "raise", lastPrice: 168, thesisAlignment: "confirms", thesisSummary: "Permian acreage value re-rating", rationale: "XOM deal reprices Permian acreage higher, which benefits CVX's existing Delaware Basin position. Modest TP increase on comp-based re-rating." },
    ],
  },
  {
    id: "6",
    headline: "Microsoft Azure Revenue Growth Decelerates to 28% in Q2",
    source: "Bloomberg",
    time: "4h ago",
    category: "Technology",
    summary:
      "Azure cloud revenue growth slowed to 28% year-over-year in Microsoft's fiscal Q2, down from 33% in the prior quarter and missing consensus estimates of 31%. Management attributed the deceleration primarily to capacity constraints in key data center regions rather than any softening in enterprise demand, noting that the backlog of unfulfilled Azure commitments grew 40% sequentially. However, the miss raises questions about Microsoft's ability to convert its AI partnership with OpenAI into near-term cloud revenue at the pace the market had priced in. Capital expenditures came in at $14.2B for the quarter, above guidance, as the company races to build out AI infrastructure. Google Cloud and AWS both posted acceleration in their most recent quarters, suggesting a potential share shift.",
    insights: [
      { ticker: "MSFT", company: "Microsoft Corp.", sector: "Technology", currentTP: 495, suggestedTP: 465, priceAction: "lower", lastPrice: 462, thesisAlignment: "challenges", thesisSummary: "Azure as primary AI monetization vehicle", rationale: "Growth deceleration and capacity miss challenge our core thesis that Azure would be the primary near-term AI monetization vehicle. Lower TP until capacity buildout catches up." },
      { ticker: "GOOGL", company: "Alphabet Inc.", sector: "Technology", currentTP: 195, suggestedTP: 210, priceAction: "raise", lastPrice: 182, thesisAlignment: "confirms", thesisSummary: "GCP share gains vs. Azure", rationale: "MSFT capacity constraints create a window for GCP share gains. This directly confirms our relative value thesis. Raise TP." },
      { ticker: "META", company: "Meta Platforms", sector: "Technology", currentTP: 590, suggestedTP: null, priceAction: "maintain", lastPrice: 572, thesisAlignment: "neutral", thesisSummary: "On-prem AI inference independence", rationale: "META's on-prem AI strategy insulates it from cloud provider dynamics. Azure miss is not thesis-relevant for META." },
    ],
  },
  {
    id: "7",
    headline: "Goldman Sachs Raises S&P 500 Year-End Target to 6,500",
    source: "CNBC",
    time: "5h ago",
    category: "Strategy",
    summary:
      "Chief U.S. equity strategist David Kostin raised Goldman's year-end S&P 500 target from 5,900 to 6,500, citing better-than-expected corporate earnings growth and surprisingly stable operating margins across the index. Kostin noted that AI-driven productivity gains are beginning to materialize in corporate results, with companies reporting 3-5% improvements in SG&A efficiency where AI tools have been deployed at scale. The revised target implies roughly 8% upside from current levels and assumes no recession in 2026, two 25bp Fed cuts, and continued earnings growth of 11-13% for S&P 500 constituents. Goldman's model now assigns a 15% probability to a 'melt-up' scenario where the index reaches 7,000 by year-end.",
    insights: [
      { ticker: "GS", company: "Goldman Sachs", sector: "Financials", currentTP: 485, suggestedTP: null, priceAction: "maintain", lastPrice: 498, thesisAlignment: "neutral", thesisSummary: "IB recovery + asset management growth", rationale: "Bullish equity call is positive for sentiment but doesn't change our fundamental view on GS's IB pipeline or AM flows. Maintain TP." },
      { ticker: "JPM", company: "JPMorgan Chase", sector: "Financials", currentTP: 220, suggestedTP: null, priceAction: "maintain", lastPrice: 228, thesisAlignment: "confirms", thesisSummary: "Broadening equity rally benefits trading", rationale: "Kostin's melt-up scenario would benefit JPM's equities trading desk. Directionally positive for thesis but not enough to revise TP yet." },
    ],
  },
  {
    id: "8",
    headline: "China Announces New Stimulus Package Targeting Tech Sector",
    source: "Nikkei Asia",
    time: "6h ago",
    category: "Geopolitical",
    summary:
      "Beijing has unveiled a $150B stimulus package consisting of direct subsidies, tax incentives, and low-interest loans targeted at domestic semiconductor manufacturing and AI development. The package represents a significant escalation in China's push for tech self-sufficiency and is expected to accelerate capacity buildout in mature node chips (28nm and above), where Chinese foundries are rapidly closing the gap with global leaders. U.S. chipmakers may face headwinds from increased competition in these segments, particularly in automotive and industrial applications. The announcement also includes provisions to restrict foreign cloud providers from serving Chinese government agencies, which could impact hyperscaler revenue projections for the Asia-Pacific region.",
    insights: [
      { ticker: "NVDA", company: "NVIDIA Corp.", sector: "Technology", currentTP: 1025, suggestedTP: null, priceAction: "maintain", lastPrice: 878, thesisAlignment: "challenges", thesisSummary: "Uncontested AI chip leadership", rationale: "China stimulus accelerates domestic chip alternatives, adding long-term competitive risk to our uncontested leadership thesis. No TP change yet, but flagging as a risk to monitor." },
      { ticker: "AAPL", company: "Apple Inc.", sector: "Technology", currentTP: 260, suggestedTP: 250, priceAction: "lower", lastPrice: 228, thesisAlignment: "challenges", thesisSummary: "Greater China revenue stability", rationale: "Cloud restrictions and tech nationalism add pressure to AAPL's 18% China revenue exposure. Lower TP modestly to reflect incremental geopolitical risk premium." },
    ],
  },
]

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

function InsightRow({ insight }: { insight: StockInsight }) {
  const priceConfig = PRICE_ACTION_CONFIG[insight.priceAction]
  const thesisConfig = THESIS_CONFIG[insight.thesisAlignment]
  const excelPath = getExcelPath(insight.ticker, insight.sector)
  const tpChange = insight.suggestedTP ? insight.suggestedTP - insight.currentTP : 0
  const tpChangePercent = insight.suggestedTP ? ((tpChange / insight.currentTP) * 100) : 0
  const upside = insight.suggestedTP
    ? ((insight.suggestedTP - insight.lastPrice) / insight.lastPrice * 100)
    : ((insight.currentTP - insight.lastPrice) / insight.lastPrice * 100)

  return (
    <TooltipProvider delayDuration={200}>
      <div className="py-3 first:pt-1.5 last:pb-1.5">
        {/* Top: Ticker, thesis badge, TP action badge, excel button */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-xs font-semibold text-foreground">{insight.ticker}</span>
          <span className="text-[11px] text-muted-foreground/70">{insight.company}</span>
          <div className="ml-auto flex items-center gap-1.5">
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
        </div>
      </div>
    </TooltipProvider>
  )
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {category}
    </span>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group border-b border-border px-6 py-5 transition-colors hover:bg-card/60">
      {/* Meta row */}
      <div className="mb-2 flex items-center gap-2.5">
        <SourceBadge source={item.source} />
        <CategoryBadge category={item.category} />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {item.time}
        </span>
        <span className="text-[11px] text-muted-foreground/70">{item.source}</span>
        <button
          type="button"
          className="ml-auto shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
          aria-label="Open article"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Headline + Summary */}
      <h3 className="mb-1.5 text-sm font-medium leading-snug text-foreground">
        {item.headline}
      </h3>
      <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground">
        {item.summary}
      </p>

      {/* Stock Insights */}
      <div className="rounded-lg border border-border bg-secondary/40 px-4 py-2">
        <div className="mb-1 flex items-center gap-3 border-b border-border/60 pb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Target Price & Thesis Review
          </span>
          <span className="text-[10px] text-muted-foreground/50">
            {item.insights.length} position{item.insights.length !== 1 ? "s" : ""} affected
          </span>
        </div>
        <div className="divide-y divide-border/40">
          {item.insights.map((insight) => (
            <InsightRow key={insight.ticker} insight={insight} />
          ))}
        </div>
      </div>
    </article>
  )
}

export function NewsFeed() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Morning Brief
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Feb 11, 2026 — Market Intelligence Feed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md bg-positive/10 px-2.5 py-1 text-xs font-medium text-positive">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" />
              Live
            </span>
          </div>
        </div>

        {/* Portfolio Summary Strip */}
        <div className="mt-3 flex items-center gap-4 rounded-lg bg-secondary px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Portfolio
            </span>
            <span className="text-xs text-muted-foreground">|</span>
          </div>
          <PortfolioStat label="NAV" value="$2.4B" />
          <PortfolioStat label="Day P&L" value="+$18.3M" positive />
          <PortfolioStat label="Gross" value="185%" />
          <PortfolioStat label="Net" value="62%" />
          <PortfolioStat label="Beta" value="0.74" />
          <PortfolioStat label="Sharpe" value="2.31" />
        </div>
      </div>

      {/* News List */}
      <ScrollArea className="flex-1">
        <div>
          {newsItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>
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
