"use client";
import { useEffect, useState, useRef } from "react";
import "./tasks.css";
import TaskDetailView from "./TaskDetailView";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [error, setError] = useState("");
    const [user, setUser] = useState("");
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        objectives: [],
        dueDate: "",
        priority: "",
    });
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const formRef = useRef(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filters, setFilters] = useState({
        type: "all",
        priority: "all",
        status: "all",
        search: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 9;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => {
            if (name === "objectives") {
                return {
                    ...prev,
                    [name]: Array.isArray(value) ? value : [value],
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleObjectiveChange = (index, value) => {
        setNewTask((prev) => {
            const newObjectives = [...prev.objectives];
            newObjectives[index] = value;
            return { ...prev, objectives: newObjectives };
        });
    };

    const addObjective = (e) => {
        e.preventDefault();
        setNewTask((prev) => ({
            ...prev,
            objectives: [...prev.objectives, ""],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const taskData = {
                ...newTask,
                objectives: Array.isArray(newTask.objectives)
                    ? newTask.objectives.filter((obj) => obj.trim() !== "")
                    : [],
                assignee: user.username,
                status: "pending",
                type: "personal",
                createdAt: new Date(),
            };

            const response = await fetch("/api/users/addTask", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    username: user.username,
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                const data = await response.json();
                setTasks((prevTasks) => [...prevTasks, data.task]);
                setNewTask({
                    name: "",
                    description: "",
                    priority: "",
                    objectives: "",
                    dueDate: "",
                });
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error adding task");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setError("An error occurred while adding the task" + error);
        }
    };

    const toggleAddTaskForm = () => {
        setShowAddTaskForm((prev) => !prev);
        setNewTask({ ...newTask, objectives: [] });
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    window.location.href = "/";
                    return;
                }

                const response = await fetch("/protected", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        role: "users",
                        tasks: "true",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setUser(data.user);
                        setTasks(data.tasks);
                    }
                } else {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                }
            } catch (error) {
                console.error("An error occurred:", error);
                setError("An error occurred" + error);
                window.location.href = "/";
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowAddTaskForm(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleCloseDetailView = () => {
        setSelectedTask(null);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => task._id !== taskId)
                );
                setSelectedTask(null);
            } else {
                console.error("Failed to delete task");
                setError("Failed to delete task");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            setError("Error deleting task:" + error);
        }
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const response = await fetch(
                `/api/users/updateTask/${updatedTask._id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        username: user.username,
                    },
                    body: JSON.stringify(updatedTask),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === updatedTask._id ? data.task : task
                    )
                );
                setSelectedTask(data.task);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error updating task");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setError("An error occurred while updating the task" + error);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
    };

    const handleSearch = (searchTerm) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            search: searchTerm,
        }));
    };

    useEffect(() => {
        const filtered = tasks.filter((task) => {
            const matchesType =
                filters.type === "all" || task.type === filters.type;
            const matchesPriority =
                filters.priority === "all" ||
                task.priority === filters.priority;
            const matchesStatus =
                filters.status === "all" || task.status === filters.status;
            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                task.description
                    .toLowerCase()
                    .includes(filters.search.toLowerCase());

            return (
                matchesType && matchesPriority && matchesStatus && matchesSearch
            );
        });
        setFilteredTasks(filtered);
        setCurrentPage(1);
    }, [tasks, filters]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    return (
        <div className="drive-container">
            <div className="helpers">
                <h1 className="drive-header">Welcome to Tasks</h1>
                <div className="search-bar">
                    <svg
                        className="search-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="10" cy="10" r="6"></circle>
                        <line x1="21" y1="21" x2="15" y2="15"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search in Tasks"
                        className="search-input"
                        value={filters.search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <div className="filter-bar">
                    <select
                        className="filter-button"
                        value={filters.type}
                        onChange={(e) =>
                            handleFilterChange("type", e.target.value)
                        }
                    >
                        <option value="all">All Types</option>
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                    </select>
                    <select
                        className="filter-button"
                        value={filters.priority}
                        onChange={(e) =>
                            handleFilterChange("priority", e.target.value)
                        }
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <select
                        className="filter-button"
                        value={filters.status}
                        onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                        }
                    >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>
            <div
                className={`tasks-content ${
                    showAddTaskForm || selectedTask ? "blur-background" : ""
                }`}
            >
                <div className="tasks-div">
                    <h1 className="text-1xl font-bold my-6">Your Tasks</h1>
                    <div className="tasks-grid">
                        {currentTasks.map((task) => (
                            <div
                                key={task._id}
                                className="task-card"
                                onClick={() => handleTaskClick(task)}
                            >
                                <div className="task-name">{task.title}</div>
                                <div className="task-quantity">
                                    {task.description}
                                </div>
                            </div>
                        ))}
                        <div
                            className="add-task-card"
                            onClick={toggleAddTaskForm}
                        >
                            <div className="add-task-icon">
                                <span>+</span>
                            </div>
                            <span className="add-task-text">Add Task</span>
                        </div>
                    </div>
                    {/* Add pagination controls */}
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {selectedTask && (
                <>
                    <div
                        className="overlay"
                        onClick={handleCloseDetailView}
                    ></div>
                    <TaskDetailView
                        task={selectedTask}
                        onClose={handleCloseDetailView}
                        onDelete={handleDeleteTask}
                        onUpdate={handleUpdateTask}
                    />
                </>
            )}
            {showAddTaskForm && (
                <>
                    <div
                        className="overlay"
                        onClick={() => setShowAddTaskForm(false)}
                    ></div>
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="form add-task-form"
                    >
                        <h1 className="text-2xl font-bold mb-4 text-center item">
                            Add New Task
                        </h1>
                        <div className="item floating-label">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="input"
                                placeholder="Task Name"
                                value={newTask.name}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="title" className="float-label">
                                Task Name
                            </label>
                        </div>
                        <div className="floating-label">
                            <textarea
                                id="description"
                                name="description"
                                className="input task-description"
                                placeholder="Description"
                                value={newTask.description}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                            <label
                                htmlFor="description"
                                className="float-label"
                            >
                                Description
                            </label>
                        </div>
                        <div className="item floating-label">
                            <select
                                name="priority"
                                id="edit-priority"
                                value={newTask.priority}
                                onChange={handleInputChange}
                                className="mod-input input"
                                required
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <label
                                htmlFor="edit-priority"
                                className="float-label"
                            >
                                Priority
                            </label>
                        </div>
                        {Array.isArray(newTask.objectives) &&
                            newTask.objectives.map((objective, index) => (
                                <div
                                    key={index}
                                    className="item floating-label"
                                >
                                    <input
                                        type="text"
                                        id={`objective-${index}`}
                                        name={`objective-${index}`}
                                        className="input"
                                        placeholder="Objective"
                                        value={objective}
                                        onChange={(e) =>
                                            handleObjectiveChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <label
                                        htmlFor={`objective-${index}`}
                                        className="float-label"
                                    >
                                        Objective {index + 1}
                                    </label>
                                </div>
                            ))}
                        <button
                            className="add-objective-button item"
                            onClick={addObjective}
                        >
                            Add Objective
                        </button>
                        <div className="item floating-label">
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                className="input"
                                value={newTask.dueDate}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="dueDate" className="float-label">
                                Due Date
                            </label>
                        </div>
                        <div className="submit-div">
                            <button type="submit" className="submit-button">
                                Add Task
                            </button>
                        </div>
                    </form>
                </>
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Tasks;