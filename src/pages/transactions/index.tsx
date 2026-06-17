import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockTransactions } from '@/data/market';
import { getStatusText, formatCurrency } from '@/utils';
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

  const filteredTransactions = activeTab === 'all'
    ? mockTransactions
    : mockTransactions.filter(t => t.type === activeTab || (activeTab === 'expense' && t.type === 'refund'));

  const totalIncome = mockTransactions.filter(t => t.type === 'income' && t.status === 'success').reduce((s, t) => s + t.amount, 0);
  const totalExpense = mockTransactions.filter(t => (t.type === 'expense' || t.type === 'refund') && t.status === 'success').reduce((s, t) => s + t.amount, 0);
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
      refund: styles.transAmountRefund
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
    return type === 'income' ? '+' : '-';
  };

  // 按日期分组
  const groupedByDate: Record<string, Transaction[]> = {};
  filteredTransactions.forEach(t => {
    const date = t.time.slice(0, 10);
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(t);
  });

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
    Taro.showModal({
      title: '交易详情',
      content: `交易单号: ${t.id}\n\n交易类型: ${t.type === 'income' ? '收入' : t.type === 'expense' ? '支出' : '退款'}\n交易金额: ${formatCurrency(t.amount)}\n说明: ${t.description}\n关联渔船: ${t.relatedBoat || '无'}\n关联品类: ${t.relatedCategory || '无'}\n操作人: ${t.operator}\n交易时间: ${t.time}\n交易状态: ${getStatusText(t.status, 'transaction')}`,
      showCancel: false,
      confirmText: '知道了'
    });
    console.log('[Transactions] 查看详情:', t.id);
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
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
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
            <Text className={styles.statNum}>¥{(netProfit / 10000).toFixed(1)}</Text>
            <Text className={styles.statUnit}>万</Text>
          </View>
          <Text className={styles.statLabel}>净收入</Text>
        </View>
      </View>

      {Object.entries(groupedByDate).length > 0 ? (
        Object.entries(groupedByDate).map(([date, list]) => {
          const dayIncome = list.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
          const dayExpense = list.filter(t => t.type !== 'income').reduce((s, t) => s + t.amount, 0);
          return (
            <View key={date} className={styles.dateGroup}>
              <View className={styles.dateHeader}>
                <Text className={styles.dateText}>📅 {date}</Text>
                <View>
                  <Text className={styles.incomeSum}>收 +¥{dayIncome.toLocaleString()}</Text>
                  <Text className={styles.expenseSum}>支 -¥{dayExpense.toLocaleString()}</Text>
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
