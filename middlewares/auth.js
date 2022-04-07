const jwt = require("jsonwebtoken")
const { jwtKey } = require("../keys")

module.exports = (req,res,next) =>{
    const authHeader = req.get("Authorization")

    if(!authHeader){
        const error = new Error("No token provided")
        error.statusCode = 401
        throw error 
    }
    // cut the string "Bearer *token* for get only the token"
    const token = authHeader.split(" ")[1]
    let checkToken
    try {
        checkToken = jwt.verify(token,jwtKey)
    } catch (error) {
        error.statusCode=500
        throw error
    }
      if(!checkToken){
        error.statusCode = 401
        throw error
    }
    
    next()

}