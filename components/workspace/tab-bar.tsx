"use client"

import React, { useRef, useState, useCallback } from "react"
import {
  FileSpreadsheet,
  FileText,
  BarChart3,
  Newspaper,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useWorkspace, type WorkspaceTab, type FileType } from "./workspace-context"

const FILE_TYPE_CONFIG: Record<FileType, { icon: React.ElementType; color: string }> = {
  spreadsheet: { icon: FileSpreadsheet, color: "text-emerald-500" },
  pdf: { icon: FileText, color: "text-red-400" },
  text: { icon: FileText, color: "text-blue-400" },
  chart: { icon: BarChart3, color: "text-orange-400" },
  "morning-brief": { icon: Newspaper, color: "text-foreground" },
}

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, reorderTabs } = useWorkspace()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkOverflow = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftArrow(el.scrollLeft > 2)
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" })
  }

  React.useEffect(() => {
    checkOverflow()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", checkOverflow)
    const ro = new ResizeObserver(checkOverflow)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", checkOverflow)
      ro.disconnect()
    }
  }, [checkOverflow, tabs.length])

  if (tabs.length === 0) return null

  return (
    <div className="flex h-9 shrink-0 items-center border-b border-border bg-background">
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="flex h-full w-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex flex-1 items-stretch overflow-x-auto scrollbar-none"
        onScroll={checkOverflow}
      >
        {tabs.map((tab, i) => {
          const config = FILE_TYPE_CONFIG[tab.type]
          const Icon = config.icon
          const isActive = tab.id === activeTabId
          const isDragging = dragIdx === i
          const isOver = overIdx === i && dragIdx !== i

          return (
            <button
              key={tab.id}
              type="button"
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => {
                e.preventDefault()
                setOverIdx(i)
              }}
              onDragEnd={() => {
                if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
                  reorderTabs(dragIdx, overIdx)
                }
                setDragIdx(null)
                setOverIdx(null)
              }}
              onMouseDown={(e) => {
                // Middle click to close
                if (e.button === 1) {
                  e.preventDefault()
                  closeTab(tab.id)
                }
              }}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group relative flex h-full min-w-0 max-w-[180px] shrink-0 items-center gap-1.5 px-3 text-xs transition-colors",
                isActive
                  ? "bg-accent/50 text-foreground"
                  : "text-muted-foreground hover:bg-accent/30 hover:text-foreground",
                isDragging && "opacity-40",
                isOver && "border-l-2 border-foreground",
              )}
            >
              <Icon className={cn("h-3 w-3 shrink-0", config.color)} />
              <span className="truncate">{tab.name}</span>
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }
                }}
                className={cn(
                  "ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors",
                  "opacity-0 group-hover:opacity-100",
                  "hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground",
                )}
                aria-label={`Close ${tab.name}`}
              >
                <X className="h-2.5 w-2.5" />
              </span>
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-px bg-foreground" />
              )}
            </button>
          )
        })}
      </div>

      {showRightArrow && (
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="flex h-full w-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
