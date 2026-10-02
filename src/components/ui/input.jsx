import * as React from "react"

import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const fieldClass =
  "w-full rounded-lg border border-input bg-white px-3.5 text-[15px] text-ink transition-colors placeholder:text-neutral-400 hover:border-neutral-400 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive"

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input type={type} className={cn(fieldClass, "h-11 file:mr-3 file:rounded-full file:border-0 file:bg-surface file:px-3 file:py-1 file:text-sm file:font-medium", className)} ref={ref} {...props} />
))
Input.displayName = "Input"

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea className={cn(fieldClass, "min-h-[120px] py-3", className)} ref={ref} {...props} />
))
Textarea.displayName = "Textarea"

// `wrapperClassName` sizes the control (width, flex); `className` styles the select itself.
const NativeSelect = React.forwardRef(({ className, wrapperClassName, children, ...props }, ref) => (
  <span className={cn("relative block", wrapperClassName)}>
    <select className={cn(fieldClass, "h-11 cursor-pointer appearance-none pr-10", className)} ref={ref} {...props}>
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" aria-hidden />
  </span>
))
NativeSelect.displayName = "NativeSelect"

export { Input, Textarea, NativeSelect }
