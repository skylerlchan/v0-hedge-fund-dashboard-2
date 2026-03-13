"use client"

import React, { useState } from "react"
import {
  Bot,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  PanelLeftClose,
  PanelLeft,
  MessageSquare,
  ChevronRight,
  X,
  Eye,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HumanInputAlert {
  id: string
  priority: "critical" | "high" | "medium"
  agent: string
  question: string
  context: string
  time: string
  actions?: string[]
}

interface AIAgent {
  id: string
  name: string
  status: "running" | "waiting_input" | "idle"
  lastUpdate: string
  description?: string
  waitingFor?: string
}

interface ChatFolder {
  id: string
  name: string
  icon: string
  chats: Chat[]
}

interface Chat {
  id: string
  title: string
  preview: string
  timestamp: string
  unread?: boolean
}

const alertsNeedingInput: HumanInputAlert[] = [
  {
    id: "1",
    priority: "critical",
    agent: "Portfolio Monitor",
    question: "Tech exposure at 42% exceeds 38% limit",
    context: "NVDA +3.2% pre-market pushed tech allocation over limit. 3 rebalancing scenarios ready.",
    time: "2m ago",
    actions: ["View Scenarios", "Dismiss", "Snooze 1h"],
  },
  {
    id: "2",
    priority: "high",
    agent: "Research Agent",
    question: "LLY NASH trial data released - position sizing?",
    context: "Positive results. Stock up 4.1%. Current position 2.3%. Analysis complete.",
    time: "1h ago",
    actions: ["Review Analysis", "Hold Size", "Increase"],
  },
]

const activeAgents: AIAgent[] = [
  {
    id: "1",
    name: "Portfolio Monitor",
    status: "waiting_input",
    lastUpdate: "2m ago",
    description: "Waiting for rebalancing decision",
    waitingFor: "Tech exposure decision",
  },
  {
    id: "2",
    name: "News Scanner",
    status: "running",
    lastUpdate: "5s ago",
    description: "Monitoring 12 positions",
  },
  {
    id: "3",
    name: "Research Agent",
    status: "waiting_input",
    lastUpdate: "1h ago",
    waitingFor: "LLY position sizing",
  },
]

const recentChats: Chat[] = [
  {
    id: "1",
    title: "Tech Rebalancing",
    preview: "3 scenarios for reducing exposure...",
    timestamp: "7:05 AM",
    unread: true,
  },
  {
    id: "2",
    title: "LLY Position Sizing",
    preview: "NASH trial analysis complete...",
    timestamp: "6:30 AM",
    unread: true,
  },
  {
    id: "3",
    title: "NVDA Deep Dive",
    preview: "Datacenter revenue breakdown...",
    timestamp: "Yesterday",
  },
  {
    id: "4",
    title: "Healthcare Rotation",
    preview: "Sector rotation signals...",
    timestamp: "Mar 11",
  },
  {
    id: "5",
    title: "Beta Analysis",
    preview: "Portfolio beta and drawdown...",
    timestamp: "Mar 10",
  },
]

function HumanInputCard({ alert }: { alert: HumanInputAlert }) {
  const priorityConfig = {
    critical: { color: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-500/10", borderColor: "border-red-500/30" },
    high: { color: "bg-orange-500", textColor: "text-orange-600", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30" },
    medium: { color: "bg-yellow-500", textColor: "text-yellow-600", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30" },
  }
  const config = priorityConfig[alert.priority]

  return (
    <div className={cn("flex w-full flex-col gap-2 rounded-lg border p-3", config.borderColor, config.bgColor)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <AlertCircle className={cn("h-4 w-4 shrink-0 mt-0.5", config.textColor)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-[10px] font-medium uppercase tracking-wider", config.textColor)}>
                {alert.agent}
              </span>
              <span className="text-[10px] text-muted-foreground">• {alert.time}</span>
            </div>
            <p className="text-xs font-semibold text-foreground mb-1">
              {alert.question}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {alert.context}
            </p>
          </div>
        </div>
      </div>
      {alert.actions && alert.actions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {alert.actions.map((action, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                i === 0
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "border border-border bg-background hover:bg-accent"
              )}
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function AgentCard({ agent }: { agent: AIAgent }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-card p-2.5 text-left">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
        {agent.status === "running" ? (
          <Loader2 className="h-4 w-4 animate-spin text-green-500" />
        ) : agent.status === "waiting_input" ? (
          <Clock className="h-4 w-4 text-orange-500" />
        ) : (
          <Bot className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-foreground truncate">{agent.name}</span>
          <span className="text-[10px] text-muted-foreground shrink-0">{agent.lastUpdate}</span>
        </div>
        {agent.status === "waiting_input" && agent.waitingFor ? (
          <p className="text-[10px] text-orange-600 truncate mt-0.5 font-medium">
            ⏸ {agent.waitingFor}
          </p>
        ) : agent.description ? (
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
            {agent.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function ChatItem({ chat, onClick }: { chat: Chat; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-foreground truncate group-hover:text-foreground">
            {chat.title}
          </span>
          {chat.unread && (
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
          {chat.preview}
        </p>
      </div>
      <span className="text-[9px] text-muted-foreground/60 shrink-0 mt-0.5">
        {chat.timestamp}
      </span>
    </button>
  )
}

export function PortfolioHub({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean
  onToggle: () => void
}) {
  const [showAutomations, setShowAutomations] = useState(false)
  const hasAlerts = alertsNeedingInput.length > 0

  if (isCollapsed) {
    return (
      <div className="flex h-full w-10 flex-col items-center border-r border-border bg-background py-2 gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Expand panel"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        {hasAlerts && (
          <div className="relative">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <div className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
              {alertsNeedingInput.length}
            </div>
          </div>
        )}
        <div className="flex-1" />
        <div className="relative">
          <Bot className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-green-500 border border-background" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Claude
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Collapse panel"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Hero: Start Chat Button */}
      <div className="p-3 border-b border-border">
        <button
          type="button"
          className="group relative flex w-full items-center justify-between overflow-hidden rounded-lg border border-border bg-card px-4 py-3 transition-all hover:bg-accent active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2 w-2 items-center justify-center">
              <div className="absolute h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div className="absolute h-2 w-2 rounded-full bg-green-500/30 animate-ping" />
            </div>
            <span className="text-sm font-medium text-foreground">Start Chat</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-3">
          {/* Human Input Needed - Most Prominent */}
          {hasAlerts && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
                    Needs Your Input
                  </h3>
                  <Badge className="h-4 px-1.5 text-[10px] font-medium bg-red-500 text-white">
                    {alertsNeedingInput.length}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {alertsNeedingInput.map((alert) => (
                  <HumanInputCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          )}

          {/* Chat History - Flat */}
          <div>
            <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Chat History
            </h3>
            <div className="flex flex-col">
              {recentChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
            </div>
          </div>

          {/* Automations - Collapsible */}
          <div>
            <button
              type="button"
              onClick={() => setShowAutomations(!showAutomations)}
              className="mb-2 flex w-full items-center justify-between hover:opacity-70 transition-opacity"
            >
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Automations
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-muted-foreground">
                    {activeAgents.filter(a => a.status === "running").length}/{activeAgents.length}
                  </span>
                </div>
                <ChevronRight
                  className={cn(
                    "h-3 w-3 text-muted-foreground transition-transform",
                    showAutomations && "rotate-90"
                  )}
                />
              </div>
            </button>
            {showAutomations && (
              <div className="flex flex-col gap-1.5">
                {activeAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
