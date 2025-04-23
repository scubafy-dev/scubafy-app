// Mock data for finances for each dive center

export interface FinancialData {
  revenue: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    quarterly: number[];
    annual: number;
    categories: {
      divingServices: number;
      equipment: number;
      courses: number;
      retail: number;
    };
  };
  expenses: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    quarterly: number[];
    annual: number;
    categories: {
      staff: number;
      equipment: number;
      maintenance: number;
      utilities: number;
      rent: number;
      marketing: number;
      insurance: number;
      other: number;
    };
  };
  profit: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    quarterly: number[];
    annual: number;
  };
  transactions: FinancialTransaction[];
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod?: string;
  reference?: string;
}

// Financial data for Dauin
const dauinFinances: FinancialData = {
  revenue: {
    daily: [1200, 900, 1500, 1300, 1100, 1700, 1400],
    weekly: [8100, 7800, 8500, 9200],
    monthly: [35600, 32400, 38500, 40200, 34600, 36800],
    quarterly: [106500, 111600, 98700, 120800],
    annual: 437600,
    categories: {
      divingServices: 218800,
      equipment: 87520,
      courses: 109400,
      retail: 21880,
    },
  },
  expenses: {
    daily: [800, 600, 750, 900, 850, 700, 650],
    weekly: [5250, 5100, 5300, 4900],
    monthly: [22000, 21500, 23400, 22800, 21900, 22300],
    quarterly: [66900, 69000, 65100, 66300],
    annual: 267300,
    categories: {
      staff: 133650,
      equipment: 40095,
      maintenance: 26730,
      utilities: 13365,
      rent: 24057,
      marketing: 10692,
      insurance: 8019,
      other: 10692,
    },
  },
  profit: {
    daily: [400, 300, 750, 400, 250, 1000, 750],
    weekly: [2850, 2700, 3200, 4300],
    monthly: [13600, 10900, 15100, 17400, 12700, 14500],
    quarterly: [39600, 42600, 33600, 54500],
    annual: 170300,
  },
  transactions: [
    {
      id: "FD-1001",
      date: "2025-02-01",
      description: "Coral Reef Dive Package (Group of 4)",
      amount: 480,
      type: 'income',
      category: 'divingServices',
      paymentMethod: 'credit card',
      reference: 'INV-23451',
    },
    {
      id: "FD-1002",
      date: "2025-02-02",
      description: "Equipment Rental - BCD and Regulators",
      amount: 120,
      type: 'income',
      category: 'equipment',
      paymentMethod: 'cash',
      reference: 'INV-23452',
    },
    {
      id: "FD-1003",
      date: "2025-02-02",
      description: "Advanced Open Water Course",
      amount: 350,
      type: 'income',
      category: 'courses',
      paymentMethod: 'bank transfer',
      reference: 'INV-23453',
    },
    {
      id: "FD-1004",
      date: "2025-02-03",
      description: "Staff Salaries - Week 5",
      amount: 1200,
      type: 'expense',
      category: 'staff',
      reference: 'EXP-12345',
    },
    {
      id: "FD-1005",
      date: "2025-02-03",
      description: "Boat Maintenance",
      amount: 300,
      type: 'expense',
      category: 'maintenance',
      paymentMethod: 'bank transfer',
      reference: 'EXP-12346',
    },
  ],
};

