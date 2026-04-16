# 🍔 FoodieExpress - Food Delivery Web Application
### GLA University | B.Tech CSE 3rd Year | Session 2025-26
### Built with MERN Stack

---

## 👥 Team Members
- Krishna Agarwal (2315100008) — Team Leader
- Lokesh Chaudhary (2315100009)
- Mohd. Faizan (2315100010)
- Mohit Chandwani (2315100011)
- Parth Teotia (2315100012)

**Supervisor:** Mr. Akash Gupta | Technical Trainer, Bridgelabz

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

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | /api/auth/register    | Register user     |
| POST   | /api/auth/login       | Login user        |
| GET    | /api/auth/profile     | Get user profile  |

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
| GET    | /api/order/myorders       | Get my orders         |
| GET    | /api/order                | Get all orders (Admin)|
| PUT    | /api/order/:id/status     | Update status (Admin) |

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

