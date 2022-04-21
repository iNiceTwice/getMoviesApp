const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt-nodejs")
const USERS_DB = require("../models/user.js")
const { jwtKey } = require("../keys")
const { validationResult } = require("express-validator")

exports.allUsers = async (req,res) => {
    const users = await USERS_DB.find()
    res.send(users)
}

exports.loginUser = async (req,res,next) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password,_id} = req.body
    const user = await USERS_DB.findOne({email})
    //const validation = bcrypt.compareSync(password,user.password)

    if(!user){
        return res.json({status:401, message:"User not found"})
    }else{
        if(! bcrypt.compareSync(password,user.password)){
            return res.json({status:401,message:"Incorrect password"})
        }else{
            const token = jwt.sign({
            id:_id,
            email,
            password
            },jwtKey,{
                expiresIn:"5d"
            })
            res.send(token)
        }
    }
}

exports.createUser = async (req,res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password,_id} = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashPass = await bcrypt.hashSync(password,salt) 
    const newUser = new USERS_DB({
        email,
        password:hashPass
    })
    await newUser.save()
    const token = jwt.sign({
        id:_id,
        email,
        password
    },jwtKey,{
        expiresIn:"5d"
    })
    res.send(token)
}
