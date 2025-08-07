const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Step 1: Basic Info
  title:        { type: String,  required: true },
  price:        { type: Number,  required: true },
  negotiable:   { type: Boolean, default: false },
  ownership:    { type: String,  enum: ['owner','builder','dealer'], required: true },
  age:          { type: String },
  approved:     { type: Boolean, default: false },
  description:  { type: String },
  bankLoan:     { type: Boolean, default: false },

  // Step 2: Property Detail
  length:           { type: Number },
  breadth:          { type: Number },
  totalArea:        { type: Number },
  unit:             { type: String, enum: ['sqft','sqm'], default: 'sqft' },
  bhk:              { type: Number },
  floor:            { type: Number },
  attached:         { type: Boolean, default: false },
  westernToilet:    { type: Boolean, default: false },
  furnished:        { type: Boolean, default: false },
  parking:          { type: Boolean, default: false },
  lift:             { type: Boolean, default: false },
  electricity:      { type: String },  
  facing:           { type: String },

  // Step 3: General Info
  ownerName:       { type: String },
  mobile:          { type: String },
  postedBy:        { type: String, enum: ['owner','broker','builder'] },
  saleType:        { type: String, enum: ['new','resale'] },
  featuredPackage: { type: String },
  ppdPackage:      { type: String },
  photos:          { type: [String] },  

  // Step 4: Location Info
  email:    { type: String },
  city:     { type: String },
  area:     { type: String },
  pincode:  { type: String },
  address:  { type: String },
  landmark: { type: String },
  latitude: { type: String },
  longitude:{ type: String },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Property', propertySchema);
