import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

interface UserData {
  firstName?: string;
  lastName?: string;
  email: string;
  skinType?: string;
}

interface RoutineStep {
  id: number;
  name: string;
  completed: boolean;
}

type Category = 'dashboard' | 'skincare' | 'haircare' | 'fashion';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('dashboard');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [routineSteps, setRoutineSteps] = useState<Record<Category, RoutineStep[]>>({
    dashboard: [],
    skincare: [
      { id: 1, name: 'Cleanse face', completed: false },
      { id: 2, name: 'Apply toner', completed: false },
      { id: 3, name: 'Serum application', completed: false },
      { id: 4, name: 'Moisturize', completed: false },
      { id: 5, name: 'SPF protection', completed: false },
    ],
    haircare: [
      { id: 6, name: 'Shampoo hair', completed: false },
      { id: 7, name: 'Condition', completed: false },
      { id: 8, name: 'Leave-in treatment', completed: false },
      { id: 9, name: 'Scalp massage', completed: false },
    ],
    fashion: [
      { id: 10, name: 'Review daily outfit', completed: false },
      { id: 11, name: 'Check weather forecast', completed: false },
      { id: 12, name: 'Plan accessories', completed: false },
    ],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!token && !isLoggedIn) {
      navigate('/login');
      return;
    }

    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleRoutineStep = (id: number) => {
    const currentSteps = routineSteps[activeCategory];
    if (currentSteps) {
      const updated = currentSteps.map(step =>
        step.id === id ? { ...step, completed: !step.completed } : step
      );
      setRoutineSteps({ ...routineSteps, [activeCategory]: updated });
    }
  };

  const getCompletionPercentage = () => {
    const currentSteps = routineSteps[activeCategory];
    if (!currentSteps || currentSteps.length === 0) return 0;
    return Math.round((currentSteps.filter(s => s.completed).length / currentSteps.length) * 100);
  };

  if (!userData) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  const userName = userData.firstName || userData.email.split('@')[0];

  return (
    <div className={`dashboard-layout ${activeCategory !== 'dashboard' ? 'category-view' : ''}`}>
      {/* Top Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-left">
          <div className="nav-logo">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stopColor="#C8A882" />
                  <stop offset="100%" stopColor="#D4B5A0" />
                </linearGradient>
              </defs>
              <path d="M24 8C24 8 18 16 18 24C18 32.8366 20.6863 36 24 36C27.3137 36 30 32.8366 30 24C30 16 24 8 24 8Z" fill="url(#logoGrad)" />
              <circle cx="24" cy="18" r="3" fill="#F5E6D3" opacity="0.8" />
            </svg>
            <span className="nav-brand">GlowIQ</span>
          </div>
        </div>

        <div className="nav-right">
          <div className="profile-menu-container">
            <button 
              className="nav-profile"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <div className="profile-avatar">{userName.charAt(0).toUpperCase()}</div>
              <span className="profile-text">{userName}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="dropdown-icon">
                <path d="M7 10l5 5 5-5z" fill="currentColor" />
              </svg>
            </button>
            
            {profileMenuOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="dropdown-email">{userData.email}</p>
                </div>
                <button 
                  className="dropdown-item logout-item"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeCategory === 'dashboard' ? (
          // Dashboard Home - Category Selection
          <div className="dashboard-home">
            <div className="home-header">
              <h1 className="home-title">Welcome to GlowIQ</h1>
              <p className="home-subtitle">Your personal self-care companion</p>
            </div>

            <div className="categories-grid">
              {/* Skin Care Card */}
              <div 
                className="category-card skincare-card"
                onClick={() => navigate('/skincare')}
              >
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" fill="#E8C4B8" opacity="0.2" />
                    <path d="M32 12c11 0 20 9 20 20s-9 20-20 20S12 43 12 32s9-20 20-20z" fill="none" stroke="#C8A882" strokeWidth="2" />
                    <circle cx="26" cy="28" r="2.5" fill="#C8A882" />
                    <circle cx="38" cy="28" r="2.5" fill="#C8A882" />
                    <path d="M28 38c2 2 4 2 6 2s4 0 6-2" stroke="#C8A882" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="card-title">Skin Care</h2>
                <p className="card-description">Nourish and protect your skin with a personalized routine</p>
                <div className="card-cta">View Routine →</div>
              </div>

              {/* Hair Care Card */}
              <div 
                className="category-card haircare-card"
                onClick={() => navigate('/haircare')}
              >
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" fill="#D4B5A0" opacity="0.2" />
                    <path d="M24 16c-3 0-5 2-5 5v20c0 3 2 7 8 7h10c6 0 8-4 8-7V21c0-3-2-5-5-5" stroke="#C8A882" strokeWidth="2" fill="none" />
                    <path d="M20 24h24M20 32h24M20 40h24" stroke="#C8A882" strokeWidth="1.5" />
                  </svg>
                </div>
                <h2 className="card-title">Hair Care</h2>
                <p className="card-description">Strengthen and revitalize your hair with daily care</p>
                <div className="card-cta">View Routine →</div>
              </div>

              {/* Fashion Care Card */}
              <div 
                className="category-card fashion-card"
                onClick={() => window.location.assign('/fashion.html')}
              >
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" fill="#DDB5A8" opacity="0.2" />
                    <path d="M20 18h24l-2 10H22l-2-10z" stroke="#C8A882" strokeWidth="2" fill="none" />
                    <path d="M24 28v16c0 2 1 4 3 4h10c2 0 3-2 3-4V28" stroke="#C8A882" strokeWidth="2" fill="none" />
                    <path d="M26 28l-2 18h16l-2-18" stroke="#C8A882" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <h2 className="card-title">Fashion Care</h2>
                <p className="card-description">Keep your wardrobe fresh with smart styling tips</p>
                <div className="card-cta">View Routine →</div>
              </div>
            </div>
          </div>
        ) : (
          // Category View - Routine Content
          <div className="category-view-content">
            <div className="category-header">
              <button 
                className="back-btn"
                onClick={() => setActiveCategory('dashboard')}
              >
                ← Back to Dashboard
              </button>
              <h1 className="category-title">
                {activeCategory === 'skincare' && '✨ Skin Care Routine'}
                {activeCategory === 'haircare' && '💇 Hair Care Routine'}
                {activeCategory === 'fashion' && '👗 Fashion Care Routine'}
              </h1>
            </div>

            <div className="routine-section">
              <div className="routine-header">
                <h2 className="routine-title">Today's Routine</h2>
                <div className="routine-stats">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getCompletionPercentage()}%` }}
                    ></div>
                  </div>
                  <span className="completion-text">{getCompletionPercentage()}% Complete</span>
                </div>
              </div>

              <div className="routine-list">
                {routineSteps[activeCategory]?.map(step => (
                  <div key={step.id} className={`routine-item ${step.completed ? 'completed' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={step.completed}
                      onChange={() => toggleRoutineStep(step.id)}
                      className="routine-checkbox"
                    />
                    <label className="routine-label">{step.name}</label>
                    {step.completed && <span className="check-mark">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
