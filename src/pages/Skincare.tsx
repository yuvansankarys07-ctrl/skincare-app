import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/skincare-new.css';

type SkinType = 'Oily' | 'Dry' | 'Normal' | 'Combination' | 'Sensitive';
type Screen = 'welcome' | 'quiz' | 'result';

const QUESTIONS = [
  {
    id: 1,
    text: 'How does your skin feel a few hours after washing?',
    emoji: '💧',
    options: [
      { label: 'Oily & shiny', icon: '✨' },
      { label: 'Tight or dry', icon: '🏜️' },
      { label: 'Balanced & comfortable', icon: '☀️' },
      { label: 'Oily in T-zone, dry elsewhere', icon: '⚖️' },
      { label: 'Irritated / sensitive', icon: '🔴' },
    ],
  },
  {
    id: 2,
    text: 'How do your pores usually look?',
    emoji: '🔍',
    options: [
      { label: 'Large & visible', icon: '◯' },
      { label: 'Small & barely visible', icon: '·' },
      { label: 'Visible only in some areas', icon: '○' },
      { label: 'Not sure', icon: '?' },
    ],
  },
  {
    id: 3,
    text: 'How often does your skin get oily?',
    emoji: '🛢️',
    options: [
      { label: 'Very often', icon: '⚡' },
      { label: 'Rarely', icon: '😌' },
      { label: 'Only in certain areas', icon: '📍' },
      { label: 'Almost never', icon: '✓' },
    ],
  },
  {
    id: 4,
    text: 'How does your skin react to new products?',
    emoji: '🧪',
    options: [
      { label: 'No problem', icon: '👍' },
      { label: 'Sometimes breaks out', icon: '⚠️' },
      { label: 'Gets irritated / red', icon: '🔥' },
      { label: 'Depends on product', icon: '🤔' },
    ],
  },
  {
    id: 5,
    text: 'What is your biggest skin concern?',
    emoji: '🎯',
    options: [
      { label: 'Acne / pimples', icon: '💢' },
      { label: 'Dryness / flakes', icon: '🍂' },
      { label: 'Excess oil', icon: '🌊' },
      { label: 'Redness / sensitivity', icon: '❤️' },
      { label: 'Dullness', icon: '⭐' },
    ],
  },
];

const ROUTINES: Record<SkinType, Record<'morning' | 'night', string[]>> = {
  Oily: {
    morning: ['Gel or foaming cleanser', 'Hydrating toner', 'Niacinamide serum', 'Lightweight gel moisturizer', 'SPF 30+ sunscreen'],
    night: ['Gel or foaming cleanser', 'Vitamin C serum', 'Lightweight gel moisturizer'],
  },
  Dry: {
    morning: ['Hydrating cleanser', 'Hydrating toner', 'Hyaluronic acid serum', 'Rich moisturizer', 'SPF 30+ sunscreen'],
    night: ['Hydrating cleanser', 'Rich moisturizer or sleeping mask'],
  },
  Normal: {
    morning: ['Gentle cleanser', 'Hydrating toner', 'Vitamin C serum', 'Balanced moisturizer', 'SPF 30+ sunscreen'],
    night: ['Gentle cleanser', 'Balanced moisturizer'],
  },
  Combination: {
    morning: ['Gentle cleanser', 'Hydrating toner', 'Niacinamide serum', 'Balanced moisturizer', 'SPF 30+ sunscreen'],
    night: ['Gentle cleanser', 'Vitamin C serum', 'Balanced moisturizer'],
  },
  Sensitive: {
    morning: ['Gentle cleanser', 'Soothing serum', 'Rich moisturizer', 'SPF 30+ sunscreen'],
    night: ['Gentle cleanser', 'Rich moisturizer', 'Gentle eye cream'],
  },
};

const SKIN_TIPS: Record<SkinType, string[]> = {
  Oily: ['Use gel or foaming cleanser', 'Oil-free moisturizer', 'Salicylic acid / niacinamide', 'Exfoliate 2-3x weekly'],
  Dry: ['Use hydrating cleanser', 'Hyaluronic acid serum', 'Rich moisturizer', 'Avoid harsh products'],
  Normal: ['Maintain consistent routine', 'Gentle hydration', 'Use SPF daily', 'Simple is best'],
  Combination: ['Cleanse gently', 'Balance hydration', 'Treat T-zone separately', 'Use targeted treatments'],
  Sensitive: ['Fragrance-free products', 'Soothing ingredients', 'Avoid harsh acids', 'Patch test new products'],
};

