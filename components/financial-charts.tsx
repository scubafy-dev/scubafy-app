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
import { RevenueCategory, ExpenseCategory } from "@/lib/mock-data/financial-data"
import { useDiveCenter } from "@/lib/dive-center-context"
import { financialByCenter, allCentersFinancialData } from "@/lib/mock-data/financial-data"

// Define types for chart data
type MonthlyDataPoint = {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
}

type ForecastDataPoint = {
  name: string;
  actual: number;
  forecast: number;
}

type RentalDataPoint = {
  name: string;
  value: number;
}

type CenterData = {
  dauin: MonthlyDataPoint[];
  malapascua: MonthlyDataPoint[];
  siquijor: MonthlyDataPoint[];
  sipalay: MonthlyDataPoint[];
  all: MonthlyDataPoint[];
}

type CenterForecastData = {
  dauin: ForecastDataPoint[];
  malapascua: ForecastDataPoint[];
  siquijor: ForecastDataPoint[];
  sipalay: ForecastDataPoint[];
  all: ForecastDataPoint[];
}

type CenterRentalData = {
  dauin: RentalDataPoint[];
  malapascua: RentalDataPoint[];
  siquijor: RentalDataPoint[];
  sipalay: RentalDataPoint[];
  all: RentalDataPoint[];
}

// Monthly financial data for each center - in a real app this would come from the backend
const monthlyDataByCenter: CenterData = {
  dauin: [
    { name: "Jan", revenue: 18500, expenses: 10200, profit: 8300 },
    { name: "Feb", revenue: 20100, expenses: 11000, profit: 9100 },
    { name: "Mar", revenue: 24850, expenses: 12430, profit: 12420 },
    { name: "Apr", revenue: 26000, expenses: 13000, profit: 13000 },
    { name: "May", revenue: 28500, expenses: 14200, profit: 14300 },
    { name: "Jun", revenue: 32000, expenses: 15500, profit: 16500 },
  ],
  malapascua: [
    { name: "Jan", revenue: 22500, expenses: 12800, profit: 9700 },
    { name: "Feb", revenue: 24600, expenses: 13500, profit: 11100 },
    { name: "Mar", revenue: 31250, expenses: 17830, profit: 13420 },
    { name: "Apr", revenue: 32800, expenses: 18500, profit: 14300 },
    { name: "May", revenue: 35200, expenses: 19800, profit: 15400 },
    { name: "Jun", revenue: 38500, expenses: 21200, profit: 17300 },
  ],
  siquijor: [
    { name: "Jan", revenue: 13200, expenses: 7400, profit: 5800 },
    { name: "Feb", revenue: 14500, expenses: 8100, profit: 6400 },
    { name: "Mar", revenue: 18350, expenses: 10230, profit: 8120 },
    { name: "Apr", revenue: 19800, expenses: 11000, profit: 8800 },
    { name: "May", revenue: 21200, expenses: 11800, profit: 9400 },
    { name: "Jun", revenue: 23500, expenses: 13000, profit: 10500 },
  ],
  sipalay: [
    { name: "Jan", revenue: 15800, expenses: 10100, profit: 5700 },
    { name: "Feb", revenue: 17300, expenses: 11200, profit: 6100 },
    { name: "Mar", revenue: 21450, expenses: 13830, profit: 7620 },
    { name: "Apr", revenue: 23200, expenses: 14900, profit: 8300 },
    { name: "May", revenue: 25100, expenses: 16100, profit: 9000 },
    { name: "Jun", revenue: 27800, expenses: 17800, profit: 10000 },
  ],
  all: [
    { name: "Jan", revenue: 70000, expenses: 40500, profit: 29500 },
    { name: "Feb", revenue: 76500, expenses: 43800, profit: 32700 },
    { name: "Mar", revenue: 95900, expenses: 54320, profit: 41580 },
    { name: "Apr", revenue: 101800, expenses: 57400, profit: 44400 },
    { name: "May", revenue: 110000, expenses: 61900, profit: 48100 },
    { name: "Jun", revenue: 121800, expenses: 67500, profit: 54300 },
  ]
};

// Revenue forecast data for each center
const forecastDataByCenter: CenterForecastData = {
  dauin: [
    { name: "Jul", actual: 0, forecast: 34000 },
    { name: "Aug", actual: 0, forecast: 38000 },
    { name: "Sep", actual: 0, forecast: 36000 },
    { name: "Oct", actual: 0, forecast: 32000 },
    { name: "Nov", actual: 0, forecast: 28000 },
    { name: "Dec", actual: 0, forecast: 30000 },
  ],
  malapascua: [
    { name: "Jul", actual: 0, forecast: 40000 },
    { name: "Aug", actual: 0, forecast: 43500 },
    { name: "Sep", actual: 0, forecast: 41000 },
    { name: "Oct", actual: 0, forecast: 38000 },
    { name: "Nov", actual: 0, forecast: 35000 },
    { name: "Dec", actual: 0, forecast: 37500 },
  ],
  siquijor: [
    { name: "Jul", actual: 0, forecast: 24800 },
    { name: "Aug", actual: 0, forecast: 26500 },
    { name: "Sep", actual: 0, forecast: 25200 },
    { name: "Oct", actual: 0, forecast: 23000 },
    { name: "Nov", actual: 0, forecast: 21500 },
    { name: "Dec", actual: 0, forecast: 22800 },
  ],
  sipalay: [
    { name: "Jul", actual: 0, forecast: 29500 },
    { name: "Aug", actual: 0, forecast: 32000 },
    { name: "Sep", actual: 0, forecast: 30500 },
    { name: "Oct", actual: 0, forecast: 28000 },
    { name: "Nov", actual: 0, forecast: 26000 },
    { name: "Dec", actual: 0, forecast: 27500 },
  ],
  all: [
    { name: "Jul", actual: 0, forecast: 128300 },
    { name: "Aug", actual: 0, forecast: 140000 },
    { name: "Sep", actual: 0, forecast: 132700 },
    { name: "Oct", actual: 0, forecast: 121000 },
    { name: "Nov", actual: 0, forecast: 110500 },
    { name: "Dec", actual: 0, forecast: 117800 },
  ]
};

