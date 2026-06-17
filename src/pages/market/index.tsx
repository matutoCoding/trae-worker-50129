import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import PriceCard from '@/components/PriceCard';
import { mockMarketPrices, mockSettlements, mockTransactions, mockDebts } from '@/data/market';
import { formatCurrency } from '@/utils';
import type { Transaction } from '@/types';

const MarketPage: React.FC = () => {
  usePullDownRefresh(() => {
    console.log('[MarketPage] 开始刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
      console.log('[MarketPage] 刷新完成');
    }, 1500);
  });

  const quickEntries = [
    { name: '结算分账', icon: '💰', color: '#06D6A0', page: '/pages/settlement/index' },
    { name: '欠款管理', icon: '📋', color: '#FFB627', page: '/pages/debt/index' },
    { name: '交易流水', icon: '📊', color: '#0077B6', page: '/pages/transactions/index' },
    { name: '油补登记', icon: '⛽', color: '#EF476F', page: '/pages/register/index?tab=subsidy' }
  ];

  const pendingSettlements = mockSettlements.filter(s => s.status === 'pending').length;
  const completedSettlements = mockSettlements.filter(s => s.status === 'completed');
  const totalCompletedAmount = completedSettlements.reduce((s, item) => s + item.actualAmount, 0);
  const totalPendingAmount = mockSettlements.filter(s => s.status === 'pending').reduce((s, item) => s + item.totalAmount, 0);

  const totalDebt = mockDebts.filter(d => d.status !== 'paid').reduce((s, d) => s + (d.amount - d.paidAmount), 0);

  const handleEntry = (page: string) => {
    Taro.navigateTo({ url: page }).catch(err => {
      console.error('[MarketPage] 跳转失败:', err);
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    });
  };

  const getTransIconClass = (type: Transaction['type']) => {
    const map: Record<string, string> = {
      income: styles.transIconIncome,
      expense: styles.transIconExpense,
      refund: styles.transIconRefund
    };
    return map[type];
  };

  const getTransIcon = (type: Transaction['type']) => {
    const map: Record<string, string> = {
      income: '⬆️',
      expense: '⬇️',
      refund: '↩️'
    };
    return map[type];
  };

  const getTransAmountClass = (type: Transaction['type']) => {
    const map: Record<string, string> = {
      income: styles.transAmountIncome,
      expense: styles.transAmountExpense,
      refund: styles.transAmountRefund
    };
    return map[type];
  };

  const getAmountPrefix = (type: Transaction['type']) => {
    return type === 'income' ? '+' : '-';
  };

  const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });

  return (
    <ScrollView scrollY className={styles.marketPage}>
      <View className={styles.headerSection}>
        <View className={styles.headerTitle}>
          <Text>📈</Text>
          <Text>行情结算中心</Text>
        </View>
        <View className={styles.entryGrid}>
          {quickEntries.map(entry => (
            <View
              key={entry.name}
              className={styles.entry}
              onClick={() => handleEntry(entry.page)}
            >
              <View className={styles.entryIcon}>
                <Text>{entry.icon}</Text>
              </View>
              <Text className={styles.entryName}>{entry.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.settlementSummary}>
        <View className={styles.summaryHeader}>
          <Text className={styles.summaryTitle}>
            <Text>💵</Text>
            今日结算概览
          </Text>
          <Text className={styles.summaryDate}>{today}</Text>
        </View>
        <View className={styles.summaryGrid}>
          <View className={styles.summaryItem}>
            <View style={{ display: 'flex', alignItems: 'baseline' }}>
              <Text className={styles.summaryNum}>{pendingSettlements}</Text>
              <Text className={styles.summaryUnit}>笔</Text>
            </View>
            <Text className={styles.summaryLabel}>待结算</Text>
          </View>
          <View className={styles.summaryItem}>
            <View style={{ display: 'flex', alignItems: 'baseline' }}>
              <Text className={styles.summaryNum}>{completedSettlements.length}</Text>
              <Text className={styles.summaryUnit}>笔</Text>
            </View>
            <Text className={styles.summaryLabel}>已结算</Text>
          </View>
          <View className={styles.summaryItem}>
            <View style={{ display: 'flex', alignItems: 'baseline' }}>
              <Text className={styles.summaryNum}>¥{(totalCompletedAmount / 10000).toFixed(1)}</Text>
              <Text className={styles.summaryUnit}>万</Text>
            </View>
            <Text className={styles.summaryLabel}>已结算金额</Text>
          </View>
        </View>
        <View
          className={styles.summaryAction}
          onClick={() => handleEntry('/pages/settlement/index')}
        >
          <Text>📝 待结算 ¥{totalPendingAmount.toLocaleString()}，点击处理 ></Text>
        </View>
      </View>

      {totalDebt > 0 && (
        <View className={styles.debtBanner}>
          <View className={styles.debtInfo}>
            <View className={styles.debtIcon}>
              <Text>⚠️</Text>
            </View>
            <View className={styles.debtText}>
              <Text className={styles.debtLabel}>应收欠款总额</Text>
              <Text className={styles.debtAmount}>{formatCurrency(totalDebt)}</Text>
            </View>
          </View>
          <View className={styles.debtAction} onClick={() => handleEntry('/pages/debt/index')}>
            <Text>催收管理</Text>
          </View>
        </View>
      )}

      <View className={styles.priceSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text>🐟</Text>
            今日行情价格
          </Text>
          <Text className={styles.viewAll}>查看全部 ></Text>
        </View>
        <View className={styles.priceList}>
          {mockMarketPrices.slice(0, 6).map(price => (
            <PriceCard key={price.id} data={price} />
          ))}
        </View>
      </View>

      <View className={styles.transactionsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text>📋</Text>
            最近交易流水
          </Text>
          <Text className={styles.viewAll} onClick={() => handleEntry('/pages/transactions/index')}>
            查看全部 >
          </Text>
        </View>
        <View className={styles.transList}>
          {mockTransactions.slice(0, 5).map(trans => (
            <View
              key={trans.id}
              className={styles.transItem}
              onClick={() => handleEntry('/pages/transactions/index')}
            >
              <View className={styles.transInfo}>
                <View className={classnames(styles.transIcon, getTransIconClass(trans.type))}>
                  <Text>{getTransIcon(trans.type)}</Text>
                </View>
                <View className={styles.transText}>
                  <Text className={styles.transDesc}>{trans.description}</Text>
                  <Text className={styles.transTime}>{trans.time.slice(5, 16)} · {trans.operator}</Text>
                </View>
              </View>
              <Text className={classnames(styles.transAmount, getTransAmountClass(trans.type))}>
                {getAmountPrefix(trans.type)}{formatCurrency(trans.amount)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MarketPage;
