import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockTransactions } from '@/data/market';
import { getStatusText, formatCurrency, formatDate } from '@/utils';
import type { Transaction } from '@/types';

type TabType = 'all' | 'income' | 'expense';
type ViewMode = 'list' | 'summary';

const TransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [typeFilter, setTypeFilter] = useState('全部类型');
  const [dateFilter, setDateFilter] = useState('近7天');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [summaryDimension, setSummaryDimension] = useState<'buyer' | 'boat' | 'category'>('buyer');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部流水' },
    { key: 'income', label: '收入' },
    { key: 'expense', label: '支出' }
  ];

  const getTransactionType = (t: Transaction): string => {
    if (t.type === 'refund' || t.description.includes('退款')) return '退款';
    if (t.description.includes('油补')) return '油补发放';
    if (t.description.includes('渔获') || t.description.includes('结算款')) return '渔获结算';
    if (t.description.includes('预付款')) return '预付款';
    if (t.description.includes('服务') || t.description.includes('泊位') || t.description.includes('收费')) return '服务收费';
    if (t.description.includes('欠款') || t.description.includes('回款')) return '欠款回款';
    if (t.description.includes('货款')) return '其他';
    return '其他';
  };

  const isDateInRange = (dateStr: string, range: string): boolean => {
    const dateOnly = dateStr.slice(0, 10);
    const date = new Date(dateOnly);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case '近7天': {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        return date >= sevenDaysAgo && date <= today;
      }
      case '近30天': {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29);
        return date >= thirtyDaysAgo && date <= today;
      }
      case '本月': {
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      }
      case '上月': {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
      }
      default:
        return true;
    }
  };

  const filteredTransactions = useMemo(() => {
    let result = [...mockTransactions];
    
    if (activeTab !== 'all') {
      if (activeTab === 'income') {
        result = result.filter(t => t.type === 'income' || t.type === 'refund');
      } else {
        result = result.filter(t => t.type === 'expense');
      }
    }
    
    if (typeFilter !== '全部类型') {
      result = result.filter(t => getTransactionType(t) === typeFilter);
    }
    
    if (dateFilter !== '近7天') {
      result = result.filter(t => isDateInRange(t.time, dateFilter));
    } else {
      result = result.filter(t => isDateInRange(t.time, '近7天'));
    }
    
    console.log('[Transactions] 筛选后数据:', result.length, '条, tab:', activeTab, 'type:', typeFilter, 'date:', dateFilter);
    return result;
  }, [activeTab, typeFilter, dateFilter]);

  const totalIncome = useMemo(() => {
    return mockTransactions
      .filter(t => (t.type === 'income' || t.type === 'refund') && t.status === 'success')
      .reduce((s, t) => s + t.amount, 0);
  }, []);

  const totalExpense = useMemo(() => {
    return mockTransactions
      .filter(t => t.type === 'expense' && t.status === 'success')
      .reduce((s, t) => s + t.amount, 0);
  }, []);

  const netProfit = totalIncome - totalExpense;

  const getIconClass = (type: Transaction['type']) => {
    const map: Record<string, string> = {
      income: styles.transIconIncome,
      expense: styles.transIconExpense,
      refund: styles.transIconRefund
    };
    return map[type];
  };

  const getAmountClass = (type: Transaction['type']) => {
    const map: Record<string, string> = {
      income: styles.transAmountIncome,
      expense: styles.transAmountExpense,
      refund: styles.transAmountIncome
    };
    return map[type];
  };

  const getStatusClass = (status: Transaction['status']) => {
    const map: Record<string, string> = {
      success: styles.statusTagSuccess,
      pending: styles.statusTagPending,
      failed: styles.statusTagFailed
    };
    return map[status];
  };

  const getIcon = (type: Transaction['type']) => {
    const map: Record<string, string> = {
      income: '⬆️',
      expense: '⬇️',
      refund: '↩️'
    };
    return map[type];
  };

  const getAmountPrefix = (type: Transaction['type']) => {
    return type === 'expense' ? '-' : '+';
  };

  // 按日期分组
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(t => {
      const date = t.time.slice(0, 10);
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const handleTypeFilter = () => {
    Taro.showActionSheet({
      itemList: ['全部类型', '渔获结算', '油补发放', '预付款', '退款', '服务收费', '欠款回款', '其他']
    }).then(res => {
      const types = ['全部类型', '渔获结算', '油补发放', '预付款', '退款', '服务收费', '欠款回款', '其他'];
      setTypeFilter(types[res.tapIndex]);
      console.log('[Transactions] 筛选类型:', types[res.tapIndex]);
    }).catch(() => {});
  };

  const getSummaryKey = (t: Transaction, dim: 'buyer' | 'boat' | 'category'): string => {
    if (dim === 'buyer') {
      const desc = t.description;
      if (desc.includes('-')) {
        return desc.split('-')[0].trim();
      }
      return t.relatedBoat || '未归类';
    }
    if (dim === 'boat') {
      return t.relatedBoat || '未关联渔船';
    }
    return getTransactionType(t);
  };

  const summaryData = useMemo(() => {
    const result: Record<string, {
      key: string;
      todayIncome: number;
      todayExpense: number;
      sevenDayIncome: number;
      sevenDayExpense: number;
      count: number;
      transactions: Transaction[];
    }> = {};
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    mockTransactions.forEach(t => {
      const key = getSummaryKey(t, summaryDimension);
      if (!result[key]) {
        result[key] = {
          key,
          todayIncome: 0,
          todayExpense: 0,
          sevenDayIncome: 0,
          sevenDayExpense: 0,
          count: 0,
          transactions: []
        };
      }
      const isIncome = t.type === 'income' || t.type === 'refund';
      const isToday = t.time.startsWith(todayStr);
      const isSevenDay = isDateInRange(t.time, '近7天');

      if (isToday) {
        if (isIncome) result[key].todayIncome += t.amount;
        else result[key].todayExpense += t.amount;
      }
      if (isSevenDay) {
        if (isIncome) result[key].sevenDayIncome += t.amount;
        else result[key].sevenDayExpense += t.amount;
      }
      result[key].count++;
      result[key].transactions.push(t);
    });
    return Object.values(result).sort((a, b) => (b.sevenDayIncome + b.sevenDayExpense) - (a.sevenDayIncome + a.sevenDayExpense));
  }, [summaryDimension]);

  const dimensionLabels = {
    buyer: { label: '按买家', icon: '👤' },
    boat: { label: '按渔船', icon: '⛵' },
    category: { label: '按费用', icon: '📊' }
  };

  const handleDateFilter = () => {
    Taro.showActionSheet({
      itemList: ['近7天', '近30天', '本月', '上月', '自定义日期']
    }).then(res => {
      const dates = ['近7天', '近30天', '本月', '上月', '自定义日期'];
      setDateFilter(dates[res.tapIndex]);
      console.log('[Transactions] 筛选日期:', dates[res.tapIndex]);
    }).catch(() => {});
  };

  const handleExport = () => {
    Taro.showToast({ title: '导出报表中...', icon: 'loading' });
    setTimeout(() => {
      Taro.showToast({ title: '导出成功', icon: 'success' });
      console.log('[Transactions] 导出流水报表');
    }, 1500);
  };

  const handleViewDetail = (t: Transaction) => {
    const typeText = t.type === 'income' ? '收入' : t.type === 'expense' ? '支出' : '退款';
    const directionText = t.type === 'expense' ? '资金流出 ↓' : '资金流入 ↑';
    const bizType = getTransactionType(t);
    const descParts = t.description.split('-');
    const primaryParty = descParts.length > 1 ? descParts[0].trim() : '';
    const secondaryInfo = descParts.length > 1 ? descParts[1].trim() : t.description;

    let relatedInfo = '';
    let remark = '';
    let chargeItem = '';
    let berthInfo = '';

    switch (bizType) {
      case '退款':
        relatedInfo = `👤 买家: ${primaryParty || '鲜达水产'}\n      💰 原交易: ${secondaryInfo || '预付款'}`;
        remark = '预付款原路退回，退款将在1-3个工作日内原路返回买家支付账户。退款金额不计入当日收入统计。';
        break;
      case '预付款':
        relatedInfo = `👤 买家: ${primaryParty || '鲜达水产'}\n      📝 用途: ${secondaryInfo || '保证金'}`;
        remark = '买家预付保证金，用于后续渔获竞价交易。交易完成后自动抵扣货款，未使用部分可申请退款。';
        break;
      case '欠款回款':
        relatedInfo = `👤 还款方: ${primaryParty || '鑫鑫海鲜'}\n      📄 款项类型: ${secondaryInfo || '欠款还款'}`;
        remark = '买家偿还历史欠款。此笔款项为应收账款回收，计入当日收入但不计入渔获成交统计。请核对欠款余额是否正确。';
        break;
      case '服务收费':
        chargeItem = secondaryInfo.includes('泊位') ? '泊位占用费' : secondaryInfo.includes('装卸') ? '装卸服务费' : secondaryInfo.includes('过磅') ? '过磅服务费' : '其他服务费';
        berthInfo = t.relatedBoat ? `${t.relatedBoat} 停靠泊位` : '港口综合服务';
        relatedInfo = `⛵ 关联渔船: ${t.relatedBoat || '无'}\n      📋 收费项目: ${chargeItem}\n      📍 泊位信息: ${berthInfo}`;
        remark = `港口${chargeItem}，按收费标准计算。此笔费用为港口收入，计入服务收费统计。`;
        break;
      case '油补发放':
        relatedInfo = `⛵ 渔船: ${t.relatedBoat || '无'}\n      📦 品类: ${t.relatedCategory || '燃油补贴'}`;
        remark = '渔船燃油补贴，按季度发放，已完成渔业部门审核。此笔款项为政府补贴，不计入交易收入。';
        break;
      case '渔获结算':
        relatedInfo = `⛵ 渔船: ${t.relatedBoat || '无'}\n      🐟 品类: ${t.relatedCategory || '渔获'}`;
        remark = '渔获成交结算款，包含买家支付的渔获货款。此笔款项为交易核心收入，计入渔获成交统计。';
        break;
      default:
        relatedInfo = t.relatedBoat ? `⛵ 渔船: ${t.relatedBoat}` : '';
        if (t.relatedCategory) relatedInfo += `\n      📦 品类: ${t.relatedCategory}`;
        remark = t.description;
    }

    const statusFlow = t.status === 'pending' 
      ? '待确认 → 处理中 → 成功' 
      : t.status === 'success' 
        ? '已确认 ✓ → 处理完成 ✓ → 成功 ✓' 
        : '待确认 → 处理中 → 失败 ✗';
    
    const detailContent = `━━━ 交易核对小票 ━━━

📌 交易单号: ${t.id}
📋 业务类型: ${bizType}
💰 资金方向: ${directionText}
┌────────────────────
  金额: ${getAmountPrefix(t.type)}${formatCurrency(t.amount)}
└────────────────────

🔗 关联信息:
      ${relatedInfo || '无关联信息'}
      操作人: ${t.operator}

⏰ 交易时间: ${t.time}
📊 流转状态: ${getStatusText(t.status, 'transaction')}
      ${statusFlow}

📝 业务说明:
      ${remark}

━━━━━━━━━━━━━━━━━━━`;

    Taro.showModal({
      title: `${typeText} · ${getStatusText(t.status, 'transaction')}`,
      content: detailContent,
      showCancel: false,
      confirmText: '核对无误',
      confirmColor: '#0077B6'
    });
    console.log('[Transactions] 查看详情:', t.id, '类型:', bizType, '状态:', t.status);
  };

  const handleDimensionChange = () => {
    Taro.showActionSheet({
      itemList: ['按买家汇总', '按渔船汇总', '按费用类型汇总']
    }).then(res => {
      const dims: ('buyer' | 'boat' | 'category')[] = ['buyer', 'boat', 'category'];
      setSummaryDimension(dims[res.tapIndex]);
    }).catch(() => {});
  };

  const handleToggleExpand = (key: string) => {
    setExpandedKey(prev => prev === key ? null : key);
  };

  return (
    <View className={styles.transactionsPage}>
      <View className={styles.filterSection}>
        <View className={styles.filterRow}>
          <View className={classnames(styles.viewTab, viewMode === 'list' && styles.viewTabActive)} onClick={() => setViewMode('list')}>
            <Text>📋 流水列表</Text>
          </View>
          <View className={classnames(styles.viewTab, viewMode === 'summary' && styles.viewTabActive)} onClick={() => setViewMode('summary')}>
            <Text>📊 对账汇总</Text>
          </View>
        </View>
        {viewMode === 'list' && (
          <>
            <View className={styles.filterRow}>
              <View className={styles.filterItem} onClick={handleTypeFilter}>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={styles.filterLabel}>类型:</Text>
                  <Text className={styles.filterValue}>{typeFilter}</Text>
                </View>
                <Text className={styles.arrow}>▼</Text>
              </View>
              <View className={styles.filterItem} onClick={handleDateFilter}>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={styles.filterLabel}>时间:</Text>
                  <Text className={styles.filterValue}>{dateFilter}</Text>
                </View>
                <Text className={styles.arrow}>▼</Text>
              </View>
            </View>
            <View className={styles.filterRow}>
              <View className={styles.filterItem} onClick={handleExport}>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text>📊</Text>
                  <Text className={styles.filterValue} style={{ marginLeft: '16rpx' }}>导出报表</Text>
                </View>
              </View>
              <View className={styles.filterItem}>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text>🔍</Text>
                  <Text className={styles.filterValue} style={{ marginLeft: '16rpx' }}>搜索单号</Text>
                </View>
              </View>
            </View>
          </>
        )}
        {viewMode === 'summary' && (
          <View className={styles.filterRow}>
            <View className={styles.filterItem} onClick={handleDimensionChange} style={{ flex: 1 }}>
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Text>{dimensionLabels[summaryDimension].icon}</Text>
                <Text className={styles.filterValue} style={{ marginLeft: '12rpx' }}>{dimensionLabels[summaryDimension].label}</Text>
              </View>
              <Text className={styles.arrow}>▼</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => {
          const count = tab.key === 'all'
            ? mockTransactions.length
            : tab.key === 'income'
              ? mockTransactions.filter(t => t.type === 'income' || t.type === 'refund').length
              : mockTransactions.filter(t => t.type === 'expense').length;
          return (
            <View
              key={tab.key}
              className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text>{tab.label}({count})</Text>
            </View>
          );
        })}
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statItem}>
          <View style={{ display: 'flex', alignItems: 'baseline' }}>
            <Text className={classnames(styles.statNum, styles.income)}>+¥{(totalIncome / 10000).toFixed(1)}</Text>
            <Text className={styles.statUnit}>万</Text>
          </View>
          <Text className={styles.statLabel}>总收入</Text>
        </View>
        <View className={styles.statItem}>
          <View style={{ display: 'flex', alignItems: 'baseline' }}>
            <Text className={classnames(styles.statNum, styles.expense)}>-¥{(totalExpense / 10000).toFixed(1)}</Text>
            <Text className={styles.statUnit}>万</Text>
          </View>
          <Text className={styles.statLabel}>总支出</Text>
        </View>
        <View className={styles.statItem}>
          <View style={{ display: 'flex', alignItems: 'baseline' }}>
            <Text className={styles.statNum} style={{ color: netProfit >= 0 ? '#06D6A0' : '#EF476F' }}>
              {netProfit >= 0 ? '+' : ''}¥{(netProfit / 10000).toFixed(1)}
            </Text>
            <Text className={styles.statUnit}>万</Text>
          </View>
          <Text className={styles.statLabel}>净收入</Text>
        </View>
      </View>

      {viewMode === 'list' && (
        <>
          {Object.entries(groupedByDate).length > 0 ? (
            Object.entries(groupedByDate).map(([date, list]) => {
              const dayIncome = list.filter(t => t.type === 'income' || t.type === 'refund').reduce((s, t) => s + t.amount, 0);
              const dayExpense = list.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
              return (
                <View key={date} className={styles.dateGroup}>
                  <View className={styles.dateHeader}>
                    <Text className={styles.dateText}>📅 {date}</Text>
                    <View>
                      <Text className={styles.incomeSum}>收 +¥{dayIncome.toLocaleString()}</Text>
                      <Text className={styles.expenseSum}> 支 -¥{dayExpense.toLocaleString()}</Text>
                    </View>
                  </View>
                  {list.map(t => (
                    <View
                      key={t.id}
                      className={styles.transCard}
                      onClick={() => handleViewDetail(t)}
                    >
                      <View className={styles.transRow}>
                        <View className={classnames(styles.transIcon, getIconClass(t.type))}>
                          <Text>{getIcon(t.type)}</Text>
                        </View>
                        <View className={styles.transContent}>
                          <Text className={styles.transDesc}>{t.description}</Text>
                          <View className={styles.transMeta}>
                            <Text>{t.time.slice(11, 16)}</Text>
                            <Text>·</Text>
                            <View className={classnames(styles.statusTag, getStatusClass(t.status))}>
                              <Text>{getStatusText(t.status, 'transaction')}</Text>
                            </View>
                            {t.relatedBoat && (
                              <>
                                <Text>·</Text>
                                <Text>{t.relatedBoat}</Text>
                              </>
                            )}
                          </View>
                        </View>
                        <Text className={classnames(styles.transAmount, getAmountClass(t.type))}>
                          {getAmountPrefix(t.type)}{formatCurrency(t.amount)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>暂无交易流水</Text>
            </View>
          )}
        </>
      )}

      {viewMode === 'summary' && (
        <View className={styles.summaryView}>
          <View className={styles.summaryHeader}>
            <View className={styles.summaryColHeader}>
              <Text className={styles.summaryColTitle}>{dimensionLabels[summaryDimension].icon} {dimensionLabels[summaryDimension].label}</Text>
            </View>
            <View className={styles.summaryColHeader}>
              <Text className={styles.summaryColTitle}>今日</Text>
            </View>
            <View className={styles.summaryColHeader}>
              <Text className={styles.summaryColTitle}>近7天</Text>
            </View>
          </View>
          {summaryData.map(item => {
            const todayNet = item.todayIncome - item.todayExpense;
            const sevenDayNet = item.sevenDayIncome - item.sevenDayExpense;
            const isExpanded = expandedKey === item.key;
            return (
              <View key={item.key}>
                <View
                  className={styles.summaryRow}
                  onClick={() => handleToggleExpand(item.key)}
                >
                  <View className={styles.summaryCol}>
                    <Text className={styles.summaryKey}>{item.key}</Text>
                    <Text className={styles.summaryCount}>{item.count}笔</Text>
                  </View>
                  <View className={styles.summaryCol}>
                    <Text className={classnames(styles.summaryAmount, todayNet >= 0 ? styles.income : styles.expense)}>
                      {todayNet >= 0 ? '+' : ''}¥{todayNet.toLocaleString()}
                    </Text>
                  </View>
                  <View className={styles.summaryCol}>
                    <Text className={classnames(styles.summaryAmount, sevenDayNet >= 0 ? styles.income : styles.expense)}>
                      {sevenDayNet >= 0 ? '+' : ''}¥{sevenDayNet.toLocaleString()}
                    </Text>
                  </View>
                  <Text className={styles.expandArrow}>{isExpanded ? '▲' : '▼'}</Text>
                </View>
                {isExpanded && (
                  <View className={styles.summaryDetail}>
                    {item.transactions.map(t => (
                      <View
                        key={t.id}
                        className={styles.summaryDetailItem}
                        onClick={() => handleViewDetail(t)}
                      >
                        <View className={styles.transRow}>
                          <View className={classnames(styles.transIcon, getIconClass(t.type))}>
                            <Text>{getIcon(t.type)}</Text>
                          </View>
                          <View className={styles.transContent}>
                            <Text className={styles.transDesc}>{t.description}</Text>
                            <View className={styles.transMeta}>
                              <Text>{t.time.slice(5, 16)}</Text>
                              <Text>·</Text>
                              <View className={classnames(styles.statusTag, getStatusClass(t.status))}>
                                <Text>{getStatusText(t.status, 'transaction')}</Text>
                              </View>
                            </View>
                          </View>
                          <Text className={classnames(styles.transAmount, getAmountClass(t.type))}>
                            {getAmountPrefix(t.type)}{formatCurrency(t.amount)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default TransactionsPage;
