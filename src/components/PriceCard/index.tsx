import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { MarketPrice } from '@/types';

interface PriceCardProps {
  data: MarketPrice;
}

const PriceCard: React.FC<PriceCardProps> = ({ data }) => {
  const changeClass = classnames(
    styles.change,
    data.trend === 'up' && styles.changeUp,
    data.trend === 'down' && styles.changeDown,
    data.trend === 'flat' && styles.changeFlat
  );

  const getTrendIcon = () => {
    if (data.trend === 'up') return '↑';
    if (data.trend === 'down') return '↓';
    return '→';
  };

  const getChangeText = () => {
    if (data.change === 0) return '持平';
    return `${data.change > 0 ? '+' : ''}${data.change.toFixed(1)}`;
  };

  return (
    <View className={styles.priceCard}>
      <View className={styles.iconWrap}>
        <Text>🐟</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{data.categoryName}</Text>
        <View className={styles.priceRange}>
          <Text>最高 ¥{data.highPrice}</Text>
          <Text>|</Text>
          <Text>最低 ¥{data.lowPrice}</Text>
        </View>
      </View>
      <View className={styles.rightSide}>
        <View>
          <Text className={styles.todayPrice}>¥{data.todayPrice}</Text>
          <Text className={styles.unit}>{data.unit}</Text>
        </View>
        <View className={changeClass}>
          <Text>{getTrendIcon()}</Text>
          <Text>{getChangeText()}</Text>
        </View>
      </View>
    </View>
  );
};

export default PriceCard;
