if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

//for reinitialzing data run index.js file
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOveride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo'); 
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; 
const User = require("./models/user.js");
//destructer router
const listingRouter = require("./routes/listing.js"); 
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

// const { wrap } = require("module");
const  dbUrl = process.env.ATLASDB_URL;

const port = process.env.PORT || 8080;

app.listen(port, ()  =>
  { 
      console.log("listening on port 8080");
  });
   

app.set("view enging", "ejs");
app.set("views",path.join( __dirname , "views"));
app.use(express. urlencoded({extended : true}))
app.use(methodOveride("_method"));  
app.engine("ejs", ejsMate); 
app.use(express.static(path.join(__dirname,"/public"))); 

const store = MongoStore.create
({
  mongoUrl : dbUrl,
  crypto : {
    secret : process.env.SECRET
  }, 
  touchAfter : 24*3600,
}); 

store.on("error", () => {
  console.log("error in mongo session store",err);
})

const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave :false,
  saveUninitialized :true,
  cookie : {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge :  7*24*60*60*1000,
    secure : false
  }
}; 

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //seralize for seesion
passport.deserializeUser(User.deserializeUser()); //desearalize after seesion

app.use((req, res, next) =>
{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; 
  next(); 
}); 

//routes listing.js route
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


// app.get("/newuser",async(req,res) => 
// { 
//   let newuser = new User(
//     { 
//       email : "vaibhav1234@gmail.com",
//       username : "vaibhav"
//     }
//   );
//   let registerdUser = await User.register(newuser,"hello") ;
//   res.send(registerdUser);
// });

// getting-started.js
// const MONGO_URL = ("mongodb://127.0.0.1:27017/wanderlust");
main().then(() =>
{
    console.log("connected to db");
}).catch(err => console.log(err));

async function main() {                 
  await mongoose.connect(dbUrl);

}

app.all ("*", (req, res, next) =>
  {
  next(new expressError(404, "Page not found"));

});

app.use((err, req, res, next) =>
{
  let { statusCode = 500, message = "Something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.render("./alert.ejs", {message});
  
  
});