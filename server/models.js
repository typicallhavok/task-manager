const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    organisation: { type: String, required: false },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    organisation: { type: String, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    objectives: { type: Array, required: true },
    status: { type: String, required: true },
    dueDate: { type: Date, required: true },
    assignee: { type: String, required: true },
    createdAt: { type: Date, required: true },
    priority: { type: String, required: true },
    type: { type: String, required: true },
});

const organisationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Task = mongoose.model("Task", taskSchema);
const Organisation = mongoose.model("Organisation", organisationSchema);
module.exports = { User, Admin, Task, Organisation };
