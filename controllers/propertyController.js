const Property = require('../models/Property');

// POST /api/properties
exports.createProperty = async (req, res) => {
  try {
    const data = { ...req.body };

    // If you're using Multer to upload files under field name 'photos':
    // req.files will be an array of files; map them to URLs or paths
    if (req.files && req.files.length) {
      data.photos = req.files.map(f => `/uploads/${f.filename}`);
    }

    const property = new Property(data);
    const saved = await property.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/properties
exports.getAllProperties = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { title:        { $regex: search, $options: 'i' } },
            { ownerName:    { $regex: search, $options: 'i' } },
            { city:         { $regex: search, $options: 'i' } },
            { area:         { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const properties = await Property.find(query);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/properties/:id
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length) {
      data.photos = req.files.map(f => `/uploads/${f.filename}`);
    }
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
