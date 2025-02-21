const mongoose = require("mongoose");
const Review = require("./reviews.js");
const { required, string } = require("joi");
const Schema = mongoose.Schema;


const listingSchema = new Schema (    
        {
        title : {
            type : String,
            
        },
        description : 
       {
            type : String
       },
        image : 
        {
            type:  
                {
                filename : String,   
                url : String

                },
                              
             
            default : 
            {
                filename : "listingimage",
                url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
 
            },
            set : (v) =>
             v === ""
            ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"

            
            : v
            
        },
        price : {
            type : Number 
        },
        location : {
            type : String
        },
        country : {
            type : String
        },
        reviews : [
            {
                type : Schema.Types.ObjectId,
                ref : "review",
                
            }
            
        ],
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User",
        }
        }
) ;

listingSchema.post("findOneAndDelete",async (listing) => {
    if(listing)
        {
    Review.deleteMany({_id : {$in : listing.reviews}});
        }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports =Listing; 