"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export type FileType = "spreadsheet" | "pdf" | "text" | "chart" | "morning-brief"

export interface WorkspaceTab {
  id: string
  name: string
  type: FileType
  filePath: string
  isPinned?: boolean
}

interface WorkspaceState {
  tabs: WorkspaceTab[]
  activeTabId: string | null
  openFile: (name: string) => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  reorderTabs: (fromIndex: number, toIndex: number) => void
}

const WorkspaceContext = createContext<WorkspaceState | null>(null)

function detectFileType(name: string): FileType {
  const lower = name.toLowerCase()
  if (lower.includes("morning brief")) return "morning-brief"
  if (lower.endsWith(".xlsx") && (lower.includes("sensitivity") || lower.includes("tam") || lower.includes("rev_build") || lower.includes("acreage") || lower.includes("nii"))) return "chart"
  if (lower.endsWith(".xlsx")) return "spreadsheet"
  if (lower.endsWith(".pdf")) return "pdf"
  return "text"
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<WorkspaceTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

  const openFile = useCallback((name: string) => {
    setTabs((prev) => {
      const existing = prev.find((t) => t.name === name)
      if (existing) {
        setActiveTabId(existing.id)
        return prev
      }
      const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const type = detectFileType(name)
      const newTab: WorkspaceTab = { id, name, type, filePath: name }
      setActiveTabId(id)
      return [...prev, newTab]
    })
  }, [])

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === id)
      const next = prev.filter((t) => t.id !== id)
      if (next.length === 0) {
        setActiveTabId(null)
      } else if (activeTabId === id) {
        // Activate the adjacent tab
        const newIdx = Math.min(idx, next.length - 1)
        setActiveTabId(next[newIdx].id)
      }
      return next
    })
  }, [activeTabId])

  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setTabs((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{ tabs, activeTabId, openFile, closeTab, setActiveTab: setActiveTabId, reorderTabs }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider")
  return ctx
}
