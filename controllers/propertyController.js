const property = require('../models/Property');

//post req.....
exports.createProperty = async (req, res) => {
    try {
        const property = new property(req.body);
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
        const properties = await property.find(query);
        res.json(properties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};