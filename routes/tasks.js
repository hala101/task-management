const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticateToken = require("../middleware/authenticate");

router.get("/", authenticateToken, taskController.getTasks);
router.post("/create", authenticateToken, taskController.createTask);
router.put("/update/:id", authenticateToken, taskController.updateTask);
router.delete("/delete/:id", authenticateToken, taskController.deleteTask);
router.post("/share/:id", authenticateToken, taskController.shareTask);
router.get("/search", authenticateToken, taskController.searchTasks);

module.exports = router;
