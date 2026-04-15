import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes] = await Promise.all([
        API.get('/order'),
        API.get('/auth/users'),
      ]);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await API.put(`/order/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const getStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const totalUsers = users.filter((u) => u.role === 'user').length;
    const totalRestaurants = users.filter((u) => u.role === 'restaurant').length;

    return { totalOrders, totalRevenue, pendingOrders, totalUsers, totalRestaurants };
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  const stats = getStats();

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p className="welcome-text">Welcome, {user.name}!</p>

      {/* Stats Cards */}
      <div className="stats-grid admin">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{stats.totalRevenue}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-value pending">{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Customers</h3>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Restaurants</h3>
          <p className="stat-value">{stats.totalRestaurants}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          All Orders
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          All Users
        </button>
      </div>

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>
                    <p>{order.user?.name}</p>
                    <p className="small">{order.user?.email}</p>
                  </td>
                  <td>
                    {order.items?.map((item, i) => (
                      <span key={i}>
                        {item.quantity}x {item.name}
                        {i < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`status-select small ${order.status.toLowerCase()}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <span className={`payment-badge ${order.paymentStatus.toLowerCase()}`}>
                      {order.paymentMethod} - {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{u.phone || '-'}</td>
                  <td>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;