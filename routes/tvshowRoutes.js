const express = require("express");
const router = express.Router();
const tvShowController = require("../controllers/tvshowController");

router.get("/", tvShowController.getTvShows);
router.get("/favorites", tvShowController.favoriteTvShow);
router.get("/reviews", tvShowController.getReviewedTvShows);

// favorite operations
router.post("/favorites", tvShowController.favoriteOperations);

// review operations
router.post("/reviews", tvShowController.reviewOperations);

module.exports = router;