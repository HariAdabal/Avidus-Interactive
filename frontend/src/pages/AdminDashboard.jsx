import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  IconCrown,
  IconLogout,
  IconUsers,
  IconClipboardList,
  IconCircleCheck,
  IconClock,
  IconChartBar,
  IconFileDescription,
} from "@tabler/icons-react";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const token = localStorage.getItem("token");

  const fetchAdminData = async () => {
    try {
      const usersRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const usersData = await usersRes.json();
      if (!usersRes.ok)
        throw new Error(usersData.error || "Failed to fetch users");
      setUsers(usersData);

      const tasksRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/tasks`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const tasksData = await tasksRes.json();
      if (!tasksRes.ok)
        throw new Error(tasksData.error || "Failed to fetch tasks");
      setTasks(tasksData);

      const logsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/logs`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const logsData = await logsRes.json();
      if (!logsRes.ok)
        throw new Error(logsData.error || "Failed to fetch logs");
      setLogs(logsData);

      const analyticsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/analytics`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const analyticsData = await analyticsRes.json();
      if (!analyticsRes.ok)
        throw new Error(analyticsData.error || "Failed to fetch analytics");
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      fetchAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
      fetchAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  const tabStyle = (tab) => ({
    padding: "9px 18px",
    border: activeTab === tab ? "none" : "1px solid #e5e7eb",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    background:
      activeTab === tab ? "linear-gradient(135deg, #7F77DD, #D4537E)" : "white",
    color: activeTab === tab ? "white" : "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  });

  const analyticsData = [
    {
      num: analytics?.totalUsers,
      label: "Total Users",
      bg: "linear-gradient(135deg, #EEEDFE, #e0defc)",
      color: "#534AB7",
      border: "#AFA9EC",
      iconBg: "#EEEDFE",
      iconBorder: "#7F77DD",
      icon: <IconUsers size={22} color="#534AB7" stroke={1.5} />,
    },
    {
      num: analytics?.totalTasks,
      label: "Total Tasks",
      bg: "linear-gradient(135deg, #FBEAF0, #f7d6e8)",
      color: "#993556",
      border: "#ED93B1",
      iconBg: "#FBEAF0",
      iconBorder: "#D4537E",
      icon: <IconClipboardList size={22} color="#993556" stroke={1.5} />,
    },
    {
      num: analytics?.completedTasks,
      label: "Completed Tasks",
      bg: "linear-gradient(135deg, #E1F5EE, #c5eede)",
      color: "#0F6E56",
      border: "#5DCAA5",
      iconBg: "#E1F5EE",
      iconBorder: "#1D9E75",
      icon: <IconCircleCheck size={22} color="#0F6E56" stroke={1.5} />,
    },
    {
      num: analytics?.pendingTasks,
      label: "Pending Tasks",
      bg: "linear-gradient(135deg, #FAEEDA, #f5ddb0)",
      color: "#854F0B",
      border: "#EF9F27",
      iconBg: "#FAEEDA",
      iconBorder: "#BA7517",
      icon: <IconClock size={22} color="#854F0B" stroke={1.5} />,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EEEDFE 0%, #FBEAF0 100%)",
        fontFamily: "sans-serif",
        padding: "30px 16px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #7F77DD, #D4537E)",
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
              <IconCrown size={24} color="white" stroke={1.5} />
            </div>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
                Admin Control Panel
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
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            style={tabStyle("analytics")}
            onClick={() => setActiveTab("analytics")}
          >
            <IconChartBar size={16} stroke={2} /> Analytics
          </button>
          <button
            style={tabStyle("users")}
            onClick={() => setActiveTab("users")}
          >
            <IconUsers size={16} stroke={2} /> Users ({users.length})
          </button>
          <button
            style={tabStyle("tasks")}
            onClick={() => setActiveTab("tasks")}
          >
            <IconClipboardList size={16} stroke={2} /> Tasks ({tasks.length})
          </button>
          <button style={tabStyle("logs")} onClick={() => setActiveTab("logs")}>
            <IconFileDescription size={16} stroke={2} /> Audit Logs (
            {logs.length})
          </button>
        </div>

        {activeTab === "analytics" && analytics && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {analyticsData.map((item, i) => (
              <div
                key={i}
                style={{
                  background: item.bg,
                  borderRadius: "16px",
                  padding: "24px",
                  border: `1px solid ${item.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    background: item.iconBg,
                    border: `1px solid ${item.iconBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      color: item.color,
                      lineHeight: 1,
                    }}
                  >
                    {item.num}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: item.color,
                      marginTop: "6px",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "users" && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #EEEDFE, #FBEAF0)",
                  }}
                >
                  {["Username", "Email", "Role", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontWeight: "600",
                          color: "#534AB7",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: "500",
                        color: "#1e1b4b",
                      }}
                    >
                      {u.username}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "600",
                          background:
                            u.role === "Admin" ? "#EEEDFE" : "#E1F5EE",
                          color: u.role === "Admin" ? "#534AB7" : "#0F6E56",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "600",
                          background:
                            u.status === "Active" ? "#EAF3DE" : "#FCEBEB",
                          color: u.status === "Active" ? "#3B6D11" : "#A32D2D",
                        }}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {u._id !== user?.id ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() =>
                              handleToggleUserStatus(u._id, u.status)
                            }
                            style={{
                              padding: "5px 12px",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              background:
                                u.status === "Active" ? "#FAEEDA" : "#E1F5EE",
                              color:
                                u.status === "Active" ? "#854F0B" : "#0F6E56",
                            }}
                          >
                            {u.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            style={{
                              padding: "5px 12px",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              background: "#FCEBEB",
                              color: "#A32D2D",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#9ca3af",
                            fontStyle: "italic",
                          }}
                        >
                          Self (locked)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "tasks" && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #EEEDFE, #FBEAF0)",
                  }}
                >
                  {["Title", "Description", "Status", "Created By", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontWeight: "600",
                          color: "#534AB7",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: "500",
                        color: "#1e1b4b",
                      }}
                    >
                      {task.title}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>
                      {task.description || "-"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background:
                            task.status === "Completed" ? "#EAF3DE" : "#FAEEDA",
                          color:
                            task.status === "Completed" ? "#3B6D11" : "#854F0B",
                        }}
                      >
                        {task.status === "Completed" ? (
                          <IconCircleCheck size={12} stroke={2} />
                        ) : (
                          <IconClock size={12} stroke={2} />
                        )}
                        {task.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#534AB7",
                        fontWeight: "500",
                      }}
                    >
                      {task.userId?.username || "Unknown"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#9ca3af",
                        fontSize: "12px",
                      }}
                    >
                      {new Date(task.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "logs" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {logs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  background: "white",
                  borderRadius: "16px",
                  color: "#9ca3af",
                }}
              >
                No logs yet.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log._id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    padding: "14px 16px",
                    borderLeft: "4px solid #D4537E",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#D4537E",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <IconFileDescription size={14} stroke={2} /> {log.action}
                    </span>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#374151",
                      margin: "4px 0",
                    }}
                  >
                    {log.details}
                  </p>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                    User:{" "}
                    {log.user
                      ? `${log.user.username} (${log.user.email})`
                      : "System / Guest"}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
