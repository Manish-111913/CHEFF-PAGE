function ChefScreen() {
  const { useState, useEffect } = React;
  
  const [orders, setOrders] = useState([
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
  ]);

  const [batchItems, setBatchItems] = useState([
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
  ]);

  const [showBatchManagement, setShowBatchManagement] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatchItem, setSelectedBatchItem] = useState(null);

  const getTimerColor = (timeElapsed) => {
    if (timeElapsed <= 5) return 'green';
    if (timeElapsed <= 10) return 'yellow';
    return 'red';
  };

  const getCustomizationClass = (customization) => {
    if (customization.toLowerCase().includes('allergy')) return 'allergy';
    if (customization.toLowerCase().includes('no ') || customization.toLowerCase().includes('without')) return 'restriction';
    return 'normal';
  };

  const getBatchCardClass = (item) => {
    if (item.servingsRemaining === 0) return 'red';
    const percentage = item.servingsRemaining / item.totalServings;
    if (percentage <= 0.25) return 'orange';
    if (percentage <= 0.5) return 'yellow';
    return 'green';
  };

  const completeOrder = (orderId) => {
    if (confirm(`Mark order ${orderId} as ready?`)) {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'READY' }
          : order
      ));
    }
  };

  const startNewBatch = (item, batchSize) => {
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

  const getBatchStatusMessage = (item) => {
    if (!item.isActive || item.servingsRemaining === 0) {
      return 'No active batch';
    }
    
    const minutesAgo = Math.floor((Date.now() - (item.batchStartedAt?.getTime() || 0)) / (1000 * 60));
    return `Batch started ${minutesAgo} minutes ago, ${item.servingsRemaining} servings remaining`;
  };

  const renderOrderCard = (order) => {
    return React.createElement(
      'div',
      { key: order.id, className: 'order-card' },
      React.createElement(
        'div',
        { className: 'order-header' },
        React.createElement(
          'div',
          { className: 'order-id-container' },
          React.createElement('div', { className: 'order-id' }, order.id),
          React.createElement('div', { className: 'table-number' }, order.tableNumber)
        ),
        React.createElement(
          'div',
          { className: `timer-container ${getTimerColor(order.timeElapsed)}` },
          React.createElement('span', null, '🕒'),
          React.createElement('span', { className: 'timer-text' }, `${order.timeElapsed}m`)
        )
      ),
      React.createElement(
        'div',
        { className: 'order-items' },
        React.createElement('div', { className: 'section-title' }, 'Order List:'),
        order.items.map((item, index) =>
          React.createElement(
            'div',
            { key: index, className: 'order-item' },
            React.createElement('div', { className: 'item-text' }, `${item.quantity}x ${item.name}`),
            item.customizations && item.customizations.length > 0 && React.createElement(
              'div',
              { className: 'customizations-container' },
              item.customizations.map((custom, customIndex) =>
                React.createElement(
                  'div',
                  {
                    key: customIndex,
                    className: `customization-tag ${getCustomizationClass(custom)}`
                  },
                  React.createElement('span', { className: 'customization-text' }, custom)
                )
              )
            )
          )
        )
      ),
      order.specialRequests.length > 0 && React.createElement(
        'div',
        { className: 'special-requests-container' },
        React.createElement('div', { className: 'section-title' }, 'Special Requests:'),
        order.specialRequests.map((request, index) =>
          React.createElement(
            'div',
            {
              key: index,
              className: `special-request-tag ${request.toLowerCase().includes('allergy') ? 'allergy' : 'normal'}`
            },
            React.createElement('span', null, '⚠️'),
            React.createElement('span', { className: 'special-request-text' }, request)
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'order-status' },
        React.createElement('span', { className: 'status-label' }, 'Status:'),
        React.createElement(
          'div',
          { className: `status-badge ${order.status.toLowerCase()}` },
          React.createElement('span', { className: 'status-text' }, order.status)
        )
      ),
      order.status !== 'READY' && React.createElement(
        'button',
        {
          className: 'complete-button',
          onClick: () => completeOrder(order.id)
        },
        React.createElement('span', null, '✅'),
        React.createElement('span', { className: 'complete-button-text' }, 'Complete Order')
      )
    );
  };

  const renderBatchCard = (item) => {
    return React.createElement(
      'div',
      { key: item.id, className: `batch-card ${getBatchCardClass(item)}` },
      React.createElement('div', { className: 'batch-item-name' }, item.name),
      React.createElement(
        'div',
        { className: 'servings-container' },
        React.createElement('span', { className: 'servings-label' }, 'Servings Remaining:'),
        React.createElement('span', { className: `servings-count ${getBatchCardClass(item)}` }, item.servingsRemaining)
      ),
      React.createElement('div', { className: 'batch-status' }, getBatchStatusMessage(item)),
      React.createElement(
        'button',
        {
          className: 'start-batch-button',
          onClick: () => {
            setSelectedBatchItem(item);
            setShowBatchModal(true);
          }
        },
        React.createElement('span', null, '▶️'),
        React.createElement('span', { className: 'start-batch-text' }, 'Start New Batch')
      )
    );
  };

  return React.createElement(
    'div',
    { className: 'chef-screen screen' },
    React.createElement(
      'div',
      { className: 'chef-header' },
      React.createElement('span', null, '👨‍🍳'),
      React.createElement('h1', { className: 'chef-title' }, "Chef's Dashboard"),
      React.createElement(
        'div',
        { className: 'header-right' },
        React.createElement(
          'button',
          {
            className: 'batch-management-button',
            onClick: () => setShowBatchManagement(true)
          },
          '📦'
        ),
        React.createElement('span', null, '👥'),
        React.createElement('span', { className: 'active-orders' }, `${orders.filter(o => o.status !== 'READY').length} Active`)
      )
    ),
    React.createElement(
      'div',
      { className: 'order-queue' },
      React.createElement('h2', { className: 'queue-title' }, 'Order Queue'),
      React.createElement(
        'div',
        { className: 'orders-list' },
        orders
          .sort((a, b) => a.placedAt.getTime() - b.placedAt.getTime())
          .map(renderOrderCard)
      )
    ),
    showBatchManagement && React.createElement(
      'div',
      { className: 'batch-modal-overlay' },
      React.createElement(
        'div',
        { className: 'batch-modal-content' },
        React.createElement(
          'div',
          { className: 'batch-modal-header' },
          React.createElement('h2', { className: 'batch-modal-title' }, 'Batch Management'),
          React.createElement(
            'button',
            {
              className: 'close-button',
              onClick: () => setShowBatchManagement(false)
            },
            '✕'
          )
        ),
        React.createElement(
          'div',
          null,
          batchItems.map(renderBatchCard)
        )
      )
    ),
    showBatchModal && React.createElement(
      'div',
      { className: 'modal-overlay' },
      React.createElement(
        'div',
        { className: 'batch-size-modal' },
        React.createElement('h2', { className: 'batch-size-title' }, `Start New Batch: ${selectedBatchItem?.name}`),
        React.createElement('p', { className: 'batch-size-subtitle' }, 'Select batch size:'),
        React.createElement(
          'button',
          {
            className: 'batch-size-button',
            onClick: () => selectedBatchItem && startNewBatch(selectedBatchItem, 100)
          },
          React.createElement('span', { className: 'batch-size-text' }, 'Large: 100 Servings')
        ),
        React.createElement(
          'button',
          {
            className: 'batch-size-button',
            onClick: () => selectedBatchItem && startNewBatch(selectedBatchItem, 50)
          },
          React.createElement('span', { className: 'batch-size-text' }, 'Medium: 50 Servings')
        ),
        React.createElement(
          'button',
          {
            className: 'batch-size-button',
            onClick: () => selectedBatchItem && startNewBatch(selectedBatchItem, 25)
          },
          React.createElement('span', { className: 'batch-size-text' }, 'Small: 25 Servings')
        ),
        React.createElement(
          'button',
          {
            className: 'cancel-button',
            onClick: () => {
              setShowBatchModal(false);
              setSelectedBatchItem(null);
            }
          },
          React.createElement('span', { className: 'cancel-button-text' }, 'Cancel')
        )
      )
    )
  );
}