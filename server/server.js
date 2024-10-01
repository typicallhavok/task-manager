const express = require("express");
const next = require("next");
const mong = require("./mongo.js");
const { User, Admin, Organisation } = require("./models");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { generateTaskSummary } = require("./mongo");
require('dotenv').config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const JWT_SECRET = process.env.JWT_SECRET;

app.prepare().then(() => {
    const server = express();
    const checkExist = async (bod) => {
        try {
            const userExists = await mong.findUser(bod.username, bod.role);
            return userExists;
        } catch (error) {
            console.error("Error checking user existence:", error);
            throw error;
        }
    };

    server.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());

    const verifyToken = (req, res, next) => {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "No token provided" });

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ message: "Invalid token" });
            req.user = decoded;
            next();
        });
    };

    server.post("/validateCreds", async (req, res) => {
        try {
            const uExist = await checkExist(req.body.formData);
            if (uExist && uExist.password) {
                const check = await argon2.verify(
                    uExist.password,
                    req.body.formData.password
                );
                if (check) {
                    const token = jwt.sign(
                        { name: uExist.username },
                        JWT_SECRET,
                        { expiresIn: "1h" }
                    );
                    res.json({
                        message: "Login successful",
                        success: true,
                        token,
                    });
                } else {
                    res.json({ message: "Invalid password", success: false });
                }
            } else {
                res.json({ message: "User does not exist", success: false });
            }
        } catch (error) {
            console.error("Error in /validateCreds:", error);
            res.status(500).json({ message: "Server error", success: false });
        }
    });

    server.get("/protected", async (req, res) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const role = req.headers["role"];
        if (token == null) return res.sendStatus(401);

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (role === "users") {
                const user = await User.findOne({
                    username: decoded.name,
                }).select("username gender _id");

                if (!user) {
                    return res.sendStatus(404);
                }

                let tasks = [];
                if (req.headers["tasks"] === "true") {
                    tasks = await mong.findTasks(user._id, user.username);
                }

                res.json({
                    success: true,
                    user: { username: user.username, gender: user.gender },
                    tasks: req.headers["tasks"] === "true" ? tasks : undefined,
                });
            } else if (role === "admins") {
                const admin = await Admin.findOne({
                    username: decoded.name,
                }).select("username gender organisation _id");
                if (!admin) {
                    return res.sendStatus(404);
                }
                let tasks = [];
                if (req.headers["tasks"] === "true") {
                    tasks = await mong.findTasksAdmin(admin.organisation);
                }
                res.json({
                    success: true,
                    user: {
                        username: admin.username,
                        gender: admin.gender,
                        organisation: admin.organisation,
                    },
                    tasks: req.headers["tasks"] === "true" ? tasks : undefined,
                });
            }
        } catch (err) {
            console.error("Error in /protected route:", err);
            return res.sendStatus(403);
        }
    });

    server.post("/api/register", async (req, res) => {
        const uExist = await checkExist(req.body);
        if (!uExist) {
            const hash = await argon2.hash(req.body.password);
            if (req.body.role === "admins") {
                const newAdmin = new Admin({
                    username: req.body.username,
                    password: hash,
                    email: req.body.email,
                    gender: req.body.gender,
                    organisation: req.body.organisation,
                });
                await newAdmin.save();
            }
            const newUser = new User({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                gender: req.body.gender,
                organisation: req.body.organisation,
            });
            await newUser.save();
            if (req.body.role === "admins") {
                const org = await mong.findOrganisation(req.body.organisation);
                if (org) {
                    org.admins.push(newUser._id);
                    await org.save();
                } else {
                    const newOrg = new Organisation({
                        name: req.body.organisation,
                        admins: [newUser._id],
                        users: [newUser._id],
                    });
                    await newOrg.save();
                }
            } else if (req.body.organisation) {
                const org = await mong.findOrganisation(req.body.organisation);
                if (org) {
                    org.users.push(newUser._id);
                    await org.save();
                }
            }

            const token = jwt.sign({ name: newUser.username }, JWT_SECRET, {
                expiresIn: "1h",
            });
            res.json({
                message: "Registration successful",
                success: true,
                token,
            });
        } else {
            res.json({ message: "User already exists", success: false });
        }
    });

    server.post("/api/users/addTask", async (req, res) => {
        const newTask = await mong.insertTask(req.body);
        res.json({
            message: "Task added successfully",
            success: true,
            task: newTask,
        });
    });

    server.post("/api/admins/addTask", async (req, res) => {
        const newTask = await mong.insertTask(req.body);
        const org = await mong.findOrganisation(req.body.organisation);
        if (org) {
            org.tasks.push(newTask._id);
            await org.save();
        }
        res.json({
            message: "Task added successfully",
            success: true,
            task: newTask,
        });
    });

    server.delete("/api/tasks/:id", async (req, res) => {
        const taskId = req.params.id;
        const result = await mong.deleteTask(taskId);
        res.json({
            message: "Task deleted successfully",
            success: true,
            taskId,
        });
    });

    server.put("/api/users/updateTask/:id", async (req, res) => {
        const taskId = req.params.id;
        const updatedTask = await mong.updateTask(taskId, req.body);
        res.json({
            message: "Task updated successfully",
            success: true,
            task: updatedTask,
        });
    });

    server.get("/api/tasks/summary", async (req, res) => {
        try {
            const filters = {
                status: req.query.status,
                assignee: req.query.assignee,
                priority: req.query.priority,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };

            const summary = await generateTaskSummary(filters);
            res.json(summary);
        } catch (error) {
            console.error("Error in /api/tasks/summary:", error);
            res.status(500).json({ message: "Server error", success: false });
        }
    });

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
