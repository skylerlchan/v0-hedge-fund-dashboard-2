"use client"

import { Clock, ExternalLink, FileSpreadsheet, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Action = "increase" | "decrease" | "hold" | "close"

interface PositionRecommendation {
  ticker: string
  company: string
  sector: string
  change: number
  action: Action
  currentWeight: number
  targetWeight: number
  rationale: string
}

interface NewsItem {
  id: string
  headline: string
  source: string
  time: string
  category: string
  summary: string
  recommendations: PositionRecommendation[]
}

const SECTOR_MAP: Record<string, string> = {
  NVDA: "Technology",
  MSFT: "Technology",
  GOOGL: "Technology",
  META: "Technology",
  AAPL: "Technology",
  LLY: "Healthcare",
  UNH: "Healthcare",
  JNJ: "Healthcare",
  XOM: "Energy",
  CVX: "Energy",
  JPM: "Financials",
  GS: "Financials",
}

function getExcelPath(ticker: string, sector: string) {
  return `/positions/${sector.toLowerCase()}/${ticker.toLowerCase()}_model.xlsx`
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    headline: "NVIDIA Forecasts Record Revenue on Surging AI Chip Demand",
    source: "Bloomberg",
    time: "12 min ago",
    category: "Earnings",
    summary:
      "NVIDIA projects Q1 revenue of $43B, beating estimates by 15%. CEO Jensen Huang cites unprecedented demand from hyperscaler customers for Blackwell architecture.",
    recommendations: [
      { ticker: "NVDA", company: "NVIDIA Corp.", sector: "Technology", change: 2.5, action: "increase", currentWeight: 6.2, targetWeight: 8.7, rationale: "Revenue beat supports thesis; raise to overweight" },
      { ticker: "MSFT", company: "Microsoft Corp.", sector: "Technology", change: 0.8, action: "increase", currentWeight: 5.1, targetWeight: 5.9, rationale: "AI capex beneficiary via Azure partnership" },
      { ticker: "GOOGL", company: "Alphabet Inc.", sector: "Technology", change: 0.5, action: "increase", currentWeight: 3.8, targetWeight: 4.3, rationale: "Cloud/AI demand spillover" },
    ],
  },
  {
    id: "2",
    headline: "Fed Minutes Signal Cautious Approach to Rate Cuts in 2026",
    source: "Reuters",
    time: "34 min ago",
    category: "Macro",
    summary:
      "Federal Reserve officials expressed concern about persistent services inflation, suggesting the path to rate normalization may extend through Q3. Markets repricing terminal rate expectations.",
    recommendations: [
      { ticker: "JPM", company: "JPMorgan Chase", sector: "Financials", change: -1.2, action: "decrease", currentWeight: 4.5, targetWeight: 3.3, rationale: "NII tailwind fading; trim to market weight" },
      { ticker: "GS", company: "Goldman Sachs", sector: "Financials", change: -0.8, action: "decrease", currentWeight: 2.8, targetWeight: 2.0, rationale: "IB pipeline risk from higher-for-longer" },
      { ticker: "XOM", company: "Exxon Mobil", sector: "Energy", change: 0.5, action: "increase", currentWeight: 3.2, targetWeight: 3.7, rationale: "Inflation hedge; real assets benefit" },
    ],
  },
  {
    id: "3",
    headline: "Eli Lilly GLP-1 Drug Mounjaro Shows Promise in NASH Trial",
    source: "STAT News",
    time: "1h ago",
    category: "Healthcare",
    summary:
      "Phase 3 trial data shows 68% resolution of non-alcoholic steatohepatitis with fibrosis improvement. Results significantly exceed the 42% benchmark set by competitors.",
    recommendations: [
      { ticker: "LLY", company: "Eli Lilly & Co.", sector: "Healthcare", change: 3.2, action: "increase", currentWeight: 4.1, targetWeight: 7.3, rationale: "TAM expansion into NASH; raise to high conviction" },
      { ticker: "UNH", company: "UnitedHealth Group", sector: "Healthcare", change: 0.4, action: "hold", currentWeight: 3.6, targetWeight: 4.0, rationale: "Indirect beneficiary; maintain current sizing" },
      { ticker: "JNJ", company: "Johnson & Johnson", sector: "Healthcare", change: -0.6, action: "decrease", currentWeight: 2.4, targetWeight: 1.8, rationale: "Competitive positioning weakened in GLP-1 space" },
    ],
  },
  {
    id: "4",
    headline: "Apple Announces $110B Share Buyback Program, Largest in History",
    source: "WSJ",
    time: "2h ago",
    category: "Corporate",
    summary:
      "Apple authorizes additional $110 billion in share repurchases alongside a 4% dividend increase. Services revenue reaches all-time high of $26.7B, growing 18% year-over-year.",
    recommendations: [
      { ticker: "AAPL", company: "Apple Inc.", sector: "Technology", change: 1.8, action: "increase", currentWeight: 5.4, targetWeight: 7.2, rationale: "Capital return + services inflection; add to core" },
      { ticker: "META", company: "Meta Platforms", sector: "Technology", change: 0.3, action: "hold", currentWeight: 3.1, targetWeight: 3.4, rationale: "Relative value vs. AAPL less compelling now" },
    ],
  },
  {
    id: "5",
    headline: "ExxonMobil Expands Permian Basin Operations with $8.4B Acquisition",
    source: "FT",
    time: "3h ago",
    category: "Energy",
    summary:
      "Exxon acquires additional 120,000 net acres in the Delaware Basin, adding estimated 650,000 BOE/day of production capacity. Analysts see move as bullish for Permian consolidation thesis.",
    recommendations: [
      { ticker: "XOM", company: "Exxon Mobil", sector: "Energy", change: 1.4, action: "increase", currentWeight: 3.2, targetWeight: 4.6, rationale: "Accretive deal; production growth re-rating" },
      { ticker: "CVX", company: "Chevron Corp.", sector: "Energy", change: 0.6, action: "increase", currentWeight: 2.1, targetWeight: 2.7, rationale: "Sector tailwind; potential M&A target" },
    ],
  },
  {
    id: "6",
    headline: "Microsoft Azure Revenue Growth Decelerates to 28% in Q2",
    source: "Bloomberg",
    time: "4h ago",
    category: "Technology",
    summary:
      "Azure growth slowed from 33% in the prior quarter, missing consensus estimates of 31%. Management attributes deceleration to capacity constraints rather than demand softening.",
    recommendations: [
      { ticker: "MSFT", company: "Microsoft Corp.", sector: "Technology", change: -1.5, action: "decrease", currentWeight: 5.9, targetWeight: 4.4, rationale: "Capacity concerns; trim to fund rotation" },
      { ticker: "GOOGL", company: "Alphabet Inc.", sector: "Technology", change: 0.7, action: "increase", currentWeight: 4.3, targetWeight: 5.0, rationale: "GCP taking share; relative value play" },
      { ticker: "META", company: "Meta Platforms", sector: "Technology", change: 0.4, action: "hold", currentWeight: 3.4, targetWeight: 3.8, rationale: "On-prem AI inference advantage" },
    ],
  },
  {
    id: "7",
    headline: "Goldman Sachs Raises S&P 500 Year-End Target to 6,500",
    source: "CNBC",
    time: "5h ago",
    category: "Strategy",
    summary:
      "David Kostin raises target citing better-than-expected earnings growth and stable margins. Notes AI-driven productivity gains are beginning to show in corporate results across sectors.",
    recommendations: [
      { ticker: "GS", company: "Goldman Sachs", sector: "Financials", change: 0.3, action: "hold", currentWeight: 2.0, targetWeight: 2.3, rationale: "Sentiment positive but priced in" },
      { ticker: "JPM", company: "JPMorgan Chase", sector: "Financials", change: 0.5, action: "increase", currentWeight: 3.3, targetWeight: 3.8, rationale: "Beta play on broadening rally" },
    ],
  },
  {
    id: "8",
    headline: "China Announces New Stimulus Package Targeting Tech Sector",
    source: "Nikkei Asia",
    time: "6h ago",
    category: "Geopolitical",
    summary:
      "Beijing unveils $150B in subsidies and tax incentives for domestic semiconductor manufacturing. US chipmakers may face headwinds from increased competition in mature node segments.",
    recommendations: [
      { ticker: "NVDA", company: "NVIDIA Corp.", sector: "Technology", change: -0.4, action: "decrease", currentWeight: 8.7, targetWeight: 8.3, rationale: "Geopolitical risk premium; slight de-risk" },
      { ticker: "AAPL", company: "Apple Inc.", sector: "Technology", change: -0.7, action: "decrease", currentWeight: 7.2, targetWeight: 6.5, rationale: "China revenue exposure ~18%; trim hedging cost" },
    ],
  },
]

