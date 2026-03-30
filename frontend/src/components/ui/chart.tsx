import * as React from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full h-[350px] flex items-center justify-center",
      className
    )}
    {...props}
  />
))
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactElement
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("w-full h-full", className)} {...props}>
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
))
Chart.displayName = "Chart"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartTooltip = (props: any) => (
  <Tooltip
    contentStyle={{
      backgroundColor: "hsl(var(--background))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "6px",
    }}
    labelStyle={{
      color: "hsl(var(--foreground))",
    }}
    itemStyle={{
      color: "hsl(var(--foreground))",
    }}
    {...props}
  />
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartGrid = (props: any) => (
  <CartesianGrid
    strokeDasharray="3 3"
    className={cn("stroke-muted", props.className)}
    {...props}
  />
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartXAxis = (props: any) => (
  <XAxis
    className={cn("text-muted-foreground", props.className)}
    tick={{ fill: "hsl(var(--muted-foreground))" }}
    {...props}
  />
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartYAxis = (props: any) => (
  <YAxis
    className={cn("text-muted-foreground", props.className)}
    tick={{ fill: "hsl(var(--muted-foreground))" }}
    {...props}
  />
)

export {
  Chart,
  ChartContainer,
  ChartGrid,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
}
