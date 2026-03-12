const form = document.getElementById('fashion-form');
const resultsSection = document.getElementById('results');
const profileSummary = document.getElementById('profile-summary');
const paletteGrid = document.getElementById('palette-grid');
const outfitGrid = document.getElementById('outfit-grid');
const hairstyleGrid = document.getElementById('hairstyle-grid');
const tipsList = document.getElementById('tips-list');
const questionNumber = document.getElementById('quiz-question-number');
const questionText = document.getElementById('quiz-question-text');
const optionsContainer = document.getElementById('quiz-options');
const stepLabel = document.getElementById('quiz-step-label');
const progressFill = document.getElementById('quiz-progress-fill');
const previousButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const quizHelperText = document.getElementById('quiz-helper-text');
const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const cameraPlaceholder = document.getElementById('camera-placeholder');
const startCameraButton = document.getElementById('start-camera-btn');
const scanFaceButton = document.getElementById('scan-face-btn');
const stopCameraButton = document.getElementById('stop-camera-btn');
const cameraStatus = document.getElementById('camera-status');
const cameraResult = document.getElementById('camera-result');

const questions = [
  {
    name: 'gender',
    prompt: 'Which gender should your recommendations be based on?',
    options: ['Woman', 'Man'],
  },
  {
    name: 'skinTone',
    prompt: 'What is your skin tone?',
    options: ['Very Fair', 'Fair', 'Medium', 'Wheatish', 'Brown', 'Dark'],
  },
  {
    name: 'undertone',
    prompt: 'What is your undertone?',
    options: ['Warm', 'Cool', 'Neutral', 'Not sure'],
  },
  {
    name: 'faceShape',
    prompt: 'What is your face shape?',
    options: ['Oval', 'Round', 'Square', 'Heart', 'Diamond'],
  },
  {
    name: 'hairType',
    prompt: 'What is your hair type?',
    options: ['Straight', 'Wavy', 'Curly', 'Coily'],
  },
  {
    name: 'hairLength',
    prompt: 'How long is your hair right now?',
    options: ['Short', 'Medium', 'Long'],
  },
  {
    name: 'bodyType',
    prompt: 'Which body type feels closest to you?',
    options: ['Slim', 'Athletic', 'Average', 'Curvy'],
  },
  {
    name: 'fashionStyle',
    prompt: 'Which fashion style do you want most?',
    options: ['Casual', 'Formal', 'Streetwear', 'Minimal', 'Ethnic', 'Trendy'],
  },
  {
    name: 'occasion',
    prompt: 'What occasion are you dressing for?',
    options: ['Daily wear', 'College', 'Office', 'Party', 'Wedding'],
  },
];

const answers = {};
let currentQuestionIndex = 0;
let detectedFaceShape = null;
let cameraStream = null;
let faceLandmarker = null;
let faceLandmarkerPromise = null;

const faceShapeQuestionIndex = questions.findIndex((question) => question.name === 'faceShape');

const faceShapeProfiles = [
  { name: 'Oval', lengthRatio: 1.46, foreheadRatio: 0.88, jawRatio: 0.8 },
  { name: 'Round', lengthRatio: 1.15, foreheadRatio: 0.94, jawRatio: 0.92 },
  { name: 'Square', lengthRatio: 1.22, foreheadRatio: 0.95, jawRatio: 0.95 },
  { name: 'Heart', lengthRatio: 1.42, foreheadRatio: 0.98, jawRatio: 0.72 },
  { name: 'Diamond', lengthRatio: 1.4, foreheadRatio: 0.82, jawRatio: 0.74 },
];

