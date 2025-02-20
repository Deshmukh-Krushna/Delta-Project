
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;



const userSchema = new Schema ({    
    email:{
        type : String,
        required : true
    }
})
userSchema.plugin(passportLocalMongoose); //it automatically add username password and hashing 
module.exports = mongoose.model("User", userSchema); 