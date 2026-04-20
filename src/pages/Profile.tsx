import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface UserData {
  firstName: string;
  lastName?: string;
  email: string;
  skinType?: string;
  createdAt?: string;
}

const SKIN_TYPE_INFO: Record<string, { description: string; color: string; icon: string }> = {
  Oily: {
    description: 'Oil-prone skin with large visible pores. Benefits from gel/foaming cleansers and lightweight moisturizers.',
    color: '#FFB84D',
    icon: '✨'
  },
  Dry: {
    description: 'Tight, flaky skin. Needs rich moisturizers and hydrating cleansers.',
    color: '#A8D5BA',
    icon: '🍂'
  },
  Normal: {
    description: 'Well-balanced skin with minimal sensitivity. Maintain with consistent routine.',
    color: '#FFD700',
    icon: '☀️'
  },
  Combination: {
    description: 'Oily T-zone, dry elsewhere. Requires targeted treatments and balanced products.',
    color: '#87CEEB',
    icon: '⚖️'
  },
  Sensitive: {
    description: 'Easily irritated, prone to redness. Use fragrance-free, soothing products.',
    color: '#FF6B9D',
    icon: '❤️'
  },
};

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!token && !isLoggedIn) {
      navigate('/login');
      return;
    }

    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Store in localStorage as well for offline access
          const completeUserData: UserData = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            skinType: data.skinType || '',
            createdAt: data.createdAt,
          };
          localStorage.setItem('userData', JSON.stringify(completeUserData));
          setUserData(completeUserData);
          setEditData(completeUserData);
        } else {
          // Fallback to localStorage if API fails
          const localData = localStorage.getItem('userData');
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              const completeUserData: UserData = {
                firstName: parsedData.firstName || '',
                lastName: parsedData.lastName || '',
                email: parsedData.email || '',
                skinType: parsedData.skinType || '',
                createdAt: parsedData.createdAt,
              };
              setUserData(completeUserData);
              setEditData(completeUserData);
            } catch (error) {
              console.error('Error parsing user data:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage
        const localData = localStorage.getItem('userData');
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            const completeUserData: UserData = {
              firstName: parsedData.firstName || '',
              lastName: parsedData.lastName || '',
              email: parsedData.email || '',
              skinType: parsedData.skinType || '',
              createdAt: parsedData.createdAt,
            };
            setUserData(completeUserData);
            setEditData(completeUserData);
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditChange = (field: keyof UserData, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSaveChanges = async () => {
    if (!editData.email) {
      setSaveMessage('Email is required');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const token = localStorage.getItem('token');
      
      const updatedData: UserData = {
        firstName: editData.firstName || userData?.firstName || '',
        lastName: editData.lastName || userData?.lastName,
        email: editData.email,
        skinType: userData?.skinType,
        createdAt: userData?.createdAt,
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        const completeUserData: UserData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          skinType: data.skinType || '',
          createdAt: data.createdAt,
        };
        
        // Update both state and localStorage
        localStorage.setItem('userData', JSON.stringify(completeUserData));
        setUserData(completeUserData);
        setEditData(completeUserData);
        setIsEditing(false);
        setSaveMessage('✓ Profile updated successfully!');
        
        // Clear message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setSaveMessage(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!userData) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  const userName = userData?.firstName || userData?.email.split('@')[0] || 'User';
  const skinTypeInfo = userData?.skinType ? SKIN_TYPE_INFO[userData.skinType as keyof typeof SKIN_TYPE_INFO] || SKIN_TYPE_INFO['Normal'] : SKIN_TYPE_INFO['Normal'];

  return (
    <div className="profile-container">
      {/* Navigation */}
      <nav className="profile-nav">
        <div className="nav-left">
          <button 
            className="back-button"
            onClick={() => navigate('/dashboard')}
          >
            ← Back
          </button>
          <h1 className="profile-nav-title">My Profile</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-content">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-large">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info-header">
              <h2 className="profile-name">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName || ''}
                    onChange={(e) => handleEditChange('firstName', e.target.value)}
                    className="edit-input"
                    placeholder="First Name"
                  />
                ) : (
                  `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim()
                )}
              </h2>
              <p className="profile-email">{userData?.email}</p>
            </div>
            {!isEditing && (
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Skin Care Profile Section */}
          {userData?.skinType && userData.skinType !== 'Not set' && (
            <div className="skin-profile-section">
              <h3 className="section-title">Your Skin Profile</h3>
              <div className="skin-type-card" style={{ borderLeftColor: skinTypeInfo.color }}>
                <div className="skin-type-header">
                  <span className="skin-type-icon">{skinTypeInfo.icon}</span>
                  <div className="skin-type-info">
                    <h4 className="skin-type-name">{userData.skinType} Skin</h4>
                    <p className="skin-type-description">{skinTypeInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="basic-info-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName || ''}
                    onChange={(e) => handleEditChange('firstName', e.target.value)}
                    className="edit-input"
                    placeholder="First Name"
                  />
                ) : (
                  <p className="info-value">{userData.firstName || 'Not set'}</p>
                )}
              </div>

              <div className="info-item">
                <label className="info-label">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName || ''}
                    onChange={(e) => handleEditChange('lastName', e.target.value)}
                    className="edit-input"
                    placeholder="Last Name"
                  />
                ) : (
                  <p className="info-value">{userData.lastName || 'Not set'}</p>
                )}
              </div>

              <div className="info-item">
                <label className="info-label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="edit-input"
                    placeholder="Email"
                  />
                ) : (
                  <p className="info-value">{userData?.email}</p>
                )}
              </div>

              <div className="info-item">
                <label className="info-label">Skin Type</label>
                <p className="info-value">{userData?.skinType || 'Not determined'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="action-buttons-container">
              {saveMessage && (
                <div className={`save-message ${saveMessage.includes('✓') ? 'success' : 'error'}`}>
                  {saveMessage}
                </div>
              )}
              <div className="action-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(userData || {});
                    setSaveMessage('');
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-box">
              <h4 className="info-box-title">💡 Quick Tip</h4>
              <p className="info-box-text">
                {userData?.skinType === 'Oily' && 'Use a gel cleanser and keep your routine lightweight. Exfoliate 2-3 times weekly for best results.'}
                {userData?.skinType === 'Dry' && 'Invest in a hydrating cleanser and rich moisturizer. Avoid hot water when washing.'}
                {userData?.skinType === 'Normal' && 'Maintain your consistent routine and stay hydrated. Use sunscreen daily.'}
                {userData?.skinType === 'Combination' && 'Treat your T-zone separately with oil-control products. Use balanced hydration elsewhere.'}
                {userData?.skinType === 'Sensitive' && 'Always patch test new products. Stick to fragrance-free, gentle formulations.'}
                {!userData?.skinType && 'Complete a skin assessment in the Skincare section to discover your skin type and get personalized recommendations!'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
