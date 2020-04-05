const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: String,
    capacity: Number,
    menu: [{ name: String, price: Number, ImageLink: String }],
    cuisines: Number,
    location: [{ let: Number, long: Number }],
    review: [
      {
        userId: String,
        name: String,
        description: String,
        timeOfReview: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