// Financial data for Malapascua
const malapascuaFinances: FinancialData = {
  revenue: {
    daily: [900, 1100, 1300, 950, 1200, 1400, 1050],
    weekly: [7900, 7200, 7800, 7500],
    monthly: [30400, 28600, 33200, 31500, 29800, 30900],
    quarterly: [92200, 94600, 90500, 93700],
    annual: 371000,
    categories: {
      divingServices: 222600,
      equipment: 55650,
      courses: 74200,
      retail: 18550,
    },
  },
  expenses: {
    daily: [650, 600, 700, 750, 600, 650, 700],
    weekly: [4650, 4350, 4550, 4400],
    monthly: [19600, 18900, 20100, 19300, 18700, 19200],
    quarterly: [58600, 58700, 56500, 57200],
    annual: 231000,
    categories: {
      staff: 115500,
      equipment: 34650,
      maintenance: 23100,
      utilities: 11550,
      rent: 20790,
      marketing: 9240,
      insurance: 6930,
      other: 9240,
    },
  },
  profit: {
    daily: [250, 500, 600, 200, 600, 750, 350],
    weekly: [3250, 2850, 3250, 3100],
    monthly: [10800, 9700, 13100, 12200, 11100, 11700],
    quarterly: [33600, 35900, 34000, 36500],
    annual: 140000,
  },
  transactions: [
    {
      id: "FM-1001",
      date: "2025-02-01",
      description: "Thresher Shark Dive Package (Group of 3)",
      amount: 555,
      type: 'income',
      category: 'divingServices',
      paymentMethod: 'credit card',
      reference: 'INV-34561',
    },
    {
      id: "FM-1002",
      date: "2025-02-01",
      description: "Equipment Rental - Full Set",
      amount: 180,
      type: 'income',
      category: 'equipment',
      paymentMethod: 'cash',
      reference: 'INV-34562',
    },
    {
      id: "FM-1003",
      date: "2025-02-02",
      description: "Dive Shop Retail Sales",
      amount: 120,
      type: 'income',
      category: 'retail',
      paymentMethod: 'credit card',
      reference: 'INV-34563',
    },
    {
      id: "FM-1004",
      date: "2025-02-03",
      description: "Boat Fuel",
      amount: 150,
      type: 'expense',
      category: 'maintenance',
      paymentMethod: 'cash',
      reference: 'EXP-23456',
    },
    {
      id: "FM-1005",
      date: "2025-02-03",
      description: "Equipment Service",
      amount: 120,
      type: 'expense',
      category: 'equipment',
      paymentMethod: 'bank transfer',
      reference: 'EXP-23457',
    },
  ],
};

// Financial data for Siquijor
const siquijorFinances: FinancialData = {
  revenue: {
    daily: [800, 950, 1100, 900, 1000, 1200, 850],
    weekly: [6800, 6500, 7100, 6900],
    monthly: [27200, 26800, 29500, 28200, 27500, 28600],
    quarterly: [83500, 85900, 82800, 84500],
    annual: 336700,
    categories: {
      divingServices: 168350,
      equipment: 50505,
      courses: 84175,
      retail: 33670,
    },
  },
  expenses: {
    daily: [550, 500, 600, 650, 550, 600, 500],
    weekly: [3950, 3800, 4100, 3850],
    monthly: [16800, 16300, 17500, 16900, 16600, 17100],
    quarterly: [50600, 51300, 49800, 50900],
    annual: 202600,
    categories: {
      staff: 101300,
      equipment: 30390,
      maintenance: 20260,
      utilities: 10130,
      rent: 18234,
      marketing: 8104,
      insurance: 6078,
      other: 8104,
    },
  },
  profit: {
    daily: [250, 450, 500, 250, 450, 600, 350],
    weekly: [2850, 2700, 3000, 3050],
    monthly: [10400, 10500, 12000, 11300, 10900, 11500],
    quarterly: [32900, 34600, 33000, 33600],
    annual: 134100,
  },
  transactions: [
    {
      id: "FS-1001",
      date: "2025-02-01",
      description: "Wall Dive Package (Group of 2)",
      amount: 280,
      type: 'income',
      category: 'divingServices',
      paymentMethod: 'credit card',
      reference: 'INV-45671',
    },
    {
      id: "FS-1002",
      date: "2025-02-01",
      description: "Open Water Course",
      amount: 400,
      type: 'income',
      category: 'courses',
      paymentMethod: 'bank transfer',
      reference: 'INV-45672',
    },
    {
      id: "FS-1003",
      date: "2025-02-02",
      description: "Retail - Dive Accessories",
      amount: 85,
      type: 'income',
      category: 'retail',
      paymentMethod: 'cash',
      reference: 'INV-45673',
    },
    {
      id: "FS-1004",
      date: "2025-02-03",
      description: "Staff Salaries - Week 5",
      amount: 950,
      type: 'expense',
      category: 'staff',
      reference: 'EXP-34567',
    },
    {
      id: "FS-1005",
      date: "2025-02-03",
      description: "Wetsuit Repairs",
      amount: 70,
      type: 'expense',
      category: 'equipment',
      paymentMethod: 'cash',
      reference: 'EXP-34568',
    },
  ],
};

