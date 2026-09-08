const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Uploads directory ensure karein
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Static folder for videos/photos
app.use('/uploads', express.static(uploadDir));

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// In-Memory Database (Demo ke liye, real app me MongoDB use kar sakte hain)
let talentPosts = [
  {
    id: 1,
    name: "Ramesh Kumar",
    sport: "Athletics (100m)",
    state: "Uttar Pradesh",
    district: "Gorakhpur",
    age: 18,
    metric: "11.2 seconds",
    videoUrl: null,
    date: new Date().toLocaleDateString()
  }
];

// GET: Fetch all compiled sports talent data
app.get('/api/talents', (req, res) => {
  res.json(talentPosts);
});

// POST: Add new rural talent entry with media upload
app.post('/api/talents', upload.single('media'), (req, res) => {
  const { name, sport, state, district, age, metric } = req.body;

  const newTalent = {
    id: talentPosts.length + 1,
    name,
    sport,
    state,
    district,
    age: parseInt(age),
    metric,
    videoUrl: req.file ? `/uploads/${req.file.filename}` : null,
    date: new Date().toLocaleDateString()
  };

  talentPosts.unshift(newTalent);
  res.status(201).json({ message: "Talent post created successfully!", talent: newTalent });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});