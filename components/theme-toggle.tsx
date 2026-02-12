"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Initialize from the html class on mount
    const root = document.documentElement
    const hasDark = root.classList.contains("dark")
    setIsDark(hasDark)
  }, [])

  const toggle = () => {
    const root = document.documentElement
    if (isDark) {
      root.classList.remove("dark")
      setIsDark(false)
    } else {
      root.classList.add("dark")
      setIsDark(true)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "relative flex h-6 w-11 items-center rounded-full border transition-colors",
        isDark
          ? "border-border bg-secondary"
          : "border-border bg-secondary"
      )}
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
    >
      {/* Track icons */}
      <Sun className="absolute left-1 h-3 w-3 text-muted-foreground/60" />
      <Moon className="absolute right-1 h-3 w-3 text-muted-foreground/60" />

      {/* Thumb */}
      <span
        className={cn(
          "absolute flex h-4 w-4 items-center justify-center rounded-full bg-foreground transition-transform",
          isDark ? "translate-x-[22px]" : "translate-x-[2px]"
        )}
      >
        {isDark ? (
          <Moon className="h-2.5 w-2.5 text-background" />
        ) : (
          <Sun className="h-2.5 w-2.5 text-background" />
        )}
      </span>
    </button>
  )
}
