import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockColdChainVehicles } from '@/data/trades';
import { getStatusText } from '@/utils';
import type { ColdChainVehicle } from '@/types';

const ColdchainPage: React.FC = () => {
  const idleCount = mockColdChainVehicles.filter(v => v.status === 'idle').length;
  const loadingCount = mockColdChainVehicles.filter(v => v.status === 'loading').length;
  const transportingCount = mockColdChainVehicles.filter(v => v.status === 'transporting').length;
  const totalCapacity = mockColdChainVehicles.reduce((s, v) => s + v.capacity, 0);

  const getStatusClass = (status: ColdChainVehicle['status']) => {
    const map: Record<string, string> = {
      idle: styles.vehicleStatusIdle,
      loading: styles.vehicleStatusLoading,
      transporting: styles.vehicleStatusTransporting,
      arrived: styles.vehicleStatusArrived
    };
    return map[status];
  };

  const handleDispatch = (vehicle: ColdChainVehicle) => {
    if (vehicle.status !== 'idle') {
      Taro.showToast({ title: '该车辆当前不可调度', icon: 'none' });
      return;
    }
    Taro.showActionSheet({
      itemList: ['发往北京', '发往上海', '发往广州', '发往深圳', '自定义目的地']
    }).then(res => {
      const destinations = ['北京', '上海', '广州', '深圳'];
      const dest = res.tapIndex < 4 ? destinations[res.tapIndex] : '自定义';
      console.log('[ColdChain] 调度车辆:', vehicle.plateNumber, '到:', dest);
      Taro.showToast({ title: `已安排发往${dest}`, icon: 'success' });
    }).catch(err => {
      console.error('[ColdChain] 调度失败:', err);
    });
  };

  const handleTrack = (vehicle: ColdChainVehicle) => {
    Taro.showModal({
      title: '车辆实时位置',
      content: `车牌号: ${vehicle.plateNumber}\n司机: ${vehicle.driver}\n位置: ${vehicle.currentLocation || '获取中...'}\n温度: ${vehicle.temperature}°C\n更新时间: 刚刚`,
      showCancel: false,
      confirmText: '确定'
    });
    console.log('[ColdChain] 追踪车辆:', vehicle.plateNumber);
  };

  const handleCallDriver = (vehicle: ColdChainVehicle) => {
    Taro.showToast({ title: `正在拨打 ${vehicle.driver} ${vehicle.phone}`, icon: 'none' });
    console.log('[ColdChain] 拨打司机电话:', vehicle.driver);
  };

  const orderSteps = [
    { label: '订单创建', active: true },
    { label: '车辆装货', active: true },
    { label: '运输途中', active: true, current: true },
    { label: '到达卸货', active: false }
  ];

  return (
    <View className={styles.coldchainPage}>
      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{idleCount}</Text>
          <Text className={styles.statLabel}>空闲车辆</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{loadingCount}</Text>
          <Text className={styles.statLabel}>装货中</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{transportingCount}</Text>
          <Text className={styles.statLabel}>运输中</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{totalCapacity}</Text>
          <Text className={styles.statLabel}>总容量(吨)</Text>
        </View>
      </View>

      <View className={classnames(styles.section, styles.orderSection)}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleIcon}>
            <Text>📦</Text>
            <Text>进行中的运输单</Text>
          </View>
          <Text className={styles.action}>全部订单 ></Text>
        </View>

        <View className={styles.orderCard}>
          <View className={styles.orderHeader}>
            <Text className={styles.orderNo}>🚚 COLD20260617001</Text>
            <View className={styles.orderStatus}>
              <Text>● 运输中</Text>
            </View>
          </View>
          <View className={styles.orderContent}>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>承运车辆</Text>
              <Text className={styles.orderValue}>沪B·3D91冷链 · 吴师傅</Text>
            </View>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>运输货物</Text>
              <Text className={styles.orderValue}>带鱼3.2吨 · 虾0.85吨 · 鱿鱼1.5吨</Text>
            </View>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>运输路线</Text>
              <Text className={styles.orderValue}>中心渔港 → 上海江阳水产市场</Text>
            </View>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>预计到达</Text>
              <Text className={styles.orderValue} style={{ color: '#0077B6', fontWeight: '600' }}>今日 17:30 · 约2小时后</Text>
            </View>
          </View>
          <View className={styles.progressBar}>
            {orderSteps.map((step, idx) => (
              <View key={idx} className={styles.progressStep}>
                <View
                  className={classnames(
                    styles.stepIcon,
                    step.active && styles.stepActive,
                    step.current && 'animation: pulse 2s infinite'
                  )}
                >
                  <Text>{step.active ? '✓' : idx + 1}</Text>
                </View>
                <Text className={classnames(styles.stepLabel, step.active && styles.stepLabelActive)}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleIcon}>
            <Text>🚛</Text>
            <Text>冷链车辆调度</Text>
          </View>
          <Text className={styles.action}>添加车辆 ></Text>
        </View>
        <View className={styles.vehicleList}>
          {mockColdChainVehicles.map(vehicle => (
            <View key={vehicle.id} className={styles.vehicleCard}>
              <View className={styles.vehicleHeader}>
                <View className={styles.vehicleInfo}>
                  <View className={styles.vehicleIcon}>
                    <Text>🚛</Text>
                  </View>
                  <View>
                    <Text className={styles.vehiclePlate}>{vehicle.plateNumber}</Text>
                    <Text className={styles.vehicleDriver}>👤 {vehicle.driver} · 📱 {vehicle.phone}</Text>
                  </View>
                </View>
                <View className={classnames(styles.vehicleStatus, getStatusClass(vehicle.status))}>
                  <Text>{getStatusText(vehicle.status, 'vehicle')}</Text>
                </View>
              </View>
              <View className={styles.vehicleDetails}>
                <View className={styles.detailItem}>
                  <Text className={styles.detailLabel}>载重容量</Text>
                  <Text className={styles.detailValue}>{vehicle.capacity}吨</Text>
                </View>
                <View className={styles.detailItem}>
                  <Text className={styles.detailLabel}>车厢温度</Text>
                  <Text className={styles.detailValue} style={{ color: '#48CAE4' }}>🌡️ {vehicle.temperature}°C</Text>
                </View>
                <View className={styles.detailItem}>
                  <Text className={styles.detailLabel}>当前位置</Text>
                  <Text className={styles.detailValue}>{vehicle.currentLocation}</Text>
                </View>
              </View>
              <View className={styles.vehicleActions}>
                <View
                  className={classnames(styles.actionBtn, styles.actionBtnSecondary)}
                  onClick={() => handleCallDriver(vehicle)}
                >
                  <Text>📞 联系司机</Text>
                </View>
                <View
                  className={classnames(styles.actionBtn, styles.actionBtnSecondary)}
                  onClick={() => handleTrack(vehicle)}
                >
                  <Text>📍 实时追踪</Text>
                </View>
                <View
                  className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                  onClick={() => handleDispatch(vehicle)}
                >
                  <Text>📋 调度</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ColdchainPage;