// Equipment rental revenue data by center
const rentalRevenueDataByCenter: CenterRentalData = {
  dauin: [
    { name: "Tanks", value: 1800 },
    { name: "BCDs", value: 1200 },
    { name: "Regulators", value: 950 },
    { name: "Wetsuits", value: 850 },
    { name: "Other", value: 400 },
  ],
  malapascua: [
    { name: "Tanks", value: 1500 },
    { name: "BCDs", value: 900 },
    { name: "Regulators", value: 750 },
    { name: "Wetsuits", value: 650 },
    { name: "Other", value: 400 },
  ],
  siquijor: [
    { name: "Tanks", value: 1200 },
    { name: "BCDs", value: 850 },
    { name: "Regulators", value: 650 },
    { name: "Wetsuits", value: 550 },
    { name: "Other", value: 350 },
  ],
  sipalay: [
    { name: "Tanks", value: 1400 },
    { name: "BCDs", value: 950 },
    { name: "Regulators", value: 750 },
    { name: "Wetsuits", value: 650 },
    { name: "Other", value: 350 },
  ],
  all: [
    { name: "Tanks", value: 5900 },
    { name: "BCDs", value: 3900 },
    { name: "Regulators", value: 3100 },
    { name: "Wetsuits", value: 2700 },
    { name: "Other", value: 1500 },
  ]
};

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function FinancialTrendsChart() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const [animationActive, setAnimationActive] = useState(true)
  const { currentCenter, isAllCenters } = useDiveCenter()
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([])

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Select the appropriate data based on center
    const centerId = isAllCenters ? 'all' : (currentCenter?.id || 'dauin')
    if (centerId === 'all' || centerId === 'dauin' || centerId === 'malapascua' || 
        centerId === 'siquijor' || centerId === 'sipalay') {
      setMonthlyData(monthlyDataByCenter[centerId])
    } else {
      setMonthlyData(monthlyDataByCenter.dauin)
    }
  }, [currentCenter, isAllCenters])

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
        <CardDescription>
          {isAllCenters 
            ? "Monthly revenue, expenses, and profit for all centers" 
            : `Monthly revenue, expenses, and profit for ${currentCenter?.name}`}
        </CardDescription>
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
  const { currentCenter, isAllCenters } = useDiveCenter()
  const [combinedData, setCombinedData] = useState<(MonthlyDataPoint | ForecastDataPoint)[]>([])

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Select the appropriate data based on center
    const centerId = isAllCenters ? 'all' : (currentCenter?.id || 'dauin')
    
    if (centerId === 'all' || centerId === 'dauin' || centerId === 'malapascua' || 
        centerId === 'siquijor' || centerId === 'sipalay') {
      const monthlyData = monthlyDataByCenter[centerId]
      const forecastData = forecastDataByCenter[centerId]
      setCombinedData([...monthlyData.slice(-3), ...forecastData])
    } else {
      setCombinedData([...monthlyDataByCenter.dauin.slice(-3), ...forecastDataByCenter.dauin])
    }
  }, [currentCenter, isAllCenters])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Forecast</CardTitle>
        <CardDescription>
          {isAllCenters 
            ? "Projected revenue for all centers" 
            : `Projected revenue for ${currentCenter?.name}`}
        </CardDescription>
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
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const [animationActive, setAnimationActive] = useState(true)
  const { currentCenter, isAllCenters } = useDiveCenter()
  const [rentalRevenueData, setRentalRevenueData] = useState<RentalDataPoint[]>([])

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Select the appropriate data based on center
    const centerId = isAllCenters ? 'all' : (currentCenter?.id || 'dauin')
    if (centerId === 'all' || centerId === 'dauin' || centerId === 'malapascua' || 
        centerId === 'siquijor' || centerId === 'sipalay') {
      setRentalRevenueData(rentalRevenueDataByCenter[centerId])
    } else {
      setRentalRevenueData(rentalRevenueDataByCenter.dauin)
    }
  }, [currentCenter, isAllCenters])

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  // Custom active shape for the pie chart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props
    
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={fill} className="text-sm font-semibold">
          ${value.toLocaleString()}
        </text>
        <Pie
          data={[{ name: payload.name, value }]}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          dataKey="value"
        />
      </g>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Rental Revenue</CardTitle>
        <CardDescription>
          {isAllCenters 
            ? "Revenue breakdown by equipment type (all centers)" 
            : `Revenue breakdown by equipment type (${currentCenter?.name})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={rentalRevenueData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              isAnimationActive={animationActive}
            >
              {rentalRevenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              formatter={(value, entry, index) => {
                if (index !== undefined && rentalRevenueData[index]) {
                  return `${value}: $${rentalRevenueData[index].value.toLocaleString()}`
                }
                return value
              }}
            />
            <RechartsTooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function RevenueDistributionChart({ data }: { data: RevenueCategory[] }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const [animationActive, setAnimationActive] = useState(true)

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => {
      setAnimationActive(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
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
              data={data}
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
              {data.map((entry, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  opacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.5
                  }
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

export function ExpenseDistributionChart({ data }: { data: ExpenseCategory[] }) {
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
            data={data}
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
              {data.map((entry, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Helper function to get a color based on index
function getColorForIndex(index: number): string {
  return COLORS[index % COLORS.length]
}

