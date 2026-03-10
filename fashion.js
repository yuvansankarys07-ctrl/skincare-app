const form = document.getElementById('fashion-form');
const resultsSection = document.getElementById('results');
const profileSummary = document.getElementById('profile-summary');
const paletteGrid = document.getElementById('palette-grid');
const outfitGrid = document.getElementById('outfit-grid');
const hairstyleGrid = document.getElementById('hairstyle-grid');
const tipsList = document.getElementById('tips-list');

const paletteBySkinTone = {
  'Very Fair': ['#8A9A5B|Olive Green', '#1F2A44|Navy Blue', '#6A1E3A|Burgundy', '#F9F3E5|Cream', '#E6D3B3|Beige', '#D4A017|Mustard'],
  Fair: ['#1E3A5F|Steel Blue', '#A0522D|Rust', '#2F5D50|Teal', '#F7E7CE|Champagne', '#B7410E|Terracotta', '#7B3F00|Mocha'],
  Medium: ['#556B2F|Olive', '#4A1C40|Plum', '#3B2F2F|Espresso', '#F5E6CC|Sand', '#A31621|Wine Red', '#D9A441|Honey'],
  Wheatish: ['#003153|Prussian Blue', '#7C0A02|Deep Red', '#C19A6B|Camel', '#36454F|Charcoal', '#F3D9B1|Warm Beige', '#4F6D4A|Moss Green'],
  Brown: ['#6B8E23|Olive Drab', '#0F4C5C|Petrol Blue', '#8B5E3C|Cocoa', '#D8B48A|Caramel', '#800020|Maroon', '#E1AD01|Amber'],
  Dark: ['#005F73|Deep Teal', '#9B2226|Crimson', '#1D3557|Royal Navy', '#E9C46A|Golden Sand', '#6D597A|Mulberry', '#BC6C25|Bronze'],
};

const outfitsByStyle = {
  Casual: [
    card('Casual Outfit', 'Beige shirt + blue jeans for easy daily style.', 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80'),
    card('Layered Casual', 'White tee with overshirt and relaxed trousers.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'),
    card('Weekend Comfort', 'Knit top with straight fit denims and sneakers.', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'),
    card('City Casual', 'Soft cardigan with neutral chinos and loafers.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80'),
  ],
  Formal: [
    card('Formal Outfit', 'Navy blazer + white shirt + tailored pants.', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80'),
    card('Business Classic', 'Charcoal suit and crisp pastel shirt.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'),
    card('Elegant Office', 'Structured dress with a camel trench.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'),
    card('Polished Minimal', 'Monochrome co-ord with leather belt accents.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'),
  ],
  Streetwear: [
    card('Streetwear Core', 'Oversized hoodie + cargo pants + sneakers.', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'),
    card('Urban Layer', 'Graphic tee with bomber and joggers.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'),
    card('Sport Luxe', 'Track jacket over monochrome basics.', 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80'),
    card('Cargo Statement', 'Wide-leg cargos and chunky sneakers.', 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80'),
  ],
  Minimal: [
    card('Minimal Set', 'Neutral shirt + slim trousers with clean lines.', 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80'),
    card('Monotone Look', 'Ivory knit and tailored beige bottoms.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80'),
    card('Simple Office', 'Black blazer with cream inner layer.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'),
    card('Refined Casual', 'Solid tee with straight denim and loafers.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'),
  ],
  Ethnic: [
    card('Ethnic Daywear', 'Handloom kurta set with muted dupatta.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'),
    card('Festive Ethnic', 'Embroidered jacket over solid kurta.', 'https://images.unsplash.com/photo-1602810319428-019690571b5b?auto=format&fit=crop&w=900&q=80'),
    card('Classic Fusion', 'Printed top with palazzos and juttis.', 'https://images.unsplash.com/photo-1616847220575-31ea0dbd31f0?auto=format&fit=crop&w=900&q=80'),
    card('Elegant Saree', 'Lightweight saree with contrast blouse.', 'https://images.unsplash.com/photo-1610030469668-90f58f0d5a4d?auto=format&fit=crop&w=900&q=80'),
  ],
  Trendy: [
    card('Trendy Layering', 'Cropped jacket + cargo skirt combo.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80'),
    card('Color Pop Fit', 'Statement top with wide-leg denims.', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=900&q=80'),
    card('Smart Partywear', 'Satin shirt with bold accessories.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'),
    card('Runway Casual', 'Structured blazer over sporty set.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'),
  ],
};

const occasionModifier = {
  'Daily wear': 'Keep fabrics breathable and silhouettes relaxed.',
  College: 'Choose practical layers and comfortable footwear.',
  Office: 'Prioritize structured pieces with polished shoes.',
  Party: 'Add statement textures or shine for impact.',
  Wedding: 'Go richer in fabric and elevate with accessories.',
};

const hairstyleByFaceShape = {
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

function buildOutfits(style, occasion, bodyType) {
  const selected = outfitsByStyle[style] || outfitsByStyle.Casual;
  return selected.slice(0, 4).map((item) => ({
    ...item,
    description: `${item.description} ${occasionModifier[occasion]} Body-fit hint: ${bodyType} frame suits balanced proportions.`,
  }));
}

function buildHairstyles(faceShape, hairType, hairLength) {
  const selected = hairstyleByFaceShape[faceShape] || hairstyleByFaceShape.Oval;
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

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const palette = buildPalette(data.skinTone, data.undertone);
  const outfits = buildOutfits(data.fashionStyle, data.occasion, data.bodyType);
  const hairstyles = buildHairstyles(data.faceShape, data.hairType, data.hairLength);
  const tips = buildTips(data);

  profileSummary.textContent = `Tone: ${data.skinTone} | Undertone: ${data.undertone} | Style: ${data.fashionStyle} | Occasion: ${data.occasion}`;
  renderPalette(palette);
  renderCards(outfitGrid, outfits);
  renderCards(hairstyleGrid, hairstyles);
  renderTips(tips);

  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
