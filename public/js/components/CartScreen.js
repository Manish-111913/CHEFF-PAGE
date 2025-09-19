function CartScreen() {
  const { useState } = React;
  
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Crispy Calamari',
      price: 12.99,
      image: 'https://images.pexels.com/photos/3026805/pexels-photo-3026805.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 2,
      customizations: ['Spicy', 'Extra crispy'],
    },
    {
      id: '2',
      name: 'Grilled Salmon',
      price: 18.50,
      image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 1,
      customizations: ['Medium rare', 'Extra vegetables'],
    },
  ]);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const updateQuantity = (id, change) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const removeItem = (id) => {
    if (confirm('Are you sure you want to remove this item from cart?')) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Please add items to cart before proceeding.');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmOrder = () => {
    alert('Your order has been placed successfully. You will receive a confirmation shortly.');
    setShowConfirmation(false);
    setCartItems([]);
  };

  if (cartItems.length === 0) {
    return React.createElement(
      'div',
      { className: 'cart-screen screen' },
      React.createElement(
        'div',
        { className: 'header' },
        React.createElement('h1', { className: 'title' }, 'Your Cart')
      ),
      React.createElement(
        'div',
        { className: 'empty-container' },
        React.createElement('div', { className: 'empty-icon' }, '🛒'),
        React.createElement('h2', { className: 'empty-title' }, 'Your cart is empty'),
        React.createElement('p', { className: 'empty-subtitle' }, 'Add some delicious items to get started!')
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'cart-screen screen' },
    React.createElement(
      'div',
      { className: 'header' },
      React.createElement('h1', { className: 'title' }, 'Your Cart'),
      React.createElement('span', { className: 'item-count' }, `${getTotalItems()} items`)
    ),
    React.createElement(
      'div',
      { className: 'cart-container' },
      cartItems.map((item) =>
        React.createElement(
          'div',
          { key: item.id, className: 'cart-item' },
          React.createElement('img', {
            src: item.image,
            alt: item.name,
            className: 'cart-item-image'
          }),
          React.createElement(
            'div',
            { className: 'cart-item-details' },
            React.createElement('div', { className: 'cart-item-name' }, item.name),
            item.customizations && React.createElement(
              'div',
              { className: 'customizations' },
              item.customizations.join(', ')
            ),
            React.createElement('div', { className: 'cart-item-price' }, `$${item.price}`)
          ),
          React.createElement(
            'div',
            { className: 'quantity-controls' },
            React.createElement(
              'button',
              {
                className: 'quantity-button',
                onClick: () => updateQuantity(item.id, -1)
              },
              '−'
            ),
            React.createElement('span', { className: 'quantity' }, item.quantity),
            React.createElement(
              'button',
              {
                className: 'quantity-button',
                onClick: () => updateQuantity(item.id, 1)
              },
              '+'
            )
          ),
          React.createElement(
            'button',
            {
              className: 'remove-button',
              onClick: () => removeItem(item.id)
            },
            '🗑️'
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'summary-container' },
      React.createElement(
        'div',
        { className: 'summary-row' },
        React.createElement('span', { className: 'summary-label' }, 'Subtotal:'),
        React.createElement('span', { className: 'summary-value' }, `$${getTotalPrice().toFixed(2)}`)
      ),
      React.createElement(
        'div',
        { className: 'summary-row' },
        React.createElement('span', { className: 'summary-label' }, 'Tax (8%):'),
        React.createElement('span', { className: 'summary-value' }, `$${(getTotalPrice() * 0.08).toFixed(2)}`)
      ),
      React.createElement(
        'div',
        { className: 'summary-row' },
        React.createElement('span', { className: 'summary-label' }, 'Delivery:'),
        React.createElement('span', { className: 'summary-value' }, '$3.99')
      ),
      React.createElement(
        'div',
        { className: 'summary-row total-row' },
        React.createElement('span', { className: 'total-label' }, 'Total:'),
        React.createElement('span', { className: 'total-value' }, `$${(getTotalPrice() * 1.08 + 3.99).toFixed(2)}`)
      )
    ),
    React.createElement(
      'button',
      {
        className: 'checkout-button',
        onClick: proceedToCheckout
      },
      React.createElement('span', { className: 'checkout-text' }, 'Proceed to Checkout')
    ),
    showConfirmation && React.createElement(
      'div',
      { className: 'modal-overlay' },
      React.createElement(
        'div',
        { className: 'confirmation-modal' },
        React.createElement('h2', { className: 'confirmation-title' }, 'Confirm Your Order'),
        React.createElement('p', { className: 'confirmation-text' }, `Total: $${(getTotalPrice() * 1.08 + 3.99).toFixed(2)}`),
        React.createElement('p', { className: 'confirmation-text' }, `Items: ${getTotalItems()}`),
        React.createElement('p', { className: 'confirmation-text' }, 'Estimated delivery: 30-45 minutes'),
        React.createElement(
          'div',
          { className: 'confirmation-buttons' },
          React.createElement(
            'button',
            {
              className: 'confirm-button cancel-button',
              onClick: () => setShowConfirmation(false)
            },
            React.createElement('span', { className: 'cancel-button-text' }, 'Cancel')
          ),
          React.createElement(
            'button',
            {
              className: 'confirm-button',
              onClick: confirmOrder
            },
            React.createElement('span', { className: 'confirm-button-text' }, 'Confirm Order')
          )
        )
      )
    )
  );
}