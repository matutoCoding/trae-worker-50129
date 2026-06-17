export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatWeight = (weight: number, unit: string = 'kg'): string => {
  if (weight >= 1000) {
    return `${(weight / 1000).toFixed(2)}吨`;
  }
  return `${weight.toFixed(2)}${unit}`;
};

export const getRandomId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const calculateWaitTime = (applyTime: string): string => {
  const start = new Date(applyTime).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - start);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  return `${minutes}分钟`;
};

export const getStatusText = (status: string, type: string): string => {
  const map: Record<string, Record<string, string>> = {
    boat: {
      atSea: '在航',
      waiting: '排队中',
      docked: '已靠港',
      departed: '已离港'
    },
    queue: {
      waiting: '等待中',
      calling: '叫号中',
      docked: '已靠泊',
      passed: '已过号'
    },
    vehicle: {
      idle: '空闲',
      loading: '装货中',
      transporting: '运输中',
      arrived: '已到达'
    },
    bid: {
      bidding: '竞价中',
      success: '已成交',
      failed: '流拍'
    },
    settlement: {
      pending: '待结算',
      completed: '已结算',
      partial: '部分结算'
    },
    debt: {
      unpaid: '未还款',
      partial: '部分还款',
      paid: '已还清'
    },
    inspection: {
      pass: '合格',
      fail: '不合格',
      pending: '检测中'
    },
    subsidy: {
      pending: '审核中',
      approved: '已通过',
      rejected: '已驳回'
    },
    transaction: {
      success: '成功',
      pending: '处理中',
      failed: '失败'
    }
  };
  return map[type]?.[status] || status;
};
