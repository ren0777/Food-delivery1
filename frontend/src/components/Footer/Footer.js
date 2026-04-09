import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>🍔 FoodieExpress</h2>
          <p>Delivering happiness to your doorstep</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/cart">Cart</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>📧 support@foodieexpress.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 Mathura, Uttar Pradesh</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 FoodieExpress. Built with MERN Stack | GLA University Project</p>
      </div>
    </footer>
  );
};

export default Footer;