// Financial data for Sipalay
const sipalayFinances: FinancialData = {
  revenue: {
    daily: [700, 800, 950, 750, 900, 1000, 750],
    weekly: [5850, 5500, 6100, 5800],
    monthly: [23400, 22800, 25600, 24200, 23600, 24500],
    quarterly: [71800, 74000, 70600, 72400],
    annual: 288800,
    categories: {
      divingServices: 144400,
      equipment: 43320,
      courses: 72200,
      retail: 28880,
    },
  },
  expenses: {
    daily: [500, 450, 550, 500, 450, 550, 500],
    weekly: [3500, 3300, 3700, 3400],
    monthly: [14800, 14300, 15500, 14900, 14600, 15100],
    quarterly: [44600, 45300, 43800, 44900],
    annual: 178600,
    categories: {
      staff: 89300,
      equipment: 26790,
      maintenance: 17860,
      utilities: 8930,
      rent: 16074,
      marketing: 7144,
      insurance: 5358,
      other: 7144,
    },
  },
  profit: {
    daily: [200, 350, 400, 250, 450, 450, 250],
    weekly: [2350, 2200, 2400, 2400],
    monthly: [8600, 8500, 10100, 9300, 9000, 9400],
    quarterly: [27200, 28700, 26800, 27500],
    annual: 110200,
  },
  transactions: [
    {
      id: "FSP-1001",
      date: "2025-02-01",
      description: "Shipwreck Dive Package",
      amount: 170,
      type: 'income',
      category: 'divingServices',
      paymentMethod: 'credit card',
      reference: 'INV-56781',
    },
    {
      id: "FSP-1002",
      date: "2025-02-01",
      description: "Equipment Rental - Tanks and Weights",
      amount: 60,
      type: 'income',
      category: 'equipment',
      paymentMethod: 'cash',
      reference: 'INV-56782',
    },
    {
      id: "FSP-1003",
      date: "2025-02-02",
      description: "Dive Shop Retail Sales",
      amount: 95,
      type: 'income',
      category: 'retail',
      paymentMethod: 'credit card',
      reference: 'INV-56783',
    },
    {
      id: "FSP-1004",
      date: "2025-02-03",
      description: "Utilities - Electricity",
      amount: 120,
      type: 'expense',
      category: 'utilities',
      paymentMethod: 'bank transfer',
      reference: 'EXP-45678',
    },
    {
      id: "FSP-1005",
      date: "2025-02-03",
      description: "Marketing - Online Ads",
      amount: 50,
      type: 'expense',
      category: 'marketing',
      paymentMethod: 'credit card',
      reference: 'EXP-45679',
    },
  ],
};

