import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/style.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const API_URL = "http://localhost:5000";

    // 1. Tải giỏ hàng từ LocalStorage khi vào trang (Thay cho DOMContentLoaded)
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    // 2. Hàm thay đổi số lượng (Thay cho changeQty)
    const updateQuantity = (index, delta) => {
        const newCart = [...cart];
        newCart[index].quantity += delta;

        if (newCart[index].quantity < 1) {
            newCart.splice(index, 1);
        }

        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        // Kích hoạt event để Navbar cập nhật số lượng
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // 3. Hàm xóa món (Thay cho removeItem)
    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // 4. Logic tính toán tổng tiền (Thay cho calculateTotal)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="cart-page pb-5 mb-5 animate__animated animate__fadeIn">
            {/* Header Giỏ hàng Premium */}
            <div className="container pt-4 d-flex align-items-center mb-4">
                <Link to="/" className="btn bg-white shadow-sm rounded-circle p-2 me-3" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-chevron-left text-dark"></i>
                </Link>
                <h4 className="fw-bold mb-0">Giỏ hàng của bạn</h4>
            </div>

            <div className="container mt-2">
                {cart.length === 0 ? (
                    /* TRƯỜNG HỢP GIỎ HÀNG TRỐNG (Thay cho renderCart mẫu trống) */
                    <div className="text-center py-5">
                        <div className="bg-white shadow-sm rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '100px', height: '100px' }}>
                            <i className="bi bi-cart-x fs-1 text-muted"></i>
                        </div>
                        <h5 className="fw-bold">Giỏ hàng đang trống</h5>
                        <p className="text-muted small">Đừng để chiếc bụng đói, chọn món ngay Yến ơi! ☕</p>
                        <Link to="/" className="btn btn-dark rounded-pill px-4 mt-3">Tiếp tục chọn món</Link>
                    </div>
                ) : (
                    /* DANH SÁCH MÓN ĂN (Thay cho cart.map trong renderCart) */
                    <div id="cart-list">
                        {cart.map((item, index) => {
                            const imagePath = (item.image && item.image.startsWith('http'))
                                ? item.image
                                : `${API_URL}/images/${item.image}`;

                            return (
                                <div key={index} className="card border-0 shadow-sm rounded-4 p-3 mb-3 animate__animated animate__fadeInUp">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={imagePath}
                                            className="rounded-4 shadow-sm"
                                            style={{ width: '85px', height: '85px', objectFit: 'cover' }}
                                            alt={item.name}
                                            onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Coffee'}
                                        />
                                        <div className="ms-3 flex-grow-1">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h6 className="fw-bold mb-0" style={{ fontSize: '0.95rem' }}>{item.name}</h6>
                                                    {item.options && (
                                                        <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>
                                                            {item.options.size} | {item.options.sugar} | {item.options.ice}
                                                        </small>
                                                    )}
                                                </div>
                                                <i className="bi bi-x-circle-fill text-danger opacity-25"
                                                    onClick={() => removeItem(index)}
                                                    style={{ cursor: 'pointer', fontSize: '1.1rem' }}></i>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <span className="fw-bold" style={{ color: '#D9A673' }}>
                                                    {(item.price * item.quantity).toLocaleString()}đ
                                                </span>
                                                <div className="d-flex align-items-center bg-light rounded-pill px-1 border border-light-subtle">
                                                    <button className="btn btn-sm border-0 px-2" onClick={() => updateQuantity(index, -1)}><i className="bi bi-dash"></i></button>
                                                    <span className="mx-2 fw-bold small">{item.quantity}</span>
                                                    <button className="btn btn-sm border-0 px-2" onClick={() => updateQuantity(index, 1)}><i className="bi bi-plus"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* THANH THANH TOÁN (Thay cho updateCheckoutBar) */}
            <div className="fixed-bottom bg-white p-4 shadow-lg" style={{ borderRadius: '30px 30px 0 0' }}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted small">Tổng cộng ({totalItems} món)</span>
                        <h4 className="fw-bold mb-0" style={{ color: '#826644' }}>{totalPrice.toLocaleString()}đ</h4>
                    </div>

                    {cart.length === 0 ? (
                        /* NÚT BỊ KHÓA KHI GIỎ TRỐNG */
                        <button className="btn btn-secondary w-100 py-3 rounded-4 fw-bold opacity-50" style={{ cursor: 'not-allowed' }} disabled>
                            GIỎ HÀNG TRỐNG <i className="bi bi-cart-x ms-2"></i>
                        </button>
                    ) : (
                        /* NÚT XÁC NHẬN KHI CÓ MÓN */
                        <button className="btn btn-dark w-100 py-3 rounded-4 fw-bold shadow-sm" onClick={() => navigate('/checkout')}>
                            XÁC NHẬN ĐƠN HÀNG <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;