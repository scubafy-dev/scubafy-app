"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

// Monthly financial data for charts
const monthlyData = [
  { name: "Jan", revenue: 18500, expenses: 10200, profit: 8300 },
  { name: "Feb", revenue: 20100, expenses: 11000, profit: 9100 },
  { name: "Mar", revenue: 24850, expenses: 12430, profit: 12420 },
  { name: "Apr", revenue: 26000, expenses: 13000, profit: 13000 },
  { name: "May", revenue: 28500, expenses: 14200, profit: 14300 },
  { name: "Jun", revenue: 32000, expenses: 15500, profit: 16500 },
]

// Revenue forecast data
const forecastData = [
  { name: "Jul", actual: 0, forecast: 34000 },
  { name: "Aug", actual: 0, forecast: 38000 },
  { name: "Sep", actual: 0, forecast: 36000 },
  { name: "Oct", actual: 0, forecast: 32000 },
  { name: "Nov", actual: 0, forecast: 28000 },
  { name: "Dec", actual: 0, forecast: 30000 },
]

// Equipment rental revenue data
const rentalRevenueData = [
  { name: "Tanks", value: 1800 },
  { name: "BCDs", value: 1200 },
  { name: "Regulators", value: 950 },
  { name: "Wetsuits", value: 850 },
  { name: "Other", value: 400 },
]

// Revenue by category data
const revenueByCategory = [
  { category: "Dive Trips", value: 12500 },
  { category: "Equipment Rentals", value: 5200 },
  { category: "Training Courses", value: 4800 },
  { category: "Equipment Sales", value: 2350 },
]

// Expenses by category data
const expensesByCategory = [
  { category: "Staff Salaries", value: 6500 },
  { category: "Equipment Maintenance", value: 2100 },
  { category: "Boat Operations", value: 1800 },
  { category: "Utilities", value: 1200 },
  { category: "Marketing", value: 830 },
]

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function FinancialTrendsChart() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [animationActive, setAnimationActive] = useState(true)

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Financial Trends</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Monthly revenue, expenses, and profit trends</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Monthly revenue, expenses, and profit for the past 6 months</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#0088FE"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Revenue"
              isAnimationActive={animationActive}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#FF8042"
              strokeWidth={2}
              name="Expenses"
              isAnimationActive={animationActive}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#00C49F"
              strokeWidth={2}
              name="Profit"
              isAnimationActive={animationActive}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function RevenueForecastChart() {
  const [animationActive, setAnimationActive] = useState(true)

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const combinedData = [...monthlyData.slice(-3), ...forecastData]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Forecast</CardTitle>
        <CardDescription>Projected revenue for the next 6 months</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={combinedData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0088FE"
              fill="#0088FE"
              fillOpacity={0.8}
              name="Actual Revenue"
              isAnimationActive={animationActive}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.5}
              name="Forecast Revenue"
              isAnimationActive={animationActive}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function EquipmentRentalChart() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [animationActive, setAnimationActive] = useState(true)

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Rental Revenue</CardTitle>
        <CardDescription>Revenue breakdown by equipment type</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rentalRevenueData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              isAnimationActive={animationActive}
            >
              {rentalRevenueData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={activeIndex === index ? "#fff" : undefined}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function RevenueDistributionChart() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [animationActive, setAnimationActive] = useState(true)

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Distribution</CardTitle>
        <CardDescription>Revenue breakdown by category</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={revenueByCategory}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="category"
              label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              isAnimationActive={animationActive}
            >
              {revenueByCategory.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={activeIndex === index ? "#fff" : undefined}
                  strokeWidth={activeIndex === index ? 2 : 0}
                />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function ExpenseDistributionChart() {
  const [animationActive, setAnimationActive] = useState(true)

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Expense breakdown by category</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={expensesByCategory}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 80,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" />
            <RechartsTooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar dataKey="value" name="Amount" isAnimationActive={animationActive}>
              {expensesByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

