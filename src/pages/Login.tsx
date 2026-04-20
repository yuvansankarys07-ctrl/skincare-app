import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../styles/login.css';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface GoogleCredentialResponse {
  credential: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    console.log('Attempting login with:', { email, password: '***' });
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        console.log('Response status:', response.status, 'Content-Type:', response.headers.get('content-type'));
        if (!response.ok) {
          console.error('Response not ok:', response.status);
          return response.text().then(text => {
            console.error('Error response body:', text);
            try {
              const data = JSON.parse(text);
              throw new Error(data.message || `Login failed (${response.status})`);
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
        console.error('Login error:', err);
        setError(err.message || 'Network error. Please try again.');
        setLoading(false);
      });
  };

  // Handle Google Login
  const handleGoogleSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    try {
      setLoading(true);
      setError('');

      // Decode JWT token from Google
      const decoded: {
        name?: string;
        email?: string;
        picture?: string;
        sub?: string;
      } = jwtDecode(credentialResponse.credential);

      const googleId = decoded.sub || '';
      const name = decoded.name || '';
      const userEmail = decoded.email || '';
      const profileImage = decoded.picture || '';

      if (!userEmail) {
        setError('Failed to retrieve email from Google account');
        setLoading(false);
        return;
      }

      console.log('Google login - sending to backend:', {
        email: userEmail,
        name,
        googleId,
        profileImage: profileImage ? 'present' : 'missing',
      });

      // Send to backend
      const response = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name,
          googleId,
          profileImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Google login failed (${response.status})`);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isLoggedIn', 'true');
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        console.log('Google login successful, navigating to dashboard');
        setLoading(false);
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        setError('No token received from server');
        setLoading(false);
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError(err instanceof Error ? err.message : 'Google login failed');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
    console.log('Google login error occurred');
  };

  const loginContent = (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">✨</div>
            <h1 className="login-title">GLOWIQ</h1>
            <p className="login-subtitle">Your Personal Beauty Intelligence</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="you@example.com"
                className="form-input"
                autoComplete="email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>
              </div>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="form-input"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="form-checkbox-group">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="rememberMe" className="checkbox-label">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider and Google Login */}
          {GOOGLE_CLIENT_ID && (
            <>
              <div className="divider">
                <span>or</span>
              </div>

              {/* Google Login Button */}
              <div className="google-login-container">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  width="100%"
                  text="signin"
                />
              </div>
            </>
          )}

          {/* Sign Up Link */}
          <p className="signup-prompt">
            Don't have an account? <Link to="/signup" className="signup-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );

  // Only wrap with GoogleOAuthProvider if GOOGLE_CLIENT_ID is configured
  return GOOGLE_CLIENT_ID ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {loginContent}
    </GoogleOAuthProvider>
  ) : (
    loginContent
  );
};

export default Login;
