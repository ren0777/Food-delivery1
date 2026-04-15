import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../Login/Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'user', restaurantName: '', cuisine: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields!'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match!'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters!'); return; }
    setLoading(true);
    try {
      let restaurantDetails = null;
      if (form.role === 'restaurant') {
        if (!form.restaurantName) { toast.error('Please enter restaurant name!'); setLoading(false); return; }
        restaurantDetails = { restaurantName: form.restaurantName, cuisine: form.cuisine };
      }
      await register(form.name, form.email, form.password, form.role, restaurantDetails);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🍕</h1>
          <h2>Create Account</h2>
          <p>Join FoodieExpress and start ordering!</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Faizan" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Customer</option>
              <option value="restaurant">Restaurant Partner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {form.role === 'restaurant' && (
            <>
              <div className="form-group">
                <label>Restaurant Name</label>
                <input type="text" name="restaurantName" placeholder="Your Restaurant Name" value={form.restaurantName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Cuisine Type</label>
                <input type="text" name="cuisine" placeholder="e.g., Italian, Chinese" value={form.cuisine} onChange={handleChange} />
              </div>
            </>
          )}
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
