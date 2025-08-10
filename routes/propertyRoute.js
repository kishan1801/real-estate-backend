// routes/propertyRoute.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');

// Multer config (disk storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, Date.now() + '-' + safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, allowed.test(ext));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

// Public endpoints
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected create/update (add authMiddleware if required)
router.post('/', /* authMiddleware, */ upload.array('photos', 10), createProperty);
router.put('/:id', /* authMiddleware, */ upload.array('photos', 10), updateProperty);
router.delete('/:id', /* authMiddleware, */ deleteProperty);

module.exports = router;
