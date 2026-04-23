import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../assets/css/style.css';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [orderType, setOrderType] = useState("Tại bàn");
    const [tableNo, setTableNo] = useState("1");
    const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const API_URL = "http://localhost:5000";

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (savedCart.length === 0) {
            navigate('/cart');
        } else {
            setCart(savedCart);
        }
    }, [navigate]);

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const finalOrderID = `CFS${Math.floor(Math.random() * 900000 + 100000)}`;

        const orderData = {
            orderID: finalOrderID,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                options: item.options,
                note: item.note
            })),
            totalPrice: totalPrice,
            location: orderType === "Mang đi" ? "Mang đi" : `Bàn ${tableNo}`,
            paymentMethod: paymentMethod,
            customerEmail: localStorage.getItem('userEmail') || "Guest"
        };

        try {
            const response = await axios.post(`${API_URL}/api/orders`, orderData);

            // --- XỬ LÝ CHUNG: LƯU ID ĐƠN HÀNG VÀ XÓA GIỎ HÀNG NGAY ---
            const dbOrderId = response.data._id || (response.data.order && response.data.order._id);
            if (dbOrderId) {
                localStorage.setItem('lastOrderDBId', dbOrderId);
            }

            // Xóa sạch giỏ hàng trong máy khách ngay lập tức
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));

            // --- PHÂN LUỒNG THEO PHƯƠNG THỨC THANH TOÁN ---

            // 1. THANH TOÁN ONLINE (Dẫn khách đi quét mã QR)
            if (paymentMethod !== "Tiền mặt" && response.data.checkoutUrl) {
                Swal.fire({
                    icon: 'info',
                    title: 'Đang kết nối...',
                    text: 'Hệ thống đang tạo mã QR thanh toán cho bạn.',
                    timer: 1500,
                    showConfirmButton: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                setTimeout(() => {
                    window.location.href = response.data.checkoutUrl;
                }, 1500);

            } else {
                // 2. TIỀN MẶT (Xong đơn luôn)
                Swal.fire({
                    icon: 'success',
                    title: 'Đặt hàng thành công!',
                    text: 'Đơn hàng đang "Chờ xác nhận". Vui lòng thanh toán tại quầy.',
                    confirmButtonColor: '#826644',
                    confirmButtonText: 'Theo dõi đơn hàng'
                }).then(() => {
                    navigate('/track-order');
                });
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error("Lỗi đặt hàng:", error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.response?.data?.message || 'Không gửi được đơn hàng!'
            });
        }
    };

    return (
        <div className="checkout-page bg-light-custom min-vh-100 pb-5">
            <div className="container pt-4 d-flex align-items-center mb-4">
                <button onClick={() => navigate('/cart')} className="btn bg-white shadow-sm rounded-circle p-2 me-3" style={{ width: '40px', height: '40px', border: 'none' }}>
                    <i className="bi bi-chevron-left text-dark"></i>
                </button>
                <h4 className="fw-bold mb-0">Thanh toán</h4>
            </div>

            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h5 className="fw-bold mb-4 border-bottom pb-2">Tóm tắt đơn hàng</h5>
                            <div className="cart-items-review">
                                {cart.map((item, i) => (
                                    <div key={i} className="mb-3 pb-3 border-bottom-dashed">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1">{item.name} <span className="text-muted">x{item.quantity}</span></h6>
                                                <small className="text-muted d-block">Size: {item.options?.size} | {item.options?.sugar} đường | {item.options?.ice} đá</small>
                                            </div>
                                            <span className="fw-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-between mt-3 fw-bold fs-5">
                                <span>Tổng cộng</span>
                                <span style={{ color: '#826644' }}>{totalPrice.toLocaleString()}đ</span>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-4 text-brown">Phương thức thanh toán</h5>
                            <div className="row g-3">
                                {[
                                    { id: 'Tiền mặt', icon: 'bi-cash-stack', label: 'Tiền mặt', desc: 'Trả tại quầy' },
                                    { id: 'Chuyển khoản', icon: 'bi-qr-code-scan', label: 'QR / Ví điện tử', desc: 'Bank, MoMo, ZaloPay' }
                                ].map((method) => (
                                    <div className="col-6" key={method.id}>
                                        <div
                                            className={`payment-method-card text-center p-3 rounded-4 border ${paymentMethod === method.id ? 'active-method' : ''}`}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: paymentMethod === method.id ? '#fdf8f3' : 'white',
                                                borderColor: paymentMethod === method.id ? '#826644' : '#eee',
                                                transition: 'all 0.3s ease',
                                                minHeight: '100px'
                                            }}
                                            onClick={() => setPaymentMethod(method.id)}
                                        >
                                            <i className={`bi ${method.icon} fs-2 d-block mb-2`} style={{ color: paymentMethod === method.id ? '#826644' : '#666' }}></i>
                                            <span className="fw-bold d-block" style={{ color: paymentMethod === method.id ? '#826644' : '#333' }}>{method.label}</span>
                                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{method.desc}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '20px' }}>
                            <h5 className="fw-bold mb-4">Xác nhận nhận hàng</h5>
                            <div className="mb-3">
                                <label className="small fw-bold text-muted mb-2 text-uppercase">Hình thức</label>
                                <select className="form-select p-3 border-0 bg-light rounded-3 shadow-none fw-bold" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                                    <option value="Tại bàn">Tại bàn</option>
                                    <option value="Mang đi">Mang đi</option>
                                </select>
                            </div>
                            {orderType === "Tại bàn" && (
                                <div className="mb-4">
                                    <label className="small fw-bold text-muted mb-2 text-uppercase">Số bàn</label>
                                    <select className="form-select p-3 border-0 bg-light rounded-3 shadow-none fw-bold" value={tableNo} onChange={(e) => setTableNo(e.target.value)}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>Bàn số {n}</option>)}
                                    </select>
                                </div>
                            )}
                            <button className="btn btn-dark w-100 py-3 rounded-4 fw-bold shadow mt-2" onClick={handlePlaceOrder} disabled={isSubmitting}>
                                {isSubmitting ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT MÓN"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;