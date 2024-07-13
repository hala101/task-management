const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authenticateToken = require("../middleware/authenticate");

router.get("/dashboard", authenticateToken, dashboardController.dashboard);

module.exports = router;
