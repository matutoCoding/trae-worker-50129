import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockOilSubsidies } from '@/data/boats';
import { getStatusText, formatCurrency } from '@/utils';
import type { OilSubsidy } from '@/types';

type TabType = 'boat' | 'subsidy';

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('boat');

  const getSubsidyStatusClass = (status: OilSubsidy['status']) => {
    const map: Record<string, string> = {
      pending: styles.statusBadgePending,
      approved: styles.statusBadgeApproved,
      rejected: styles.statusBadgeRejected
    };
    return map[status];
  };

  const handleInput = (field: string) => {
    Taro.showToast({ title: `${field}输入功能`, icon: 'none' });
    console.log('[Register] 点击字段:', field);
  };

  const handleUpload = (type: string) => {
    Taro.showToast({ title: `上传${type}`, icon: 'none' });
    console.log('[Register] 上传证件:', type);
  };

  const handleAddSubsidy = () => {
    Taro.showToast({ title: '新增油补申请', icon: 'none' });
    console.log('[Register] 新增油补申请');
  };

  const handleViewSubsidy = (item: OilSubsidy) => {
    Taro.showModal({
      title: '油补详情',
      content: `渔船: ${item.boatName}\n补贴周期: ${item.period}\n燃油量: ${item.fuelAmount}升\n补贴金额: ¥${item.subsidyAmount.toLocaleString()}\n申请时间: ${item.applyTime}\n审核状态: ${getStatusText(item.status, 'subsidy')}`,
      showCancel: false
    });
    console.log('[Register] 查看油补:', item.id);
  };

  const handleSave = () => {
    Taro.showModal({
      title: '确认提交',
      content: '确认提交渔船登记信息？提交后将进入审核流程。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '登记成功！', icon: 'success' });
          console.log('[Register] 渔船登记成功');
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  return (
    <View className={styles.registerPage}>
      <View className={styles.tabs}>
        <View className={styles.tabsInner}>
          <View
            className={classnames(styles.tab, activeTab === 'boat' && styles.tabActive)}
            onClick={() => setActiveTab('boat')}
          >
            <Text>🚢 渔船登记</Text>
          </View>
          <View
            className={classnames(styles.tab, activeTab === 'subsidy' && styles.tabActive)}
            onClick={() => setActiveTab('subsidy')}
          >
            <Text>⛽ 油补登记</Text>
          </View>
        </View>
      </View>

      {activeTab === 'boat' ? (
        <>
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text>🚢</Text>
              基本信息
            </Text>
            <View className={styles.formRow} onClick={() => handleInput('渔船名称')}>
              <Text className={styles.formLabel}>
                <Text className={styles.required}>*</Text>
                渔船名称
              </Text>
              <View className={styles.formRowRight} style={{ flex: 1 }}>
                <View className={classnames(styles.formInput, styles.formPlaceholder)}>
                  <Text>请输入渔船名称</Text>
                </View>
                <Text className={styles.arrow}>></Text>
              </View>
            </View>
            <View className={styles.formRow} onClick={() => handleInput('渔船编号')}>
              <Text className={styles.formLabel}>
                <Text className={styles.required}>*</Text>
                渔船编号
              </Text>
              <View className={styles.formRowRight} style={{ flex: 1 }}>
                <View className={classnames(styles.formInput, styles.formPlaceholder)}>
                  <Text>系统自动生成</Text>
                </View>
              </View>
            </View>
            <View className={styles.formRow} onClick={() => handleInput('船长姓名')}>
              <Text className={styles.formLabel}>
                <Text className={styles.required}>*</Text>
                船长姓名
              </Text>
              <View className={styles.formRowRight} style={{ flex: 1 }}>
                <View className={classnames(styles.formInput, styles.formPlaceholder)}>
                  <Text>请输入船长姓名</Text>
                </View>
                <Text className={styles.arrow}>></Text>
              </View>
            </View>
            <View className={styles.formRow} onClick={() => handleInput('联系电话')}>
              <Text className={styles.formLabel}>
                <Text className={styles.required}>*</Text>
                联系电话
              </Text>
              <View className={styles.formRowRight} style={{ flex: 1 }}>
                <View className={classnames(styles.formInput, styles.formPlaceholder)}>
                  <Text>请输入手机号码</Text>
                </View>
                <Text className={styles.arrow}>></Text>
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text>📏</Text>
              船只参数
            </Text>
            <View className={styles.formRow} onClick={() => handleInput('船长')}>
              <Text className={styles.formLabel}>船只长度</Text>
              <View className={styles.formRowRight} style={{ flex: 1 }}>
                <View className={classnames(styles.formInput, styles.formPlaceholder)}>
                  <Text>请输入船只长度</Text>
                </View>
                <Text className={styles.formInput} style={{ color: '#8AA5B3' }}>米</Text>
                <Text className={styles.arrow}>></Text>
              </View>
            </View>
            <View className={styles.formRow} onClick={() => handleInput('吨位')}>
              <Text className={styles.formLabel}>总吨位</Text>
              <View className={styles.formRowRight} style={{ flex: 1 }}>
                <View className={classnames(styles.formInput, styles.formPlaceholder)}>
                  <Text>请输入总吨位</Text>
                </View>
                <Text className={styles.formInput} style={{ color: '#8AA5B3' }}>吨</Text>
                <Text className={styles.arrow}>></Text>
              </View>
            </View>
            <View className={styles.formRow} onClick={() => handleInput('船员数')}>
              <Text className={styles.formLabel}>船员人数</Text>
              <View className={styles.formRowRight} style={{ flex: 1 }}>
                <View className={classnames(styles.formInput, styles.formPlaceholder)}>
                  <Text>请输入船员人数</Text>
                </View>
                <Text className={styles.formInput} style={{ color: '#8AA5B3' }}>人</Text>
                <Text className={styles.arrow}>></Text>
              </View>
            </View>
            <View className={styles.formRow} onClick={() => handleInput('作业类型')}>
              <Text className={styles.formLabel}>作业类型</Text>
              <View className={styles.formRowRight} style={{ flex: 1 }}>
                <View className={classnames(styles.formInput, styles.formPlaceholder)}>
                  <Text>请选择作业类型</Text>
                </View>
                <Text className={styles.arrow}>></Text>
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text>📄</Text>
              证件上传
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#8AA5B3', marginBottom: '16rpx' }}>
              <Text>请上传以下证件照片（确保清晰可辨）</Text>
            </Text>
            <View className={styles.uploadArea}>
              <View className={styles.uploadItem} onClick={() => handleUpload('船舶检验证')}>
                <Text className={styles.uploadIcon}>📷</Text>
                <Text className={styles.uploadText}>船舶检验证</Text>
              </View>
              <View className={styles.uploadItem} onClick={() => handleUpload('所有权证')}>
                <Text className={styles.uploadIcon}>📷</Text>
                <Text className={styles.uploadText}>所有权证</Text>
              </View>
              <View className={styles.uploadItem} onClick={() => handleUpload('捕捞许可证')}>
                <Text className={styles.uploadIcon}>📷</Text>
                <Text className={styles.uploadText}>捕捞许可证</Text>
              </View>
              <View className={styles.uploadItem} onClick={() => handleUpload('身份证')}>
                <Text className={styles.uploadIcon}>📷</Text>
                <Text className={styles.uploadText}>船长身份证</Text>
              </View>
              <View className={styles.uploadItem} onClick={() => handleUpload('其他证件')}>
                <Text className={styles.uploadIcon}>➕</Text>
                <Text className={styles.uploadText}>其他证件</Text>
              </View>
            </View>
          </View>

          <View className={styles.footerBar}>
            <View className={classnames(styles.btn, styles.btnSecondary)}>
              <Text>💾 保存草稿</Text>
            </View>
            <View className={classnames(styles.btn, styles.btnPrimary)} onClick={handleSave}>
              <Text>✅ 提交登记</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={{ padding: '0 32rpx 24rpx' }}>
            <View className={styles.addBtn} onClick={handleAddSubsidy}>
              <Text>➕</Text>
              <Text>新增油补申请</Text>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text>📋</Text>
              油补申请记录
            </Text>
            <View className={styles.subsidyList}>
              {mockOilSubsidies.map(item => (
                <View
                  key={item.id}
                  className={styles.subsidyCard}
                  onClick={() => handleViewSubsidy(item)}
                >
                  <View className={styles.subsidyHeader}>
                    <View className={styles.boatInfo}>
                      <View className={styles.boatIcon}>
                        <Text>🚢</Text>
                      </View>
                      <View>
                        <Text className={styles.boatName}>{item.boatName}</Text>
                        <Text className={styles.boatNumber}>{item.boatNumber}</Text>
                      </View>
                    </View>
                    <View className={classnames(styles.statusBadge, getSubsidyStatusClass(item.status))}>
                      <Text>{getStatusText(item.status, 'subsidy')}</Text>
                    </View>
                  </View>
                  <View className={styles.subsidyDetails}>
                    <View className={styles.detailItem}>
                      <Text className={styles.detailLabel}>补贴周期</Text>
                      <Text className={styles.detailValue} style={{ fontSize: '24rpx' }}>{item.period}</Text>
                    </View>
                    <View className={styles.detailItem}>
                      <Text className={styles.detailLabel}>燃油量</Text>
                      <Text className={styles.detailValue}>{item.fuelAmount}升</Text>
                    </View>
                    <View className={styles.detailItem}>
                      <Text className={styles.detailLabel}>补贴金额</Text>
                      <Text className={styles.detailValue} style={{ color: '#06D6A0' }}>
                        {formatCurrency(item.subsidyAmount)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: '16rpx', fontSize: '22rpx', color: '#8AA5B3' }}>
                    <Text>📅 申请时间: {item.applyTime}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default RegisterPage;
