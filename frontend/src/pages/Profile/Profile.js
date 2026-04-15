import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [restaurantForm, setRestaurantForm] = useState({
    restaurantName: '',
    cuisine: '',
    openingTime: '09:00',
    closingTime: '22:00',
    deliveryRadius: 5,
    isOpen: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
    if (user.restaurantDetails) {
      setRestaurantForm({
        restaurantName: user.restaurantDetails.restaurantName || '',
        cuisine: user.restaurantDetails.cuisine || '',
        openingTime: user.restaurantDetails.openingTime || '09:00',
        closingTime: user.restaurantDetails.closingTime || '22:00',
        deliveryRadius: user.restaurantDetails.deliveryRadius || 5,
        isOpen: user.restaurantDetails.isOpen ?? true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('restaurant_')) {
      const field = name.replace('restaurant_', '');
      setRestaurantForm({ ...restaurantForm, [field]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profileData = { ...form };
      if (user.role === 'restaurant') {
        profileData.restaurantDetails = restaurantForm;
      }
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <p className="role-badge-display">{user.role}</p>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        {user.role === 'restaurant' && (
          <div className="form-section">
            <h3>Restaurant Details</h3>
            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                type="text"
                name="restaurant_restaurantName"
                value={restaurantForm.restaurantName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Cuisine Type</label>
              <input
                type="text"
                name="restaurant_cuisine"
                value={restaurantForm.cuisine}
                onChange={handleChange}
                placeholder="e.g., Italian, Chinese, Indian"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Opening Time</label>
                <input
                  type="time"
                  name="restaurant_openingTime"
                  value={restaurantForm.openingTime}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Closing Time</label>
                <input
                  type="time"
                  name="restaurant_closingTime"
                  value={restaurantForm.closingTime}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Delivery Radius (km)</label>
              <input
                type="number"
                name="restaurant_deliveryRadius"
                value={restaurantForm.deliveryRadius}
                onChange={handleChange}
                min="1"
                max="50"
              />
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="restaurant_isOpen"
                  checked={restaurantForm.isOpen}
                  onChange={(e) =>
                    setRestaurantForm({
                      ...restaurantForm,
                      isOpen: e.target.checked,
                    })
                  }
                />
                Restaurant is Open
              </label>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;