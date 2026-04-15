# 🍔 FoodieExpress - Food Delivery Web Application
### GLA University | B.Tech CSE 3rd Year | Session 2025-26
### Built with MERN Stack

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Build](https://img.shields.io/badge/build-no%20CI-lightgrey)

---

## 👥 Team Members
- Krishna Agarwal (2315100008) — Team Leader
- Lokesh Chaudhary (2315100009)
- Mohd. Faizan (2315100010)
- Mohit Chandwani (2315100011)
- Parth Teotia (2315100012)

**Supervisor:** Mr. Akash Gupta | Technical Trainer, Bridgelabz

---

## 📌 What This Project Does
FoodieExpress is a full-stack food delivery platform with:
- Role-based accounts (Customer, Restaurant, Admin)
- Food browsing, search, and category filters
- Cart and checkout flow with address details
- Order placement and order tracking
- COD and Razorpay online payment support

---

## 💡 Why This Project Is Useful
- Great MERN reference project for authentication + authorization flows
- Demonstrates real-world e-commerce patterns (cart, order lifecycle, dashboards)
- Includes frontend fallback demo mode for menu data when backend is unavailable
- Useful base code for college projects and startup MVPs

---

## 🛠️ Tech Stack
| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React.js, React Router, Axios |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB, Mongoose             |
| Auth      | JWT, bcryptjs                 |

---

## 📁 Project Structure
```
food-delivery/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Auth, Food, Cart, Order logic
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # User, Food, Order schemas
│   ├── routes/         # API routes
│   ├── uploads/        # Food images
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── components/ # Navbar, Footer
        ├── context/    # AuthContext, CartContext
        ├── pages/      # Home, Menu, Cart, Login, Register
        └── utils/      # Axios API instance
```

---

## 🚀 How to Run

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm

### Step 0: Install dependencies (from root)
```bash
npm run install:all
```

Or install manually for each app:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 1: Setup Backend
```bash
cd backend
npm install
```

Edit `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Create uploads folder:
```bash
mkdir uploads
```

Start backend:
```bash
npm run dev    # development (nodemon)
npm start      # production
```

### Step 2: Setup Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**
Backend API runs on: **http://localhost:5000**

### Optional: Run both from root
```bash
npm run dev
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | /api/auth/register    | Register user     |
| POST   | /api/auth/login       | Login user        |
| GET    | /api/auth/profile     | Get user profile  |
| PUT    | /api/auth/profile     | Update profile    |
| GET    | /api/auth/users       | Get all users (Admin) |

### Food
| Method | Endpoint         | Description          |
|--------|-----------------|----------------------|
| GET    | /api/food        | Get all food items   |
| GET    | /api/food/:id    | Get single food item |
| POST   | /api/food        | Add food (Admin)     |
| PUT    | /api/food/:id    | Update food (Admin)  |
| DELETE | /api/food/:id    | Delete food (Admin)  |

### Orders
| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| POST   | /api/order                | Place order           |
| POST   | /api/order/create-razorpay-order | Create Razorpay order |
| POST   | /api/order/verify-payment | Verify online payment |
| GET    | /api/order/myorders       | Get my orders         |
| GET    | /api/order                | Get all orders (Admin)|
| PUT    | /api/order/:id/status     | Update status (Admin) |

### Cart
| Method | Endpoint         | Description     |
|--------|------------------|-----------------|
| POST   | /api/cart         | Get cart items  |

### Restaurant Dashboard
| Method | Endpoint                         | Description                     |
|--------|----------------------------------|---------------------------------|
| GET    | /api/restaurant/stats            | Restaurant order stats          |
| GET    | /api/restaurant/earnings         | Monthly earnings                |
| GET    | /api/restaurant/orders           | Restaurant-specific orders      |
| PUT    | /api/restaurant/order/:id/status | Restaurant updates order status |

---

## ✨ Features
- ✅ User Registration & Login (JWT Auth)
- ✅ Browse Food by Category
- ✅ Search Food Items
- ✅ Add/Remove items from Cart
- ✅ Place Order with Delivery Address
- ✅ COD & Online Payment options
- ✅ Real-time Cart Counter in Navbar
- ✅ Responsive UI (Mobile friendly)
- ✅ Demo mode (works without backend)
- ✅ Admin: Add/Update/Delete food items
- ✅ Admin: View & update order status

---

## 📸 Pages
1. **Home** — Hero section, categories, features
2. **Menu** — Filter by category, search, add to cart
3. **Cart** — View items, enter address, place order
4. **Login** — JWT-based login
5. **Register** — Create new account

---

## 🆘 Where to Get Help
- Check route files in backend for endpoint behavior and auth requirements.
- Check frontend context and page files for app flow and state handling.
- Open an issue in your repository with reproduction steps and expected behavior.

---

## 🤝 Who Maintains and Contributes
Maintained by the FoodieExpress student team listed above under **Team Members**.

### Quick Contribution Guide
1. Fork the repository.
2. Create a feature branch (`feature/your-change`).
3. Keep commits focused and descriptive.
4. Test frontend + backend locally.
5. Open a pull request with summary, screenshots (if UI), and test notes.

