function ProfileScreen() {
  const { useState } = React;
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
    memberSince: 'January 2023',
    totalOrders: 47,
    favoriteItems: 8,
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      subtitle: `${profileData.totalOrders} orders placed`,
      icon: '👤',
    },
    {
      id: 'addresses',
      title: 'Delivery Addresses',
      subtitle: 'Manage your addresses',
      icon: '📍',
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      subtitle: 'Cards and payment options',
      icon: '💳',
    },
    {
      id: 'settings',
      title: 'App Settings',
      subtitle: 'Preferences and configuration',
      icon: '⚙️',
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQs and customer support',
      icon: '❓',
    },
  ];

  const toggleSwitch = (type) => {
    if (type === 'notifications') {
      setNotificationsEnabled(!notificationsEnabled);
    } else if (type === 'location') {
      setLocationEnabled(!locationEnabled);
    }
  };

  return React.createElement(
    'div',
    { className: 'profile-screen screen' },
    React.createElement(
      'div',
      { className: 'header' },
      React.createElement('h1', { className: 'title' }, 'Profile'),
      React.createElement(
        'button',
        { className: 'edit-button' },
        '✏️'
      )
    ),
    React.createElement(
      'div',
      { className: 'content' },
      React.createElement(
        'div',
        { className: 'profile-card' },
        React.createElement(
          'div',
          { className: 'profile-header' },
          React.createElement('img', {
            src: profileData.avatar,
            alt: profileData.name,
            className: 'avatar'
          }),
          React.createElement(
            'div',
            { className: 'profile-info' },
            React.createElement('h2', { className: 'profile-name' }, profileData.name),
            React.createElement('p', { className: 'member-since' }, `Member since ${profileData.memberSince}`)
          )
        ),
        React.createElement(
          'div',
          { className: 'profile-details' },
          React.createElement(
            'div',
            { className: 'detail-item' },
            React.createElement('span', null, '📧'),
            React.createElement('span', { className: 'detail-text' }, profileData.email)
          ),
          React.createElement(
            'div',
            { className: 'detail-item' },
            React.createElement('span', null, '📞'),
            React.createElement('span', { className: 'detail-text' }, profileData.phone)
          ),
          React.createElement(
            'div',
            { className: 'detail-item' },
            React.createElement('span', null, '📍'),
            React.createElement('span', { className: 'detail-text' }, profileData.address)
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'stats-container' },
        React.createElement(
          'div',
          { className: 'stat-card' },
          React.createElement('div', { className: 'stat-number' }, profileData.totalOrders),
          React.createElement('div', { className: 'stat-label' }, 'Total Orders')
        ),
        React.createElement(
          'div',
          { className: 'stat-card' },
          React.createElement('div', { className: 'stat-number' }, profileData.favoriteItems),
          React.createElement('div', { className: 'stat-label' }, 'Favorite Items')
        ),
        React.createElement(
          'div',
          { className: 'stat-card' },
          React.createElement('div', { className: 'stat-number' }, '4.9'),
          React.createElement('div', { className: 'stat-label' }, 'Avg Rating Given')
        )
      ),
      React.createElement(
        'div',
        { className: 'section' },
        React.createElement('h3', { className: 'section-title' }, 'Quick Settings'),
        React.createElement(
          'div',
          { className: 'setting-item' },
          React.createElement(
            'div',
            { className: 'setting-left' },
            React.createElement('span', null, '🔔'),
            React.createElement('span', { className: 'setting-label' }, 'Push Notifications')
          ),
          React.createElement(
            'div',
            {
              className: `switch ${notificationsEnabled ? 'active' : ''}`,
              onClick: () => toggleSwitch('notifications')
            },
            React.createElement('div', { className: 'switch-thumb' })
          )
        ),
        React.createElement(
          'div',
          { className: 'setting-item' },
          React.createElement(
            'div',
            { className: 'setting-left' },
            React.createElement('span', null, '📍'),
            React.createElement('span', { className: 'setting-label' }, 'Location Services')
          ),
          React.createElement(
            'div',
            {
              className: `switch ${locationEnabled ? 'active' : ''}`,
              onClick: () => toggleSwitch('location')
            },
            React.createElement('div', { className: 'switch-thumb' })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'section' },
        React.createElement('h3', { className: 'section-title' }, 'Account'),
        menuItems.map((item) =>
          React.createElement(
            'div',
            { key: item.id, className: 'menu-item' },
            React.createElement(
              'div',
              { className: 'menu-item-left' },
              React.createElement('span', null, item.icon),
              React.createElement(
                'div',
                { className: 'menu-item-text' },
                React.createElement('div', { className: 'menu-item-title' }, item.title),
                React.createElement('div', { className: 'menu-item-subtitle' }, item.subtitle)
              )
            ),
            React.createElement('span', null, '>')
          )
        )
      ),
      React.createElement(
        'button',
        { className: 'logout-button' },
        React.createElement('span', null, '🚪'),
        React.createElement('span', { className: 'logout-text' }, 'Sign Out')
      ),
      React.createElement('p', { className: 'app-version' }, 'Version 1.0.0')
    )
  );
}