const ACTION_CONFIG: Record<Action, { label: string; color: string; bgColor: string; Icon: typeof TrendingUp }> = {
  increase: { label: "Increase", color: "text-positive", bgColor: "bg-positive/10", Icon: TrendingUp },
  decrease: { label: "Trim", color: "text-negative", bgColor: "bg-negative/10", Icon: TrendingDown },
  hold: { label: "Hold", color: "text-muted-foreground", bgColor: "bg-muted", Icon: Minus },
  close: { label: "Close", color: "text-negative", bgColor: "bg-negative/10", Icon: TrendingDown },
}

function RecommendationRow({ rec }: { rec: PositionRecommendation }) {
  const config = ACTION_CONFIG[rec.action]
  const excelPath = getExcelPath(rec.ticker, rec.sector)

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-3 py-1.5">
        {/* Ticker + Action badge */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <span className="font-mono text-xs font-semibold text-foreground w-[42px]">{rec.ticker}</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              config.bgColor,
              config.color,
            )}
          >
            <config.Icon className="h-2.5 w-2.5" />
            {config.label}
          </span>
        </div>

        {/* Weight change: currentWeight -> targetWeight */}
        <div className="flex items-center gap-1.5 min-w-[100px]">
          <span className="font-mono text-[11px] text-muted-foreground">{rec.currentWeight.toFixed(1)}%</span>
          <span className="text-[10px] text-muted-foreground/60">{"-->"}</span>
          <span className={cn("font-mono text-[11px] font-medium", config.color)}>
            {rec.targetWeight.toFixed(1)}%
          </span>
        </div>

        {/* Change delta */}
        <span className={cn("font-mono text-[11px] font-medium min-w-[48px]", config.color)}>
          {rec.change > 0 ? "+" : ""}{rec.change.toFixed(1)}%
        </span>

        {/* Rationale tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-[11px] text-muted-foreground truncate max-w-[220px] cursor-default">
              {rec.rationale}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs bg-popover text-popover-foreground border-border">
            <p className="text-xs leading-relaxed">{rec.rationale}</p>
          </TooltipContent>
        </Tooltip>

        {/* Excel file link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={excelPath}
              className="ml-auto shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-positive"
              aria-label={`Open ${rec.ticker} position model spreadsheet`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-popover text-popover-foreground border-border">
            <p className="text-xs font-mono">Positions / {rec.sector} / {rec.ticker.toLowerCase()}_model.xlsx</p>
          </TooltipContent>
        </Tooltip>
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
      <div className="mb-2 flex items-center gap-3">
        <CategoryBadge category={item.category} />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {item.time}
        </span>
        <span className="text-xs text-muted-foreground">{item.source}</span>
        <button
          type="button"
          className="ml-auto shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
          aria-label="Open article"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Headline + Summary */}
      <h3 className="mb-1 text-sm font-medium leading-snug text-foreground">
        {item.headline}
      </h3>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {item.summary}
      </p>

      {/* Recommendations table */}
      <div className="rounded-lg border border-border bg-secondary/40 px-4 py-2">
        <div className="mb-1.5 flex items-center gap-3 border-b border-border/60 pb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Position Adjustments
          </span>
          <div className="ml-auto flex items-center gap-4 text-[10px] text-muted-foreground/60">
            <span className="w-[42px]">Ticker</span>
            <span className="w-[60px]">Action</span>
            <span className="w-[100px]">Weight Change</span>
            <span className="w-[48px]">Delta</span>
          </div>
        </div>
        {item.recommendations.map((rec) => (
          <RecommendationRow key={rec.ticker} rec={rec} />
        ))}
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
