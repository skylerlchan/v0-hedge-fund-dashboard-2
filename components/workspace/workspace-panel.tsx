"use client"

import { useWorkspace } from "./workspace-context"
import { TabBar } from "./tab-bar"
import { EmptyState } from "./empty-state"
import { SpreadsheetViewer } from "./viewers/spreadsheet-viewer"
import { PdfViewer } from "./viewers/pdf-viewer"
import { TextViewer } from "./viewers/text-viewer"
import { ChartViewer } from "./viewers/chart-viewer"
import { MorningBrief } from "@/components/research/morning-brief"

interface WorkspacePanelProps {
  onQuoteToChat?: (text: string) => void
}

export function WorkspacePanel({ onQuoteToChat }: WorkspacePanelProps) {
  const { tabs, activeTabId } = useWorkspace()
  const activeTab = tabs.find((t) => t.id === activeTabId)

  return (
    <div className="flex h-full flex-col">
      <TabBar />
      <div className="flex-1 overflow-hidden">
        {!activeTab ? (
          <EmptyState />
        ) : activeTab.type === "morning-brief" ? (
          <MorningBrief onQuoteToChat={onQuoteToChat} />
        ) : activeTab.type === "spreadsheet" ? (
          <SpreadsheetViewer fileName={activeTab.name} />
        ) : activeTab.type === "pdf" ? (
          <PdfViewer fileName={activeTab.name} />
        ) : activeTab.type === "chart" ? (
          <ChartViewer fileName={activeTab.name} />
        ) : (
          <TextViewer fileName={activeTab.name} />
        )}
      </div>
    </div>
  )
}
