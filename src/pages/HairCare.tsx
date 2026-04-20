import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type HairCareTab = 'daily' | 'weekly' | 'questions';

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

const DOS_AND_DONTS = {
  do: [
    'Massage scalp gently with fingertips',
    'Use lukewarm water for washing',
    'Be consistent with your routine',
    'Get regular trims every 6-8 weeks',
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
  'Active/Sports': [
    'Rinse hair immediately after sweating.',
    'Use UV-protective products if in sun daily.',
    'Increase protein intake for hair strength.',
    'Keep hair protected during workouts.',
  ],
  'Stressed': [
    'Manage stress with meditation or yoga.',
    'Get adequate sleep for hair recovery.',
    'Use calming scalp treatments.',
    'Avoid tight hairstyles that cause tension.',
  ],
  'Busy': [
    'Use dry shampoo between washes.',
    'Try protective styles like braids.',
    'Keep styling simple and quick.',
    'Use multi-purpose hair products.',
  ],
  'Relaxed': [
    'Dedicate time to deep conditioning.',
    'Try intensive hair treatments.',
    'Experiment with new styles and techniques.',
    'Give yourself relaxing scalp massages.',
  ],
};

const HAIR_CARE_QA = [
  {
    q: 'How often should I wash my hair?',
    a: 'It depends on your hair type and lifestyle. Oily hair: every 1-2 days. Normal hair: 2-3 times weekly. Dry/Curly: 1-2 times weekly. Listen to your scalp - if it feels greasy or itchy, wash it.',
    icon: '🚿',
  },
  {
    q: 'What causes hair fall and how to prevent it?',
    a: 'Causes: stress, poor diet, genetics, harsh styling, hormonal changes. Prevention: eat protein-rich foods, massage scalp daily, reduce stress, use gentle products, avoid tight hairstyles, take hair vitamins.',
    icon: '💪',
  },
  {
    q: 'Should I condition my scalp or just the ends?',
    a: 'Only condition the mid-lengths to ends! Applying conditioner to the scalp makes roots greasy and weighs hair down. Focus shampoo on scalp and conditioner on the lengths and ends.',
    icon: '🧴',
  },
  {
    q: 'How to reduce frizz naturally?',
    a: 'Use moisturizing products, apply leave-in conditioner, avoid towel-drying roughly (use microfiber cloth), minimize heat styling, use serum or oil on ends, sleep on silk pillowcase, deep condition weekly.',
    icon: '✨',
  },
  {
    q: 'Is daily heat styling bad for hair?',
    a: 'Yes, daily heat damages hair over time - causes dryness, breakage, split ends. Always use heat protectant spray, keep tools on low-medium heat, limit to 2-3 times weekly, deep condition more often.',
    icon: '🔥',
  },
  {
    q: 'Hair mask vs conditioner - what\'s the difference?',
    a: 'Conditioner: lightweight, used every wash for basic moisture. Hair mask: intensive treatment, used 1-2 times weekly, left on 5-20 minutes for deep hydration and repair. Great combo: condition daily + mask weekly.',
    icon: '💆',
  },
  {
    q: 'What are the different hair types?',
    a: 'Type 1: Straight. Type 2: Wavy (2A-2C). Type 3: Curly (3A-3C). Type 4: Coily/Kinky (4A-4C). Check your natural texture when air-dried. Mix types possible on same head!',
    icon: '💇',
  },
  {
    q: 'Can split ends be repaired?',
    a: 'No, split ends can only be cut off. Once hair splits, trimming is the only solution. Prevention is key: use nourishing products, minimize heat, get regular trims every 6-8 weeks, use serums on ends.',
    icon: '✂️',
  },
  {
    q: 'Why is my scalp so itchy?',
    a: 'Causes: dryness, product buildup, dandruff, fungal infection, allergies, harsh shampoos. Solution: try gentle clarifying shampoo, avoid sulfates, rinse thoroughly, use scalp scrub, try tea tree oil or anti-dandruff shampoo.',
    icon: '🧐',
  },
  {
    q: 'Does trimming make hair grow faster?',
    a: 'No, trimming doesn\'t affect growth rate (hair grows ~6 inches/year from roots). But regular trims prevent split ends from traveling up the shaft, helping you retain length and stay healthy.',
    icon: '📈',
  },
  {
    q: 'Which ingredients should I avoid?',
    a: 'Avoid: Sulfates (strip natural oils), parabens (preservatives), silicones (buildup), alcohol (drying), excessive fragrance. Look for: sulfate-free, paraben-free, silicone-free, natural ingredients, gentle formulations.',
    icon: '🚫',
  },
  {
    q: 'How to make hair grow faster and stronger?',
    a: 'Hair grows ~0.5 inches/month naturally. Boost growth: eat protein, iron, biotin, vitamins A/C/D/E, stay hydrated, massage scalp 5-10 mins daily, reduce stress, get 7-8 hours sleep, avoid tight hairstyles.',
    icon: '🌱',
  },
  {
    q: 'Is sleeping with wet hair okay?',
    a: 'No. Wet hair is fragile and breaks easily. Can cause frizz, tangles, split ends. If you must: use microfiber towel/t-shirt to remove water, loosely braid or tie hair, sleep on silk pillowcase.',
    icon: '😴',
  },
  {
    q: 'What\'s the best way to detangle?',
    a: 'Always start from the ends, work up to roots with wide-tooth comb or brush. Best when: hair is damp (not soaking), with conditioner or detangling spray on it. Be gentle and patient - rough detangling causes breakage.',
    icon: '🪮',
  },
  {
    q: 'How does diet affect hair health?',
    a: 'Hair is made of protein (keratin). Diet impacts hair: Protein builds hair structure, Iron carries oxygen to follicles, Omega-3s reduce inflammation, Biotin strengthens hair, Vitamins A/C/D/E nourish. Bad diet = weak, thin, dull hair.',
    icon: '🥗',
  },
  {
    q: 'How often should I get a haircut?',
    a: 'Every 6-8 weeks for healthy maintenance. Frequency depends on: hair type, style, damage level. Short hair: 4-6 weeks. Long hair: 8-12 weeks. More often if bleached/colored/damaged. Keep ends healthy = stronger hair overall.',
    icon: '✂️',
  },
  {
    q: 'What\'s the best shampoo type for my hair?',
    a: 'Oily hair: clarifying or volumizing shampoo. Dry hair: moisturizing or hydrating. Curly hair: curl-defining or sulfate-free. Color-treated: color-safe. Sensitive scalp: gentle or sulfate-free. Take a product test: use for 2 weeks before deciding.',
    icon: '🧼',
  },
  {
    q: 'How to restore damaged hair?',
    a: 'Deep condition 1-2x weekly, use protein treatments, apply hair masks, trim damaged ends, reduce heat styling, use heat protectant, get regular haircuts, use nourishing serums, minimize chemical treatments, massage scalp daily.',
    icon: '💪',
  },
];


const HairCare: React.FC = () => {
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [activeTab, setActiveTab] = useState<HairCareTab>('daily');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/onboarding/hair');
    }, 3000);

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
          clearTimeout(timeout);
        } else {
          navigate('/onboarding/hair');
        }
      } catch (e) {
        console.error('Failed to load hair routine');
        navigate('/onboarding/hair');
      }
    } else {
      navigate('/onboarding/hair');
    }

    return () => clearTimeout(timeout);
  }, [navigate]);

  const toggleCheck = (id: string) => {
    setChecklist(c => ({ ...c, [id]: !c[id] }));
  };

  if (!routine) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EFE8 100%)' }}>
        <div style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(31,21,19,0.12)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>💇</div>
          <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1F1513' }}>Loading your hair routine…</p>
          <p style={{ fontSize: '14px', color: '#8B7355' }}>Personalized for your hair type</p>
        </div>
      </div>
    );
  }

  const dailyRoutine = routine.routine || [];
  const weeklyRoutine = routine.weekly || [];
  const currentRoutine = activeTab === 'daily' ? dailyRoutine : weeklyRoutine;
  const completedCount = currentRoutine.filter(s => checklist[`${activeTab === 'daily' ? 'd' : 'w'}-${s}`]).length;
  const completionPercent = currentRoutine.length > 0 ? Math.round((completedCount / currentRoutine.length) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EFE8 100%)' }}>
      {/* Navigation */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #E8DDD2', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: '700', color: '#1F1513' }}>
            <span>💇</span>
            <span>Hair Care</span>
          </div>
          <button onClick={() => navigate('/onboarding/hair')} style={{ padding: '8px 16px', background: '#A08070', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            ← Back
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px 60px' }}>
        {/* Hero Section */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '32px', boxShadow: '0 4px 16px rgba(160,128,112,0.1)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1F1513', marginBottom: '8px' }}>Your Hair Care Routine 💆</h1>
          <p style={{ fontSize: '15px', color: '#8B7355', marginBottom: '24px' }}>Designed for your {routine.hairType} hair and {routine.scalpType} scalp</p>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#A08070', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Hair Type</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1F1513', margin: 0 }}>{routine.hairType}</p>
            </div>
            <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#A08070', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Scalp Type</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1F1513', margin: 0 }}>{routine.scalpType}</p>
            </div>
            <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#A08070', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Frequency</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1F1513', margin: 0 }}>{routine.summary.washFreq}</p>
            </div>
          </div>

          {/* Top Concerns */}
          {routine.summary.topConcerns.length > 0 && (
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#A08070', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Top Concerns</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {routine.summary.topConcerns.map(concern => (
                  <span key={concern} style={{ background: '#E8DDD2', color: '#1F1513', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '600' }}>
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #E8DDD2', marginBottom: '32px' }}>
          <button
            onClick={() => setActiveTab('daily')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'daily' ? '3px solid #A08070' : 'none',
              marginBottom: '-2px',
              color: activeTab === 'daily' ? '#A08070' : '#8B7355',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            🌞 Daily
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'weekly' ? '3px solid #A08070' : 'none',
              marginBottom: '-2px',
              color: activeTab === 'weekly' ? '#A08070' : '#8B7355',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            ✨ Weekly
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'questions' ? '3px solid #A08070' : 'none',
              marginBottom: '-2px',
              color: activeTab === 'questions' ? '#A08070' : '#8B7355',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            ❓ Q&A
          </button>
        </div>

        {/* Routine Tabs */}
        {(activeTab === 'daily' || activeTab === 'weekly') && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#A08070', margin: 0, textTransform: 'uppercase' }}>Progress</p>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#A08070', margin: 0 }}>{completionPercent}%</p>
              </div>
              <div style={{ height: '8px', background: '#E8DDD2', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#A08070', width: `${completionPercent}%`, transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: 'grid', gap: '10px' }}>
              {currentRoutine.map((step, idx) => {
                const stepId = `${activeTab === 'daily' ? 'd' : 'w'}-${step}`;
                const isChecked = checklist[stepId] || false;
                const desc = ROUTINE_STEPS[step] || '';

                return (
                  <div
                    key={stepId}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'grid',
                      gridTemplateColumns: '20px 1fr',
                      gap: '12px',
                      alignItems: 'start',
                      border: '1px solid #E8DDD2',
                      opacity: isChecked ? 0.5 : 1,
                      textDecoration: isChecked ? 'line-through' : 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheck(stepId)}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: '2px solid #A08070',
                        cursor: 'pointer',
                        accentColor: '#A08070',
                        marginTop: '2px',
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ background: '#A08070', color: 'white', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F1513' }}>{step}</span>
                      </div>
                      {desc && <p style={{ fontSize: '12px', color: '#8B7355', margin: '4px 0 0 0' }}>{desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Q&A Section */}
        {activeTab === 'questions' && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {HAIR_CARE_QA.map((qa, idx) => (
              <div key={idx} style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #E8DDD2' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{qa.icon}</span>
                  <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1F1513', margin: 0, lineHeight: '1.4' }}>Q{idx + 1}: {qa.q}</h3>
                </div>
                <p style={{ fontSize: '12px', color: '#8B7355', lineHeight: '1.5', margin: '0 0 0 32px' }}>{qa.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Do's & Don'ts */}
        <div style={{ marginTop: '48px', background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E8DDD2' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F1513', marginBottom: '20px' }}>Do's & Don'ts 👍</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#27AE60', marginBottom: '12px' }}>✓ Do</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
                {DOS_AND_DONTS.do.map((item, i) => (
                  <li key={i} style={{ fontSize: '12px', color: '#8B7355' }}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#E74C3C', marginBottom: '12px' }}>✗ Don't</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
                {DOS_AND_DONTS.dont.map((item, i) => (
                  <li key={i} style={{ fontSize: '12px', color: '#8B7355' }}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Lifestyle Tips */}
        <div style={{ marginTop: '32px', background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E8DDD2', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F1513', marginBottom: '6px' }}>Lifestyle Tips 💡</h2>
          <p style={{ fontSize: '13px', color: '#8B7355', marginBottom: '16px', margin: '0 0 16px 0' }}>Healthy hair grows from healthy habits</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {LIFESTYLE_TIPS[routine.summary.lifestyle]?.map((tip, i) => (
              <div key={i} style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E8DDD2' }}>
                <p style={{ fontSize: '12px', color: '#8B7355', lineHeight: '1.4', margin: 0 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HairCare;
