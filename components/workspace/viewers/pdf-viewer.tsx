"use client"

import { useState } from "react"
import { ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface PdfViewerProps {
  fileName: string
}

const PDF_CONTENT: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  "Macro Outlook Q1 2026.pdf": {
    title: "Macro Outlook Q1 2026",
    sections: [
      {
        heading: "Executive Summary",
        body: "The global macro environment entering Q1 2026 is characterized by a divergence between resilient U.S. growth and softening conditions in Europe and China. The Federal Reserve has paused at 3.75-4.00% after three 25bp cuts in H2 2025, while the ECB continues its easing cycle with another 25bp cut expected in March. Inflation has moderated to 2.3% YoY in the U.S. but remains sticky in services at 3.1%.\n\nKey risks to the outlook include: (1) a potential re-acceleration in inflation driven by commodity prices, (2) geopolitical tensions affecting supply chains, and (3) the U.S. fiscal trajectory with debt/GDP approaching 130%. We maintain a cautiously optimistic stance with an overweight in equities, particularly U.S. large-cap tech and healthcare.",
      },
      {
        heading: "U.S. Economic Outlook",
        body: "GDP growth is tracking at 2.1% annualized for Q1, supported by consumer spending and business investment in AI infrastructure. The labor market remains firm with unemployment at 3.9%, though hiring has slowed from 2024 peaks. Wage growth has moderated to 3.5% YoY, consistent with the Fed's comfort zone.\n\nWe expect the Fed to remain on hold through mid-2026, with the next cut likely in June conditional on further progress on core PCE toward the 2% target. The yield curve has normalized with the 2s10s spread at +45bps, supporting bank profitability and credit intermediation.",
      },
      {
        heading: "Market Implications",
        body: "Equity markets are pricing in continued earnings growth of 12-14% for the S&P 500 in 2026, driven by AI-related capex and productivity gains. Valuations at 21.5x forward P/E are elevated relative to history but supported by the quality and durability of mega-cap tech earnings.\n\nWe see opportunities in: (1) AI infrastructure beneficiaries trading at reasonable multiples, (2) healthcare names leveraging GLP-1 momentum, and (3) select financials benefiting from steeper yield curves and normalized credit costs.",
      },
      {
        heading: "Fixed Income Strategy",
        body: "We recommend a moderate duration stance with a bias toward the belly of the curve (5-7Y). Investment grade credit spreads at +95bps offer reasonable carry, while high yield at +320bps is fully valued. Treasury allocations should focus on TIPS as a hedge against potential inflation surprises.\n\nKey catalysts for rates: FOMC minutes, CPI releases, and Treasury auction dynamics in the context of large deficit financing needs estimated at $2.1T for FY2026.",
      },
    ],
  },
  "AI Sector Deep Dive.pdf": {
    title: "AI Sector Deep Dive: Infrastructure to Application Layer",
    sections: [
      {
        heading: "Executive Summary",
        body: "The AI sector continues its multi-year growth trajectory, with total addressable market expanding from $180B in 2024 to an estimated $450B by 2027. The investment cycle is shifting from infrastructure buildout (GPUs, data centers) toward the application and monetization layer, creating new opportunities across the stack.\n\nNVIDIA remains the dominant infrastructure play with 85% market share in AI training accelerators, but we see emerging opportunities in custom silicon (AVGO, MRVL) and inference-optimized architectures. On the application side, enterprise AI adoption is accelerating with ~40% of Fortune 500 companies now deploying production AI workloads.",
      },
      {
        heading: "Infrastructure Layer Analysis",
        body: "Hyperscaler capex for 2026 is projected at $280B collectively, with ~55% directed toward AI infrastructure. Key trends include: (1) the transition to Blackwell Ultra architecture at NVIDIA, delivering 4x inference throughput, (2) growth in liquid cooling solutions as power density increases, and (3) expansion of AI-optimized data center footprints globally.\n\nWe maintain Overweight ratings on NVDA ($175 PT), AVGO ($240 PT), and MRVL ($110 PT). The key debate centers on the sustainability of the capex cycle beyond 2027 and whether enterprise ROI justifies continued investment at this pace.",
      },
      {
        heading: "Application Layer Opportunities",
        body: "Enterprise AI spending is bifurcating between foundational model access (APIs) and custom fine-tuned solutions. We see the greatest value creation in vertical-specific AI applications: healthcare diagnostics (+45% accuracy gains), financial services automation (30% cost reduction), and manufacturing predictive maintenance.\n\nKey names to watch: MSFT (Copilot ecosystem), CRM (AgentForce platform), and emerging pure-plays in AI-native enterprise software. The monetization inflection is approaching, with AI-attributed revenue expected to comprise 15-20% of enterprise software growth in 2026.",
      },
    ],
  },
  "GLP-1 Market Analysis.pdf": {
    title: "GLP-1 Market Analysis: The $150B Opportunity",
    sections: [
      {
        heading: "Market Overview",
        body: "The GLP-1 receptor agonist market has emerged as one of the largest therapeutic opportunities in pharmaceutical history. Combined revenue from Eli Lilly (tirzepatide/Mounjaro) and Novo Nordisk (semaglutide/Ozempic/Wegovy) reached $52B in 2025, with our models projecting $95B by 2028 and a peak market opportunity of $150B+ by 2032.\n\nKey growth drivers include: (1) label expansion beyond diabetes into obesity, NASH, cardiovascular outcomes, and sleep apnea, (2) improved supply chain capacity reducing current shortages, and (3) growing clinical evidence supporting long-term usage in metabolic health.",
      },
      {
        heading: "Competitive Landscape",
        body: "While LLY and NVO dominate today, 15+ companies have GLP-1 programs in late-stage development. Amgen's MariTide (monthly dosing) and Pfizer's oral danuglipron represent the most credible competitive threats. We estimate new entrants could capture 15-20% market share by 2029 but the overall market expansion benefits incumbents.\n\nKey risk to the thesis: pricing pressure from PBMs and potential government negotiation under the Inflation Reduction Act. We model 5-8% annual price erosion beginning in 2027, partially offset by volume growth and new indications.",
      },
      {
        heading: "Investment Thesis -- Eli Lilly (LLY)",
        body: "Our top pick in the space remains LLY with a $1,050 price target (35x 2026E EPS of $30). Tirzepatide's dual GIP/GLP-1 mechanism provides a differentiated efficacy profile, and the pipeline depth in obesity (orforglipron oral, retatrutide triple agonist) creates a multi-decade growth runway.\n\nKey catalysts: (1) SURMOUNT-5 head-to-head data vs semaglutide in Q2 2026, (2) retatrutide Phase 3 obesity readout in H2 2026, and (3) continued manufacturing expansion at the RTP and Lebanon, IN facilities targeting 2x capacity by mid-2027.",
      },
    ],
  },
}

