const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const socketIO = require("socket.io");
const fileUpload = require("express-fileupload");
const schedule = require("node-schedule");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(fileUpload({ parseNested: true }));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/user");

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/user", userRoutes);

// Start server
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

// Setup WebSocket
// const io = socketIO(server);
const io = require("socket.io")({
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

module.exports = { app, io };

// Initialize recurring tasks
const taskController = require("./controllers/taskController");
taskController.createRecurringTasks();
