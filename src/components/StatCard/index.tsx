import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { StatItem } from '@/types';

interface StatCardProps {
  data: StatItem;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const trendClass = classnames(
    styles.trend,
    data.trend === 'up' && styles.trendUp,
    data.trend === 'down' && styles.trendDown,
    data.trend === 'flat' && styles.trendFlat
  );

  const getTrendIcon = () => {
    if (data.trend === 'up') return '↑';
    if (data.trend === 'down') return '↓';
    return '→';
  };

  return (
    <View className={styles.statCard}>
      <Text className={styles.label}>{data.label}</Text>
      <View className={styles.valueRow}>
        <Text className={styles.value}>{data.value}</Text>
        {data.unit && <Text className={styles.unit}>{data.unit}</Text>}
      </View>
      {data.trend !== undefined && (
        <View className={trendClass}>
          <Text>{getTrendIcon()}</Text>
          {data.trendValue !== 0 && (
            <Text>{data.trendValue > 0 ? '+' : ''}{data.trendValue}%</Text>
          )}
          <Text>较昨日</Text>
        </View>
      )}
    </View>
  );
};

export default StatCard;
