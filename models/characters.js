const mongoose = require("mongoose")
const Schema = mongoose.Schema

const characterSchema = new Schema({
    image:{type:String, required:true},    
    name:{type:String, required:true},    
    age:{type:Number, required:true},      
    biography:{type:String, required:true},   
    movies:{type:Array, required:true}    
})

module.exports = mongoose.model("ACcharacter",characterSchema)