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
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="flex h-10 shrink-0 items-center justify-end border-b border-border px-4">
        <ThemeToggle />
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

          {/* Center Panel */}
          <ResizablePanel defaultSize={leftCollapsed ? 100 : 82} minSize={50}>
            <MorningBrief />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}


