import type { QueueItem } from '@/types';

export const mockQueue: QueueItem[] = [
  {
    id: 'Q001',
    boatId: 'B003',
    boatName: '鲁荣015号',
    boatNumber: 'LR-2024-015',
    position: 1,
    status: 'calling',
    applyTime: '2026-06-17 07:45:00',
    expectedBerth: 'A-05',
    waitTime: '2小时45分'
  },
  {
    id: 'Q002',
    boatId: 'B002',
    boatName: '辽渔008号',
    boatNumber: 'LY-2024-008',
    position: 2,
    status: 'waiting',
    applyTime: '2026-06-17 09:15:00',
    expectedBerth: 'B-03',
    waitTime: '1小时15分'
  },
  {
    id: 'Q003',
    boatId: 'B007',
    boatName: '苏连077号',
    boatNumber: 'SL-2024-077',
    position: 3,
    status: 'waiting',
    applyTime: '2026-06-17 11:00:00',
    expectedBerth: 'A-08',
    waitTime: '30分钟'
  },
  {
    id: 'Q004',
    boatId: 'B004',
    boatName: '浙象023号',
    boatNumber: 'ZX-2024-023',
    position: 4,
    status: 'waiting',
    applyTime: '2026-06-17 10:20:00',
    expectedBerth: 'C-05',
    waitTime: '1小时10分'
  },
  {
    id: 'Q005',
    boatName: '粤穗091号',
    boatId: 'B009',
    boatNumber: 'YS-2024-091',
    position: 5,
    status: 'waiting',
    applyTime: '2026-06-17 11:30:00',
    expectedBerth: 'B-10',
    waitTime: '5分钟'
  },
  {
    id: 'Q006',
    boatId: 'B010',
    boatName: '沪淞067号',
    boatNumber: 'HS-2024-067',
    position: 6,
    status: 'waiting',
    applyTime: '2026-06-17 11:45:00',
    expectedBerth: 'D-02',
    waitTime: '0分钟'
  }
];

export const berthInfo = [
  { zone: 'A区', total: 10, occupied: 7, available: 3 },
  { zone: 'B区', total: 8, occupied: 5, available: 3 },
  { zone: 'C区', total: 12, occupied: 6, available: 6 },
  { zone: 'D区', total: 6, occupied: 2, available: 4 }
];
