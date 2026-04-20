import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/fashion.css';

type FashionTab = 'outfits' | 'colors' | 'wardrobe' | 'accessories' | 'trends' | 'brands' | 'capsule' | 'questions';

interface FashionProfile {
  bodyStructure: string;
  colorPalette: {
    bestColors: string[];
    neutrals: string[];
    accents: string[];
    avoid: string[];
    explanation: string;
  };
  outfits: Array<{
    name: string;
    top: string;
    bottom: string;
    shoes: string;
    accessories: string;
    layering?: string;
  }>;
  essentialItems: string[];
  trends: string[];
  groomingTips: string[];
  accessoriesGuide: {
    watches: string[];
    sunglasses: string[];
    bags: string[];
    jewelry: string[];
    belts: string[];
  };
  brandRecommendations: {
    lowBudget: string[];
    mediumBudget: string[];
    premium: string[];
  };
  capsuleWardrobe: string[];
  mistakesToAvoid: string[];
  styleScore: number;
  styleAdvice: string;
  personality?: string;
  budget?: string;
}

const FASHION_CARE_QA = [
  {
    q: 'How do I find my personal style?',
    a: 'Start by identifying what you like: colors, silhouettes, patterns. Create a mood board, follow fashion accounts you love, and experiment with different styles. True personal style is what makes you feel confident, not what trends dictate.',
    icon: '✨',
  },
  {
    q: 'What makes a good capsule wardrobe?',
    a: 'A capsule wardrobe (30-40 pieces) contains versatile basics that mix and match easily. Include basics (whites, blacks, jeans), layers (blazers, cardigans), and a few statement pieces. Choose neutral colors as your base, add 2-3 accent colors.',
    icon: '📦',
  },
  {
    q: 'How should clothes fit properly?',
    a: 'Shirts should skim your shoulders without bunching. Pants should have a 0.5-1 inch break at the ankle. Blazers should not pull across the chest or back. Avoid overly tight or too loose clothes. When in doubt, get clothes tailored for perfect fit.',
    icon: '👔',
  },
  {
    q: 'What\'s the best way to pick flattering colors?',
    a: 'Consider your undertone (warm, cool, or neutral). Hold colors next to your face in natural light. Colors that make your skin glow are your colors! Warm undertones: earth tones, warm metallics. Cool undertones: jewel tones, silver. Neutral: both work.',
    icon: '🎨',
  },
  {
    q: 'How to dress for different body shapes?',
    a: 'Apple: V-necks, wrap dresses, cinched at waist. Pear: light tops, dark bottoms, patterns on top. Rectangle: belted clothes, ruffles, layers. Hourglass: wrap dresses, fitted clothes. Remember: clothes should enhance YOUR body, not hide it.',
    icon: '🧍',
  },
  {
    q: 'What\'s the 80/20 rule in fashion?',
    a: '80% of your wardrobe should be basics and neutrals (versatile pieces), and 20% should be trendy or statement pieces. This ensures you can effortlessly mix and match while staying current. Invest in quality basics, have fun with trends.',
    icon: '⚖️',
  },
  {
    q: 'How to style basics in different ways?',
    a: 'White T-shirt: casual with jeans, formal with blazer, layered under dress. White shirt: tucked for professional, oversized for casual, tied for trendy. Black pants: dress up with heels and blouse, dress down with sneakers and tee. Basics = endless options!',
    icon: '👗',
  },
  {
    q: 'Which accessories matter most?',
    a: 'Invest in quality basics: watch, leather belt, simple jewelry. Add character with scarves, bags, hats. Accessories are the easiest way to transform an outfit. Quality over quantity always wins.',
    icon: '💍',
  },
  {
    q: 'How often should I update my wardrobe?',
    a: 'Quality basics last years. Trendy pieces can be swapped seasonally. Shop mindfully: buy with intent, not impulse. Ask "Do I have 3 outfits I can make with this?" before buying. Invest in timeless pieces, not fast fashion.',
    icon: '🛍️',
  },
  {
    q: 'How to care for clothes and extend their life?',
    a: 'Read care labels. Wash inside-out on cold water for dark colors. Air dry when possible (dryers damage fabric). Use hangers, not folding for delicates. Invest in fabric shavers for pills. Proper care keeps clothes looking new longer.',
    icon: '🧺',
  },
  {
    q: 'What\'s the difference between trendy and timeless?',
    a: 'Timeless pieces: classics like white button-up, denim, blazer, plain t-shirts, trench coat. These work for decades. Trendy: bold colors, specific silhouettes, patterns. Use trendy as accents (scarves, jewelry) rather than basics.',
    icon: '⏰',
  },
  {
    q: 'How to dress professionally but still stylish?',
    a: 'Stick to neutral colors (black, white, grey, navy, brown). Opt for fitted, structured pieces. Add personality with accessories (watch, necklace, scarf). Avoid: overly bright colors, visible logos, inappropriate necklines. Quality fabrics matter.',
    icon: '💼',
  },
];

