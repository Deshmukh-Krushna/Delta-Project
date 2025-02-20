const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor, saveRedirectUrl} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// create review post route
router.post("/",
    isLoggedIn,
    validateReview, wrapAsync(reviewController.createReview));

//review delete route 
router.delete("/:reviewId",
   saveRedirectUrl,
   isLoggedIn,
   isReviewAuthor,
   wrapAsync(reviewController.destroyReview));

module.exports = router;