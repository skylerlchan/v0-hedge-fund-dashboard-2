"use client"

import { useState } from "react"
import { BarChart3, LineChart as LineChartIcon, Table2, Download } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface ChartViewerProps {
  fileName: string
}

type ChartType = "line" | "bar"

function generateChartData(fileName: string) {
  const lower = fileName.toLowerCase()

  if (lower.includes("sensitivity") || lower.includes("nii")) {
    const title = lower.includes("azure")
      ? "Azure Growth Rate Sensitivity"
      : lower.includes("nii")
      ? "Net Interest Income Sensitivity"
      : "Key Variable Sensitivity Analysis"

    const xLabel = lower.includes("azure")
      ? "Azure Growth Rate (%)"
      : lower.includes("nii")
      ? "Fed Funds Rate (%)"
      : "Variable Range"

    const baseData = lower.includes("azure")
      ? [
          { x: "25%", bull: 520, base: 480, bear: 440 },
          { x: "28%", bull: 548, base: 505, bear: 462 },
          { x: "31%", bull: 578, base: 532, bear: 486 },
          { x: "34%", bull: 610, base: 560, bear: 512 },
          { x: "37%", bull: 645, base: 590, bear: 540 },
          { x: "40%", bull: 682, base: 622, bear: 570 },
        ]
      : lower.includes("nii")
      ? [
          { x: "3.0%", bull: 98, base: 92, bear: 85 },
          { x: "3.5%", bull: 102, base: 96, bear: 88 },
          { x: "4.0%", bull: 108, base: 101, bear: 92 },
          { x: "4.5%", bull: 112, base: 105, bear: 96 },
          { x: "5.0%", bull: 118, base: 110, bear: 100 },
          { x: "5.5%", bull: 122, base: 114, bear: 104 },
        ]
      : [
          { x: "Low", bull: 180, base: 155, bear: 130 },
          { x: "Mid-Low", bull: 195, base: 168, bear: 142 },
          { x: "Mid", bull: 210, base: 182, bear: 155 },
          { x: "Mid-High", bull: 228, base: 198, bear: 170 },
          { x: "High", bull: 248, base: 215, bear: 186 },
          { x: "V.High", bull: 270, base: 234, bear: 204 },
        ]

    return { title, xLabel, data: baseData, type: "sensitivity" as const }
  }

  if (lower.includes("tam") || lower.includes("market")) {
    return {
      title: "Total Addressable Market Projection",
      xLabel: "Year",
      data: [
        { x: "2023", bull: 45, base: 42, bear: 38 },
        { x: "2024", bull: 62, base: 55, bear: 48 },
        { x: "2025", bull: 85, base: 72, bear: 60 },
        { x: "2026E", bull: 115, base: 95, bear: 75 },
        { x: "2027E", bull: 152, base: 122, bear: 92 },
        { x: "2028E", bull: 195, base: 150, bear: 110 },
      ],
      type: "growth" as const,
    }
  }

  if (lower.includes("rev_build") || lower.includes("blackwell")) {
    return {
      title: "Revenue Build by Product Line",
      xLabel: "Quarter",
      data: [
        { x: "Q1'25", bull: 28, base: 26, bear: 24 },
        { x: "Q2'25", bull: 32, base: 30, bear: 27 },
        { x: "Q3'25", bull: 38, base: 35, bear: 31 },
        { x: "Q4'25", bull: 44, base: 40, bear: 35 },
        { x: "Q1'26E", bull: 52, base: 46, bear: 39 },
        { x: "Q2'26E", bull: 60, base: 52, bear: 43 },
      ],
      type: "build" as const,
    }
  }

  if (lower.includes("acreage") || lower.includes("permian")) {
    return {
      title: "Permian Basin Production Forecast",
      xLabel: "Year",
      data: [
        { x: "2023", bull: 620, base: 600, bear: 580 },
        { x: "2024", bull: 670, base: 640, bear: 610 },
        { x: "2025", bull: 720, base: 685, bear: 645 },
        { x: "2026E", bull: 780, base: 730, bear: 680 },
        { x: "2027E", bull: 840, base: 775, bear: 710 },
        { x: "2028E", bull: 900, base: 820, bear: 740 },
      ],
      type: "production" as const,
    }
  }

  return {
    title: "Scenario Analysis",
    xLabel: "Period",
    data: [
      { x: "P1", bull: 100, base: 90, bear: 80 },
      { x: "P2", bull: 115, base: 102, bear: 88 },
      { x: "P3", bull: 132, base: 115, bear: 96 },
      { x: "P4", bull: 150, base: 128, bear: 105 },
      { x: "P5", bull: 170, base: 142, bear: 115 },
      { x: "P6", bull: 192, base: 158, bear: 126 },
    ],
    type: "generic" as const,
  }
}

