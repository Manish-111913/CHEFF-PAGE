const { useState, useEffect } = React;

function App() {
  const [activeTab, setActiveTab] = useState('menu');

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return React.createElement(MenuScreen);
      case 'cart':
        return React.createElement(CartScreen);
      case 'orders':
        return React.createElement(OrdersScreen);
      case 'chef':
        return React.createElement(ChefScreen);
      case 'profile':
        return React.createElement(ProfileScreen);
      default:
        return React.createElement(MenuScreen);
    }
  };

  return React.createElement(
    'div',
    { className: 'app-container' },
    React.createElement(
      'div',
      { className: 'tab-container' },
      React.createElement(
        'div',
        { className: 'tab-content' },
        renderContent()
      ),
      React.createElement(TabLayout, { activeTab, setActiveTab })
    )
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));