const STYLE_TIPS: Record<string, string[]> = {
  'Casual': [
    'Mix basics with trendy pieces for approachable style.',
    'Invest in comfortable but well-fitting jeans.',
    'Layer basics for depth and interest.',
    'Keep your vibe relaxed but intentional.',
  ],
  'Business': [
    'Stick to neutral color palettes (black, navy, grey, white).',
    'Invest in tailored blazers and dress pants.',
    'Prioritize quality over quantity.',
    'Keep jewelry minimal and professional.',
  ],
  'Creative': [
    'Express yourself through bold colors and patterns.',
    'Mix vintage with modern pieces.',
    'Experiment with unconventional combinations.',
    'Let your wardrobe tell your story.',
  ],
  'Sporty': [
    'Invest in quality athletic wear and sneakers.',
    'Mix activewear with casual basics.',
    'Keep accessories minimal and functional.',
    'Prioritize comfort with style.',
  ],
};

const DO_DONT_FASHION = {
  do: [
    'Invest in well-fitting basics (white tee, dark jeans)',
    'Wear colors that complement your undertone',
    'Keep jewelry simple and quality',
    'Try items on before buying',
    'Mix and match pieces intentionally',
  ],
  dont: [
    'Wear clothes that don\'t fit properly',
    'Ignore your body shape when shopping',
    'Buy first, think later (no impulse shopping)',
    'Mix too many patterns (max 2 per outfit)',
    'Prioritize trends over comfort and fit',
  ],
};

