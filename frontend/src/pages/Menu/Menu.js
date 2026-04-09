import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './Menu.css';

const categories = ['All', 'Burger', 'Pizza', 'Rolls', 'Dessert', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];

// Fallback demo food data if backend is not running
const demoFoods = [
  { _id: '1', name: 'Classic Burger', description: 'Juicy beef patty with lettuce, tomato & cheese', price: 149, category: 'Burger', image: '', rating: 4.5 },
  { _id: '2', name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato sauce and basil', price: 299, category: 'Pizza', image: '', rating: 4.7 },
  { _id: '3', name: 'Paneer Roll', description: 'Spicy paneer wrapped in soft paratha', price: 119, category: 'Rolls', image: '', rating: 4.3 },
  { _id: '4', name: 'Chocolate Cake', description: 'Rich moist chocolate cake slice', price: 89, category: 'Dessert', image: '', rating: 4.8 },
  { _id: '5', name: 'Club Sandwich', description: 'Triple-decker with veggies and cheese', price: 129, category: 'Sandwich', image: '', rating: 4.2 },
  { _id: '6', name: 'Pasta Arrabbiata', description: 'Penne in spicy tomato-garlic sauce', price: 179, category: 'Pasta', image: '', rating: 4.4 },
  { _id: '7', name: 'Hakka Noodles', description: 'Stir-fried noodles with veggies', price: 139, category: 'Noodles', image: '', rating: 4.3 },
  { _id: '8', name: 'Veg Thali', description: 'Complete pure veg meal with dal, sabzi, rice', price: 199, category: 'Pure Veg', image: '', rating: 4.6 },
  { _id: '9', name: 'Cheese Burst Pizza', description: 'Extra cheese stuffed crust pizza', price: 349, category: 'Pizza', image: '', rating: 4.9 },
  { _id: '10', name: 'Chicken Burger', description: 'Crispy fried chicken with mayo slaw', price: 179, category: 'Burger', image: '', rating: 4.6 },
  { _id: '11', name: 'Egg Roll', description: 'Fluffy egg wrapped in crispy paratha', price: 99, category: 'Rolls', image: '', rating: 4.1 },
  { _id: '12', name: 'Brownie', description: 'Warm fudge brownie with vanilla scoop', price: 79, category: 'Dessert', image: '', rating: 4.7 },
];

const foodEmojis = { Burger:'🍔', Pizza:'🍕', Rolls:'🌯', Dessert:'🍰', Sandwich:'🥪', Cake:'🎂', 'Pure Veg':'🥗', Pasta:'🍝', Noodles:'🍜' };

const FoodCard = ({ food, onAdd, onRemove, qty }) => (
  <div className="food-card">
    <div className="food-img">
      {food.image && !food.image.startsWith('default')
        ? <img src={`/uploads/${food.image}`} alt={food.name} />
        : <span className="food-emoji">{foodEmojis[food.category] || '🍽️'}</span>
      }
      <span className="food-category">{food.category}</span>
    </div>
    <div className="food-info">
      <h3>{food.name}</h3>
      <p>{food.description}</p>
      <div className="food-footer">
        <span className="food-price">₹{food.price}</span>
        <span className="food-rating">⭐ {food.rating}</span>
        {qty > 0 ? (
          <div className="qty-controls">
            <button onClick={() => onRemove(food._id)}>−</button>
            <span>{qty}</span>
            <button onClick={() => onAdd(food)}>+</button>
          </div>
        ) : (
          <button className="btn-add" onClick={() => onAdd(food)}>Add +</button>
        )}
      </div>
    </div>
  </div>
);

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const { cartItems, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await API.get('/food');
        setFoods(data.length > 0 ? data : demoFoods);
      } catch {
        setFoods(demoFoods);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const handleAdd = (food) => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`, { icon: '🛒' });
  };

  const filtered = foods.filter((f) => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu 🍽️</h1>
        <input
          type="text"
          placeholder="🔍 Search for food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="menu-container">
        {/* Sidebar categories */}
        <aside className="categories-sidebar">
          <h3>Categories</h3>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat !== 'All' && foodEmojis[cat]} {cat}
            </button>
          ))}
        </aside>

        {/* Food Grid */}
        <div className="foods-grid">
          {loading ? (
            <div className="loading">Loading delicious food... 🍳</div>
          ) : filtered.length === 0 ? (
            <div className="no-food">No food found 😢 Try a different search!</div>
          ) : (
            filtered.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onAdd={handleAdd}
                onRemove={removeFromCart}
                qty={cartItems[food._id]?.quantity || 0}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
