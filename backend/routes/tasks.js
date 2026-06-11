const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const { authMiddleware } = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({
      title,
      description,
      userId: req.user.id,
    });
    await newTask.save();

    await ActivityLog.create({
      user: req.user.id,
      action: "Task Creation",
      details: `Created task: "${title}"`,
    });

    res.json({ message: "Task created!", task: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, status },
      { new: true },
    );
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });

    await ActivityLog.create({
      user: req.user.id,
      action: "Task Update",
      details: `Updated task ID ${req.params.id} to status: ${status || "unchanged"}`,
    });

    res.json({ message: "Task updated!", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });

    await ActivityLog.create({
      user: req.user.id,
      action: "Task Deletion",
      details: `Deleted task titled: "${deletedTask.title}"`,
    });

    res.json({ message: "Task deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
