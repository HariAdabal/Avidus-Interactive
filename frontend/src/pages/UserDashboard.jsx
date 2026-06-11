import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  IconChecklist,
  IconLogout,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCircleCheck,
  IconClock,
} from "@tabler/icons-react";

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch tasks");
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create task");
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete task");
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          status: editingTask.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update task");
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EEEDFE 0%, #FBEAF0 100%)",
        fontFamily: "sans-serif",
        padding: "30px 16px",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1D9E75, #378ADD)",
            borderRadius: "16px",
            padding: "24px",
            color: "white",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconChecklist size={24} color="white" stroke={1.5} />
            </div>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
                My Tasks
              </h2>
              <p style={{ fontSize: "13px", opacity: 0.85, marginTop: "2px" }}>
                Welcome, <strong>{user?.username}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "white",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <IconLogout size={16} stroke={1.5} /> Logout
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            padding: "20px",
            marginBottom: "20px",
            borderTop: "3px solid #7F77DD",
          }}
        >
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#1e1b4b",
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <IconPlus size={18} color="#7F77DD" stroke={2} /> Create New Task
          </h3>
          <form
            onSubmit={handleCreateTask}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1.5px solid #e5e7eb",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1.5px solid #e5e7eb",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
                minHeight: "70px",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #1D9E75, #0F6E56)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <IconPlus size={16} stroke={2} /> Add Task
            </button>
          </form>
        </div>

        {tasks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              color: "#9ca3af",
            }}
          >
            <IconChecklist
              size={40}
              color="#d1d5db"
              stroke={1}
              style={{ marginBottom: "8px" }}
            />
            <p style={{ fontSize: "14px" }}>No tasks yet! Create one above.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                padding: "16px",
                marginBottom: "12px",
                borderLeft: `4px solid ${task.status === "Completed" ? "#1D9E75" : "#7F77DD"}`,
              }}
            >
              {editingTask && editingTask._id === task._id ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <input
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                  <textarea
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "13px",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, status: e.target.value })
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleUpdateTask(task._id)}
                      style={{
                        padding: "8px 18px",
                        background: "linear-gradient(135deg, #7F77DD, #D4537E)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      style={{
                        padding: "8px 18px",
                        background: "#f3f4f6",
                        color: "#374151",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#1e1b4b",
                        marginBottom: "4px",
                      }}
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          marginBottom: "8px",
                        }}
                      >
                        {task.description}
                      </p>
                    )}
                    <span
                      style={{
                        padding: "3px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background:
                          task.status === "Completed" ? "#DCFCE7" : "#FEF9C3",
                        color:
                          task.status === "Completed" ? "#15803d" : "#854d0e",
                      }}
                    >
                      {task.status === "Completed" ? (
                        <IconCircleCheck size={13} stroke={2} />
                      ) : (
                        <IconClock size={13} stroke={2} />
                      )}
                      {task.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setEditingTask(task)}
                      style={{
                        padding: "6px 14px",
                        background: "#FEF9C3",
                        color: "#854d0e",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <IconEdit size={14} stroke={2} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      style={{
                        padding: "6px 14px",
                        background: "#fef2f2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <IconTrash size={14} stroke={2} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
