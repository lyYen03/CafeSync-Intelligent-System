import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount, userName }) => {
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg shadow-sm sticky-top p-3 bg-white">
            <div className="container d-flex justify-content-between align-items-center">
                <Link className="navbar-brand fw-bold m-0" to="/" style={{ color: '#826644' }}>
                    <i className="bi bi-cup-hot-fill me-1"></i> CaféSync
                </Link>

                <div className="d-flex gap-2 align-items-center ms-auto">
                    {/* Nút Theo dõi đơn nhanh */}
                    <Link to="/track-order" className="btn btn-sm rounded-pill px-3 shadow-sm btn-track-new">
                        <i className="bi bi-clock-history me-1"></i> <span className="d-none d-sm-inline">Trạng thái</span>
                    </Link>

                    {/* Giỏ hàng */}
                    <Link to="/cart" className="btn btn-outline-dark position-relative rounded-pill px-3 shadow-sm border-0 bg-transparent">
                        <i className="bi bi-cart3 fs-5 text-dark"></i>
                        {cartCount > 0 && (
                            <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Nút Tài khoản: Có tên thì vào Profile, chưa có thì vào Login */}
                    <button
                        onClick={() => navigate(userName ? '/profile' : '/login')}
                        className="btn btn-dark rounded-circle shadow-sm d-flex align-items-center justify-content-center border-0 user-avatar-btn"
                        style={{ width: '40px', height: '40px' }}
                    >
                        <i className={userName ? "bi bi-person-check-fill" : "bi bi-person-fill"}></i>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;