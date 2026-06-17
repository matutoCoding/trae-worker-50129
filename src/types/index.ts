export interface Boat {
  id: string;
  name: string;
  number: string;
  captain: string;
  phone: string;
  length: number;
  tonnage: number;
  crewCount: number;
  registerTime: string;
  status: 'atSea' | 'waiting' | 'docked' | 'departed';
  expectedTime?: string;
  berthNumber?: string;
}

export interface QueueItem {
  id: string;
  boatId: string;
  boatName: string;
  boatNumber: string;
  position: number;
  status: 'waiting' | 'calling' | 'docked' | 'passed';
  applyTime: string;
  expectedBerth: string;
  waitTime: string;
}

export interface FishCategory {
  id: string;
  name: string;
  unit: string;
  icon: string;
}

export interface WeighingRecord {
  id: string;
  boatId: string;
  boatName: string;
  categoryId: string;
  categoryName: string;
  weight: number;
  unit: string;
  quality: 'A' | 'B' | 'C';
  weighTime: string;
  operator: string;
  temperature?: number;
  batchNo: string;
}

export interface BidItem {
  id: string;
  weighingId: string;
  categoryName: string;
  weight: number;
  startPrice: number;
  currentPrice: number;
  bidCount: number;
  endTime: string;
  status: 'bidding' | 'success' | 'failed';
  boatName: string;
  quality: string;
}

export interface Bidder {
  id: string;
  name: string;
  price: number;
  time: string;
  quantity: number;
}

export interface ColdChainVehicle {
  id: string;
  plateNumber: string;
  driver: string;
  phone: string;
  capacity: number;
  temperature: number;
  status: 'idle' | 'loading' | 'transporting' | 'arrived';
  currentLocation?: string;
}

export interface Settlement {
  id: string;
  date: string;
  boatId: string;
  boatName: string;
  totalWeight: number;
  totalAmount: number;
  serviceFee: number;
  subsidy: number;
  actualAmount: number;
  status: 'pending' | 'completed' | 'partial';
  items: SettlementItem[];
}

export interface SettlementItem {
  categoryName: string;
  weight: number;
  unitPrice: number;
  amount: number;
}

export interface MarketPrice {
  id: string;
  categoryName: string;
  todayPrice: number;
  yesterdayPrice: number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'flat';
  highPrice: number;
  lowPrice: number;
  avgPrice: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'refund';
  amount: number;
  description: string;
  relatedBoat?: string;
  relatedCategory?: string;
  time: string;
  operator: string;
  status: 'success' | 'pending' | 'failed';
}

export interface DebtRecord {
  id: string;
  debtor: string;
  phone: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  createDate: string;
  status: 'unpaid' | 'partial' | 'paid';
  remark?: string;
}

export interface InspectionRecord {
  id: string;
  boatName: string;
  categoryName: string;
  sampleNo: string;
  result: 'pass' | 'fail' | 'pending';
  qualityLevel: 'A' | 'B' | 'C';
  checkItems: { name: string; result: string; standard: string }[];
  inspector: string;
  checkTime: string;
}

export interface OilSubsidy {
  id: string;
  boatName: string;
  boatNumber: string;
  subsidyAmount: number;
  fuelAmount: number;
  period: string;
  status: 'pending' | 'approved' | 'rejected';
  applyTime: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: number;
}
