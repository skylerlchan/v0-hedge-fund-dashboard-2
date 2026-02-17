"use client"

import { useState, useRef, useEffect } from "react"
import { Download, Bold, Italic, AlignLeft, Hash, Filter } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface SpreadsheetViewerProps {
  fileName: string
}

// Generate contextual financial data based on the file name
function generateData(fileName: string) {
  const lower = fileName.toLowerCase()
  const ticker = lower.match(/^([a-z]+)/)?.[1]?.toUpperCase() ?? "AAPL"

  const companies: Record<string, { name: string; data: number[][] }> = {
    AAPL: {
      name: "Apple Inc.",
      data: [
        [394328, 383285, 390200, 410500, 432000],
        [169560, 166683, 170100, 178400, 187500],
        [224768, 216602, 220100, 232100, 244500],
        [56335, 55013, 56800, 59200, 61500],
        [23089, 23209, 23500, 24100, 25000],
        [145344, 138548, 139800, 148800, 158000],
        [119437, 116578, 118200, 124600, 133000],
        [100000, 111852, 112500, 118200, 125600],
        [6.16, 6.43, 6.68, 7.22, 7.85],
        [26.5, 26.8, 27.2, 28.0, 28.8],
      ],
    },
    MSFT: {
      name: "Microsoft Corp.",
      data: [
        [211915, 227583, 254200, 282000, 312000],
        [65800, 71400, 78600, 85400, 93200],
        [146115, 156183, 175600, 196600, 218800],
        [52620, 56800, 62500, 68200, 74500],
        [16300, 18200, 19800, 21500, 23200],
        [77195, 81183, 93300, 106900, 121100],
        [89694, 108882, 115600, 128000, 142000],
        [72738, 86187, 92400, 103500, 116000],
        [9.72, 11.56, 12.40, 13.90, 15.60],
        [43.0, 43.5, 44.0, 44.8, 45.5],
      ],
    },
    NVDA: {
      name: "NVIDIA Corp.",
      data: [
        [26974, 60922, 130500, 178000, 220000],
        [11618, 16621, 30200, 38600, 46200],
        [15356, 44301, 100300, 139400, 173800],
        [7000, 8200, 12400, 15800, 19200],
        [2700, 3100, 4200, 5400, 6800],
        [5656, 33001, 83700, 118200, 147800],
        [4368, 29760, 72400, 102000, 128000],
        [4332, 26875, 65500, 93000, 117500],
        [1.74, 10.78, 26.30, 37.30, 47.10],
        [57.0, 72.8, 76.8, 78.4, 79.0],
      ],
    },
    GOOGL: {
      name: "Alphabet Inc.",
      data: [
        [283100, 307468, 338200, 372000, 405000],
        [126200, 133300, 144800, 158200, 172000],
        [156900, 174168, 193400, 213800, 233000],
        [45200, 48800, 53200, 58000, 63200],
        [12800, 14200, 15500, 16800, 18200],
        [98900, 111168, 124700, 139000, 151600],
        [86200, 100520, 112800, 126000, 138500],
        [73795, 85528, 96200, 108500, 119800],
        [5.80, 6.76, 7.64, 8.64, 9.56],
        [55.4, 56.6, 57.2, 57.5, 57.6],
      ],
    },
  }

  const fallback = companies.AAPL
  const companyData = companies[ticker] || fallback
  const name = companyData.name

  const rows = [
    "Revenue",
    "COGS",
    "Gross Profit",
    "R&D Expense",
    "D&A",
    "EBITDA",
    "Operating Income",
    "Net Income",
    "EPS (Diluted)",
    "Gross Margin %",
  ]

  const cols = ["FY2022A", "FY2023A", "FY2024A", "FY2025E", "FY2026E"]

  return { ticker, name, rows, cols, data: companyData.data }
}

function formatCell(value: number, rowLabel: string): string {
  if (rowLabel.includes("EPS")) return `$${value.toFixed(2)}`
  if (rowLabel.includes("Margin") || rowLabel.includes("%")) return `${value.toFixed(1)}%`
  if (Math.abs(value) >= 1000) return value.toLocaleString()
  return value.toString()
}

