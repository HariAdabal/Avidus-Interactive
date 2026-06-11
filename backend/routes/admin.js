const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const { authMiddleware, adminOnly } = require("../middleware/auth");

router.use(authMiddleware);
router.use(adminOnly);

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/users/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).select("-password");

    if (!updatedUser) return res.status(400).json({ error: "User not found" });
    res.json({ message: "User status updated!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted forever!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const allTasks = await Task.find().populate("userId", "username email");
    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "username email")
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const pendingTasks = await Task.countDocuments({ status: "Pending" });

    res.json({ totalUsers, totalTasks, completedTasks, pendingTasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
