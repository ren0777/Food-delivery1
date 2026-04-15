import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './Dashboard.css';

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [menuItems, setMenuItems] = useState([]);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Burger',
    image: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'restaurant') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, earningsRes, ordersRes] = await Promise.all([
        API.get('/restaurant/stats'),
        API.get(`/restaurant/earnings?month=${selectedMonth}&year=${selectedYear}`),
        API.get('/restaurant/orders'),
      ]);
      setStats(statsRes.data);
      setEarnings(earningsRes.data);
      setOrders(ordersRes.data);

      const menuRes = await API.get('/restaurant/menu');
      setMenuItems(menuRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuInputChange = (e) => {
    const { name, value } = e.target;
    setMenuForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuForm.name || !menuForm.description || !menuForm.price) {
      toast.error('Please fill menu item details');
      return;
    }

    try {
      await API.post('/restaurant/menu', {
        ...menuForm,
        price: Number(menuForm.price),
      });
      toast.success('Menu item added');
      setMenuForm({ name: '', description: '', price: '', category: 'Burger', image: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      await API.delete(`/restaurant/menu/${id}`);
      toast.success('Menu item removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove menu item');
    }
  };

  const handleUseDefaultMenu = async () => {
    try {
      await API.post('/restaurant/menu/use-default');
      toast.success('Default menu copied. You can edit it anytime.');
      fetchData();
    } catch (err) {
      toast.error('Failed to copy default menu');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await API.put(`/restaurant/order/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Restaurant Dashboard</h1>
      <p className="welcome-text">Welcome, {user.name}!</p>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Orders</h3>
            <p className="stat-value pending">{stats.pendingOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Delivered</h3>
            <p className="stat-value delivered">{stats.deliveredOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Cancelled</h3>
            <p className="stat-value cancelled">{stats.cancelledOrders}</p>
          </div>
          <div className="stat-card highlight">
            <h3>Total Earnings</h3>
            <p className="stat-value">₹{stats.totalEarnings}</p>
          </div>
        </div>
      )}

      {/* Monthly Earnings */}
      <div className="earnings-section">
        <div className="section-header">
          <h2>Monthly Earnings</h2>
          <div className="month-selector">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        {earnings && (
          <div className="monthly-stats">
            <div className="monthly-card">
              <span>Orders this month</span>
              <strong>{earnings.month}</strong>
            </div>
            <div className="monthly-card total">
              <span>Earnings</span>
              <strong>₹{earnings.totalEarnings}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="orders-section">
        <h2>Recent Orders</h2>
        <div className="orders-list">
          {orders.length === 0 ? (
            <p className="no-orders">No orders yet</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-info">
                  <h4>Order #{order._id.slice(-6)}</h4>
                  <p>Customer: {order.user?.name}</p>
                  <p>Phone: {order.address?.phone}</p>
                  <p className="order-items">
                    {order.items?.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                  </p>
                </div>
                <div className="order-details">
                  <p className="order-amount">₹{order.totalAmount}</p>
                  <p className={`order-status ${order.status.toLowerCase()}`}>{order.status}</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="orders-section" style={{ marginTop: '24px' }}>
        <div className="section-header">
          <h2>Manage Menu</h2>
          <button className="btn-browse" onClick={handleUseDefaultMenu} type="button">
            Use Default Menu
          </button>
        </div>

        <form className="menu-form" onSubmit={handleAddMenuItem}>
          <input
            type="text"
            name="name"
            placeholder="Item name"
            value={menuForm.name}
            onChange={handleMenuInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={menuForm.description}
            onChange={handleMenuInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={menuForm.price}
            onChange={handleMenuInputChange}
            min="1"
          />
          <select name="category" value={menuForm.category} onChange={handleMenuInputChange}>
            <option value="Burger">Burger</option>
            <option value="Pizza">Pizza</option>
            <option value="Rolls">Rolls</option>
            <option value="Dessert">Dessert</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Cake">Cake</option>
            <option value="Pure Veg">Pure Veg</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
          </select>
          <input
            type="text"
            name="image"
            placeholder="Image filename (optional)"
            value={menuForm.image}
            onChange={handleMenuInputChange}
          />
          <button className="btn-browse" type="submit">Add Item</button>
        </form>

        <div className="menu-items-grid">
          {menuItems.length === 0 ? (
            <p className="no-orders">No menu items yet. Add items or copy default menu.</p>
          ) : (
            menuItems.map((item) => (
              <div className="menu-item-card" key={item._id}>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p className="small">{item.category} • ₹{item.price}</p>
                </div>
                <button
                  type="button"
                  className="btn-delete-menu"
                  onClick={() => handleDeleteMenuItem(item._id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;