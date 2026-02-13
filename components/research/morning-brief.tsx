"use client"

import Image from "next/image"
import {
  Clock,
  ExternalLink,
  FileSpreadsheet,
  Minus,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  AlertTriangle,
  Quote,
  Presentation,
  LayoutDashboard,
  MessageSquare,
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
  portfolioWeight: number
  keyAssumption: string
  keyAssumptionValue: string
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
  themeAlignment: ThesisAlignment
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
  Axios: { bg: "bg-[#0052FF]/15", text: "text-[#0052FF]", abbr: "AX" },
  Semafor: { bg: "bg-[#00C853]/15", text: "text-[#00C853]", abbr: "SM" },
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

// --------------- THESIS ALIGNMENT for theme level ---------------

const THEME_ALIGNMENT_CONFIG: Record<ThesisAlignment, { label: string; color: string; bgColor: string; Icon: typeof Check }> = {
  confirms: { label: "In-line with thesis", color: "text-positive", bgColor: "bg-positive/8", Icon: Check },
  challenges: { label: "Against thesis", color: "text-negative", bgColor: "bg-negative/8", Icon: AlertTriangle },
  neutral: { label: "Thesis unaffected", color: "text-muted-foreground", bgColor: "bg-muted/60", Icon: Minus },
}

// --------------- DATA ---------------

const themeClusters: ThemeCluster[] = [
  {
    id: "1",
    theme: "AI Infrastructure Spending Accelerates Beyond Expectations",
    category: "AI / Semis",
    themeAlignment: "confirms",
    summary:
      "A cluster of data points across earnings, supply chain reports, and capex guidance revisions all point to the same conclusion: the AI infrastructure buildout is running hotter and longer than the market anticipated six months ago. NVIDIA's Q1 revenue guide of $43B beat consensus by 15%, while Microsoft disclosed a 40% sequential increase in unfulfilled Azure AI commitments. Separately, Taiwanese supply chain sources report Blackwell orders extending into 2027, and Morgan Stanley's semiconductor team raised their industry capex estimate for 2026 by 18%.",
    headlines: [
      { title: "NVIDIA Forecasts Record Revenue on Surging AI Chip Demand", source: "Bloomberg", time: "12 min ago" },
      { title: "Microsoft Azure AI Backlog Grows 40% as Capacity Lags Demand", source: "Bloomberg", time: "4h ago" },
      { title: "TSMC Reports Surge in Blackwell Wafer Orders Through 2027", source: "Reuters", time: "2h ago" },
      { title: "Morgan Stanley Raises 2026 Semi Capex Estimate by 18%", source: "Barron's", time: "3h ago" },
    ],
    insights: [],
  },
  {
    id: "2",
    theme: "Rate Path Uncertainty Pressures Financial Sector Multiples",
    category: "Macro / Rates",
    themeAlignment: "challenges",
    summary:
      "The hawkish tone of the January Fed minutes caught markets off guard, pushing the 2-year yield up 8bps and repricing the terminal rate. Three FOMC members indicated a preference for holding rates steady through all of 2026 if services inflation does not materially improve. The disconnect between equity optimism and rates reality creates a tension most acutely felt in financials, where NII and IB fee recovery assumptions are being re-evaluated.",
    headlines: [
      { title: "Fed Minutes Signal Cautious Approach to Rate Cuts in 2026", source: "Reuters", time: "34 min ago" },
      { title: "Goldman Sachs Raises S&P 500 Year-End Target to 6,500", source: "CNBC", time: "5h ago" },
      { title: "2-Year Treasury Yield Climbs to 4.52% on Hawkish Fed Tone", source: "Bloomberg", time: "1h ago" },
    ],
    insights: [
      { ticker: "JPM", company: "JPMorgan Chase", sector: "Financials", currentTP: 235, suggestedTP: 220, priceAction: "lower", lastPrice: 198, thesisAlignment: "challenges", thesisSummary: "NII expansion from rate normalization", rationale: "Our bull case assumed two 25bp cuts by mid-year boosting loan demand. Three Fed members now prefer no cuts at all in 2026. Higher-for-longer erodes the NII tailwind and compresses the multiple.", portfolioWeight: 4.5, keyAssumption: "P/E Multiple", keyAssumptionValue: "11.8x" },
      { ticker: "GS", company: "Goldman Sachs", sector: "Financials", currentTP: 510, suggestedTP: 485, priceAction: "lower", lastPrice: 442, thesisAlignment: "challenges", thesisSummary: "IB fee recovery driven by rate normalization", rationale: "Delayed easing means M&A and IPO pipeline remains suppressed. Goldman's own bullish equity target ironically depends on rate cuts that their rates desk sees as unlikely.", portfolioWeight: 2.8, keyAssumption: "Rev Multiple", keyAssumptionValue: "2.1x" },
    ],
  },
  {
    id: "3",
    theme: "GLP-1 Platform Expansion Reshapes Healthcare Landscape",
    category: "Healthcare",
    themeAlignment: "confirms",
    summary:
      "Eli Lilly's SYNERGY-NASH Phase 3 trial data exceeded all expectations with a 68% resolution rate, blowing past Madrigal's 42% benchmark and opening a potentially massive new TAM for the GLP-1 drug class. The NASH market remains almost entirely untapped with only one approved therapy. The LLY data is the dominant signal here, with clear implications for competitive positioning across pharma and managed care names.",
    headlines: [
      { title: "Eli Lilly GLP-1 Drug Mounjaro Shows Promise in NASH Trial", source: "STAT News", time: "1h ago" },
      { title: "NASH Treatment Market Projected to Reach $40B by 2032", source: "Reuters", time: "2h ago" },
      { title: "Madrigal Pharma Shares Drop 12% on Competitive Data Read", source: "Bloomberg", time: "1h ago" },
    ],
    insights: [],
  },
  {
    id: "4",
    theme: "Big Tech Capital Returns Signal Confidence in Cash Flow Durability",
    category: "Corporate",
    themeAlignment: "confirms",
    summary:
      "Apple's authorization of an additional $110 billion in share repurchases -- the largest buyback program in corporate history -- alongside a 4% dividend increase sends a powerful signal about management's confidence in the durability of the services-led business model. Services revenue reached an all-time high of $26.7B, growing 18% year-over-year and now representing 28% of total revenue.",
    headlines: [
      { title: "Apple Announces $110B Share Buyback Program, Largest in History", source: "WSJ", time: "2h ago" },
      { title: "Apple Services Revenue Hits All-Time High of $26.7B", source: "Bloomberg", time: "2h ago" },
      { title: "Apple Intelligence Adoption Reaches 74% of iPhone 16 Users", source: "The Information", time: "3h ago" },
    ],
    insights: [],
  },
  {
    id: "5",
    theme: "Permian Basin Consolidation Enters Final Phase",
    category: "Energy",
    themeAlignment: "confirms",
    summary:
      "Exxon's $8.4B acquisition of 120,000 net acres in the Delaware Basin marks a decisive step in the Permian consolidation endgame. The deal makes Exxon the largest single-operator acreage holder in the basin, with breakeven economics below $40/barrel WTI providing a substantial margin of safety. Analysts expect Chevron and ConocoPhillips to respond with deals of their own.",
    headlines: [
      { title: "ExxonMobil Expands Permian Basin with $8.4B Acquisition", source: "FT", time: "3h ago" },
      { title: "Permian Acreage Prices Hit Record on XOM Deal Premium", source: "Reuters", time: "4h ago" },
      { title: "Chevron, ConocoPhillips Seen as Likely Responsive Acquirers", source: "WSJ", time: "5h ago" },
    ],
    insights: [],
  },
  {
    id: "6",
    theme: "China Tech Nationalism Escalates Geopolitical Risk for US Semis",
    category: "Geopolitical",
    themeAlignment: "challenges",
    summary:
      "Beijing's $150B stimulus package for domestic semiconductor manufacturing and AI development represents a significant escalation in China's push for tech self-sufficiency. US chipmakers face dual headwinds: increased competition in mature nodes and potential loss of Asia-Pacific cloud revenue. The timing -- alongside NVIDIA's strong earnings -- creates a mixed signal for AI chip names with significant China exposure.",
    headlines: [
      { title: "China Announces $150B Stimulus Package Targeting Tech Sector", source: "Nikkei Asia", time: "6h ago" },
      { title: "Beijing Restricts Foreign Cloud Providers from Government Use", source: "Reuters", time: "5h ago" },
      { title: "Chinese Foundries Close Gap in 28nm Chip Production Yields", source: "Bloomberg", time: "6h ago" },
    ],
    insights: [
      { ticker: "NVDA", company: "NVIDIA Corp.", sector: "Technology", currentTP: 1025, suggestedTP: 1080, priceAction: "raise", lastPrice: 878, thesisAlignment: "challenges", thesisSummary: "Uncontested AI chip leadership", rationale: "Despite geopolitical headwind, near-term demand data overwhelms risk discount. Raising TP to reflect Q1 upside surprise and order book extension, while flagging China risk as a medium-term overhang requiring monitoring.", portfolioWeight: 6.2, keyAssumption: "Rev Multiple", keyAssumptionValue: "28.5x" },
      { ticker: "AAPL", company: "Apple Inc.", sector: "Technology", currentTP: 260, suggestedTP: 250, priceAction: "lower", lastPrice: 228, thesisAlignment: "challenges", thesisSummary: "Greater China revenue stability", rationale: "Cloud restrictions and tech nationalism add pressure to AAPL's 18% China revenue exposure. Three policy vectors -- subsidies, cloud restrictions, foundry buildout -- all point the same direction.", portfolioWeight: 5.4, keyAssumption: "EV/EBITDA", keyAssumptionValue: "22.1x" },
    ],
  },
  {
    id: "7",
    theme: "European Defense Spending Surge Creates Industrial Opportunity",
    category: "Defense / Industrials",
    themeAlignment: "confirms",
    summary:
      "The EU's proposed $150B joint defense fund, combined with Germany's constitutional amendment to exempt defense spending from the debt brake, marks a generational shift in European security posture. Defense budgets across NATO-Europe are converging toward 3% of GDP, up from the 2% target that many members were already struggling to meet. US defense contractors with European operations stand to benefit from procurement acceleration.",
    headlines: [
      { title: "EU Proposes $150B Joint Defense Fund Amid Security Concerns", source: "FT", time: "1h ago" },
      { title: "Germany Lifts Debt Brake for Defense Spending", source: "Reuters", time: "2h ago" },
      { title: "NATO-Europe Defense Budgets Converging Toward 3% of GDP", source: "Bloomberg", time: "3h ago" },
    ],
    insights: [],
  },
  {
    id: "8",
    theme: "Consumer Credit Delinquencies Signal Macro Deterioration",
    category: "Consumer / Credit",
    themeAlignment: "challenges",
    summary:
      "Auto loan delinquencies hit a 14-year high at 3.2%, while credit card charge-offs at major issuers rose for the sixth consecutive quarter. Excess savings buffers from the pandemic are now fully depleted for the bottom 60% of households. The consumer credit deterioration creates headwinds for discretionary spending and bank credit loss provisioning.",
    headlines: [
      { title: "Auto Loan Delinquencies Hit 14-Year High at 3.2%", source: "Bloomberg", time: "2h ago" },
      { title: "Credit Card Charge-Offs Rise for Sixth Consecutive Quarter", source: "WSJ", time: "4h ago" },
      { title: "Pandemic Excess Savings Fully Depleted for Bottom 60%", source: "Axios", time: "3h ago" },
      { title: "Discover Financial Raises Loss Reserve Guidance by $400M", source: "CNBC", time: "5h ago" },
    ],
    insights: [
      { ticker: "JPM", company: "JPMorgan Chase", sector: "Financials", currentTP: 220, suggestedTP: 230, priceAction: "raise", lastPrice: 198, thesisAlignment: "challenges", thesisSummary: "Consumer banking resilience", rationale: "Rising delinquencies across auto and card portfolios will require higher provisioning, but JPM's fortress balance sheet positions it to gain share as weaker lenders pull back. Raising TP to reflect counter-cyclical market share opportunity.", portfolioWeight: 4.5, keyAssumption: "P/TBV", keyAssumptionValue: "2.3x" },
    ],
  },
  {
    id: "9",
    theme: "Cloud Repatriation Trend Accelerates Among Enterprise Buyers",
    category: "Enterprise Tech",
    themeAlignment: "challenges",
    summary:
      "Gartner's latest CIO survey reveals 38% of large enterprises are actively repatriating workloads from public cloud, up from 22% a year ago. Cost optimization remains the primary driver, with enterprises reporting 30-40% savings on stable workloads moved to owned infrastructure. The trend challenges the secular growth narrative for hyperscalers and benefits on-premise infrastructure vendors.",
    headlines: [
      { title: "38% of Enterprises Now Repatriating Cloud Workloads: Gartner", source: "Semafor", time: "1h ago" },
      { title: "Cloud Cost Optimization Driving On-Prem Infrastructure Revival", source: "The Information", time: "3h ago" },
      { title: "Dell, HPE See Surge in Enterprise Server Orders", source: "Barron's", time: "4h ago" },
    ],
    insights: [
      { ticker: "MSFT", company: "Microsoft Corp.", sector: "Technology", currentTP: 480, suggestedTP: 460, priceAction: "lower", lastPrice: 415, thesisAlignment: "challenges", thesisSummary: "Azure as primary AI monetization vehicle", rationale: "Cloud repatriation at scale adds headwind to Azure growth already constrained by capacity. Enterprise shift to on-prem for stable workloads reduces Azure's addressable market for non-AI compute. Incrementally challenging.", portfolioWeight: 5.1, keyAssumption: "EV/Rev", keyAssumptionValue: "12.4x" },
      { ticker: "GOOGL", company: "Alphabet Inc.", sector: "Technology", currentTP: 210, suggestedTP: 200, priceAction: "lower", lastPrice: 182, thesisAlignment: "challenges", thesisSummary: "GCP share gains vs. Azure", rationale: "Repatriation trend affects all hyperscalers. GCP's smaller base makes it relatively more exposed to enterprise cost optimization decisions. The share-gain thesis is partially offset.", portfolioWeight: 3.8, keyAssumption: "P/E Multiple", keyAssumptionValue: "20.7x" },
    ],
  },
  {
    id: "10",
    theme: "Japan Corporate Governance Reforms Drive Record Shareholder Returns",
    category: "Global Macro",
    themeAlignment: "confirms",
    summary:
      "Tokyo Stock Exchange's intensified pressure on sub-1x price-to-book companies is yielding results: aggregate buyback announcements by Japanese companies hit a record $90B annualized in Q1 2026. Cross-shareholding unwinding accelerated, with the largest 100 companies reducing strategic holdings by 15% year-over-year. The governance shift reinforces the structural bull case for Japanese equities.",
    headlines: [
      { title: "Japanese Corporate Buybacks Hit Record $90B Annualized Pace", source: "Nikkei Asia", time: "5h ago" },
      { title: "TSE Steps Up Pressure on Sub-1x Book Value Companies", source: "FT", time: "6h ago" },
      { title: "Cross-Shareholding Unwinding Accelerates Among Top 100 Firms", source: "Bloomberg", time: "4h ago" },
    ],
    insights: [],
  },
]

// --------------- COMPONENTS ---------------

const PRICE_ACTION_CONFIG: Record<PriceAction, { label: string; color: string; bgColor: string; Icon: typeof ArrowUp }> = {
  raise: { label: "Raise TP", color: "text-positive", bgColor: "bg-positive/10", Icon: ArrowUp },
  lower: { label: "Lower TP", color: "text-negative", bgColor: "bg-negative/10", Icon: ArrowDown },
  maintain: { label: "Maintain TP", color: "text-muted-foreground", bgColor: "bg-muted", Icon: Minus },
}

/** Hoverable wrapper that shows a quote icon on hover to send content to chat */
function QuotableWrapper({
  children,
  quotableText,
  onQuote,
  className,
}: {
  children: React.ReactNode
  quotableText: string
  onQuote?: (text: string) => void
  className?: string
}) {
  return (
    <div className={cn("group/quote relative", className)}>
      {children}
      {onQuote && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onQuote(quotableText)}
                className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground/0 transition-all group-hover/quote:text-muted-foreground/50 hover:!text-foreground hover:!bg-accent opacity-0 group-hover/quote:opacity-100"
                aria-label="Quote in AI chat"
              >
                <Quote className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-popover text-popover-foreground border-border">
              <p className="text-xs">Send to AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

/** Analyst button with headshot and Slack overlay */
function AnalystButton({ name, imageSrc }: { name: string; imageSrc: string }) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="relative inline-flex h-7 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 pl-1 pr-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            aria-label={`Ask ${name} to analyze`}
          >
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
              <Image
                src={imageSrc}
                alt={name}
                width={20}
                height={20}
                className="h-full w-full object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-sm bg-[#4A154B]">
                <MessageSquare className="h-1.5 w-1.5 text-white" />
              </span>
            </span>
            <span>Ask {name}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
          <p className="text-xs">Ask {name} to analyze this theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function InsightRow({ insight, onQuote }: { insight: StockInsight; onQuote?: (text: string) => void }) {
  const priceConfig = PRICE_ACTION_CONFIG[insight.priceAction]
  const excelPath = getExcelPath(insight.ticker, insight.sector)
  const tpChange = insight.suggestedTP ? insight.suggestedTP - insight.currentTP : 0
  const tpChangePercent = insight.suggestedTP ? ((tpChange / insight.currentTP) * 100) : 0
  const upside = insight.suggestedTP
    ? ((insight.suggestedTP - insight.lastPrice) / insight.lastPrice * 100)
    : ((insight.currentTP - insight.lastPrice) / insight.lastPrice * 100)

  const quotableText = `${insight.ticker} (${insight.company}): TP $${insight.currentTP}${insight.suggestedTP ? ` -> $${insight.suggestedTP}` : ''}, Last $${insight.lastPrice}. Thesis: ${insight.thesisSummary}. ${insight.rationale}`

  return (
    <QuotableWrapper quotableText={quotableText} onQuote={onQuote}>
      <div className="my-2 rounded-lg border border-negative/20 bg-card p-3 transition-all duration-300 hover:border-negative/35">
        {/* Row 1: Ticker + Company + Price Action Badge + Per-stock actions */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-sm font-bold text-foreground">{insight.ticker}</span>
          <span className="text-[11px] text-muted-foreground/70">{insight.company}</span>
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
          {/* Per-stock action buttons */}
          <div className="ml-auto flex items-center gap-1.5">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-positive/15 text-positive transition-colors hover:bg-positive/25"
                    aria-label="Approve"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
                  <p className="text-xs">Approve</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-negative/15 text-negative transition-colors hover:bg-negative/25"
                    aria-label="Reject"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
                  <p className="text-xs">Reject</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AnalystButton name="Jess" imageSrc="/images/analyst-jess.jpg" />
            <AnalystButton name="Martin" imageSrc="/images/analyst-martin.jpg" />
          </div>
        </div>

        {/* Row 2: Metrics strip */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Last</span>
            <span className="font-mono text-[11px] text-muted-foreground">${insight.lastPrice}</span>
          </div>
          <div className="flex items-center gap-1">
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
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Upside</span>
            <span className="font-mono text-[11px] font-medium text-positive">
              +{Math.abs(upside).toFixed(1)}%
            </span>
          </div>
          <span className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">% Port</span>
            <span className="font-mono text-[11px] font-medium text-foreground">{insight.portfolioWeight}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{insight.keyAssumption}</span>
            <span className="font-mono text-[11px] font-medium text-foreground">{insight.keyAssumptionValue}</span>
          </div>
        </div>

        {/* Row 3: Thesis + Rationale */}
        <div className="flex items-start gap-2">
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground/60 pt-px">Thesis</span>
          <div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <span className={cn("font-medium", priceConfig.color)}>{insight.thesisSummary}</span>
              <span className="text-muted-foreground/60">{" -- "}</span>
              <span>{insight.rationale}</span>
            </p>
            {/* Action icons below thesis */}
            <div className="mt-1.5 flex items-center gap-1">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={excelPath}
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-[#21a366]/30 bg-[#21a366]/10 text-[#21a366] transition-colors hover:bg-[#21a366]/20 hover:border-[#21a366]/50"
                      aria-label={`Open ${insight.ticker} model`}
                    >
                      <FileSpreadsheet className="h-3 w-3" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
                    <p className="text-xs">See Model</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-[#D24726]/30 bg-[#D24726]/10 text-[#D24726] transition-colors hover:bg-[#D24726]/20 hover:border-[#D24726]/50"
                      aria-label="See deck"
                    >
                      <Presentation className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
                    <p className="text-xs">See Deck</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Open workspace"
                    >
                      <LayoutDashboard className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
                    <p className="text-xs">Open Workspace</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </QuotableWrapper>
  )
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {category}
    </span>
  )
}

function ThemeCard({ cluster, onQuote }: { cluster: ThemeCluster; onQuote?: (text: string) => void }) {
  const uniqueSources = [...new Set(cluster.headlines.map((h) => h.source))]
  const sourceCount = uniqueSources.length
  const themeAlignConfig = THEME_ALIGNMENT_CONFIG[cluster.themeAlignment]
  const isAgainstThesis = cluster.themeAlignment === "challenges"
  const hasInsights = cluster.insights.length > 0

  const headlinesQuotable = cluster.headlines.map((h) => `- ${h.title} (${h.source}, ${h.time})`).join("\n")
  const themeQuotable = `Theme: ${cluster.theme}\nCategory: ${cluster.category}\n\n${cluster.summary}`

  return (
    <article
      className={cn(
        "group border-b border-border px-6 py-5 transition-colors hover:bg-card/60",
        isAgainstThesis && "relative border-l-2 border-l-negative/40 bg-gradient-to-r from-negative/[0.03] via-transparent to-transparent",
      )}
    >
      {/* Theme header */}
      <QuotableWrapper quotableText={`${cluster.theme}: ${cluster.summary}`} onQuote={onQuote} className="mb-2">
        <div className="flex items-center gap-2.5 pr-6">
          <CategoryBadge category={cluster.category} />
          {/* Theme-level thesis alignment badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
              themeAlignConfig.bgColor,
              themeAlignConfig.color,
            )}
          >
            <themeAlignConfig.Icon className="h-2.5 w-2.5" />
            {themeAlignConfig.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {cluster.headlines[0].time}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            {sourceCount} source{sourceCount !== 1 ? "s" : ""}
          </span>
        </div>
      </QuotableWrapper>

      {/* Theme title */}
      <h3 className="mb-3 text-[15px] font-semibold leading-snug text-foreground">
        {cluster.theme}
      </h3>

      {/* Headline cluster */}
      <QuotableWrapper quotableText={headlinesQuotable} onQuote={onQuote} className="mb-3">
        <div className="rounded-md border border-border/60 bg-secondary/30 px-3 py-2 pr-8">
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
      </QuotableWrapper>

      {/* Theme synthesis */}
      <QuotableWrapper quotableText={themeQuotable} onQuote={onQuote} className={cn(hasInsights ? "mb-4" : "")}>
        <p className="text-[13px] leading-relaxed text-muted-foreground pr-6">
          {cluster.summary}
        </p>
      </QuotableWrapper>

      {/* Stock Insights -- only rendered for against-thesis themes */}
      {hasInsights && (
        <div
          className={cn(
            "rounded-lg border px-4 py-2",
            isAgainstThesis
              ? "border-negative/20 bg-negative/[0.02]"
              : "border-border bg-secondary/40",
          )}
        >
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
              <InsightRow key={insight.ticker} insight={insight} onQuote={onQuote} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

export function MorningBrief({ onQuoteToChat }: { onQuoteToChat?: (text: string) => void }) {
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
              Feb 12, 2026 — Thematic Intelligence Feed
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

      {/* Theme List */}
      <ScrollArea className="flex-1">
        <div>
          {themeClusters.map((cluster) => (
            <ThemeCard key={cluster.id} cluster={cluster} onQuote={onQuoteToChat} />
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