// Combined data for "All Centers" view
// Note: For financial data, we're simply aggregating the numbers
// For transactions, we're combining all transactions and adding center info
const allCentersFinances: FinancialData = {
  revenue: {
    daily: dauinFinances.revenue.daily.map((val, idx) => 
      val + malapascuaFinances.revenue.daily[idx] + 
      siquijorFinances.revenue.daily[idx] + sipalayFinances.revenue.daily[idx]
    ),
    weekly: dauinFinances.revenue.weekly.map((val, idx) => 
      val + malapascuaFinances.revenue.weekly[idx] + 
      siquijorFinances.revenue.weekly[idx] + sipalayFinances.revenue.weekly[idx]
    ),
    monthly: dauinFinances.revenue.monthly.map((val, idx) => 
      val + malapascuaFinances.revenue.monthly[idx] + 
      siquijorFinances.revenue.monthly[idx] + sipalayFinances.revenue.monthly[idx]
    ),
    quarterly: dauinFinances.revenue.quarterly.map((val, idx) => 
      val + malapascuaFinances.revenue.quarterly[idx] + 
      siquijorFinances.revenue.quarterly[idx] + sipalayFinances.revenue.quarterly[idx]
    ),
    annual: dauinFinances.revenue.annual + malapascuaFinances.revenue.annual + 
            siquijorFinances.revenue.annual + sipalayFinances.revenue.annual,
    categories: {
      divingServices: dauinFinances.revenue.categories.divingServices + 
                      malapascuaFinances.revenue.categories.divingServices + 
                      siquijorFinances.revenue.categories.divingServices + 
                      sipalayFinances.revenue.categories.divingServices,
      equipment: dauinFinances.revenue.categories.equipment + 
                 malapascuaFinances.revenue.categories.equipment + 
                 siquijorFinances.revenue.categories.equipment + 
                 sipalayFinances.revenue.categories.equipment,
      courses: dauinFinances.revenue.categories.courses + 
               malapascuaFinances.revenue.categories.courses + 
               siquijorFinances.revenue.categories.courses + 
               sipalayFinances.revenue.categories.courses,
      retail: dauinFinances.revenue.categories.retail + 
              malapascuaFinances.revenue.categories.retail + 
              siquijorFinances.revenue.categories.retail + 
              sipalayFinances.revenue.categories.retail,
    },
  },
  expenses: {
    daily: dauinFinances.expenses.daily.map((val, idx) => 
      val + malapascuaFinances.expenses.daily[idx] + 
      siquijorFinances.expenses.daily[idx] + sipalayFinances.expenses.daily[idx]
    ),
    weekly: dauinFinances.expenses.weekly.map((val, idx) => 
      val + malapascuaFinances.expenses.weekly[idx] + 
      siquijorFinances.expenses.weekly[idx] + sipalayFinances.expenses.weekly[idx]
    ),
    monthly: dauinFinances.expenses.monthly.map((val, idx) => 
      val + malapascuaFinances.expenses.monthly[idx] + 
      siquijorFinances.expenses.monthly[idx] + sipalayFinances.expenses.monthly[idx]
    ),
    quarterly: dauinFinances.expenses.quarterly.map((val, idx) => 
      val + malapascuaFinances.expenses.quarterly[idx] + 
      siquijorFinances.expenses.quarterly[idx] + sipalayFinances.expenses.quarterly[idx]
    ),
    annual: dauinFinances.expenses.annual + malapascuaFinances.expenses.annual + 
            siquijorFinances.expenses.annual + sipalayFinances.expenses.annual,
    categories: {
      staff: dauinFinances.expenses.categories.staff + 
             malapascuaFinances.expenses.categories.staff + 
             siquijorFinances.expenses.categories.staff + 
             sipalayFinances.expenses.categories.staff,
      equipment: dauinFinances.expenses.categories.equipment + 
                 malapascuaFinances.expenses.categories.equipment + 
                 siquijorFinances.expenses.categories.equipment + 
                 sipalayFinances.expenses.categories.equipment,
      maintenance: dauinFinances.expenses.categories.maintenance + 
                   malapascuaFinances.expenses.categories.maintenance + 
                   siquijorFinances.expenses.categories.maintenance + 
                   sipalayFinances.expenses.categories.maintenance,
      utilities: dauinFinances.expenses.categories.utilities + 
                 malapascuaFinances.expenses.categories.utilities + 
                 siquijorFinances.expenses.categories.utilities + 
                 sipalayFinances.expenses.categories.utilities,
      rent: dauinFinances.expenses.categories.rent + 
            malapascuaFinances.expenses.categories.rent + 
            siquijorFinances.expenses.categories.rent + 
            sipalayFinances.expenses.categories.rent,
      marketing: dauinFinances.expenses.categories.marketing + 
                 malapascuaFinances.expenses.categories.marketing + 
                 siquijorFinances.expenses.categories.marketing + 
                 sipalayFinances.expenses.categories.marketing,
      insurance: dauinFinances.expenses.categories.insurance + 
                 malapascuaFinances.expenses.categories.insurance + 
                 siquijorFinances.expenses.categories.insurance + 
                 sipalayFinances.expenses.categories.insurance,
      other: dauinFinances.expenses.categories.other + 
             malapascuaFinances.expenses.categories.other + 
             siquijorFinances.expenses.categories.other + 
             sipalayFinances.expenses.categories.other,
    },
  },
  profit: {
    daily: dauinFinances.profit.daily.map((val, idx) => 
      val + malapascuaFinances.profit.daily[idx] + 
      siquijorFinances.profit.daily[idx] + sipalayFinances.profit.daily[idx]
    ),
    weekly: dauinFinances.profit.weekly.map((val, idx) => 
      val + malapascuaFinances.profit.weekly[idx] + 
      siquijorFinances.profit.weekly[idx] + sipalayFinances.profit.weekly[idx]
    ),
    monthly: dauinFinances.profit.monthly.map((val, idx) => 
      val + malapascuaFinances.profit.monthly[idx] + 
      siquijorFinances.profit.monthly[idx] + sipalayFinances.profit.monthly[idx]
    ),
    quarterly: dauinFinances.profit.quarterly.map((val, idx) => 
      val + malapascuaFinances.profit.quarterly[idx] + 
      siquijorFinances.profit.quarterly[idx] + sipalayFinances.profit.quarterly[idx]
    ),
    annual: dauinFinances.profit.annual + malapascuaFinances.profit.annual + 
            siquijorFinances.profit.annual + sipalayFinances.profit.annual,
  },
  transactions: [
    ...dauinFinances.transactions.map(tx => ({...tx, center: "Sea Explorers Dauin"})),
    ...malapascuaFinances.transactions.map(tx => ({...tx, center: "Sea Explorers Malapascua"})),
    ...siquijorFinances.transactions.map(tx => ({...tx, center: "Sea Explorers Siquijor"})),
    ...sipalayFinances.transactions.map(tx => ({...tx, center: "Sea Explorers Sipalay"})),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as (FinancialTransaction & {center: string})[]
};

export const financesByCenter = {
  dauin: dauinFinances,
  malapascua: malapascuaFinances,
  siquijor: siquijorFinances,
  sipalay: sipalayFinances,
};

export const allFinances = allCentersFinances; 