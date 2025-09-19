function OrdersScreen() {
  const { useState, useEffect } = React;
  
  const [activeOrder, setActiveOrder] = useState({
    id: 'ORD-2024-001',
    items: ['Crispy Calamari x2', 'Grilled Salmon x1', 'Chocolate Lava Cake x1'],
    total: 44.47,
    orderTime: new Date(Date.now() - 15 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000),
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

  const [progressWidth, setProgressWidth] = useState('25%');

  useEffect(() => {
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
    }, 10000);

    return () => clearTimeout(timer);
  }, [activeOrder.currentStatus]);

  useEffect(() => {
    const progress = getProgressValue(activeOrder.currentStatus);
    setProgressWidth(progress);
  }, [activeOrder.currentStatus]);

  const getProgressValue = (status) => {
    switch (status) {
      case 'preparing': return '25%';
      case 'ready': return '50%';
      case 'out-for-delivery': return '75%';
      case 'delivered': return '100%';
      default: return '0%';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing': return '👨‍🍳';
      case 'ready': return '📦';
      case 'out-for-delivery': return '🚚';
      case 'delivered': return '✅';
      default: return '🕒';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return '#fbbf24';
      case 'ready': return '#10b981';
      case 'out-for-delivery': return '#3b82f6';
      case 'delivered': return '#22c55e';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing': return 'Preparing your order';
      case 'ready': return 'Order ready for pickup';
      case 'out-for-delivery': return 'Out for delivery';
      case 'delivered': return 'Order delivered';
      default: return 'Processing';
    }
  };

  const formatTime = (date) => {
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
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'ready', label: 'Ready', icon: '📦' },
    { key: 'out-for-delivery', label: 'On the way', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === activeOrder.currentStatus);

  return React.createElement(
    'div',
    { className: 'orders-screen screen' },
    React.createElement(
      'div',
      { className: 'header' },
      React.createElement('h1', { className: 'title' }, 'Order Tracking'),
      React.createElement('span', { className: 'order-id' }, `#${activeOrder.id}`)
    ),
    React.createElement(
      'div',
      { className: 'content' },
      React.createElement(
        'div',
        { className: 'status-card' },
        React.createElement(
          'div',
          { className: 'status-header' },
          React.createElement(
            'div',
            {
              className: 'status-icon-container',
              style: { backgroundColor: getStatusColor(activeOrder.currentStatus) }
            },
            getStatusIcon(activeOrder.currentStatus)
          ),
          React.createElement(
            'div',
            { className: 'status-text-container' },
            React.createElement('h2', { className: 'status-title' }, getStatusText(activeOrder.currentStatus)),
            React.createElement('p', { className: 'status-subtitle' }, `Estimated delivery: ${getEstimatedDeliveryText()}`)
          )
        ),
        React.createElement(
          'div',
          { className: 'progress-container' },
          React.createElement(
            'div',
            { className: 'progress-track' },
            React.createElement('div', {
              className: 'progress-fill',
              style: { width: progressWidth }
            })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'timeline-card' },
        React.createElement('h3', { className: 'card-title' }, 'Order Progress'),
        statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return React.createElement(
            'div',
            { key: step.key, className: 'timeline-item' },
            React.createElement(
              'div',
              { className: 'timeline-icon-container' },
              React.createElement(
                'div',
                {
                  className: `timeline-icon ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`,
                },
                step.icon
              ),
              index < statusSteps.length - 1 && React.createElement('div', {
                className: `timeline-connector ${isCompleted ? 'completed' : ''}`
              })
            ),
            React.createElement(
              'div',
              { className: 'timeline-content' },
              React.createElement(
                'div',
                { className: `timeline-label ${isCompleted ? 'completed' : ''}` },
                step.label
              ),
              activeOrder.statusHistory.find(h => h.status === step.key) && React.createElement(
                'div',
                { className: 'timeline-time' },
                formatTime(activeOrder.statusHistory.find(h => h.status === step.key).timestamp)
              )
            )
          );
        })
      ),
      React.createElement(
        'div',
        { className: 'order-card' },
        React.createElement('h3', { className: 'card-title' }, 'Order Details'),
        React.createElement(
          'div',
          { className: 'order-info' },
          React.createElement('span', { className: 'order-label' }, 'Order Time:'),
          React.createElement('span', { className: 'order-value' }, formatTime(activeOrder.orderTime))
        ),
        React.createElement(
          'div',
          { className: 'order-info' },
          React.createElement('span', { className: 'order-label' }, 'Items:'),
          React.createElement(
            'div',
            null,
            activeOrder.items.map((item, index) =>
              React.createElement('div', { key: index, className: 'order-value' }, item)
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'order-info' },
          React.createElement('span', { className: 'order-label' }, 'Total:'),
          React.createElement('span', { className: 'order-value total-value' }, `$${activeOrder.total.toFixed(2)}`)
        )
      ),
      React.createElement(
        'div',
        { className: 'delivery-card' },
        React.createElement('h3', { className: 'card-title' }, 'Delivery Information'),
        React.createElement(
          'div',
          { className: 'delivery-info' },
          React.createElement('span', null, '📍'),
          React.createElement('span', { className: 'delivery-text' }, activeOrder.deliveryAddress)
        ),
        React.createElement(
          'div',
          { className: 'delivery-info' },
          React.createElement('span', null, '📞'),
          React.createElement('span', { className: 'delivery-text' }, activeOrder.contactNumber)
        )
      ),
      React.createElement(
        'div',
        { className: 'action-buttons' },
        React.createElement(
          'button',
          { className: 'action-button' },
          React.createElement('span', null, '📞'),
          React.createElement('span', { className: 'action-button-text' }, 'Call Restaurant')
        ),
        React.createElement(
          'button',
          { className: 'action-button' },
          React.createElement('span', null, '💬'),
          React.createElement('span', { className: 'action-button-text' }, 'Live Chat')
        )
      )
    )
  );
}