import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/haircare.css';

type RoutineTab = 'daily' | 'weekly';

interface RoutineData {
  hairType: string;
  scalpType: string;
  summary: {
    topConcerns: string[];
    washFreq: string;
    lifestyle: string;
  };
  routine: string[];
  weekly: string[];
  note: string;
}

const ROUTINE_STEPS: Record<string, string> = {
  'Anti-dandruff shampoo (gentle formula)': 'Cleanses scalp while preventing flaking and irritation.',
  'Gentle clarifying shampoo': 'Removes buildup without harsh stripping.',
  'Sulfate-free hydrating shampoo': 'Cleanses gently while retaining natural oils.',
  'Gentle sulfate-free shampoo': 'Effective yet gentle for all hair types.',
  'Moisturizing conditioner (leave-in optional)': 'Restores hydration and defines curls.',
  'Deep conditioning treatment': 'Intensive moisture for dry, damaged hair.',
  'Lightweight conditioner': 'Hydrates without weighing hair down.',
  'Scalp massage oil': 'Nourishes scalp and promotes growth.',
  'Lightweight scalp serum': 'Balances scalp without greasiness.',
  'Heat protectant spray': 'Shields hair from heat damage.',
};

const HAIR_TYPE_TIPS: Record<string, string> = {
  'Straight': 'Your straight hair benefits from moisture balance and regular conditioning. Avoid over-washing to maintain natural shine.',
  'Wavy': 'Wavy hair thrives with hydration and definition. Use leave-in conditioner and avoid frizz-inducing products.',
  'Curly': 'Curly hair needs moisture and definition. Deep conditioning and curl-enhancing products are your friends.',
  'Coily': 'Coily hair requires rich moisture, gentle handling, and regular deep conditioning. Avoid heat styling when possible.',
  'Not sure': 'Start with a gentle routine and adjust based on how your hair responds.',
};

const DOS_AND_DONTS = {
  do: [
    'Massage scalp gently with fingertips',
    'Use lukewarm water for washing',
    'Be consistent with your routine',
    'Get regular trims (every 6–8 weeks)',
    'Sleep on a silk/satin pillowcase',
  ],
  dont: [
    'Over-wash your hair (causes damage)',
    'Rough towel drying (use microfiber cloth)',
    'Excessive heat styling',
    'Tight hairstyles (causes hair fall)',
    'Mix too many heavy products',
  ],
};

const LIFESTYLE_TIPS: Record<string, string[]> = {
  'Active / outdoor': [
    'Rinse hair after sweating to prevent buildup.',
    'Use UV-protective products if in sun daily.',
    'Increase protein intake for hair strength.',
    'Keep hair protected during workouts.',
  ],
  'Balanced': [
    'Maintain consistent wash schedule.',
    'Deep condition 1–2x weekly.',
    'Stay hydrated with 8+ glasses of water daily.',
    'Get 7–8 hours of sleep for hair health.',
  ],
  'Mostly indoors': [
    'Protect from indoor heat and AC drying.',
    'Ensure good air quality for scalp health.',
    'Enjoy longer grooming rituals as self-care.',
    'Use humidifier to combat dry air.',
  ],
};

const HairCare: React.FC = () => {
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [activeTab, setActiveTab] = useState<RoutineTab>('daily');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.hairProfile?.result) {
          setRoutine(parsed.hairProfile.result);
          const init: Record<string, boolean> = {};
          parsed.hairProfile.result.routine.forEach((s: string) => {
            init[`d-${s}`] = false;
          });
          parsed.hairProfile.result.weekly.forEach((s: string) => {
            init[`w-${s}`] = false;
          });
          setChecklist(init);
        }
      } catch (e) {
        console.error('Failed to load hair routine');
      }
    }
  }, []);

  const toggleCheck = (id: string) => {
    setChecklist(c => ({ ...c, [id]: !c[id] }));
  };

  const getSteps = (): string[] => {
    return activeTab === 'daily' ? routine?.routine || [] : routine?.weekly || [];
  };

  if (!routine) {
    return (
      <div className="haircare-loading">
        <p>Loading your personalized hair care routine...</p>
      </div>
    );
  }

  const steps = getSteps();
  const completedCount = steps.filter(s => checklist[`${activeTab === 'daily' ? 'd' : 'w'}-${s}`]).length;
  const completionPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="haircare-root">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-inner">
          <h1 className="hero-title">Your Hair Care Routine</h1>
          <p className="hero-sub">Designed specifically for your hair type and needs.</p>

          <div className="hair-summary-card">
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-label">Hair Type</div>
                <div className="summary-value">{routine.hairType}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Scalp Type</div>
                <div className="summary-value">{routine.scalpType}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Wash Frequency</div>
                <div className="summary-value">{routine.summary.washFreq}</div>
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

            <p className="hair-type-note">{HAIR_TYPE_TIPS[routine.hairType] || 'Follow this routine consistently for best results.'}</p>
          </div>
        </div>
      </section>

      {/* Routine Tabs */}
      <section className="routine-section">
        <div className="routine-inner">
          <div className="tab-container">
            {(['daily', 'weekly'] as RoutineTab[]).map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'daily' && '💇 Daily Routine'}
                {tab === 'weekly' && '✨ Weekly Care'}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionPercent}%` }} />
            </div>
            <span className="progress-text">{completionPercent}% Complete</span>
          </div>

          {/* Steps List */}
          <div className="steps-list">
            {steps.map((step, idx) => {
              const tabPrefix = activeTab === 'daily' ? 'd' : 'w';
              const stepId = `${tabPrefix}-${step}`;
              const isChecked = checklist[stepId] || false;
              const desc = ROUTINE_STEPS[step] || '';

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
                    {desc && <p className="step-desc">{desc}</p>}
                  </label>
                  {isChecked && <span className="check-mark">✓</span>}
                </div>
              );
            })}
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
          <p className="section-sub">Healthy hair grows from healthy habits.</p>

          <div className="tips-grid">
            {LIFESTYLE_TIPS[routine.summary.lifestyle] ? (
              LIFESTYLE_TIPS[routine.summary.lifestyle].map((tip, i) => (
                <div key={i} className="tip-card">
                  <span className="tip-icon">💡</span>
                  <p>{tip}</p>
                </div>
              ))
            ) : (
              <p className="no-tips">Maintain consistency with your routine for best results.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="footer-section">
        <div className="footer-inner">
          <p className="footer-message">Healthy hair is built with consistency, not perfection.</p>

          <div className="footer-ctas">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
            <button className="btn-primary" onClick={() => navigate('/onboarding/hair')}>Edit My Profile</button>
          </div>

          <p className="disclaimer">{routine.note}</p>
        </div>
      </section>
    </div>
  );
};

export default HairCare;
