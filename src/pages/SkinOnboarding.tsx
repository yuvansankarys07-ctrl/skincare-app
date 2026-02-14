import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/skin-onboarding.css';

type SkinAnswers = {
  skinFeel?: string;
  sensitivity?: string;
  concerns?: string[];
  areas?: string[];
  lifestyle?: string;
  sun?: string;
  experience?: string;
  time?: string;
};

const SCREENS = [
  { id: 'welcome' },
  { id: 'skinFeel' },
  { id: 'sensitivity' },
  { id: 'concerns' },
  { id: 'areas' },
  { id: 'lifestyle' },
  { id: 'sun' },
  { id: 'experience' },
  { id: 'time' },
  { id: 'analysis' },
  { id: 'result' },
];

const DEFAULTS: SkinAnswers = {};

type SkinType = 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal';

function detectSkinType(answers: SkinAnswers): SkinType {
  const skinFeel = (answers.skinFeel || '').toLowerCase();
  const sensitivity = (answers.sensitivity || '').toLowerCase();

  if (sensitivity.includes('irritated') || sensitivity.includes('easily')) return 'Sensitive';
  if (skinFeel.includes('dry') || skinFeel.includes('tight')) return 'Dry';
  if (skinFeel.includes('oily') || skinFeel.includes('shiny')) {
    if (skinFeel.includes('some areas')) return 'Combination';
    return 'Oily';
  }
  if (skinFeel.includes('combination') || skinFeel.includes('some areas')) return 'Combination';
  return 'Normal';
}

function generateRoutine(answers: SkinAnswers) {
  // Simple rule-based routine generator that outputs step types (no brands)
  const concerns = answers.concerns || [];
  const skinFeel = (answers.skinFeel || '').toLowerCase();
  const experience = (answers.experience || '').toLowerCase();
  const skinType = detectSkinType(answers);

  const morning: string[] = [];
  const night: string[] = [];

  // Cleanser
  if (skinFeel.includes('dry')) morning.push('Cream/hydrating cleanser');
  else if (skinFeel.includes('oily') || skinFeel.includes('shiny')) morning.push('Gel or foaming cleanser');
  else morning.push('Gentle balanced cleanser');

  // Toner / Hydration
  morning.push('Hydrating toner or essence');

  // Active serum choices (simple logic)
  if (concerns.includes('Acne / breakouts')) {
    night.push('Light exfoliating treatment (e.g., BHA) — 2–3x weekly');
    morning.push('Niacinamide serum (oil-balancing)');
  }
  if (concerns.includes('Dark spots / pigmentation')) {
    morning.push('Vitamin C serum (antioxidant)');
    night.push('Targeted brightening serum (use as tolerated)');
  }
  if (concerns.includes('Fine lines / early aging')) {
    night.push('Retinol or gentle retinoid (begin slowly)');
  }
  if (concerns.includes('Dullness')) {
    morning.push('Vitamin C or antioxidant serum');
  }
  if (concerns.includes('Dark circles')) {
    night.push('Gentle eye cream');
  }
  if (concerns.includes('Redness') || concerns.includes('Sensitive')) {
    morning.push('Soothing serum (hyaluronic + calming ingredients)');
  }

  // Fallback serums
  if (!morning.some(s => /vitamin|niacinamide|hyaluronic/i.test(s))) morning.push('Hyaluronic acid serum');

  // Moisturizer
  if (skinFeel.includes('dry') || skinFeel.includes('tight')) {
    morning.push('Rich moisturizer');
    night.push('Rich moisturizer or sleeping mask');
  } else if (skinFeel.includes('oily')) {
    morning.push('Lightweight gel moisturizer');
    night.push('Lightweight moisturizer');
  } else {
    morning.push('Balanced moisturizer');
    night.push('Balanced moisturizer');
  }

  // Sunscreen
  morning.push('Broad-spectrum sunscreen (SPF 30+)');

  // Weekly care
  const weekly = ['Gentle exfoliation 1–3x weekly', 'Hydrating mask 1–2x weekly'];

  // Deduplicate and keep order
  const uniq = (arr: string[]) => Array.from(new Set(arr));

  return {
    skinType,
    summary: {
      skinFeel: answers.skinFeel || 'Not specified',
      topConcerns: answers.concerns || [],
      lifestyle: answers.lifestyle || 'Not specified',
      sun: answers.sun || 'Not specified',
    },
    morning: uniq(morning),
    night: uniq(night),
    weekly,
    note: 'This app provides general skincare guidance only and is not medical advice.',
  };
}

const SkinOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SkinAnswers>(DEFAULTS);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<any | null>(null);

  const totalScreens = SCREENS.length - 1; // last is result

  useEffect(() => {
    if (index >= SCREENS.length) return;
    if (SCREENS[index].id === 'analysis') {
      setLoadingProgress(0);
      const t = setInterval(() => {
        setLoadingProgress(p => {
          if (p >= 100) {
            clearInterval(t);
            const r = generateRoutine(answers);
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

  const setAnswer = (key: keyof SkinAnswers, value: any) => {
    setAnswers(a => ({ ...a, [key]: value }));
  };

  const toggleMulti = (key: keyof SkinAnswers, value: string) => {
    setAnswers(a => {
      const list = new Set((a[key] as string[]) || []);
      if (list.has(value)) list.delete(value);
      else list.add(value);
      return { ...a, [key]: Array.from(list) };
    });
  };

  const skipOnboarding = () => {
    // Move to analysis screen (index 9)
    const analysisIndex = SCREENS.findIndex(s => s.id === 'analysis');
    if (analysisIndex !== -1) {
      setIndex(analysisIndex);
    }
  };

  const finishAndSave = () => {
    try {
      const existing = localStorage.getItem('userData');
      const prev = existing ? JSON.parse(existing) : {};
      const payload = { ...prev, skinProfile: { answers, result } };
      localStorage.setItem('userData', JSON.stringify(payload));
    } catch (e) {
      localStorage.setItem('userData', JSON.stringify({ skinProfile: { answers, result } }));
    }
    navigate('/skincare');
  };

  const progressPercent = Math.round((index / totalScreens) * 100);

  return (
    <div className="so-root">
      <div className="so-card">
        <div className="so-top">
          <div className="so-progress-bar"><div className="so-progress-fill" style={{ width: `${progressPercent}%` }} /></div>
          <button className="so-skip" onClick={skipOnboarding}>Skip</button>
        </div>

        <div className="so-slider" style={{ transform: `translateX(-${index * 100}%)` }}>
          {/* Welcome */}
          <section className="so-slide">
            <h1 className="so-h1">Let’s get to know your skin</h1>
            <p className="so-sub">A few quick questions to build a routine made just for you.</p>
            <div className="so-actions-row">
              <button className="so-primary" onClick={goNext}>Start</button>
            </div>
          </section>

          {/* Skin Feel */}
          <section className="so-slide">
            <h1 className="so-h1">How does your skin usually feel by mid-day?</h1>
            <p className="so-sub">Choose what feels most accurate.</p>
            <div className="so-options-grid">
              {['Shiny & oily', 'Dry & tight', 'Oily in some areas, dry in others', 'Mostly balanced', "I’m not sure"].map(o => (
                <button key={o} className={`so-card-btn ${answers.skinFeel === o ? 'selected' : ''}`} onClick={() => { setAnswer('skinFeel', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Sensitivity */}
          <section className="so-slide">
            <h1 className="so-h1">How does your skin react to new products?</h1>
            <p className="so-sub">This helps us keep things gentle and safe.</p>
            <div className="so-pills">
              {['Easily irritated', 'Sometimes sensitive', 'Rarely reacts', "I’ve never noticed"].map(o => (
                <button key={o} className={`pill ${answers.sensitivity === o ? 'selected' : ''}`} onClick={() => { setAnswer('sensitivity', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Concerns (multi) */}
          <section className="so-slide">
            <h1 className="so-h1">What are you trying to improve?</h1>
            <p className="so-sub">Select all that apply.</p>
            <div className="chips-grid">
              {['Acne / breakouts','Dark spots / pigmentation','Uneven skin tone','Dullness','Dark circles','Fine lines / early aging','Redness','Just maintaining healthy skin'].map(o => (
                <button key={o} className={`chip ${((answers.concerns||[]).includes(o)) ? 'selected' : ''}`} onClick={() => toggleMulti('concerns', o)}>{o}</button>
              ))}
            </div>
            <div className="so-actions-row">
              <button className="so-secondary" onClick={goPrev}>Back</button>
              <button className="so-primary" onClick={goNext}>Next</button>
            </div>
          </section>

          {/* Problem Areas */}
          <section className="so-slide">
            <h1 className="so-h1">Which areas concern you the most?</h1>
            <p className="so-sub">Tap the areas you relate to.</p>
            <div className="areas-grid">
              {['Forehead & nose (T-zone)','Cheeks','Jawline','Under-eye area','No specific area'].map(o => (
                <button key={o} className={`area ${((answers.areas||[]).includes(o)) ? 'selected' : ''}`} onClick={() => toggleMulti('areas', o)}>{o}</button>
              ))}
            </div>
            <div className="so-actions-row">
              <button className="so-secondary" onClick={goPrev}>Back</button>
              <button className="so-primary" onClick={goNext}>Next</button>
            </div>
          </section>

          {/* Lifestyle */}
          <section className="so-slide">
            <h1 className="so-h1">Your daily lifestyle looks more like…</h1>
            <p className="so-sub">Your routine should fit your life, not fight it.</p>
            <div className="so-options-grid">
              {['Very busy & active','Balanced & manageable','Relaxed / mostly indoors'].map(o => (
                <button key={o} className={`so-card-btn ${answers.lifestyle === o ? 'selected' : ''}`} onClick={() => { setAnswer('lifestyle', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Sun Exposure */}
          <section className="so-slide">
            <h1 className="so-h1">How often are you exposed to sunlight?</h1>
            <p className="so-sub">Sun exposure changes skincare needs.</p>
            <div className="so-pills">
              {['Most of the day','Some time daily','Rarely outdoors'].map(o => (
                <button key={o} className={`pill ${answers.sun === o ? 'selected' : ''}`} onClick={() => { setAnswer('sun', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="so-slide">
            <h1 className="so-h1">How familiar are you with skincare?</h1>
            <p className="so-sub">We’ll keep things simple or advanced based on this.</p>
            <div className="so-options-grid">
              {['I know ingredients & steps','I follow a basic routine','Beginner','Guide me completely'].map(o => (
                <button key={o} className={`so-card-btn ${answers.experience === o ? 'selected' : ''}`} onClick={() => { setAnswer('experience', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Time commitment */}
          <section className="so-slide">
            <h1 className="so-h1">How much time can you give your skin daily?</h1>
            <p className="so-sub">Be honest — consistency matters more than length.</p>
            <div className="so-pills">
              {['2–3 minutes','5–7 minutes','10+ minutes','Depends on the day'].map(o => (
                <button key={o} className={`pill ${answers.time === o ? 'selected' : ''}`} onClick={() => { setAnswer('time', o); goNext(); }}>{o}</button>
              ))}
            </div>
          </section>

          {/* Analysis Loading */}
          <section className="so-slide so-analysis">
            <h1 className="so-h1">Building your personalized routine…</h1>
            <p className="so-sub">Tailored to your skin, lifestyle, and goals.</p>
            <div className="analysis-box">
              <div className="analysis-progress">
                <div className="analysis-fill" style={{ width: `${loadingProgress}%` }} />
              </div>
            </div>
          </section>

          {/* Result placeholder - will render details when result populated */}
          <section className="so-slide so-result">
            {result ? (
              <div className="result-inner">
                <h1 className="so-h1">Your Skin Care Routine</h1>
                <p className="so-sub">A simple, effective routine tailored for you.</p>

                <div className="result-block">
                  <h3>Summary</h3>
                  <p>{result.summary.skinFeel}</p>
                  {result.summary.topConcerns.length > 0 && <p>Top concerns: {result.summary.topConcerns.join(', ')}</p>}
                </div>

                <div className="result-block">
                  <h3>Morning</h3>
                  <ol>{result.morning.map((s: string, i: number) => <li key={i}>{s}</li>)}</ol>
                </div>

                <div className="result-block">
                  <h3>Night</h3>
                  <ol>{result.night.map((s: string, i: number) => <li key={i}>{s}</li>)}</ol>
                </div>

                <div className="so-actions-row">
                  <button className="so-secondary" onClick={() => setIndex(0)}>Edit Answers</button>
                  <button className="so-primary" onClick={finishAndSave}>Save & Continue</button>
                </div>

                <p className="disclaimer">{result.note}</p>
              </div>
            ) : (
              <div className="result-inner"><p>Preparing your routine…</p></div>
            )}
          </section>
        </div>

        <div className="so-dots">
          {SCREENS.slice(0, SCREENS.length - 1).map((s, i) => (
            <button key={s.id} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-label={`Go to step ${i+1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkinOnboarding;
