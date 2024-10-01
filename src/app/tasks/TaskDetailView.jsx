import React, { useState, useEffect } from "react";

const TaskDetailView = ({ task, onClose, onDelete, onUpdate }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });
    const [completedObjectives, setCompletedObjectives] = useState({});

    useEffect(() => {
        const initialCompletedObjectives = task.objectives.reduce((acc, _, index) => {
            acc[index] = false;
            return acc;
        }, {});
        setCompletedObjectives(initialCompletedObjectives);
    }, [task.objectives]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(editedTask);
        setEditMode(false);
    };

    const toggleObjective = (index) => {
        setCompletedObjectives(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="task-detail-view">
            <button className="close-button" onClick={onClose}>
                ×
            </button>
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
                        
                        {task.objectives && task.objectives.length > 0 && (
                            <>
                                <h3>Objectives</h3>
                                <ul className="objectives-list">
                                    {task.objectives.map((objective, index) => (
                                        <li key={index} className="objective-item">
                                            <button 
                                                onClick={() => toggleObjective(index)}
                                                className="objective-toggle"
                                            >
                                                {completedObjectives[index] ? '✓' : '→'}
                                            </button>
                                            <span className={completedObjectives[index] ? 'completed-objective' : ''}>
                                                {objective}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        
                        <h3>Due Date</h3>
                        <p>{new Date(task.dueDate).toLocaleDateString()}</p>
                        
                        <h3>Priority</h3>
                        <p>{task.priority}</p>
                        
                        <h3>Status</h3>
                        <p>{task.status}</p>
                        
                        {task.username && (
                            <>
                                <h3>Assignee</h3>
                                <p>{task.username}</p>
                            </>
                        )}
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
