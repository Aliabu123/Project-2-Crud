

// module.exports = {
//     fetchTvShowsList
// }

// function fetchTvShowsList(req, res) {  
//     axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=19b1ef9&s=Friends`)
//         .then(infoFromAPI => infoFromAPI.data)
//         .then(movieDetails => {
//             res.render("viewTvShowDetails.ejs", {tvshowDetails:tvshowDetails})
//         })

// }

require("dotenv").config();
const axios = require("axios");
const { TvShow, Review } = require("../models/tvshowModel");

// Search for tv shows
exports.getTvShows = async (req, res) => {
  try {
    const tvShowSearchTerm = req.query.searchTerm;

    // handle empty search term
    if (!tvShowSearchTerm) {
      return res.render("index", { tvShows: [] });
    }

    // search tv shows from OMDB API
    const response = await axios.get(
      ` https://www.omdbapi.com/?i=tt3896198&apikey=19b1ef9&s=${tvShowSearchTerm} `);
      // ?i=tt3896198&apikey=19b1ef9rs&s=${tvShowSearchTerm}   );
      // ?apikey=${process.env.OMDB_API_KEY}&i=tt3896198&s=${tvShowSearchTerm}
    // handle empty response i.e no tv show found with search term
    // if (!response.data.Search) {
    //   return res.render("index", { tvShows: [] });
    // }

    // map response to tv show object
    const tvShows = response.data.Search.map((tvShow) => {
      return {
        title: tvShow.Title,
        year: tvShow.Year,
        poster: tvShow.Poster,
        favorite: false,
        reviews: [],
      };
    });

    return res.render("index", { tvShows });
  } catch (err) {
    res.render("error", { message: err.message });
  }
};

// GET favorite tv shows
exports.favoriteTvShow = async (req, res) => {
  try {
    const favoriteTvShows = await TvShow.find({ favorite: true });

    return res.render("favorites", { favoriteTvShows });
  } catch (err) {
    res.render("error", { message: err.message });
  }
};

// Add tv show to favorites
const addFavoriteTvShow = async (req, res) => {
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?i=tt3896198&apikey=19b1ef9&t=${req.body.title}`
    );

    const tvShow = new TvShow({
      title: response.data.Title,
      year: response.data.Year,
      poster: response.data.Poster,
      favorite: true,
    });

    // check if tv show already exists in database
    const existingTvShow = await TvShow.findOne({ title: tvShow.title });

    // if tv show exists, update favorite status else save the tv show
    if (existingTvShow) {
      existingTvShow.favorite = true;
      await existingTvShow.save();
    } else {
      await tvShow.save();
    }

    const favoriteTvShows = await TvShow.find({ favorite: true });

    return res.render("favorites", { favoriteTvShows });
  } catch (err) {
    res.render("error", { message: err.message });
  }
};

// Remove tv show from favorites
const deleteFavoriteTvShow = async (req, res) => {
  try {
    const tvShowId = req.query.tvShowId;
    const tvShow = await TvShow.findById(tvShowId);
    tvShow.favorite = false;
    await tvShow.save();

    const favoriteTvShows = await TvShow.find({ favorite: true });

    return res.render("favorites", { favoriteTvShows });
  } catch (err) {
    res.render("error", { message: err.message });
  }
};

// Handle favorite tv show operations i.e POST(add and update) and DELETE
exports.favoriteOperations = async (req, res) => {
  try {
    const action = req.query.action;
    if (action === "addFavorite") {
      await addFavoriteTvShow(req, res);
    } else if (action === "deleteFavorite") {
      await deleteFavoriteTvShow(req, res);
    } else {
      return res.render("favorites", { favoriteTvShows: [] });
    }
  } catch (error) {
    console.error(error);
    res.render("error", { message: error.message });
  }
};

// Get reviewed tv shows
exports.getReviewedTvShows = async (req, res) => {
  try {
    const favoriteTvShows = await TvShow.find({ favorite: true });

    const reviewedTvShows = await Review.find({}).populate("tvShow");

    return res.render("reviews", { favoriteTvShows, reviewedTvShows });
  } catch (err) {
    res.render("error", { message: err.message });
  }
};

// Add review to tv show
const addReview = async (req, res) => {
  try {
    const tvShowId = req.body.tvShowId;
    const tvShow = await TvShow.findById(tvShowId);

    // check if tv show already has a review
    const existingReview = await Review.findOne({ tvShow: tvShowId });

    // if tv show has a review, update review else create new review
    if (existingReview) {
      existingReview.rating = req.body.rating;
      existingReview.body = req.body.review;
      await existingReview.save();
    } else {
      const review = new Review({
        rating: req.body.rating,
        body: req.body.review,
        tvShow: tvShow,
      });

      await review.save();
      tvShow.reviews.push(review);
      await tvShow.save();
    }

    // reviewedTvShows
    const reviewedTvShows = await Review.find({}).populate("tvShow");

    // favoriteTvShows
    const favoriteTvShows = await TvShow.find({ favorite: true });

    res.render("reviews", { reviewedTvShows, favoriteTvShows });
  } catch (err) {
    res.render("error", { message: err.message });
  }
};

// Delete tv show review
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.query.reviewId;

    // delete review
    await Review.findByIdAndDelete(reviewId);

    // reviewedTvShows
    const reviewedTvShows = await Review.find({}).populate("tvShow");

    // favoriteTvShows
    const favoriteTvShows = await TvShow.find({ favorite: true });

    return res.render("reviews", { reviewedTvShows, favoriteTvShows });
  } catch (err) {
    res.render("error", { message: err.message });
  }
};

// Handle review operations i.e POST(add and update) and DELETE
exports.reviewOperations = async (req, res) => {
  try {
    const action = req.query.action;
    if (action === "addReview") {
      await addReview(req, res);
    } else if (action === "deleteReview") {
      await deleteReview(req, res);
    } else {
      return res.redirect("/reviews");
    }
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to handle review" });
  }
};









