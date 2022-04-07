const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const { uploadImage, upload } = require("../controllers/imageControl")

router.post("/images/upload", auth, upload.single("image"),uploadImage)

module.exports = router