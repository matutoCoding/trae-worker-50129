import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { QueueItem } from '@/types';
import { getStatusText } from '@/utils';

interface QueueCardProps {
  data: QueueItem;
  onAssign?: (data: QueueItem) => void;
}

const QueueCard: React.FC<QueueCardProps> = ({ data, onAssign }) => {
  const statusClass = classnames(
    styles.status,
    data.status === 'calling' && styles.statusCalling,
    data.status === 'waiting' && styles.statusWaiting,
    data.status === 'docked' && styles.statusDocked,
    data.status === 'passed' && styles.statusPassed
  );

  const handleNotify = () => {
    Taro.showToast({ title: '已通知船主', icon: 'success' });
    console.log('[QueueCard] 通知船主:', data.boatName);
  };

  const handleAssign = () => {
    Taro.showModal({
      title: '确认靠泊',
      content: `确认安排 ${data.boatName} 停靠 ${data.expectedBerth} 泊位？`,
      success: (res) => {
        if (res.confirm) {
          console.log('[QueueCard] 请求分配泊位:', data.expectedBerth);
          onAssign?.(data);
        }
      }
    });
  };

  return (
    <View className={styles.queueCard}>
      <View className={styles.positionBadge}>
        <Text>No.{String(data.position).padStart(2, '0')}</Text>
      </View>

      <View className={styles.topRow}>
        <Text className={styles.boatName}>{data.boatName}</Text>
        <View className={statusClass}>
          <Text>{getStatusText(data.status, 'queue')}</Text>
        </View>
      </View>

      <View className={styles.infoRow}>
        <View className={styles.infoBlock}>
          <Text className={styles.infoLabel}>船只编号</Text>
          <Text className={styles.infoValue}>{data.boatNumber}</Text>
        </View>
        <View className={styles.infoBlock}>
          <Text className={styles.infoLabel}>{data.status === 'docked' ? '靠泊泊位' : '拟泊位置'}</Text>
          <Text className={styles.infoValue}>{data.expectedBerth}</Text>
        </View>
        <View className={styles.infoBlock}>
          <Text className={styles.infoLabel}>{data.status === 'docked' ? '靠泊时间' : '等候时间'}</Text>
          <Text className={styles.infoValue}>{data.status === 'docked' ? (data.dockedTime || data.applyTime).slice(5, 16) : data.waitTime}</Text>
        </View>
      </View>

      {data.status !== 'docked' && (
        <View className={styles.actionRow}>
          <View className={classnames(styles.action, styles.actionSecondary)} onClick={handleNotify}>
            <Text>通知船主</Text>
          </View>
          <View className={classnames(styles.action, styles.actionPrimary)} onClick={handleAssign}>
            <Text>安排靠泊</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default QueueCard;
