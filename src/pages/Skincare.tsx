import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SkinType = 'Oily' | 'Dry' | 'Normal' | 'Combination' | 'Sensitive';
type Screen = 'welcome' | 'quiz' | 'result';

const QUESTIONS = [
  {
    id: 1,
    text: 'How does your skin feel a few hours after washing?',
    options: ['Oily & shiny', 'Tight or dry', 'Balanced & comfortable', 'Oily in T-zone, dry elsewhere', 'Irritated / sensitive'],
  },
  {
    id: 2,
    text: 'How do your pores usually look?',
    options: ['Large & visible', 'Small & barely visible', 'Visible only in some areas', 'Not sure'],
  },
  {
    id: 3,
    text: 'How often does your skin get oily?',
    options: ['Very often', 'Rarely', 'Only in certain areas', 'Almost never'],
  },
  {
    id: 4,
    text: 'How does your skin react to new products?',
    options: ['No problem', 'Sometimes breaks out', 'Gets irritated / red', 'Depends on product'],
  },
  {
    id: 5,
    text: 'What is your biggest skin concern?',
    options: ['Acne / pimples', 'Dryness / flakes', 'Excess oil', 'Redness / sensitivity', 'Dullness'],
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

    const result = Object.entries(scores).reduce((prev, [type, score]) =>
      score > (scores[prev] || 0) ? (type as SkinType) : prev
    );

    return result as SkinType;
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (newAnswers.length === QUESTIONS.length) {
      setLoading(true);
      setTimeout(() => {
        const type = calculateSkinType(newAnswers);
        setSkinType(type);
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
  };

  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* App bar */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center">
              G
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-gray-900 leading-tight">GlowUp</p>
              <p className="text-xs text-gray-500">Skin Analysis</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Single-screen content */}
        <div className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-2xl">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
              <p className="text-xs font-bold tracking-widest uppercase text-rose-600">Professional Skin Quiz</p>
              <h1 className="mt-2 text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Discover your skin type
              </h1>
              <p className="mt-3 text-gray-600 text-base md:text-lg leading-relaxed">
                Answer 5 quick questions and get a simple morning & night routine.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {['2 minutes', '5 questions', 'Instant routine'].map((t) => (
                  <div key={t} className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-center">
                    <p className="text-xs font-bold text-gray-900">{t}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartQuiz}
                className="mt-6 w-full px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-lg font-black"
              >
                Start Quiz
              </button>

              <p className="mt-3 text-xs text-gray-500 text-center">
                No images • No distractions • Just your result
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const question = QUESTIONS[currentIndex];
    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* App bar */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={handleRetake}
              className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 font-bold hover:bg-gray-200"
              aria-label="Back"
            >
              ←
            </button>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 leading-tight">Skin Analysis</p>
              <p className="text-xs text-gray-500">Question {currentIndex + 1} of {QUESTIONS.length}</p>
            </div>
            <div className="w-24 bg-gray-100 border border-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-rose-600" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-3xl">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
              <p className="text-xs font-bold tracking-widest uppercase text-rose-600">Select one</p>
              <h2 className="mt-2 text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {question.text}
              </h2>

              <div className="mt-6 grid gap-3">
                {question.options.map((option, idx) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-rose-50 hover:border-rose-200 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-sm font-black text-gray-700">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg md:text-xl font-black text-gray-900">{option}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Tap to continue</p>
                    </div>
                    <div className="text-gray-400 font-bold">›</div>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                <span>Fast • Simple • Professional</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 mx-auto flex items-center justify-center text-2xl">
              ✨
            </div>
            <p className="mt-4 text-xl font-black text-gray-900">Analyzing your skin…</p>
            <p className="mt-1 text-sm text-gray-500">Building your routine</p>
            <div className="mt-6 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-2/3 bg-rose-600 animate-pulse" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* App bar */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={handleRetake}
              className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 font-bold hover:bg-gray-200"
              aria-label="Back"
            >
              ←
            </button>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 leading-tight">Your Result</p>
              <p className="text-xs text-gray-500">Skin type + routine</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-2 rounded-xl bg-rose-600 text-white text-sm font-black hover:bg-rose-700"
            >
              Done
            </button>
          </div>
        </div>

        {/* Single-screen content */}
        <div className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-4xl">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-rose-600">Skin Type</p>
                  <h1 className="mt-1 text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                    {skinEmojis[skinType]} {skinType}
                  </h1>
                  <p className="mt-2 text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">
                    {skinDescriptions[skinType]}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full md:w-[340px]">
                  {tips.slice(0, 4).map((tip) => (
                    <div key={tip} className="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3">
                      <p className="text-xs font-bold text-rose-800">Tip</p>
                      <p className="text-sm font-semibold text-rose-900 mt-0.5 leading-snug">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-gray-900">🌞 Morning</h2>
                    <span className="text-xs font-bold text-gray-500">{routine.morning.length} steps</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {routine.morning.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-gray-900">🌙 Night</h2>
                    <span className="text-xs font-bold text-gray-500">{routine.night.length} steps</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {routine.night.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-gray-900 text-white text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleRetake}
                  className="px-6 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 font-black hover:bg-gray-50"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-4 rounded-2xl bg-rose-600 text-white font-black hover:bg-rose-700"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Skincare;
