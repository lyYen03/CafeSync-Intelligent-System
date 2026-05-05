import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import Chatbot from '../components/Chatbot';

const removeAccents = (str) => {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
};

const Home = ({ cartCount }) => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
    const [hasOrder, setHasOrder] = useState(!!localStorage.getItem('lastOrderDBId'));

    const navigate = useNavigate();
    const API_URL = "http://localhost:5000";

    const categoryMap = {
        "Cà Phê": "69d362f64faad13bdcfb2de2",
        "Sinh tố": "69ce855ce29634cdd7933c0b",
        "Trà": "69ce856be29634cdd7933c0f",
        "Nước ép": "69ce8560e29634cdd7933c0d"
    };

    const handleLogout = () => {
        if (window.confirm(`${userName || 'Bạn'} ơi, bạn muốn đăng xuất sao? ☕`)) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            setUserName('');
            alert("Đã đăng xuất thành công!");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `${API_URL}/api/products`;
                if (category !== 'all') {
                    const catId = categoryMap[category];
                    if (catId) url += `?category=${catId}`;
                }
                const res = await axios.get(url);
                setProducts(res.data);
            } catch (err) { console.error("Lỗi lấy dữ liệu:", err); }
        };
        fetchData();
        // Kiểm tra xem máy có đơn hàng nào vừa đặt không để hiện nút theo dõi
        setHasOrder(!!localStorage.getItem('lastOrderDBId'));
    }, [category]);

    const toggleFavorite = (e, product) => {
        e.stopPropagation();
        let currentFavs = JSON.parse(localStorage.getItem('favorites')) || [];
        const isExist = currentFavs.find(item => item._id === product._id);

        let updatedFavs;
        if (isExist) {
            updatedFavs = currentFavs.filter(item => item._id !== product._id);
        } else {
            updatedFavs = [...currentFavs, product];
        }

        setFavorites(updatedFavs);
        localStorage.setItem('favorites', JSON.stringify(updatedFavs));
    };

    const addToCart = (e, product) => {
        e.stopPropagation();
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item._id === product._id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1, options: { size: "M", sugar: "100%", ice: "100%" } });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className="home-container pb-5 mb-5 animate__animated animate__fadeIn">
            {/* 1. Header Chào hỏi & Nút chức năng */}
            <div className="container pt-4 d-flex justify-content-between align-items-center mb-1">
                <div>
                    <h4 className="fw-bold mb-0" style={{ fontFamily: 'Playfair Display', color: '#826644' }}>CaféSync</h4>
                    <small className="text-muted">{userName ? `Chào ${userName} ✨` : "Chào bạn ✨"}</small>
                </div>
                <div className="d-flex gap-2">
                    {/* Nút Theo dõi đơn (Hiện khi có đơn hàng mới) */}
                    {hasOrder && (
                        <div className="icon-circle bg-white shadow-sm p-2 rounded-circle"
                            style={{ cursor: 'pointer', color: '#826644' }}
                            onClick={() => navigate('/track-order')}
                            title="Theo dõi đơn hàng">
                            <i className="bi bi-clock-history fs-5"></i>
                        </div>
                    )}

                    {/* Nút Đăng xuất / Đăng nhập */}
                    {userName ? (
                        <div className="icon-circle bg-white shadow-sm p-2 rounded-circle text-danger"
                            style={{ cursor: 'pointer' }} onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right fs-5"></i>
                        </div>
                    ) : (
                        <div className="icon-circle bg-white shadow-sm p-2 rounded-circle"
                            onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
                            <i className="bi bi-person fs-5"></i>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Banner Khuyến mãi */}
            <div className="container mt-3">
                <div className="promo-banner shadow-sm">
                    <div>
                        <span className="badge bg-white text-dark rounded-pill mb-2 px-3 py-2 small">Ưu đãi hôm nay</span>
                        <h3 className="fw-bold mb-0">GIẢM 50%</h3>
                        <button className="btn btn-dark btn-sm rounded-pill mt-2 px-4">Đặt Ngay</button>
                    </div>
                    <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80"
                        className="rounded-circle shadow" style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
                </div>
            </div>

            {/* 3. Thanh Tìm kiếm */}
            <div className="container mb-4 mt-3">
                <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border-0">
                    <span className="input-group-text bg-white border-0 ps-3"><i className="bi bi-search text-muted"></i></span>
                    <input type="text" className="form-control border-0 py-3 shadow-none text-dark" placeholder="Tìm món ngon..."
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* 4. Bộ lọc Danh mục */}
            <div className="container mb-4 overflow-auto d-flex gap-2 scrollbar-hidden">
                {['all', 'Cà Phê', 'Sinh tố', 'Nước ép', 'Trà'].map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                        className={`btn rounded-pill px-4 fw-bold text-nowrap border-0 ${category === cat ? 'btn-dark' : 'bg-white shadow-sm'}`}>
                        {cat === 'all' ? 'Tất cả' : cat}
                    </button>
                ))}
            </div>

            {/* 5. Danh sách Sản phẩm */}
            <div className="container">
                <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                    {products.filter(p => removeAccents(p.name).includes(removeAccents(searchTerm))).map(p => (
                        <div key={p._id} className="col mb-2">
                            <div className="card h-100 premium-card shadow-sm position-relative" onClick={() => navigate(`/product/${p._id}`)}>

                                {/* NÚT THẢ TIM TRÊN ẢNH */}
                                <button
                                    className="btn-favorite-float"
                                    onClick={(e) => toggleFavorite(e, p)}
                                >
                                    <i className={`bi ${favorites.find(f => f._id === p._id) ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                                </button>

                                <img src={`${API_URL}/images/${p.image}`} className="card-img-top" alt={p.name} />
                                <div className="card-body p-3">
                                    <h6 className="card-title text-truncate fw-bold">{p.name}</h6>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span className="fw-bold" style={{ color: '#D9A673' }}>{p.price.toLocaleString()}đ</span>
                                        <button className="btn-cart-small shadow-sm" onClick={(e) => addToCart(e, p)}><i className="bi bi-plus"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. Thanh điều hướng dưới cùng (Bottom Nav) */}
            <div className="bottom-nav shadow-lg d-flex justify-content-around align-items-center">
                <i className="bi bi-house-door-fill active" onClick={() => navigate('/')}></i>

                <div className="position-relative" onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>
                    <i className="bi bi-cart3 fs-4"></i>
                    {cartCount > 0 && <span className="badge-cart">{cartCount}</span>}
                </div>

                <i className="bi bi-heart" onClick={() => navigate('/favorites')}></i>
                <i className="bi bi-person-circle" onClick={() => navigate('/login')}></i>
            </div>

            {/* 7. Trợ lý ảo Syncie */}
            <Chatbot />
        </div>
    );
};

export default Home;