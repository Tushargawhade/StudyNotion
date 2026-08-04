const express = require("express")
const router = express.Router()

const { auth } = require("../middlewares/auth")
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controllers/Wishlist")

// Add course to wishlist
router.post("/add", auth, addToWishlist)

// Remove course from wishlist
router.delete("/remove", auth, removeFromWishlist)

// Get wishlist
router.get("/getAll", auth, getWishlist)

module.exports = router
