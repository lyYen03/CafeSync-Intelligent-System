import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/track.css'; // File CSS riêng biệt để dễ quản lý

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
            <p className="text-muted fw-bold">Đang tìm đơn hàng của Yến...</p>
        </div>
    );

    if (!order) return (
        <div className="container mt-5 text-center py-5 animate__animated animate__fadeIn">
            <div className="empty-state-icon mb-4"><i className="bi bi-search"></i></div>
            <h5 className="fw-bold">Không tìm thấy đơn hàng nào</h5>
            <p className="text-muted small px-4">Có thể đơn hàng đã cũ hoặc chưa được lưu. Thử đặt món mới nhé!</p>
            <button onClick={() => navigate('/')} className="btn btn-dark rounded-pill px-5 py-3 shadow-sm mt-3">QUAY LẠI MENU</button>
        </div>
    );

    return (
        <div className="track-page min-vh-100">
            {/* Header tinh tế với nút quay lại hình tròn */}
            <div className="container pt-4 d-flex align-items-center mb-4">
                <button onClick={() => navigate('/')} className="btn-back-circle me-3">
                    <i className="bi bi-chevron-left"></i>
                </button>
                <h4 className="fw-bold mb-0">Theo dõi đơn hàng</h4>
            </div>

            <div className="container">
                {/* Card Trạng Thái Chính - Soft UI Style */}
                <div className="card-premium mb-4 animate__animated animate__fadeInUp">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="badge-id">#{order.orderID || 'N/A'}</span>
                        <div className="status-label" style={{ color: order.status === 'Hoàn thành' ? '#198754' : '#A47551' }}>
                            <span className="dot"></span> {order.status || 'Đang xử lý'}
                        </div>
                    </div>

                    {/* Progress Bar hiện đại */}
                    <div className="progress-track-container mb-5">
                        <div className="track-line">
                            <div className="track-line-fill" style={{ width: getProgressWidth(order.status) }}></div>
                        </div>
                        <div className="d-flex justify-content-between position-relative">
                            <div className={`track-step ${order.status ? 'active' : ''}`}>
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

                {/* Card Chi Tiết Món */}
                <div className="card-premium animate__animated animate__fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <h6 className="fw-bold mb-4 d-flex align-items-center">
                        <i className="bi bi-box-seam me-2"></i> Chi tiết đơn hàng
                    </h6>

                    <div className="item-list">
                        {order.items?.map((item, index) => (
                            <div key={index} className="item-row">
                                <div className="item-info">
                                    <p className="item-name">{item.name}</p>
                                    <span className="item-qty">Số lượng: {item.quantity}</span>
                                </div>
                                <p className="item-price">{(item.price * item.quantity).toLocaleString()}đ</p>
                            </div>
                        ))}
                    </div>

                    <div className="total-section mt-4 pt-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted fw-bold">Tổng cộng</span>
                            <span className="total-amount">{(order.totalPrice || 0).toLocaleString()}đ</span>
                        </div>
                    </div>
                </div>

                <p className="text-center text-muted small mt-4">
                    <i className="bi bi-arrow-repeat spin"></i> Tự động cập nhật sau 10 giây
                </p>
            </div>
        </div>
    );
};

export default TrackOrder;