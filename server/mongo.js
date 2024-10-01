const mongoose = require("mongoose");
const { User, Admin, Task, Organisation } = require("./models");

const uri = "mongodb://localhost:27017/tasker";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const insertUser = async (
    insertUser,
    insertPassword,
    mailid,
    gender,
    role,
    org = null
) => {
    try {
        let user;
        if (role === "users") {
            user = new User({
                username: insertUser,
                password: insertPassword,
                email: mailid,
                gender: gender,
                tasks: [],
            });
            if (org) {
                const orgData = await findOrganisation(org);
                if (orgData) {
                    orgData.requests.push(user._id);
                    await orgData.save();
                } else {
                    console.error(`Organisation '${org}' does not exist.`);
                    throw new Error(`Organisation '${org}' does not exist.`);
                }
            }
        } else if (role === "admins") {
            user = new Admin({
                username: insertUser,
                password: insertPassword,
                email: mailid,
                gender: gender,
                organisation: org,
                tasks: [],
            });
            if (org) {
                const orgData = await findOrganisation(org);
                orgData.admins.push(user._id);
                await orgData.save();
            }
        }

        const result = await user.save();
        return result;
    } catch (error) {
        console.error("Error inserting user:", error);
    }
};

const findUser = async (username, role) => {
    try {
        const Model = role === "users" ? User : Admin;
        const res = await Model.findOne({ username: username });
        return res || false;
    } catch (error) {
        console.error("Error reading from database:", error);
    }
};

const findOrganisation = async (orgName) => {
    try {
        const org = await Organisation.findOne({ name: orgName });
        return org || false;
    } catch (error) {
        console.error("Error finding organisation:", error);
    }
};

const insertTask = async (task) => {
    try {
        const assignee = await User.findOne({ username: task.assignee });
        if (!assignee) {
            throw new Error("Assignee not found");
        }
        const newTask = new Task({
            ...task,
            assignee: task.assignee, // Use the username directly
        });
        const result = await newTask.save();

        assignee.tasks.push(result._id);
        await assignee.save();

        return result;
    } catch (error) {
        console.error("Error inserting task:", error);
        throw error;
    }
};

const findTasks = async (userId, username) => {
    try {
        const tasks = await Task.find({ assignee: username });
        return tasks;
    } catch (error) {
        console.error("Error finding tasks:", error);
        throw error;
    }
};

const findTasksAdmin = async (org) => {
    try {
        // First, find the organization
        const organization = await Organisation.findOne({ name: org });
        
        if (!organization) {
            throw new Error(`Organization '${org}' not found`);
        }

        // Now, fetch all tasks associated with this organization
        const tasks = await Task.find({ _id: { $in: organization.tasks } });

        return tasks;
    } catch (error) {
        console.error("Error finding tasks:", error);
        throw error;
    }
};

const updateTask = async (taskId, updateData) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
            new: true,
        });
        return updatedTask || false;
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

const deleteTask = async (taskId) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        return deletedTask || false;
    } catch (error) {
        console.error("Error deleting task:", error);
    }
};

const generateTaskSummary = async (filters) => {
    try {
        let query = {};

        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.assignee) {
            query.assignee = filters.assignee;
        }
        if (filters.priority) {
            query.priority = filters.priority;
        }
        if (filters.startDate && filters.endDate) {
            query.createdAt = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }

        const tasks = await Task.find(query);

        const summary = {
            totalTasks: tasks.length,
            statusBreakdown: {},
            priorityBreakdown: {},
            typeBreakdown: {},
            assigneeBreakdown: {}
        };

        tasks.forEach(task => {
            summary.statusBreakdown[task.status] = (summary.statusBreakdown[task.status] || 0) + 1;
            summary.priorityBreakdown[task.priority] = (summary.priorityBreakdown[task.priority] || 0) + 1;
            summary.typeBreakdown[task.type] = (summary.typeBreakdown[task.type] || 0) + 1;
            summary.assigneeBreakdown[task.assignee] = (summary.assigneeBreakdown[task.assignee] || 0) + 1;
        });

        return summary;
    } catch (error) {
        console.error("Error generating task summary:", error);
        throw error;
    }
};

module.exports = {
    insertUser,
    findUser,
    findOrganisation,
    insertTask,
    findTasks,
    updateTask,
    deleteTask,
    findTasksAdmin,
    uri,
    generateTaskSummary
};
