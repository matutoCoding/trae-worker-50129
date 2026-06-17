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
  const [zoneFilter, setZoneFilter] = useState<string>('全部区域');
  const [berthViewMode, setBerthViewMode] = useState<'board' | 'list'>('board');

  usePullDownRefresh(() => {
    console.log('[QueuePage] 开始刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
      console.log('[QueuePage] 刷新完成');
    }, 1500);
  });

  const handleAssign = useCallback((item: QueueItem) => {
    if (item.status === 'docked') {
      Taro.showToast({ title: '该船已靠泊', icon: 'none' });
      return;
    }
    const zoneKey = item.expectedBerth[0] + '区';
    const zoneAvailable = berthInfo.find(b => b.zone === zoneKey)?.available || 0;
    if (zoneAvailable <= 0) {
      Taro.showToast({
        title: `${zoneKey}泊位已满，无法安排`,
        icon: 'none',
        duration: 2000
      });
      return;
    }
    const now = new Date();
    const dockedTimeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setQueue(prev => prev.map(q =>
      q.id === item.id ? { ...q, status: 'docked' as const, dockedTime: dockedTimeStr } : q
    ));
    setBerthInfo(prev => prev.map(b => {
      if (b.zone === zoneKey && b.available > 0) {
        return { ...b, occupied: b.occupied + 1, available: b.available - 1 };
      }
      return b;
    }));
    Taro.showToast({ title: '泊位已分配', icon: 'success' });
    console.log('[QueuePage] 分配泊位成功:', item.boatName, '->', item.expectedBerth);
  }, [berthInfo]);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'calling', label: '叫号中' },
    { key: 'waiting', label: '排队中' },
    { key: 'docked', label: '已靠泊' }
  ];

  const zoneOptions = useMemo(() => {
    const zones = new Set(queue.map(q => q.expectedBerth[0] + '区'));
    return ['全部区域', ...Array.from(zones)];
  }, [queue]);

  const filteredQueue = useMemo(() => {
    let result = activeTab === 'all'
      ? queue
      : queue.filter(q => q.status === activeTab);
    if (zoneFilter !== '全部区域') {
      result = result.filter(q => (q.expectedBerth[0] + '区') === zoneFilter);
    }
    return result;
  }, [activeTab, queue, zoneFilter]);

  const handleZoneFilter = () => {
    Taro.showActionSheet({
      itemList: zoneOptions
    }).then(res => {
      setZoneFilter(zoneOptions[res.tapIndex]);
      console.log('[QueuePage] 筛选区域:', zoneOptions[res.tapIndex]);
    }).catch(() => {});
  };

  const berthBoardData = useMemo(() => {
    const result: Record<string, {
      zone: string;
      total: number;
      occupied: number;
      available: number;
      berths: {
        number: string;
        status: 'occupied' | 'available' | 'reserved';
        boat?: QueueItem;
      }[];
    }> = {};

    berthInfo.forEach(zoneInfo => {
      const zoneKey = zoneInfo.zone;
      const zoneLetter = zoneKey.replace('区', '');
      const berths: typeof result['']['berths'] = [];
      
      for (let i = 1; i <= zoneInfo.total; i++) {
        const berthNumber = `${zoneLetter}${String(i).padStart(2, '0')}`;
        const dockedBoat = queue.find(q => 
          q.status === 'docked' && q.expectedBerth === berthNumber
        );
        berths.push({
          number: berthNumber,
          status: dockedBoat ? 'occupied' : 'available',
          boat: dockedBoat
        });
      }
      
      result[zoneKey] = {
        zone: zoneKey,
        total: zoneInfo.total,
        occupied: berths.filter(b => b.status === 'occupied').length,
        available: berths.filter(b => b.status === 'available').length,
        berths
      };
    });
    
    return Object.values(result);
  }, [berthInfo, queue]);

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

      <View className={styles.viewSwitch}>
        <View
          className={classnames(styles.viewSwitchTab, berthViewMode === 'board' && styles.viewSwitchTabActive)}
          onClick={() => setBerthViewMode('board')}
        >
          <Text>🅿️ 泊位看板</Text>
        </View>
        <View
          className={classnames(styles.viewSwitchTab, berthViewMode === 'list' && styles.viewSwitchTabActive)}
          onClick={() => setBerthViewMode('list')}
        >
          <Text>📋 排队列表</Text>
        </View>
      </View>

      {berthViewMode === 'board' && (
        <View className={styles.berthBoard}>
          {berthBoardData.map(zone => (
            <View key={zone.zone} className={styles.berthZone}>
              <View className={styles.berthZoneHeader}>
                <Text className={styles.berthZoneTitle}>{zone.zone}</Text>
                <View className={styles.berthZoneStats}>
                  <Text className={styles.berthStatOccupied}>● {zone.occupied}</Text>
                  <Text className={styles.berthStatDivider}>/</Text>
                  <Text className={styles.berthStatTotal}>{zone.total}</Text>
                </View>
              </View>
              <View className={styles.berthGrid}>
                {zone.berths.map(berth => (
                  <View
                    key={berth.number}
                    className={classnames(
                      styles.berthCell,
                      berth.status === 'occupied' && styles.berthCellOccupied,
                      berth.status === 'available' && styles.berthCellAvailable
                    )}
                  >
                    <Text className={styles.berthNumber}>{berth.number}</Text>
                    {berth.boat && (
                      <View className={styles.berthBoatInfo}>
                        <Text className={styles.berthBoatName} numberOfLines={1}>{berth.boat.boatName}</Text>
                        <Text className={styles.berthDockedTime}>{berth.boat.dockedTime?.slice(5, 16) || ''}</Text>
                      </View>
                    )}
                    {!berth.boat && (
                      <Text className={styles.berthAvailableText}>空闲</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {berthViewMode === 'list' && (
        <>
          <View className={styles.tabsWrap}>
            <View className={styles.tabs}>
              {tabs.map(tab => {
                const baseQueue = zoneFilter === '全部区域'
                  ? queue
                  : queue.filter(q => (q.expectedBerth[0] + '区') === zoneFilter);
                const count = tab.key === 'all'
                  ? baseQueue.length
                  : baseQueue.filter(q => q.status === tab.key).length;
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

          <View className={styles.filterBar}>
            <View className={styles.filterItem} onClick={handleZoneFilter}>
              <Text style={{ color: '#8AA5B3', fontSize: '24rpx' }}>泊位区域:</Text>
              <Text style={{ color: '#0077B6', fontSize: '26rpx', fontWeight: 500, marginLeft: '8rpx' }}>{zoneFilter}</Text>
              <Text style={{ color: '#8AA5B3', fontSize: '20rpx', marginLeft: '8rpx' }}>▼</Text>
            </View>
            <Text style={{ color: '#8AA5B3', fontSize: '24rpx' }}>
              共 {filteredQueue.length} 条
            </Text>
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
        </>
      )}
    </View>
  );
};

export default QueuePage;
