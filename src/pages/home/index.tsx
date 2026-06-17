import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import QuickEntry from '@/components/QuickEntry';
import BoatCard from '@/components/BoatCard';
import { mockHomeStats, quickEntries, mockBoats } from '@/data/boats';

const HomePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  usePullDownRefresh(() => {
    handleRefresh();
  });

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('[HomePage] 开始刷新');
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
      console.log('[HomePage] 刷新完成');
    }, 1500);
  }, []);

  const handleSearch = () => {
    Taro.showToast({ title: '搜索功能开发中', icon: 'none' });
    console.log('[HomePage] 点击搜索');
  };

  const handleScan = () => {
    Taro.showToast({ title: '扫码功能开发中', icon: 'none' });
    console.log('[HomePage] 点击扫码');
  };

  const handleViewMoreBoats = () => {
    Taro.switchTab({ url: '/pages/queue/index' }).catch(err => {
      console.error('[HomePage] 跳转排队页失败:', err);
    });
  };

  const dockedBoats = mockBoats.filter(b => b.status === 'docked');

  return (
    <View className={styles.homePage}>
      <View className={styles.header}>
        <View className={styles.portInfo}>
          <View className={styles.portName}>
            <Text>📍</Text>
            <Text>中心渔港码头</Text>
          </View>
          <View className={styles.weather}>
            <Text>☀️ 晴 26°C</Text>
            <Text>|</Text>
            <Text>风力3级</Text>
          </View>
        </View>
        <View className={styles.searchBar} onClick={handleSearch}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchText}>搜索渔船/渔获品类/交易单号</Text>
          <View className={styles.scanBtn} onClick={(e) => { e.stopPropagation(); handleScan(); }}>
            <Text>📷</Text>
            <Text>扫码</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statsGrid}>
          {mockHomeStats.map(stat => (
            <StatCard key={stat.label} data={stat} />
          ))}
        </View>
      </View>

      <View className={styles.quickSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.title}>
            <Text>⚡</Text>
            快捷功能
          </Text>
          <Text className={styles.more}>全部 ></Text>
        </View>
        <View className={styles.quickGrid}>
          {quickEntries.map(entry => (
            <QuickEntry
              key={entry.name}
              name={entry.name}
              page={entry.page}
              icon={entry.icon}
              color={entry.color}
            />
          ))}
        </View>
      </View>

      <View className={styles.boatsSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.title}>
            <Text>🚢</Text>
            在港渔船
          </Text>
          <Text className={styles.more} onClick={handleViewMoreBoats}>
            查看全部
            <Text>></Text>
          </Text>
        </View>
        <View className={styles.boatsList}>
          {dockedBoats.length > 0 ? (
            dockedBoats.map(boat => (
              <BoatCard key={boat.id} data={boat} />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text>暂无在港渔船</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default HomePage;
