"use client"

import React from "react"

import { useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Building2,
  TrendingUp,
  BarChart3,
  StickyNote,
  BookOpen,
  Calendar,
  PanelLeftClose,
  PanelLeft,
  Search,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TreeNode {
  name: string
  icon?: React.ReactNode
  children?: TreeNode[]
}

const fileTree: TreeNode[] = [
  {
    name: "Positions",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    children: [
      {
        name: "Technology",
        icon: <Folder className="h-3.5 w-3.5" />,
        children: [
          { name: "AAPL — Apple Inc.", icon: <Building2 className="h-3.5 w-3.5" /> },
          { name: "MSFT — Microsoft Corp.", icon: <Building2 className="h-3.5 w-3.5" /> },
          { name: "NVDA — NVIDIA Corp.", icon: <Building2 className="h-3.5 w-3.5" /> },
          { name: "GOOGL — Alphabet Inc.", icon: <Building2 className="h-3.5 w-3.5" /> },
          { name: "META — Meta Platforms", icon: <Building2 className="h-3.5 w-3.5" /> },
        ],
      },
      {
        name: "Healthcare",
        icon: <Folder className="h-3.5 w-3.5" />,
        children: [
          { name: "UNH — UnitedHealth Group", icon: <Building2 className="h-3.5 w-3.5" /> },
          { name: "JNJ — Johnson & Johnson", icon: <Building2 className="h-3.5 w-3.5" /> },
          { name: "LLY — Eli Lilly & Co.", icon: <Building2 className="h-3.5 w-3.5" /> },
        ],
      },
      {
        name: "Energy",
        icon: <Folder className="h-3.5 w-3.5" />,
        children: [
          { name: "XOM — Exxon Mobil", icon: <Building2 className="h-3.5 w-3.5" /> },
          { name: "CVX — Chevron Corp.", icon: <Building2 className="h-3.5 w-3.5" /> },
        ],
      },
      {
        name: "Financials",
        icon: <Folder className="h-3.5 w-3.5" />,
        children: [
          { name: "JPM — JPMorgan Chase", icon: <Building2 className="h-3.5 w-3.5" /> },
          { name: "GS — Goldman Sachs", icon: <Building2 className="h-3.5 w-3.5" /> },
        ],
      },
    ],
  },
  {
    name: "Research",
    icon: <BookOpen className="h-3.5 w-3.5" />,
    children: [
      { name: "Macro Outlook Q1 2026.pdf", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "AI Sector Deep Dive.pdf", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "Rate Sensitivity Model.xlsx", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "GLP-1 Market Analysis.pdf", icon: <FileText className="h-3.5 w-3.5" /> },
    ],
  },
  {
    name: "Earnings",
    icon: <BarChart3 className="h-3.5 w-3.5" />,
    children: [
      { name: "NVDA — Q4 2025 Transcript", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "AAPL — Q4 2025 Transcript", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "MSFT — Q2 2026 Preview", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "LLY — Q4 2025 Transcript", icon: <FileText className="h-3.5 w-3.5" /> },
    ],
  },
  {
    name: "Notes",
    icon: <StickyNote className="h-3.5 w-3.5" />,
    children: [
      { name: "IC Meeting — Feb 10, 2026", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "Trade Ideas — Week of Feb 9", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "Risk Committee Notes", icon: <FileText className="h-3.5 w-3.5" /> },
    ],
  },
  {
    name: "Calendar",
    icon: <Calendar className="h-3.5 w-3.5" />,
    children: [
      { name: "FOMC Meeting — Mar 18", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "NVDA Earnings — Feb 26", icon: <FileText className="h-3.5 w-3.5" /> },
      { name: "CPI Release — Feb 12", icon: <FileText className="h-3.5 w-3.5" /> },
    ],
  },
]

function TreeItem({
  node,
  depth = 0,
}: {
  node: TreeNode
  depth?: number
}) {
  const [isOpen, setIsOpen] = useState(depth === 0)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          hasChildren ? "text-foreground" : "text-muted-foreground",
          depth === 0 && "font-medium"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <span className="shrink-0 text-muted-foreground">
          {hasChildren ? (
            isOpen ? (
              <FolderOpen className="h-3.5 w-3.5" />
            ) : (
              node.icon || <Folder className="h-3.5 w-3.5" />
            )
          ) : (
            node.icon || <FileText className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="truncate text-left text-xs">{node.name}</span>
      </button>
      {hasChildren && isOpen && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileSidebar({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean
  onToggle: () => void
}) {
  if (isCollapsed) {
    return (
      <div className="flex h-full w-10 flex-col items-center border-r border-border bg-background py-2">
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Expand sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explorer
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 rounded-md bg-secondary px-2 py-1.5">
          <Search className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Search files...</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-1">
          {fileTree.map((node) => (
            <TreeItem key={node.name} node={node} depth={0} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