const paletteBySkinTone = {
  'Very Fair': ['#8A9A5B|Olive Green', '#1F2A44|Navy Blue', '#6A1E3A|Burgundy', '#F9F3E5|Cream', '#E6D3B3|Beige', '#D4A017|Mustard'],
  Fair: ['#1E3A5F|Steel Blue', '#A0522D|Rust', '#2F5D50|Teal', '#F7E7CE|Champagne', '#B7410E|Terracotta', '#7B3F00|Mocha'],
  Medium: ['#556B2F|Olive', '#4A1C40|Plum', '#3B2F2F|Espresso', '#F5E6CC|Sand', '#A31621|Wine Red', '#D9A441|Honey'],
  Wheatish: ['#003153|Prussian Blue', '#7C0A02|Deep Red', '#C19A6B|Camel', '#36454F|Charcoal', '#F3D9B1|Warm Beige', '#4F6D4A|Moss Green'],
  Brown: ['#6B8E23|Olive Drab', '#0F4C5C|Petrol Blue', '#8B5E3C|Cocoa', '#D8B48A|Caramel', '#800020|Maroon', '#E1AD01|Amber'],
  Dark: ['#005F73|Deep Teal', '#9B2226|Crimson', '#1D3557|Royal Navy', '#E9C46A|Golden Sand', '#6D597A|Mulberry', '#BC6C25|Bronze'],
};

