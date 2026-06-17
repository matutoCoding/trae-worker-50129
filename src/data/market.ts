import type { MarketPrice, Settlement, Transaction, DebtRecord } from '@/types';

export const mockMarketPrices: MarketPrice[] = [
  {
    id: 'MP01',
    categoryName: '带鱼',
    todayPrice: 36.5,
    yesterdayPrice: 34.2,
    change: 2.3,
    unit: '元/kg',
    trend: 'up',
    highPrice: 42.0,
    lowPrice: 32.0,
    avgPrice: 36.5
  },
  {
    id: 'MP02',
    categoryName: '黄鱼',
    todayPrice: 42.0,
    yesterdayPrice: 44.5,
    change: -2.5,
    unit: '元/kg',
    trend: 'down',
    highPrice: 48.0,
    lowPrice: 38.0,
    avgPrice: 42.0
  },
  {
    id: 'MP03',
    categoryName: '虾',
    todayPrice: 82.0,
    yesterdayPrice: 78.0,
    change: 4.0,
    unit: '元/kg',
    trend: 'up',
    highPrice: 95.0,
    lowPrice: 72.0,
    avgPrice: 82.0
  },
  {
    id: 'MP04',
    categoryName: '蟹',
    todayPrice: 125.0,
    yesterdayPrice: 120.0,
    change: 5.0,
    unit: '元/kg',
    trend: 'up',
    highPrice: 140.0,
    lowPrice: 108.0,
    avgPrice: 125.0
  },
  {
    id: 'MP05',
    categoryName: '鱿鱼',
    todayPrice: 25.8,
    yesterdayPrice: 26.0,
    change: -0.2,
    unit: '元/kg',
    trend: 'down',
    highPrice: 30.0,
    lowPrice: 22.0,
    avgPrice: 25.8
  },
  {
    id: 'MP06',
    categoryName: '鲅鱼',
    todayPrice: 22.0,
    yesterdayPrice: 22.0,
    change: 0,
    unit: '元/kg',
    trend: 'flat',
    highPrice: 26.0,
    lowPrice: 18.0,
    avgPrice: 22.0
  },
  {
    id: 'MP07',
    categoryName: '鲳鱼',
    todayPrice: 56.0,
    yesterdayPrice: 54.5,
    change: 1.5,
    unit: '元/kg',
    trend: 'up',
    highPrice: 65.0,
    lowPrice: 48.0,
    avgPrice: 56.0
  },
  {
    id: 'MP08',
    categoryName: '墨鱼',
    todayPrice: 48.0,
    yesterdayPrice: 50.0,
    change: -2.0,
    unit: '元/kg',
    trend: 'down',
    highPrice: 55.0,
    lowPrice: 42.0,
    avgPrice: 48.0
  },
  {
    id: 'MP09',
    categoryName: '鲈鱼',
    todayPrice: 38.5,
    yesterdayPrice: 38.5,
    change: 0,
    unit: '元/kg',
    trend: 'flat',
    highPrice: 45.0,
    lowPrice: 32.0,
    avgPrice: 38.5
  },
  {
    id: 'MP10',
    categoryName: '石斑鱼',
    todayPrice: 168.0,
    yesterdayPrice: 162.0,
    change: 6.0,
    unit: '元/kg',
    trend: 'up',
    highPrice: 185.0,
    lowPrice: 148.0,
    avgPrice: 168.0
  }
];

