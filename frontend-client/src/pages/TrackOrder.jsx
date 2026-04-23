import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/track.css';

const TrackOrder = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = "http://localhost:5000";

    const fetchStatus = async () => {
        const orderDBId = localStorage.getItem('lastOrderDBId');
        const url = (orderDBId && orderDBId !== "null")
            ? `${API_URL}/api/orders/${orderDBId}`
            : `${API_URL}/api/orders/latest`;

        try {
            const res = await axios.get(url);
            const data = res.data.order || res.data.data || res.data;
            setOrder(data);
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const getProgressWidth = (status) => {
        if (status === 'Đang pha chế' || status === 'Pha chế') return '50%';
        if (status === 'Hoàn thành' || status === 'Đã xong') return '100%';
        return '0%';
    };

    if (loading) return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-creme">
            <div className="spinner-coffee mb-3"></div>
            <p className="text-muted fw-bold">Đang tìm đơn hàng của bạn... ☕</p>
        </div>
    );

    if (!order) return (
        <div className="container mt-5 text-center py-5 animate__animated animate__fadeIn">
            <div className="empty-state-icon mb-4"><i className="bi bi-search"></i></div>
            <h5 className="fw-bold">Không tìm thấy đơn hàng</h5>
            <p className="text-muted small px-4">Bạn chưa đặt món hoặc phiên làm việc đã hết hạn.</p>
            <button onClick={() => navigate('/')} className="btn btn-dark rounded-pill px-5 py-3 shadow-sm mt-3">QUAY LẠI MENU</button>
        </div>
    );

    return (
        <div className="track-page min-vh-100 pb-5">
            <div className="container pt-4 d-flex align-items-center mb-4">
                <button onClick={() => navigate('/')} className="btn-back-circle me-3">
                    <i className="bi bi-chevron-left"></i>
                </button>
                <h4 className="fw-bold mb-0">Theo dõi đơn hàng</h4>
            </div>

            <div className="container">
                {/* Card Trạng Thái Chính */}
                <div className="card-premium mb-4 animate__animated animate__fadeInUp">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="badge-id">Mã đơn: #{order.orderID || 'N/A'}</span>
                        <div className="status-label" style={{ color: order.status === 'Hoàn thành' ? '#198754' : '#A47551' }}>
                            <span className="dot"></span> {order.status || 'Đang xử lý'}
                        </div>
                    </div>

                    <div className="progress-track-container mb-5">
                        <div className="track-line">
                            <div className="track-line-fill" style={{ width: getProgressWidth(order.status) }}></div>
                        </div>
                        <div className="d-flex justify-content-between position-relative">
                            <div className={`track-step active`}>
                                <div className="step-blob"><i className="bi bi-receipt"></i></div>
                                <span>Đã nhận</span>
                            </div>
                            <div className={`track-step ${getProgressWidth(order.status) !== '0%' ? 'active' : ''}`}>
                                <div className="step-blob"><i className="bi bi-cup-hot"></i></div>
                                <span>Pha chế</span>
                            </div>
                            <div className={`track-step ${getProgressWidth(order.status) === '100%' ? 'active' : ''}`}>
                                <div className="step-blob"><i className="bi bi-check-lg"></i></div>
                                <span>Hoàn thành</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Chi Tiết Đơn Hàng */}
                <div className="card-premium animate__animated animate__fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <h6 className="fw-bold mb-4 d-flex align-items-center border-bottom pb-2">
                        <i className="bi bi-list-stars me-2"></i> Chi tiết món đã đặt
                    </h6>

                    <div className="item-list">
                        {order.items?.map((item, index) => (
                            <div key={index} className="item-row-track">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="item-info">
                                        <p className="item-name-track">{item.name} <span className="text-muted small">x{item.quantity}</span></p>

                                        {/* Hiện options chi tiết */}
                                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                                            Size: {item.options?.size} | {item.options?.sugar} đường | {item.options?.ice} đá
                                        </small>

                                        {/* Hiện Topping */}
                                        {item.options?.toppings?.length > 0 && (
                                            <small className="d-block" style={{ fontSize: '0.75rem', color: '#A47551' }}>
                                                + Topping: {item.options.toppings.join(', ')}
                                            </small>
                                        )}

                                        {/* Hiện Ghi chú */}
                                        {item.note && (
                                            <div className="track-note-box mt-2">
                                                <i className="bi bi-chat-left-dots me-1"></i> {item.note}
                                            </div>
                                        )}
                                    </div>
                                    <p className="item-price-track">{(item.price * item.quantity).toLocaleString()}đ</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="total-section-track mt-4 pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted fw-bold">Tổng cộng</span>
                            <span className="total-amount-track">{(order.totalPrice || 0).toLocaleString()}đ</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="text-muted small">
                        <i className="bi bi-arrow-repeat spin me-1"></i>
                        Tự động cập nhật sau 10 giây
                    </p>
                    <p className="small text-muted">Vị trí: <strong>{order.location || 'Tại quầy'}</strong></p>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;