const outfitsByGenderAndStyle = {
  Woman: {
    Casual: [
      card('Soft Casual Set', 'Beige knit top with straight-leg jeans and low-top sneakers.', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'),
      card('Layered Weekend Look', 'White tank, open overshirt, and relaxed trousers.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'),
      card('Easy Day Outfit', 'Ribbed tee with denim skirt or jeans and clean accessories.', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'),
      card('City Casual', 'Soft cardigan with neutral pants and compact crossbody styling.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80'),
    ],
    Formal: [
      card('Structured Formal Look', 'Tailored blazer with wide-leg trousers and a silk inner layer.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'),
      card('Business Classic', 'Fitted suit set in charcoal or navy with pointed flats.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'),
      card('Elegant Office Dress', 'Structured midi dress with a camel trench.', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=900&q=80'),
      card('Polished Minimal', 'Monochrome co-ord with slim belt accents.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'),
    ],
    Streetwear: [
      card('Streetwear Core', 'Oversized hoodie with cargos and statement sneakers.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80'),
      card('Urban Layer', 'Graphic tee under a bomber with loose denim.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'),
      card('Sport Luxe', 'Track jacket over monochrome basics and a mini bag.', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'),
      card('Cargo Statement', 'Wide-leg cargos with a cropped jacket and chunky soles.', 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80'),
    ],
    Minimal: [
      card('Minimal Set', 'Neutral blouse with straight trousers and simple gold accents.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80'),
      card('Monotone Look', 'Ivory knit and tailored beige bottoms.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'),
      card('Simple Office', 'Black blazer with a cream inner layer and slim loafers.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'),
      card('Refined Casual', 'Solid tee with clean denim and structured tote styling.', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'),
    ],
    Ethnic: [
      card('Ethnic Daywear', 'Handloom kurta set with muted dupatta styling.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'),
      card('Festive Ethnic', 'Embroidered suit set with tonal jewelry.', 'https://images.unsplash.com/photo-1616847220575-31ea0dbd31f0?auto=format&fit=crop&w=900&q=80'),
      card('Classic Fusion', 'Printed top with palazzos and low-key festive footwear.', 'https://images.unsplash.com/photo-1610030469668-90f58f0d5a4d?auto=format&fit=crop&w=900&q=80'),
      card('Elegant Saree', 'Lightweight saree with a contrast blouse and refined drape.', 'https://images.unsplash.com/photo-1602810319428-019690571b5b?auto=format&fit=crop&w=900&q=80'),
    ],
    Trendy: [
      card('Trendy Layering', 'Cropped jacket with cargo skirt or loose-fit denim.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80'),
      card('Color Pop Fit', 'Statement top with wide-leg jeans and sharp accessories.', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=900&q=80'),
      card('Smart Partywear', 'Satin shirt with bold earrings and sleek heels.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'),
      card('Runway Casual', 'Structured blazer over sporty basics with a fashion-forward bag.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'),
    ],
  },
  Man: {
    Casual: [
      card('Relaxed Casual Fit', 'Beige overshirt with blue jeans and white sneakers.', 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80'),
      card('Weekend Layering', 'Crew tee with open shirt jacket and tapered chinos.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80'),
      card('Clean Everyday Look', 'Henley tee with straight denim and suede trainers.', 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80'),
      card('City Comfort', 'Soft polo with neutral trousers and loafers.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'),
    ],
    Formal: [
      card('Tailored Formal Suit', 'Navy blazer with crisp shirt and slim tailored pants.', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80'),
      card('Business Classic', 'Charcoal suit and pastel shirt with leather derbies.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'),
      card('Elegant Office', 'Structured band-collar shirt with pleated trousers.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'),
      card('Polished Minimal', 'Monochrome blazer pairing with clean leather belt accents.', 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80'),
    ],
    Streetwear: [
      card('Streetwear Core', 'Oversized hoodie with cargos and high-top sneakers.', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'),
      card('Urban Layer', 'Graphic tee with bomber jacket and joggers.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'),
      card('Sport Luxe', 'Track jacket over monochrome basics.', 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80'),
      card('Cargo Statement', 'Wide-leg cargos with utility vest and chunky sneakers.', 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80'),
    ],
    Minimal: [
      card('Minimal Set', 'Neutral shirt with slim trousers and clean white sneakers.', 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80'),
      card('Monotone Look', 'Ivory knit polo with tailored beige bottoms.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80'),
      card('Simple Office', 'Black blazer with cream shirt and polished loafers.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'),
      card('Refined Casual', 'Solid tee with straight denim and understated watch styling.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80'),
    ],
    Ethnic: [
      card('Ethnic Daywear', 'Handloom kurta with tapered pajama and sandals.', 'https://images.unsplash.com/photo-1602810319428-019690571b5b?auto=format&fit=crop&w=900&q=80'),
      card('Festive Ethnic', 'Embroidered Nehru jacket over a solid kurta.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'),
      card('Classic Fusion', 'Printed short kurta with trousers and loafers.', 'https://images.unsplash.com/photo-1616847220575-31ea0dbd31f0?auto=format&fit=crop&w=900&q=80'),
      card('Elegant Celebration Look', 'Rich-texture kurta set with a contrast stole.', 'https://images.unsplash.com/photo-1610030469668-90f58f0d5a4d?auto=format&fit=crop&w=900&q=80'),
    ],
    Trendy: [
      card('Trend-Forward Layering', 'Boxy jacket with loose-fit trousers and statement sneakers.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'),
      card('Color Pop Fit', 'Accent overshirt with relaxed denim and bold frames.', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=900&q=80'),
      card('Smart Partywear', 'Satin-finish shirt with tailored black pants.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'),
      card('Runway Casual', 'Structured blazer over sporty separates.', 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80'),
    ],
  },
};

const occasionModifier = {
  'Daily wear': 'Keep fabrics breathable and silhouettes relaxed.',
  College: 'Choose practical layers and comfortable footwear.',
  Office: 'Prioritize structured pieces with polished shoes.',
  Party: 'Add statement textures or shine for impact.',
  Wedding: 'Go richer in fabric and elevate with accessories.',
};

const hairstyleByGenderAndFaceShape = {
  Woman: {
    Oval: [
      card('Layered Cut', 'Works beautifully with balanced oval proportions.', 'https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?auto=format&fit=crop&w=900&q=80'),
      card('Soft Side Part', 'Keeps your natural symmetry while adding movement.', 'https://images.unsplash.com/photo-1523264766116-1e09b3145b84?auto=format&fit=crop&w=900&q=80'),
      card('Textured Lob', 'A versatile look for both casual and formal outfits.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'),
    ],
    Round: [
      card('Textured Waves', 'Adds vertical volume and lengthens your profile.', 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=900&q=80'),
      card('Long Layers', 'Framing layers help contour fuller cheeks.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'),
      card('High Pony', 'Creates height and defines your face shape.', 'https://images.unsplash.com/photo-1523264766116-1e09b3145b84?auto=format&fit=crop&w=900&q=80'),
    ],
    Square: [
      card('Side Part', 'Softens angular jawlines with asymmetry.', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80'),
      card('Curtain Fringe', 'Adds softness around the forehead.', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=900&q=80'),
      card('Loose Layers', 'Breaks strong lines with airy texture.', 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80'),
    ],
    Heart: [
      card('Chin-Length Bob', 'Balances wider forehead with fuller lower frame.', 'https://images.unsplash.com/photo-1523264766116-1e09b3145b84?auto=format&fit=crop&w=900&q=80'),
      card('Side-Swept Layers', 'Draws focus diagonally across the face.', 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=900&q=80'),
      card('Soft Waves', 'Adds width near jawline for harmony.', 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80'),
    ],
    Diamond: [
      card('Volume Crown Cut', 'Brings balance to cheekbone-dominant features.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'),
      card('Tucked Bob', 'Softens width while keeping shape definition.', 'https://images.unsplash.com/photo-1523264766116-1e09b3145b84?auto=format&fit=crop&w=900&q=80'),
      card('Face-Framing Layers', 'Highlights cheekbones without exaggerating width.', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80'),
    ],
  },
  Man: {
    Oval: [
      card('Classic Taper', 'Keeps balanced proportions sharp without extra bulk.', 'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?auto=format&fit=crop&w=900&q=80'),
      card('Textured Quiff', 'Adds clean height while keeping the face naturally balanced.', 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=80'),
      card('Side-Swept Crop', 'A versatile cut for both casual and formal outfits.', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80'),
    ],
    Round: [
      card('High Volume Top', 'Creates height to visually lengthen rounder features.', 'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?auto=format&fit=crop&w=900&q=80'),
      card('Textured Crop Fade', 'Adds structure without widening the face.', 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=80'),
      card('Angular Side Part', 'Introduces sharper edges to balance softer contours.', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80'),
    ],
    Square: [
      card('Soft Textured Top', 'Keeps a strong jawline while reducing harshness above it.', 'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?auto=format&fit=crop&w=900&q=80'),
      card('Loose Fringe', 'Adds softness around the forehead.', 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=80'),
      card('Medium Sweep Back', 'Balances angular features with relaxed flow.', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80'),
    ],
    Heart: [
      card('Tapered Texture', 'Balances forehead width with fuller sides.', 'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?auto=format&fit=crop&w=900&q=80'),
      card('Side Sweep', 'Pulls focus diagonally across the face.', 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=80'),
      card('Low Fade with Volume', 'Keeps the lower face visually grounded.', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80'),
    ],
    Diamond: [
      card('Layered Side Crop', 'Softens cheekbone width while keeping definition.', 'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?auto=format&fit=crop&w=900&q=80'),
      card('Textured Medium Top', 'Brings balance to sharp cheekbone structure.', 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=80'),
      card('Classic Brush Up', 'Adds height without exaggerating face width.', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80'),
    ],
  },
};

const hairTypeTips = {
  Straight: 'Use lightweight texturizing spray to avoid flatness.',
  Wavy: 'Define waves with a curl cream and diffused drying.',
  Curly: 'Prioritize hydration and use layered cuts for bounce.',
  Coily: 'Protect ends and maintain moisture with rich leave-ins.',
};

function card(title, description, image) {
  return { title, description, image };
}

function buildPalette(skinTone, undertone) {
  const basePalette = paletteBySkinTone[skinTone] || paletteBySkinTone.Medium;
  const adjustedPalette = [...basePalette];

  if (undertone === 'Warm') {
    adjustedPalette.push('#B87333|Copper');
  } else if (undertone === 'Cool') {
    adjustedPalette.push('#5D5CDE|Indigo');
  } else if (undertone === 'Neutral') {
    adjustedPalette.push('#708090|Slate Gray');
  }

  return adjustedPalette.slice(0, 6).map((entry) => {
    const [hex, name] = entry.split('|');
    return { hex, name };
  });
}

function buildOutfits(gender, style, occasion, bodyType) {
  const outfitLibrary = outfitsByGenderAndStyle[gender] || outfitsByGenderAndStyle.Woman;
  const selected = outfitLibrary[style] || outfitLibrary.Casual;
  return selected.slice(0, 4).map((item) => ({
    ...item,
    description: `${item.description} ${occasionModifier[occasion]} Body-fit hint: ${bodyType} frame suits balanced proportions.`,
  }));
}

function buildHairstyles(gender, faceShape, hairType, hairLength) {
  const hairstyleLibrary = hairstyleByGenderAndFaceShape[gender] || hairstyleByGenderAndFaceShape.Woman;
  const selected = hairstyleLibrary[faceShape] || hairstyleLibrary.Oval;
  return selected.slice(0, 3).map((item) => ({
    ...item,
    description: `${item.description} ${hairTypeTips[hairType]} Best with ${hairLength.toLowerCase()} length styling.`,
  }));
}

function buildTips(data) {
  const tips = [];

  if (data.undertone === 'Warm') {
    tips.push('Warm undertones match earthy colors like mustard, olive, and rust.');
  }

  if (data.faceShape === 'Round') {
    tips.push('Round faces benefit from crown volume and face-framing layers.');
  }

  if (data.fashionStyle === 'Minimal') {
    tips.push('Neutral colors and clean silhouettes work especially well for minimal style.');
  }

  if (data.gender === 'Woman') {
    tips.push('Use accessories and fabric drape to sharpen the mood of each outfit without changing the whole palette.');
  }

  if (data.gender === 'Man') {
    tips.push('Focus on shoulder fit, trouser break, and shoe shape first since they control most of the outfit impression.');
  }

  if (data.occasion === 'Wedding') {
    tips.push('For weddings, elevate your look with richer fabrics and one statement accessory.');
  }

  if (data.hairType === 'Curly' || data.hairType === 'Coily') {
    tips.push('Hydration-first haircare keeps texture defined and frizz controlled.');
  }

  if (tips.length < 3) {
    tips.push('Build outfits with one focal point and keep the rest coordinated.');
    tips.push('Choose footwear color that anchors your palette for a complete look.');
  }

  return tips.slice(0, 5);
}

function renderPalette(colors) {
  paletteGrid.innerHTML = colors
    .map(
      (color) => `
        <article class="color-chip">
          <div class="color-swatch" style="background:${color.hex}"></div>
          <div class="color-name">${color.name}</div>
        </article>
      `
    )
    .join('');
}

function renderCards(target, items) {
  target.innerHTML = items
    .map(
      (item) => `
        <article class="feature-card">
          <img class="feature-image" src="${item.image}" alt="${item.title}" loading="lazy" />
          <div class="feature-content">
            <h4 class="feature-title">${item.title}</h4>
            <p class="feature-copy">${item.description}</p>
          </div>
        </article>
      `
    )
    .join('');
}

function renderTips(tips) {
  tipsList.innerHTML = tips.map((tip) => `<li>${tip}</li>`).join('');
}

function setCameraStatus(message, isError = false) {
  cameraStatus.textContent = message;
  cameraStatus.style.color = isError ? '#8c3d2a' : '';
}

function distanceBetween(pointA, pointB) {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

async function ensureFaceLandmarker() {
  if (faceLandmarker) {
    return faceLandmarker;
  }

  if (!faceLandmarkerPromise) {
    faceLandmarkerPromise = import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14')
      .then(async ({ FaceLandmarker, FilesetResolver }) => {
        const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');

        return FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          },
          runningMode: 'IMAGE',
          numFaces: 1,
        });
      })
      .then((instance) => {
        faceLandmarker = instance;
        return instance;
      });
  }

  return faceLandmarkerPromise;
}

function waitForVideoReady(videoElement) {
  if (videoElement.readyState >= 2) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    videoElement.addEventListener('loadeddata', () => resolve(), { once: true });
  });
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setCameraStatus('Camera access is not supported in this browser.', true);
    return;
  }

  try {
    if (cameraStream) {
      return;
    }

    setCameraStatus('Requesting camera permission...');
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 960 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    cameraVideo.srcObject = cameraStream;
    cameraVideo.classList.remove('hidden');
    cameraCanvas.classList.remove('hidden');
    cameraPlaceholder.classList.add('hidden');
    await waitForVideoReady(cameraVideo);
    setCameraStatus('Camera is ready. Center your face and tap Analyze Face Shape.');
  } catch (error) {
    setCameraStatus('Camera permission was denied or unavailable.', true);
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }

  cameraVideo.srcObject = null;
  cameraVideo.classList.add('hidden');
  cameraCanvas.classList.add('hidden');
  cameraPlaceholder.classList.remove('hidden');

  const context = cameraCanvas.getContext('2d');
  if (context) {
    context.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
  }

  setCameraStatus('Camera stopped. You can restart it any time.');
}

function calculateFaceMetrics(landmarks) {
  const foreheadWidth = distanceBetween(landmarks[127], landmarks[356]);
  const cheekboneWidth = distanceBetween(landmarks[234], landmarks[454]);
  const jawWidth = distanceBetween(landmarks[172], landmarks[397]);
  const faceLength = distanceBetween(landmarks[10], landmarks[152]);

  return {
    faceLengthRatio: faceLength / cheekboneWidth,
    foreheadRatio: foreheadWidth / cheekboneWidth,
    jawRatio: jawWidth / cheekboneWidth,
  };
}

function estimateFaceShape(landmarks) {
  const metrics = calculateFaceMetrics(landmarks);
  const scoredShapes = faceShapeProfiles
    .map((profile) => ({
      name: profile.name,
      score:
        Math.abs(metrics.faceLengthRatio - profile.lengthRatio) * 1.45 +
        Math.abs(metrics.foreheadRatio - profile.foreheadRatio) * 1.15 +
        Math.abs(metrics.jawRatio - profile.jawRatio) * 1.25,
    }))
    .sort((shapeA, shapeB) => shapeA.score - shapeB.score);

  const [bestMatch, secondBestMatch] = scoredShapes;
  const separation = secondBestMatch ? secondBestMatch.score - bestMatch.score : 0.18;
  const normalizedSeparation = clamp(separation / 0.18, 0, 1);

  return {
    shape: bestMatch.name,
    confidence: normalizedSeparation >= 0.72 ? 'high' : normalizedSeparation >= 0.42 ? 'medium' : 'low',
  };
}

function drawFaceOverlay(landmarks) {
  const width = cameraVideo.videoWidth;
  const height = cameraVideo.videoHeight;
  const context = cameraCanvas.getContext('2d');

  if (!context || !width || !height) {
    return;
  }

  cameraCanvas.width = width;
  cameraCanvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(cameraVideo, 0, 0, width, height);

  context.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  context.lineWidth = 2;
  context.beginPath();

  [10, 127, 234, 152, 454, 356, 10].forEach((index, pointIndex) => {
    const point = landmarks[index];
    const x = point.x * width;
    const y = point.y * height;

    if (pointIndex === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });

  context.stroke();
}

function applyDetectedFaceShape(shape, confidence) {
  detectedFaceShape = { shape, confidence };
  answers.faceShape = shape;
  syncHiddenInput('faceShape', shape);
  cameraResult.textContent = `Estimated face shape: ${shape} with ${confidence} confidence. You can keep this or change it in the quiz.`;
  cameraResult.classList.remove('hidden');

  if (currentQuestionIndex === faceShapeQuestionIndex) {
    renderQuestion();
  }
}

async function analyzeFaceShape() {
  try {
    if (!cameraStream) {
      await startCamera();
    }

    await waitForVideoReady(cameraVideo);
    setCameraStatus('Loading face landmark model...');
    const landmarker = await ensureFaceLandmarker();

    setCameraStatus('Analyzing face geometry...');
    const result = landmarker.detect(cameraVideo);
    const firstFace = result.faceLandmarks?.[0];

    if (!firstFace) {
      setCameraStatus('No face detected. Face the camera directly with good lighting and try again.', true);
      return;
    }

    const estimate = estimateFaceShape(firstFace);
    drawFaceOverlay(firstFace);
    applyDetectedFaceShape(estimate.shape, estimate.confidence);
    setCameraStatus('Analysis complete. The quiz face-shape answer has been pre-filled.');
  } catch (error) {
    setCameraStatus('Face analysis failed. Check camera permission and try again.', true);
  }
}

function syncHiddenInput(name, value) {
  const input = form.elements.namedItem(name);

  if (input) {
    input.value = value;
  }
}

function renderQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  const selectedValue = answers[currentQuestion.name] || '';
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  questionNumber.textContent = String(currentQuestionIndex + 1).padStart(2, '0');
  questionText.textContent = currentQuestion.prompt;
  stepLabel.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  progressFill.style.width = `${progressPercent}%`;

  if (currentQuestion.name === 'faceShape') {
    if (detectedFaceShape) {
      quizHelperText.textContent = `AI estimate: ${detectedFaceShape.shape} (${detectedFaceShape.confidence} confidence). You can keep it or change it below.`;
    } else {
      quizHelperText.textContent = 'You can use the camera scan above for a faster face-shape estimate, or answer manually here.';
    }

    quizHelperText.classList.remove('hidden');
  } else {
    quizHelperText.classList.add('hidden');
    quizHelperText.textContent = '';
  }

  optionsContainer.innerHTML = currentQuestion.options
    .map(
      (option) => `
        <button
          type="button"
          class="quiz-option${selectedValue === option ? ' selected' : ''}"
          data-value="${option}"
        >
          ${option}
        </button>
      `
    )
    .join('');

  previousButton.disabled = currentQuestionIndex === 0;
  nextButton.disabled = !selectedValue;
  nextButton.classList.toggle('hidden', currentQuestionIndex === questions.length - 1);
  submitButton.classList.toggle('hidden', currentQuestionIndex !== questions.length - 1);
}

optionsContainer.addEventListener('click', (event) => {
  const optionButton = event.target.closest('.quiz-option');

  if (!optionButton) {
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedValue = optionButton.dataset.value;

  if (!selectedValue) {
    return;
  }

  answers[currentQuestion.name] = selectedValue;
  syncHiddenInput(currentQuestion.name, selectedValue);
  renderQuestion();
});

previousButton.addEventListener('click', () => {
  if (currentQuestionIndex === 0) {
    return;
  }

  currentQuestionIndex -= 1;
  renderQuestion();
});

nextButton.addEventListener('click', () => {
  const currentQuestion = questions[currentQuestionIndex];

  if (!answers[currentQuestion.name] || currentQuestionIndex >= questions.length - 1) {
    return;
  }

  currentQuestionIndex += 1;
  renderQuestion();
});

startCameraButton.addEventListener('click', () => {
  startCamera();
});

scanFaceButton.addEventListener('click', () => {
  analyzeFaceShape();
});

stopCameraButton.addEventListener('click', () => {
  stopCamera();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (questions.some((question) => !data[question.name])) {
    return;
  }

  const palette = buildPalette(data.skinTone, data.undertone);
  const outfits = buildOutfits(data.gender, data.fashionStyle, data.occasion, data.bodyType);
  const hairstyles = buildHairstyles(data.gender, data.faceShape, data.hairType, data.hairLength);
  const tips = buildTips(data);

  profileSummary.textContent = `Gender: ${data.gender} | Tone: ${data.skinTone} | Undertone: ${data.undertone} | Style: ${data.fashionStyle} | Occasion: ${data.occasion}`;
  renderPalette(palette);
  renderCards(outfitGrid, outfits);
  renderCards(hairstyleGrid, hairstyles);
  renderTips(tips);

  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

renderQuestion();
