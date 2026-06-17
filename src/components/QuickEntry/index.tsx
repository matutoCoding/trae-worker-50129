import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface QuickEntryProps {
  name: string;
  page: string;
  icon: string;
  color: string;
}

const QuickEntry: React.FC<QuickEntryProps> = ({ name, page, icon, color }) => {
  const handleClick = () => {
    Taro.navigateTo({ url: page }).catch(err => {
      console.error('[QuickEntry] 跳转失败:', err);
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    });
  };

  return (
    <View className={styles.quickEntry} onClick={handleClick}>
      <View className={styles.iconWrap} style={{ backgroundColor: `${color}15` }}>
        <Text style={{ color }}>{icon}</Text>
      </View>
      <Text className={styles.name}>{name}</Text>
    </View>
  );
};

export default QuickEntry;
