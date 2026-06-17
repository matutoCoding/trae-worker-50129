import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockBidItems, mockBidders } from '@/data/trades';

const BiddingPage: React.FC = () => {
  const bid = mockBidItems[0];
  const [selectedPrice, setSelectedPrice] = useState<number>(bid.currentPrice + 2);
  const [countdown] = useState({ hours: 0, minutes: 28, seconds: 45 });

  const quickPrices = [
    bid.currentPrice + 0.5,
    bid.currentPrice + 1,
    bid.currentPrice + 2,
    bid.currentPrice + 3,
    bid.currentPrice + 5,
    bid.currentPrice + 8
  ];

  const handleSubmitBid = () => {
    if (selectedPrice <= bid.currentPrice) {
      Taro.showToast({ title: '出价必须高于当前价', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认出价',
      content: `确认以 ¥${selectedPrice}/kg 的价格出价？出价后不可撤销。`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '出价成功！', icon: 'success' });
          console.log('[Bidding] 出价成功:', selectedPrice);
        }
      }
    });
  };

  return (
    <View className={styles.biddingPage}>
      <View className={styles.bidInfoHeader}>
        <View className={styles.topRow}>
          <View className={styles.title}>
            <Text>🐟</Text>
            <Text>{bid.categoryName}</Text>
            <Text style={{ padding: '4rpx 12rpx', background: 'rgba(255,255,255,0.2)', borderRadius: '8rpx', fontSize: '24rpx', fontWeight: '600' }}>
              {bid.quality}级
            </Text>
          </View>
          <View className={styles.statusBadge}>
            <Text>🔨 竞价中</Text>
          </View>
        </View>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>来源渔船</Text>
            <Text className={styles.infoValue}>{bid.boatName}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>总数量</Text>
            <Text className={styles.infoValue}>{(bid.weight / 1000).toFixed(1)}吨</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>起拍价</Text>
            <Text className={styles.infoValue}>¥{bid.startPrice}</Text>
          </View>
        </View>
      </View>

      <View className={styles.currentPriceCard}>
        <View className={styles.leftSide}>
          <Text className={styles.label}>当前领先价</Text>
          <View className={styles.priceRow}>
            <Text className={styles.price}>¥{bid.currentPrice}</Text>
            <Text className={styles.unit}>/kg</Text>
          </View>
          <View className={styles.priceChange}>
            <Text>↑</Text>
            <Text>较起拍价 +{(bid.currentPrice - bid.startPrice).toFixed(1)}</Text>
          </View>
        </View>
        <View className={styles.countdown}>
          <Text className={styles.countdownLabel}>距结束</Text>
          <Text className={styles.countdownTime}>
            {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
          </Text>
        </View>
      </View>

      <View className={styles.bidInputSection}>
        <Text className={styles.sectionTitle}>
          <Text>💰</Text>
          我的出价
        </Text>
        <View className={styles.quickPrices}>
          {quickPrices.map(price => (
            <View
              key={price}
              className={classnames(
                styles.quickPrice,
                selectedPrice === price && styles.quickPriceActive
              )}
              onClick={() => setSelectedPrice(price)}
            >
              <Text>¥{price}</Text>
            </View>
          ))}
        </View>
        <View className={styles.customInput}>
          <Text className={styles.inputLabel}>自定义:</Text>
          <View className={styles.inputBox}>
            <Text>{selectedPrice}</Text>
            <Text className={styles.inputUnit}>/kg</Text>
          </View>
        </View>
        <View
          style={{
            fontSize: '24rpx',
            color: '#8AA5B3',
            marginBottom: '24rpx',
            paddingLeft: '8rpx'
          }}
        >
          <Text>💡 预计成交金额: ¥{(selectedPrice * bid.weight).toLocaleString()} ({bid.weight}kg × ¥{selectedPrice}/kg)</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmitBid}>
          <Text>🔨 确认出价</Text>
        </View>
      </View>

      <View className={styles.biddersSection}>
        <View className={styles.sectionTitle}>
          <View style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
            <Text>🏆</Text>
            <Text>竞价排行榜</Text>
          </View>
          <Text className={styles.bidCount}>共 {bid.bidCount} 次出价</Text>
        </View>
        <View className={styles.bidderList}>
          {mockBidders.map((bidder, index) => (
            <View key={bidder.id} className={styles.bidderItem}>
              <View
                className={classnames(
                  styles.bidderRank,
                  index === 0 && styles.bidderRankTop1,
                  index === 1 && styles.bidderRankTop2,
                  index === 2 && styles.bidderRankTop3
                )}
              >
                <Text>{index + 1}</Text>
              </View>
              <View className={styles.bidderInfo}>
                <Text className={styles.bidderName}>{bidder.name}</Text>
                <Text className={styles.bidderTime}>出价时间: {bidder.time}</Text>
              </View>
              <View className={styles.bidderPrice}>
                <Text className={styles.bidderPriceNum}>¥{bidder.price}</Text>
                <Text className={styles.bidderQuantity}>要量 {bidder.quantity}kg</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default BiddingPage;
