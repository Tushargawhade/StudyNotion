const express = require("express")
const router = express.Router()

// Contact Controllers Import
const { createContact } = require("../controllers/Contact")

// Create Contact (public - no auth required)
router.post("/createContact", createContact)

module.exports = router
