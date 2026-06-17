import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockInspections } from '@/data/trades';
import { getStatusText } from '@/utils';
import type { InspectionRecord } from '@/types';

const InspectionPage: React.FC = () => {
  const totalCount = mockInspections.length;
  const passCount = mockInspections.filter(i => i.result === 'pass').length;
  const pendingCount = mockInspections.filter(i => i.result === 'pending').length;
  const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

  const getResultClass = (result: InspectionRecord['result']) => {
    const map: Record<string, string> = {
      pass: styles.resultBadgePass,
      pending: styles.resultBadgePending,
      fail: styles.resultBadgeFail
    };
    return map[result];
  };

  const getQualityClass = (level: InspectionRecord['qualityLevel']) => {
    const map: Record<string, string> = {
      A: styles.qualityLevelA,
      B: styles.qualityLevelB,
      C: styles.qualityLevelC
    };
    return map[level];
  };

  const getIconBg = (result: InspectionRecord['result']) => {
    const map: Record<string, string> = {
      pass: 'linear-gradient(135deg, #06D6A0 0%, #04a380 100%)',
      pending: 'linear-gradient(135deg, #FFB627 0%, #e69500 100%)',
      fail: 'linear-gradient(135deg, #EF476F 0%, #d63031 100%)'
    };
    return map[result];
  };

  const handleNewSampling = () => {
    Taro.showToast({ title: '新增抽检任务', icon: 'none' });
    console.log('[Inspection] 新增抽检任务');
  };

  const handleViewReport = (item: InspectionRecord) => {
    Taro.showModal({
      title: `检测报告 - ${item.sampleNo}`,
      content: `渔船: ${item.boatName}\n品类: ${item.categoryName}\n样品编号: ${item.sampleNo}\n检测结果: ${getStatusText(item.result, 'inspection')}\n质量等级: ${item.qualityLevel}级\n检测员: ${item.inspector}\n检测时间: ${item.checkTime}\n\n检测项目共 ${item.checkItems.length} 项，全部合格。`,
      showCancel: false,
      confirmText: '查看详情'
    });
    console.log('[Inspection] 查看报告:', item.id);
  };

  const handleGenerateReport = (item: InspectionRecord) => {
    Taro.showToast({ title: '生成报告中...', icon: 'loading' });
    setTimeout(() => {
      Taro.showToast({ title: '报告已生成', icon: 'success' });
      console.log('[Inspection] 生成报告:', item.sampleNo);
    }, 1500);
  };

  return (
    <View className={styles.inspectionPage}>
      <View className={styles.statsRow}>
        <View className={classnames(styles.statCard, styles.total)}>
          <Text className={styles.statNum}>{totalCount}</Text>
          <Text className={styles.statLabel}>今日抽检</Text>
        </View>
        <View className={classnames(styles.statCard, styles.passRate)}>
          <Text className={styles.statNum}>{passRate}%</Text>
          <Text className={styles.statLabel}>合格率</Text>
        </View>
        <View className={classnames(styles.statCard, styles.pending)}>
          <Text className={styles.statNum}>{pendingCount}</Text>
          <Text className={styles.statLabel}>检测中</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleIcon}>
            <Text>🔬</Text>
            <Text>抽检记录</Text>
          </View>
          <Text className={styles.action}>全部记录 ></Text>
        </View>

        {mockInspections.map(item => (
          <View key={item.id} className={styles.recordCard}>
            <View className={styles.cardHeader}>
              <View className={styles.sampleInfo}>
                <View
                  className={styles.sampleIcon}
                  style={{ background: getIconBg(item.result) }}
                >
                  <Text>🔬</Text>
                </View>
                <View>
                  <View style={{ display: 'flex', alignItems: 'center' }}>
                    <Text className={styles.sampleName}>{item.categoryName}</Text>
                    <View className={classnames(styles.qualityLevel, getQualityClass(item.qualityLevel))}>
                      <Text>{item.qualityLevel}级</Text>
                    </View>
                  </View>
                  <Text className={styles.sampleSub}>
                    {item.boatName} · 样品 {item.sampleNo}
                  </Text>
                </View>
              </View>
              <View className={classnames(styles.resultBadge, getResultClass(item.result))}>
                <Text>{getStatusText(item.result, 'inspection')}</Text>
              </View>
            </View>

            <View className={styles.checkItems}>
              {item.checkItems.slice(0, 3).map((check, idx) => (
                <View key={idx} className={styles.checkRow}>
                  <Text className={styles.checkName}>✓ {check.name}</Text>
                  <View style={{ display: 'flex', alignItems: 'center' }}>
                    <Text
                      className={styles.checkResult}
                      style={{
                        color: check.result === '合格' || !isNaN(Number(check.result))
                          ? '#06D6A0'
                          : '#FFB627'
                      }}
                    >
                      {check.result}
                    </Text>
                    <Text className={styles.checkStandard}>({check.standard})</Text>
                  </View>
                </View>
              ))}
            </View>

            <View className={styles.cardFooter}>
              <Text>👤 {item.inspector} · 📅 {item.checkTime.slice(5, 16)}</Text>
              <View className={styles.footerActions}>
                {item.result === 'pending' ? (
                  <View className={styles.actionBtn} onClick={() => handleGenerateReport(item)}>
                    <Text>生成报告</Text>
                  </View>
                ) : (
                  <View className={styles.actionBtn} onClick={() => handleViewReport(item)}>
                    <Text>查看报告</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.samplingBtn} onClick={handleNewSampling}>
        <Text className={styles.btnIcon}>🔬</Text>
        <Text className={styles.btnText}>新增抽检</Text>
      </View>
    </View>
  );
};

export default InspectionPage;
