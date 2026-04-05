import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/style.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();
    const API_URL = "http://localhost:5000";

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    const removeFromFavorites = (id) => {
        const updated = favorites.filter(item => item._id !== id);
        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
    };

    return (
        <div className="favorites-page bg-light-custom min-vh-100 pb-5">
            <div className="container pt-4 d-flex align-items-center mb-4">
                <button onClick={() => navigate('/')} className="btn bg-white shadow-sm rounded-circle p-2 me-3">
                    <i className="bi bi-chevron-left"></i>
                </button>
                <h4 className="fw-bold mb-0">Món yêu thích ❤️</h4>
            </div>

            <div className="container">
                {favorites.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-heart text-muted fs-1"></i>
                        <p className="mt-3 text-muted">Yến chưa thả tim món nào hết!</p>
                        <button onClick={() => navigate('/')} className="btn btn-dark rounded-pill px-4">Khám phá Menu</button>
                    </div>
                ) : (
                    <div className="row row-cols-2 g-3">
                        {favorites.map(p => (
                            <div key={p._id} className="col">
                                <div className="card h-100 premium-card shadow-sm border-0 position-relative">
                                    <button
                                        className="btn btn-sm position-absolute top-0 end-0 m-2 bg-white rounded-circle shadow-sm text-danger"
                                        onClick={() => removeFromFavorites(p._id)}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                    <img
                                        src={`${API_URL}/images/${p.image}`}
                                        className="card-img-top"
                                        alt={p.name}
                                        onClick={() => navigate(`/product/${p._id}`)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <div className="card-body p-2">
                                        <h6 className="card-title text-truncate small fw-bold">{p.name}</h6>
                                        <span className="fw-bold text-umber">{p.price.toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Nav giữ nguyên để khách quay lại nhanh */}
            <div className="bottom-nav shadow-lg">
                <i className="bi bi-house-door" onClick={() => navigate('/')}></i>
                <i className="bi bi-cart3" onClick={() => navigate('/cart')}></i>
                <i className="bi bi-heart-fill active"></i>
                <i className="bi bi-person-circle" onClick={() => navigate('/login')}></i>
            </div>
        </div>
    );
};

export default Favorites;