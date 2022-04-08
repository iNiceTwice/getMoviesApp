const multer = require("multer")
const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require('uuid');
const MOVIES_DB = require("../models/movies")
const CHARACTERS_DB = require("../models/characters")

const storage = multer.diskStorage({
    destination:"../client/public/img",
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname)
        cb(null,`${uuidv4()}${ext}`)
    }
})

exports.upload = multer({storage, dest:"../client/public/img"})


exports.uploadImage = (req,res,next) => {
    const {destination,filename} = req.file
    const {oldImageUrl} = req.body

    if(destination && filename && oldImageUrl){ // this will delete the old image on update
        try {
            fs.unlinkSync(`../client/public/${oldImageUrl}`)
        } catch(err) {
            console.error(err)
        }
   }
    res.send(req.file)
}

exports.deleteImage = async (req,res,next) =>{
    
    const { id } = req.params
    const movie = await MOVIES_DB.findById(id)
    const character = await CHARACTERS_DB.findById(id)


    if(movie){
        try {
            fs.unlinkSync(`../client/public/${movie.image}`)
        } catch(err) {
            console.error(err)
        }
    }else if(character){
         try {
            fs.unlinkSync(`../client/public/${character.image}`)
        } catch(err) {
            console.error(err)
        }
    }else{
        res.status(500)
    }
    next()   
}
