// Financial data for each dive center

// Basic financial summary interface
export interface FinancialSummary {
  totalRevenue: string;
  totalExpenses: string;
  netProfit: string;
  profitMargin: string;
  revenueChange: string;
  expenseChange: string;
  profitChange: string;
}

// Revenue category interface
export interface RevenueCategory {
  category: string;
  amount: string;
  percentage: string;
  value: number;
}

// Expense category interface
export interface ExpenseCategory {
  category: string;
  amount: string;
  percentage: string;
  value: number;
}

// Transaction interface
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  type: "income" | "expense";
  center?: string; // Added for all centers view
}

// Complete financial data interface
export interface FinancialData {
  summary: FinancialSummary;
  revenueByCategory: RevenueCategory[];
  expensesByCategory: ExpenseCategory[];
  recentTransactions: Transaction[];
}

// Import finances data to ensure synchronization
import { financesByCenter, allFinances } from "./finances";
import { FinancialTransaction } from "./finances";

// Financial data for each center (using center IDs, not names)
export const financialByCenter: Record<string, FinancialData> = {
  "dauin": {
    summary: {
      totalRevenue: `$${financesByCenter.dauin.revenue.annual.toLocaleString()}`,
      totalExpenses: `$${financesByCenter.dauin.expenses.annual.toLocaleString()}`,
      netProfit: `$${financesByCenter.dauin.profit.annual.toLocaleString()}`,
      profitMargin: `${((financesByCenter.dauin.profit.annual / financesByCenter.dauin.revenue.annual) * 100).toFixed(2)}%`,
      revenueChange: "+15.3%",
      expenseChange: "+8.2%",
      profitChange: "+22.5%"
    },
    revenueByCategory: [
      { category: "Dive Trips", amount: `$${financesByCenter.dauin.revenue.categories.divingServices.toLocaleString()}`, percentage: "50.3%", value: financesByCenter.dauin.revenue.categories.divingServices },
      { category: "Equipment Rentals", amount: `$${financesByCenter.dauin.revenue.categories.equipment.toLocaleString()}`, percentage: "20.9%", value: financesByCenter.dauin.revenue.categories.equipment },
      { category: "Training Courses", amount: `$${financesByCenter.dauin.revenue.categories.courses.toLocaleString()}`, percentage: "19.3%", value: financesByCenter.dauin.revenue.categories.courses },
      { category: "Equipment Sales", amount: `$${financesByCenter.dauin.revenue.categories.retail.toLocaleString()}`, percentage: "9.5%", value: financesByCenter.dauin.revenue.categories.retail }
    ],
    expensesByCategory: [
      { category: "Staff Salaries", amount: `$${financesByCenter.dauin.expenses.categories.staff.toLocaleString()}`, percentage: "52.3%", value: financesByCenter.dauin.expenses.categories.staff },
      { category: "Equipment Maintenance", amount: `$${(financesByCenter.dauin.expenses.categories.equipment + financesByCenter.dauin.expenses.categories.maintenance).toLocaleString()}`, percentage: "16.9%", value: (financesByCenter.dauin.expenses.categories.equipment + financesByCenter.dauin.expenses.categories.maintenance) },
      { category: "Boat Operations", amount: "$1,800.00", percentage: "14.5%", value: 1800 },
      { category: "Utilities", amount: `$${financesByCenter.dauin.expenses.categories.utilities.toLocaleString()}`, percentage: "9.7%", value: financesByCenter.dauin.expenses.categories.utilities },
      { category: "Marketing", amount: `$${financesByCenter.dauin.expenses.categories.marketing.toLocaleString()}`, percentage: "6.7%", value: financesByCenter.dauin.expenses.categories.marketing }
    ],
    recentTransactions: convertTransactions(financesByCenter.dauin.transactions)
  },
  "malapascua": {
    summary: {
      totalRevenue: `$${financesByCenter.malapascua.revenue.annual.toLocaleString()}`,
      totalExpenses: `$${financesByCenter.malapascua.expenses.annual.toLocaleString()}`,
      netProfit: `$${financesByCenter.malapascua.profit.annual.toLocaleString()}`,
      profitMargin: `${((financesByCenter.malapascua.profit.annual / financesByCenter.malapascua.revenue.annual) * 100).toFixed(2)}%`,
      revenueChange: "+18.7%",
      expenseChange: "+11.5%",
      profitChange: "+25.8%"
    },
    revenueByCategory: [
      { category: "Dive Trips", amount: `$${financesByCenter.malapascua.revenue.categories.divingServices.toLocaleString()}`, percentage: "60.0%", value: financesByCenter.malapascua.revenue.categories.divingServices },
      { category: "Equipment Rentals", amount: `$${financesByCenter.malapascua.revenue.categories.equipment.toLocaleString()}`, percentage: "13.4%", value: financesByCenter.malapascua.revenue.categories.equipment },
      { category: "Training Courses", amount: `$${financesByCenter.malapascua.revenue.categories.courses.toLocaleString()}`, percentage: "18.6%", value: financesByCenter.malapascua.revenue.categories.courses },
      { category: "Equipment Sales", amount: `$${financesByCenter.malapascua.revenue.categories.retail.toLocaleString()}`, percentage: "8.0%", value: financesByCenter.malapascua.revenue.categories.retail }
    ],
    expensesByCategory: [
      { category: "Staff Salaries", amount: `$${financesByCenter.malapascua.expenses.categories.staff.toLocaleString()}`, percentage: "53.3%", value: financesByCenter.malapascua.expenses.categories.staff },
      { category: "Equipment Maintenance", amount: `$${(financesByCenter.malapascua.expenses.categories.equipment + financesByCenter.malapascua.expenses.categories.maintenance).toLocaleString()}`, percentage: "15.7%", value: (financesByCenter.malapascua.expenses.categories.equipment + financesByCenter.malapascua.expenses.categories.maintenance) },
      { category: "Boat Operations", amount: "$3,200.00", percentage: "17.9%", value: 3200 },
      { category: "Utilities", amount: `$${financesByCenter.malapascua.expenses.categories.utilities.toLocaleString()}`, percentage: "7.9%", value: financesByCenter.malapascua.expenses.categories.utilities },
      { category: "Marketing", amount: `$${financesByCenter.malapascua.expenses.categories.marketing.toLocaleString()}`, percentage: "5.2%", value: financesByCenter.malapascua.expenses.categories.marketing }
    ],
    recentTransactions: convertTransactions(financesByCenter.malapascua.transactions)
  },
  "siquijor": {
    summary: {
      totalRevenue: `$${financesByCenter.siquijor.revenue.annual.toLocaleString()}`,
      totalExpenses: `$${financesByCenter.siquijor.expenses.annual.toLocaleString()}`,
      netProfit: `$${financesByCenter.siquijor.profit.annual.toLocaleString()}`,
      profitMargin: `${((financesByCenter.siquijor.profit.annual / financesByCenter.siquijor.revenue.annual) * 100).toFixed(2)}%`,
      revenueChange: "+12.1%",
      expenseChange: "+7.8%",
      profitChange: "+16.4%"
    },
    revenueByCategory: [
      { category: "Dive Trips", amount: `$${financesByCenter.siquijor.revenue.categories.divingServices.toLocaleString()}`, percentage: "53.4%", value: financesByCenter.siquijor.revenue.categories.divingServices },
      { category: "Equipment Rentals", amount: `$${financesByCenter.siquijor.revenue.categories.equipment.toLocaleString()}`, percentage: "19.6%", value: financesByCenter.siquijor.revenue.categories.equipment },
      { category: "Training Courses", amount: `$${financesByCenter.siquijor.revenue.categories.courses.toLocaleString()}`, percentage: "17.4%", value: financesByCenter.siquijor.revenue.categories.courses },
      { category: "Equipment Sales", amount: `$${financesByCenter.siquijor.revenue.categories.retail.toLocaleString()}`, percentage: "9.5%", value: financesByCenter.siquijor.revenue.categories.retail }
    ],
    expensesByCategory: [
      { category: "Staff Salaries", amount: `$${financesByCenter.siquijor.expenses.categories.staff.toLocaleString()}`, percentage: "49.9%", value: financesByCenter.siquijor.expenses.categories.staff },
      { category: "Equipment Maintenance", amount: `$${(financesByCenter.siquijor.expenses.categories.equipment + financesByCenter.siquijor.expenses.categories.maintenance).toLocaleString()}`, percentage: "17.6%", value: (financesByCenter.siquijor.expenses.categories.equipment + financesByCenter.siquijor.expenses.categories.maintenance) },
      { category: "Boat Operations", amount: "$1,600.00", percentage: "15.6%", value: 1600 },
      { category: "Utilities", amount: `$${financesByCenter.siquijor.expenses.categories.utilities.toLocaleString()}`, percentage: "10.8%", value: financesByCenter.siquijor.expenses.categories.utilities },
      { category: "Marketing", amount: `$${financesByCenter.siquijor.expenses.categories.marketing.toLocaleString()}`, percentage: "6.2%", value: financesByCenter.siquijor.expenses.categories.marketing }
    ],
    recentTransactions: convertTransactions(financesByCenter.siquijor.transactions)
  },
  "sipalay": {
    summary: {
      totalRevenue: `$${financesByCenter.sipalay.revenue.annual.toLocaleString()}`,
      totalExpenses: `$${financesByCenter.sipalay.expenses.annual.toLocaleString()}`,
      netProfit: `$${financesByCenter.sipalay.profit.annual.toLocaleString()}`,
      profitMargin: `${((financesByCenter.sipalay.profit.annual / financesByCenter.sipalay.revenue.annual) * 100).toFixed(2)}%`,
      revenueChange: "+10.9%",
      expenseChange: "+9.3%",
      profitChange: "+12.7%"
    },
    revenueByCategory: [
      { category: "Dive Trips", amount: `$${financesByCenter.sipalay.revenue.categories.divingServices.toLocaleString()}`, percentage: "52.2%", value: financesByCenter.sipalay.revenue.categories.divingServices },
      { category: "Equipment Rentals", amount: `$${financesByCenter.sipalay.revenue.categories.equipment.toLocaleString()}`, percentage: "19.1%", value: financesByCenter.sipalay.revenue.categories.equipment },
      { category: "Training Courses", amount: `$${financesByCenter.sipalay.revenue.categories.courses.toLocaleString()}`, percentage: "21.4%", value: financesByCenter.sipalay.revenue.categories.courses },
      { category: "Equipment Sales", amount: `$${financesByCenter.sipalay.revenue.categories.retail.toLocaleString()}`, percentage: "7.2%", value: financesByCenter.sipalay.revenue.categories.retail }
    ],
    expensesByCategory: [
      { category: "Staff Salaries", amount: `$${financesByCenter.sipalay.expenses.categories.staff.toLocaleString()}`, percentage: "52.1%", value: financesByCenter.sipalay.expenses.categories.staff },
      { category: "Equipment Maintenance", amount: `$${(financesByCenter.sipalay.expenses.categories.equipment + financesByCenter.sipalay.expenses.categories.maintenance).toLocaleString()}`, percentage: "17.4%", value: (financesByCenter.sipalay.expenses.categories.equipment + financesByCenter.sipalay.expenses.categories.maintenance) },
      { category: "Boat Operations", amount: "$2,100.00", percentage: "15.2%", value: 2100 },
      { category: "Utilities", amount: `$${financesByCenter.sipalay.expenses.categories.utilities.toLocaleString()}`, percentage: "9.4%", value: financesByCenter.sipalay.expenses.categories.utilities },
      { category: "Marketing", amount: `$${financesByCenter.sipalay.expenses.categories.marketing.toLocaleString()}`, percentage: "6.0%", value: financesByCenter.sipalay.expenses.categories.marketing }
    ],
    recentTransactions: convertTransactions(financesByCenter.sipalay.transactions)
  }
};

