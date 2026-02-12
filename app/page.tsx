"use client"

import { useState } from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { FileSidebar } from "@/components/file-sidebar"
import { NewsFeed } from "@/components/news-feed"
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
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Meridian
          </span>
          <span className="text-xs text-muted-foreground">Capital</span>
        </div>
        <nav className="flex items-center gap-1">
          <TopBarButton label="Dashboard" active />
          <TopBarButton label="Portfolio" />
          <TopBarButton label="Trades" />
          <TopBarButton label="Analytics" />
        </nav>
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
          <FileSidebar
            isCollapsed={true}
            onToggle={() => setLeftCollapsed(false)}
          />
        ) : null}

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel - File Sidebar */}
          {!leftCollapsed && (
            <>
              <ResizablePanel
                defaultSize={18}
                minSize={14}
                maxSize={28}
                className="min-w-0"
              >
                <FileSidebar
                  isCollapsed={false}
                  onToggle={() => setLeftCollapsed(true)}
                />
              </ResizablePanel>
              <ResizableHandle className="w-px bg-border hover:bg-muted-foreground/20 transition-colors" />
            </>
          )}

          {/* Center Panel - News Feed */}
          <ResizablePanel defaultSize={rightCollapsed && leftCollapsed ? 100 : leftCollapsed ? 72 : rightCollapsed ? 82 : 54} minSize={30}>
            <NewsFeed />
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

function TopBarButton({
  label,
  active = false,
}: {
  label: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
        active
          ? "bg-secondary text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      {label}
    </button>
  )
}
