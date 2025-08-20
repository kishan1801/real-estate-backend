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
      location: raw.location || raw.city || '',
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

    data.photos = normalizePhotosFromBody(raw.photos);

    if (req.files && req.files.length) {
      const fileUrls = req.files.map((f) => `/uploads/${f.filename}`);
      data.photos = [...(data.photos || []), ...fileUrls];
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    data.owner = req.user._id;

    const property = new Property(data);
    const saved = await property.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('createProperty error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { area: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const properties = await Property.find(query).populate('owner', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const raw = { ...req.body };

    const existing = await Property.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Property not found' });

    if (!req.user || !req.user._id) return res.status(401).json({ error: 'Unauthorized' });

    const isOwner = String(existing.owner) === String(req.user._id);
    const isAdmin = req.user.role && req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden: not owner' });

    const data = {
      title: raw.title,
      location: raw.location || raw.city,
      price: parseNumber(raw.price),
      negotiable: parseBoolean(raw.negotiable) ?? existing.negotiable,
      ownership: raw.ownership ?? existing.ownership,
      age: raw.age ?? existing.age,
      approved: parseBoolean(raw.approved) ?? existing.approved,
      description: raw.description ?? existing.description,
      bankLoan: parseBoolean(raw.bankLoan) ?? existing.bankLoan,

      length: parseNumber(raw.length) ?? existing.length,
      breadth: parseNumber(raw.breadth) ?? existing.breadth,
      totalArea: parseNumber(raw.totalArea) ?? existing.totalArea,
      unit: raw.unit ?? existing.unit,
      bhk: parseNumber(raw.bhk) ?? existing.bhk,
      floor: parseNumber(raw.floor) ?? existing.floor,
      attached: parseBoolean(raw.attached) ?? existing.attached,
      westernToilet: parseBoolean(raw.westernToilet) ?? existing.westernToilet,
      furnished: parseBoolean(raw.furnished) ?? existing.furnished,
      parking: parseBoolean(raw.parking) ?? existing.parking,
      lift: parseBoolean(raw.lift) ?? existing.lift,
      electricity: raw.electricity ?? existing.electricity,
      facing: raw.facing ?? existing.facing,

      ownerName: raw.ownerName ?? existing.ownerName,
      mobile: raw.mobile ?? existing.mobile,
      postedBy: raw.postedBy ?? existing.postedBy,
      saleType: raw.saleType ?? existing.saleType,
      featuredPackage: raw.featuredPackage ?? existing.featuredPackage,
      ppdPackage: raw.ppdPackage ?? existing.ppdPackage,

      email: raw.email ?? existing.email,
      city: raw.city ?? existing.city,
      area: raw.area ?? existing.area,
      pincode: raw.pincode ?? existing.pincode,
      address: raw.address ?? existing.address,
      landmark: raw.landmark ?? existing.landmark,
      latitude: raw.latitude ?? existing.latitude,
      longitude: raw.longitude ?? existing.longitude,
    };

    data.photos = normalizePhotosFromBody(raw.photos);
    if ((!data.photos || data.photos.length === 0) && Array.isArray(existing.photos)) {
      data.photos = [...existing.photos];
    }

    if (req.files && req.files.length) {
      const fileUrls = req.files.map((f) => `/uploads/${f.filename}`);
      data.photos = [...(data.photos || []), ...fileUrls];
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    console.error('updateProperty error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const existing = await Property.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Property not found' });

    if (!req.user || !req.user._id) return res.status(401).json({ error: 'Unauthorized' });

    const isOwner = String(existing.owner) === String(req.user._id);
    const isAdmin = req.user.role && req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden: not owner' });

    await existing.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('deleteProperty error:', err);
    res.status(500).json({ error: err.message });
  }
};
