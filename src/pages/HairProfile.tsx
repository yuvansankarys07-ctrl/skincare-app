import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hair-profile.css';

interface UserData {
  firstName?: string;
  lastName?: string;
}

interface HairProfile {
  hairType: string;
  scalpType: string;
  gender: string;
  ageGroup: string;
  summary: {
    topConcerns: string[];
    washFreq: string;
    lifestyle: string;
  };
  routine: string[];
  weekly: string[];
}

const HairProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hairProfile, setHairProfile] = useState<HairProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!token && !isLoggedIn) {
      navigate('/login');
      return;
    }

    const data = localStorage.getItem('userData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setUserData(parsed);
      } catch (e) {
        console.error('Failed to load user data');
      }
    }

    const hairData = localStorage.getItem('userData');
    if (hairData) {
      try {
        const parsed = JSON.parse(hairData);
        if (parsed.hairProfile?.result) {
          setHairProfile(parsed.hairProfile.result);
        }
      } catch (e) {
        console.error('Failed to load hair profile');
      }
    }
  }, [navigate]);

  if (!userData || !hairProfile) {
    return (
      <div className="hp-loading">
        <div className="hp-loading-box">
          <div className="hp-loading-icon">💇</div>
          <p className="hp-loading-text">Loading your profile…</p>
        </div>
      </div>
    );
  }

  const userName = userData?.firstName || 'User';

  return (
    <div className="hp-container">
      {/* Navigation */}
      <nav className="hp-nav">
        <div className="hp-nav-container">
          <button onClick={() => navigate('/onboarding/hair')} className="hp-back-btn">
            ← Back
          </button>
          <h1 className="hp-nav-title">Hair Care Profile</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="hp-main">
        {/* Hero Section */}
        <section className="hp-hero">
          <div className="hp-hero-content">
            <div className="hp-hero-badge">
              <span className="hp-badge-icon">✨</span>
              <span className="hp-badge-text">AI-Powered Hair Insights</span>
            </div>
            <h1 className="hp-hero-title">Your Hair Care Profile</h1>
            <p className="hp-hero-subtitle">Personalized just for you</p>
            <div className="hp-user-name">{userName}</div>
          </div>
        </section>

        <div className="hp-content-wrapper">
          {/* Left Column */}
          <div className="hp-left-column">
            
            {/* Personal Details Section */}
            <section className="hp-section">
              <h2 className="hp-section-title">Personal Details</h2>
              <div className="hp-details-grid">
                <div className="hp-detail-card">
                  <div className="hp-detail-icon">👤</div>
                  <div className="hp-detail-content">
                    <p className="hp-detail-label">Gender</p>
                    <p className="hp-detail-value">{hairProfile.gender || 'Not specified'}</p>
                  </div>
                </div>
                <div className="hp-detail-card">
                  <div className="hp-detail-icon">🎂</div>
                  <div className="hp-detail-content">
                    <p className="hp-detail-label">Age Group</p>
                    <p className="hp-detail-value">{hairProfile.ageGroup || 'Not specified'}</p>
                  </div>
                </div>
                <div className="hp-detail-card">
                  <div className="hp-detail-icon">💇</div>
                  <div className="hp-detail-content">
                    <p className="hp-detail-label">Hair Type</p>
                    <p className="hp-detail-value">{hairProfile.hairType}</p>
                  </div>
                </div>
                <div className="hp-detail-card">
                  <div className="hp-detail-icon">🧴</div>
                  <div className="hp-detail-content">
                    <p className="hp-detail-label">Scalp Type</p>
                    <p className="hp-detail-value">{hairProfile.scalpType}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Hair Concerns Section */}
            {hairProfile.summary.topConcerns.length > 0 && (
              <section className="hp-section">
                <h2 className="hp-section-title">Your Hair Concerns</h2>
                <div className="hp-concerns-wrapper">
                  {hairProfile.summary.topConcerns.map((concern, idx) => (
                    <span key={idx} className="hp-concern-pill">
                      {concern}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Hair Care Routine Section */}
            <section className="hp-section">
              <h2 className="hp-section-title">Your Hair Care Routine</h2>
              
              <div className="hp-routine-box">
                <h3 className="hp-routine-title">🌞 Daily Routine</h3>
                <ul className="hp-routine-list">
                  {hairProfile.routine.map((item, idx) => (
                    <li key={idx} className="hp-routine-item">
                      <span className="hp-routine-icon">→</span>
                      <span className="hp-routine-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hp-routine-box">
                <h3 className="hp-routine-title">✨ Weekly Routine</h3>
                <ul className="hp-routine-list">
                  {hairProfile.weekly.map((item, idx) => (
                    <li key={idx} className="hp-routine-item">
                      <span className="hp-routine-icon">→</span>
                      <span className="hp-routine-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Wash Frequency */}
            <section className="hp-section">
              <h2 className="hp-section-title">Recommended Wash Frequency</h2>
              <div className="hp-frequency-card">
                <div className="hp-frequency-value">{hairProfile.summary.washFreq}</div>
                <p className="hp-frequency-description">Based on your hair and scalp type</p>
              </div>
            </section>

            {/* Lifestyle */}
            <section className="hp-section">
              <h2 className="hp-section-title">Lifestyle</h2>
              <div className="hp-lifestyle-card">
                <p className="hp-lifestyle-text">{hairProfile.summary.lifestyle}</p>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="hp-actions">
              <button 
                onClick={() => navigate('/onboarding/hair')}
                className="hp-btn hp-btn-outline"
              >
                ✏️ Retake Quiz
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="hp-btn hp-btn-primary"
              >
                ← Back to Dashboard
              </button>
            </div>

          </div>

          {/* Right Column - Illustration */}
          <div className="hp-right-column">
            <div className="hp-illustration">
              <div className="hp-illustration-content">
                <div className="hp-hair-graphic">
                  <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Head */}
                    <circle cx="100" cy="80" r="35" fill="#E8D2C4" opacity="0.8" stroke="#B08968" strokeWidth="1.5"/>
                    
                    {/* Hair - Long flowing style */}
                    <path d="M65 75 Q60 90 60 110 Q60 140 70 160 Q75 170 80 175" 
                          stroke="#B08968" strokeWidth="8" fill="none" strokeLinecap="round"/>
                    <path d="M135 75 Q140 90 140 110 Q140 140 130 160 Q125 170 120 175" 
                          stroke="#B08968" fill="none" strokeWidth="8" strokeLinecap="round"/>
                    
                    {/* Hair highlights */}
                    <path d="M75 85 Q70 110 72 135" 
                          stroke="#D4A574" fill="none" strokeWidth="3" opacity="0.6" strokeLinecap="round"/>
                    <path d="M125 85 Q130 110 128 135" 
                          stroke="#D4A574" fill="none" strokeWidth="3" opacity="0.6" strokeLinecap="round"/>
                    
                    {/* Hair shine effect */}
                    <circle cx="95" cy="100" r="8" fill="#E8C89E" opacity="0.5"/>
                    <circle cx="105" cy="95" r="5" fill="#E8C89E" opacity="0.4"/>
                  </svg>
                </div>
                <div className="hp-illustration-footer">
                  <p className="hp-illustration-text">Healthy, Nourished Hair</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HairProfile;