const Skincare = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [loading, setLoading] = useState(false);

  // Load saved results on component mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('skinProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setSkinType(profile.result);
        setAnswers(profile.answers || []);
        setScreen('result');
      }
    } catch (e) {
      console.error('Error loading saved skin profile:', e);
    }
  }, []);

  const handleStartQuiz = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setScreen('quiz');
  };

  const calculateSkinType = (answers: string[]): SkinType => {
    const scores: Record<SkinType, number> = {
      Oily: 0,
      Dry: 0,
      Normal: 0,
      Combination: 0,
      Sensitive: 0,
    };

    // Q1
    const q1 = answers[0]?.toLowerCase() || '';
    if (q1.includes('oily') && !q1.includes('t-zone')) scores.Oily += 2;
    if (q1.includes('tight') || q1.includes('dry')) scores.Dry += 2;
    if (q1.includes('balanced')) scores.Normal += 2;
    if (q1.includes('t-zone')) scores.Combination += 2;
    if (q1.includes('irritated')) scores.Sensitive += 2;

    // Q2
    const q2 = answers[1]?.toLowerCase() || '';
    if (q2.includes('large')) scores.Oily++;
    if (q2.includes('small')) scores.Dry++;
    if (q2.includes('visible only')) scores.Combination++;

    // Q3
    const q3 = answers[2]?.toLowerCase() || '';
    if (q3.includes('very often')) scores.Oily++;
    if (q3.includes('rarely')) scores.Dry++;
    if (q3.includes('only in certain')) scores.Combination++;

    // Q4
    const q4 = answers[3]?.toLowerCase() || '';
    if (q4.includes('no problem')) scores.Normal++;
    if (q4.includes('breaks out')) scores.Oily++;
    if (q4.includes('irritated') || q4.includes('red')) scores.Sensitive += 2;

    // Q5
    const q5 = answers[4]?.toLowerCase() || '';
    if (q5.includes('acne') || q5.includes('pimples')) scores.Oily++;
    if (q5.includes('dryness') || q5.includes('flakes')) scores.Dry += 2;
    if (q5.includes('oil')) scores.Oily++;
    if (q5.includes('redness') || q5.includes('sensitivity')) scores.Sensitive += 2;

    const result = Object.entries(scores).reduce<SkinType>((prev, [type, score]) => {
      const prevScore = scores[prev as SkinType] || 0;
      return score > prevScore ? (type as SkinType) : prev;
    }, 'Normal' as SkinType);

    return result;
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (newAnswers.length === QUESTIONS.length) {
      setLoading(true);
      setTimeout(() => {
        const type = calculateSkinType(newAnswers);
        setSkinType(type);
        
        // Save results to localStorage
        const skinProfile = {
          answers: newAnswers,
          result: type,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('skinProfile', JSON.stringify(skinProfile));
        
        // Also update userData if it exists
        try {
          const existingUserData = localStorage.getItem('userData');
          if (existingUserData) {
            const userData = JSON.parse(existingUserData);
            userData.skinType = type;
            userData.skinProfile = skinProfile;
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        } catch (e) {
          console.error('Error updating userData:', e);
        }
        
        setLoading(false);
        setScreen('result');
      }, 900);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRetake = () => {
    setScreen('welcome');
    setAnswers([]);
    setCurrentIndex(0);
    setSkinType(null);
    // Clear saved results for retake
    localStorage.removeItem('skinProfile');
  };

  if (screen === 'welcome') {
    return (
      <div className="skincare-landing">
        {/* Navigation */}
        <nav className="skincare-nav">
          <div className="nav-container">
            <div className="nav-logo">
              <div className="logo-icon">✨</div>
              <span className="logo-text">GLOWIQ</span>
            </div>
            <div className="nav-links">
              <button onClick={() => navigate('/dashboard')} className="nav-link active">Home</button>
              <button onClick={() => navigate('/onboarding/skincare')} className="nav-link">Style Quiz</button>
              <button onClick={() => navigate('/onboarding/skincare')} className="nav-link">My Results</button>
              <button className="nav-link">Profile</button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-container">
          <div className="hero-content">
            {/* Badge */}
            <div className="ai-badge">
              <span className="badge-icon">✨</span>
              <span className="badge-text">AI-Powered Beauty Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              Discover Your<br />
              <span className="highlight">Perfect Glow</span>
            </h1>

            {/* Description */}
            <p className="hero-description">
              Unlock personalized skincare routines, color palettes that complement your tone, outfit styles that enhance your look, and hairstyles crafted for your unique features.
            </p>

            {/* CTA Buttons */}
            <div className="cta-buttons">
              <button 
                onClick={handleStartQuiz}
                className="btn-primary"
              >
                Take the Quiz 
                <span className="btn-arrow">→</span>
              </button>
              <button 
                onClick={() => navigate('/skincare')}
                className="btn-secondary"
              >
                View My Results
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image">
            <div className="image-placeholder">
              <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
                {/* Skincare/Beauty illustration */}
                <defs>
                  <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E8D5C4" />
                    <stop offset="100%" stopColor="#D4A574" />
                  </linearGradient>
                  <linearGradient id="maskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C8A882" />
                    <stop offset="100%" stopColor="#B89968" />
                  </linearGradient>
                </defs>
                
                {/* Face outline */}
                <path d="M 200 50 Q 300 80 300 180 L 300 380 Q 200 420 100 380 L 100 180 Q 100 80 200 50 Z" fill="url(#skinGrad)" />
                
                {/* Mask texture */}
                <rect x="120" y="120" width="160" height="200" fill="url(#maskGrad)" opacity="0.8" rx="20" />
                
                {/* Highlights */}
                <circle cx="160" cy="150" r="30" fill="#F5E6D3" opacity="0.6" />
                <circle cx="240" cy="170" r="25" fill="#FFF8F0" opacity="0.5" />
                
                {/* Hair */}
                <path d="M 100 180 Q 80 150 100 80 Q 150 40 200 40 Q 250 40 300 80 Q 320 150 300 180" fill="#2C1810" />
              </svg>
            </div>
            <div className="glow-score">
              <span className="score-icon">✨</span>
              <span className="score-label">Your Glow Score</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (screen === 'quiz') {
    const question = QUESTIONS[currentIndex];
    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="quiz-container">
        {/* Header */}
        <header className="quiz-header">
          <button onClick={handleRetake} className="back-btn">
            ← Back
          </button>
          <div className="progress-info">
            <span className="question-counter">Question {currentIndex + 1}/{QUESTIONS.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </header>

        {/* Quiz Content */}
        <div className="quiz-content">
          <div className="quiz-card">
            <div className="question-emoji">{question.emoji}</div>
            
            <h2 className="question-title">{question.text}</h2>
            <p className="question-subtitle">Select the option that best describes you</p>

            <div className="options-grid">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option.label)}
                  className="option-card"
                  title={option.label}
                >
                  <span className="option-number">{idx + 1}</span>
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>

            <div className="quiz-footer">
              <span className="quiz-tip">💡 There's no wrong answer</span>
              <span className="progress-percent">{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'result' && skinType) {
    const routine = ROUTINES[skinType];
    const tips = SKIN_TIPS[skinType];

    const skinEmojis: Record<SkinType, string> = {
      Oily: '🌊', Dry: '🏜️', Normal: '💫', Combination: '⚖️', Sensitive: '🌸',
    };

    const skinDescriptions: Record<SkinType, string> = {
      Oily: 'Your skin produces excess sebum. With the right routine, you can control shine and achieve a healthy, balanced glow.',
      Dry: 'Your skin needs extra moisture and nourishment. A gentle hydrating routine will keep you luminous all day.',
      Normal: 'Lucky you — your skin is naturally balanced. A simple consistent routine is all you need to maintain your natural radiance.',
      Combination: 'You have an oily T-zone with drier cheeks. Targeted care for each zone will give you the best results.',
      Sensitive: 'Your skin reacts easily and needs gentle, soothing care. Fragrance-free and calming products are your best friends.',
    };

    if (loading) {
      return (
        <div className="result-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(31,21,19,0.12)' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✨</div>
            <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1F1513' }}>Analyzing your skin…</p>
            <p style={{ fontSize: '14px', color: '#8B7355' }}>Building your personalized routine</p>
            <div style={{ marginTop: '24px', height: '4px', background: '#E8DDD2', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '66%', background: 'linear-gradient(90deg, #A08070 0%, #D4B5A0 100%)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="result-container">
        <div className="result-header">
          <button className="result-back" onClick={handleRetake}>←</button>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F1513', flex: 1 }}>Your Personalized Results</h2>
          <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', fontSize: '13px' }}>
            Done
          </button>
        </div>

        <div className="result-content">
          {/* Hero Section */}
          <div className="result-hero">
            <div className="skin-type-emoji">{skinEmojis[skinType]}</div>
            <h1 className="skin-type-name">{skinType} Skin</h1>
            <p className="skin-type-description">{skinDescriptions[skinType]}</p>
          </div>

          {/* Routine Sections */}
          <div className="result-sections">
            {/* Morning Routine */}
            <div className="result-section">
              <div className="result-section-title">🌞 Morning Routine</div>
              <div className="result-items">
                {routine.morning.map((item, idx) => (
                  <div key={idx} className="result-item">
                    <span className="result-item-icon">{idx + 1}️⃣</span>
                    <span className="result-item-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Night Routine */}
            <div className="result-section">
              <div className="result-section-title">🌙 Night Routine</div>
              <div className="result-items">
                {routine.night.map((item, idx) => (
                  <div key={idx} className="result-item">
                    <span className="result-item-icon">{idx + 1}️⃣</span>
                    <span className="result-item-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="result-section" style={{ marginBottom: '30px' }}>
            <div className="result-section-title">💡 Key Tips for Your Skin</div>
            <div className="result-items">
              {tips.map((tip, idx) => (
                <div key={idx} className="result-item">
                  <span className="result-item-icon">✓</span>
                  <span className="result-item-text">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="result-cta">
            <button className="cta-retake" onClick={handleRetake}>
              Retake Quiz
            </button>
            <button className="cta-dashboard" onClick={() => navigate('/dashboard')}>
              Back to Dashboard →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Skincare;
