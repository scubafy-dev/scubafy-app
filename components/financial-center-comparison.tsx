"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, BarChart3, PieChart, Target, ArrowUp, ArrowDown, Battery, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RPieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"
import { diveCenters } from "@/lib/dive-center-data"
import { financialByCenter } from "@/lib/mock-data/financial-data"
import { financesByCenter } from "@/lib/mock-data/finances"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

// Type assertions for the financesByCenter object
type CenterId = "dauin" | "malapascua" | "siquijor" | "sipalay";

export function FinancialCenterComparison() {
  // Prepare revenue comparison data
  const revenueComparisonData = diveCenters.map(center => ({
    name: center.name.replace('Sea Explorers ', ''),
    revenue: financesByCenter[center.id as CenterId].revenue.annual,
    expenses: financesByCenter[center.id as CenterId].expenses.annual,
    profit: financesByCenter[center.id as CenterId].profit.annual,
    profitMargin: Math.round((financesByCenter[center.id as CenterId].profit.annual / financesByCenter[center.id as CenterId].revenue.annual) * 100),
    revenueChange: center.stats.revenueChange
  }))

  // Prepare contribution data for pie chart
  const revenuePieData = diveCenters.map((center, index) => ({
    name: center.name.replace('Sea Explorers ', ''),
    value: financesByCenter[center.id as CenterId].revenue.annual,
    color: COLORS[index % COLORS.length]
  }))

  // Calculate total business revenue
  const totalRevenue = revenuePieData.reduce((sum, item) => sum + item.value, 0)

  // Prepare revenue by category data
  const categoryData = [
    { name: "Dive Trips", value: 0 },
    { name: "Equipment Rentals", value: 0 },
    { name: "Training Courses", value: 0 },
    { name: "Equipment Sales", value: 0 }
  ]

  // Sum up all center revenues by category
  diveCenters.forEach(center => {
    categoryData[0].value += financesByCenter[center.id as CenterId].revenue.categories.divingServices
    categoryData[1].value += financesByCenter[center.id as CenterId].revenue.categories.equipment
    categoryData[2].value += financesByCenter[center.id as CenterId].revenue.categories.courses
    categoryData[3].value += financesByCenter[center.id as CenterId].revenue.categories.retail
  })

  // Generate monthly trend data from the financial-charts data
  const generateMonthlyCombinedData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => {
      const dataPoint = { 
        name: month,
        Dauin: 0,
        Malapascua: 0,
        Siquijor: 0,
        Sipalay: 0,
      }
      
      // In a real app, we would fetch this data from the API
      // For now, use simple increasing values
      if (month === 'Jan') {
        dataPoint.Dauin = 18500
        dataPoint.Malapascua = 22500
        dataPoint.Siquijor = 13200
        dataPoint.Sipalay = 15800
      } else if (month === 'Feb') {
        dataPoint.Dauin = 20100
        dataPoint.Malapascua = 24600
        dataPoint.Siquijor = 14500
        dataPoint.Sipalay = 17300
      } else if (month === 'Mar') {
        dataPoint.Dauin = 24850
        dataPoint.Malapascua = 31250
        dataPoint.Siquijor = 18350
        dataPoint.Sipalay = 21450
      } else if (month === 'Apr') {
        dataPoint.Dauin = 26000
        dataPoint.Malapascua = 32800
        dataPoint.Siquijor = 19800
        dataPoint.Sipalay = 23200
      } else if (month === 'May') {
        dataPoint.Dauin = 28500
        dataPoint.Malapascua = 35200
        dataPoint.Siquijor = 21200
        dataPoint.Sipalay = 25100
      } else {
        dataPoint.Dauin = 32000
        dataPoint.Malapascua = 38500
        dataPoint.Siquijor = 23500
        dataPoint.Sipalay = 27800
      }
      
      return dataPoint
    })
  }

  // Generate expense distribution data
  const generateExpenseDistribution = () => {
    const categories = [
      { category: 'Staff', value: 0 },
      { category: 'Equipment', value: 0 },
      { category: 'Operations', value: 0 },
      { category: 'Marketing', value: 0 },
      { category: 'Utilities', value: 0 }
    ]
    
    diveCenters.forEach(center => {
      const finances = financesByCenter[center.id as CenterId]
      categories[0].value += finances.expenses.categories.staff
      categories[1].value += finances.expenses.categories.equipment + finances.expenses.categories.maintenance
      categories[2].value += 10700 // Boat operations - hardcoded for now
      categories[3].value += finances.expenses.categories.marketing
      categories[4].value += finances.expenses.categories.utilities
    })
    
    return categories
  }

  // Calculate forecasts and KPIs
  const calculateKPIs = () => {
    // Get total revenue, expense, profit
    const totalExpense = revenueComparisonData.reduce((sum, center) => sum + center.expenses, 0)
    const totalProfit = revenueComparisonData.reduce((sum, center) => sum + center.profit, 0)
    
    // Calculate average profit margin
    const avgProfitMargin = Math.round((totalProfit / totalRevenue) * 100)
    
    // Find best and worst performing centers
    const bestCenter = [...revenueComparisonData].sort((a, b) => b.profitMargin - a.profitMargin)[0]
    const worstCenter = [...revenueComparisonData].sort((a, b) => a.profitMargin - b.profitMargin)[0]
    
    // Calculate year-end forecast (simple projection: current * 2)
    const yearEndForecast = totalRevenue * 2
    
    // Return all KPI metrics
    return {
      avgProfitMargin,
      bestCenter,
      worstCenter,
      yearEndForecast,
      totalRevenue,
      totalExpense,
      totalProfit,
      revenuePerCustomer: Math.round(totalRevenue / 360) // Assuming 360 total customers
    }
  }

  const kpis = calculateKPIs()
  const monthlyTrendData = generateMonthlyCombinedData()
  const expenseDistribution = generateExpenseDistribution()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dive Center Financial Comparison</h2>
      
      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="mr-2 h-4 w-4 text-blue-500" />
              Best Performing Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{kpis.bestCenter.name}</div>
            <div className="flex items-center text-xs text-blue-600">
              <span>{kpis.bestCenter.profitMargin}% profit margin</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
              Needs Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{kpis.worstCenter.name}</div>
            <div className="flex items-center text-xs text-amber-600">
              <span>{kpis.worstCenter.profitMargin}% profit margin</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Year-End Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">${kpis.yearEndForecast.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>+{Math.round((kpis.yearEndForecast / kpis.totalRevenue - 1) * 100)}% growth</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-purple-500" />
              Revenue Per Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">${kpis.revenuePerCustomer}</div>
            <div className="flex items-center text-xs text-purple-600">
              <span>Average per customer</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Revenue Comparison</TabsTrigger>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Revenue Comparison
                </CardTitle>
                <CardDescription>Revenue, expenses and profit by dive center</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                    <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
                    <Bar dataKey="profit" name="Profit" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Revenue Contribution
                </CardTitle>
                <CardDescription>Percentage of total business revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <RPieChart>
                      <Pie
                        data={revenuePieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        dataKey="value"
                      >
                        {revenuePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => `$${value.toLocaleString()} (${((value/totalRevenue)*100).toFixed(1)}%)`}
                      />
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for each dive center</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dive Center</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Profit Margin</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Health</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueComparisonData.map((center, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{center.name}</TableCell>
                      <TableCell>${center.revenue.toLocaleString()}</TableCell>
                      <TableCell>${center.expenses.toLocaleString()}</TableCell>
                      <TableCell>${center.profit.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={center.profitMargin} className="w-20" />
                          <span>{center.profitMargin}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center text-green-500">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          +{center.revenueChange}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          center.profitMargin > 40 ? "bg-green-500" : 
                          center.profitMargin > 30 ? "bg-blue-500" : 
                          center.profitMargin > 20 ? "bg-amber-500" : "bg-red-500"
                        }>
                          {center.profitMargin > 40 ? "Excellent" : 
                           center.profitMargin > 30 ? "Good" : 
                           center.profitMargin > 20 ? "Fair" : "Poor"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trends</CardTitle>
              <CardDescription>Revenue comparison across centers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="Dauin" stroke="#0088FE" strokeWidth={2} />
                  <Line type="monotone" dataKey="Malapascua" stroke="#00C49F" strokeWidth={2} />
                  <Line type="monotone" dataKey="Siquijor" stroke="#FFBB28" strokeWidth={2} />
                  <Line type="monotone" dataKey="Sipalay" stroke="#FF8042" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Performance</CardTitle>
                <CardDescription>Quarter-over-quarter growth analysis</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Q1 to Q2 Growth</span>
                        <Badge variant="outline" className="bg-green-50">+18.3%</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">Jan-Mar vs Apr-Jun</span>
                    </div>
                    <Progress value={18.3} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Q2 Forecast</span>
                        <Badge variant="outline" className="bg-blue-50">+15.7%</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">Jul-Sep Projection</span>
                    </div>
                    <Progress value={15.7} className="h-2" />
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Center</TableHead>
                        <TableHead>Q1 Revenue</TableHead>
                        <TableHead>Q2 Revenue</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Dauin</TableCell>
                        <TableCell>$63,450</TableCell>
                        <TableCell>$86,500</TableCell>
                        <TableCell className="text-green-500">+36.3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Malapascua</TableCell>
                        <TableCell>$78,350</TableCell>
                        <TableCell>$106,500</TableCell>
                        <TableCell className="text-green-500">+35.9%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Siquijor</TableCell>
                        <TableCell>$46,050</TableCell>
                        <TableCell>$64,500</TableCell>
                        <TableCell className="text-green-500">+40.1%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sipalay</TableCell>
                        <TableCell>$54,550</TableCell>
                        <TableCell>$76,100</TableCell>
                        <TableCell className="text-green-500">+39.5%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>Projected revenue for next 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={270}>
                  <LineChart
                    data={[
                      { name: "Jul", actual: 0, forecast: 128300 },
                      { name: "Aug", actual: 0, forecast: 140000 },
                      { name: "Sep", actual: 0, forecast: 132700 },
                      { name: "Oct", actual: 0, forecast: 121000 },
                      { name: "Nov", actual: 0, forecast: 110500 },
                      { name: "Dec", actual: 0, forecast: 117800 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Distribution of revenue sources across all centers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <Bar dataKey="value" name="Amount" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>Major expense categories across all centers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      nameKey="category"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Profitability Analysis</CardTitle>
              <CardDescription>Comparative profitability metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {diveCenters.map((center, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{center.name.replace('Sea Explorers ', '')}</span>
                      <span>
                        ${financesByCenter[center.id as CenterId].profit.annual.toLocaleString()}
                        <span className="text-muted-foreground text-xs ml-2">
                          ({Math.round((financesByCenter[center.id as CenterId].profit.annual / financesByCenter[center.id as CenterId].revenue.annual) * 100)}%)
                        </span>
                      </span>
                    </div>
                    <Progress 
                      value={(financesByCenter[center.id as CenterId].profit.annual / financesByCenter[center.id as CenterId].revenue.annual) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Expense Efficiency Analysis</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Center</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Operations</TableHead>
                      <TableHead>Marketing</TableHead>
                      <TableHead>Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diveCenters.map((center, index) => {
                      const expenses = financesByCenter[center.id as CenterId].expenses;
                      const totalExpenses = expenses.annual;
                      const staffPct = Math.round((expenses.categories.staff / totalExpenses) * 100);
                      const equipPct = Math.round(((expenses.categories.equipment + expenses.categories.maintenance) / totalExpenses) * 100);
                      const opsPct = Math.round((10700 / totalExpenses) * 100); // Boat operations - hardcoded
                      const marketingPct = Math.round((expenses.categories.marketing / totalExpenses) * 100);
                      
                      // Efficiency score calculation (lower % on non-essential expenses is better)
                      const efficiencyScore = 100 - (equipPct + marketingPct) / 2;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>{center.name.replace('Sea Explorers ', '')}</TableCell>
                          <TableCell>{staffPct}%</TableCell>
                          <TableCell>{equipPct}%</TableCell>
                          <TableCell>{opsPct}%</TableCell>
                          <TableCell>{marketingPct}%</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={efficiencyScore} className="w-16" />
                              <Badge className={
                                efficiencyScore > 85 ? "bg-green-500" : 
                                efficiencyScore > 75 ? "bg-blue-500" : 
                                efficiencyScore > 65 ? "bg-amber-500" : "bg-red-500"
                              }>
                                {efficiencyScore}%
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 