import type { Boat, FishCategory, OilSubsidy, StatItem } from '@/types';

export const mockBoats: Boat[] = [
  {
    id: 'B001',
    name: '辽渔001号',
    number: 'LY-2024-001',
    captain: '张建国',
    phone: '138****8801',
    length: 32,
    tonnage: 180,
    crewCount: 8,
    registerTime: '2026-06-17 08:30:00',
    status: 'docked',
    berthNumber: 'A-03',
    expectedTime: '2026-06-17 09:00:00'
  },
  {
    id: 'B002',
    name: '辽渔008号',
    number: 'LY-2024-008',
    captain: '李海洋',
    phone: '139****6602',
    length: 28,
    tonnage: 150,
    crewCount: 6,
    registerTime: '2026-06-17 09:15:00',
    status: 'waiting',
    expectedTime: '2026-06-17 10:30:00'
  },
  {
    id: 'B003',
    name: '鲁荣015号',
    number: 'LR-2024-015',
    captain: '王海涛',
    phone: '137****5503',
    length: 36,
    tonnage: 220,
    crewCount: 10,
    registerTime: '2026-06-17 07:45:00',
    status: 'waiting',
    expectedTime: '2026-06-17 10:00:00'
  },
  {
    id: 'B004',
    name: '浙象023号',
    number: 'ZX-2024-023',
    captain: '陈勇',
    phone: '136****4404',
    length: 24,
    tonnage: 120,
    crewCount: 5,
    registerTime: '2026-06-17 10:20:00',
    status: 'atSea',
    expectedTime: '2026-06-17 14:00:00'
  },
  {
    id: 'B005',
    name: '闽东056号',
    number: 'MD-2024-056',
    captain: '林建华',
    phone: '135****3305',
    length: 30,
    tonnage: 160,
    crewCount: 7,
    registerTime: '2026-06-17 06:30:00',
    status: 'docked',
    berthNumber: 'B-07',
    expectedTime: '2026-06-17 08:00:00'
  },
  {
    id: 'B006',
    name: '粤珠108号',
    number: 'YZ-2024-108',
    captain: '黄志强',
    phone: '134****2206',
    length: 26,
    tonnage: 130,
    crewCount: 6,
    registerTime: '2026-06-17 09:50:00',
    status: 'departed',
    expectedTime: '2026-06-17 11:00:00'
  },
  {
    id: 'B007',
    name: '苏连077号',
    number: 'SL-2024-077',
    captain: '刘大伟',
    phone: '133****1107',
    length: 34,
    tonnage: 200,
    crewCount: 9,
    registerTime: '2026-06-17 11:00:00',
    status: 'waiting',
    expectedTime: '2026-06-17 13:00:00'
  },
  {
    id: 'B008',
    name: '冀秦042号',
    number: 'JQ-2024-042',
    captain: '赵明',
    phone: '132****0008',
    length: 22,
    tonnage: 100,
    crewCount: 4,
    registerTime: '2026-06-17 08:00:00',
    status: 'docked',
    berthNumber: 'C-12',
    expectedTime: '2026-06-17 08:45:00'
  }
];

export const mockFishCategories: FishCategory[] = [
  { id: 'F01', name: '带鱼', unit: 'kg', icon: '🐟' },
  { id: 'F02', name: '黄鱼', unit: 'kg', icon: '🐠' },
  { id: 'F03', name: '鱿鱼', unit: 'kg', icon: '🦑' },
  { id: 'F04', name: '虾', unit: 'kg', icon: '🦐' },
  { id: 'F05', name: '蟹', unit: 'kg', icon: '🦀' },
  { id: 'F06', name: '墨鱼', unit: 'kg', icon: '🐙' },
  { id: 'F07', name: '鲳鱼', unit: 'kg', icon: '🐟' },
  { id: 'F08', name: '鲅鱼', unit: 'kg', icon: '🐡' },
  { id: 'F09', name: '鲈鱼', unit: 'kg', icon: '🐟' },
  { id: 'F10', name: '石斑鱼', unit: 'kg', icon: '🐠' }
];

export const mockOilSubsidies: OilSubsidy[] = [
  {
    id: 'OS001',
    boatName: '辽渔001号',
    boatNumber: 'LY-2024-001',
    subsidyAmount: 28500,
    fuelAmount: 8000,
    period: '2026年第一季度',
    status: 'approved',
    applyTime: '2026-04-15 10:30:00'
  },
  {
    id: 'OS002',
    boatName: '辽渔008号',
    boatNumber: 'LY-2024-008',
    subsidyAmount: 24600,
    fuelAmount: 6800,
    period: '2026年第一季度',
    status: 'pending',
    applyTime: '2026-04-18 14:20:00'
  },
  {
    id: 'OS003',
    boatName: '闽东056号',
    boatNumber: 'MD-2024-056',
    subsidyAmount: 31200,
    fuelAmount: 8600,
    period: '2026年第一季度',
    status: 'approved',
    applyTime: '2026-04-10 09:15:00'
  }
];

export const mockHomeStats: StatItem[] = [
  { label: '今日到港渔船', value: 18, unit: '艘', trend: 'up', trendValue: 12 },
  { label: '今日渔获总量', value: 86.5, unit: '吨', trend: 'up', trendValue: 8.3 },
  { label: '今日成交额', value: '¥286.5', unit: '万', trend: 'up', trendValue: 15.2 },
  { label: '在港排队', value: 6, unit: '艘', trend: 'flat', trendValue: 0 }
];

export const quickEntries = [
  { name: '渔船登记', page: '/pages/register/index', icon: '🚢', color: '#0077B6' },
  { name: '渔获过磅', page: '/pages/weighing/index', icon: '⚖️', color: '#00B4D8' },
  { name: '交易撮合', page: '/pages/bidding/index', icon: '🤝', color: '#FFB627' },
  { name: '冷链对接', page: '/pages/coldchain/index', icon: '❄️', color: '#48CAE4' },
  { name: '结算分账', page: '/pages/settlement/index', icon: '💰', color: '#06D6A0' },
  { name: '油补登记', page: '/pages/register/index?tab=subsidy', icon: '⛽', color: '#FFB627' },
  { name: '质量抽检', page: '/pages/inspection/index', icon: '🔬', color: '#EF476F' },
  { name: '交易流水', page: '/pages/transactions/index', icon: '📋', color: '#023E8A' }
];