function getDefaultContent(fileName: string) {
  return {
    title: fileName.replace(".pdf", ""),
    sections: [
      {
        heading: "Document Overview",
        body: `This document contains analysis and research related to ${fileName.replace(".pdf", "")}. The full content includes detailed data analysis, market commentary, and investment recommendations based on the latest available information.\n\nFor the most up-to-date version, please check the research portal or contact your coverage analyst.`,
      },
      {
        heading: "Key Findings",
        body: "Analysis is currently being compiled. Key data points and findings will be populated as research is completed. This placeholder represents the document structure that will be filled with relevant financial analysis, market data, and strategic recommendations.",
      },
    ],
  }
}

export function PdfViewer({ fileName }: PdfViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const content = PDF_CONTENT[fileName] ?? getDefaultContent(fileName)
  const totalPages = content.sections.length

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-8 shrink-0 items-center gap-3 border-b border-border bg-background px-3">
        <span className="text-[10px] font-medium text-foreground">{content.title}</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <span className="font-mono text-[10px] text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <span className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom(Math.max(60, zoom - 10))}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-3 w-3" />
          </button>
          <span className="font-mono text-[10px] text-muted-foreground">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-3 w-3" />
          </button>
        </div>
        <span className="h-3 w-px bg-border" />
        <button type="button" className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground">
          <Download className="h-3 w-3" />
          Download
        </button>
      </div>

      {/* PDF Content */}
      <ScrollArea className="flex-1 bg-secondary/30">
        <div className="flex justify-center p-6">
          <div
            className="w-full max-w-[680px] rounded border border-border bg-card p-8 shadow-sm"
            style={{ fontSize: `${zoom}%` }}
          >
            {/* Document header */}
            <div className="mb-8 border-b border-border pb-6">
              <h1 className="text-lg font-semibold text-foreground">{content.title}</h1>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>Research Division</span>
                <span className="h-3 w-px bg-border" />
                <span>February 2026</span>
                <span className="h-3 w-px bg-border" />
                <span>CONFIDENTIAL</span>
              </div>
            </div>

            {/* Sections */}
            {content.sections.map((section, i) => (
              <div key={i} className={cn("mb-6", i === content.sections.length - 1 && "mb-0")}>
                <h2 className="mb-3 text-sm font-semibold text-foreground">{section.heading}</h2>
                {section.body.split("\n\n").map((paragraph, j) => (
                  <p key={j} className="mb-3 text-xs leading-relaxed text-muted-foreground last:mb-0">
                    {paragraph}
                  </p>
                ))}
                {i < content.sections.length - 1 && (
                  <div className="mt-6 border-b border-dashed border-border" />
                )}
              </div>
            ))}

            {/* Footer */}
            <div className="mt-8 border-t border-border pt-4 text-center text-[9px] text-muted-foreground/60">
              Page {currentPage} of {totalPages} -- For Authorized Use Only
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
