import React, { useState, useMemo, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import QueueCard from '@/components/QueueCard';
import { mockQueue, berthInfo as initialBerthInfo } from '@/data/queue';
import { getStatusText } from '@/utils';
import type { QueueItem } from '@/types';

type TabType = 'all' | 'waiting' | 'calling' | 'docked';

const QueuePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [queue, setQueue] = useState<QueueItem[]>(mockQueue);
  const [berthInfo, setBerthInfo] = useState(initialBerthInfo);

  usePullDownRefresh(() => {
    console.log('[QueuePage] 开始刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
      console.log('[QueuePage] 刷新完成');
    }, 1500);
  });

  const handleAssign = useCallback((item: QueueItem) => {
    setQueue(prev => prev.map(q =>
      q.id === item.id ? { ...q, status: 'docked' as const } : q
    ));
    const zoneKey = item.expectedBerth[0] + '区';
    setBerthInfo(prev => prev.map(b => {
      if (b.zone === zoneKey && b.available > 0) {
        return { ...b, occupied: b.occupied + 1, available: b.available - 1 };
      }
      return b;
    }));
  }, []);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'calling', label: '叫号中' },
    { key: 'waiting', label: '排队中' },
    { key: 'docked', label: '已靠泊' }
  ];

  const filteredQueue = useMemo(() => {
    return activeTab === 'all'
      ? queue
      : queue.filter(q => q.status === activeTab);
  }, [activeTab, queue]);

  const totalOccupied = useMemo(() => berthInfo.reduce((s, b) => s + b.occupied, 0), [berthInfo]);
  const totalAvailable = useMemo(() => berthInfo.reduce((s, b) => s + b.available, 0), [berthInfo]);
  const waitingCount = useMemo(() => queue.filter(q => q.status === 'waiting').length, [queue]);
  const callingCount = useMemo(() => queue.filter(q => q.status === 'calling').length, [queue]);

  return (
    <View className={styles.queuePage}>
      <View className={styles.berthOverview}>
        <View className={styles.overviewTitle}>
          <Text>⚓</Text>
          <Text>泊位占用概览</Text>
        </View>
        <View className={styles.berthGrid}>
          {berthInfo.map(zone => (
            <View key={zone.zone} className={styles.berthZone}>
              <Text className={styles.zoneName}>{zone.zone}</Text>
              <View className={styles.zoneStats}>
                <Text className={styles.occupied}>{zone.occupied}</Text>
                <Text>/{zone.total} 可用</Text>
                <Text className={styles.available}>{zone.available}</Text>
              </View>
              <View className={styles.progressBar}>
                <View
                  className={styles.progressFill}
                  style={{ width: `${(zone.occupied / zone.total) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.summaryBar}>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryNum}>{totalOccupied}</Text>
          <Text className={styles.summaryLabel}>已占用泊位</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.summaryItem}>
          <Text className={styles.summaryNum}>{totalAvailable}</Text>
          <Text className={styles.summaryLabel}>空闲泊位</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.summaryItem}>
          <Text className={styles.summaryNum}>{waitingCount}</Text>
          <Text className={styles.summaryLabel}>等待中</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.summaryItem}>
          <Text className={styles.summaryNum} style={{ color: '#EF476F' }}>{callingCount}</Text>
          <Text className={styles.summaryLabel}>叫号中</Text>
        </View>
      </View>

      <View className={styles.tabsWrap}>
        <View className={styles.tabs}>
          {tabs.map(tab => {
            const count = tab.key === 'all'
              ? queue.length
              : queue.filter(q => q.status === tab.key).length;
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
      </View>

      <View className={styles.queueList}>
        {filteredQueue.length > 0 ? (
          filteredQueue.map(item => (
            <QueueCard key={item.id} data={item} onAssign={handleAssign} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>⚓</Text>
            <Text className={styles.emptyText}>
              {getStatusText(activeTab === 'all' ? 'waiting' : activeTab, 'queue')}列表为空
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default QueuePage;
