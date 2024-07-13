const Tasks = require("../models/Task");

/*
 *  Dashboard Data
 */
exports.dashboard = async (req, res) => {
    try {
        const { q, priority, status, sortBy } = req.query;
        const query = { userId: req.user.id };

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;

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
        res.render("dashboard", { tasks });
    } catch (err) {}
};
