"use client"

import { ArrowUpRight, Clock, ExternalLink, TrendingDown, TrendingUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface PositionRecommendation {
  ticker: string
  change: number
  direction: "increase" | "decrease"
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
      { ticker: "NVDA", change: 2.5, direction: "increase" },
      { ticker: "MSFT", change: 0.8, direction: "increase" },
      { ticker: "GOOGL", change: 0.5, direction: "increase" },
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
      { ticker: "JPM", change: -1.2, direction: "decrease" },
      { ticker: "GS", change: -0.8, direction: "decrease" },
      { ticker: "XOM", change: 0.5, direction: "increase" },
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
      { ticker: "LLY", change: 3.2, direction: "increase" },
      { ticker: "UNH", change: 0.4, direction: "increase" },
      { ticker: "JNJ", change: -0.6, direction: "decrease" },
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
      { ticker: "AAPL", change: 1.8, direction: "increase" },
      { ticker: "META", change: 0.3, direction: "increase" },
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
      { ticker: "XOM", change: 1.4, direction: "increase" },
      { ticker: "CVX", change: 0.6, direction: "increase" },
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
      { ticker: "MSFT", change: -1.5, direction: "decrease" },
      { ticker: "GOOGL", change: 0.7, direction: "increase" },
      { ticker: "META", change: 0.4, direction: "increase" },
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
      { ticker: "GS", change: 0.3, direction: "increase" },
      { ticker: "JPM", change: 0.5, direction: "increase" },
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
      { ticker: "NVDA", change: -0.4, direction: "decrease" },
      { ticker: "AAPL", change: -0.7, direction: "decrease" },
    ],
  },
]

function RecommendationChip({ rec }: { rec: PositionRecommendation }) {
  const isPositive = rec.direction === "increase"
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs",
        isPositive
          ? "bg-positive/10 text-positive"
          : "bg-negative/10 text-negative"
      )}
    >
      <span className="font-medium">{rec.ticker}</span>
      <span className="flex items-center gap-0.5">
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {isPositive ? "+" : ""}
        {rec.change.toFixed(1)}%
      </span>
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

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group border-b border-border px-6 py-5 transition-colors hover:bg-card">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <CategoryBadge category={item.category} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {item.time}
            </span>
            <span className="text-xs text-muted-foreground">{item.source}</span>
          </div>
          <h3 className="mb-1.5 text-sm font-medium leading-snug text-foreground group-hover:text-foreground/90">
            {item.headline}
          </h3>
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {item.summary}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Impact
            </span>
            {item.recommendations.map((rec) => (
              <RecommendationChip key={rec.ticker} rec={rec} />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground group-hover:opacity-100"
          aria-label="Open article"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
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
