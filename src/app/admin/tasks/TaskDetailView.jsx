import React, { useState } from "react";

const TaskDetailView = ({ task, onClose, onDelete, onUpdate }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleObjectiveChange = (index, value) => {
        const updatedObjectives = [...editedTask.objectives];
        updatedObjectives[index] = value;
        setEditedTask((prev) => ({ ...prev, objectives: updatedObjectives }));
    };

    const addObjective = () => {
        setEditedTask((prev) => ({
            ...prev,
            objectives: [...prev.objectives, ""]
        }));
    };

    const removeObjective = (index) => {
        setEditedTask((prev) => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(editedTask);
        setEditMode(false);
    };

    return (
        <div className="task-detail-view">
            <button className="close-button" onClick={onClose}>×</button>
            {editMode ? (
                <form onSubmit={handleSubmit} className="mod-form">
                    <h2>Edit Task</h2>
                    <div className="item floating-label">
                        <input
                            type="text"
                            name="title"
                            id="edit-title"
                            value={editedTask.title}
                            onChange={handleInputChange}
                            className="mod-input input"
                            required
                        />
                        <label htmlFor="edit-title" className="float-label">Title</label>
                    </div>
                    <div className="item floating-label">
                        <textarea
                            name="description"
                            id="edit-description"
                            value={editedTask.description}
                            onChange={handleInputChange}
                            className="mod-input input"
                            required
                        ></textarea>
                        <label htmlFor="edit-description" className="float-label">Description</label>
                    </div>
                    <div className="item floating-label">
                        <select
                            name="priority"
                            id="edit-priority"
                            value={editedTask.priority}
                            onChange={handleInputChange}
                            className="mod-input input"
                            required
                        >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <label htmlFor="edit-priority" className="float-label">Priority</label>
                    </div>
                    <div className="item floating-label">
                        <select
                            name="status"
                            id="edit-status"
                            value={editedTask.status}
                            onChange={handleInputChange}
                            className="mod-input input"
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <label htmlFor="edit-status" className="float-label">Status</label>
                    </div>
                    <div className="item floating-label">
                        <input
                            type="date"
                            name="dueDate"
                            id="edit-dueDate"
                            value={editedTask.dueDate.split('T')[0]}
                            onChange={handleInputChange}
                            className="mod-input input"
                            required
                        />
                        <label htmlFor="edit-dueDate" className="float-label">Due Date</label>
                    </div>
                    <div className="item floating-label">
                        <input
                            type="text"
                            name="assignee"
                            id="edit-assignee"
                            value={editedTask.assignee}
                            onChange={handleInputChange}
                            className="mod-input input"
                            required
                        />
                        <label htmlFor="edit-assignee" className="float-label">Assignee</label>
                    </div>
                    <div className="item floating-label">
                        <select
                            name="type"
                            id="edit-type"
                            value={editedTask.type}
                            onChange={handleInputChange}
                            className="mod-input input"
                            required
                        >
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                        </select>
                        <label htmlFor="edit-type" className="float-label">Type</label>
                    </div>
                    <h3>Objectives</h3>
                    {editedTask.objectives.map((objective, index) => (
                        <div key={index} className="item floating-label">
                            <input
                                type="text"
                                value={objective}
                                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                className="mod-input input"
                                required
                            />
                            <button type="button" className="submit-button" onClick={() => removeObjective(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="submit-button" onClick={addObjective}>Add Objective</button>
                    <div className="button-group">
                        <button type="submit" className="submit-button">Save Changes</button>
                        <button type="button" className="submit-button" onClick={() => setEditMode(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <h2>Task Details</h2>
                    <div className="task-info">
                        <h3>Title</h3>
                        <p>{task.title}</p>
                        
                        <h3>Description</h3>
                        <p>{task.description}</p>
                        
                        <h3>Objectives</h3>
                        <ul>
                            {task.objectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                            ))}
                        </ul>
                        
                        <h3>Due Date</h3>
                        <p>{new Date(task.dueDate).toLocaleDateString()}</p>
                        
                        <h3>Priority</h3>
                        <p>{task.priority}</p>
                        
                        <h3>Status</h3>
                        <p>{task.status}</p>
                        
                        <h3>Assignee</h3>
                        <p>{task.assignee}</p>
                        
                        <h3>Type</h3>
                        <p>{task.type}</p>
                    </div>
                    <div className="button-group mod">
                        <button
                            onClick={() => setEditMode(true)}
                            className="submit-button"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(task._id)}
                            className="submit-button"
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskDetailView;