import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'https://rural-sports-portal.onrender.com';

export default function App() {
  const [talents, setTalents] = useState([]);
  const [filterSport, setFilterSport] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyShortlisted, setShowOnlyShortlisted] = useState(false);
  const [lang, setLang] = useState('en');
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [shortlistedIds, setShortlistedIds] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    sport: 'Athletics',
    state: 'Uttar Pradesh',
    district: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    contact: '',
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
    
    // Explicitly append all fields into FormData
    data.append('name', formData.name);
    data.append('sport', formData.sport);
    data.append('state', formData.state);
    data.append('district', formData.district);
    data.append('age', formData.age);
    data.append('gender', formData.gender);
    data.append('height', formData.height);
    data.append('weight', formData.weight);
    data.append('contact', formData.contact);
    data.append('metric', formData.metric);

    if (formData.media) {
      data.append('media', formData.media);
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/talents`, {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        alert(lang === 'hi' ? "टैलेंट प्रोफाइल सफलतापूर्वक पोस्ट हो गई!" : "Talent profile posted successfully!");
        setFormData({
          name: '',
          sport: 'Athletics',
          state: 'Uttar Pradesh',
          district: '',
          age: '',
          gender: 'Male',
          height: '',
          weight: '',
          contact: '',
          metric: '',
          media: null
        });
        fetchTalents();
      } else {
        alert("Failed to submit data.");
      }
    } catch (err) {
      alert("Failed to submit data.");
    }
  };

  const toggleShortlist = (id) => {
    if (shortlistedIds.includes(id)) {
      setShortlistedIds(shortlistedIds.filter(item => item !== id));
    } else {
      setShortlistedIds([...shortlistedIds, id]);
    }
  };

  const exportToCSV = () => {
    if (talents.length === 0) return alert("No data available to export");
    
    const headers = ["ID", "Name", "Sport", "Age", "Gender", "Height (cm)", "Weight (kg)", "District", "State", "Metric", "Contact", "Date"];
    const rows = talents.map(t => [
      t.id,
      `"${t.name}"`,
      `"${t.sport}"`,
      t.age,
      `"${t.gender || 'N/A'}"`,
      `"${t.height || 'N/A'}"`,
      `"${t.weight || 'N/A'}"`,
      `"${t.district}"`,
      `"${t.state || 'India'}"`,
      `"${t.metric}"`,
      `"${t.contact || 'N/A'}"`,
      t.date
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rural_Talent_Data_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTalents = talents.filter((t) => {
    const matchesSport = filterSport === 'All' || t.sport.toLowerCase().includes(filterSport.toLowerCase());
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      t.name.toLowerCase().includes(query) ||
      t.district.toLowerCase().includes(query) ||
      (t.state && t.state.toLowerCase().includes(query)) ||
      t.metric.toLowerCase().includes(query);

    const matchesShortlist = showOnlyShortlisted ? shortlistedIds.includes(t.id) : true;

    return matchesSport && matchesSearch && matchesShortlist;
  });

  const t = {
    title: lang === 'hi' ? '🏆 ग्रामीण प्रतिभा पहचान पोर्टल' : '🏆 Rural Talent Identification',
    subtitle: lang === 'hi' ? 'ग्रामीण एथलीटों को आधिकारिक स्काउट्स से जोड़ना' : 'Connecting Hidden Rural Athletes with Official Scouts',
    postTitle: lang === 'hi' ? 'प्रतिभा विवरण दर्ज करें' : 'Post Talent Details',
    name: lang === 'hi' ? 'एथलीट का नाम' : 'Athlete Name',
    sport: lang === 'hi' ? 'खेल श्रेणी' : 'Sport Category',
    location: lang === 'hi' ? 'जिला एवं राज्य' : 'District & State',
    age: lang === 'hi' ? 'आयु' : 'Age',
    gender: lang === 'hi' ? 'लिंग' : 'Gender',
    height: lang === 'hi' ? 'लंबाई (cm)' : 'Height (cm)',
    weight: lang === 'hi' ? 'वजन (kg)' : 'Weight (kg)',
    contact: lang === 'hi' ? 'संपर्क नंबर' : 'Contact Number',
    metric: lang === 'hi' ? 'मुख्य प्रदर्शन रिकॉर्ड / टाइमिंग' : 'Key Performance Metric / Timing',
    upload: lang === 'hi' ? 'वीडियो/इमेज अपलोड करें' : 'Upload Performance Video/Image',
    submit: lang === 'hi' ? 'सबमिट करें' : 'Submit Talent Entry',
    feedTitle: lang === 'hi' ? 'कंपाइल प्रतिभा फ़ीड' : 'Compiled Talent Feed',
    searchPlaceholder: lang === 'hi' ? '🔍 नाम, जिला, राज्य से खोजें...' : '🔍 Search by Athlete Name, District, State...',
    shortlist: lang === 'hi' ? 'शॉर्टलिस्ट करें' : 'Shortlist Candidate',
    shortlisted: lang === 'hi' ? '★ शॉर्टलिस्टेड' : '★ Shortlisted',
    viewDetails: lang === 'hi' ? 'पूरा प्रोफाइल देखें' : 'View Full Profile',
    close: lang === 'hi' ? 'बंद करें' : 'Close'
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <button 
          onClick={exportToCSV}
          style={{ width: 'auto', padding: '6px 16px', background: '#059669', fontSize: '13px' }}
        >
          📥 {lang === 'hi' ? 'एक्सेल (CSV) डाउनलोड करें' : 'Export Data (CSV)'}
        </button>

        <button 
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          style={{ width: 'auto', padding: '6px 16px', background: '#0f172a', fontSize: '13px' }}
        >
          🌐 {lang === 'en' ? 'Hindi (हिंदी)' : 'English'}
        </button>
      </div>

      <header>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#bfdbfe', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '20px', display: 'inline-block' }}>
  👑   <strong>Team Leader:</strong> Ankush &nbsp;|&nbsp; 🤝 <strong>Team:</strong> Om, Amit, Sikha &nbsp;|&nbsp; 🎓 <strong>NIT Patna (EE)</strong>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Athletes Registered</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb', marginTop: '4px' }}>{talents.length}</div>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Shortlisted Talent</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#16a34a', marginTop: '4px' }}>{shortlistedIds.length}</div>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center', marginBottom: 0 }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Active Sport Categories</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#d97706', marginTop: '4px' }}>16 Sports</div>
        </div>
      </div>

      <div className="grid-layout">
        <div>
          <div className="card">
            <h2>{t.postTitle}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
              <div className="form-group">
                <label>{t.name}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" />
              </div>

              <div className="form-group">
                <label>{t.sport}</label>
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
                <label>{t.location}</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} required placeholder="e.g. Gorakhpur, UP" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>{t.age}</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required placeholder="e.g. 17" />
                </div>
                <div className="form-group">
                  <label>{t.gender}</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>{t.height}</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 175" />
                </div>
                <div className="form-group">
                  <label>{t.weight}</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 68" />
                </div>
              </div>

              <div className="form-group">
                <label>{t.contact}</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Mobile / Guardian Contact" />
              </div>

              <div className="form-group">
                <label>{t.metric}</label>
                <input type="text" name="metric" value={formData.metric} onChange={handleChange} required placeholder="e.g. 100m in 11.2s OR 120kg Squat" />
              </div>

              <div className="form-group">
                <label>{t.upload}</label>
                <input type="file" accept="video/*,image/*" onChange={handleFileChange} />
              </div>

              <button type="submit">{t.submit}</button>
            </form>
          </div>
        </div>

        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>{t.feedTitle}</h2>
              <span className="badge">{filteredTalents.length} Athletes Found</span>
            </div>

            <div className="form-group">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '12px', fontSize: '15px', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select 
                onChange={(e) => setFilterSport(e.target.value)} 
                value={filterSport}
                style={{ flex: 1, minWidth: '160px' }}
              >
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

              <button
                type="button"
                onClick={() => setShowOnlyShortlisted(!showOnlyShortlisted)}
                style={{
                  width: 'auto',
                  background: showOnlyShortlisted ? '#16a34a' : '#64748b',
                  fontSize: '13px',
                  padding: '10px 14px'
                }}
              >
                {showOnlyShortlisted ? '✓ Shortlisted Only' : '⭐ Filter Shortlisted'}
              </button>
            </div>
          </div>

          {filteredTalents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: '#777', padding: '30px' }}>
              No athletes match your search criteria.
            </div>
          ) : (
            filteredTalents.map((item) => {
              const isShortlisted = shortlistedIds.includes(item.id);
              return (
                <div key={item.id} className="card talent-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3>
                        {item.name} ({item.age} yrs)
                        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px' }}>
                          ✔️ Verified Candidate
                        </span>
                      </h3>
                    </div>
                    <span className="badge">{item.sport}</span>
                  </div>

                  <p style={{ color: '#666', marginTop: '5px' }}>📍 {item.district}, {item.state || 'India'}</p>
                  
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <button 
                      type="button" 
                      onClick={() => toggleShortlist(item.id)}
                      style={{ width: 'auto', background: isShortlisted ? '#16a34a' : '#f59e0b', fontSize: '12px', padding: '6px 14px' }}
                    >
                      {isShortlisted ? t.shortlisted : t.shortlist}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setSelectedAthlete(item)}
                      style={{ width: 'auto', background: '#475569', fontSize: '12px', padding: '6px 14px' }}
                    >
                      {t.viewDetails} ➔
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dynamic Modal View (No Hardcoded Values) */}
      {selectedAthlete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>🏅 Athlete Full Profile</h2>
            <hr style={{ margin: '12px 0' }} />
            
            <p style={{ marginBottom: '8px' }}><strong>Name:</strong> {selectedAthlete.name}</p>
            <p style={{ marginBottom: '8px' }}><strong>Sport:</strong> {selectedAthlete.sport}</p>
            <p style={{ marginBottom: '8px' }}><strong>Age & Gender:</strong> {selectedAthlete.age} yrs | {selectedAthlete.gender || 'Not Specified'}</p>
            <p style={{ marginBottom: '8px' }}><strong>Location:</strong> {selectedAthlete.district}, {selectedAthlete.state || 'India'}</p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Physical Stats:</strong> Height: {selectedAthlete.height ? `${selectedAthlete.height} cm` : 'N/A'} | Weight: {selectedAthlete.weight ? `${selectedAthlete.weight} kg` : 'N/A'}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Contact Info:</strong> {selectedAthlete.contact ? selectedAthlete.contact : 'Not Provided'}
            </p>
            <p style={{ marginBottom: '8px' }}><strong>Key Performance Record:</strong> {selectedAthlete.metric}</p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => window.print()} 
                style={{ background: '#2563eb' }}
              >
                🖨️ Print Profile ID
              </button>
              <button 
                onClick={() => setSelectedAthlete(null)}
                style={{ background: '#dc2626' }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: '40px', padding: '24px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700' }}>🎓 Project Development Team</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Electrical Engineering Department | National Institute of Technology (NIT) Patna</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 18px', borderRadius: '8px', textAlign: 'center', minWidth: '180px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d4ed8', textTransform: 'uppercase' }}>Team Leader</span>
            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px', marginTop: '2px' }}>Ankush </div>
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
            <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px', marginTop: '2px' }}>Sikha </div>
          </div>
        </div>
      </footer>
    </div>
  );
}