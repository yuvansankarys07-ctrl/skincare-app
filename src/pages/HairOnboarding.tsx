import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hair-onboarding-new.css';

type HairAnswers = {
  hairType?: string;
  scalpType?: string;
  concerns?: string[];
  lengthDensity?: string[];
  washFreq?: string;
  heatStyling?: string;
  lifestyle?: string;
  commitment?: string;
};

type HairScreen = 'welcome' | 'quiz' | 'result';
type HairQuestion = 'hairType' | 'scalpType' | 'concerns' | 'lengthDensity' | 'washFreq' | 'heatStyling' | 'lifestyle' | 'commitment';

const HAIR_QUESTIONS: Array<{ id: HairQuestion; title: string; emoji: string; options: Array<{ label: string; icon: string }> }> = [
  {
    id: 'hairType',
    title: 'How would you describe your hair?',
    emoji: '💇',
    options: [
      { label: 'Straight', icon: '→' },
      { label: 'Wavy', icon: '∿' },
      { label: 'Curly', icon: '◎' },
      { label: 'Coily', icon: '◉' },
      { label: 'Not sure', icon: '?' },
    ],
  },
  {
    id: 'scalpType',
    title: 'How does your scalp usually feel?',
    emoji: '🧴',
    options: [
      { label: 'Oily', icon: '💧' },
      { label: 'Dry', icon: '🏜️' },
      { label: 'Balanced', icon: '⚖️' },
      { label: 'Flaky/itchy', icon: '🔴' },
      { label: 'Not sure', icon: '?' },
    ],
  },
  {
    id: 'washFreq',
    title: 'How often do you wash your hair?',
    emoji: '🚿',
    options: [
      { label: 'Daily', icon: '⚡' },
      { label: 'Every 2-3 days', icon: '📅' },
      { label: 'Twice a week', icon: '✌️' },
      { label: 'Once a week', icon: '☀️' },
      { label: 'Irregular', icon: '❓' },
    ],
  },
  {
    id: 'heatStyling',
    title: 'How often do you use heat or styling products?',
    emoji: '🔥',
    options: [
      { label: 'Frequently', icon: '🌡️' },
      { label: 'Occasionally', icon: '📍' },
      { label: 'Rarely', icon: '🌿' },
      { label: 'Never', icon: '✓' },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Your daily lifestyle looks more like…',
    emoji: '🌍',
    options: [
      { label: 'Active/outdoor', icon: '⛰️' },
      { label: 'Balanced', icon: '☀️' },
      { label: 'Mostly indoors', icon: '🏠' },
    ],
  },
];

type HairType = 'Straight' | 'Wavy' | 'Curly' | 'Coily' | 'Not sure';

const HAIR_EMOJIS: Record<HairType, string> = {
  Straight: '→',
  Wavy: '∿',
  Curly: '◎',
  Coily: '◉',
  'Not sure': '❓',
};

const HAIR_DESCRIPTIONS: Record<HairType, string> = {
  Straight: 'Your straight hair benefits from moisture balance and regular conditioning. Maintain your natural shine with the right products.',
  Wavy: 'Wavy hair thrives with hydration and definition. Use leave-in conditioner and avoid products that enhance frizz.',
  Curly: 'Curly hair needs moisture and definition. Deep conditioning and curl-enhancing products are your best friends.',
  Coily: 'Coily hair requires rich moisture and gentle handling. Regular deep conditioning helps maintain strength and bounce.',
  'Not sure': 'Start with a gentle routine and adjust based on how your hair responds. Every hair is unique.',
};

function detectHairType(answer: string): HairType {
  const lower = (answer || '').toLowerCase();
  if (lower.includes('straight')) return 'Straight';
  if (lower.includes('wavy')) return 'Wavy';
  if (lower.includes('curly')) return 'Curly';
  if (lower.includes('coily')) return 'Coily';
  return 'Not sure';
}

function generateHairRoutine(answers: HairAnswers) {
  const hairType = detectHairType(answers.hairType || '');
  const concerns = answers.concerns || [];

  const HAIR_ROUTINES: Record<HairType, { morning: string[]; night: string[] }> = {
    Straight: {
      morning: [
        'Gentle cleanser for daily wash',
        'Lightweight conditioner',
        'Leave-in conditioner (optional)',
        'Smoothing serum or oil',
      ],
      night: [
        'Gentle cleanse if needed',
        'Deep conditioning mask (1-2x weekly)',
        'Silk pillowcase for protection',
      ],
    },
    Wavy: {
      morning: [
        'Sulfate-free shampoo',
        'Hydrating conditioner',
        'Wave-defining cream or gel',
        'Microfiber towel for drying',
      ],
      night: [
        'Gentle rinse or co-wash',
        'Leave-in conditioner',
        'Deep moisture mask (1-2x weekly)',
      ],
    },
    Curly: {
      morning: [
        'Co-wash or sulfate-free shampoo',
        'Rich moisturizing conditioner',
        'Curl-defining cream or gel',
        'Plopping or microfiber towel',
      ],
      night: [
        'Hydrating conditioner',
        'Leave-in conditioner',
        'Deep conditioning treatment (weekly)',
      ],
    },
    Coily: {
      morning: [
        'Gentle cleansing with conditioner',
        'Rich hydrating conditioner',
        'Coil cream or butter',
        'Moisturizing leave-in spray',
      ],
      night: [
        'Deep conditioning treatment',
        'Moisturizing oil or cream',
        'Protective styling (long-term)',
        'Weekly deep moisture mask',
      ],
    },
    'Not sure': {
      morning: [
        'Start with a gentle sulfate-free cleanser',
        'Light hydrating conditioner',
        'Observe how your hair responds',
        'Adjust products as needed',
      ],
      night: ['Gentle care based on your hair response', 'Monthly deep treatment'],
    },
  };

  const routine = HAIR_ROUTINES[hairType];

  return {
    hairType,
    scalpType: answers.scalpType || 'Not specified',
    summary: {
      topConcerns: concerns,
      washFreq: answers.washFreq || 'Not specified',
      lifestyle: answers.lifestyle || 'Not specified',
    },
    routine: routine.morning,
    weekly: routine.night,
    note: 'This routine provides general hair care guidance and is not medical advice.',
  };
}

const HairOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<HairScreen>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<HairAnswers>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleStartQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setScreen('quiz');
  };

  const handleAnswerSelect = (questionId: HairQuestion, answer: string) => {
    if (['concerns', 'lengthDensity'].includes(questionId)) {
      setAnswers(a => {
        const list = new Set((a[questionId] as string[]) || []);
        if (list.has(answer)) list.delete(answer);
        else list.add(answer);
        return { ...a, [questionId]: Array.from(list) };
      });
      return;
    }

    setAnswers(a => ({ ...a, [questionId]: answer }));

    if (currentIndex < HAIR_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All questions answered - generate result
      setLoading(true);
      setTimeout(() => {
        const newAnswers = { ...answers, [questionId]: answer };
        const generatedResult = generateHairRoutine(newAnswers);
        setResult(generatedResult);
        setLoading(false);
        setScreen('result');
      }, 900);
    }
  };

  const handleRetake = () => {
    setScreen('welcome');
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  const handleSave = async () => {
    try {
      const existing = localStorage.getItem('userData');
      const prev = existing ? JSON.parse(existing) : {};
      const payload = { ...prev, hairProfile: { answers, result } };
      localStorage.setItem('userData', JSON.stringify(payload));
      
      // Save to backend database
      const token = localStorage.getItem('token');
      if (token && result) {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
          const response = await fetch(`${API_BASE_URL}/api/auth/quiz/hair`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              hairType: result.hairType || '',
              scalpType: result.scalpType || '',
              hairProfile: { answers, result },
              hairQuiz: answers
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Hair quiz saved to database:', data);
          } else {
            console.error('Failed to save hair quiz to database');
          }
        } catch (apiError) {
          console.error('API error saving hair quiz:', apiError);
        }
      }
    } catch (e) {
      localStorage.setItem('userData', JSON.stringify({ hairProfile: { answers, result } }));
    }
    navigate('/haircare');
  };

  if (screen === 'welcome') {
    return (
      <div className="hair-landing">
        <nav className="hair-nav">
          <div className="hair-nav-container">
            <div className="hair-nav-logo">
              <span>💇</span>
              <span>GLOWIQ</span>
            </div>
            <div className="hair-nav-links">
              <button onClick={() => navigate('/dashboard')} className="hair-nav-link active">Home</button>
              <button onClick={() => navigate('/onboarding/hair')} className="hair-nav-link">Hair Quiz</button>
              <button onClick={() => navigate('/onboarding/hair')} className="hair-nav-link">My Results</button>
              <button onClick={() => navigate('/profile/hair')} className="hair-nav-link">Profile</button>
            </div>
          </div>
        </nav>

        <section className="hair-hero-container">
          <div className="hair-hero-content">
            <div className="hair-badge">
              <span>✨</span>
              <span>AI-Powered Hair Intelligence</span>
            </div>

            <h1 className="hair-hero-title">
              Discover Your<br />
              <span className="highlight">Perfect Hair Care</span>
            </h1>

            <p className="hair-hero-description">
              Unlock a personalized hair care routine designed specifically for your hair type, scalp condition, and lifestyle needs.
            </p>

            <div className="hair-cta-buttons">
              <button onClick={handleStartQuiz} className="hair-btn-primary">
                Take the Quiz <span>→</span>
              </button>
              <button onClick={() => navigate('/haircare')} className="hair-btn-secondary">
                View My Results
              </button>
            </div>
          </div>

          <div className="hair-hero-image">
            <div className="hair-image-placeholder">
              <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2C1810" />
                    <stop offset="100%" stopColor="#1A0F0A" />
                  </linearGradient>
                </defs>
                <path
                  d="M 150 80 Q 100 100 90 160 L 85 300 Q 85 380 200 400 Q 315 380 315 300 L 310 160 Q 300 100 250 80 Q 220 60 200 60 Q 180 60 150 80 Z"
                  fill="url(#hairGrad)"
                />
                <circle cx="170" cy="180" r="20" fill="#D4A574" opacity="0.6" />
                <circle cx="230" cy="190" r="18" fill="#D4A574" opacity="0.5" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (screen === 'quiz') {
    const question = HAIR_QUESTIONS[currentIndex];
    const progress = ((currentIndex + 1) / HAIR_QUESTIONS.length) * 100;

    return (
      <div className="hair-quiz-container">
        <header className="hair-quiz-header">
          <button onClick={handleRetake} className="hair-back-btn">←</button>
          <div className="hair-progress-info">
            <span className="hair-question-counter">Question {currentIndex + 1}/{HAIR_QUESTIONS.length}</span>
            <div className="hair-progress-bar">
              <div className="hair-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </header>

        <div className="hair-quiz-content">
          <div className="hair-quiz-card">
            <div className="hair-question-emoji">{question.emoji}</div>
            <h2 className="hair-question-title">{question.title}</h2>
            <p className="hair-question-subtitle">Select the option that best describes you</p>

            <div className="hair-options-grid">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(question.id, option.label)}
                  className="hair-option-card"
                >
                  <span className="hair-option-number">{idx + 1}</span>
                  <span className="hair-option-icon">{option.icon}</span>
                  <span className="hair-option-label">{option.label}</span>
                </button>
              ))}
            </div>

            <div className="hair-quiz-footer">
              <span className="hair-quiz-tip">💡 There's no wrong answer</span>
              <span className="hair-progress-percent">{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'result' && result) {
    if (loading) {
      return (
        <div className="hair-result-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(31,21,19,0.12)' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✨</div>
            <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1F1513' }}>Analyzing your hair…</p>
            <p style={{ fontSize: '14px', color: '#8B7355' }}>Building your personalized routine</p>
          </div>
        </div>
      );
    }

    return (
      <div className="hair-result-container">
        <div className="hair-result-header">
          <button className="hair-result-back" onClick={handleRetake}>←</button>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F1513', flex: 1 }}>Your Hair Care Results</h2>
          <button className="hair-btn-primary" onClick={handleSave} style={{ padding: '10px 20px', fontSize: '13px' }}>
            Done
          </button>
        </div>

        <div className="hair-result-content">
          <div className="hair-result-hero">
            <div className="hair-type-emoji">{HAIR_EMOJIS[result.hairType as HairType]}</div>
            <h1 className="hair-type-name">{result.hairType}</h1>
            <p className="hair-type-description">{HAIR_DESCRIPTIONS[result.hairType as HairType]}</p>
          </div>

          <div className="hair-result-sections">
            <div className="hair-result-section">
              <div className="hair-result-section-title">🌞 Morning Routine</div>
              <div className="hair-result-items">
                {result.routine.map((item: string, idx: number) => (
                  <div key={idx} className="hair-result-item">
                    <span className="hair-result-item-icon">{idx + 1}️⃣</span>
                    <span className="hair-result-item-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hair-result-section">
              <div className="hair-result-section-title">🌙 Night Routine</div>
              <div className="hair-result-items">
                {result.weekly.map((item: string, idx: number) => (
                  <div key={idx} className="hair-result-item">
                    <span className="hair-result-item-icon">{idx + 1}️⃣</span>
                    <span className="hair-result-item-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hair-result-cta">
            <button className="cta-retake" onClick={handleRetake}>
              Retake Quiz
            </button>
            <button className="cta-save" onClick={handleSave}>
              Save & Continue →
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#8B7355', marginTop: '24px' }}>
            {result.note}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default HairOnboarding;
