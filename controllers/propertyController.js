// controllers/propertyController.js
const Property = require('../models/Property');

const parseNumber = (val) => {
  if (val === undefined || val === null || val === '') return undefined;
  const n = Number(val);
  return Number.isNaN(n) ? val : n;
};

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (val === 'true' || val === '1') return true;
  if (val === 'false' || val === '0') return false;
  return undefined;
};

const normalizePhotosFromBody = (bodyPhotos) => {
  if (!bodyPhotos) return [];
  if (Array.isArray(bodyPhotos)) return bodyPhotos.filter(Boolean);
  try {
    const parsed = JSON.parse(bodyPhotos);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (e) {}
  return [];
};

exports.createProperty = async (req, res) => {
  try {
    const raw = { ...req.body };

    const data = {
      title: raw.title,
      location: raw.location,
      price: parseNumber(raw.price),
      negotiable: parseBoolean(raw.negotiable) ?? false,
      ownership: raw.ownership,
      age: raw.age,
      approved: parseBoolean(raw.approved) ?? false,
      description: raw.description,
      bankLoan: parseBoolean(raw.bankLoan) ?? false,

      length: parseNumber(raw.length),
      breadth: parseNumber(raw.breadth),
      totalArea: parseNumber(raw.totalArea),
      unit: raw.unit,
      bhk: parseNumber(raw.bhk),
      floor: parseNumber(raw.floor),
      attached: parseBoolean(raw.attached) ?? false,
      westernToilet: parseBoolean(raw.westernToilet) ?? false,
      furnished: parseBoolean(raw.furnished) ?? false,
      parking: parseBoolean(raw.parking) ?? false,
      lift: parseBoolean(raw.lift) ?? false,
      electricity: raw.electricity,
      facing: raw.facing,

      ownerName: raw.ownerName,
      mobile: raw.mobile,
      postedBy: raw.postedBy,
      saleType: raw.saleType,
      featuredPackage: raw.featuredPackage,
      ppdPackage: raw.ppdPackage,

      email: raw.email,
      city: raw.city,
      area: raw.area,
      pincode: raw.pincode,
      address: raw.address,
      landmark: raw.landmark,
      latitude: raw.latitude,
      longitude: raw.longitude,
    };

    // photos from body (e.g., JSON array of URLs)
    data.photos = normalizePhotosFromBody(raw.photos);

    // photos from uploaded files (Multer)
    if (req.files && req.files.length) {
      const fileUrls = req.files.map(f => `/uploads/${f.filename}`);
      data.photos = [...(data.photos || []), ...fileUrls];
    }

    const property = new Property(data);
    const saved = await property.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('createProperty error:', err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
  try {
    const raw = { ...req.body };

    // Build the data object (same normalization as createProperty)
    const data = {
      title: raw.title,
      location: raw.location,
      price: parseNumber(raw.price),
      negotiable: parseBoolean(raw.negotiable) ?? false,
      ownership: raw.ownership,
      age: raw.age,
      approved: parseBoolean(raw.approved) ?? false,
      description: raw.description,
      bankLoan: parseBoolean(raw.bankLoan) ?? false,

      length: parseNumber(raw.length),
      breadth: parseNumber(raw.breadth),
      totalArea: parseNumber(raw.totalArea),
      unit: raw.unit,
      bhk: parseNumber(raw.bhk),
      floor: parseNumber(raw.floor),
      attached: parseBoolean(raw.attached) ?? false,
      westernToilet: parseBoolean(raw.westernToilet) ?? false,
      furnished: parseBoolean(raw.furnished) ?? false,
      parking: parseBoolean(raw.parking) ?? false,
      lift: parseBoolean(raw.lift) ?? false,
      electricity: raw.electricity,
      facing: raw.facing,

      ownerName: raw.ownerName,
      mobile: raw.mobile,
      postedBy: raw.postedBy,
      saleType: raw.saleType,
      featuredPackage: raw.featuredPackage,
      ppdPackage: raw.ppdPackage,

      email: raw.email,
      city: raw.city,
      area: raw.area,
      pincode: raw.pincode,
      address: raw.address,
      landmark: raw.landmark,
      latitude: raw.latitude,
      longitude: raw.longitude,
    };

    // photos passed in body (existing URLs) may be a JSON string or an array
    data.photos = normalizePhotosFromBody(raw.photos);

    // photos uploaded via Multer
    if (req.files && req.files.length) {
      const fileUrls = req.files.map(f => `/uploads/${f.filename}`);
      data.photos = [...(data.photos || []), ...fileUrls];
    }

    // Update with validators enabled so mongoose checks types/required
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('updateProperty error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
