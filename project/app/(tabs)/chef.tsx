import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Clock, ChefHat, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Play, Users, Package } from 'lucide-react-native';

interface OrderItem {
  name: string;
  quantity: number;
  customizations?: string[];
}

interface Order {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  specialRequests: string[];
  timeElapsed: number; // in minutes
  status: 'PLACED' | 'PREPARING' | 'READY';
  placedAt: Date;
}

interface BatchItem {
  id: string;
  name: string;
  servingsRemaining: number;
  totalServings: number;
  batchStartedAt: Date | null;
  prepTime: number; // in minutes
  isActive: boolean;
}

export default function ChefDashboard() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'TABLE-04-A1',
      tableNumber: 'Table 04',
      items: [
        { name: 'Crispy Calamari', quantity: 2, customizations: ['Extra crispy', 'Spicy'] },
        { name: 'Grilled Salmon', quantity: 1, customizations: ['Medium rare'] },
      ],
      specialRequests: ['No onions', 'Allergy: Nuts'],
      timeElapsed: 3,
      status: 'PLACED',
      placedAt: new Date(Date.now() - 3 * 60 * 1000),
    },
    {
      id: 'TABLE-07-B2',
      tableNumber: 'Table 07',
      items: [
        { name: 'Truffle Pasta', quantity: 1, customizations: ['Extra truffle'] },
        { name: 'Caesar Salad', quantity: 1, customizations: ['Add chicken'] },
      ],
      specialRequests: ['Extra sauce'],
      timeElapsed: 8,
      status: 'PREPARING',
      placedAt: new Date(Date.now() - 8 * 60 * 1000),
    },
    {
      id: 'COUNTER-01',
      tableNumber: 'Counter 01',
      items: [
        { name: 'Buffalo Wings', quantity: 3, customizations: ['Extra spicy'] },
        { name: 'Chocolate Milkshake', quantity: 2 },
      ],
      specialRequests: ['Rush order'],
      timeElapsed: 12,
      status: 'PREPARING',
      placedAt: new Date(Date.now() - 12 * 60 * 1000),
    },
  ]);

  const [batchItems, setBatchItems] = useState<BatchItem[]>([
    {
      id: 'biryani',
      name: 'Biryani',
      servingsRemaining: 45,
      totalServings: 100,
      batchStartedAt: new Date(Date.now() - 20 * 60 * 1000),
      prepTime: 45,
      isActive: true,
    },
    {
      id: 'soup',
      name: 'Tomato Soup',
      servingsRemaining: 0,
      totalServings: 50,
      batchStartedAt: null,
      prepTime: 30,
      isActive: false,
    },
    {
      id: 'bread',
      name: 'Garlic Bread',
      servingsRemaining: 12,
      totalServings: 60,
      batchStartedAt: new Date(Date.now() - 35 * 60 * 1000),
      prepTime: 25,
      isActive: true,
    },
  ]);

  const [showBatchManagement, setShowBatchManagement] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatchItem, setSelectedBatchItem] = useState<BatchItem | null>(null);

  // Update timers every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => prev.map(order => ({
        ...order,
        timeElapsed: Math.floor((Date.now() - order.placedAt.getTime()) / (1000 * 60))
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getTimerColor = (timeElapsed: number) => {
    if (timeElapsed <= 5) return '#22c55e'; // Green
    if (timeElapsed <= 10) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

  const getCustomizationTagColor = (customization: string) => {
    if (customization.toLowerCase().includes('allergy')) return '#ef4444';
    if (customization.toLowerCase().includes('no ') || customization.toLowerCase().includes('without')) return '#f97316';
    return '#3b82f6';
  };

  const getBatchCardColor = (item: BatchItem) => {
    if (item.servingsRemaining === 0) return '#ef4444';
    const percentage = item.servingsRemaining / item.totalServings;
    if (percentage <= 0.25) return '#f97316';
    if (percentage <= 0.5) return '#fbbf24';
    return '#22c55e';
  };

  const completeOrder = (orderId: string) => {
    Alert.alert(
      'Complete Order',
      `Mark order ${orderId} as ready?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            setOrders(prev => prev.map(order => 
              order.id === orderId 
                ? { ...order, status: 'READY' as const }
                : order
            ));
          }
        }
      ]
    );
  };

  const startNewBatch = (item: BatchItem, batchSize: number) => {
    setBatchItems(prev => prev.map(batchItem => 
      batchItem.id === item.id
        ? {
            ...batchItem,
            servingsRemaining: batchSize,
            totalServings: batchSize,
            batchStartedAt: new Date(),
            isActive: true,
          }
        : batchItem
    ));
    setShowBatchModal(false);
    setSelectedBatchItem(null);
  };

  const getBatchStatusMessage = (item: BatchItem) => {
    if (!item.isActive || item.servingsRemaining === 0) {
      return 'No active batch';
    }
    
    const minutesAgo = Math.floor((Date.now() - (item.batchStartedAt?.getTime() || 0)) / (1000 * 60));
    return `Batch started ${minutesAgo} minutes ago, ${item.servingsRemaining} servings remaining`;
  };

  const renderOrderCard = (order: Order) => (
    <View key={order.id} style={styles.orderCard}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.tableNumber}>{order.tableNumber}</Text>
        </View>
        <View style={[styles.timerContainer, { backgroundColor: getTimerColor(order.timeElapsed) }]}>
          <Clock size={16} color="#fff" />
          <Text style={styles.timerText}>{order.timeElapsed}m</Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.orderItems}>
        <Text style={styles.sectionTitle}>Order List:</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemText}>
              {item.quantity}x {item.name}
            </Text>
            {item.customizations && item.customizations.length > 0 && (
              <View style={styles.customizationsContainer}>
                {item.customizations.map((custom, customIndex) => (
                  <View 
                    key={customIndex} 
                    style={[styles.customizationTag, { backgroundColor: getCustomizationTagColor(custom) }]}
                  >
                    <Text style={styles.customizationText}>{custom}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Special Requests */}
      {order.specialRequests.length > 0 && (
        <View style={styles.specialRequestsContainer}>
          <Text style={styles.sectionTitle}>Special Requests:</Text>
          {order.specialRequests.map((request, index) => (
            <View 
              key={index} 
              style={[
                styles.specialRequestTag,
                { backgroundColor: request.toLowerCase().includes('allergy') ? '#ef4444' : '#f97316' }
              ]}
            >
              <AlertTriangle size={14} color="#fff" />
              <Text style={styles.specialRequestText}>{request}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Order Status */}
      <View style={styles.orderStatus}>
        <Text style={styles.statusLabel}>Status:</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: order.status === 'READY' ? '#22c55e' : order.status === 'PREPARING' ? '#fbbf24' : '#3b82f6' }
        ]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      {/* Complete Button */}
      {order.status !== 'READY' && (
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => completeOrder(order.id)}
        >
          <CheckCircle size={20} color="#fff" />
          <Text style={styles.completeButtonText}>Complete Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderBatchCard = (item: BatchItem) => (
    <View key={item.id} style={[styles.batchCard, { borderLeftColor: getBatchCardColor(item) }]}>
      <Text style={styles.batchItemName}>{item.name}</Text>
      
      <View style={styles.servingsContainer}>
        <Text style={styles.servingsLabel}>Servings Remaining:</Text>
        <Text style={[styles.servingsCount, { color: getBatchCardColor(item) }]}>
          {item.servingsRemaining}
        </Text>
      </View>

      <Text style={styles.batchStatus}>
        {getBatchStatusMessage(item)}
      </Text>

      <TouchableOpacity 
        style={styles.startBatchButton}
        onPress={() => {
          setSelectedBatchItem(item);
          setShowBatchModal(true);
        }}
      >
        <Play size={16} color="#000" />
        <Text style={styles.startBatchText}>Start New Batch</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ChefHat size={24} color="#fbbf24" />
        <Text style={styles.title}>Chef's Dashboard</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.batchManagementButton}
            onPress={() => setShowBatchManagement(true)}
          >
            <Package size={20} color="#fbbf24" />
          </TouchableOpacity>
          <Users size={20} color="#ccc" />
          <Text style={styles.activeOrders}>{orders.filter(o => o.status !== 'READY').length} Active</Text>
        </View>
      </View>

      {/* Order Queue - Main Screen */}
      <View style={styles.orderQueue}>
        <Text style={styles.queueTitle}>Order Queue</Text>
        <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
          {orders
            .sort((a, b) => a.placedAt.getTime() - b.placedAt.getTime())
            .map(renderOrderCard)}
        </ScrollView>
      </View>

      {/* Batch Management Modal */}
      <Modal visible={showBatchManagement} animationType="slide" transparent>
        <View style={styles.batchModalOverlay}>
          <View style={styles.batchModalContent}>
            <View style={styles.batchModalHeader}>
              <Text style={styles.batchModalTitle}>Batch Management</Text>
              <TouchableOpacity onPress={() => setShowBatchManagement(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.batchModalScroll} showsVerticalScrollIndicator={false}>
              {batchItems.map(renderBatchCard)}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Batch Size Modal */}
      <Modal visible={showBatchModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Start New Batch: {selectedBatchItem?.name}
            </Text>
            <Text style={styles.modalSubtitle}>Select batch size:</Text>
            
            <TouchableOpacity 
              style={styles.batchSizeButton}
              onPress={() => selectedBatchItem && startNewBatch(selectedBatchItem, 100)}
            >
              <Text style={styles.batchSizeText}>Large: 100 Servings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.batchSizeButton}
              onPress={() => selectedBatchItem && startNewBatch(selectedBatchItem, 50)}
            >
              <Text style={styles.batchSizeText}>Medium: 50 Servings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.batchSizeButton}
              onPress={() => selectedBatchItem && startNewBatch(selectedBatchItem, 25)}
            >
              <Text style={styles.batchSizeText}>Small: 25 Servings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                setShowBatchModal(false);
                setSelectedBatchItem(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batchManagementButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeOrders: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  orderQueue: {
    flex: 1,
    padding: 16,
  },
  queueTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  ordersList: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  tableNumber: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  orderItems: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  orderItem: {
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  customizationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  customizationTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  customizationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  specialRequestsContainer: {
    marginBottom: 12,
  },
  specialRequestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  specialRequestText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: '#ccc',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  batchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  batchModalContent: {
    backgroundColor: '#222',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  batchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  batchModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  batchModalScroll: {
    maxHeight: 400,
  },
  batchCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  batchItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  servingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  servingsLabel: {
    fontSize: 14,
    color: '#ccc',
  },
  servingsCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  batchStatus: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 12,
    lineHeight: 16,
  },
  startBatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fbbf24',
    paddingVertical: 10,
    borderRadius: 8,
  },
  startBatchText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  batchSizeButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  batchSizeText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});