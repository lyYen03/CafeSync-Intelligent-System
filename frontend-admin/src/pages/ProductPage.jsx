import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
} from "../api/productApi";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // LOAD DATA
  const fetchData = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // OPEN MODAL
  const openModal = (item = null) => {
    setEditing(item);
    setOpen(true);

    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
      setFileList([]);
    }
  };

  // UPLOAD IMAGE
  const handleUpload = async () => {
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("images", file.originFileObj);
    });

    const res = await uploadImages(formData);
    return res.data.imageUrls;
  };

  // SUBMIT
  const handleOk = async () => {
    const values = await form.validateFields();

    let imageUrls = [];

    if (fileList.length > 0) {
      imageUrls = await handleUpload();
    }

    const payload = {
      ...values,
      image: imageUrls[0] || editing?.image,
    };

    if (editing) {
      await updateProduct(editing._id, payload);
      message.success("Cập nhật món thành công");
    } else {
      await createProduct(payload);
      message.success("Thêm món thành công");
    }

    setOpen(false);
    fetchData();
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteProduct(id);
    message.success("Xóa thành công");
    fetchData();
  };

  const columns = [
    {
      title: "Hình",
      dataIndex: "image",
      render: (img) => (
        <img
          src={`http://localhost:5000/images/${img}`}
          style={{ width: 60, height: 60, objectFit: "cover" }}
        />
      ),
    },
    { title: "Tên món", dataIndex: "name" },
    { title: "Giá", dataIndex: "price" },
    { title: "Danh mục", dataIndex: "category" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <>
          <Button onClick={() => openModal(record)}>Sửa</Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>☕ Quản lý món uống</h2>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => openModal()}
        style={{ marginBottom: 16 }}
      >
        Thêm món
      </Button>

      <Table rowKey="_id" dataSource={products} columns={columns} />

      {/* MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleOk}
        title={editing ? "Sửa món" : "Thêm món"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên món"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="category" label="Danh mục">
            <Input />
          </Form.Item>

          {/* UPLOAD */}
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            + Upload
          </Upload>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;