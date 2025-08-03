const express = require('express');
const router = express.Router();

const{createProperty, getAllProperties, updateProperty,deleteProperty, getPropertyById} = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createProperty)
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.put('/:id', authMiddleware, updateProperty); 
router.delete('/:id', authMiddleware, deleteProperty); 


module.exports = router;