import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TradeCard from '@/components/TradeCard';
import { mockBidItems, mockColdChainVehicles } from '@/data/trades';
import { getStatusText, formatWeight } from '@/utils';
import type { ColdChainVehicle, BidItem } from '@/types';

type TabType = 'all' | 'bidding' | 'success';

const TradePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  usePullDownRefresh(() => {
    console.log('[TradePage] 开始刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
      console.log('[TradePage] 刷新完成');
    }, 1500);
  });

  const entries = [
    { name: '渔获过磅', desc: '分类过磅', icon: '⚖️', color: '#0077B6', page: '/pages/weighing/index' },
    { name: '交易撮合', desc: '买家竞价', icon: '🤝', color: '#FFB627', page: '/pages/bidding/index' },
    { name: '冷链对接', desc: '冷藏运输', icon: '❄️', color: '#48CAE4', page: '/pages/coldchain/index' },
    { name: '质量抽检', desc: '品质检测', icon: '🔬', color: '#EF476F', page: '/pages/inspection/index' }
  ];

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'bidding', label: '竞价中' },
    { key: 'success', label: '已成交' }
  ];

  const handleEntryClick = (page: string) => {
    Taro.navigateTo({ url: page }).catch(err => {
      console.error('[TradePage] 跳转失败:', err);
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    });
  };

  const filteredBids: BidItem[] = activeTab === 'all'
    ? mockBidItems
    : mockBidItems.filter(b => b.status === activeTab);

  const activeBidsCount = mockBidItems.filter(b => b.status === 'bidding').length;
  const totalWeight = mockBidItems.reduce((s, b) => s + b.weight, 0);
  const successCount = mockBidItems.filter(b => b.status === 'success').length;

  const getChainStatusClass = (status: ColdChainVehicle['status']) => {
    const map: Record<string, string> = {
      idle: styles.chainStatusIdle,
      loading: styles.chainStatusLoading,
      transporting: styles.chainStatusTransporting,
      arrived: styles.chainStatusArrived
    };
    return map[status];
  };

  return (
    <ScrollView scrollY className={styles.tradePage}>
      <View className={styles.entrySection}>
        <View className={styles.entryGrid}>
          {entries.map(entry => (
            <View
              key={entry.name}
              className={styles.entry}
              onClick={() => handleEntryClick(entry.page)}
            >
              <View
                className={styles.entryIcon}
                style={{ backgroundColor: `${entry.color}15` }}
              >
                <Text style={{ color: entry.color }}>{entry.icon}</Text>
              </View>
              <Text className={styles.entryName}>{entry.name}</Text>
              <Text className={styles.entryDesc}>{entry.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.statsCards}>
        <View className={styles.statCard}>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Text className={styles.statNum}>{activeBidsCount}</Text>
            <Text className={styles.statUnit}>场</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Text className={styles.statLabel}>进行中</Text>
            <Text className={styles.statTag}>热</Text>
          </View>
        </View>
        <View className={styles.statCard}>
          <View style={{ display: 'flex', alignItems: 'baseline' }}>
            <Text className={styles.statNum}>{(totalWeight / 1000).toFixed(1)}</Text>
            <Text className={styles.statUnit}>吨</Text>
          </View>
          <Text className={styles.statLabel}>总交易量</Text>
        </View>
        <View className={styles.statCard}>
          <View style={{ display: 'flex', alignItems: 'baseline' }}>
            <Text className={styles.statNum}>{successCount}</Text>
            <Text className={styles.statUnit}>笔</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Text className={styles.statLabel}>已成交</Text>
            <Text className={styles.statTag}>✓</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabsWrap}>
        {tabs.map(tab => {
          const count = tab.key === 'all'
            ? mockBidItems.length
            : mockBidItems.filter(b => b.status === tab.key).length;
          return (
            <View
              key={tab.key}
              className={classnames(
                styles.tab,
                activeTab === tab.key && styles.tabActive
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text>{tab.label}</Text>
              <Text className={styles.tabCount}>({count})</Text>
            </View>
          );
        })}
      </View>

      <View className={styles.bidList}>
        {filteredBids.length > 0 ? (
          filteredBids.map(bid => (
            <TradeCard key={bid.id} data={bid} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🐟</Text>
            <Text className={styles.emptyText}>暂无交易数据</Text>
          </View>
        )}
      </View>

      <View className={styles.chainSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text>❄️</Text>
            冷链车辆动态
          </Text>
          <Text
            className={styles.viewAll}
            onClick={() => handleEntryClick('/pages/coldchain/index')}
          >
            查看全部 >
          </Text>
        </View>
        <View className={styles.chainList}>
          {mockColdChainVehicles.slice(0, 3).map(vehicle => (
            <View key={vehicle.id} className={styles.chainItem}>
              <View className={styles.chainInfo}>
                <View className={styles.chainIcon}>
                  <Text>🚛</Text>
                </View>
                <View className={styles.chainDetails}>
                  <Text className={styles.chainPlate}>{vehicle.plateNumber}</Text>
                  <View className={styles.chainDriver}>
                    <Text>👤 {vehicle.driver}</Text>
                    <Text>|</Text>
                    <Text>📦 {vehicle.capacity}吨</Text>
                    <Text>|</Text>
                    <Text>🌡️ {vehicle.temperature}°C</Text>
                  </View>
                </View>
              </View>
              <View className={classnames(styles.chainStatus, getChainStatusClass(vehicle.status))}>
                <Text>{getStatusText(vehicle.status, 'vehicle')}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default TradePage;
