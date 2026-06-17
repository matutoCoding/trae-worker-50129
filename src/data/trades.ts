import type { WeighingRecord, BidItem, Bidder, ColdChainVehicle, InspectionRecord } from '@/types';

export const mockWeighingRecords: WeighingRecord[] = [
  {
    id: 'W20260617001',
    boatId: 'B001',
    boatName: '辽渔001号',
    categoryId: 'F01',
    categoryName: '带鱼',
    weight: 3200,
    unit: 'kg',
    quality: 'A',
    weighTime: '2026-06-17 09:30:00',
    operator: '操作员-王磊',
    temperature: -18,
    batchNo: '20260617-A-001'
  },
  {
    id: 'W20260617002',
    boatId: 'B001',
    boatName: '辽渔001号',
    categoryId: 'F04',
    categoryName: '虾',
    weight: 850,
    unit: 'kg',
    quality: 'A',
    weighTime: '2026-06-17 09:45:00',
    operator: '操作员-王磊',
    temperature: -20,
    batchNo: '20260617-A-002'
  },
  {
    id: 'W20260617003',
    boatId: 'B005',
    boatName: '闽东056号',
    categoryId: 'F02',
    categoryName: '黄鱼',
    weight: 2100,
    unit: 'kg',
    quality: 'B',
    weighTime: '2026-06-17 08:45:00',
    operator: '操作员-李娜',
    temperature: -18,
    batchNo: '20260617-B-001'
  },
  {
    id: 'W20260617004',
    boatId: 'B005',
    boatName: '闽东056号',
    categoryId: 'F05',
    categoryName: '蟹',
    weight: 1200,
    unit: 'kg',
    quality: 'A',
    weighTime: '2026-06-17 09:00:00',
    operator: '操作员-李娜',
    temperature: -15,
    batchNo: '20260617-B-002'
  },
  {
    id: 'W20260617005',
    boatId: 'B008',
    boatName: '冀秦042号',
    categoryId: 'F08',
    categoryName: '鲅鱼',
    weight: 1800,
    unit: 'kg',
    quality: 'B',
    weighTime: '2026-06-17 09:20:00',
    operator: '操作员-张伟',
    temperature: -18,
    batchNo: '20260617-C-001'
  },
  {
    id: 'W20260617006',
    boatId: 'B001',
    boatName: '辽渔001号',
    categoryId: 'F03',
    categoryName: '鱿鱼',
    weight: 1500,
    unit: 'kg',
    quality: 'A',
    weighTime: '2026-06-17 10:00:00',
    operator: '操作员-王磊',
    temperature: -20,
    batchNo: '20260617-A-003'
  }
];

export const mockBidItems: BidItem[] = [
  {
    id: 'BD001',
    weighingId: 'W20260617001',
    categoryName: '带鱼',
    weight: 3200,
    startPrice: 28,
    currentPrice: 36.5,
    bidCount: 12,
    endTime: '2026-06-17 11:30:00',
    status: 'bidding',
    boatName: '辽渔001号',
    quality: 'A'
  },
  {
    id: 'BD002',
    weighingId: 'W20260617002',
    categoryName: '虾',
    weight: 850,
    startPrice: 65,
    currentPrice: 82,
    bidCount: 18,
    endTime: '2026-06-17 11:00:00',
    status: 'bidding',
    boatName: '辽渔001号',
    quality: 'A'
  },
  {
    id: 'BD003',
    weighingId: 'W20260617003',
    categoryName: '黄鱼',
    weight: 2100,
    startPrice: 42,
    currentPrice: 42,
    bidCount: 0,
    endTime: '2026-06-17 12:00:00',
    status: 'bidding',
    boatName: '闽东056号',
    quality: 'B'
  },
  {
    id: 'BD004',
    weighingId: 'W20260617004',
    categoryName: '蟹',
    weight: 1200,
    startPrice: 88,
    currentPrice: 125,
    bidCount: 24,
    endTime: '2026-06-17 10:30:00',
    status: 'success',
    boatName: '闽东056号',
    quality: 'A'
  },
  {
    id: 'BD005',
    weighingId: 'W20260617005',
    categoryName: '鲅鱼',
    weight: 1800,
    startPrice: 22,
    currentPrice: 22,
    bidCount: 0,
    endTime: '2026-06-17 10:00:00',
    status: 'failed',
    boatName: '冀秦042号',
    quality: 'B'
  },
  {
    id: 'BD006',
    weighingId: 'W20260617006',
    categoryName: '鱿鱼',
    weight: 1500,
    startPrice: 18,
    currentPrice: 25.8,
    bidCount: 8,
    endTime: '2026-06-17 12:30:00',
    status: 'bidding',
    boatName: '辽渔001号',
    quality: 'A'
  }
];

