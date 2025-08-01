const express = require('express');
const router = express.Router();

const{createProperty, getAllProperties} = require('../controllers/propertyController');

router.post('/', createProperty);
router.get('/', getAllProperties);



module.exports = router;