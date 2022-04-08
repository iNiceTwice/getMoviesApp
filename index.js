const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const imageRoutes = require("./routes/uploadRoutes");
const characterRoutes = require("./routes/characterRoutes");
const searchRoutes = require("./routes/searchRoutes");
const { mongoUri } = require("./keys");
const path = require("path")
const app = express();


//Connecting to DB
mongoose.connect(mongoUri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
  .then(data => console.log("- Database Online -"))
  .catch(err => console.log(err));


//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//api routes
app.use(userRoutes)
app.use(movieRoutes)
app.use(imageRoutes)
app.use(characterRoutes)
app.use(searchRoutes)

//set production build
app.use(express.static(path.join(__dirname, "/client")))
app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"))
})

//server settings 
app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), () => {
  console.log("- Server Online on " + app.get("port") + " -");
});
 