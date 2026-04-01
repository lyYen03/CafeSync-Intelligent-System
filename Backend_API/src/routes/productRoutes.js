const express = require('express');
const router = express.Router();

const { 
    getProducts, 
    createProduct, 
    deleteProduct, 
    updateProduct 
} = require('../controllers/productController');

const upload = require('../config/upload');
// upload ảnh
router.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        imageUrl: `/images/${req.file.filename}`
    });
});
// GET tất cả sản phẩm
router.get('/', getProducts);

// Thêm sản phẩm
router.post('/', createProduct);

// Xóa sản phẩm
router.delete('/:id', deleteProduct);

// Update sản phẩm
router.put('/:id', updateProduct);

module.exports = router;