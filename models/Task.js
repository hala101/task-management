const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium",
        },
        dueDate: {
            type: Date,
        },
        category: {
            type: String,
        },
        status: {
            type: String,
            enum: ["to-do", "in progress", "completed"],
            default: "to-do",
        },
        notes: {
            type: String,
        },
        attachments: {
            type: [String],
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isTemplate: {
            type: Boolean,
            default: false,
        },
        recurrence: {
            type: String,
            enum: ["daily", "weekly", "monthly", "yearly", null],
            default: null,
        },
        lastExecuted: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
