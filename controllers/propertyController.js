const Property = require('../models/Property');

//post req.....
exports.createProperty = async (req, res) => {
    try {
        const property = new Property(req.body);
        const saved = await property.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//get req...

exports.getAllProperties = async (req, res) => {
    try {
        const { search } = req.query;

        const query = search
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } }
                ]
            }
            : {};
        const properties = await Property.find(query);
        res.json(properties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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


exports.updateProperty = async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json(updatedProperty);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


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
