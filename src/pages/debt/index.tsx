import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockDebts } from '@/data/market';
import { getStatusText, formatCurrency } from '@/utils';
import type { DebtRecord } from '@/types';

type TabType = 'all' | 'unpaid' | 'partial' | 'paid';

const DebtPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'unpaid', label: '未还款' },
    { key: 'partial', label: '部分还款' },
    { key: 'paid', label: '已还清' }
  ];

  const filteredDebts = activeTab === 'all'
    ? mockDebts
    : mockDebts.filter(d => d.status === activeTab);

  const totalDebt = mockDebts.reduce((s, d) => s + d.amount, 0);
  const totalOutstanding = mockDebts.filter(d => d.status !== 'paid').reduce((s, d) => s + (d.amount - d.paidAmount), 0);
  const totalPaid = mockDebts.reduce((s, d) => s + d.paidAmount, 0);

  const unpaidCount = mockDebts.filter(d => d.status === 'unpaid').length;
  const partialCount = mockDebts.filter(d => d.status === 'partial').length;
  const paidCount = mockDebts.filter(d => d.status === 'paid').length;

  const getStatusClass = (status: DebtRecord['status']) => {
    const map: Record<string, string> = {
      unpaid: styles.statusBadgeUnpaid,
      partial: styles.statusBadgePartial,
      paid: styles.statusBadgePaid
    };
    return map[status];
  };

  const handleCollection = (debt: DebtRecord) => {
    Taro.showModal({
      title: '确认催收',
      content: `确认向 ${debt.debtor} 发送催收提醒？\n\n欠款金额: ${formatCurrency(debt.amount - debt.paidAmount)}\n到期日: ${debt.dueDate}`,
      confirmText: '发送提醒',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '催收提醒已发送', icon: 'success' });
          console.log('[Debt] 发送催收:', debt.debtor, debt.amount - debt.paidAmount);
        }
      }
    });
  };

  const handlePayment = (debt: DebtRecord) => {
    const remaining = debt.amount - debt.paidAmount;
    Taro.showModal({
      title: '登记还款',
      content: `${debt.debtor}\n\n剩余欠款: ${formatCurrency(remaining)}\n请在操作后更新系统记录。`,
      confirmText: '确认收款',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '收款记录已更新', icon: 'success' });
          console.log('[Debt] 登记还款:', debt.debtor, remaining);
        }
      }
    });
  };

  const handleCall = (debt: DebtRecord) => {
    Taro.showToast({ title: `正在拨打 ${debt.phone}`, icon: 'none' });
    console.log('[Debt] 拨打:', debt.debtor, debt.phone);
  };

  const handleDetail = (debt: DebtRecord) => {
    Taro.showModal({
      title: '欠款详情',
      content: `欠款人: ${debt.debtor}\n联系电话: ${debt.phone}\n欠款金额: ${formatCurrency(debt.amount)}\n已还金额: ${formatCurrency(debt.paidAmount)}\n剩余欠款: ${formatCurrency(debt.amount - debt.paidAmount)}\n创建日期: ${debt.createDate}\n到期日期: ${debt.dueDate}\n当前状态: ${getStatusText(debt.status, 'debt')}\n\n备注: ${debt.remark || '无'}`,
      showCancel: false
    });
    console.log('[Debt] 查看详情:', debt.id);
  };

  const today = new Date();
  const overdueCount = mockDebts.filter(d => {
    const due = new Date(d.dueDate);
    return due < today && d.status !== 'paid';
  }).length;

  return (
    <View className={styles.debtPage}>
      <View className={styles.summarySection}>
        <Text className={styles.summaryTitle}>💰 应收欠款总额</Text>
        <View>
          <Text className={styles.summaryAmount}>¥{(totalOutstanding / 10000).toFixed(1)}</Text>
          <Text className={styles.summaryUnit}>万元</Text>
        </View>
        <View className={styles.summarySub}>
          <Text>累计欠款: {formatCurrency(totalDebt)}</Text>
          <View className={styles.divider} />
          <Text>已收款: {formatCurrency(totalPaid)}</Text>
          {overdueCount > 0 && (
            <>
              <View className={styles.divider} />
              <Text style={{ color: '#EF476F' }}>⚠️ {overdueCount}笔已逾期</Text>
            </>
          )}
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={classnames(styles.statNum, styles.numUnpaid)}>{unpaidCount}</Text>
          <Text className={styles.statLabel}>未还款</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={classnames(styles.statNum, styles.numPartial)}>{partialCount}</Text>
          <Text className={styles.statLabel}>部分还款</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={classnames(styles.statNum, styles.numPaid)}>{paidCount}</Text>
          <Text className={styles.statLabel}>已还清</Text>
        </View>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.debtList}>
        {filteredDebts.map(debt => {
          const progress = debt.amount > 0 ? (debt.paidAmount / debt.amount) * 100 : 0;
          return (
            <View key={debt.id} className={styles.debtCard} onClick={() => handleDetail(debt)}>
              <View className={styles.cardHeader}>
                <View className={styles.debtorInfo}>
                  <View className={styles.avatar}>
                    <Text>{debt.debtor.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text className={styles.debtorName}>{debt.debtor}</Text>
                    <Text className={styles.debtorPhone}>📱 {debt.phone}</Text>
                  </View>
                </View>
                <View className={classnames(styles.statusBadge, getStatusClass(debt.status))}>
                  <Text>{getStatusText(debt.status, 'debt')}</Text>
                </View>
              </View>

              <View className={styles.amountRow}>
                <View className={styles.amountBlock}>
                  <Text className={styles.amountLabel}>欠款金额</Text>
                  <Text className={styles.amountValue}>{formatCurrency(debt.amount)}</Text>
                </View>
                <View className={styles.amountBlock} style={{ alignItems: 'flex-end' }}>
                  <Text className={styles.amountLabel}>已还金额</Text>
                  <Text className={classnames(styles.amountValue, styles.paidValue)}>
                    {formatCurrency(debt.paidAmount)}
                  </Text>
                </View>
              </View>

              <View className={styles.progressWrap}>
                <View className={styles.progressBar}>
                  <View className={styles.progressFill} style={{ width: `${progress}%` }} />
                </View>
                <View className={styles.progressLabel}>
                  <Text>还款进度 {progress.toFixed(0)}%</Text>
                  <Text>剩余 {formatCurrency(debt.amount - debt.paidAmount)}</Text>
                </View>
              </View>

              <View className={styles.metaRow}>
                <Text className={styles.remark}>📝 {debt.remark || '暂无备注'}</Text>
                <Text>📅 到期: {debt.dueDate}</Text>
              </View>

              {debt.status !== 'paid' && (
                <View className={styles.actions}>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnSecondary)}
                    onClick={(e) => { e.stopPropagation(); handleCall(debt); }}
                  >
                    <Text>📞 电话联系</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnWarning)}
                    onClick={(e) => { e.stopPropagation(); handleCollection(debt); }}
                  >
                    <Text>⏰ 催收提醒</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.actionBtnPrimary)}
                    onClick={(e) => { e.stopPropagation(); handlePayment(debt); }}
                  >
                    <Text>💰 登记还款</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DebtPage;
