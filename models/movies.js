const mongoose = require("mongoose")
const Schema = mongoose.Schema

const moviesSchema = new Schema({
    image:{type:String, required:true},    
    title:{type:String, required:true},    
    synopsis:{type:String, required:true},    
    date_of:{type:Number, required:true},   
    rating:{type:Number, required:true},
    characters:{type:Array,required:true},    
    genres:{type:Array,required:true}    
})

module.exports = mongoose.model("ACmovie",moviesSchema)