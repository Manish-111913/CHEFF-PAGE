import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Search,
  Filter,
  Clock,
  Star,
  Plus,
  Minus,
  X,
  TrendingUp,
  Heart,
  Tag,
  DollarSign,
  Timer,
} from 'lucide-react-native';

const initialWindowWidth = Dimensions.get('window').width;

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  prepTime: number;
  isAvailable: boolean;
  isTrending: boolean;
  isLiked: boolean;
  hasOffer: boolean;
  rating: number;
  customizations?: string[];
  recommendations?: string[];
}

const menuItems: MenuItem[] = [
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
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.',
    price: 9.50,
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Desserts',
    prepTime: 10,
    isAvailable: true,
    isTrending: true,
    isLiked: true,
    hasOffer: false,
    rating: 4.7,
    customizations: ['Extra ice cream', 'No ice cream', 'Berry sauce'],
    recommendations: ['Espresso', 'Cappuccino'],
  },
  {
    id: '5',
    name: 'Buffalo Wings',
    description: 'Crispy chicken wings tossed in buffalo sauce, served with celery sticks and blue cheese dip.',
    price: 11.99,
    image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Starters',
    prepTime: 12,
    isAvailable: true,
    isTrending: false,
    isLiked: true,
    hasOffer: true,
    rating: 4.5,
    customizations: ['Extra spicy', 'Mild', 'BBQ sauce instead'],
    recommendations: ['Beer', 'Ranch Dip'],
  },
  {
    id: '6',
    name: 'Ribeye Steak',
    description: 'Premium 12oz ribeye steak, grilled to your preference, served with mashed potatoes.',
    price: 28.99,
    image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Main Course',
    prepTime: 20,
    isAvailable: true,
    isTrending: true,
    isLiked: true,
    hasOffer: false,
    rating: 4.9,
    customizations: ['Rare', 'Medium', 'Well done', 'Extra sauce'],
    recommendations: ['Red Wine', 'Asparagus'],
  },
  {
    id: '7',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, croutons, parmesan cheese, and our signature Caesar dressing.',
    price: 8.99,
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Starters',
    prepTime: 5,
    isAvailable: true,
    isTrending: false,
    isLiked: false,
    hasOffer: false,
    rating: 4.3,
    customizations: ['Add chicken', 'No croutons', 'Light dressing'],
    recommendations: ['Grilled Chicken', 'Garlic Bread'],
  },
  {
    id: '8',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
    price: 7.99,
    image: 'https://images.pexels.com/photos/6659151/pexels-photo-6659151.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Desserts',
    prepTime: 3,
    isAvailable: true,
    isTrending: false,
    isLiked: true,
    hasOffer: true,
    rating: 4.6,
    customizations: ['Extra cocoa', 'Decaf coffee', 'Light cream'],
    recommendations: ['Espresso', 'Italian Wine'],
  },
  {
    id: '9',
    name: 'Fish Tacos',
    description: 'Grilled fish with cabbage slaw, pico de gallo, and lime crema in soft tortillas.',
    price: 14.50,
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Main Course',
    prepTime: 10,
    isAvailable: true,
    isTrending: true,
    isLiked: false,
    hasOffer: false,
    rating: 4.4,
    customizations: ['Extra spicy', 'No slaw', 'Extra lime'],
    recommendations: ['Margarita', 'Guacamole'],
  },
  {
    id: '10',
    name: 'Stuffed Mushrooms',
    description: 'Large mushroom caps stuffed with herb breadcrumbs, cheese, and garlic.',
    price: 10.99,
    image: 'https://images.pexels.com/photos/5938322/pexels-photo-5938322.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Starters',
    prepTime: 15,
    isAvailable: false,
    isTrending: false,
    isLiked: true,
    hasOffer: false,
    rating: 4.2,
    customizations: ['Extra cheese', 'Vegan option', 'Spicy herbs'],
    recommendations: ['White Wine', 'Bruschetta'],
  },
  {
    id: '11',
    name: 'Lobster Risotto',
    description: 'Creamy arborio rice cooked with lobster stock, chunks of lobster meat, and fresh herbs.',
    price: 32.99,
    image: 'https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Main Course',
    prepTime: 25,
    isAvailable: true,
    isTrending: true,
    isLiked: true,
    hasOffer: true,
    rating: 4.8,
    customizations: ['Extra lobster', 'Less creamy', 'Add vegetables'],
    recommendations: ['White Wine', 'Bread Roll'],
  },
  {
    id: '12',
    name: 'Chocolate Milkshake',
    description: 'Rich chocolate milkshake topped with whipped cream and chocolate shavings.',
    price: 5.99,
    image: 'https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Drinks',
    prepTime: 3,
    isAvailable: true,
    isTrending: false,
    isLiked: true,
    hasOffer: false,
    rating: 4.5,
    customizations: ['Extra whipped cream', 'Less sweet', 'Add cherry'],
    recommendations: ['Chocolate Cake', 'Cookies'],
  },
  {
    id: '13',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil leaves.',
    price: 15.99,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Main Course',
    prepTime: 18,
    isAvailable: true,
    isTrending: true,
    isLiked: true,
    hasOffer: false,
    rating: 4.7,
    customizations: ['Extra cheese', 'Thin crust', 'Add pepperoni'],
    recommendations: ['Italian Soda', 'Caesar Salad'],
  },
  {
    id: '14',
    name: 'Fruit Parfait',
    description: 'Layers of Greek yogurt, fresh berries, and granola, drizzled with honey.',
    price: 6.50,
    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Desserts',
    prepTime: 2,
    isAvailable: true,
    isTrending: false,
    isLiked: false,
    hasOffer: true,
    rating: 4.1,
    customizations: ['Extra berries', 'No granola', 'Sugar-free'],
    recommendations: ['Green Tea', 'Coffee'],
  },
  {
    id: '15',
    name: 'Craft Beer Flight',
    description: 'Selection of four craft beers served in tasting portions with tasting notes.',
    price: 12.99,
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Drinks',
    prepTime: 2,
    isAvailable: true,
    isTrending: true,
    isLiked: true,
    hasOffer: false,
    rating: 4.6,
    customizations: ['IPA selection', 'Light beers only', 'Add nuts'],
    recommendations: ['Wings', 'Pretzel Bites'],
  },
];

