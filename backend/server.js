const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

let talentPosts = [
  {
    id: 1,
    name: "Ramesh Kumar",
    sport: "Athletics",
    state: "Uttar Pradesh",
    district: "Gorakhpur",
    age: 18,
    gender: "Male",
    height: "175",
    weight: "68",
    contact: "9876543210",
    metric: "100m in 11.2s",
    videoUrl: null,
    date: new Date().toLocaleDateString()
  }
];

app.get('/', (req, res) => {
  res.send("Rural Sports Backend API is running live!");
});

app.get('/api/talents', (req, res) => {
  res.json(talentPosts);
});

app.post('/api/talents', (req, res) => {
  upload.single('media')(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
    }

    const { name, sport, state, district, age, gender, height, weight, contact, metric } = req.body;

    if (!name || !district) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTalent = {
      id: talentPosts.length + 1,
      name,
      sport: sport || 'Athletics',
      state: state || 'Uttar Pradesh',
      district,
      age: parseInt(age) || 18,
      gender: gender || 'Male',
      height: height || 'N/A',
      weight: weight || 'N/A',
      contact: contact || 'N/A',
      metric: metric || 'N/A',
      videoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      date: new Date().toLocaleDateString()
    };

    talentPosts.unshift(newTalent);
    res.status(201).json({ message: "Talent post created successfully!", talent: newTalent });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});