export function ChartViewer({ fileName }: ChartViewerProps) {
  const [chartType, setChartType] = useState<ChartType>("line")
  const [showTable, setShowTable] = useState(false)
  const { title, xLabel, data } = generateChartData(fileName)

  const chartColors = {
    bull: "hsl(142, 60%, 45%)",
    base: "hsl(210, 60%, 50%)",
    bear: "hsl(0, 70%, 50%)",
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-8 shrink-0 items-center gap-3 border-b border-border bg-background px-3">
        <span className="text-[10px] font-medium text-foreground">{title}</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setChartType("line")}
            className={cn(
              "rounded p-1 transition-colors",
              chartType === "line" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            aria-label="Line chart"
          >
            <LineChartIcon className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={cn(
              "rounded p-1 transition-colors",
              chartType === "bar" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            aria-label="Bar chart"
          >
            <BarChart3 className="h-3 w-3" />
          </button>
          <span className="h-3 w-px bg-border" />
          <button
            type="button"
            onClick={() => setShowTable(!showTable)}
            className={cn(
              "rounded p-1 transition-colors",
              showTable ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            aria-label="Toggle data table"
          >
            <Table2 className="h-3 w-3" />
          </button>
          <span className="h-3 w-px bg-border" />
          <button type="button" className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground">
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      {/* Chart area */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-6">
          {/* Chart */}
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="x"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    label={{ value: xLabel, position: "insideBottom", offset: -5, fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Line type="monotone" dataKey="bull" stroke={chartColors.bull} strokeWidth={2} dot={{ r: 3 }} name="Bull Case" />
                  <Line type="monotone" dataKey="base" stroke={chartColors.base} strokeWidth={2} dot={{ r: 3 }} name="Base Case" />
                  <Line type="monotone" dataKey="bear" stroke={chartColors.bear} strokeWidth={2} dot={{ r: 3 }} name="Bear Case" />
                </LineChart>
              ) : (
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="x"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Bar dataKey="bull" fill={chartColors.bull} name="Bull Case" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="base" fill={chartColors.base} name="Base Case" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="bear" fill={chartColors.bear} name="Bear Case" radius={[2, 2, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Data table */}
          {showTable && (
            <div className="rounded border border-border">
              <table className="w-full border-collapse font-mono text-[11px]">
                <thead>
                  <tr>
                    <th className="border-b border-r border-border bg-accent/50 px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {xLabel}
                    </th>
                    <th className="border-b border-r border-border bg-accent/50 px-3 py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-positive">
                      Bull
                    </th>
                    <th className="border-b border-r border-border bg-accent/50 px-3 py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                      Base
                    </th>
                    <th className="border-b border-border bg-accent/50 px-3 py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-negative">
                      Bear
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-accent/20 transition-colors">
                      <td className="border-b border-r border-border px-3 py-1.5 text-muted-foreground">{row.x}</td>
                      <td className="border-b border-r border-border px-3 py-1.5 text-right tabular-nums text-foreground">{row.bull.toLocaleString()}</td>
                      <td className="border-b border-r border-border px-3 py-1.5 text-right tabular-nums text-foreground">{row.base.toLocaleString()}</td>
                      <td className="border-b border-border px-3 py-1.5 text-right tabular-nums text-foreground">{row.bear.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
