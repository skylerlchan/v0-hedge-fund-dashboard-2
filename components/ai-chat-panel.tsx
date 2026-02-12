"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import {
  PanelRightClose,
  PanelRight,
  Send,
  Bot,
  User,
  Sparkles,
  CornerDownLeft,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Good morning. I've analyzed overnight developments and your current positions. NVDA is up 3.2% pre-market on the revenue beat. Your tech book is now 42% of gross — above the 38% limit we discussed. Want me to model rebalancing scenarios?",
    timestamp: "7:02 AM",
  },
  {
    id: "2",
    role: "user",
    content: "Yes, show me options to bring tech exposure back to 38% while maintaining the AI thesis.",
    timestamp: "7:04 AM",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Here are three rebalancing approaches:\n\n1. Trim NVDA by 180bps — reduces tech to 38.1%, preserves MSFT/GOOGL AI exposure\n2. Trim NVDA 120bps + MSFT 60bps — more balanced reduction, tech at 37.9%\n3. Rotate 200bps from NVDA into LLY — maintains gross, shifts beta from tech to healthcare\n\nOption 3 has the best risk-adjusted profile given your current healthcare underweight. The LLY NASH data also creates a near-term catalyst.",
    timestamp: "7:05 AM",
  },
  {
    id: "4",
    role: "user",
    content: "What's the impact of option 3 on portfolio beta and drawdown risk?",
    timestamp: "7:06 AM",
  },
  {
    id: "5",
    role: "assistant",
    content:
      "Option 3 analysis:\n\n• Portfolio beta: 0.74 → 0.69 (-6.8%)\n• Max drawdown (99th pctl): -8.2% → -7.4%\n• Sharpe improvement: ~0.08 based on trailing 60-day vol\n• Correlation to SPX: 0.81 → 0.76\n\nThe NVDA→LLY rotation also reduces your factor exposure to momentum crowding, which is elevated at 92nd percentile historically.",
    timestamp: "7:07 AM",
  },
]

export function AIChatPanel({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean
  onToggle: () => void
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: timeStr,
    }
    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Let me analyze that for you. I'm pulling the relevant data from your portfolio and cross-referencing with current market conditions...",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (isCollapsed) {
    return (
      <div className="flex h-full w-10 flex-col items-center border-l border-border bg-background py-2">
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Expand AI panel"
        >
          <PanelRight className="h-4 w-4" />
        </button>
        <div className="mt-3 flex flex-col items-center">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            AI Assistant
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Collapse AI panel"
        >
          <PanelRightClose className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Model indicator */}
      <div className="border-b border-border px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-positive" />
          <span className="font-mono text-[10px] text-muted-foreground">
            claude-4-opus / context: portfolio + market data
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="flex flex-col gap-1 p-3">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-3">
              <div className="mb-1 flex items-center gap-1.5">
                {msg.role === "assistant" ? (
                  <Bot className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <User className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {msg.role === "assistant" ? "Assistant" : "You"}
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  {msg.timestamp}
                </span>
              </div>
              <div
                className={cn(
                  "rounded-md px-3 py-2 text-xs leading-relaxed",
                  msg.role === "assistant"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-accent text-accent-foreground"
                )}
              >
                {msg.content.split("\n").map((line, i) => (
                  <span key={`${msg.id}-line-${i}`}>
                    {line}
                    {i < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-lg bg-secondary p-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about positions, risk, or market data..."
            className="min-h-[36px] max-h-[120px] flex-1 resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            rows={1}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex shrink-0 items-center gap-1 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-40"
          >
            <CornerDownLeft className="h-3 w-3" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/60">
            Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  )
}
