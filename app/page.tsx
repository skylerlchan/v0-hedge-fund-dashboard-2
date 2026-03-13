"use client"

import { useState } from "react"
import { Home } from "lucide-react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { PortfolioHub } from "@/components/portfolio-hub"
import { MorningBrief } from "@/components/research/morning-brief"
import { AIChatPanel } from "@/components/ai-chat-panel"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="flex h-10 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </button>
        </div>
        <div />
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-muted-foreground">
            S&P 500: 6,142.38{" "}
            <span className="text-positive">+0.84%</span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            VIX: 14.82{" "}
            <span className="text-negative">+2.1%</span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            10Y: 4.28%
          </span>
          <span className="h-4 w-px bg-border" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {leftCollapsed ? (
          <PortfolioHub
            isCollapsed={true}
            onToggle={() => setLeftCollapsed(false)}
          />
        ) : null}

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel - Portfolio Hub */}
          {!leftCollapsed && (
            <>
              <ResizablePanel
                defaultSize={18}
                minSize={14}
                maxSize={28}
                className="min-w-0"
              >
                <PortfolioHub
                  isCollapsed={false}
                  onToggle={() => setLeftCollapsed(true)}
                />
              </ResizablePanel>
              <ResizableHandle className="w-px bg-border hover:bg-muted-foreground/20 transition-colors" />
            </>
          )}

          {/* Center Panel - News Feed */}
          <ResizablePanel defaultSize={rightCollapsed && leftCollapsed ? 100 : leftCollapsed ? 72 : rightCollapsed ? 82 : 54} minSize={30}>
            <MorningBrief />
          </ResizablePanel>

          {/* Right Panel - AI Chat */}
          {!rightCollapsed && (
            <>
              <ResizableHandle className="w-px bg-border hover:bg-muted-foreground/20 transition-colors" />
              <ResizablePanel
                defaultSize={28}
                minSize={20}
                maxSize={45}
                className="min-w-0"
              >
                <AIChatPanel
                  isCollapsed={false}
                  onToggle={() => setRightCollapsed(true)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        {/* Right collapsed bar */}
        {rightCollapsed ? (
          <AIChatPanel
            isCollapsed={true}
            onToggle={() => setRightCollapsed(false)}
          />
        ) : null}
      </div>
    </div>
  )
}


