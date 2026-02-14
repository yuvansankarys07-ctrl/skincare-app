import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/skincare.css';

type RoutineTab = 'morning' | 'night' | 'weekly';

interface RoutineData {
  skinType: string;
  summary: {
    skinFeel: string;
    topConcerns: string[];
    lifestyle: string;
    sun: string;
  };
  morning: string[];
  night: string[];
  weekly: string[];
  note: string;
}

const ROUTINE_DESCRIPTIONS: Record<string, string> = {
  'Cleanser': 'Removes oil, dirt, and impurities without stripping your skin.',
  'Cream/hydrating cleanser': 'Gentle, nourishing formula perfect for dry skin.',
  'Gel or foaming cleanser': 'Lightweight cleanser that effectively removes excess oil.',
  'Gentle balanced cleanser': 'Effective yet gentle for all skin types.',
  'Hydrating toner or essence': 'Prepares your skin for better serum and moisturizer absorption.',
  'Niacinamide serum (oil-balancing)': 'Minimizes pores and controls sebum production.',
  'Vitamin C serum (antioxidant)': 'Brightens skin and protects against environmental damage.',
  'Hyaluronic acid serum': 'Deeply hydrates and plumps the skin.',
  'Soothing serum (hyaluronic + calming ingredients)': 'Calms irritation and strengthens the skin barrier.',
  'Rich moisturizer': 'Intensive hydration for dry, thirsty skin.',
  'Lightweight gel moisturizer': 'Fast-absorbing hydration that won\'t clog pores.',
  'Balanced moisturizer': 'Comfortable hydration for normal skin.',
  'Broad-spectrum sunscreen (SPF 30+)': 'Essential daily protection against sun damage and aging.',
  'Light exfoliating treatment (e.g., BHA) — 2–3x weekly': 'Gently removes dead skin and unclogs pores.',
  'Gentle eye cream': 'Targets dark circles and fine lines with care.',
  'Targeted brightening serum (use as tolerated)': 'Evens skin tone and fades dark spots over time.',
  'Retinol or gentle retinoid (begin slowly)': 'Reduces fine lines and promotes skin renewal.',
  'Rich moisturizer or sleeping mask': 'Intensive overnight treatment for restoration.',
};

const SKIN_DESCRIPTIONS: Record<string, string> = {
  'Oily': 'Your skin produces more oil. A lightweight, oil-control focused routine helps balance sebum and keep your skin clear.',
  'Dry': 'Your skin needs extra hydration and barrier support. Our routine focuses on nourishing and protecting your delicate skin.',
  'Combination': 'Your skin has mixed needs. This routine balances hydration and oil control across different areas.',
  'Sensitive': 'Your skin reacts easily to products. Our gentle, minimal routine uses soothing ingredients to protect your barrier.',
  'Normal': 'Your skin is balanced and healthy. This maintenance routine keeps it protected and glowing.',
};

const LIFESTYLE_TIPS: Record<string, string[]> = {
  'Very busy & active': [
    'Keep a facial mist handy for quick hydration refreshes.',
    'Prioritize sunscreen — it\'s the most important step.',
    'Use a 2-in-1 cleanser to save time.',
    'Opt for lower stress through meditation or breathing exercises.',
  ],
  'Balanced & manageable': [
    'Stick to a consistent morning and night routine.',
    'Drink at least 8 glasses of water daily.',
    'Aim for 7–8 hours of quality sleep each night.',
    'Take breaks from screens to reduce skin stress.',
  ],
  'Relaxed / mostly indoors': [
    'Enjoy longer skincare rituals as self-care moments.',
    'Stay hydrated even though you\'re indoors.',
    'Remember: indoor light and screens still cause aging.',
    'Use this time to explore advanced treatments like masks.',
  ],
};

const DOS_AND_DONTS = {
  do: [
    'Clean your face before bed every night',
    'Use sunscreen daily, even on cloudy days',
    'Stay hydrated with plenty of water',
    'Get 7–8 hours of quality sleep',
    'Be consistent — results take 6–12 weeks',
  ],
  dont: [
    'Over-wash your face (max 2x daily)',
    'Mix too many actives (vitamin C + retinol, etc.)',
    'Skip moisturizer to "reduce oiliness"',
    'Use products that irritate your skin',
    'Expect overnight results from skincare',
  ],
};

