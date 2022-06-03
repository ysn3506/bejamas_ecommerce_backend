const mongoose = require("mongoose")


const PhotoSchema = mongoose.Schema({
  picId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  image: Object,
  bestseller: Boolean,
  featured: Boolean,
  details: Object,
  size: String,
  description: String,
  recommendations: Array,
});

module.exports = mongoose.model("Photos", PhotoSchema);