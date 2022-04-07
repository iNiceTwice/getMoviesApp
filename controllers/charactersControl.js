const mongoose = require("mongoose")
const CHARACTER_DB = require("../models/characters")
const { validationResult } = require("express-validator")

  
exports.createCharacter = async (req,res,next) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const newCharacter = new CHARACTER_DB(req.body)
    await newCharacter.save()
    res.send(newCharacter)
}

exports.getCharacters = async (req,res,next) => {
    
    const characters = await CHARACTER_DB.find()
    res.send(characters)

}

exports.getOneCharacter = async (req,res,next) => {

    const character = await CHARACTER_DB.findOne({name:req.params.name})
    res.send(character)
}

exports.updateCharacter = async (req,res,next) => {
    
    if(!req.params.name){
        return res.status(400).json({"msg": "parameter name is required at characters/:name"})
    }

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const { name, age, image, movies, biography } = req.body
    const updatedCharacter = await CHARACTER_DB.findOneAndUpdate({name:req.params.name},{
        name,
        age,
        image,
        movies,
        biography
    })
}
exports.deleteCharacter = async (req,res,next) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const { id } = req.params
    await CHARACTER_DB.findByIdAndDelete(id)
}