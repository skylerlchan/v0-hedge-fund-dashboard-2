"use client"

import React from "react"

import { useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Building2,
  TrendingUp,
  BarChart3,
  StickyNote,
  BookOpen,
  Calendar,
  PanelLeftClose,
  PanelLeft,
  Search,
  List,
  LayoutGrid,
  Upload,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
          { name: "AAPL — Apple Inc.", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "aapl_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
            { name: "aapl_dcf_backup.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
            { name: "AAPL — Q4 Notes.txt", icon: <FileText className="h-3.5 w-3.5" /> },
          ]},
          { name: "MSFT — Microsoft Corp.", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "msft_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
            { name: "msft_azure_sensitivity.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
          { name: "NVDA — NVIDIA Corp.", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "nvda_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
            { name: "nvda_blackwell_rev_build.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
            { name: "NVDA — Thesis.txt", icon: <FileText className="h-3.5 w-3.5" /> },
          ]},
          { name: "GOOGL — Alphabet Inc.", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "googl_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
          { name: "META — Meta Platforms", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "meta_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
        ],
      },
      {
        name: "Healthcare",
        icon: <Folder className="h-3.5 w-3.5" />,
        children: [
          { name: "UNH — UnitedHealth Group", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "unh_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
          { name: "JNJ — Johnson & Johnson", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "jnj_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
          { name: "LLY — Eli Lilly & Co.", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "lly_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
            { name: "lly_glp1_tam_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
        ],
      },
      {
        name: "Energy",
        icon: <Folder className="h-3.5 w-3.5" />,
        children: [
          { name: "XOM — Exxon Mobil", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "xom_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
            { name: "xom_permian_acreage.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
          { name: "CVX — Chevron Corp.", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "cvx_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
        ],
      },
      {
        name: "Financials",
        icon: <Folder className="h-3.5 w-3.5" />,
        children: [
          { name: "JPM — JPMorgan Chase", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "jpm_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
            { name: "jpm_nii_sensitivity.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
          { name: "GS — Goldman Sachs", icon: <Building2 className="h-3.5 w-3.5" />, children: [
            { name: "gs_model.xlsx", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
          ]},
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

/* ── Icon map for grid view (maps folder names to icons) ── */
const FOLDER_ICON_MAP: Record<string, React.ReactNode> = {
  Positions: <TrendingUp className="h-5 w-5" />,
  Technology: <Folder className="h-5 w-5" />,
  Healthcare: <Folder className="h-5 w-5" />,
  Energy: <Folder className="h-5 w-5" />,
  Financials: <Folder className="h-5 w-5" />,
  Research: <BookOpen className="h-5 w-5" />,
  Earnings: <BarChart3 className="h-5 w-5" />,
  Notes: <StickyNote className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
}

/* ── List View: Tree Item ── */
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
          depth === 0 && "font-medium",
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

/* ── Grid View: Folder Card ── */
function GridFolderCard({
  node,
  onOpen,
}: {
  node: TreeNode
  onOpen: (node: TreeNode) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const childCount = node.children?.length ?? 0
  const isFile = !hasChildren

  return (
    <button
      type="button"
      onClick={() => hasChildren ? onOpen(node) : undefined}
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-border p-3 transition-colors",
        "hover:bg-accent hover:border-muted-foreground/30",
        isFile && "opacity-80",
      )}
    >
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg",
        hasChildren ? "bg-secondary text-foreground" : "bg-secondary/60 text-muted-foreground",
      )}>
        {isFile ? (
          node.name.endsWith(".xlsx") ? (
            <FileSpreadsheet className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5" />
          )
        ) : (
          FOLDER_ICON_MAP[node.name] || <Folder className="h-5 w-5" />
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5 min-w-0 w-full">
        <span className="text-[11px] font-medium text-foreground truncate w-full text-center">
          {node.name}
        </span>
        {hasChildren && (
          <span className="text-[10px] text-muted-foreground">
            {childCount} {childCount === 1 ? "item" : "items"}
          </span>
        )}
      </div>
    </button>
  )
}

/* ── Grid View: Full Component ── */
function GridView({ tree }: { tree: TreeNode[] }) {
  const [path, setPath] = useState<TreeNode[]>([])

  const currentItems = path.length === 0
    ? tree
    : path[path.length - 1].children ?? []

  const handleOpen = (node: TreeNode) => {
    setPath((prev) => [...prev, node])
  }

  const handleBreadcrumb = (index: number) => {
    if (index < 0) {
      setPath([])
    } else {
      setPath((prev) => prev.slice(0, index + 1))
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border min-h-[32px]">
        <button
          type="button"
          onClick={() => handleBreadcrumb(-1)}
          className={cn(
            "text-[10px] uppercase tracking-wider transition-colors",
            path.length === 0 ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground",
          )}
        >
          Root
        </button>
        {path.map((node, i) => (
          <React.Fragment key={node.name}>
            <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/50" />
            <button
              type="button"
              onClick={() => handleBreadcrumb(i)}
              className={cn(
                "text-[10px] uppercase tracking-wider transition-colors truncate max-w-[80px]",
                i === path.length - 1 ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {node.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-3 gap-2 p-3">
          {currentItems.map((node) => (
            <GridFolderCard key={node.name} node={node} onOpen={handleOpen} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

/* ── Main Sidebar Export ── */
export function FileSidebar({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean
  onToggle: () => void
}) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

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
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full w-full flex-col border-r border-border bg-background">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Explorer
          </span>
          <div className="flex items-center gap-0.5">
            {/* List / Grid toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded p-1 transition-colors",
                    viewMode === "list"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                  aria-label="List view"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
                <p className="text-xs">List view</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded p-1 transition-colors",
                    viewMode === "grid"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
                <p className="text-xs">Grid view</p>
              </TooltipContent>
            </Tooltip>

            <span className="mx-1 h-3.5 w-px bg-border" />

            <button
              type="button"
              onClick={onToggle}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-border px-3 py-2">
          <div className="flex items-center gap-2 rounded-md bg-secondary px-2 py-1.5">
            <Search className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Search files...</span>
          </div>
        </div>

        {/* Content: List or Grid */}
        {viewMode === "list" ? (
          <ScrollArea className="flex-1">
            <div className="p-1">
              {fileTree.map((node) => (
                <TreeItem key={node.name} node={node} depth={0} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <GridView tree={fileTree} />
        )}

        {/* Upload button */}
        <div className="border-t border-border p-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/30 py-2 text-xs text-muted-foreground transition-colors hover:border-muted-foreground/60 hover:bg-accent hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload documents
          </button>
        </div>
      </div>
    </TooltipProvider>
  )
}
