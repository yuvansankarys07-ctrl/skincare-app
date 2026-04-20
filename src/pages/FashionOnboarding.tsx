import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/fashion-onboarding-new.css';

type FashionAnswers = {
  gender?: string;
  ageGroup?: string;
  height?: string;
  weight?: string;
  country?: string;
  bodyType?: string;
  bodyShape?: string;
  skinTone?: string;
  faceShape?: string;
  personality?: string;
  fashionStyles?: string[];
  favoriteColors?: string[];
  fitPreference?: string;
  profession?: string;
  outfitsNeeded?: string[];
  budget?: string;
  celebrity?: string;
};

type FashionScreen = 'welcome' | 'step1' | 'step2' | 'step3' | 'analysis' | 'result';

const DEFAULTS: FashionAnswers = {};

interface FashionRecommendation {
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
}

function generateFashionRecommendations(answers: FashionAnswers): FashionRecommendation {
  const bodyShape = (answers.bodyShape || '').toLowerCase();
  const personality = (answers.personality || '').toLowerCase();
  const budget = (answers.budget || '').toLowerCase();
  const skinTone = (answers.skinTone || '').toLowerCase();
  const profession = (answers.profession || '').toLowerCase();

  // Color palette based on skin tone
  const colorPalettes: Record<string, FashionRecommendation['colorPalette']> = {
    fair: {
      bestColors: ['Jewel tones (sapphire, emerald, ruby)', 'Cool pinks', 'Navy', 'Black'],
      neutrals: ['White', 'Light grey', 'Cream'],
      accents: ['Gold', 'Silver (both work well)'],
      avoid: ['Mustard yellow', 'Warm oranges'],
      explanation: 'Fair skin looks stunning with cool-toned colors that create contrast. Jewel tones especially enhance your natural complexion.'
    },
    medium: {
      bestColors: ['Warm neutrals (camel, tan)', 'Coral', 'Peach', 'Olive green', 'Warm reds'],
      neutrals: ['Beige', 'Taupe', 'Ivory'],
      accents: ['Gold', 'Bronze'],
      avoid: ['Cool greys', 'Ice blue'],
      explanation: 'Medium skin tones shine with warm, earthy colors. These naturally complement your complexion and create harmony.'
    },
    olive: {
      bestColors: ['Chartreuse', 'Olive green', 'Warm browns', 'Golden yellows', 'Warm reds'],
      neutrals: ['Olive', 'Caramel', 'Warm grey'],
      accents: ['Gold', 'Copper'],
      avoid: ['Cool blacks', 'Silver against skin'],
      explanation: 'Olive undertones pair beautifully with warm and earthy hues. Rich jewel tones also work wonderfully for you.'
    },
    brown: {
      bestColors: ['Warm reds', 'Burgundy', 'Orange', 'Yellow', 'Gold'],
      neutrals: ['Brown', 'Tan', 'Camel'],
      accents: ['Gold', 'Copper'],
      avoid: ['Light pastels', 'Cool greys'],
      explanation: 'Darker skin tones make bold, warm colors pop beautifully. Don\'t shy away from rich, vibrant hues.'
    },
    dark: {
      bestColors: ['Bright jewel tones', 'White', 'Red', 'Electric blues', 'Deep purples'],
      neutrals: ['Black', 'Charcoal', 'White'],
      accents: ['Gold', 'Bold metallics'],
      avoid: ['Muted pastels', 'Washed-out colors'],
      explanation: 'Deep skin tones are perfect for bold statement colors and high contrast. Embrace vibrant shades that make you stand out.'
    }
  };

  const selectedPalette = colorPalettes[skinTone] || colorPalettes.medium;

  // Outfit suggestions based on body shape
  const outfitSuggestions: Record<string, Array<{ name: string; top: string; bottom: string; shoes: string; accessories: string; layering?: string }>> = {
    rectangle: [
      { name: 'Belted Casual', top: 'Oversized button-up shirt', bottom: 'Wide-leg trousers', shoes: 'White sneakers', accessories: 'Structured handbag, belt', layering: 'Long cardigan' },
      { name: 'Smart Casual', top: 'Fitted sweater', bottom: 'Straight-leg jeans', shoes: 'Loafers or flats', accessories: 'Minimal necklace, small crossbody bag' },
      { name: 'Evening Look', top: 'Blouse with asymmetrical cut', bottom: 'Pencil skirt with slit', shoes: 'Heeled sandals', accessories: 'Statement earrings, clutch' },
      { name: 'Weekend Vibe', top: 'Crop top (with high-waisted bottom)', bottom: 'High-waisted jeans', shoes: 'Platform sneakers', accessories: 'Oversized blazer, bucket hat' },
      { name: 'Professional', top: 'Structured blazer', bottom: 'Tailored trousers', shoes: 'Heeled boots', accessories: 'Watch, minimalist jewelry' }
    ],
    triangle: [
      { name: 'Balance Elegance', top: 'Horizontal stripe or pattern', bottom: 'Wide-leg pants', shoes: 'Pointed flats', accessories: 'Bold necklace, minimalist bag' },
      { name: 'Modern Casual', top: 'A-line blouse', bottom: 'Flared skirt', shoes: 'Ankle boots', accessories: 'Scarf, crossbody bag' },
      { name: 'Date Night', top: 'Off-shoulder top', bottom: 'Maxi skirt', shoes: 'Heels', accessories: 'Statement rings, small clutch' },
      { name: 'Street Style', top: 'Oversized tee', bottom: 'Cargo pants (wide leg)', shoes: 'Sneakers', accessories: 'Chunky jewelry, backpack' },
      { name: 'Office Professional', top: 'Peplum top or textured blouse', bottom: 'Pencil skirt', shoes: 'Kitten heels', accessories: 'Gold watch, structured bag' }
    ],
    inverted_triangle: [
      { name: 'Sleek Chic', top: 'V-neck top', bottom: 'Wide-leg pants', shoes: 'Mules', accessories: 'Layered necklaces, tote' },
      { name: 'Boho Vibes', top: 'Lightweight tank', bottom: 'Flowing maxi skirt', shoes: 'Sandals', accessories: 'Long necklace, fringe bag' },
      { name: 'Formal Affair', top: 'One-shoulder gown or wrap top', bottom: 'A-line gown or skirt', shoes: 'Strappy heels', accessories: 'Statement earrings, clutch' },
      { name: 'Casual Cool', top: 'Racerback tank', bottom: 'Cargo shorts', shoes: 'Slide sandals', accessories: 'Minimalist watch, crossbody' },
      { name: 'Workwear', top: 'Structured blazer', bottom: 'Tailored ankle pants', shoes: 'Loafers', accessories: 'Belt, handbag' }
    ],
    oval: [
      { name: 'Wrap Elegance', top: 'Wrap top or crossover', bottom: 'Straight jeans', shoes: 'Ankle boots', accessories: 'Scarves, pendant necklace' },
      { name: 'Layered Look', top: 'Long cardigan over fitted tee', bottom: 'Leggings or skinny jeans', shoes: 'Sneakers', accessories: 'Stacked rings, tote' },
      { name: 'Evening Sophistication', top: 'Ruched side blouse', bottom: 'Black pants or skirt', shoes: 'Heels', accessories: 'Statement bracelet, clutch' },
      { name: 'Summer Casual', top: 'Lightweight blouse', bottom: 'Midi skirt', shoes: 'Flats or sandals', accessories: 'Sunglasses, woven bag' },
      { name: 'Power Dressing', top: 'Tailored blazer', bottom: 'Trousers', shoes: 'Heeled loafers', accessories: 'Flag necklace, structured bag' }
    ],
    hourglass: [
      { name: 'Fitted Glamour', top: 'Fitted blouse or bodysuit', bottom: 'Pencil skirt or fitted jeans', shoes: 'Heels', accessories: 'Waist belt, structured bag' },
      { name: 'Casual Chic', top: 'Fitted sweater', bottom: 'Wide-leg trousers', shoes: 'Loafers', accessories: 'Subtle jewelry, crossbody bag' },
      { name: 'Night Out', top: 'Bodycon dress or fitted top', bottom: 'Pencil skirt or slim pants', shoes: 'Pumps', accessories: 'Statement necklace, clutch' },
      { name: 'Relaxed Weekend', top: 'Fitted tee', bottom: 'High-waisted shorts', shoes: 'Sneakers', accessories: 'Denim jacket, oversized sunglasses' },
      { name: 'Professional Style', top: 'Fitted knit top', bottom: 'Tailored pants', shoes: 'Pointed flats', accessories: 'Delicate gold jewelry, handbag' }
    ]
  };

  const selectedOutfits = outfitSuggestions[bodyShape] || outfitSuggestions.hourglass;

  // Essential wardrobe items
  const essentials = [
    'White button-up shirt - The foundation piece',
    'Dark jeans - Versatile and slimming',
    'Neutral blazer - Instant professionalism',
    'Plain white t-shirt - Timeless essential',
    'Black trousers - Formal yet wearable',
    'Neutral sweater - Comfort meets style',
    'Basic black shoes - Flat or heel',
    'Casual sneakers - Comfort for everyday',
    'Neutral cardigan - Layering essential',
    'Well-fitting jeans (lighter shade) - Casual wear'
  ];

  // Fashion trends
  const trends = [
    'Relaxed tailoring - Slightly oversized blazers and pants',
    'Minimal layering - Tank tops under open shirts',
    'Monochrome outfits - Head-to-toe one color',
    'Quality basics - Investing in neutral staples',
    'Sustainable fashion - Choosing quality over quantity',
    'Comfort-first styling - Fashion that\'s breathable and functional'
  ];

  // Grooming tips based on profession
  const groomingTips = [
    'Regular haircuts every 6-8 weeks for a polished look',
    'Keep eyebrows groomed and defined',
    `${profession.includes('office') ? 'Maintain professional manicure, subtle nail polish' : 'Express creativity through nail art or colors'}`,
    'Skincare routine appropriate for your skin type',
    'Teeth whitening or maintenance for confidence',
    'Choose deodorant and subtle cologne/perfume',
    'Regular body care routine (moisturizing, exfoliation)'
  ];

  // Style mistakes to avoid
  const mistakesToAvoid = [
    `Ignoring your body shape - Wear styles that complement your natural proportions`,
    `Wearing clothes too large or too tight - Fit is everything`,
    `Clashing patterns without intention - Limit bold patterns to one piece per outfit`,
    `Neglecting proper undergarments - They make or break an outfit`,
    `Ignoring color theory - Wear colors that complement your skin tone`
  ];

  // Brand recommendations
  const brands: Record<string, FashionRecommendation['brandRecommendations']> = {
    low: {
      lowBudget: ['H&M', 'Uniqlo', 'ASOS', 'Zara (sale section)', 'Shein'],
      mediumBudget: ['Mango', 'COS', 'Gap', 'J.Crew', 'Banana Republic'],
      premium: ['This is unlikely for low budget']
    },
    medium: {
      lowBudget: ['H&M', 'Zara', 'ASOS', 'Uniqlo'],
      mediumBudget: ['Mango', 'COS', 'J.Crew', 'Banana Republic', 'Everlane'],
      premium: ['Theory', 'Club Monaco', 'Reiss']
    },
    premium: {
      lowBudget: ['Outlet stores', 'Vintage luxury'],
      mediumBudget: ['Mango', 'Everlane', 'J.Crew', 'Banana Republic'],
      premium: ['Gucci', 'Prada', 'Designer brands', 'Luxury department stores']
    }
  };

  const selectedBrands = brands[budget] || brands.medium;

  // Capsule wardrobe 
  const capsuleWardrobe = [
    '5 neutral tops (white, black, beige, grey, navy)',
    '3 bottoms (dark jeans, tailored trousers, neutral skirt/shorts)',
    '2 lightweight layers (cardigan, blazer)',
    '2 pairs neutral shoes (flats, heels)',
    '1 pair sneakers',
    '1 statement jacket or leather jacket',
    '3-5 accessories (scarves, belts, bags)',
    'Basic undergarments in neutral colors',
    'One statement piece for personality',
    'Weather-appropriate outerwear'
  ];

  // Calculate style score
  const styleScore = Math.min(100, 50 + (answers.fashionStyles?.length || 0) * 10 + (answers.personality ? 15 : 0));

  return {
    bodyStructure: `Based on your ${bodyShape} body shape, focus on styles that ${
      bodyShape === 'hourglass' ? 'highlight your curves with fitted clothing' :
      bodyShape === 'rectangle' ? 'add dimension with patterns and textures' :
      bodyShape === 'triangle' ? 'balance your proportions with wider tops' :
      bodyShape === 'inverted_triangle' ? 'draw attention downward with bold bottoms' :
      'create balanced proportions with strategic layering'
    }. The best cuts for you are ${
      bodyShape === 'hourglass' ? 'wrap dresses, fitted silhouettes, belted styles' :
      bodyShape === 'rectangle' ? 'peplum tops, ruched details, structured pieces' :
      bodyShape === 'triangle' ? 'A-line skirts, wide-leg pants, textured tops' :
      bodyShape === 'inverted_triangle' ? 'wide-leg pants, flared skirts, horizontal stripes below waist' :
      'wrap tops, balanced silhouettes, strategic layering'
    }.`,
    colorPalette: selectedPalette,
    outfits: selectedOutfits.slice(0, 5),
    essentialItems: essentials,
    trends: trends,
    groomingTips: groomingTips,
    accessoriesGuide: {
      watches: ['Minimalist digital', 'Classic analog', 'Sporty watch', 'Statement luxury watch'],
      sunglasses: ['Cat-eye frames', 'Oversized squares', 'Round aviators', 'Colored frames'],
      bags: profession.includes('office') ? ['Structured tote', 'Laptop bag', 'Clutch', 'Crossbody'] : ['Backpack', 'Crossbody', 'Tote', 'Bucket bag'],
      jewelry: ['Layered delicate necklaces', 'Stacking rings', 'Statement earrings', 'Minimal bangles'],
      belts: ['Statement buckle', 'Woven belt', 'Leather belt', 'Chain belt']
    },
    brandRecommendations: selectedBrands,
    capsuleWardrobe: capsuleWardrobe,
    mistakesToAvoid: mistakesToAvoid,
    styleScore: Math.round(styleScore),
    styleAdvice: `You have a ${personality} style personality. Embrace pieces that make you feel confident and comfortable. Remember, the best outfit is one that reflects who you are. Invest in quality basics, add personality through accessories, and don't be afraid to experiment. Your style journey is unique to you!`
  };
}

const FashionOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<FashionScreen>('welcome');
  const [answers, setAnswers] = useState<FashionAnswers>(DEFAULTS);
  const [result, setResult] = useState<FashionRecommendation | null>(null);

  useEffect(() => {
    if (currentScreen === 'analysis') {
      const t = setInterval(() => {
        setTimeout(() => {
          const r = generateFashionRecommendations(answers);
          setResult(r);
          setCurrentScreen('result');
          clearInterval(t);
        }, 1500);
      }, 100);
      return () => clearInterval(t);
    }
  }, [currentScreen, answers]);

  const handleNext = () => {
    const screens: FashionScreen[] = ['welcome', 'step1', 'step2', 'step3', 'analysis', 'result'];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex < screens.length - 1) {
      setCurrentScreen(screens[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const screens: FashionScreen[] = ['welcome', 'step1', 'step2', 'step3', 'analysis', 'result'];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex > 0) {
      setCurrentScreen(screens[currentIndex - 1]);
    }
  };

  // Show welcome hero screen
  if (currentScreen === 'welcome') {
    return (
      <div className="fashion-landing">
        <nav className="fashion-nav">
          <div className="fashion-nav-container">
            <div className="fashion-nav-logo">
              <span>👗</span>
              <span>STYLEIQ</span>
            </div>
            <div className="fashion-nav-links">
              <button onClick={() => navigate('/dashboard')} className="fashion-nav-link active">Home</button>
              <button onClick={() => navigate('/onboarding/fashion')} className="fashion-nav-link">Fashion Quiz</button>
              <button onClick={() => navigate('/onboarding/fashion')} className="fashion-nav-link">My Results</button>
              <button onClick={() => navigate('/fashion')} className="fashion-nav-link">Profile</button>
            </div>
          </div>
        </nav>

        <section className="fashion-hero-container">
          <div className="fashion-hero-content">
            <div className="fashion-badge">
              <span>✨</span>
              <span>AI-Powered Fashion Intelligence</span>
            </div>

            <h1 className="fashion-hero-title">
              Discover Your<br />
              <span className="highlight">Perfect Fashion Style</span>
            </h1>

            <p className="fashion-hero-description">
              Unlock personalized fashion recommendations designed specifically for your body type, skin tone, personality, and lifestyle. Build a wardrobe you'll love.
            </p>

            <div className="fashion-cta-buttons">
              <button onClick={handleNext} className="fashion-btn-primary">
                Start Style Analysis <span>→</span>
              </button>
              <button onClick={() => navigate('/fashion')} className="fashion-btn-secondary">
                View My Results
              </button>
            </div>
          </div>

          <div className="fashion-hero-image">
            <div className="fashion-image-placeholder">
              <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fashionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C8A882" />
                    <stop offset="100%" stopColor="#A67C6D" />
                  </linearGradient>
                </defs>
                {/* Dress/Fashion silhouette */}
                <path
                  d="M 200 80 L 240 140 L 240 300 Q 240 380 200 400 Q 160 380 160 300 L 160 140 Z"
                  fill="url(#fashionGrad)"
                  opacity="0.8"
                />
                {/* Arms */}
                <path
                  d="M 240 160 L 280 200 L 270 280"
                  stroke="url(#fashionGrad)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 160 160 L 120 200 L 130 280"
                  stroke="url(#fashionGrad)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Head */}
                <circle cx="200" cy="100" r="25" fill="url(#fashionGrad)" opacity="0.6" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    const profileData = {
      ...answers,
      recommendations: result
    };
    localStorage.setItem('fashionProfile', JSON.stringify(profileData));
    
    // Also save to userData in localStorage
    try {
      const existing = localStorage.getItem('userData');
      const prev = existing ? JSON.parse(existing) : {};
      const payload = { ...prev, fashionProfile: profileData };
      localStorage.setItem('userData', JSON.stringify(payload));
    } catch (e) {
      console.error('Error updating userData:', e);
    }
    
    // Save to backend database
    const token = localStorage.getItem('token');
    if (token && result) {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/auth/quiz/fashion`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fashionProfile: profileData,
            fashionQuiz: answers
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fashion quiz saved to database:', data);
        } else {
          console.error('Failed to save fashion quiz to database');
        }
      } catch (apiError) {
        console.error('API error saving fashion quiz:', apiError);
      }
    }
    
    navigate('/fashion');
  };

  // Show quiz container for all quiz screens
  if (['step1', 'step2', 'step3', 'analysis'].includes(currentScreen)) {
    return (
      <div className="fashion-quiz-container">
        <div className="fashion-quiz-header">
          <button onClick={() => setCurrentScreen('welcome')} className="fashion-back-btn">←</button>
          <div className="fashion-progress-info">
            <div className="fashion-question-counter">
              Step {['step1', 'step2', 'step3'].indexOf(currentScreen) + 1} of 3
            </div>
            <div className="fashion-progress-bar">
              <div 
                className="fashion-progress-fill"
                style={{
                  width: currentScreen === 'step1' ? '33%' :
                         currentScreen === 'step2' ? '66%' :
                         currentScreen === 'step3' ? '100%' : '0%'
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="fashion-quiz-content">
          <div className="fashion-quiz-card">
            {currentScreen === 'step1' && (
              <>
                <h2 className="fashion-question-title">👤 Personal Information</h2>
                <p className="fashion-question-subtitle">Let's start with the basics</p>
                
                <div className="fashion-options-grid">
                  <div className="fashion-question-group">
                    <label className="fashion-field-label">👥 Gender</label>
                    <div className="fashion-pills">
                      {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.gender === opt ? 'fashion-pill-selected' : ''}`} 
                          onClick={() => setAnswers({...answers, gender: opt})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">🎂 Age Group</label>
                    <div className="fashion-pills">
                      {['Under 18', '18-25', '26-35', '36-50', '50+'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.ageGroup === opt ? 'fashion-pill-selected' : ''}`}
                          onClick={() => setAnswers({...answers, ageGroup: opt})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">💪 Body Type</label>
                    <div className="fashion-pills">
                      {['Slim', 'Athletic', 'Average', 'Muscular', 'Plus-size'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.bodyType === opt ? 'fashion-pill-selected' : ''}`}
                          onClick={() => setAnswers({...answers, bodyType: opt})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">⭐ Body Shape</label>
                    <div className="fashion-pills">
                      {['Rectangle', 'Triangle', 'Inverted Triangle', 'Oval', 'Hourglass'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.bodyShape === opt.toLowerCase().replace(' ', '_') ? 'fashion-pill-selected' : ''}`}
                          onClick={() => setAnswers({...answers, bodyShape: opt.toLowerCase().replace(' ', '_')})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">✨ Skin Tone</label>
                    <div className="fashion-pills">
                      {['Fair', 'Medium', 'Olive', 'Brown', 'Dark'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.skinTone === opt.toLowerCase() ? 'fashion-pill-selected' : ''}`}
                          onClick={() => setAnswers({...answers, skinTone: opt.toLowerCase()})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">😊 Face Shape</label>
                    <div className="fashion-pills">
                      {['Oval', 'Round', 'Square', 'Heart', 'Diamond'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.faceShape === opt ? 'fashion-pill-selected' : ''}`}
                          onClick={() => setAnswers({...answers, faceShape: opt})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentScreen === 'step2' && (
              <>
                <h2 className="fashion-question-title">🎨 Personality & Style</h2>
                <p className="fashion-question-subtitle">Tell us about your aesthetic</p>
                
                <div className="fashion-options-grid">
                  <div className="fashion-question-group">
                    <label className="fashion-field-label">✨ Your Style Personality</label>
                    <div className="fashion-pills">
                      {['Minimalist', 'Classic', 'Trendy', 'Bold', 'Sporty'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.personality === opt ? 'fashion-pill-selected' : ''}`}
                          onClick={() => setAnswers({...answers, personality: opt})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">🎯 Fashion Styles</label>
                    <div className="fashion-pills">
                      {['Casual', 'Business', 'Streetwear', 'Boho', 'Elegant'].map(opt => (
                        <button 
                          key={opt} 
                          className={`fashion-pill ${(answers.fashionStyles || []).includes(opt) ? 'fashion-pill-selected' : ''}`}
                          onClick={() => {
                            const styles = answers.fashionStyles || [];
                            setAnswers({
                              ...answers,
                              fashionStyles: styles.includes(opt) 
                                ? styles.filter(s => s !== opt)
                                : [...styles, opt]
                            });
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">🎨 Favorite Colors</label>
                    <div className="fashion-pills">
                      {['Neutrals', 'Pastels', 'Vibrant', 'Jewel Tones', 'Earth Tones'].map(opt => (
                        <button 
                          key={opt}
                          className={`fashion-pill ${(answers.favoriteColors || []).includes(opt) ? 'fashion-pill-selected' : ''}`}
                          onClick={() => {
                            const colors = answers.favoriteColors || [];
                            setAnswers({
                              ...answers,
                              favoriteColors: colors.includes(opt)
                                ? colors.filter(c => c !== opt)
                                : [...colors, opt]
                            });
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">👔 Profession</label>
                    <div className="fashion-pills">
                      {['Office', 'Creative', 'Healthcare', 'Retail', 'Other'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.profession === opt ? 'fashion-pill-selected' : ''}`}
                          onClick={() => setAnswers({...answers, profession: opt})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">💰 Budget</label>
                    <div className="fashion-pills">
                      {['low', 'medium', 'premium'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.budget === opt ? 'fashion-pill-selected' : ''}`}
                          onClick={() => setAnswers({...answers, budget: opt})}>
                          {opt === 'low' ? '💵 Budget' : opt === 'medium' ? '💵💵 Moderate' : '💵💵💵 Premium'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentScreen === 'step3' && (
              <>
                <h2 className="fashion-question-title">👕 Preferences</h2>
                <p className="fashion-question-subtitle">Final preferences</p>
                
                <div className="fashion-options-grid">
                  <div className="fashion-question-group">
                    <label className="fashion-field-label">👗 Fit Preference</label>
                    <div className="fashion-pills">
                      {['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Oversized'].map(opt => (
                        <button key={opt} className={`fashion-pill ${answers.fitPreference === opt ? 'fashion-pill-selected' : ''}`}
                          onClick={() => setAnswers({...answers, fitPreference: opt})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fashion-question-group">
                    <label className="fashion-field-label">🎽 Outfits Needed</label>
                    <div className="fashion-pills">
                      {['Casual', 'Work', 'Evening', 'Athletic'].map(opt => (
                        <button 
                          key={opt}
                          className={`fashion-pill ${(answers.outfitsNeeded || []).includes(opt) ? 'fashion-pill-selected' : ''}`}
                          onClick={() => {
                            const outfits = answers.outfitsNeeded || [];
                            setAnswers({
                              ...answers,
                              outfitsNeeded: outfits.includes(opt)
                                ? outfits.filter(o => o !== opt)
                                : [...outfits, opt]
                            });
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="fashion-button-group">
              <button className="fashion-btn-secondary" onClick={handlePrev}>Back</button>
              <button 
                className="fashion-btn-primary" 
                onClick={() => {
                  if (currentScreen === 'step3') {
                    setCurrentScreen('analysis');
                  } else {
                    handleNext();
                  }
                }}>
                {currentScreen === 'step3' ? 'Analyze Style' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (currentScreen === 'result' && result) {
    return (
      <div className="fashion-result-container">
        <div className="fashion-result-header">
          <button onClick={() => navigate('/fashion')} className="fashion-result-back">← Back</button>
          <h1>Your Fashion Profile</h1>
        </div>
        <div className="fashion-result-content">
          {/* Result content will be displayed on the main Fashion page */}
          <button onClick={handleSaveProfile} className="fashion-btn-primary" style={{ marginTop: '24px' }}>
            Save & View Results
          </button>
          <button onClick={() => setCurrentScreen('welcome')} className="fashion-btn-secondary" style={{ marginTop: '12px' }}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default FashionOnboarding;
