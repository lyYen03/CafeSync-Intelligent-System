import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/style.css';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = "http://localhost:5000";

    // 1. Khai báo State (Thay cho DOM elements)
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [options, setOptions] = useState({ size: 'M', sugar: '100%', ice: '100%' });
    const [note, setNote] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);

    // 2. Lấy dữ liệu sản phẩm từ API
    useEffect(() => {
        axios.get(`${API_URL}/api/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error("Lỗi lấy chi tiết món:", err));

        // Hiệu ứng đổi màu header khi cuộn
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id]);

    if (!product) return <div className="text-center py-5">Đang pha chế... ☕</div>;

    // 3. Tính toán giá tiền theo Size
    const getExtraPrice = () => {
        if (options.size === 'S') return 0;
        if (options.size === 'M') return 5000;
        if (options.size === 'L') return 10000;
        return 0;
    };
    const totalPrice = (product.price + getExtraPrice()) * quantity;

    // 4. Logic Thêm vào giỏ hàng
    const handleAddToCart = () => {
        const newItem = {
            id: product._id,
            name: product.name,
            price: product.price + getExtraPrice(),
            image: product.image,
            quantity: quantity,
            options: options,
            note: note
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Kiểm tra trùng lặp (cùng tên + cùng options)
        const existingIndex = cart.findIndex(item =>
            item.id === newItem.id && JSON.stringify(item.options) === JSON.stringify(newItem.options)
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity += newItem.quantity;
        } else {
            cart.push(newItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); // Báo hiệu cho App.jsx cập nhật Badge

        alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
        navigate('/');
    };

    return (
        <div className="detail-page pb-5">
            {/* Header Nổi (Thay cho fixed-top-action) */}
            <div className={`fixed-top p-3 transition ${isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                <div className="container d-flex justify-content-between">
                    <button className="btn bg-white shadow-sm rounded-circle" onClick={() => navigate(-1)}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="btn bg-white shadow-sm rounded-circle">
                        <i className="bi bi-share"></i>
                    </button>
                </div>
            </div>

            {/* Ảnh sản phẩm lớn tràn viền */}
            <img src={`${API_URL}/images/${product.image}`} className="w-100 header-image"
                style={{ height: '350px', objectFit: 'cover' }} alt={product.name} />

            <div className="container mt-n4 position-relative bg-white rounded-top-5 p-4 shadow-sm" style={{ marginTop: '-30px' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h3 className="fw-bold item-name">{product.name}</h3>
                    <h4 className="fw-bold text-umber" style={{ color: '#826644' }}>{totalPrice.toLocaleString()}đ</h4>
                </div>
                <p className="text-muted small mb-4">{product.description || "Hương vị đậm đà, đánh thức mọi giác quan tại CaféSync."}</p>

                {/* LỰA CHỌN SIZE */}
                <h6 className="fw-bold mb-3">Chọn Size</h6>
                <div className="d-flex gap-3 mb-4">
                    {['S', 'M', 'L'].map(s => (
                        <div key={s} className={`flex-grow-1 p-2 border rounded-3 text-center cursor-pointer transition ${options.size === s ? 'border-dark bg-dark text-white' : 'bg-light'}`}
                            onClick={() => setOptions({ ...options, size: s })}>
                            <div className="fw-bold">{s}</div>
                            <small>{s === 'S' ? 'Nhỏ' : s === 'M' ? 'Vừa' : 'Lớn'}</small>
                        </div>
                    ))}
                </div>

                {/* GHI CHÚ */}
                <h6 className="fw-bold mb-2">Ghi chú</h6>
                <textarea className="form-control border-0 bg-light rounded-4 p-3 mb-4"
                    placeholder="Yêu cầu thêm cho quán (Ví dụ: ít đá, nhiều sữa...)"
                    value={note} onChange={(e) => setNote(e.target.value)}></textarea>

                {/* FOOTER ACTION */}
                <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center bg-light rounded-pill p-1 border">
                        <button className="btn border-0" onClick={() => quantity > 1 && setQuantity(quantity - 1)}><i className="bi bi-dash-circle fs-4"></i></button>
                        <span className="mx-3 fw-bold fs-5">{quantity}</span>
                        <button className="btn border-0" onClick={() => setQuantity(quantity + 1)}><i className="bi bi-plus-circle fs-4"></i></button>
                    </div>
                    <button className="btn btn-dark flex-grow-1 py-3 rounded-pill fw-bold shadow-sm" onClick={handleAddToCart}>
                        THÊM VÀO GIỎ - {totalPrice.toLocaleString()}đ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Detail;