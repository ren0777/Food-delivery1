import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'restaurant':
        return '/dashboard/restaurant';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/customer';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          🍔 <span>FoodieExpress</span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          {user && user.role === 'user' && (
            <li>
              <Link to="/cart" className="cart-link">
                🛒 Cart
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </Link>
            </li>
          )}
          {user && (
            <li>
              <Link to={getDashboardLink()}>Dashboard</Link>
            </li>
          )}
        </ul>

        <div className="nav-auth">
          {user ? (
            <div className="user-menu">
              <span className="user-name">{user.name.split(' ')[0]}</span>
              <Link to="/profile" className="btn-profile">Profile</Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
