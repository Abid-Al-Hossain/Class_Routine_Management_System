import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix: Allow CORS for frontend
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

// ✅ MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/class-management";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routine Schema
const routineSchema = new mongoose.Schema({
  day: String,
  classTest: { subject: String, teacher: String, room: String },
  morningSlots: [{ subject: String, teacher: String, room: String }],
  midDaySlots: [
    {
      isLab: Boolean,
      subject: String,
      teacher: String,
      room: String,
      startTime: String,
      endTime: String,
    },
  ],
  afternoonSlots: [
    {
      isLab: Boolean,
      subject: String,
      teacher: String,
      room: String,
      startTime: String,
      endTime: String,
    },
  ],
});
const Routine = mongoose.model("Routine", routineSchema);

// ✅ Chat Schema
const chatSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);

// ✅ Routine Routes
app.post("/api/routine", async (req, res) => {
  try {
    const { day, routineData } = req.body;
    const existingRoutine = await Routine.findOne({ day });

    if (existingRoutine) {
      await Routine.updateOne({ day }, { $set: routineData });
    } else {
      const newRoutine = new Routine({ day, ...routineData });
      await newRoutine.save();
    }
    res.status(200).json({ message: "Routine saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save routine" });
  }
});

app.get("/api/routine", async (req, res) => {
  try {
    const routines = await Routine.find({});
    const routineMap = routines.reduce((acc, curr) => {
      acc[curr.day] = curr;
      return acc;
    }, {});
    res.status(200).json(routineMap);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch routine" });
  }
});

app.delete("/api/routine", async (req, res) => {
  try {
    await Routine.deleteMany({});
    res.status(200).json({ message: "Routine cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear routine" });
  }
});

app.get("/api/chat", async (req, res) => {
  try {
    const messages = await Chat.find().sort({ timestamp: 1 });
    res.status(200).json(
      messages.map((msg) => ({
        id: msg._id,
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { sender, content } = req.body;
    const newMessage = new Chat({ sender, content });
    await newMessage.save();
    res.status(200).json({
      id: newMessage._id,
      sender: newMessage.sender,
      content: newMessage.content,
      timestamp: newMessage.timestamp,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.delete("/api/chat/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    const deletedMessage = await Chat.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// ✅ Add Notification Schema
const notificationSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

// ✅ Route to Fetch All Notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ✅ Route to Add a New Notification
app.post("/api/notifications", async (req, res) => {
  try {
    const { sender, content } = req.body;
    const newNotification = new Notification({ sender, content });
    await newNotification.save();
    res.status(200).json({
      id: newNotification._id,
      sender: newNotification.sender,
      content: newNotification.content,
      timestamp: newNotification.timestamp,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to send notification" });
  }
});

app.delete("/api/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

const requestSchema = new mongoose.Schema({
  teacherName: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  acceptStatus: { type: String, default: "pending" },
});

const Request = mongoose.model("Request", requestSchema);

// ✅ Route to Fetch All Schedule Change Requests
app.get("/api/requests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ timestamp: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// ✅ Route to Add a New Schedule Change Request
app.post("/api/requests", async (req, res) => {
  try {
    const { teacherName, content } = req.body;
    const newRequest = new Request({ teacherName, content });
    await newRequest.save();
    res.status(200).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit request" });
  }
});

app.put("/api/requests/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;
    await Request.findByIdAndUpdate(id, { acceptStatus: "accepted" });
    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept request" });
  }
});

app.put("/api/requests/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    await Request.findByIdAndUpdate(id, { acceptStatus: "rejected" });
    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject request" });
  }
});

app.delete("/api/requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Request.findByIdAndDelete(id);
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete request" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
