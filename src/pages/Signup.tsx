import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/signup.css';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    skinType: '',
    agreeTerms: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setError('');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.firstName.trim()) {
      setError('First name is required');
      setLoading(false);
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!formData.skinType) {
      setError('Please select your skin type');
      setLoading(false);
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      setLoading(false);
      return;
    }

    // Make API call to backend
    const name = `${formData.firstName} ${formData.lastName}`;
    console.log('Attempting signup with:', { name, email: formData.email, password: '***' });
    
    fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email: formData.email, password: formData.password }),
    })
      .then(response => {
        console.log('Response status:', response.status, 'Content-Type:', response.headers.get('content-type'));
        if (!response.ok) {
          console.error('Response not ok:', response.status);
          return response.text().then(text => {
            console.error('Error response body:', text);
            try {
              const data = JSON.parse(text);
              throw new Error(data.message || `Registration failed (${response.status})`);
            } catch {
              throw new Error(`Server error: ${response.status} ${text}`);
            }
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', JSON.stringify(data));
        if (data.token) {
          console.log('Token received, saving to localStorage');
          localStorage.setItem('token', data.token);
          localStorage.setItem('isLoggedIn', 'true');
          if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
          }
          console.log('Token saved, navigating to dashboard');
          setLoading(false);
          // Use setTimeout to ensure state is updated before navigation
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
        } else {
          console.error('No token in response:', data);
          setError(data.message || 'No token received from server');
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Signup error:', err);
        setError(err.message || 'Network error. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div className="signup-container">
      {/* Decorative background elements */}
      <div className="glow-shape glow-1"></div>
      <div className="glow-shape glow-2"></div>
      <div className="glow-shape glow-3"></div>

      <div className="signup-card">
        {/* Logo and Branding */}
        <div className="logo-section">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="url(#gradient)" strokeWidth="2" />
              <circle cx="20" cy="20" r="12" fill="url(#gradient)" opacity="0.2" />
              <circle cx="20" cy="20" r="6" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#D4A574" />
                  <stop offset="100%" stopColor="#E8B4A8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="brand-name">GlowIQ</h1>
          <p className="tagline">Join our skincare community</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="signup-form">
          {/* First Name Input */}
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <div className="input-wrapper">
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="form-input"
              />
            </div>
          </div>

          {/* Last Name Input */}
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <div className="input-wrapper">
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="form-input"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                className="form-input"
              />
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 4h16v12H2V4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M2 4l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Skin Type Select */}
          <div className="form-group">
            <label htmlFor="skinType" className="form-label">Skin Type</label>
            <div className="input-wrapper">
              <select
                id="skinType"
                name="skinType"
                value={formData.skinType}
                onChange={handleChange}
                className="form-input form-select"
              >
                <option value="">Select your skin type</option>
                <option value="oily">Oily</option>
                <option value="dry">Dry</option>
                <option value="combination">Combination</option>
                <option value="sensitive">Sensitive</option>
                <option value="normal">Normal</option>
              </select>
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
              />
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3C5.5 3 1.73 6.11 1 10.5c.73 4.39 4.5 7.5 9 7.5s8.27-3.11 9-7.5c-.73-4.39-4.5-7.5-9-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
              />
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3C5.5 3 1.73 6.11 1 10.5c.73 4.39 4.5 7.5 9 7.5s8.27-3.11 9-7.5c-.73-4.39-4.5-7.5-9-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="checkbox-group">
            <input
              id="agreeTerms"
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="agreeTerms" className="checkbox-label">
              I agree to the <a href="#terms" className="terms-link">Terms & Conditions</a> and <a href="#privacy" className="terms-link">Privacy Policy</a>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              {error}
            </div>
          )}

          {/* Primary Signup Button */}
          <button
            type="submit"
            className={`primary-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Text */}
        <p className="footer-text">
          Already have an account? <Link to="/login" className="login-link">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