export const mockBidders: Bidder[] = [
  { id: 'BR001', name: '鲜达水产-刘总', price: 36.5, time: '10:58:23', quantity: 3200 },
  { id: 'BR002', name: '海味批发-王经理', price: 35.2, time: '10:55:12', quantity: 2000 },
  { id: 'BR003', name: '渔港直供-陈老板', price: 34.0, time: '10:52:45', quantity: 3200 },
  { id: 'BR004', name: '鑫鑫海鲜-李总', price: 32.8, time: '10:48:30', quantity: 1500 },
  { id: 'BR005', name: '渔家乐采购-张总', price: 31.5, time: '10:45:18', quantity: 3200 },
  { id: 'BR006', name: '鲜品味-周经理', price: 30.0, time: '10:40:55', quantity: 1000 }
];

export const mockColdChainVehicles: ColdChainVehicle[] = [
  {
    id: 'CCV001',
    plateNumber: '京A·8F62冷链',
    driver: '周师傅',
    phone: '138****1234',
    capacity: 12,
    temperature: -20,
    status: 'loading',
    currentLocation: 'A区装货码头'
  },
  {
    id: 'CCV002',
    plateNumber: '沪B·3D91冷链',
    driver: '吴师傅',
    phone: '139****5678',
    capacity: 18,
    temperature: -22,
    status: 'transporting',
    currentLocation: '前往上海途中'
  },
  {
    id: 'CCV003',
    plateNumber: '粤C·7H25冷链',
    driver: '郑师傅',
    phone: '137****9012',
    capacity: 15,
    temperature: -18,
    status: 'idle',
    currentLocation: '渔港停车场'
  },
  {
    id: 'CCV004',
    plateNumber: '浙D·2J48冷链',
    driver: '孙师傅',
    phone: '136****3456',
    capacity: 10,
    temperature: -15,
    status: 'arrived',
    currentLocation: 'B区卸货码头'
  },
  {
    id: 'CCV005',
    plateNumber: '鲁E·5K73冷链',
    driver: '马师傅',
    phone: '135****7890',
    capacity: 20,
    temperature: -20,
    status: 'idle',
    currentLocation: '渔港停车场'
  }
];

export const mockInspections: InspectionRecord[] = [
  {
    id: 'INSP001',
    boatName: '辽渔001号',
    categoryName: '带鱼',
    sampleNo: 'S20260617A01',
    result: 'pass',
    qualityLevel: 'A',
    checkItems: [
      { name: '外观色泽', result: '合格', standard: '银灰色有光泽' },
      { name: '眼球饱满度', result: '合格', standard: '角膜透明' },
      { name: '肌肉弹性', result: '合格', standard: '按压后凹陷立即恢复' },
      { name: '鳃部颜色', result: '合格', standard: '鲜红色无异味' },
      { name: 'TVB-N值', result: '12.5mg/100g', standard: '≤20mg/100g' },
      { name: '重金属检测', result: '合格', standard: '符合GB2762标准' }
    ],
    inspector: '检测员-陈静',
    checkTime: '2026-06-17 09:15:00'
  },
  {
    id: 'INSP002',
    boatName: '闽东056号',
    categoryName: '黄鱼',
    sampleNo: 'S20260617B01',
    result: 'pass',
    qualityLevel: 'B',
    checkItems: [
      { name: '外观色泽', result: '合格', standard: '金黄色有光泽' },
      { name: '眼球饱满度', result: '合格', standard: '角膜透明' },
      { name: '肌肉弹性', result: '合格', standard: '按压后凹陷恢复' },
      { name: '鳃部颜色', result: '合格', standard: '淡红色无异味' },
      { name: 'TVB-N值', result: '16.8mg/100g', standard: '≤20mg/100g' },
      { name: '重金属检测', result: '合格', standard: '符合GB2762标准' }
    ],
    inspector: '检测员-刘涛',
    checkTime: '2026-06-17 08:30:00'
  },
  {
    id: 'INSP003',
    boatName: '冀秦042号',
    categoryName: '鲅鱼',
    sampleNo: 'S20260617C01',
    result: 'pending',
    qualityLevel: 'B',
    checkItems: [
      { name: '外观色泽', result: '检测中', standard: '蓝灰色有光泽' },
      { name: '眼球饱满度', result: '检测中', standard: '角膜透明' },
      { name: '肌肉弹性', result: '检测中', standard: '按压后凹陷恢复' },
      { name: '鳃部颜色', result: '待检测', standard: '暗红色无异味' },
      { name: 'TVB-N值', result: '待检测', standard: '≤20mg/100g' },
      { name: '重金属检测', result: '待检测', standard: '符合GB2762标准' }
    ],
    inspector: '检测员-王芳',
    checkTime: '2026-06-17 09:05:00'
  }
];
