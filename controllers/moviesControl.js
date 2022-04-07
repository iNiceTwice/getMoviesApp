const MOVIES_DB = require("../models/movies.js")
const { validationResult } = require("express-validator")

exports.getMovies = async (req,res) => {
    const movies = await MOVIES_DB.find()
    res.send(movies)
}
exports.getOneMovie = async (req,res) => {
    const movies = await MOVIES_DB.findById(req.params.id)
    res.send(movies)
}

exports.createMovies = async (req,res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
   
    const movie = await new MOVIES_DB(req.body)
    await movie.save()
    res.send(movie)
}

exports.deleteMovie = async (req,res) => {
    const {id} = req.params
    const deletedMovie = await MOVIES_DB.deleteOne({_id:id})
    res.send().status(200)
}
exports.updateMovie = async (req,res) => {
    const {title,synopsis,date_of,rating,characters,year,image,genres} = req.body
    const {id} = req.params
    
    const updatedMovie = await MOVIES_DB.findByIdAndUpdate(id,{
        title,
        year,
        rating,
        genres,
        synopsis,
        image,
        characters,
        date_of
    })
    console.log("updatedMovie",updatedMovie)
    res.send(updatedMovie)
}
