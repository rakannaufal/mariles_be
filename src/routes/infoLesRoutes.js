// BACKEND marilesBE: /src/routes/infoLesRoutes.js

const express = require("express");
const { createInfoLes } = require("../controllers/infoLesController");

const router = express.Router();

// Route to handle form submission for InfoLes
router.post("/create", createInfoLes);
module.exports = router;
