import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'https://rural-sports-portal.onrender.com';

export default function App() {
  const [talents, setTalents] = useState([]);
  const [filterSport, setFilterSport] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    sport: 'Athletics',
    state: 'Uttar Pradesh',
    district: '',
    age: '',
    metric: '',
    media: null
  });

  const fetchTalents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/talents`);
      const data = await res.json();
      setTalents(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, media: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      const res = await fetch(`${BACKEND_URL}/api/talents`, {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        alert("Talent profile posted successfully!");
        setFormData({
          name: '',
          sport: 'Athletics',
          state: 'Uttar Pradesh',
          district: '',
          age: '',
          metric: '',
          media: null
        });
        fetchTalents();
      }
    } catch (err) {
      alert("Failed to submit data.");
    }
  };

  const filteredTalents = filterSport === 'All' 
    ? talents 
    : talents.filter(t => t.sport.toLowerCase().includes(filterSport.toLowerCase()));

  return (
    <div className="container">
      <header>
        <h1>🏆 Rural Sports Talent Portal</h1>
        <p>Connecting Hidden Rural Athletes with Official Scouts</p>
      </header>

      <div className="grid-layout">
        <div>
          <div className="card">
            <h2>Post Talent Details</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
              <div className="form-group">
                <label>Athlete Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" />
              </div>

              <div className="form-group">
                <label>Sport Category</label>
                <select name="sport" value={formData.sport} onChange={handleChange}>
                  <option value="Athletics">Athletics / Running</option>
                  <option value="Kabaddi">Kabaddi</option>
                  <option value="Wrestling">Wrestling / Kushti</option>
                  <option value="Weightlifting">Weightlifting</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                </select>
              </div>

              <div className="form-group">
                <label>District & State</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} required placeholder="e.g. Gorakhpur, UP" />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required placeholder="e.g. 17" />
              </div>

              <div className="form-group">
                <label>Key Performance Metric / Timing</label>
                <input type="text" name="metric" value={formData.metric} onChange={handleChange} required placeholder="e.g. 100m in 11.2s OR 120kg Squat" />
              </div>

              <div className="form-group">
                <label>Upload Performance Video/Image</label>
                <input type="file" accept="video/*,image/*" onChange={handleFileChange} />
              </div>

              <button type="submit">Submit Talent Entry</button>
            </form>
          </div>
        </div>

        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Compiled Talent Feed</h2>
              <span className="badge">{filteredTalents.length} Athletes Found</span>
            </div>

            <div className="filter-bar" style={{ marginTop: '15px' }}>
              <select onChange={(e) => setFilterSport(e.target.value)}>
                <option value="All">Filter by Sport: All</option>
                <option value="Athletics">Athletics</option>
                <option value="Kabaddi">Kabaddi</option>
                <option value="Wrestling">Wrestling</option>
                <option value="Weightlifting">Weightlifting</option>
              </select>
            </div>
          </div>

          {filteredTalents.map((item) => (
            <div key={item.id} className="card talent-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{item.name} ({item.age} yrs)</h3>
                <span className="badge">{item.sport}</span>
              </div>
              <p style={{ color: '#666', marginTop: '5px' }}>📍 {item.district}, {item.state}</p>
              
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
                <strong>Best Metric / Record:</strong> {item.metric}
              </div>

              {item.videoUrl && (
                <div style={{ marginTop: '10px' }}>
                  <video controls width="100%" style={{ borderRadius: '5px', maxHeight: '250px' }}>
                    <source src={`${BACKEND_URL}${item.videoUrl}`} />
                    Your browser does not support video playback.
                  </video>
                </div>
              )}

              <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                Posted on: {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}