import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './Cart.css';

const foodEmojis = { Burger:'🍔', Pizza:'🍕', Rolls:'🌯', Dessert:'🍰', Sandwich:'🥪', Cake:'🎂', 'Pure Veg':'🥗', Pasta:'🍝', Noodles:'🍜' };

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, deleteFromCart, clearCart, getTotalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const items = Object.values(cartItems);

  const handlePlaceOrder = async () => {
    if (!user) { toast.error('Please login to place an order!'); navigate('/login'); return; }
    if (!address.street || !address.city || !address.pincode || !address.phone) {
      toast.error('Please fill all address fields!'); return;
    }
    setPlacing(true);
    try {
      const orderItems = items.map((item) => ({
        food: item._id, name: item.name, price: item.price, quantity: item.quantity, image: item.image,
      }));
      await API.post('/order', { items: orderItems, totalAmount: getTotalAmount(), address, paymentMethod });
      toast.success('Order placed successfully! 🎉');
      clearCart();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Try again!');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty!</h2>
        <p>Add some delicious food from our menu</p>
        <Link to="/menu" className="btn-browse">Browse Menu 🍽️</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart 🛒</h1>
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          {items.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-img">
                {item.image && !item.image.startsWith('default')
                  ? <img src={`/uploads/${item.image}`} alt={item.name} />
                  : <span>{foodEmojis[item.category] || '🍽️'}</span>
                }
              </div>
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="item-price">₹{item.price} each</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => removeFromCart(item._id)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)}>+</button>
              </div>
              <div className="cart-item-total">₹{item.price * item.quantity}</div>
              <button className="btn-delete" onClick={() => deleteFromCart(item._id)}>🗑️</button>
            </div>
          ))}
        </div>

        {/* Order Summary + Address */}
        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            {items.map((item) => (
              <div key={item._id} className="summary-row">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Delivery Fee</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-row total">
              <strong>Total</strong>
              <strong>₹{getTotalAmount()}</strong>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="address-card">
            <h3>Delivery Address</h3>
            <input placeholder="Street / House No." value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
            <input placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
            <input placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
            <input placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
            <input placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />

            <h3 style={{marginTop:'16px'}}>Payment Method</h3>
            <div className="payment-options">
              <label className={paymentMethod === 'COD' ? 'active' : ''}>
                <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                💵 Cash on Delivery
              </label>
              <label className={paymentMethod === 'Online' ? 'active' : ''}>
                <input type="radio" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} />
                💳 Online Payment
              </label>
            </div>

            <button className="btn-order" onClick={handlePlaceOrder} disabled={placing}>
              {placing ? 'Placing Order...' : `Place Order ₹${getTotalAmount()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
