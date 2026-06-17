import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockFishCategories, mockBoats } from '@/data/boats';
import { mockWeighingRecords as tradesRecords } from '@/data/trades';
import { getRandomId, formatTime } from '@/utils';
import type { FishCategory, WeighingRecord } from '@/types';

type QualityLevel = 'A' | 'B' | 'C';

const WeighingPage: React.FC = () => {
  const [selectedBoat] = useState(mockBoats[0]);
  const [selectedCategory, setSelectedCategory] = useState<FishCategory>(mockFishCategories[0]);
  const [quality, setQuality] = useState<QualityLevel>('A');
  const [weight, setWeight] = useState<number>(0);
  const [records, setRecords] = useState<WeighingRecord[]>(() => {
    const initialRecords = tradesRecords.filter(r => r.boatId === selectedBoat.id);
    console.log('[Weighing] 初始化记录:', initialRecords.length, '条');
    return initialRecords;
  });
  const [batchNo] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-A-${getRandomId()}`;
  });

  const handleChangeBoat = () => {
    Taro.showActionSheet({
      itemList: mockBoats.map(b => `${b.name} - ${b.number}`)
    }).then(res => {
      const newBoat = mockBoats[res.tapIndex];
      console.log('[Weighing] 选择船只:', newBoat.name);
      Taro.showToast({ title: `已切换到${newBoat.name}`, icon: 'none' });
    }).catch(err => {
      console.error('[Weighing] 选择船只失败:', err);
    });
  };

  const handleWeigh = () => {
    const newWeight = Math.floor(Math.random() * 2000) + 500;
    setWeight(newWeight);
    Taro.vibrateShort({ type: 'medium' });
    console.log('[Weighing] 过磅重量:', newWeight, 'kg');
  };

  const handleAddRecord = () => {
    if (weight === 0) {
      Taro.showToast({ title: '请先过磅称重', icon: 'none' });
      return;
    }

    const now = new Date();
    const newRecord: WeighingRecord = {
      id: `W${now.getTime()}`,
      boatId: selectedBoat.id,
      boatName: selectedBoat.name,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      weight: weight,
      unit: 'kg',
      quality: quality,
      weighTime: formatTime(now),
      operator: '操作员-王磊',
      temperature: -18,
      batchNo: `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${quality}-${getRandomId()}`
    };

    setRecords(prev => {
      const updated = [newRecord, ...prev];
      console.log('[Weighing] 添加新记录:', newRecord.categoryName, newRecord.weight, 'kg, 当前共', updated.length, '条');
      return updated;
    });

    Taro.showToast({ title: '已添加记录', icon: 'success' });
    setWeight(0);
  };

  const handleSubmit = () => {
    if (records.length === 0) {
      Taro.showToast({ title: '暂无过磅记录', icon: 'none' });
      return;
    }
    const totalW = records.reduce((s, r) => s + r.weight, 0);
    Taro.showModal({
      title: '确认生成单据',
      content: `共 ${records.length} 条记录，合计 ${totalW} kg，是否生成过秤单据？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '单据已生成', icon: 'success' });
          console.log('[Weighing] 生成单据成功，共', records.length, '条记录，合计', totalW, 'kg');
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  const totalWeight = useMemo(() => {
    return records.reduce((s, r) => s + r.weight, 0);
  }, [records]);

  const qualityOptions: { level: QualityLevel; desc: string; color: string }[] = [
    { level: 'A', desc: '优质品', color: '#06D6A0' },
    { level: 'B', desc: '良好品', color: '#FFB627' },
    { level: 'C', desc: '普通品', color: '#8AA5B3' }
  ];

  return (
    <View className={styles.weighingPage}>
      <View className={styles.boatSelector}>
        <View className={styles.boatIcon}>
          <Text>🚢</Text>
        </View>
        <View className={styles.boatInfo}>
          <Text className={styles.boatName}>{selectedBoat.name}</Text>
          <Text className={styles.boatSub}>{selectedBoat.number} · 船长 {selectedBoat.captain}</Text>
        </View>
        <View className={styles.changeBtn} onClick={handleChangeBoat}>
          <Text>切换</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text>🐟</Text>
          选择渔获种类
        </Text>
        <View className={styles.categoryGrid}>
          {mockFishCategories.map(cat => (
            <View
              key={cat.id}
              className={classnames(
                styles.categoryItem,
                selectedCategory.id === cat.id && styles.categoryItemActive
              )}
              onClick={() => setSelectedCategory(cat)}
            >
              <View className={styles.categoryIcon}>
                <Text>{cat.icon}</Text>
              </View>
              <Text className={styles.categoryName}>{cat.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text>⚖️</Text>
          称重操作
        </Text>
        <View className={styles.weightInputArea}>
          <View className={styles.weightDisplay}>
            <Text className={styles.weightNum}>{weight.toFixed(2)}</Text>
            <Text className={styles.weightUnit}>kg</Text>
          </View>
          <View className={styles.weightActions}>
            <View className={classnames(styles.weightBtn, styles.weightBtnSecondary)} onClick={() => setWeight(0)}>
              <Text>清零</Text>
            </View>
            <View className={classnames(styles.weightBtn, styles.weightBtnPrimary)} onClick={handleWeigh}>
              <Text>📡 一键读取磅重</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text>🏷️</Text>
          质量等级
        </Text>
        <View className={styles.qualitySelector}>
          {qualityOptions.map(opt => (
            <View
              key={opt.level}
              className={classnames(
                styles.qualityOption,
                quality === opt.level && styles.qualityOptionActive,
                quality === opt.level && styles[`qualityOptionActive${opt.level}`]
              )}
              onClick={() => setQuality(opt.level)}
            >
              <Text className={styles.qualityLevel} style={{ color: opt.color }}>{opt.level}</Text>
              <Text className={styles.qualityDesc}>{opt.desc}</Text>
            </View>
          ))}
        </View>
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>批次号</Text>
          <Text className={styles.formValue}>
            <Text>{batchNo}</Text>
          </Text>
        </View>
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>储存温度</Text>
          <Text className={styles.formValue}>
            <Text>🌡️ -18°C</Text>
          </Text>
        </View>
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>操作员</Text>
          <Text className={styles.formValue}>
            <Text>操作员-王磊</Text>
          </Text>
        </View>
        <View
          className={classnames(styles.weightBtn, styles.weightBtnPrimary)}
          style={{ marginTop: '32rpx', height: '80rpx' }}
          onClick={handleAddRecord}
        >
          <Text>➕ 添加此条记录</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text>📋</Text>
          本次过磅记录
          <Text style={{ marginLeft: 'auto', fontSize: '24rpx', color: '#8AA5B3', fontWeight: '400' }}>共{records.length}条</Text>
        </Text>
        <View className={styles.recordsList}>
          {records.map(record => (
            <View key={record.id} className={styles.recordItem}>
              <View className={styles.recordInfo}>
                <View className={styles.recordIcon}>
                  <Text>{mockFishCategories.find(c => c.id === record.categoryId)?.icon || '🐟'}</Text>
                </View>
                <View className={styles.recordText}>
                  <Text className={styles.recordName}>{record.categoryName}</Text>
                  <Text className={styles.recordSub}>{record.batchNo} · {record.weighTime.slice(11, 16)}</Text>
                </View>
              </View>
              <View className={styles.recordWeight}>
                <Text className={styles.recordWeightNum}>{(record.weight / 1000).toFixed(2)}吨</Text>
                <View
                  className={styles.recordTag}
                  style={{
                    background: record.quality === 'A' ? 'rgba(6, 214, 160, 0.12)' : 'rgba(255, 182, 39, 0.12)',
                    color: record.quality === 'A' ? '#06D6A0' : '#FFB627'
                  }}
                >
                  <Text>{record.quality}级</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.footerBar}>
        <View className={styles.totalInfo}>
          <Text className={styles.totalLabel}>过磅合计</Text>
          <Text className={styles.totalValue}>
            {records.length}条 · {(totalWeight / 1000).toFixed(2)}吨
          </Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text>📄 生成单据</Text>
        </View>
      </View>
    </View>
  );
};

export default WeighingPage;
