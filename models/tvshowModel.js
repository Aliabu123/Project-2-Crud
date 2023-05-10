const mongoose = require("mongoose");

// TV Show Schema
const tvshowSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const TvShow = mongoose.model("TvShow", tvshowSchema);

// TV Show Review Schema
const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tvShow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TvShow",
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = { TvShow, Review };