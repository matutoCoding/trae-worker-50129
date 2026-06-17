import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockSettlements } from '@/data/market';
import { getStatusText, formatCurrency } from '@/utils';
import type { Settlement } from '@/types';

type TabType = 'all' | 'pending' | 'completed' | 'partial';

const SettlementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待结算' },
    { key: 'partial', label: '部分结算' },
    { key: 'completed', label: '已结算' }
  ];

  const filteredSettlements = activeTab === 'all'
    ? mockSettlements
    : mockSettlements.filter(s => s.status === activeTab);

  const totalPendingAmount = mockSettlements.filter(s => s.status === 'pending').reduce((s, i) => s + i.totalAmount, 0);
  const totalCompletedAmount = mockSettlements.filter(s => s.status === 'completed').reduce((s, i) => s + i.actualAmount, 0);
  const totalFee = mockSettlements.reduce((s, i) => s + i.serviceFee, 0);
  const totalSubsidy = mockSettlements.reduce((s, i) => s + i.subsidy, 0);

  const getStatusClass = (status: Settlement['status']) => {
    const map: Record<string, string> = {
      pending: styles.statusBadgePending,
      completed: styles.statusBadgeCompleted,
      partial: styles.statusBadgePartial
    };
    return map[status];
  };

  const handleSettle = (s: Settlement) => {
    Taro.showModal({
      title: '确认结算',
      content: `${s.boatName}\n结算金额: ¥${s.totalAmount.toLocaleString()}\n服务费: ¥${s.serviceFee.toLocaleString()}\n油补抵扣: ¥${s.subsidy.toLocaleString()}\n实际应付: ¥${(s.totalAmount - s.serviceFee + s.subsidy).toLocaleString()}`,
      confirmText: '确认打款',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '打款成功！', icon: 'success' });
          console.log('[Settlement] 结算成功:', s.id, s.boatName);
        }
      }
    });
  };

  const handleViewDetail = (s: Settlement) => {
    Taro.showToast({ title: '查看单据详情', icon: 'none' });
    console.log('[Settlement] 查看详情:', s.id);
  };

  const handlePrint = (s: Settlement) => {
    Taro.showToast({ title: '打印单据中...', icon: 'none' });
    console.log('[Settlement] 打印单据:', s.id);
  };

  return (
    <View className={styles.settlementPage}>
      <View className={styles.summaryCard}>
        <Text className={styles.summaryLabel}>💵 今日待结算总额</Text>
        <View>
          <Text className={styles.summaryAmount}>¥{totalPendingAmount.toLocaleString()}</Text>
          <Text className={styles.amountUnit}>元</Text>
        </View>
        <View className={styles.breakdown}>
          <View className={styles.breakItem}>
            <Text className={styles.breakLabel}>已结算</Text>
            <Text className={styles.breakValue}>¥{(totalCompletedAmount / 10000).toFixed(1)}万</Text>
          </View>
          <View className={styles.breakItem}>
            <Text className={styles.breakLabel}>累计服务费</Text>
            <Text className={styles.breakValue}>¥{totalFee.toLocaleString()}</Text>
          </View>
          <View className={styles.breakItem}>
            <Text className={styles.breakLabel}>油补发放</Text>
            <Text className={styles.breakValue}>¥{totalSubsidy.toLocaleString()}</Text>
          </View>
          <View className={styles.breakItem}>
            <Text className={styles.breakLabel}>结算单据</Text>
            <Text className={styles.breakValue}>{mockSettlements.length}笔</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => {
          const count = tab.key === 'all'
            ? mockSettlements.length
            : mockSettlements.filter(s => s.status === tab.key).length;
          return (
            <View
              key={tab.key}
              className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text>{tab.label}</Text>
              <Text className={styles.tabCount}>({count})</Text>
            </View>
          );
        })}
      </View>

      {filteredSettlements.map(s => (
        <View key={s.id} className={styles.settlementCard}>
          <View className={styles.cardHeader}>
            <View className={styles.boatInfo}>
              <View className={styles.boatIcon}>
                <Text>🚢</Text>
              </View>
              <View>
                <Text className={styles.boatName}>{s.boatName}</Text>
                <Text className={styles.boatDate}>📅 {s.date} · {s.items.length}个品类 · {(s.totalWeight / 1000).toFixed(1)}吨</Text>
              </View>
            </View>
            <View className={classnames(styles.statusBadge, getStatusClass(s.status))}>
              <Text>{getStatusText(s.status, 'settlement')}</Text>
            </View>
          </View>

          <View className={styles.itemsList}>
            {s.items.map((item, idx) => (
              <View key={idx} className={styles.itemRow}>
                <View className={styles.itemInfo}>
                  <View className={styles.itemIcon}>
                    <Text>🐟</Text>
                  </View>
                  <View>
                    <Text className={styles.itemName}>{item.categoryName}</Text>
                    <Text className={styles.itemWeight}>{item.weight}kg × ¥{item.unitPrice}/kg</Text>
                  </View>
                </View>
                <View className={styles.itemAmount}>
                  <Text className={styles.itemTotal}>¥{item.amount.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className={styles.feeRow}>
            <Text className={styles.feeLabel}>📊 成交额合计</Text>
            <Text className={styles.feeValue}>¥{s.totalAmount.toLocaleString()}</Text>
          </View>
          <View className={styles.feeRow}>
            <Text className={styles.feeLabel}>💼 服务费(2%)</Text>
            <Text className={styles.feeValue} style={{ color: '#EF476F' }}>- ¥{s.serviceFee.toLocaleString()}</Text>
          </View>
          <View className={styles.feeRow}>
            <Text className={styles.feeLabel}>⛽ 油补抵扣</Text>
            <Text className={styles.feeValue} style={{ color: '#06D6A0' }}>+ ¥{s.subsidy.toLocaleString()}</Text>
          </View>

          <View className={styles.totalRow}>
            <Text className={styles.totalLabel}>✅ 实际应付</Text>
            <Text className={styles.totalValue}>¥{(s.totalAmount - s.serviceFee + s.subsidy).toLocaleString()}</Text>
          </View>

          <View className={styles.actions}>
            <View className={classnames(styles.actionBtn, styles.actionBtnSecondary)} onClick={() => handlePrint(s)}>
              <Text>🖨️ 打印单据</Text>
            </View>
            <View className={classnames(styles.actionBtn, styles.actionBtnSecondary)} onClick={() => handleViewDetail(s)}>
              <Text>📄 详情</Text>
            </View>
            {s.status !== 'completed' && (
              <View className={classnames(styles.actionBtn, styles.actionBtnPrimary)} onClick={() => handleSettle(s)}>
                <Text>💰 确认打款</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

export default SettlementPage;
