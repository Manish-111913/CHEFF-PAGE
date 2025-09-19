function TabLayout({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'menu', label: 'Menu', icon: '🏠' },
    { id: 'cart', label: 'Cart', icon: '🛒' },
    { id: 'orders', label: 'Orders', icon: '🕒' },
    { id: 'chef', label: 'Chef', icon: '👨‍🍳' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return React.createElement(
    'div',
    { className: 'tab-bar' },
    tabs.map(tab =>
      React.createElement(
        'div',
        {
          key: tab.id,
          className: `tab-item ${activeTab === tab.id ? 'active' : ''}`,
          onClick: () => setActiveTab(tab.id)
        },
        React.createElement('div', { className: 'tab-icon' }, tab.icon),
        React.createElement('div', { className: 'tab-label' }, tab.label)
      )
    )
  );
}