export function SpreadsheetViewer({ fileName }: SpreadsheetViewerProps) {
  const { ticker, name, rows, cols, data } = generateData(fileName)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [cellValues, setCellValues] = useState<Record<string, string>>({})
  const inputRef = useRef<HTMLInputElement>(null)

  const getCellValue = (r: number, c: number) => {
    const key = `${r}-${c}`
    if (cellValues[key] !== undefined) return cellValues[key]
    return formatCell(data[r][c], rows[r])
  }

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell({ row: r, col: c })
  }

  useEffect(() => {
    if (selectedCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [selectedCell])

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-8 shrink-0 items-center gap-3 border-b border-border bg-background px-3">
        <span className="font-mono text-[10px] font-semibold text-foreground">{ticker}</span>
        <span className="text-[10px] text-muted-foreground">{name} -- Financial Model</span>
        <span className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1">
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Bold">
            <Bold className="h-3 w-3" />
          </button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Italic">
            <Italic className="h-3 w-3" />
          </button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Align">
            <AlignLeft className="h-3 w-3" />
          </button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Format number">
            <Hash className="h-3 w-3" />
          </button>
          <button type="button" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Filter">
            <Filter className="h-3 w-3" />
          </button>
        </div>
        <div className="flex-1" />
        <button type="button" className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground">
          <Download className="h-3 w-3" />
          Export
        </button>
      </div>

      {/* Formula bar */}
      <div className="flex h-7 shrink-0 items-center border-b border-border bg-accent/30 px-3">
        <span className="w-12 shrink-0 font-mono text-[10px] text-muted-foreground">
          {selectedCell ? `${String.fromCharCode(65 + selectedCell.col + 1)}${selectedCell.row + 2}` : ""}
        </span>
        <span className="mr-2 h-3.5 w-px bg-border" />
        <span className="font-mono text-[10px] text-muted-foreground">
          {selectedCell ? getCellValue(selectedCell.row, selectedCell.col) : "Select a cell"}
        </span>
      </div>

      {/* Table */}
      <ScrollArea className="flex-1">
        <div className="min-w-full">
          <table className="w-full border-collapse font-mono text-[11px]">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-20 h-7 min-w-[180px] border-b border-r border-border bg-accent/50 px-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  ($ millions)
                </th>
                {cols.map((col) => (
                  <th
                    key={col}
                    className={cn(
                      "sticky top-0 z-10 h-7 min-w-[110px] border-b border-r border-border bg-accent/50 px-3 text-right text-[10px] font-semibold uppercase tracking-wider",
                      col.includes("E") ? "text-blue-400" : "text-muted-foreground",
                    )}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((rowLabel, r) => {
                const isSubtotal = rowLabel === "Gross Profit" || rowLabel === "EBITDA" || rowLabel === "Operating Income" || rowLabel === "Net Income"
                return (
                  <tr
                    key={rowLabel}
                    className={cn(
                      "transition-colors hover:bg-accent/20",
                      isSubtotal && "bg-accent/30",
                    )}
                  >
                    <td
                      className={cn(
                        "sticky left-0 z-10 h-7 border-b border-r border-border bg-background px-3 text-left",
                        isSubtotal ? "font-semibold text-foreground" : "text-muted-foreground",
                        isSubtotal && "bg-accent/30",
                      )}
                    >
                      {rowLabel}
                    </td>
                    {cols.map((_, c) => {
                      const isSelected = selectedCell?.row === r && selectedCell?.col === c
                      const isEstimate = cols[c].includes("E")
                      const raw = data[r]?.[c] ?? 0
                      const isNegativeGrowth = c > 0 && raw < (data[r]?.[c - 1] ?? 0)

                      return (
                        <td
                          key={c}
                          onClick={() => handleCellClick(r, c)}
                          className={cn(
                            "h-7 cursor-cell border-b border-r border-border px-3 text-right tabular-nums",
                            isSelected && "ring-1 ring-inset ring-foreground bg-accent/60",
                            isSubtotal && "font-semibold",
                            isEstimate && "bg-blue-500/[0.03]",
                            isNegativeGrowth && !rowLabel.includes("Margin") && "text-negative",
                          )}
                        >
                          {isSelected ? (
                            <input
                              ref={inputRef}
                              className="w-full bg-transparent text-right font-mono text-[11px] text-foreground outline-none"
                              defaultValue={getCellValue(r, c)}
                              onBlur={(e) => {
                                setCellValues((prev) => ({ ...prev, [`${r}-${c}`]: e.target.value }))
                                setSelectedCell(null)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.currentTarget.blur()
                                } else if (e.key === "Escape") {
                                  setSelectedCell(null)
                                } else if (e.key === "Tab") {
                                  e.preventDefault()
                                  e.currentTarget.blur()
                                  const nextCol = c + 1 < cols.length ? c + 1 : 0
                                  const nextRow = nextCol === 0 ? r + 1 : r
                                  if (nextRow < rows.length) {
                                    setSelectedCell({ row: nextRow, col: nextCol })
                                  }
                                }
                              }}
                            />
                          ) : (
                            <span className={cn(isEstimate && "text-foreground")}>
                              {getCellValue(r, c)}
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </ScrollArea>

      {/* Status bar */}
      <div className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-accent/30 px-3">
        <span className="text-[9px] text-muted-foreground">
          {rows.length} rows x {cols.length} cols
        </span>
        <span className="text-[9px] text-muted-foreground">
          {selectedCell ? "EDIT" : "READY"}
        </span>
      </div>
    </div>
  )
}
