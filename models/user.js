const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type:String, 
        required:true, 
        unique:true, 
        lowercase:true, 
        trim:true
    },    
    password:{
        type:String,
        required:true,
        trim:true
    },    
    date_of:{
        type:Date, 
        default:Date.now,
        required:true
    }      
})

module.exports = mongoose.model("ACuser",userSchema)