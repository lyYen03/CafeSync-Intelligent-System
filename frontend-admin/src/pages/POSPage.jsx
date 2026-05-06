import React, { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import { Modal, Form, Select, Input } from "antd";

const removeAccents = (str) => {
  if (!str) return "";
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str;
};

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("pos_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [optionModal, setOptionModal] = useState({ open: false, product: null });
  const [isToppingOpen, setIsToppingOpen] = useState(false);

  // Đồng bộ giỏ hàng POS vào localStorage
  useEffect(() => {
    localStorage.setItem("pos_cart", JSON.stringify(cart));
  }, [cart]);
  const [optionForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const getSizeExtraPrice = (size) => {
    if (size === 'S') return 0;
    if (size === 'L') return 10000;
    if (size === 'M') return 5000;
    return 0;
  };

  const filteredProducts = products.filter((product) => {
    const productName = removeAccents(product.name);
    const searchKeyword = removeAccents(searchText).trim();
    return productName.includes(searchKeyword);
  });

  // Lấy danh sách sản phẩm
  useEffect(() => {
    axiosClient.get("/products")
      .then(res => setProducts(res.data))
      .catch(() => alert("Không lấy được danh sách món!"));
  }, []);

  // Tăng số lượng
  const increaseQuantity = (cartItemId) => {
    setCart(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Giảm món khỏi giỏ
  const decreaseQuantity = (cartItemId) => {
    setCart(prev =>
      prev
        .map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // Xóa hẳn món khỏi giỏ
  const deleteFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  // Mở modal chỉnh sửa
  const openEditModal = (item) => {
    setOptionModal({ open: true, product: item, editMode: true, cartItemId: item.cartItemId });
    optionForm.setFieldsValue({
      size: item.options?.size,
      topping: item.options?.toppings,
      sugar: item.options?.sugar,
      ice: item.options?.ice,
      note: item.note
    });
  };

  // Đặt món
  const handleOrder = () => {
    if (cart.length === 0) return alert("Chưa chọn món!");
    const orderID = "POS" + Date.now();
    const items = cart.map(item => ({
      id_product: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      options: item.options || {}, // truyền đầy đủ options
      note: item.note || ""
    }));
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderData = {
      orderID,
      items,
      totalPrice,
      location: "Tại quầy",
      paymentMethod: "Tiền mặt",
      // status, createdAt: backend tự sinh
    };
    axiosClient.post("/orders", orderData)
      .then(() => {
        alert("Đặt món thành công!");
        setCart([]);
      })
      .catch((err) => {
        alert("Đặt món thất bại!");
        console.error(err);
      });
  };

  return (
    <div className="container-fluid py-3">
      {/* CSS HOVER trực tiếp */}
      <style>
        {`
        .product-card {
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
        }
        .product-card:hover {
          box-shadow: 0 0 0 3px #0d6efd33, 0 4px 24px rgba(0,0,0,0.10);
          border: 2px solid #0d6efd;
          transform: translateY(-4px) scale(1.03);
          cursor: pointer;
        }
      `}
      </style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold m-0">🛒 POS - Đặt món tại quầy</h3>
        <Input.Search
          placeholder="Tìm kiếm món theo tên..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <div className="row">
        {/* DANH SÁCH MÓN */}
        <div className="col-lg-8">
          <div className="row g-3">
            {filteredProducts.map(product => (
              <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                <div className="card h-100 border-0 shadow-sm product-card">
                  <img
                    src={product.image ? `http://localhost:5000/images/${product.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: 140, objectFit: "cover" }}
                  />

                  <div className="card-body d-flex flex-column p-2">
                    <div className="fw-semibold small text-truncate">
                      {product.name}
                    </div>

                    <div className="text-danger fw-bold mb-2">
                      {product.price?.toLocaleString()}đ
                    </div>

                    <button
                      className="btn btn-sm btn-primary mt-auto"
                      onClick={() => {
                        optionForm.resetFields();
                        setOptionModal({ open: true, product, editMode: false });
                      }}
                    >
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center text-muted py-5">
                Không có sản phẩm
              </div>
            )}
          </div>
        </div>

        {/* GIỎ HÀNG */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header fw-bold">
              🧾 Giỏ hàng
            </div>

            <div className="card-body" style={{ maxHeight: 500, overflowY: "auto" }}>
              {cart.length === 0 && (
                <div className="text-muted">Chưa có món</div>
              )}

              {cart.map((item, index) => (
                <div key={item.cartItemId || index} className="d-flex align-items-center mb-3">
                  <img
                    src={item.image ? `http://localhost:5000/images/${item.image}` : "https://via.placeholder.com/45x45?text=No+Image"}
                    width={45}
                    height={45}
                    style={{ borderRadius: 8, objectFit: "cover", marginRight: 10 }}
                    alt={item.name}
                  />

                  <div className="flex-grow-1" style={{ width: "120px" }}>
                    <div className="fw-semibold small text-truncate">{item.name}</div>
                    {item.options && (
                      <div className="small text-muted" style={{ fontSize: "0.75rem", lineHeight: "1.2" }}>
                        {item.options.size && <span>Size: {item.options.size} </span>}
                        {item.options.toppings && item.options.toppings.length > 0 && <span>| Topping: {item.options.toppings.join(", ")} </span>}
                        {item.options.sugar && <span>| Đường: {item.options.sugar} </span>}
                        {item.options.ice && <span>| Đá: {item.options.ice} </span>}
                        {item.note && <span>| Note: {item.note}</span>}
                      </div>
                    )}
                    <div className="d-flex align-items-center mt-1">
                      <button
                        className="btn btn-sm btn-outline-secondary px-2 py-0"
                        onClick={() => decreaseQuantity(item.cartItemId)}
                        title="Giảm số lượng"
                      >-</button>
                      <span className="mx-2 fw-semibold text-muted small">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-primary px-2 py-0"
                        onClick={() => increaseQuantity(item.cartItemId)}
                        title="Tăng số lượng"
                      >+</button>
                    </div>
                  </div>

                  <div className="fw-bold text-danger mx-2 text-end" style={{ minWidth: "60px" }}>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>

                  <div className="d-flex flex-column gap-1">
                    <button
                      className="btn btn-sm btn-outline-primary py-0 px-2"
                      onClick={() => openEditModal(item)}
                      title="Chỉnh sửa tuỳ chọn"
                    >
                      <i className="bi bi-pencil" style={{ fontSize: "0.8rem" }}></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger py-0 px-2"
                      onClick={() => deleteFromCart(item.cartItemId)}
                      title="Xóa khỏi giỏ"
                    >
                      <i className="bi bi-trash" style={{ fontSize: "0.8rem" }}></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="card-footer">
                <div className="d-flex justify-content-between fw-bold mb-2">
                  <span>Tổng:</span>
                  <span className="text-danger">
                    {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}đ
                  </span>
                </div>

                <button
                  className="btn btn-success w-100"
                  onClick={handleOrder}
                >
                  ✅ Xác nhận
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL TUỲ CHỌN SẢN PHẨM */}
      <Modal
        open={optionModal.open}
        title={optionModal.product?.name}
        onCancel={() => setOptionModal({ open: false, product: null })}
        onOk={() => {
          optionForm.validateFields().then(values => {
            const { size, topping, sugar, ice, note } = values;
            const product = optionModal.product;
            
            if (optionModal.editMode) {
              setCart(prev => prev.map(item => 
                item.cartItemId === optionModal.cartItemId 
                  ? {
                      ...item,
                      options: { size, toppings: topping || [], sugar, ice },
                      note,
                      price: product.price + getSizeExtraPrice(size)
                    }
                  : item
              ));
            } else {
              setCart(prev => [
                ...prev,
                {
                  ...product,
                  cartItemId: Date.now() + Math.random().toString(),
                  quantity: 1,
                  options: { size, toppings: topping || [], sugar, ice },
                  note,
                  price: product.price + getSizeExtraPrice(size)
                }
              ]);
            }
            
            setOptionModal({ open: false, product: null });
            optionForm.resetFields();
          });
        }}
        okText={optionModal.editMode ? "Cập nhật" : "Thêm vào giỏ"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={optionForm} layout="vertical">
          {optionModal.product?.sizes?.length > 0 && (
            <Form.Item name="size" label="Size" rules={[{ required: true, message: "Chọn size" }]}>
              <Select options={optionModal.product.sizes.map(s => {
                const finalPrice = optionModal.product.price + getSizeExtraPrice(s);
                return { 
                  label: `${s} - ${finalPrice.toLocaleString()}đ`, 
                  value: s 
                };
              })} />
            </Form.Item>
          )}
          {optionModal.product?.toppings?.length > 0 && (
            <Form.Item name="topping" label="Topping">
              <Select
                mode="multiple"
                open={isToppingOpen}
                onDropdownVisibleChange={(open) => setIsToppingOpen(open)}
                options={optionModal.product.toppings.map(t => ({ label: t, value: t }))}
                placeholder="Chọn topping (nếu có)"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 8px', borderTop: '1px solid #f0f0f0' }}>
                      <button 
                        type="button"
                        className="btn btn-sm btn-primary py-0"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsToppingOpen(false);
                        }}
                      >
                        Xong
                      </button>
                    </div>
                  </>
                )}
              />
            </Form.Item>
          )}
          {optionModal.product?.sugarOptions?.length > 0 && (
            <Form.Item name="sugar" label="Mức đường" rules={[{ required: true, message: "Chọn mức đường" }]}>
              <Select options={optionModal.product.sugarOptions.map(s => ({ label: s, value: s }))} />
            </Form.Item>
          )}
          {optionModal.product?.iceOptions?.length > 0 && (
            <Form.Item name="ice" label="Mức đá" rules={[{ required: true, message: "Chọn mức đá" }]}>
              <Select options={optionModal.product.iceOptions.map(i => ({ label: i, value: i }))} />
            </Form.Item>
          )}
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea placeholder="Ghi chú cho món này (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default POSPage;