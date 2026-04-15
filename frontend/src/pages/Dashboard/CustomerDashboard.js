import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/order/myorders');
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>My Orders</h1>
      <p className="welcome-text">Welcome back, {user.name}!</p>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/menu" className="btn-browse">
            Browse Menu 🍽️
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card customer">
              <div className="order-header">
                <h4>Order #{order._id.slice(-6)}</h4>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="order-items-list">
                {order.items?.map((item, index) => (
                  <p key={index}>
                    {item.quantity}x {item.name}
                  </p>
                ))}
              </div>
              <div className="order-footer">
                <div className="order-address">
                  <strong>Delivery Address:</strong>
                  <p>
                    {order.address?.street}, {order.address?.city},{' '}
                    {order.address?.pincode}
                  </p>
                  <p>Phone: {order.address?.phone}</p>
                </div>
                <div className="order-meta">
                  <p className="order-amount">₹{order.totalAmount}</p>
                  <p className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </p>
                  <p className="payment-info">
                    {order.paymentMethod} • {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;