const Fashion: React.FC = () => {
  const navigate = useNavigate();
  const [fashionProfile, setFashionProfile] = useState<FashionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FashionTab>('outfits');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const data = localStorage.getItem('fashionProfile');
    if (data) {
      const parsed = JSON.parse(data);
      setFashionProfile(parsed.recommendations || parsed);
    }
    setLoading(false);
  }, []);

  const toggleCheck = (id: string) => {
    setChecklist(c => ({ ...c, [id]: !c[id] }));
  };

  if (loading) {
    return <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  if (!fashionProfile) {
    return (
      <div className="fashion-landing">
        {/* Navigation */}
        <nav className="fashion-nav">
          <div className="nav-container">
            <div className="nav-logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">GLOWIQ</span>
            </div>
            <div className="nav-links">
              <button onClick={() => navigate('/dashboard')} className="nav-link active">Home</button>
              <button onClick={() => navigate('/onboarding/fashion')} className="nav-link">Style Quiz</button>
              <button onClick={() => navigate('/onboarding/fashion')} className="nav-link">My Results</button>
              <button onClick={() => navigate('/profile')} className="nav-link">Profile</button>
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
                onClick={() => navigate('/onboarding/fashion')}
                className="btn-primary"
              >
                TAKE THE QUIZ <span className="btn-arrow">→</span>
              </button>
              <button 
                className="btn-secondary"
              >
                View My Results
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image">
            <div className="illustration-box">
              <div className="illustration">
                <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
                  {/* Head */}
                  <circle cx="150" cy="80" r="45" fill="#C8A882"/>
                  
                  {/* Hair */}
                  <ellipse cx="150" cy="50" rx="55" ry="40" fill="#2D1F14"/>
                  
                  {/* Body/Outfit */}
                  <rect x="100" y="130" width="100" height="120" rx="20" fill="#D4B5A0"/>
                  
                  {/* Glow indicator */}
                  <circle cx="300" cy="280" r="40" fill="none" stroke="#D4B5A0" strokeWidth="2" opacity="0.5"/>
                </svg>
              </div>
              <div className="glow-score-badge">
                <span className="score-icon">✨</span>
                <span className="score-text">Your Glow Score</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>
      {/* Navigation */}
      <nav style={{ background: 'white', boxShadow: '0 2px 8px rgba(31,21,19,0.08)', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
          >
            ←
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F1513', flex: 1, textAlign: 'center', margin: 0 }}>Your Style Guide 👗</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ padding: '10px 20px', background: '#A08070', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            Done
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px 60px' }}>
        {/* Hero Section */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '32px', boxShadow: '0 4px 16px rgba(160,128,112,0.1)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1F1513', marginBottom: '8px' }}>Your Personal Style Guide 👗</h1>
          <p style={{ fontSize: '15px', color: '#8B7355', marginBottom: '24px' }}>Style Score: <strong>{fashionProfile.styleScore}/100</strong></p>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#A08070', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Body Shape</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1F1513', margin: 0 }}>{fashionProfile.bodyStructure.split(' ')[0]}</p>
            </div>
            <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#A08070', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Personality</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1F1513', margin: 0 }}>{fashionProfile.personality || 'Elegant'}</p>
            </div>
            <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#A08070', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Budget Level</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1F1513', margin: 0 }}>{fashionProfile.budget || 'Mid'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #E8DDD2', marginBottom: '32px', overflowX: 'auto', paddingBottom: '0px' }}>
          {(['outfits', 'colors', 'wardrobe', 'accessories', 'trends', 'brands', 'capsule', 'questions'] as FashionTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #A08070' : 'none',
                marginBottom: '-2px',
                color: activeTab === tab ? '#A08070' : '#8B7355',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab === 'outfits' && '👗 Outfits'}
              {tab === 'colors' && '🎨 Colors'}
              {tab === 'wardrobe' && '👔 Wardrobe'}
              {tab === 'accessories' && '💍 Accessories'}
              {tab === 'trends' && '🔥 Trends'}
              {tab === 'brands' && '🏷 Brands'}
              {tab === 'capsule' && '📦 Capsule'}
              {tab === 'questions' && '❓ Q&A'}
            </button>
          ))}
        </div>

        {/* Outfits Tab */}
        {activeTab === 'outfits' && (
          <div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {fashionProfile.outfits.map((outfit, idx) => {
                const outfitId = `outfit-${idx}`;
                const isChecked = checklist[outfitId] || false;
                return (
                  <div
                    key={outfitId}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '18px',
                      display: 'grid',
                      gridTemplateColumns: '20px 1fr',
                      gap: '14px',
                      alignItems: 'start',
                      border: '1px solid #E8DDD2',
                      opacity: isChecked ? 0.5 : 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheck(outfitId)}
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
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ background: '#A08070', color: 'white', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#1F1513' }}>{outfit.name}</span>
                      </div>
                      <div style={{ display: 'grid', gap: '6px', marginLeft: '32px', fontSize: '12px', color: '#8B7355' }}>
                        <div><strong>Top:</strong> {outfit.top}</div>
                        <div><strong>Bottom:</strong> {outfit.bottom}</div>
                        <div><strong>Shoes:</strong> {outfit.shoes}</div>
                        <div><strong>Accessories:</strong> {outfit.accessories}</div>
                        {outfit.layering && <div><strong>Layering:</strong> {outfit.layering}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #E8DDD2' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1F1513', marginBottom: '12px', margin: '0 0 12px 0' }}>Your Color Palette</h3>
              <div style={{ display: 'grid', gap: '10px', fontSize: '12px' }}>
                <div>
                  <strong style={{ color: '#A08070' }}>Best Colors:</strong> {fashionProfile.colorPalette.bestColors.join(', ')}
                </div>
                <div>
                  <strong style={{ color: '#A08070' }}>Neutral Colors:</strong> {fashionProfile.colorPalette.neutrals.join(', ')}
                </div>
                <div>
                  <strong style={{ color: '#A08070' }}>Accent Colors:</strong> {fashionProfile.colorPalette.accents.join(', ')}
                </div>
                <div>
                  <strong style={{ color: '#E74C3C' }}>Avoid:</strong> {fashionProfile.colorPalette.avoid.join(', ')}
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#8B7355', marginTop: '16px', fontStyle: 'italic', padding: '12px', background: 'rgba(200, 168, 130, 0.1)', borderRadius: '8px', borderLeft: '3px solid #C8A882', margin: '16px 0 0 0' }}>
                {fashionProfile.colorPalette.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Wardrobe Tab */}
        {activeTab === 'wardrobe' && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {fashionProfile.essentialItems.map((item, idx) => {
              const itemId = `wardrobe-${idx}`;
              const isChecked = checklist[itemId] || false;
              return (
                <div
                  key={itemId}
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
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(itemId)}
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
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ background: '#A08070', color: 'white', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F1513' }}>{item}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Accessories Tab */}
        {activeTab === 'accessories' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #E8DDD2' }}>
            <div style={{ display: 'grid', gap: '12px', fontSize: '12px', color: '#8B7355' }}>
              <div>
                <strong style={{ color: '#A08070', display: 'block', marginBottom: '6px' }}>Watches</strong>
                {fashionProfile.accessoriesGuide.watches.join(', ')}
              </div>
              <div style={{ borderTop: '1px solid #E8DDD2', paddingTop: '12px' }}>
                <strong style={{ color: '#A08070', display: 'block', marginBottom: '6px' }}>Sunglasses</strong>
                {fashionProfile.accessoriesGuide.sunglasses.join(', ')}
              </div>
              <div style={{ borderTop: '1px solid #E8DDD2', paddingTop: '12px' }}>
                <strong style={{ color: '#A08070', display: 'block', marginBottom: '6px' }}>Bags</strong>
                {fashionProfile.accessoriesGuide.bags.join(', ')}
              </div>
              <div style={{ borderTop: '1px solid #E8DDD2', paddingTop: '12px' }}>
                <strong style={{ color: '#A08070', display: 'block', marginBottom: '6px' }}>Jewelry</strong>
                {fashionProfile.accessoriesGuide.jewelry.join(', ')}
              </div>
              <div style={{ borderTop: '1px solid #E8DDD2', paddingTop: '12px' }}>
                <strong style={{ color: '#A08070', display: 'block', marginBottom: '6px' }}>Belts</strong>
                {fashionProfile.accessoriesGuide.belts.join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {fashionProfile.trends.map((trend, idx) => (
              <div key={idx} style={{ background: 'white', borderRadius: '12px', padding: '14px', border: '1px solid #E8DDD2' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '18px' }}>🔥</span>
                  <div style={{ fontSize: '12px', color: '#8B7355', lineHeight: '1.5' }}>{trend}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #E8DDD2' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#27AE60', marginBottom: '10px', margin: '0 0 10px 0' }}>💰 Budget-Friendly</h3>
              <p style={{ fontSize: '12px', color: '#8B7355', margin: 0 }}>{fashionProfile.brandRecommendations.lowBudget.join(', ')}</p>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #E8DDD2' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#A08070', marginBottom: '10px', margin: '0 0 10px 0' }}>💎 Mid-Range</h3>
              <p style={{ fontSize: '12px', color: '#8B7355', margin: 0 }}>{fashionProfile.brandRecommendations.mediumBudget.join(', ')}</p>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #E8DDD2' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#F39C12', marginBottom: '10px', margin: '0 0 10px 0' }}>👑 Premium</h3>
              <p style={{ fontSize: '12px', color: '#8B7355', margin: 0 }}>{fashionProfile.brandRecommendations.premium.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Capsule Tab */}
        {activeTab === 'capsule' && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {fashionProfile.capsuleWardrobe.map((item, idx) => {
              const capsuleId = `capsule-${idx}`;
              const isChecked = checklist[capsuleId] || false;
              return (
                <div
                  key={capsuleId}
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
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(capsuleId)}
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
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ background: '#A08070', color: 'white', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F1513' }}>{item}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {FASHION_CARE_QA.map((qa, idx) => (
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
                {DO_DONT_FASHION.do.map((item, i) => (
                  <li key={i} style={{ fontSize: '12px', color: '#8B7355' }}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#E74C3C', marginBottom: '12px' }}>✗ Don't</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
                {DO_DONT_FASHION.dont.map((item, i) => (
                  <li key={i} style={{ fontSize: '12px', color: '#8B7355' }}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Style Tips */}
        <div style={{ marginTop: '32px', background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E8DDD2', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F1513', marginBottom: '6px' }}>Style Tips 💡</h2>
          <p style={{ fontSize: '13px', color: '#8B7355', marginBottom: '16px', margin: '0 0 16px 0' }}>Practical advice for your personal style journey</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {STYLE_TIPS['Casual']?.map((tip, i) => (
              <div key={i} style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E8DDD2' }}>
                <p style={{ fontSize: '12px', color: '#8B7355', lineHeight: '1.4', margin: 0 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Advice */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E8DDD2', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1F1513', marginBottom: '16px' }}>🔥 Personal Style Upgrade</h2>
          <p style={{ fontSize: '13px', color: '#8B7355', lineHeight: '1.6', fontStyle: 'italic' }}>
            {fashionProfile.styleAdvice}
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: '16px', background: 'rgba(160, 128, 112, 0.05)', borderRadius: '8px', border: '1px solid #E8DDD2', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', color: '#8B7355', lineHeight: '1.6', margin: 0 }}>
            This style guide is AI-generated based on your profile and is meant to inspire and guide you. Fashion is personal and subjective—wear what makes you feel confident!
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            onClick={() => navigate('/onboarding/fashion')}
            style={{ padding: '14px 20px', background: 'white', color: '#A08070', border: '2px solid #A08070', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            Retake Quiz
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ padding: '14px 20px', background: '#A08070', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            Back to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fashion;