export const mockSettlements: Settlement[] = [
  {
    id: 'ST20260617001',
    date: '2026-06-17',
    boatId: 'B005',
    boatName: '闽东056号',
    totalWeight: 3300,
    totalAmount: 238200,
    serviceFee: 4764,
    subsidy: 2000,
    actualAmount: 235436,
    status: 'completed',
    items: [
      { categoryName: '黄鱼', weight: 2100, unitPrice: 42, amount: 88200 },
      { categoryName: '蟹', weight: 1200, unitPrice: 125, amount: 150000 }
    ]
  },
  {
    id: 'ST20260617002',
    date: '2026-06-17',
    boatId: 'B008',
    boatName: '冀秦042号',
    totalWeight: 1800,
    totalAmount: 39600,
    serviceFee: 792,
    subsidy: 800,
    actualAmount: 39608,
    status: 'partial',
    items: [
      { categoryName: '鲅鱼', weight: 1800, unitPrice: 22, amount: 39600 }
    ]
  },
  {
    id: 'ST20260617003',
    date: '2026-06-17',
    boatId: 'B001',
    boatName: '辽渔001号',
    totalWeight: 5550,
    totalAmount: 281600,
    serviceFee: 5632,
    subsidy: 3500,
    actualAmount: 0,
    status: 'pending',
    items: [
      { categoryName: '带鱼', weight: 3200, unitPrice: 36.5, amount: 116800 },
      { categoryName: '虾', weight: 850, unitPrice: 82, amount: 69700 },
      { categoryName: '鱿鱼', weight: 1500, unitPrice: 25.8, amount: 38700 }
    ]
  },
  {
    id: 'ST20260616001',
    date: '2026-06-16',
    boatId: 'B006',
    boatName: '粤珠108号',
    totalWeight: 2800,
    totalAmount: 126000,
    serviceFee: 2520,
    subsidy: 1500,
    actualAmount: 124980,
    status: 'completed',
    items: [
      { categoryName: '带鱼', weight: 1500, unitPrice: 34, amount: 51000 },
      { categoryName: '鲈鱼', weight: 1300, unitPrice: 57.7, amount: 75000 }
    ]
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TX202606170001',
    type: 'income',
    amount: 235436,
    description: '闽东056号-渔获成交结算',
    relatedBoat: '闽东056号',
    relatedCategory: '黄鱼/蟹',
    time: '2026-06-17 10:45:00',
    operator: '财务-林会计',
    status: 'success'
  },
  {
    id: 'TX202606170002',
    type: 'expense',
    amount: 28500,
    description: '辽渔001号-一季度油补发放',
    relatedBoat: '辽渔001号',
    time: '2026-06-17 10:30:00',
    operator: '财务-林会计',
    status: 'success'
  },
  {
    id: 'TX202606170003',
    type: 'income',
    amount: 39608,
    description: '冀秦042号-部分结算款',
    relatedBoat: '冀秦042号',
    relatedCategory: '鲅鱼',
    time: '2026-06-17 10:15:00',
    operator: '财务-林会计',
    status: 'success'
  },
  {
    id: 'TX202606170004',
    type: 'expense',
    amount: 31200,
    description: '闽东056号-一季度油补发放',
    relatedBoat: '闽东056号',
    time: '2026-06-17 09:50:00',
    operator: '财务-林会计',
    status: 'success'
  },
  {
    id: 'TX202606170005',
    type: 'expense',
    amount: 5800,
    description: '鲜达水产-预付款退款',
    time: '2026-06-17 09:30:00',
    operator: '财务-林会计',
    status: 'success'
  },
  {
    id: 'TX202606170006',
    type: 'income',
    amount: 50000,
    description: '海味批发-预付款',
    time: '2026-06-17 09:00:00',
    operator: '财务-林会计',
    status: 'success'
  },
  {
    id: 'TX202606160008',
    type: 'income',
    amount: 124980,
    description: '粤珠108号-渔获成交结算',
    relatedBoat: '粤珠108号',
    relatedCategory: '带鱼/鲈鱼',
    time: '2026-06-16 17:30:00',
    operator: '财务-林会计',
    status: 'success'
  },
  {
    id: 'TX202606160007',
    type: 'expense',
    amount: 12500,
    description: '港口服务-泊位费',
    time: '2026-06-16 17:00:00',
    operator: '财务-林会计',
    status: 'success'
  },
  {
    id: 'TX202606160006',
    type: 'income',
    amount: 80000,
    description: '渔港直供-货款',
    time: '2026-06-16 15:45:00',
    operator: '财务-林会计',
    status: 'success'
  },
  {
    id: 'TX202606160005',
    type: 'pending',
    amount: 20000,
    description: '鑫鑫海鲜-欠款还款',
    time: '2026-06-16 14:20:00',
    operator: '财务-林会计',
    status: 'pending'
  }
];

export const mockDebts: DebtRecord[] = [
  {
    id: 'DBT001',
    debtor: '鑫鑫海鲜-李总',
    phone: '138****6688',
    amount: 156800,
    paidAmount: 50000,
    dueDate: '2026-06-25',
    createDate: '2026-06-10',
    status: 'partial',
    remark: '6月上旬货款'
  },
  {
    id: 'DBT002',
    debtor: '丰盛水产-王总',
    phone: '139****5566',
    amount: 89500,
    paidAmount: 0,
    dueDate: '2026-06-22',
    createDate: '2026-06-08',
    status: 'unpaid',
    remark: '黄鱼/蟹采购款'
  },
  {
    id: 'DBT003',
    debtor: '海之味-张经理',
    phone: '137****4455',
    amount: 23400,
    paidAmount: 23400,
    dueDate: '2026-06-18',
    createDate: '2026-06-05',
    status: 'paid',
    remark: '6月5日采购款'
  },
  {
    id: 'DBT004',
    debtor: '鲜品味-周经理',
    phone: '136****3344',
    amount: 67800,
    paidAmount: 0,
    dueDate: '2026-06-28',
    createDate: '2026-06-14',
    status: 'unpaid',
    remark: '虾/带鱼采购款'
  },
  {
    id: 'DBT005',
    debtor: '渔家乐-陈老板',
    phone: '135****2233',
    amount: 42000,
    paidAmount: 21000,
    dueDate: '2026-06-20',
    createDate: '2026-06-12',
    status: 'partial',
    remark: '石斑鱼/鲳鱼采购款'
  }
];
