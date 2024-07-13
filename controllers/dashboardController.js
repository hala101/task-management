const { commonResponse } = require("../helpers");
const Tasks = require("../models/Task");

/*
 *  Dashboard Data
 */
exports.dashboard = async (req, res) => {
    try {
        const { q, priority, status, sortBy } = req.query;
        const query = { userId: req.user.id };

        console.log("🚀 ~ file: dashboardController.js:11 ~ exports.dashboard= ~ req.query:", req.query);

        if (q) {
            query.name = new RegExp(q, "i");
        }
        if (priority) {
            query.priority = priority;
        }
        if (status) {
            query.status = status;
        }

        const tasks = await Tasks.find(query).sort(sortBy);
        return commonResponse.success(res, "SUCCESS", 201, tasks);
    } catch (err) {
        console.log("🚀 ~ file: dashboardController.js:31 ~ exports.dashboard= ~ err:", err);
        return commonResponse.error(res, "SERVER_ERROR", 500, {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });
    }
};
