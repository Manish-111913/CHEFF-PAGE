import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Clock, CircleCheck as CheckCircle, Truck, ChefHat, Package, MapPin, Phone, MessageCircle } from 'lucide-react-native';

interface OrderStatus {
  id: string;
  status: 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
  timestamp: Date;
}

interface Order {
  id: string;
  items: string[];
  total: number;
  orderTime: Date;
  estimatedDelivery: Date;
  currentStatus: 'preparing' | 'ready' | 'out-for-delivery' | 'delivered';
  statusHistory: OrderStatus[];
  deliveryAddress: string;
  contactNumber: string;
}

export default function OrdersScreen() {
  const [activeOrder, setActiveOrder] = useState<Order>({
    id: 'ORD-2024-001',
    items: ['Crispy Calamari x2', 'Grilled Salmon x1', 'Chocolate Lava Cake x1'],
    total: 44.47,
    orderTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes from now
    currentStatus: 'preparing',
    statusHistory: [
      {
        id: '1',
        status: 'preparing',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      }
    ],
    deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    contactNumber: '+1 (555) 123-4567',
  });

  const [progressAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Simulate order progress
    const timer = setTimeout(() => {
      if (activeOrder.currentStatus === 'preparing') {
        setActiveOrder(prev => ({
          ...prev,
          currentStatus: 'ready',
          statusHistory: [
            ...prev.statusHistory,
            {
              id: '2',
              status: 'ready',
              timestamp: new Date(),
            }
          ]
        }));
      }
    }, 10000); // Change status after 10 seconds

    return () => clearTimeout(timer);
  }, [activeOrder.currentStatus]);

  useEffect(() => {
    // Animate progress bar based on status
    const progress = getProgressValue(activeOrder.currentStatus);
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [activeOrder.currentStatus]);

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'preparing': return 0.25;
      case 'ready': return 0.5;
      case 'out-for-delivery': return 0.75;
      case 'delivered': return 1;
      default: return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return ChefHat;
      case 'ready': return Package;
      case 'out-for-delivery': return Truck;
      case 'delivered': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return '#fbbf24';
      case 'ready': return '#10b981';
      case 'out-for-delivery': return '#3b82f6';
      case 'delivered': return '#22c55e';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Preparing your order';
      case 'ready': return 'Order ready for pickup';
      case 'out-for-delivery': return 'Out for delivery';
      case 'delivered': return 'Order delivered';
      default: return 'Processing';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEstimatedDeliveryText = () => {
    const now = new Date();
    const diff = activeOrder.estimatedDelivery.getTime() - now.getTime();
    const minutes = Math.ceil(diff / (1000 * 60));
    
    if (minutes > 0) {
      return `${minutes} minutes`;
    } else {
      return 'Arriving soon';
    }
  };

  const statusSteps = [
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { key: 'ready', label: 'Ready', icon: Package },
    { key: 'out-for-delivery', label: 'On the way', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === activeOrder.currentStatus);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Tracking</Text>
        <Text style={styles.orderId}>#{activeOrder.id}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIconContainer, { backgroundColor: getStatusColor(activeOrder.currentStatus) }]}>
              {React.createElement(getStatusIcon(activeOrder.currentStatus), {
                size: 24,
                color: '#fff',
              })}
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>{getStatusText(activeOrder.currentStatus)}</Text>
              <Text style={styles.statusSubtitle}>
                Estimated delivery: {getEstimatedDeliveryText()}
              </Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Order Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>Order Progress</Text>
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;
            
            return (
              <View key={step.key} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[
                    styles.timelineIcon,
                    isCompleted && styles.timelineIconCompleted,
                    isCurrent && styles.timelineIconCurrent,
                  ]}>
                    <Icon size={16} color={isCompleted ? '#fff' : '#666'} />
                  </View>
                  {index < statusSteps.length - 1 && (
                    <View style={[
                      styles.timelineConnector,
                      isCompleted && styles.timelineConnectorCompleted,
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineLabel,
                    isCompleted && styles.timelineLabelCompleted,
                  ]}>
                    {step.label}
                  </Text>
                  {activeOrder.statusHistory.find(h => h.status === step.key) && (
                    <Text style={styles.timelineTime}>
                      {formatTime(activeOrder.statusHistory.find(h => h.status === step.key)!.timestamp)}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Order Details */}
        <View style={styles.orderCard}>
          <Text style={styles.cardTitle}>Order Details</Text>
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>Order Time:</Text>
            <Text style={styles.orderValue}>{formatTime(activeOrder.orderTime)}</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>Items:</Text>
            <View>
              {activeOrder.items.map((item, index) => (
                <Text key={index} style={styles.orderValue}>{item}</Text>
              ))}
            </View>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>Total:</Text>
            <Text style={[styles.orderValue, styles.totalValue]}>
              ${activeOrder.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryCard}>
          <Text style={styles.cardTitle}>Delivery Information</Text>
          <View style={styles.deliveryInfo}>
            <MapPin size={20} color="#fbbf24" />
            <Text style={styles.deliveryText}>{activeOrder.deliveryAddress}</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Phone size={20} color="#fbbf24" />
            <Text style={styles.deliveryText}>{activeOrder.contactNumber}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={20} color="#fbbf24" />
            <Text style={styles.actionButtonText}>Call Restaurant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color="#fbbf24" />
            <Text style={styles.actionButtonText}>Live Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderId: {
    fontSize: 16,
    color: '#fbbf24',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusSubtitle: {
    color: '#ccc',
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 3,
  },
  timelineCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  timelineIconCompleted: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  timelineIconCurrent: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  timelineConnector: {
    width: 2,
    height: 24,
    backgroundColor: '#333',
    marginTop: 4,
  },
  timelineConnectorCompleted: {
    backgroundColor: '#fbbf24',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineLabel: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  timelineLabelCompleted: {
    color: '#fff',
  },
  timelineTime: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  orderCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderLabel: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
  },
  orderValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  totalValue: {
    color: '#fbbf24',
    fontSize: 16,
  },
  deliveryCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});