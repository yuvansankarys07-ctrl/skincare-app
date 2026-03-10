import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
          state?: string;
          nonce?: string;
        }) => void;
        signIn: () => Promise<{
          authorization?: {
            id_token?: string;
          };
          user?: {
            name?: {
              firstName?: string;
              lastName?: string;
            };
            email?: string;
          };
        }>;
      };
    };
  }
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const navigate = useNavigate();

  const completeLogin = (data: { token?: string; user?: unknown; message?: string }) => {
    if (!data.token) {
      throw new Error(data.message || 'No token received from server');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('isLoggedIn', 'true');
    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
    }
    navigate('/dashboard', { replace: true });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
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

    // Make API call to backend
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
        completeLogin(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Login error:', err);
        setError(err.message || 'Network error. Please try again.');
        setLoading(false);
      });
  };

  const handleGoogleCredential = (credential: string) => {
    fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            throw new Error(data.message || 'Google sign-in failed');
          } catch {
            throw new Error(text || 'Google sign-in failed');
          }
        }
        return response.json();
      })
      .then((data) => {
        completeLogin(data);
      })
      .catch((err) => {
        setError(err.message || 'Google sign-in failed');
      })
      .finally(() => {
        setGoogleLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    setError('');
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Sign-In is not configured. Set VITE_GOOGLE_CLIENT_ID.');
      return;
    }

    if (!window.google?.accounts?.id) {
      setGoogleLoading(true);
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google?.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (!response.credential) {
              setGoogleLoading(false);
              setError('Google Sign-In was cancelled or failed.');
              return;
            }
            handleGoogleCredential(response.credential);
          },
        });
        window.google?.accounts.id.prompt();
      };
      script.onerror = () => {
        setGoogleLoading(false);
        setError('Unable to load Google Sign-In. Please try again.');
      };
      document.body.appendChild(script);
      return;
    }

    setGoogleLoading(true);
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (!response.credential) {
          setGoogleLoading(false);
          setError('Google Sign-In was cancelled or failed.');
          return;
        }
        handleGoogleCredential(response.credential);
      },
    });
    window.google.accounts.id.prompt();
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    alert('Password reset link would be sent to your email');
  };

  const handleAppleLogin = () => {
    setError('');
    if (!APPLE_CLIENT_ID || !APPLE_REDIRECT_URI) {
      setError('Apple Sign-In is not configured. Set VITE_APPLE_CLIENT_ID and VITE_APPLE_REDIRECT_URI.');
      return;
    }

    const runAppleSignIn = () => {
      setAppleLoading(true);
      window.AppleID?.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: APPLE_REDIRECT_URI,
        usePopup: true,
      });

      window.AppleID?.auth.signIn()
        .then((response) => {
          const idToken = response.authorization?.id_token;
          if (!idToken) {
            throw new Error('Apple Sign-In did not return a token');
          }

          const firstName = response.user?.name?.firstName || '';
          const lastName = response.user?.name?.lastName || '';
          const fullName = `${firstName} ${lastName}`.trim();
          const appleEmail = response.user?.email;

          return fetch(`${API_BASE_URL}/api/auth/apple`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken,
              name: fullName || undefined,
              email: appleEmail || undefined,
            }),
          });
        })
        .then(async (response) => {
          if (!response.ok) {
            const text = await response.text();
            try {
              const data = JSON.parse(text);
              throw new Error(data.message || 'Apple sign-in failed');
            } catch {
              throw new Error(text || 'Apple sign-in failed');
            }
          }
          return response.json();
        })
        .then((data) => {
          completeLogin(data);
        })
        .catch((err) => {
          setError(err.message || 'Apple sign-in failed');
        })
        .finally(() => {
          setAppleLoading(false);
        });
    };

    if (!window.AppleID?.auth) {
      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.async = true;
      script.defer = true;
      script.onload = runAppleSignIn;
      script.onerror = () => setError('Unable to load Apple Sign-In. Please try again.');
      document.body.appendChild(script);
      return;
    }

    runAppleSignIn();
  };

  return (
    <div className="login-wrapper">
      {/* Decorative background elements - skincare inspired curves */}
      <div className="accent-blob accent-blob-1"></div>
      <div className="accent-blob accent-blob-2"></div>
      <div className="accent-line accent-line-1"></div>
      <div className="accent-line accent-line-2"></div>

      <div className="login-card">
        {/* Logo and Branding */}
        <div className="logo-section">
          <div className="logo-mark">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Skincare drop logo */}
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stopColor="#C8A882" />
                  <stop offset="100%" stopColor="#D4B5A0" />
                </linearGradient>
              </defs>
              {/* Main drop shape */}
              <path d="M24 8C24 8 18 16 18 24C18 32.8366 20.6863 36 24 36C27.3137 36 30 32.8366 30 24C30 16 24 8 24 8Z" fill="url(#logoGrad)" />
              {/* Inner highlight */}
              <circle cx="24" cy="18" r="3" fill="#F5E6D3" opacity="0.8" />
            </svg>
          </div>
          <h1 className="brand-name">GlowIQ</h1>
          <p className="brand-tagline">Smarter skin & hair care starts here</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="form-input-wrapper">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="your.email@example.com"
                className="form-input"
              />
              <svg className="form-input-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M2 4h16v12H2V4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M2 4l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password" className="form-label">Password</label>
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="forgot-password-btn"
              >
                Forgot?
              </button>
            </div>
            <div className="form-input-wrapper">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="form-input"
              />
              <svg className="form-input-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 3C5.5 3 1.73 6.11 1 10.5c.73 4.39 4.5 7.5 9 7.5s8.27-3.11 9-7.5c-.73-4.39-4.5-7.5-9-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-box">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Primary Button */}
          <button 
            type="submit" 
            className={`btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                <span>Signing in...</span>
              </>
            ) : (
              'Log in'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider-section">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="social-login-group">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn-social btn-google"
            title="Continue with Google"
            disabled={googleLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>{googleLoading ? 'Connecting...' : 'Google'}</span>
          </button>

          <button
            type="button"
            onClick={handleAppleLogin}
            className="btn-social btn-apple"
            title="Continue with Apple"
            disabled={appleLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 13.5c-.91 2.18-.39 4.18 1.64 5.77-1.29 1.01-3.3.73-4.51-.67-1.43 1.43-3.2 1.43-4.63 0-1.21 1.4-3.22 1.68-4.51.67 2.03-1.59 2.55-3.59 1.64-5.77-1.45-3.61.3-6.78 3.48-7.73 3.18-.95 6.53.78 7.38 4.01.85-3.23 4.2-4.96 7.38-4.01 3.18.95 4.93 4.12 3.48 7.73z"/>
            </svg>
            <span>{appleLoading ? 'Connecting...' : 'Apple'}</span>
          </button>
        </div>

        {/* Footer CTA */}
        <p className="footer-text">
          Don't have an account? <Link to="/signup" className="link-signup">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
