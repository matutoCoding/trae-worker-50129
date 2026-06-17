import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { BidItem } from '@/types';
import { getStatusText, formatWeight } from '@/utils';

interface TradeCardProps {
  data: BidItem;
}

const TradeCard: React.FC<TradeCardProps> = ({ data }) => {
  const statusClass = classnames(
    styles.status,
    data.status === 'bidding' && styles.statusBidding,
    data.status === 'success' && styles.statusSuccess,
    data.status === 'failed' && styles.statusFailed
  );

  const qualityClass = classnames(
    styles.quality,
    data.quality === 'A' && styles.qualityA,
    data.quality === 'B' && styles.qualityB,
    data.quality === 'C' && styles.qualityC
  );

  const handleView = () => {
    Taro.navigateTo({
      url: `/pages/bidding/index?id=${data.id}`
    }).catch(err => {
      console.error('[TradeCard] 跳转失败:', err);
    });
  };

  const handleBid = () => {
    Taro.showToast({ title: '进入竞价', icon: 'none' });
    console.log('[TradeCard] 竞价:', data.id);
    handleView();
  };

  return (
    <View className={styles.tradeCard} onClick={handleView}>
      <View className={styles.header}>
        <View className={styles.title}>
          <View className={styles.fishIcon}>
            <Text>🐟</Text>
          </View>
          <Text className={styles.categoryName}>{data.categoryName}</Text>
          <View className={qualityClass}>
            <Text>{data.quality}级</Text>
          </View>
        </View>
        <View className={statusClass}>
          <Text>{getStatusText(data.status, 'bid')}</Text>
        </View>
      </View>

      <View className={styles.infoGrid}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>数量</Text>
          <Text className={styles.infoValue}>{formatWeight(data.weight)}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>起拍价</Text>
          <Text className={styles.infoValue}>¥{data.startPrice}/kg</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>当前价</Text>
          <Text className={classnames(styles.infoValue, styles.infoValuePrice)}>¥{data.currentPrice}/kg</Text>
        </View>
      </View>

      <View className={styles.boatInfo}>
        <View>
          <Text>🚢 来源: {data.boatName}</Text>
        </View>
        {data.status === 'bidding' ? (
          <View className={styles.countdown}>
            <Text>⏱</Text>
            <Text>截止 {data.endTime.slice(11, 16)}</Text>
          </View>
        ) : (
          <View className={styles.bidCount}>
            <Text>🔨</Text>
            <Text>{data.bidCount}次出价</Text>
          </View>
        )}
      </View>

      {data.status === 'bidding' && (
        <View className={styles.footer}>
          <View className={classnames(styles.action, styles.actionSecondary)} onClick={(e) => { e.stopPropagation(); handleView(); }}>
            <Text>查看详情</Text>
          </View>
          <View className={classnames(styles.action, styles.actionPrimary)} onClick={(e) => { e.stopPropagation(); handleBid(); }}>
            <Text>立即出价</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TradeCard;
