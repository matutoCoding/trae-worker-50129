import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Boat } from '@/types';
import { getStatusText } from '@/utils';

interface BoatCardProps {
  data: Boat;
  showAction?: boolean;
  onAction?: () => void;
}

const BoatCard: React.FC<BoatCardProps> = ({ data, showAction = true, onAction }) => {
  const statusClass = classnames(
    styles.status,
    data.status === 'docked' && styles.statusDocked,
    data.status === 'waiting' && styles.statusWaiting,
    data.status === 'atSea' && styles.statusAtSea,
    data.status === 'departed' && styles.statusDeparted
  );

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      Taro.navigateTo({
        url: `/pages/register/index?id=${data.id}`
      }).catch(err => {
        console.error('[BoatCard] 跳转失败:', err);
      });
    }
  };

  return (
    <View className={styles.boatCard}>
      <View className={styles.header}>
        <View className={styles.boatInfo}>
          <View className={styles.boatIcon}>
            <Text>🚢</Text>
          </View>
          <View>
            <Text className={styles.boatName}>{data.name}</Text>
            <Text className={styles.boatNumber}>{data.number}</Text>
          </View>
        </View>
        <View className={statusClass}>
          <Text>{getStatusText(data.status, 'boat')}</Text>
        </View>
      </View>

      <View className={styles.infoGrid}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>船长</Text>
          <Text className={styles.infoValue}>{data.captain}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>吨位</Text>
          <Text className={styles.infoValue}>{data.tonnage}吨</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>船员</Text>
          <Text className={styles.infoValue}>{data.crewCount}人</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.berthInfo}>
          <Text>📍</Text>
          {data.berthNumber ? (
            <Text>泊位: <Text className={styles.berthNum}>{data.berthNumber}</Text></Text>
          ) : data.expectedTime ? (
            <Text>预计: {data.expectedTime.slice(11, 16)}</Text>
          ) : (
            <Text>暂无信息</Text>
          )}
        </View>
        {showAction && (
          <View className={styles.action} onClick={handleAction}>
            <Text>查看详情</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default BoatCard;