const Skincare: React.FC = () => {
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [activeTab, setActiveTab] = useState<RoutineTab>('morning');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.skinProfile?.result) {
          setRoutine(parsed.skinProfile.result);
          // Initialize checklist
          const init: Record<string, boolean> = {};
          parsed.skinProfile.result.morning.forEach((s: string) => { init[`m-${s}`] = false; });
          parsed.skinProfile.result.night.forEach((s: string) => { init[`n-${s}`] = false; });
          setChecklist(init);
        }
      } catch (e) {
        console.error('Failed to load routine');
      }
    }
  }, []);

  const toggleCheck = (id: string) => {
    setChecklist(c => ({ ...c, [id]: !c[id] }));
  };

  const getSteps = (): string[] => {
    if (activeTab === 'morning') return routine?.morning || [];
    if (activeTab === 'night') return routine?.night || [];
    return routine?.weekly || [];
  };

  if (!routine) {
    return (
      <div className="skincare-loading">
        <p>Loading your personalized routine...</p>
      </div>
    );
  }

  const steps = getSteps();
  const completedCount = steps.filter(s => checklist[`${activeTab === 'morning' ? 'm' : activeTab === 'night' ? 'n' : 'w'}-${s}`]).length;
  const completionPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="skincare-root">
      {/* Hero / Skin Summary */}
      <section className="hero-section">
        <div className="hero-inner">
          <h1 className="hero-title">Your Skin Care Routine</h1>
          <p className="hero-sub">Based on your profile, a routine designed just for you.</p>

          <div className="skin-summary-card">
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-label">Skin Type</div>
                <div className="summary-value">{routine.skinType}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Lifestyle</div>
                <div className="summary-value">{routine.summary.lifestyle || 'Not specified'}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Sun Exposure</div>
                <div className="summary-value">{routine.summary.sun || 'Not specified'}</div>
              </div>
            </div>

            {routine.summary.topConcerns.length > 0 && (
              <div className="concerns-section">
                <div className="concerns-label">Key Concerns</div>
                <div className="concerns-tags">
                  {routine.summary.topConcerns.map(c => (
                    <span key={c} className="concern-tag">{c}</span>
                  ))}
                </div>
              </div>
            )}

            <p className="skin-type-note">{SKIN_DESCRIPTIONS[routine.skinType] || 'This routine is personalized for your skin.'}</p>
          </div>
        </div>
      </section>

      {/* Routine Tabs */}
      <section className="routine-section">
        <div className="routine-inner">
          <div className="tab-container">
            {(['morning', 'night', 'weekly'] as RoutineTab[]).map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'morning' && '☀️ Morning'}
                {tab === 'night' && '🌙 Night'}
                {tab === 'weekly' && '✨ Weekly'}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          {activeTab !== 'weekly' && (
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completionPercent}%` }} />
              </div>
              <span className="progress-text">{completionPercent}% Complete</span>
            </div>
          )}

          {/* Steps List */}
          <div className="steps-list">
            {steps.map((step, idx) => {
              const tabPrefix = activeTab === 'morning' ? 'm' : activeTab === 'night' ? 'n' : 'w';
              const stepId = `${tabPrefix}-${step}`;
              const isChecked = checklist[stepId] || false;
              const desc = ROUTINE_DESCRIPTIONS[step] || '';

              return (
                <div key={stepId} className={`step-item ${isChecked ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(stepId)}
                    className="step-checkbox"
                    id={stepId}
                  />
                  <label htmlFor={stepId} className="step-label">
                    <div className="step-nameandnum">
                      <span className="step-num">{idx + 1}</span>
                      <span className="step-name">{step}</span>
                    </div>
                    <p className="step-desc">{desc}</p>
                  </label>
                  {isChecked && <span className="check-mark">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Weekly Care Cards */}
      <section className="weekly-section">
        <div className="weekly-inner">
          <h2 className="section-title">Weekly Care</h2>
          <p className="section-sub">Enhance your routine with these weekly treatments.</p>

          <div className="weekly-cards">
            <div className="weekly-card">
              <div className="card-icon">🧖</div>
              <h3>Gentle Exfoliation</h3>
              <p className="card-freq">1–3 times per week</p>
              <p className="card-tip">Remove dead skin cells and allow better product absorption.</p>
            </div>

            <div className="weekly-card">
              <div className="card-icon">🎭</div>
              <h3>Face Mask</h3>
              <p className="card-freq">1–2 times per week</p>
              <p className="card-tip">Choose hydrating or clarifying based on your needs.</p>
            </div>

            <div className="weekly-card">
              <div className="card-icon">😌</div>
              <h3>Rest Day</h3>
              <p className="card-freq">1–2 times per week</p>
              <p className="card-tip">Use only cleanser and moisturizer to let skin recover.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Do's & Don'ts */}
      <section className="dos-donts-section">
        <div className="dos-donts-inner">
          <h2 className="section-title">Do's & Don'ts</h2>

          <div className="dos-donts-grid">
            <div className="dos-column">
              <h3 className="column-title">✓ Do</h3>
              <ul className="dos-list">
                {DOS_AND_DONTS.do.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="donts-column">
              <h3 className="column-title">✗ Don't</h3>
              <ul className="donts-list">
                {DOS_AND_DONTS.dont.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Tips */}
      <section className="tips-section">
        <div className="tips-inner">
          <h2 className="section-title">Lifestyle Tips</h2>
          <p className="section-sub">Skincare is just one part — these habits matter too.</p>

          <div className="tips-grid">
            {LIFESTYLE_TIPS[routine.summary.lifestyle] ? (
              LIFESTYLE_TIPS[routine.summary.lifestyle].map((tip, i) => (
                <div key={i} className="tip-card">
                  <span className="tip-icon">💡</span>
                  <p>{tip}</p>
                </div>
              ))
            ) : (
              <p className="no-tips">General skincare tips coming soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="footer-section">
        <div className="footer-inner">
          <p className="footer-message">Healthy skin is built with consistency, not perfection.</p>

          <div className="footer-ctas">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
            <button className="btn-primary" onClick={() => navigate('/onboarding/skin')}>Edit My Profile</button>
          </div>

          <p className="disclaimer">{routine.note}</p>
        </div>
      </section>
    </div>
  );
};

export default Skincare;