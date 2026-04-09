import { Link } from 'react-router-dom';
import './Home.css';

const categories = [
  { name: 'Burger', emoji: '🍔' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Rolls', emoji: '🌯' },
  { name: 'Dessert', emoji: '🍰' },
  { name: 'Sandwich', emoji: '🥪' },
  { name: 'Pasta', emoji: '🍝' },
  { name: 'Noodles', emoji: '🍜' },
  { name: 'Pure Veg', emoji: '🥗' },
];

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Hungry? <span>We've Got You!</span>
          </h1>
          <p>Order delicious food from the best restaurants near you. Fast delivery, hot food, happy you! 🚀</p>
          <div className="hero-btns">
            <Link to="/menu" className="btn-primary">Order Now 🍽️</Link>
            <Link to="/menu" className="btn-outline">Browse Menu</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>50+</strong><span>Menu Items</span></div>
            <div className="stat"><strong>30 min</strong><span>Avg Delivery</span></div>
            <div className="stat"><strong>4.8★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-emoji">🍔</div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-container">
          <h2>Explore by Category</h2>
          <p className="section-sub">What are you craving today?</p>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to={`/menu?category=${cat.name}`} key={cat.name} className="category-card">
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="why-section">
        <div className="section-container">
          <h2>Why Choose FoodieExpress?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span>⚡</span>
              <h3>Fast Delivery</h3>
              <p>Get your food delivered hot and fresh within 30 minutes</p>
            </div>
            <div className="feature-card">
              <span>🌿</span>
              <h3>Fresh Ingredients</h3>
              <p>We use only the freshest ingredients sourced locally</p>
            </div>
            <div className="feature-card">
              <span>💳</span>
              <h3>Easy Payment</h3>
              <p>Pay online or cash on delivery — your choice!</p>
            </div>
            <div className="feature-card">
              <span>📱</span>
              <h3>Live Tracking</h3>
              <p>Track your order in real-time from kitchen to door</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
