import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/hair-onboarding.css';

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

const SCREENS = [
  { id: 'welcome' },
  { id: 'hairType' },
  { id: 'scalpType' },
  { id: 'concerns' },
  { id: 'lengthDensity' },
  { id: 'washFreq' },
  { id: 'heatStyling' },
  { id: 'lifestyle' },
  { id: 'commitment' },
  { id: 'analysis' },
  { id: 'result' },
];

type HairType = 'Straight' | 'Wavy' | 'Curly' | 'Coily' | 'Not sure';

function detectHairType(answers: HairAnswers): HairType {
  const hairType = (answers.hairType || '').toLowerCase();
  if (hairType.includes('straight')) return 'Straight';
  if (hairType.includes('wavy')) return 'Wavy';
  if (hairType.includes('curly')) return 'Curly';
  if (hairType.includes('coily')) return 'Coily';
  return 'Not sure';
}

function generateHairRoutine(answers: HairAnswers) {
  const concerns = answers.concerns || [];
  const scalpType = (answers.scalpType || '').toLowerCase();
  const hairType = (answers.hairType || '').toLowerCase();
  const washFreq = (answers.washFreq || '').toLowerCase();

  const routine: string[] = [];
  const weekly: string[] = [];

  // Cleansing
  if (concerns.includes('Dandruff')) {
    routine.push('Anti-dandruff shampoo (gentle formula)');
  } else if (scalpType.includes('oily')) {
    routine.push('Gentle clarifying shampoo');
  } else if (scalpType.includes('dry')) {
    routine.push('Sulfate-free hydrating shampoo');
  } else {
    routine.push('Gentle sulfate-free shampoo');
  }

  // Conditioning
  if (hairType.includes('curly') || hairType.includes('coily')) {
    routine.push('Moisturizing conditioner (leave-in optional)');
  } else if (concerns.includes('Dry / frizzy hair')) {
    routine.push('Deep conditioning treatment');
  } else {
    routine.push('Lightweight conditioner');
  }

  // Scalp Care
  if (concerns.includes('Hair fall') || scalpType.includes('dry')) {
    routine.push('Scalp massage oil');
  } else if (scalpType.includes('oily')) {
    routine.push('Lightweight scalp serum');
  }

  // Heat protection
  if (answers.heatStyling && !answers.heatStyling.includes('Never')) {
    routine.push('Heat protectant spray');
  }

  // Weekly mask
  if (concerns.includes('Dry / frizzy hair')) {
    weekly.push('Hydrating hair mask (1–2x weekly)');
  } else if (concerns.includes('Breakage')) {
    weekly.push('Protein-rich mask (1–2x weekly)');
  } else {
    weekly.push('Nourishing mask (1–2x weekly)');
  }

  // Scalp treatment
  weekly.push('Scalp massage or deep clean (1x weekly)');

  return {
    hairType: detectHairType(answers),
    scalpType: answers.scalpType || 'Not specified',
    summary: {
      topConcerns: concerns,
      washFreq: answers.washFreq || 'Not specified',
      lifestyle: answers.lifestyle || 'Not specified',
    },
    routine: Array.from(new Set(routine)),
    weekly,
    note: 'This routine provides general hair care guidance and is not medical advice.',
  };
}

const HairOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<HairAnswers>({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<any | null>(null);

  const totalScreens = SCREENS.length - 1;

  useEffect(() => {
    if (index >= SCREENS.length) return;
    if (SCREENS[index].id === 'analysis') {
      setLoadingProgress(0);
      const t = setInterval(() => {
        setLoadingProgress(p => {
          if (p >= 100) {
            clearInterval(t);
            const r = generateHairRoutine(answers);
            setResult(r);
            setIndex(prev => Math.min(prev + 1, SCREENS.length - 1));
          }
          return Math.min(100, p + Math.random() * 12 + 6);
        });
      }, 350);
      return () => clearInterval(t);
    }
  }, [index, answers]);

  const goNext = () => setIndex(i => Math.min(i + 1, SCREENS.length - 1));
  const goPrev = () => setIndex(i => Math.max(i - 1, 0));

  const setAnswer = (key: keyof HairAnswers, value: any) => {
    setAnswers(a => ({ ...a, [key]: value }));
  };

  const toggleMulti = (key: keyof HairAnswers, value: string) => {
    setAnswers(a => {
      const list = new Set((a[key] as string[]) || []);
      if (list.has(value)) list.delete(value);
      else list.add(value);
      return { ...a, [key]: Array.from(list) };
    });
  };

  const skipOnboarding = () => {
    const analysisIndex = SCREENS.findIndex(s => s.id === 'analysis');
    if (analysisIndex !== -1) {
      setIndex(analysisIndex);
    }
  };

  const finishAndSave = () => {
    try {
      const existing = localStorage.getItem('userData');
      const prev = existing ? JSON.parse(existing) : {};
      const payload = { ...prev, hairProfile: { answers, result } };
      localStorage.setItem('userData', JSON.stringify(payload));
    } catch (e) {
      localStorage.setItem('userData', JSON.stringify({ hairProfile: { answers, result } }));
    }
    navigate('/haircare');
  };

  const progressPercent = Math.round((index / totalScreens) * 100);

  return (
    <div className="ho-root">
      <div className="ho-card">
        <div className="ho-top">
          <div className="ho-progress-bar"><div className="ho-progress-fill" style={{ width: `${progressPercent}%` }} /></div>
          <button className="ho-skip" onClick={skipOnboarding}>Skip</button>
        </div>

        <div className="ho-slider" style={{ transform: `translateX(-${index * 100}%)` }}>
          {/* Welcome */}
          <section className="ho-slide">
            <h1 className="ho-h1">Let's understand your hair</h1>
            <p className="ho-sub">Answer a few quick questions to build the right hair care routine for you.</p>
            <div className="ho-actions-row">
              <button className="ho-primary" onClick={goNext}>Start</button>
            </div>
          </section>

          {/* Hair Type */}
          <section className="ho-slide">
            <h1 className="ho-h1">How would you describe your hair?</h1>
            <p className="ho-sub">Choose what feels closest.</p>
            <div className="ho-options-grid">
              {['Straight', 'Wavy', 'Curly', 'Coily', 'Not sure'].map(o => (
                <button key={o} className={`ho-card-btn ${answers.hairType === o ? 'selected' : ''}`} onClick={() => { setAnswer('hairType', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Scalp Type */}
          <section className="ho-slide">
            <h1 className="ho-h1">How does your scalp usually feel?</h1>
            <p className="ho-sub">Your scalp health matters more than you think.</p>
            <div className="ho-pills">
              {['Oily', 'Dry', 'Balanced', 'Flaky / itchy', 'Not sure'].map(o => (
                <button key={o} className={`pill ${answers.scalpType === o ? 'selected' : ''}`} onClick={() => { setAnswer('scalpType', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Concerns (Multi) */}
          <section className="ho-slide">
            <h1 className="ho-h1">What hair issues are you facing?</h1>
            <p className="ho-sub">Select all that apply.</p>
            <div className="chips-grid">
              {['Hair fall', 'Dandruff', 'Dry / frizzy hair', 'Oily scalp', 'Thin / weak hair', 'Slow hair growth', 'Hair breakage', 'Dull / lifeless hair', 'Scalp itchiness'].map(o => (
                <button key={o} className={`chip ${((answers.concerns||[]).includes(o)) ? 'selected' : ''}`} onClick={() => toggleMulti('concerns', o)}>{o}</button>
              ))}
            </div>
            <div className="ho-actions-row">
              <button className="ho-secondary" onClick={goPrev}>Back</button>
              <button className="ho-primary" onClick={goNext}>Next</button>
            </div>
          </section>

          {/* Length & Density */}
          <section className="ho-slide">
            <h1 className="ho-h1">How would you describe your hair?</h1>
            <p className="ho-sub">This helps us adjust the routine.</p>
            <div className="chips-grid">
              {['Short', 'Medium', 'Long', 'Thin', 'Medium density', 'Thick'].map(o => (
                <button key={o} className={`chip ${((answers.lengthDensity||[]).includes(o)) ? 'selected' : ''}`} onClick={() => toggleMulti('lengthDensity', o)}>{o}</button>
              ))}
            </div>
            <div className="ho-actions-row">
              <button className="ho-secondary" onClick={goPrev}>Back</button>
              <button className="ho-primary" onClick={goNext}>Next</button>
            </div>
          </section>

          {/* Wash Frequency */}
          <section className="ho-slide">
            <h1 className="ho-h1">How often do you wash your hair?</h1>
            <p className="ho-sub">Over-washing can cause damage.</p>
            <div className="ho-options-grid">
              {['Daily', 'Every 2–3 days', 'Twice a week', 'Once a week', 'Irregular'].map(o => (
                <button key={o} className={`ho-card-btn ${answers.washFreq === o ? 'selected' : ''}`} onClick={() => { setAnswer('washFreq', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Heat & Styling */}
          <section className="ho-slide">
            <h1 className="ho-h1">How often do you use heat or styling products?</h1>
            <p className="ho-sub">Heat impacts hair strength.</p>
            <div className="ho-options-grid">
              {['Frequently', 'Occasionally', 'Rarely', 'Never'].map(o => (
                <button key={o} className={`ho-card-btn ${answers.heatStyling === o ? 'selected' : ''}`} onClick={() => { setAnswer('heatStyling', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Lifestyle */}
          <section className="ho-slide">
            <h1 className="ho-h1">Your daily lifestyle looks more like…</h1>
            <p className="ho-sub">Lifestyle affects hair health.</p>
            <div className="ho-options-grid">
              {['Active / outdoor', 'Balanced', 'Mostly indoors'].map(o => (
                <button key={o} className={`ho-card-btn ${answers.lifestyle === o ? 'selected' : ''}`} onClick={() => { setAnswer('lifestyle', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Commitment */}
          <section className="ho-slide">
            <h1 className="ho-h1">How much time can you give to hair care weekly?</h1>
            <p className="ho-sub">Consistency matters more than effort.</p>
            <div className="ho-options-grid">
              {['Minimal care', 'Basic routine', 'Full routine'].map(o => (
                <button key={o} className={`ho-card-btn ${answers.commitment === o ? 'selected' : ''}`} onClick={() => { setAnswer('commitment', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Analysis */}
          <section className="ho-slide ho-analysis">
            <h1 className="ho-h1">Creating your hair care routine…</h1>
            <p className="ho-sub">Designed for your hair type, scalp, and concerns.</p>
            <div className="analysis-box">
              <div className="analysis-progress">
                <div className="analysis-fill" style={{ width: `${loadingProgress}%` }} />
              </div>
            </div>
          </section>

          {/* Result */}
          <section className="ho-slide ho-result">
            {result ? (
              <div className="result-inner">
                <h1 className="ho-h1">Your Hair Care Routine</h1>
                <p className="ho-sub">A personalized routine for your hair type and needs.</p>

                <div className="result-block">
                  <h3>Hair Profile</h3>
                  <p><strong>Hair Type:</strong> {result.hairType}</p>
                  <p><strong>Scalp Type:</strong> {result.scalpType}</p>
                  {result.summary.topConcerns.length > 0 && <p><strong>Concerns:</strong> {result.summary.topConcerns.join(', ')}</p>}
                </div>

                <div className="result-block">
                  <h3>Daily Routine</h3>
                  <ol>{result.routine.map((s: string, i: number) => <li key={i}>{s}</li>)}</ol>
                </div>

                <div className="result-block">
                  <h3>Weekly Care</h3>
                  <ul className="weekly-list">{result.weekly.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
                </div>

                <div className="ho-actions-row">
                  <button className="ho-secondary" onClick={() => setIndex(0)}>Edit Answers</button>
                  <button className="ho-primary" onClick={finishAndSave}>Save & Continue</button>
                </div>

                <p className="disclaimer">{result.note}</p>
              </div>
            ) : (
              <div className="result-inner"><p>Preparing your routine…</p></div>
            )}
          </section>
        </div>

        <div className="ho-dots">
          {SCREENS.slice(0, SCREENS.length - 1).map((s, i) => (
            <button key={s.id} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-label={`Go to step ${i+1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HairOnboarding;
