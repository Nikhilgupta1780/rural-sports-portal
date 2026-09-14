import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'https://rural-sports-portal.onrender.com';

export default function App() {
  const [talents, setTalents] = useState([]);
  const [filterSport, setFilterSport] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter & Search Logic
  const filteredTalents = talents.filter((t) => {
    const matchesSport = filterSport === 'All' || t.sport.toLowerCase().includes(filterSport.toLowerCase());
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      t.name.toLowerCase().includes(query) ||
      t.district.toLowerCase().includes(query) ||
      t.state.toLowerCase().includes(query) ||
      t.metric.toLowerCase().includes(query);

    return matchesSport && matchesSearch;
  });

  return (
    <div className="container">
      {/* Header with Updated Headline */}
      <header>
        <h1>🏆 Rural Talent Identification</h1>
        <p>Connecting Hidden Rural Athletes with Official Scouts</p>
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#bfdbfe', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '20px', display: 'inline-block' }}>
          👑 <strong>Team Leader:</strong> Ankush Gupta &nbsp;|&nbsp; 🤝 <strong>Team:</strong> Om, Amit, Sikha Kumari &nbsp;|&nbsp; 🎓 <strong>NIT Patna (EE)</strong>
        </div>
      </header>

      <div className="grid-layout">
        {/* Left Side: Submission Form */}
        <div>
          <div className="card">
            <h2>Post Talent Details</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
              <div className="form-group">
                <label>Athlete Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" />
              </div>

              <div className="form-group">
                <label>Sport Category (16 Sports)</label>
                <select name="sport" value={formData.sport} onChange={handleChange}>
                  <option value="Athletics">Athletics / Running</option>
                  <option value="Kabaddi">Kabaddi</option>
                  <option value="Wrestling">Wrestling / Kushti</option>
                  <option value="Weightlifting">Weightlifting</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                  <option value="Kho-Kho">Kho-Kho</option>
                  <option value="Archery">Archery (Tirandazi)</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Boxing">Boxing</option>
                  <option value="Hockey">Hockey</option>
                  <option value="Shooting">Shooting</option>
                  <option value="Judo / Martial Arts">Judo / Martial Arts</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Powerlifting">Powerlifting</option>
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

        {/* Right Side: Compiled Data Feed + Search */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>Compiled Talent Feed</h2>
              <span className="badge">{filteredTalents.length} Athletes Found</span>
            </div>

            {/* Top Search Bar */}
            <div className="form-group">
              <input 
                type="text" 
                placeholder="🔍 Search by Athlete Name, District, State..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '12px', fontSize: '15px', borderRadius: '6px' }}
              />
            </div>

            {/* Sport Category Filter */}
            <div className="filter-bar">
              <select onChange={(e) => setFilterSport(e.target.value)} value={filterSport}>
                <option value="All">All Sports Categories</option>
                <option value="Athletics">Athletics</option>
                <option value="Kabaddi">Kabaddi</option>
                <option value="Wrestling">Wrestling</option>
                <option value="Weightlifting">Weightlifting</option>
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Kho-Kho">Kho-Kho</option>
                <option value="Archery">Archery</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Badminton">Badminton</option>
                <option value="Boxing">Boxing</option>
                <option value="Hockey">Hockey</option>
                <option value="Shooting">Shooting</option>
                <option value="Judo">Judo / Martial Arts</option>
                <option value="Swimming">Swimming</option>
                <option value="Powerlifting">Powerlifting</option>
              </select>
            </div>
          </div>

          {/* Render Athlete Cards */}
          {filteredTalents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: '#777', padding: '30px' }}>
              No athletes match your search criteria.
            </div>
          ) : (
            filteredTalents.map((item) => (
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
            ))
          )}
        </div>
      </div>

      {/* Professional Team Credits Footer */}
      <footer style={{ marginTop: '40px', padding: '24px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700' }}>🎓 Project Development Team</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Electrical Engineering Department | National Institute of Technology (NIT) Patna</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 18px', borderRadius: '8px', textAlign: 'center', minWidth: '180px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team Leader</span>
            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px', marginTop: '2px' }}>Ankush Gupta</div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '8px', textAlign: 'center', minWidth: '140px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Team Member</span>
            <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px', marginTop: '2px' }}>Om</div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '8px', textAlign: 'center', minWidth: '140px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Team Member</span>
            <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px', marginTop: '2px' }}>Amit</div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '8px', textAlign: 'center', minWidth: '140px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Team Member</span>
            <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px', marginTop: '2px' }}>Sikha Kumari</div>
          </div>
        </div>
      </footer>
    </div>
  );
}