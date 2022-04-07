const express = require("express")
const router = express.Router()
const { allUsers,createUser,loginUser } = require("../controllers/userControl")
const auth = require("../middlewares/auth")
const { check } = require("express-validator")

router.get("/users",auth,allUsers)

router.post("/auth/register",[
    check("email","email is required").notEmpty(),
    check("email","email must have an email format").isEmail(),
    check("password","password is required").notEmpty(),
    check("password","password must have min: 8, max: 16 characters ").isLength({min:8,max:16}),
],createUser)

router.post("/auth/login",[
    check("email","email is required").notEmpty(),
    check("email","email must have an email format").isEmail(),
    check("password","password is required").notEmpty(),
    check("password","password must have min: 8, max: 16 characters ").isLength({min:8,max:16}),
],loginUser)

module.exports = router