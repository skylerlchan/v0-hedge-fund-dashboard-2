"use client"

import {
  Newspaper,
  StickyNote,
  FolderOpen,
  Layers,
  MousePointerClick,
} from "lucide-react"
import { useWorkspace } from "./workspace-context"

export function EmptyState() {
  const { openFile } = useWorkspace()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-8">
      {/* Icon cluster */}
      <div className="relative flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-accent/30">
          <Layers className="h-8 w-8 text-muted-foreground/40" />
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-sm font-medium text-foreground">Workspace</h2>
        <p className="max-w-[320px] text-xs leading-relaxed text-muted-foreground">
          Open a file from the explorer to get started. Spreadsheets, reports, notes, and
          research all open here as tabs.
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openFile("Morning Brief — Feb 12, 2026")}
          className="flex items-center gap-2 rounded-md border border-border bg-accent/50 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Newspaper className="h-3.5 w-3.5" />
          Morning Brief
        </button>
        <button
          type="button"
          onClick={() => openFile("Trade Ideas — Week of Feb 9")}
          className="flex items-center gap-2 rounded-md border border-border bg-accent/50 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <StickyNote className="h-3.5 w-3.5" />
          New Note
        </button>
      </div>

      {/* Hint */}
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
        <MousePointerClick className="h-3 w-3" />
        Click any file in the sidebar
      </div>
    </div>
  )
}
