const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const auth = require("../middlewares/auth")
const { getMovies,createMovies,deleteMovie,updateMovie,getOneMovie } = require("../controllers/moviesControl")
const { deleteImage } = require("../controllers/imageControl")

const today = new Date()
const year = today.getFullYear()

router.get("/movies", auth, getMovies)

router.get("/movies/:id", auth, getOneMovie)

router.delete("/movies/:id",auth,deleteImage,deleteMovie)

router.post("/movies", auth ,[
    check("title","title is required").notEmpty(),    
    check("synopsis","synopsis is required").notEmpty(),    
    check("image","image url is required").notEmpty(),    
    check("date_of","year is required").notEmpty(),   
    check("date_of","year must be a number").isInt(),   
    check("date_of", `year min and max values are 1888 / ${year}`).isInt({gt:1888,lt:year}),   
    check("rating","rating is required").notEmpty(),    
    check("rating","rating must be a number").isInt(),    
    check("rating","rating min and max values are 0 / 5").isInt({gt:0,lt:6}),    
    check("characters","characters is required").notEmpty(),    
    check("characters","characters must be an array").isArray(),    
    check("genres","genre is required").notEmpty(),    
    check("genres","genre must be an array").isArray(),    
    check("genres","genres only supports the follows genres: Action, Aventure, Animation, Comedy, Crime, Fantasy, Historical, Horror, Romance,Thriller, Western").isIn(['Action','Adventure','Animation','Comedy','Crime','Fantasy','Historical','Horror','Romance','Thriller','Western'])    
],createMovies)

router.put("/movies/:id",auth, [
    check("title","title is required").notEmpty(),    
    check("synopsis","synopsis is required").notEmpty(),    
    check("image","image url is required").notEmpty(),    
    check("year","year is required").notEmpty(),
    check("year", `year min and max values are 1888 / ${year}`).not().isInt({gt:1888,lt:year}),      
    check("year","year must be a number").isNumeric(),   
    check("rating","rating is required").notEmpty(),    
    check("rating","rating must be a number").isNumeric(),    
    check("rating","rating min and max values are 0 / 5").isInt({gt:0, lt:6}),
    check("characters","characters must be an array").isArray(),    
    check("genres","genre is required").notEmpty(),    
    check("genres","genre must be an array").isArray(),    
    check("genres","genres only supports the follows genres: Action, Aventure, Animation, Comedy, Crime, Fantasy, Historical, Horror, Romance,Thriller, Western").isIn(['Action','Adventure','Animation','Comedy','Crime','Fantasy','Historical','Horror','Romance','Thriller','Western'])    
],updateMovie)


module.exports = router