const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });  // configure storage as needed

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');

// Public
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected—add your authMiddleware if needed
router.post('/', upload.array('photos', 10), createProperty);
router.put('/:id', upload.array('photos', 10), updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;