// Helper function to convert transaction format
function convertTransactions(transactions: FinancialTransaction[]): Transaction[] {
  return transactions.slice(0, 3).map(tx => ({
    id: tx.id,
    date: tx.date,
    description: tx.description,
    amount: `$${tx.amount.toLocaleString()}`,
    type: tx.type
  }));
}

// Import the dive centers data to get name mapping
import { diveCenters } from "../dive-center-data";

// Function to create aggregated financial data for all centers that uses finances.ts data
function createAggregatedFinancialData(): FinancialData {
  // Get total revenue, expenses and profit from allFinances
  const totalRevenue = allFinances.revenue.annual;
  const totalExpenses = allFinances.expenses.annual;
  const netProfit = allFinances.profit.annual;
  const profitMargin = (netProfit / totalRevenue) * 100;
  
  // Create revenue categories
  const revenueCategories: RevenueCategory[] = [
    { 
      category: "Dive Trips", 
      amount: `$${allFinances.revenue.categories.divingServices.toLocaleString()}`, 
      percentage: `${((allFinances.revenue.categories.divingServices / totalRevenue) * 100).toFixed(1)}%`, 
      value: allFinances.revenue.categories.divingServices 
    },
    { 
      category: "Equipment Rentals", 
      amount: `$${allFinances.revenue.categories.equipment.toLocaleString()}`, 
      percentage: `${((allFinances.revenue.categories.equipment / totalRevenue) * 100).toFixed(1)}%`, 
      value: allFinances.revenue.categories.equipment 
    },
    { 
      category: "Training Courses", 
      amount: `$${allFinances.revenue.categories.courses.toLocaleString()}`, 
      percentage: `${((allFinances.revenue.categories.courses / totalRevenue) * 100).toFixed(1)}%`, 
      value: allFinances.revenue.categories.courses 
    },
    { 
      category: "Equipment Sales", 
      amount: `$${allFinances.revenue.categories.retail.toLocaleString()}`, 
      percentage: `${((allFinances.revenue.categories.retail / totalRevenue) * 100).toFixed(1)}%`, 
      value: allFinances.revenue.categories.retail 
    }
  ];
  
  // Create expense categories
  const expenseCategories: ExpenseCategory[] = [
    { 
      category: "Staff Salaries", 
      amount: `$${allFinances.expenses.categories.staff.toLocaleString()}`, 
      percentage: `${((allFinances.expenses.categories.staff / totalExpenses) * 100).toFixed(1)}%`, 
      value: allFinances.expenses.categories.staff 
    },
    { 
      category: "Equipment Maintenance", 
      amount: `$${(allFinances.expenses.categories.equipment + allFinances.expenses.categories.maintenance).toLocaleString()}`, 
      percentage: `${(((allFinances.expenses.categories.equipment + allFinances.expenses.categories.maintenance) / totalExpenses) * 100).toFixed(1)}%`, 
      value: (allFinances.expenses.categories.equipment + allFinances.expenses.categories.maintenance) 
    },
    { 
      category: "Boat Operations", 
      amount: "$10,700.00", 
      percentage: `${((10700 / totalExpenses) * 100).toFixed(1)}%`, 
      value: 10700 
    },
    { 
      category: "Utilities", 
      amount: `$${allFinances.expenses.categories.utilities.toLocaleString()}`, 
      percentage: `${((allFinances.expenses.categories.utilities / totalExpenses) * 100).toFixed(1)}%`, 
      value: allFinances.expenses.categories.utilities 
    },
    { 
      category: "Marketing", 
      amount: `$${allFinances.expenses.categories.marketing.toLocaleString()}`, 
      percentage: `${((allFinances.expenses.categories.marketing / totalExpenses) * 100).toFixed(1)}%`, 
      value: allFinances.expenses.categories.marketing 
    }
  ];
  
  // Create combined transactions with center info
  const allTransactions = allFinances.transactions.slice(0, 7).map(tx => {
    // We need to cast to access the center property which is added during the map in finances.ts
    const txWithCenter = tx as FinancialTransaction & { center: string };
    return {
      id: txWithCenter.id,
      date: txWithCenter.date,
      description: txWithCenter.description,
      amount: `$${txWithCenter.amount.toLocaleString()}`,
      type: txWithCenter.type,
      center: txWithCenter.center
    };
  });

  // Create the aggregated financial data
  return {
    summary: {
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      totalExpenses: `$${totalExpenses.toLocaleString()}`,
      netProfit: `$${netProfit.toLocaleString()}`,
      profitMargin: `${profitMargin.toFixed(2)}%`,
      revenueChange: "+14.3%",
      expenseChange: "+9.2%",
      profitChange: "+19.4%"
    },
    revenueByCategory: revenueCategories,
    expensesByCategory: expenseCategories,
    recentTransactions: allTransactions
  };
}

// All centers financial data combined
export const allCentersFinancialData = createAggregatedFinancialData(); 