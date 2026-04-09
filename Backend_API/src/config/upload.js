const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        // Lưu tên gốc + timestamp để tránh trùng
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}-${Date.now()}${ext}`);
        // Nếu muốn giữ nguyên tên gốc (có thể bị trùng):
        // cb(null, file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;