const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];
const filters = [
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'liked', name: 'Most Liked', icon: Heart },
  { id: 'offers', name: 'Offers', icon: Tag },
  { id: 'price', name: 'Price', icon: DollarSign },
  { id: 'time', name: 'Prep Time', icon: Timer },
];

export default function MenuScreen() {
  const [containerWidth, setContainerWidth] = useState<number>(Math.min(initialWindowWidth, 600));
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedItems, setRecommendedItems] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  const filteredItems = menuItems.filter((item) => {
    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }

    // Active filters
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

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const setQuantity = (itemId: string, quantity: number) => {
    if (quantity >= 0) {
      setQuantities(prev => ({
        ...prev,
        [itemId]: quantity
      }));
    }
  };

  const showRecommendations = (item: MenuItem) => {
    if (item.recommendations && item.recommendations.length > 0) {
      setRecommendedItems(item.recommendations);
      setShowRecommendation(true);
      setTimeout(() => setShowRecommendation(false), 3000);
    }
  };

  const handleItemPress = (item: MenuItem) => {
    if (!item.isAvailable) {
      Alert.alert(
        'Item Unavailable',
        'We are unable to supply this item today. Please try again tomorrow or choose another item.'
      );
      return;
    }
    setSelectedItem(item);
    setShowItemDetails(true);
    showRecommendations(item);
  };

  const cardWidth = Math.max(0, (containerWidth - 48) / 2);

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        { width: cardWidth },
        !item.isAvailable && styles.unavailableItem
      ]}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.timerBadge}>
          <Clock size={10} color="#fff" />
          <Text style={styles.timerText}>{item.prepTime}m</Text>
        </View>
        {item.hasOffer && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerText}>OFFER</Text>
          </View>
        )}
        {!item.isAvailable && (
          <View style={styles.emptyOverlay}>
            <Text style={styles.emptyText}>Empty</Text>
          </View>
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, !item.isAvailable && styles.unavailableText]}>
          {item.name}
        </Text>
        <Text style={[styles.itemDescription, !item.isAvailable && styles.unavailableText]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.itemFooter}>
          <Text style={[styles.itemPrice, !item.isAvailable && styles.unavailableText]}>
            ${item.price}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <Text style={[styles.rating, !item.isAvailable && styles.unavailableText]}>
              {item.rating}
            </Text>
          </View>
        </View>
        
        {/* Quantity Selector */}
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={[styles.quantityButton, !item.isAvailable && styles.disabledButton]}
            onPress={() => item.isAvailable && updateQuantity(item.id, -1)}
            disabled={!item.isAvailable}
          >
            <Minus size={14} color={!item.isAvailable ? "#666" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.quantityText, !item.isAvailable && styles.unavailableText]}>
            {quantities[item.id] || 0}
          </Text>
          <TouchableOpacity
            style={[styles.quantityButton, !item.isAvailable && styles.disabledButton]}
            onPress={() => item.isAvailable && updateQuantity(item.id, 1)}
            disabled={!item.isAvailable}
          >
            <Plus size={14} color={!item.isAvailable ? "#666" : "#000"} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={styles.container}
      onLayout={(e) => setContainerWidth(Math.min(e.nativeEvent.layout.width, 600))}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Invexis</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food"
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#fbbf24" />
        </TouchableOpacity>
      </View>

      {/* Filters Modal */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                activeFilters.includes(filter.id) && styles.activeFilterChip
              ]}
              onPress={() => toggleFilter(filter.id)}
            >
              <filter.icon size={16} color={activeFilters.includes(filter.id) ? '#000' : '#fbbf24'} />
              <Text style={[
                styles.filterText,
                activeFilters.includes(filter.id) && styles.activeFilterText
              ]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScrollContent}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.activeCategoryTab
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.activeCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      {/* Menu Items Grid */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.menuGrid}>
          {filteredItems.map(renderMenuItem)}
        </View>
      </ScrollView>

      {/* Item Details Modal */}
      <Modal visible={showItemDetails} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                  <TouchableOpacity onPress={() => setShowItemDetails(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
                <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                
                {/* Customizations */}
                <Text style={styles.customizationTitle}>Customizations:</Text>
                {selectedItem.customizations?.map((custom, index) => (
                  <TouchableOpacity key={index} style={styles.customizationOption}>
                    <Text style={styles.customizationText}>{custom}</Text>
                  </TouchableOpacity>
                ))}
                
                <View style={styles.modalFooter}>
                  <Text style={styles.modalPrice}>${selectedItem.price}</Text>
                  <TouchableOpacity 
                    style={styles.addToCartButton}
                    onPress={() => {
                      updateQuantity(selectedItem.id, 1);
                      setShowItemDetails(false);
                    }}
                  >
                    <Plus size={16} color="#000" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Recommendation Popup */}
      {showRecommendation && (
        <View style={styles.recommendationPopup}>
          <Text style={styles.recommendationTitle}>Perfect Combo!</Text>
          <Text style={styles.recommendationText}>
            Try {recommendedItems.join(' & ')} with this item for the best experience!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#fff',
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  activeFilterChip: {
    backgroundColor: '#fbbf24',
  },
  filterText: {
    color: '#fbbf24',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#000',
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  categoriesScrollContent: {
    paddingRight: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#222',
    borderRadius: 20,
    marginRight: 12,
    minWidth: 'auto',
  },
  activeCategoryTab: {
    backgroundColor: '#fbbf24',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#000',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  menuItem: {
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  unavailableItem: {
    backgroundColor: '#444',
    opacity: 0.6,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 120,
  },
  timerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timerText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '600',
  },
  offerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  offerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    padding: 12,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  unavailableText: {
    color: '#777',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  quantityButton: {
    backgroundColor: '#fbbf24',
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#444',
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#222',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    padding: 20,
  },
  customizationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  customizationOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  customizationText: {
    color: '#ccc',
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalPrice: {
    color: '#fbbf24',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbbf24',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addToCartText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  recommendationPopup: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fbbf24',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recommendationTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationText: {
    color: '#000',
    fontSize: 14,
  },
});