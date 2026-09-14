{/* Modal View */}
      {selectedAthlete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>🏅 Athlete Full Profile</h2>
            <hr style={{ margin: '12px 0' }} />
            
            <p><strong>Name:</strong> {selectedAthlete.name}</p>
            <p><strong>Sport:</strong> {selectedAthlete.sport}</p>
            <p><strong>Age & Gender:</strong> {selectedAthlete.age} yrs | {selectedAthlete.gender || 'Not Specified'}</p>
            <p><strong>Location:</strong> {selectedAthlete.district}, {selectedAthlete.state || 'India'}</p>
            <p><strong>Physical Stats:</strong> Height: {selectedAthlete.height && selectedAthlete.height !== 'N/A' ? `${selectedAthlete.height} cm` : 'Not Specified'} | Weight: {selectedAthlete.weight && selectedAthlete.weight !== 'N/A' ? `${selectedAthlete.weight} kg` : 'Not Specified'}</p>
            <p><strong>Contact Info:</strong> {selectedAthlete.contact && selectedAthlete.contact !== 'N/A' ? selectedAthlete.contact : 'Not Provided'}</p>
            <p><strong>Key Performance Record:</strong> {selectedAthlete.metric}</p>

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