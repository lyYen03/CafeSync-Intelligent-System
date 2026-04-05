import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../assets/css/style.css';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [orderType, setOrderType] = useState("Tại bàn");
    const [tableNo, setTableNo] = useState("1");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const API_URL = "http://localhost:5000";

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
        if (savedCart.length === 0) {
            navigate('/cart');
        }
    }, [navigate]);

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderData = {
            orderID: `CFS${Math.floor(Math.random() * 9000 + 1000)}`,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                options: item.options || { size: 'M', sugar: '100%', ice: '100%' }
            })),
            totalPrice: totalPrice,
            location: orderType === "Mang đi" ? "Mang đi" : `Bàn ${tableNo}`,
            status: "Chờ xác nhận",
            // Lưu thêm email khách nếu họ đã đăng nhập, nếu không thì để trống
            customerEmail: localStorage.getItem('userEmail') || "Guest"
        };

        try {
            const response = await axios.post(`${API_URL}/api/orders`, orderData);

            Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công!',
                text: 'Dù là khách vãng lai, Yến vẫn theo dõi được đơn nhé!',
                confirmButtonColor: '#826644',
                confirmButtonText: 'Xem trạng thái'
            }).then(() => {
                // Lưu ID đơn hàng vào máy để khách vãng lai vẫn xem được
                localStorage.setItem('lastOrderDBId', response.data._id || response.data.order._id);
                localStorage.removeItem('cart');
                window.dispatchEvent(new Event('cartUpdated'));
                navigate('/track-order');
            });
        } catch (error) {
            setIsSubmitting(false);
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không gửi được đơn hàng!' });
        }
    };

    return (
        <div className="checkout-page bg-light-custom min-vh-100 pb-5">
            <div className="container pt-4 d-flex align-items-center mb-4">
                <Link to="/cart" className="btn bg-white shadow-sm rounded-circle p-2 me-3"><i className="bi bi-chevron-left"></i></Link>
                <h4 className="fw-bold mb-0">Thanh toán</h4>
            </div>
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-3">Tóm tắt món</h5>
                            {cart.map((item, i) => (
                                <div key={i} className="d-flex justify-content-between border-bottom py-2">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between mt-3 fw-bold fs-5">
                                <span>Tổng cộng</span>
                                <span style={{ color: '#826644' }}>{totalPrice.toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <label className="fw-bold mb-2 small">Hình thức nhận</label>
                            <select className="form-select mb-3 p-3 border-0 bg-light rounded-3 shadow-none"
                                onChange={(e) => setOrderType(e.target.value)}>
                                <option value="Tại bàn">Tại bàn</option>
                                <option value="Mang đi">Mang đi</option>
                            </select>
                            {orderType === "Tại bàn" && (
                                <select className="form-select mb-3 p-3 border-0 bg-light rounded-3 shadow-none"
                                    onChange={(e) => setTableNo(e.target.value)}>
                                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Bàn {n}</option>)}
                                </select>
                            )}
                            <button className="btn btn-dark w-100 py-3 rounded-4 fw-bold"
                                onClick={handlePlaceOrder} disabled={isSubmitting}>
                                {isSubmitting ? "ĐANG GỬI..." : "XÁC NHẬN ĐẶT MÓN"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;