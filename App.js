// BACKEND marilesBE: app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const forumRoutes = require("./src/routes/forumRoutes");
const contactRoutes = require("./src/routes/contactRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRoutes); // Ensure this line is present
app.use("/api/contact", contactRoutes); // Ensure this line is present

// Start the server
app.listen(5001, () => {
  console.log("Server berjalan");
});
