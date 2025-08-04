const express = require("express");
const multer = require("multer");
const path = require("path");
const Notification = require("../models/Notifications");

const router = express.Router();

// PDF upload storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST - Create notification
router.post("/", upload.single("pdf"), async (req, res) => {
  const { title, message, hostel } = req.body;
  const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const notif = new Notification({ title, message, hostel, pdfUrl });
  await notif.save();
  res.status(201).json({ message: "Notification created" });
});

// GET - Get notifications for a hostel
router.get("/:hostel", async (req, res) => {
  const { hostel } = req.params;
  const notifications = await Notification.find({
    $or: [{ hostel }, { hostel: "all" }]
  }).sort({ createdAt: -1 });
  res.json(notifications);
});

router.delete('/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});


module.exports = router;
