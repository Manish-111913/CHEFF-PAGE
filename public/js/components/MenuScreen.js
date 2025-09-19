function MenuScreen() {
  const { useState, useEffect } = React;
  
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  const menuItems = [
    {
      id: '1',
      name: 'Crispy Calamari',
      description: 'Tender calamari, lightly battered and fried, served with a zesty marinara sauce.',
      price: 12.99,
      image: 'https://images.pexels.com/photos/3026805/pexels-photo-3026805.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Starters',
      prepTime: 8,
      isAvailable: true,
      isTrending: true,
      isLiked: true,
      hasOffer: false,
      rating: 4.8,
      customizations: ['Spicy', 'Extra crispy', 'No sauce'],
      recommendations: ['Garlic Bread', 'Caesar Salad'],
    },
    {
      id: '2',
      name: 'Grilled Salmon',
      description: 'Fresh salmon fillet, grilled to perfection, served with roasted vegetables and a lemon-dill sauce.',
      price: 18.50,
      image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Main Course',
      prepTime: 15,
      isAvailable: true,
      isTrending: false,
      isLiked: true,
      hasOffer: true,
      rating: 4.9,
      customizations: ['Medium rare', 'Well done', 'Extra vegetables'],
      recommendations: ['White Rice', 'Steamed Broccoli'],
    },
    {
      id: '3',
      name: 'Truffle Pasta',
      description: 'Fresh fettuccine with wild mushrooms, truffle oil, and parmesan cheese.',
      price: 16.75,
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Main Course',
      prepTime: 12,
      isAvailable: false,
      isTrending: true,
      isLiked: false,
      hasOffer: false,
      rating: 4.6,
      customizations: ['Extra truffle', 'No mushrooms', 'Gluten-free'],
      recommendations: ['Caesar Salad', 'Garlic Bread'],
    }
  ];

  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];
  const filters = [
    { id: 'trending', name: 'Trending', icon: '📈' },
    { id: 'liked', name: 'Most Liked', icon: '❤️' },
    { id: 'offers', name: 'Offers', icon: '🏷️' },
    { id: 'price', name: 'Price', icon: '💰' },
    { id: 'time', name: 'Prep Time', icon: '⏱️' },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    if (activeFilters.includes('trending') && !item.isTrending) return false;
    if (activeFilters.includes('liked') && !item.isLiked) return false;
    if (activeFilters.includes('offers') && !item.hasOffer) return false;
    return true;
  }).sort((a, b) => {
    if (activeFilters.includes('price')) {
      return a.price - b.price;
    }
    if (activeFilters.includes('time')) {
      return a.prepTime - b.prepTime;
    }
    return 0;
  });

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const updateQuantity = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const handleItemPress = (item) => {
    if (!item.isAvailable) {
      alert('We are unable to supply this item today. Please try again tomorrow or choose another item.');
      return;
    }
    setSelectedItem(item);
    setShowItemDetails(true);
    if (item.recommendations && item.recommendations.length > 0) {
      setRecommendedItems(item.recommendations);
      setShowRecommendation(true);
      setTimeout(() => setShowRecommendation(false), 3000);
    }
  };

  const renderMenuItem = (item) => {
    return React.createElement(
      'div',
      {
        key: item.id,
        className: `menu-item ${!item.isAvailable ? 'unavailable' : ''}`,
        onClick: () => handleItemPress(item)
      },
      React.createElement(
        'div',
        { className: 'image-container' },
        React.createElement('img', {
          src: item.image,
          alt: item.name,
          className: 'item-image'
        }),
        React.createElement(
          'div',
          { className: 'timer-badge' },
          React.createElement('span', null, '🕒'),
          React.createElement('span', { className: 'timer-text' }, `${item.prepTime}m`)
        ),
        item.hasOffer && React.createElement(
          'div',
          { className: 'offer-badge' },
          React.createElement('span', { className: 'offer-text' }, 'OFFER')
        ),
        !item.isAvailable && React.createElement(
          'div',
          { className: 'empty-overlay' },
          React.createElement('span', { className: 'empty-text' }, 'Empty')
        )
      ),
      React.createElement(
        'div',
        { className: 'item-details' },
        React.createElement('div', { className: 'item-name' }, item.name),
        React.createElement('div', { className: 'item-description' }, item.description),
        React.createElement(
          'div',
          { className: 'item-footer' },
          React.createElement('div', { className: 'item-price' }, `$${item.price}`),
          React.createElement(
            'div',
            { className: 'rating-container' },
            React.createElement('span', { className: 'star-icon' }, '⭐'),
            React.createElement('span', { className: 'rating' }, item.rating)
          )
        ),
        React.createElement(
          'div',
          { className: 'quantity-selector' },
          React.createElement(
            'button',
            {
              className: `quantity-button ${!item.isAvailable ? 'disabled' : ''}`,
              onClick: (e) => {
                e.stopPropagation();
                if (item.isAvailable) updateQuantity(item.id, -1);
              },
              disabled: !item.isAvailable
            },
            '−'
          ),
          React.createElement('span', { className: 'quantity-text' }, quantities[item.id] || 0),
          React.createElement(
            'button',
            {
              className: `quantity-button ${!item.isAvailable ? 'disabled' : ''}`,
              onClick: (e) => {
                e.stopPropagation();
                if (item.isAvailable) updateQuantity(item.id, 1);
              },
              disabled: !item.isAvailable
            },
            '+'
          )
        )
      )
    );
  };

  return React.createElement(
    'div',
    { className: 'menu-screen screen' },
    React.createElement(
      'div',
      { className: 'header' },
      React.createElement('h1', { className: 'title' }, 'Invexis')
    ),
    React.createElement(
      'div',
      { className: 'search-container' },
      React.createElement('span', { className: 'search-icon' }, '🔍'),
      React.createElement('input', {
        type: 'text',
        className: 'search-input',
        placeholder: 'Search for food',
        value: searchText,
        onChange: (e) => setSearchText(e.target.value)
      }),
      React.createElement(
        'button',
        {
          className: 'filter-button',
          onClick: () => setShowFilters(!showFilters)
        },
        '🔽'
      )
    ),
    showFilters && React.createElement(
      'div',
      { className: 'filters-container' },
      filters.map((filter) =>
        React.createElement(
          'div',
          {
            key: filter.id,
            className: `filter-chip ${activeFilters.includes(filter.id) ? 'active' : ''}`,
            onClick: () => toggleFilter(filter.id)
          },
          React.createElement('span', { className: 'icon' }, filter.icon),
          React.createElement('span', { className: 'filter-text' }, filter.name)
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'categories-container' },
      React.createElement(
        'div',
        { className: 'categories-scroll' },
        categories.map((category) =>
          React.createElement(
            'div',
            {
              key: category,
              className: `category-tab ${selectedCategory === category ? 'active' : ''}`,
              onClick: () => setSelectedCategory(category)
            },
            React.createElement('span', { className: 'category-text' }, category)
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'menu-container' },
      React.createElement(
        'div',
        { className: 'menu-grid' },
        filteredItems.map(renderMenuItem)
      )
    ),
    showItemDetails && selectedItem && React.createElement(
      'div',
      { className: 'modal-overlay' },
      React.createElement(
        'div',
        { className: 'modal-content' },
        React.createElement(
          'div',
          { className: 'modal-header' },
          React.createElement('h2', { className: 'modal-title' }, selectedItem.name),
          React.createElement(
            'button',
            {
              className: 'close-button',
              onClick: () => setShowItemDetails(false)
            },
            '✕'
          )
        ),
        React.createElement('img', {
          src: selectedItem.image,
          alt: selectedItem.name,
          className: 'modal-image'
        }),
        React.createElement('p', { className: 'modal-description' }, selectedItem.description),
        React.createElement('h3', { className: 'customization-title' }, 'Customizations:'),
        selectedItem.customizations?.map((custom, index) =>
          React.createElement(
            'div',
            { key: index, className: 'customization-option' },
            React.createElement('span', { className: 'customization-text' }, custom)
          )
        ),
        React.createElement(
          'div',
          { className: 'modal-footer' },
          React.createElement('span', { className: 'modal-price' }, `$${selectedItem.price}`),
          React.createElement(
            'button',
            {
              className: 'add-to-cart-button',
              onClick: () => {
                updateQuantity(selectedItem.id, 1);
                setShowItemDetails(false);
              }
            },
            React.createElement('span', null, '+'),
            React.createElement('span', { className: 'add-to-cart-text' }, 'Add to Cart')
          )
        )
      )
    ),
    showRecommendation && React.createElement(
      'div',
      { className: 'recommendation-popup' },
      React.createElement('h3', { className: 'recommendation-title' }, 'Perfect Combo!'),
      React.createElement(
        'p',
        { className: 'recommendation-text' },
        `Try ${recommendedItems.join(' & ')} with this item for the best experience!`
      )
    )
  );
}