const Task = require("../models/Task");
const User = require("../models/User");
// const { io } = require("../app");
const io = require("../helpers/task.connection");
const pool = require("../helpers/task.connection");

const { commonResponse, fileUploadHelper } = require("../helpers");

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.render("dashboard", { tasks });
    } catch (error) {
        console.log("🚀 ~ file: taskController.js:12 ~ exports.getTasks= ~ error:", error);

        return commonResponse.error(res, "SERVER_ERROR", 500, {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });
    }
};

exports.createTask = async (req, res) => {
    let { name, priority, dueDate, category, status, notes, attachments } = req.body;

    console.log("🚀 ~ file: taskController.js:19 ~ exports.createTask= ~ req.body:", req.body);
    try {
        if (req.files && req.files.notes && req.files.notes !== undefined) {
            notes = fileUploadHelper.uploadFile("task-notes", req.files.notes);
        }

        if (req.files && req.files.attachments && req.files.attachments !== undefined) {
            attachments = fileUploadHelper.uploadFile("task-attachments", req.files.attachments);
        }
        const newTask = new Task({
            userId: req.user.id,
            name,
            priority,
            dueDate,
            category,
            status,
            notes,
            attachments,
        });
        let task = await newTask.save();
        return commonResponse.success(res, "TASK_CREATED", 201, task);
    } catch (error) {
        console.log("🚀 ~ file: taskController.js:33 ~ exports.createTask= ~ error:", error);
        return commonResponse.error(res, "SERVER_ERROR", 500, {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });
    }
};

exports.updateTask = async (req, res) => {
    let { name, priority, dueDate, category, status, notes, attachments } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return commonResponse.error(res, "TASK_NOT_FOUND", 404, {});
        }
        if (task.userId.toString() !== req.user.id) {
            return commonResponse.error(res, "UNAUTHORIZED", 401, {});
        }

        if (req.files && req.files.notes && req.files.notes !== undefined) {
            notes = fileUploadHelper.uploadFile("task-notes", req.files.notes);
        }

        if (req.files && req.files.attachments && req.files.attachments !== undefined) {
            attachments = fileUploadHelper.uploadFile("task-attachments", req.files.attachments);
        }

        task.name = name || task.name;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.category = category || task.category;
        task.status = status || task.status;
        task.notes = notes || task.notes;
        task.attachments = attachments || task.attachments;

        let updatedData = await task.save();

        // io.to(req.user.id).emit("taskUpdated", task);
        // task.collaborators.forEach((collaborator) => {
        //   io.to(collaborator.toString()).emit("taskUpdated", task);
        // });
        return commonResponse.success(res, "TASK_UPDATED", 201, updatedData);
    } catch (error) {
        console.log("🚀 ~ file: taskController.js:62 ~ exports.updateTask= ~ error:", error);
        return commonResponse.error(res, "SERVER_ERROR", 500, {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });

        // res.status(500).send("Server error");
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return commonResponse.error(res, "TASK_NOT_FOUND", 404, {});
        }
        if (task.userId.toString() !== req.user.id) {
            return commonResponse.error(res, "UNAUTHORIZED", 401, {});
        }
        await Task.findByIdAndDelete({ _id: req.params.id }, { new: true }).lean();
        return commonResponse.success(res, "TASK_DELETED", 200, {});
    } catch (error) {
        console.log("🚀 ~ file: taskController.js:81 ~ exports.deleteTask ~ error:", error);
        return commonResponse.error(res, "SERVER_ERROR", 500, {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });
    }
};

exports.shareTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return commonResponse.error(res, "TASK_NOT_FOUND", 404, {});
        }
        if (task.userId.toString() !== req.user.id) {
            return commonResponse.error(res, "UNAUTHORIZED", 401, {});
        }

        const { collaboratorId } = req.body;
        const collaborator = await User.findById(collaboratorId);
        if (!collaborator) {
            return commonResponse.error(res, "COLLABORATOR_NOT_FOUND", 404, {});
        }
        if (task.collaborators.includes(collaboratorId)) {
            return commonResponse.error(res, "USER_ALREADY_COLLABORATOR", 400, {});
        }
        if (collaboratorId.toString() === req.user.id) {
            return commonResponse.error(res, "ACTION_CAN_NOT_PERFORMED", 401, {});
        }
        task.collaborators.push(collaboratorId);
        await task.save();
        io.to(collaboratorId).emit("taskShared", task);

        return commonResponse.success(res, "COLLABORATOR_ADDED", 200, {});
    } catch (error) {
        console.log("🚀 ~ file: taskController.js:110 ~ exports.shareTask= ~ error:", error);
        return commonResponse.error(res, "SERVER_ERROR", 500, {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });
    }
};

exports.searchTasks = async (req, res) => {};

/*
 *  Create Recurring tasks
 */
exports.createRecurringTasks = async () => {
    try {
        const tasks = await Task.find({ recurrence: { $ne: null } });
        if (tasks.length > 0) {
            tasks.forEach((task) => {
                const rule = getScheduleRule(task.recurrence);
                schedule.scheduleJob(rule, async () => {
                    const newTask = new Task({
                        userId: task.userId,
                        name: task.name,
                        priority: task.priority,
                        dueDate: task.dueDate,
                        category: task.category,
                        status: "to-do",
                        notes: task.notes,
                        attachments: task.attachments,
                        recurrence: task.recurrence,
                        lastExecuted: new Date(),
                    });
                    await newTask.save();
                });
            });
        }
    } catch (err) {
        console.error("Error creating recurring tasks:", err);
    }
};

function getScheduleRule(recurrence) {
    switch (recurrence) {
        case "continue":
            return "* * * * *";
        case "daily":
            return "0 0 * * *"; // Every day at midnight
        case "weekly":
            return "0 0 * * 0"; // Every week at midnight on Sunday
        case "monthly":
            return "0 0 1 * *"; // Every month at midnight on the 1st
        case "yearly":
            return "0 0 1 1 *"; // Every year at midnight on January 1st
        default:
            return null;
    }
}
