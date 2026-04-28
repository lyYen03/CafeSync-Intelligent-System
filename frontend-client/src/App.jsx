import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/css/style.css';

// --- IMPORT CÁC TRANG ---
import Home from './pages/Home.jsx';
import Detail from './pages/Detail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import Login from './pages/Login.jsx';
import Favorites from './pages/Favorites.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import Profile from './pages/Profile.jsx'; // <--- MÁ THÊM TRANG PROFILE NÀY

function App() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <Router>
      <div className="cafesync-client">
        <Routes>
          <Route path="/" element={<Home cartCount={cartCount} />} />
          <Route path="/product/:id" element={<Detail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} /> {/* <--- ROUTE PROFILE ĐÃ SẴN SÀNG */}
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;