// BACKEND marilesBE: /src/routes/contactRoutes.js
const express = require("express");
const { handleSubmitContact } = require("../controllers/contactController");

const router = express.Router();

router.post("/addMessage", handleSubmitContact);

module.exports = router;
