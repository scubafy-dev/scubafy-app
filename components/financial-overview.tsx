"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Calendar, FileText, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FinancialTrendsChart,
  RevenueForecastChart,
  EquipmentRentalChart,
  RevenueDistributionChart,
  ExpenseDistributionChart,
} from "@/components/financial-charts"

export function FinancialOverview() {
  const [period, setPeriod] = useState("month")

  // Sample financial data
  const financialSummary = {
    totalRevenue: "$24,850.00",
    totalExpenses: "$12,430.00",
    netProfit: "$12,420.00",
    profitMargin: "49.98%",
    revenueChange: "+15.3%",
    expenseChange: "+8.2%",
    profitChange: "+22.5%",
  }

  const revenueByCategory = [
    { category: "Dive Trips", amount: "$12,500.00", percentage: "50.3%", value: 12500 },
    { category: "Equipment Rentals", amount: "$5,200.00", percentage: "20.9%", value: 5200 },
    { category: "Training Courses", amount: "$4,800.00", percentage: "19.3%", value: 4800 },
    { category: "Equipment Sales", amount: "$2,350.00", percentage: "9.5%", value: 2350 },
  ]

  const expensesByCategory = [
    { category: "Staff Salaries", amount: "$6,500.00", percentage: "52.3%", value: 6500 },
    { category: "Equipment Maintenance", amount: "$2,100.00", percentage: "16.9%", value: 2100 },
    { category: "Boat Operations", amount: "$1,800.00", percentage: "14.5%", value: 1800 },
    { category: "Utilities", amount: "$1,200.00", percentage: "9.7%", value: 1200 },
    { category: "Marketing", amount: "$830.00", percentage: "6.7%", value: 830 },
  ]

  const recentTransactions = [
    {
      id: "T-1001",
      date: "2025-03-22",
      description: "Coral Reef Dive Trip - 8 participants",
      amount: "$960.00",
      type: "income",
    },
    {
      id: "T-1002",
      date: "2025-03-21",
      description: "Equipment Maintenance - Regulator Service",
      amount: "$350.00",
      type: "expense",
    },
    {
      id: "T-1003",
      date: "2025-03-20",
      description: "Advanced Open Water Course - 3 students",
      amount: "$1,200.00",
      type: "income",
    },
    {
      id: "T-1004",
      date: "2025-03-19",
      description: "Boat Fuel",
      amount: "$280.00",
      type: "expense",
    },
    {
      id: "T-1005",
      date: "2025-03-18",
      description: "Equipment Rental - Full Set (2 days)",
      amount: "$180.00",
      type: "income",
    },
    {
      id: "T-1006",
      date: "2025-03-17",
      description: "Staff Wages - Weekly",
      amount: "$1,500.00",
      type: "expense",
    },
    {
      id: "T-1007",
      date: "2025-03-16",
      description: "Night Dive Trip - 6 participants",
      amount: "$720.00",
      type: "income",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.totalRevenue}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">{financialSummary.revenueChange}</span>
              <span className="ml-1">from previous {period}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.totalExpenses}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-amber-500" />
              <span className="text-amber-500 font-medium">{financialSummary.expenseChange}</span>
              <span className="ml-1">from previous {period}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.netProfit}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">{financialSummary.profitChange}</span>
              <span className="ml-1">from previous {period}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.profitMargin}</div>
            <p className="text-xs text-muted-foreground">Healthy profit margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Trends Chart */}
      <FinancialTrendsChart />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Forecast Chart */}
        <RevenueForecastChart />

        {/* Equipment Rental Revenue */}
        <EquipmentRentalChart />
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
          <TabsTrigger value="charts">Category Charts</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Breakdown of revenue sources for this {period}.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByCategory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{item.percentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Breakdown of expense categories for this {period}.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensesByCategory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{item.percentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts">
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueDistributionChart />
            <ExpenseDistributionChart />
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Most recent financial transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.type === "income" ? "default" : "outline"}
                          className={transaction.type === "expense" ? "border-amber-500 text-amber-500" : ""}
                        >
                          {transaction.type === "income" ? "Income" : "Expense"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

