import { useEffect, useState } from "react";
import { Table, Typography, Spin, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from "antd";
import axios from "axios";

const { Title } = Typography;

const IngredientManagementPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // Load ingredients
  const fetchIngredients = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/ingredients")
      .then(res => setIngredients(res.data))
      .catch(() => setIngredients([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Open modal for add/edit
  const openModal = (ingredient = null) => {
    setEditing(ingredient);
    setModalOpen(true);
    if (ingredient) {
      form.setFieldsValue(ingredient);
    } else {
      form.resetFields();
    }
  };

  // Add or update ingredient
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await axios.put(`http://localhost:5000/api/ingredients/${editing._id}`, values);
        message.success("Cập nhật thành công!");
      } else {
        await axios.post("http://localhost:5000/api/ingredients", values);
        message.success("Thêm mới thành công!");
      }
      setModalOpen(false);
      fetchIngredients();
    } catch (err) {
      message.error(err?.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  // Delete ingredient
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ingredients/${id}`);
      message.success("Xóa thành công!");
      fetchIngredients();
    } catch {
      message.error("Xóa thất bại!");
    }
  };

  const columns = [
    { title: "Tên nguyên liệu", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
    { title: "Tồn tối thiểu", dataIndex: "minStock", key: "minStock" },
    { title: "Giá", dataIndex: "price", key: "price", render: v => v?.toLocaleString("vi-VN") + " VND" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => openModal(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>📦 Quản lý kho nguyên liệu</Title>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openModal()}>Thêm nguyên liệu</Button>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={ingredients}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Sửa nguyên liệu" : "Thêm nguyên liệu"}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText={editing ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên nguyên liệu"
            name="name"
            rules={[{ required: true, message: "Bắt buộc nhập tên nguyên liệu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Bắt buộc nhập số lượng" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Đơn vị"
            name="unit"
            rules={[{ required: true, message: "Bắt buộc nhập đơn vị" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tồn tối thiểu"
            name="minStock"
            rules={[{ required: true, message: "Bắt buộc nhập tồn tối thiểu" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Bắt buộc nhập giá" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IngredientManagementPage;