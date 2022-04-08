const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const imageRoutes = require("./routes/uploadRoutes");
const characterRoutes = require("./routes/characterRoutes");
const searchRoutes = require("./routes/searchRoutes");
const { mongoUri } = require("./keys");
const app = express();


//Connecting to DB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
  .then(data => console.log("- Database Online -"))
  .catch(err => console.log(err));


//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if(process.env.NODE_ENV === "production"){
  app.use(express.static("client/build"))
}

//api routes
app.use(userRoutes)
app.use(movieRoutes)
app.use(imageRoutes)
app.use(characterRoutes)
app.use(searchRoutes)


//server settings 
app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => {
  console.log("- Server Online on " + app.get("port") + " -");
});
 