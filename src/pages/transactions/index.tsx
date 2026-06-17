import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockTransactions } from '@/data/market';
import { getStatusText, formatCurrency, formatDate } from '@/utils';
import type { Transaction } from '@/types';

type TabType = 'all' | 'income' | 'expense';

const TransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [typeFilter, setTypeFilter] = useState('全部类型');
  const [dateFilter, setDateFilter] = useState('近7天');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部流水' },
    { key: 'income', label: '收入' },
    { key: 'expense', label: '支出' }
  ];

  const getTransactionType = (t: Transaction): string => {
    if (t.description.includes('油补')) return '油补发放';
    if (t.description.includes('渔获') || t.description.includes('结算款')) return '渔获结算';
    if (t.type === 'refund' || t.description.includes('退款')) return '退款';
    if (t.description.includes('预付款')) return '预付款';
    if (t.description.includes('服务') || t.description.includes('泊位') || t.description.includes('收费')) return '服务收费';
    if (t.description.includes('货款') || t.description.includes('欠款')) return '其他';
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
      itemList: ['全部类型', '渔获结算', '油补发放', '预付款', '退款', '服务收费', '其他']
    }).then(res => {
      const types = ['全部类型', '渔获结算', '油补发放', '预付款', '退款', '服务收费', '其他'];
      setTypeFilter(types[res.tapIndex]);
      console.log('[Transactions] 筛选类型:', types[res.tapIndex]);
    }).catch(() => {});
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
    const directionClass = t.type === 'expense' ? '支出（红色）' : '收入（绿色）';
    const buyerOrSeller = t.description.includes('欠款') || t.description.includes('货款') ? t.description.split('-')[0] : t.relatedBoat || '无';
    const bizType = getTransactionType(t);
    const remarkMap: Record<string, string> = {
      '退款': '预付款原路退回，3个工作日内到账',
      '渔获结算': '包含渔获成交款和服务费结算',
      '油补发放': '按季度燃油补贴，已完成审核',
      '预付款': '买家预付保证金，用于后续竞价',
      '服务收费': '港口泊位、装卸等服务费用',
      '其他': '欠款还款或其他资金往来'
    };
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
  ${t.relatedBoat ? `渔船: ${t.relatedBoat}` : ''}
  ${t.relatedCategory ? `品类: ${t.relatedCategory}` : ''}
  ${buyerOrSeller !== '无' ? `${bizType === '退款' || bizType === '预付款' ? '买家' : '关联方'}: ${buyerOrSeller}` : ''}
  操作人: ${t.operator}

⏰ 交易时间: ${t.time}
📊 流转状态: ${getStatusText(t.status, 'transaction')}
  ${statusFlow}

📝 备注: ${remarkMap[bizType] || t.description}

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

  return (
    <View className={styles.transactionsPage}>
      <View className={styles.filterSection}>
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
    </View>
  );
};

export default TransactionsPage;
