const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })


router
      .route ("/")
      //index route
      .get(wrapAsync(listingController.index))
      //new route
      .post(
        isLoggedIn,        
        upload.single("listing[image][url]") ,
        validateListing, 
        wrapAsync( listingController.createListing ));
        
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
        .route("/:id")
        //show route
        .get( wrapAsync( listingController.showListing))
          
        //update rouute  
        .put( isLoggedIn,
              isOwner,
              upload.single("listing[image][url]"),
              validateListing,wrapAsync(
              listingController.updateListing))

        //delete route
        .delete(isLoggedIn,
                isOwner,
                wrapAsync (listingController.destroyListing)   );  
              router.get("/:id/reviews/:reviewId",(req,res) => {
              res.redirect('/listings') ;
              }
        );
                

//edit route
router.get("/:id/edit",
   isLoggedIn,
   isOwner,
  wrapAsync( listingController.editListing ));

  


module.exports = router;