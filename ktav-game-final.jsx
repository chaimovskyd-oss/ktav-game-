import React, { useState } from 'react';

// ===============================
// קבועים ונתונים
// ===============================

const LETTER_VALUES = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5,
  'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
  'כ': 11, 'ך': 11, 'ל': 12, 'מ': 13, 'ם': 13,
  'נ': 14, 'ן': 14, 'ס': 15, 'ע': 16,
  'פ': 17, 'ף': 17, 'צ': 18, 'ץ': 18,
  'ק': 19, 'ר': 20, 'ש': 21, 'ת': 22,
  '*': 0
};

const JOKERS = [
  // Common (3-4₪)
  { id: 'bgdkft', name: 'בגד כפת', desc: 'בגדכפת ×1.5', cost: 3, icon: '📌', rarity: 'common' },
  { id: 'heavy', name: 'כבדי משקל', desc: 'ק-ת ×2', cost: 4, icon: '💪', rarity: 'common' },
  { id: 'doubles', name: 'כפילות', desc: 'אות כפולה +20', cost: 4, icon: '👥', rarity: 'common' },
  { id: 'first10', name: 'חזקים ראשונים', desc: 'א-י +5', cost: 3, icon: '🔢', rarity: 'common' },
  { id: 'middle', name: 'אמצע הדרך', desc: 'כ-ע +8', cost: 3, icon: '⚖️', rarity: 'common' },
  { id: 'alphabet', name: 'כל האלפבית', desc: 'כל אות +2', cost: 4, icon: '🔤', rarity: 'common' },
  { id: 'wildcard_lover', name: 'אוהב כוכבים', desc: 'קלף כוכב (★) שווה 10 ×10 = 100 נקודות!', cost: 3, icon: '🌟', rarity: 'common' },
  { id: 'short_words', name: 'מילים קצרות', desc: '2-3 אותיות +25', cost: 3, icon: '📐', rarity: 'common' },
  { id: 'vowels', name: 'אותיות אמהות', desc: 'א/ו/י +3', cost: 3, icon: '🎵', rarity: 'common' },
  { id: 'neighbor', name: 'שכן טוב', desc: 'אותיות סמוכות זהות +15', cost: 3, icon: '🤝', rarity: 'common' },
  
  // Uncommon (5-7₪)
  { id: 'golden_finals', name: 'סופיות זהב', desc: 'ךםןףץ ×3', cost: 5, icon: '🏅', rarity: 'uncommon' },
  { id: 'big_head', name: 'ראש גדול', desc: 'אות ראשונה ×4', cost: 5, icon: '🎯', rarity: 'uncommon' },
  { id: 'happy_end', name: 'סוף טוב', desc: 'אות אחרונה ×4', cost: 5, icon: '🎆', rarity: 'uncommon' },
  { id: 'middle_king', name: 'מלך האמצע', desc: 'אות אמצעית ×5', cost: 6, icon: '👑', rarity: 'uncommon' },
  { id: 'rising', name: 'מסלול עולה', desc: 'אותיות עולות ×10', cost: 7, icon: '📈', rarity: 'uncommon' },
  { id: 'falling', name: 'מסלול יורד', desc: 'אותיות יורדות ×10', cost: 7, icon: '📉', rarity: 'uncommon' },
  { id: 'collector', name: 'אוסף אותיות', desc: 'אות ייחודית +10', cost: 6, icon: '🎨', rarity: 'uncommon' },
  { id: 'leap', name: 'קפיצת ענק', desc: 'הפרש 10+ בין אותיות → +50', cost: 6, icon: '🦘', rarity: 'uncommon' },
  { id: 'balance', name: 'מאזניים', desc: 'סכום זוגי +25', cost: 5, icon: '⚖️', rarity: 'uncommon' },
  { id: 'lucky_7', name: 'מזל 7', desc: 'סכום מתחלק ב-7 → ×3', cost: 6, icon: '🍀', rarity: 'uncommon' },
  { id: 'money_maker', name: 'מכונת כסף', desc: '+1₪ לכל מילה', cost: 5, icon: '💰', rarity: 'uncommon' },
  { id: 'hand_giver', name: 'נותן ידיים', desc: '+1 יד לכל Blind', cost: 7, icon: '✋', rarity: 'uncommon' },
  { id: 'discard_giver', name: 'נותן זריקות', desc: '+1 זריקה לכל Blind', cost: 6, icon: '🔄', rarity: 'uncommon' },
  { id: 'even_odd', name: 'זוגי ואי-זוגי', desc: 'אם יש גם אות זוגית וגם אי-זוגית, +30 צ׳יפס', cost: 6, icon: '🎲', rarity: 'uncommon' },
  { id: 'mirror', name: 'מראה', desc: 'אם המילה פלינדרום (זהה הפוך), ×10', cost: 7, icon: '🪞', rarity: 'uncommon' },
  { id: 'letter_13', name: 'מזל 13', desc: 'אות מ/ם (ערך 13) שווה ×4', cost: 5, icon: '🎰', rarity: 'uncommon' },
  
  // Rare (8-12₪)
  { id: 'five_stars', name: 'חמש כוכבים', desc: '5 אותיות ×25', cost: 10, icon: '⭐', rarity: 'rare' },
  { id: 'first_last_same', name: 'התחלה וסוף', desc: 'אם האות הראשונה והאחרונה זהות, ×8', cost: 9, icon: '🔄', rarity: 'rare' },
  { id: 'three_in_row', name: 'שלישייה', desc: 'אם יש 3 אותיות זהות במילה, ×12', cost: 10, icon: '🎯', rarity: 'rare' },
  { id: 'prime_number', name: 'מספר ראשוני', desc: 'אם סכום המילה ראשוני, ×7', cost: 8, icon: '🔢', rarity: 'rare' },
  { id: 'vowel_heavy', name: 'מלא תנועות', desc: 'אם יותר מחצי מהאותיות הן א/ו/י, ×6', cost: 9, icon: '🎵', rarity: 'rare' },
  { id: 'five_stars', name: 'חמש כוכבים', desc: '5 אותיות ×25', cost: 10, icon: '⭐', rarity: 'rare' },
  { id: 'double_mult', name: 'המכפיל הכפול', desc: 'מכפיל ×2', cost: 10, icon: '✖️✖️', rarity: 'rare' },
  { id: 'gematria', name: 'גימטריה', desc: 'סכום ÷7 → ×20', cost: 10, icon: '7️⃣', rarity: 'rare' },
  { id: 'round_numbers', name: 'מספרים עגולים', desc: 'סכום 10/20/30... → ×15', cost: 9, icon: '🎯', rarity: 'rare' },
  { id: 'personal_best', name: 'שיא אישי', desc: 'שיא חדש → ×30', cost: 10, icon: '🏆', rarity: 'rare' },
  { id: 'streak', name: 'רצף מנצח', desc: '3 מילים ברצף → ×5', cost: 8, icon: '🔥', rarity: 'rare' },
  { id: 'combo', name: 'קומבו', desc: 'כל מילה מוסיפה ×0.5', cost: 9, icon: '🎯', rarity: 'rare' },
  { id: 'hand_master', name: 'מאסטר הידיים', desc: '+2 ידיים לכל Blind', cost: 12, icon: '🙌', rarity: 'rare' },
  { id: 'discard_master', name: 'מאסטר הזריקות', desc: '+2 זריקות לכל Blind', cost: 11, icon: '♻️', rarity: 'rare' },
  { id: 'chip_boost', name: 'מאיץ צ׳יפס', desc: '+100 צ׳יפס לכל מילה', cost: 8, icon: '🪙', rarity: 'rare' },
  { id: 'mult_boost', name: 'מאיץ מכפיל', desc: '+2 מכפיל לכל מילה', cost: 9, icon: '⚡', rarity: 'rare' },
  
  // Legendary (15-20₪)
  { id: 'word_changer', name: 'משנה מילים', desc: 'כל מילה = 5 אותיות', cost: 18, icon: '🎭', rarity: 'legendary' },
  { id: 'golden_touch', name: 'מגע הזהב', desc: 'כל אות ×5', cost: 20, icon: '👑', rarity: 'legendary' },
  { id: 'time_lord', name: 'אדון הזמן', desc: '10 מילים ברצף → ×50', cost: 15, icon: '⏰', rarity: 'legendary' },
  { id: 'destiny', name: 'הגורל', desc: '5% סיכוי ל-×100', cost: 15, icon: '🎰', rarity: 'legendary' },
  { id: 'holy_word', name: 'מילה קדושה', desc: 'א+מ+ש במילה → ×77', cost: 18, icon: '✨', rarity: 'legendary' },
  { id: 'infinite_hands', name: 'ידיים אינסופיות', desc: '+3 ידיים לכל Blind', cost: 20, icon: '♾️', rarity: 'legendary' },
  { id: 'super_wildcard', name: 'סופר Wildcard', desc: 'Wildcard = האות הכי טובה', cost: 16, icon: '🌠', rarity: 'legendary' },
  { id: 'perfect_score', name: 'ניקוד מושלם', desc: 'אם מגיע בדיוק ליעד → ×2 כסף', cost: 15, icon: '💯', rarity: 'legendary' },
  { id: 'mega_combo', name: 'מגה קומבו', desc: 'כל מילה מוסיפה ×1 למכפיל (ללא הגבלה!)', cost: 18, icon: '🚀', rarity: 'legendary' },
  { id: 'wild_master', name: 'מאסטר הג׳וקר', desc: 'כל Wildcard שווה 25 נקודות', cost: 16, icon: '🌟', rarity: 'legendary' },
  { id: 'all_letters_bonus', name: 'מלון מלא', desc: 'אם כל האותיות ביד שונות, ×20', cost: 15, icon: '🎨', rarity: 'legendary' },
];

const UPGRADES = [
  { id: 'gold', name: 'זהב', desc: '×2 לערך', cost: 5, icon: '🥇' },
  { id: 'diamond', name: 'יהלום', desc: '×3 לערך', cost: 10, icon: '💎' },
  { id: 'plus', name: 'בונוס +10', desc: '+10 לערך', cost: 4, icon: '➕' },
];

const VOUCHERS = [
  { id: 'sixth_joker', name: 'הג׳וקר השישי', desc: '+1 מקום לג׳וקר (מקסימום 6)', cost: 10, icon: '🎴', type: 'joker_slot' },
  { id: 'seventh_joker', name: 'הג׳וקר השביעי', desc: '+1 מקום נוסף (מקסימום 7)', cost: 15, icon: '🃏', type: 'joker_slot' },
  { id: 'bigger_hand', name: 'יד גדולה', desc: '+2 קלפים ביד (10 במקום 8)', cost: 12, icon: '🤲', type: 'hand_size' },
  { id: 'huge_hand', name: 'יד ענקית', desc: '+2 קלפים נוספים (12 קלפים!)', cost: 18, icon: '👐', type: 'hand_size' },
  { id: 'extra_hand', name: 'יד נוספת', desc: '+1 יד קבועה לכל Blind', cost: 8, icon: '✋', type: 'extra_hands' },
  { id: 'extra_discard', name: 'זריקה נוספת', desc: '+1 זריקה קבועה לכל Blind', cost: 7, icon: '🔄', type: 'extra_discards' },
  { id: 'interest', name: 'ריבית', desc: '+1₪ לכל 5₪ (עד 5₪)', cost: 10, icon: '🏦', type: 'interest' },
  { id: 'shop_discount', name: 'הנחה בחנות', desc: '-1₪ על כל פריט', cost: 8, icon: '🏷️', type: 'discount' },
  { id: 'reroll_discount', name: 'רענון זול', desc: 'רענון חנות חינם', cost: 6, icon: '🔄', type: 'free_reroll' },
];

const DIFFICULTIES = {
  easy: { 
    name: 'קל', 
    icon: '😊', 
    scoreMultiplier: 0.7, 
    moneyMultiplier: 1.3,
    startMoney: 6,
    color: 'from-green-600 to-green-800',
    desc: 'יעדים נמוכים, יותר כסף'
  },
  normal: { 
    name: 'רגיל', 
    icon: '😐', 
    scoreMultiplier: 1, 
    moneyMultiplier: 1,
    startMoney: 4,
    color: 'from-blue-600 to-blue-800',
    desc: 'איזון מושלם'
  },
  hard: { 
    name: 'קשה', 
    icon: '😰', 
    scoreMultiplier: 1.4, 
    moneyMultiplier: 0.8,
    startMoney: 3,
    color: 'from-orange-600 to-orange-800',
    desc: 'יעדים גבוהים, פחות כסף'
  },
  expert: { 
    name: 'מומחה', 
    icon: '😱', 
    scoreMultiplier: 2, 
    moneyMultiplier: 0.6,
    startMoney: 2,
    color: 'from-red-600 to-red-800',
    desc: 'אתגר אולטימטיבי!'
  },
};

const BOSS_BLINDS = [
  { id: 'censor', name: 'הצנזור', desc: 'אסור להשתמש באותיות ס, ע', icon: '🚫' },
  { id: 'long_only', name: 'רק ארוכות', desc: 'רק מילים בנות 4-5 אותיות', icon: '📏' },
  { id: 'no_discards', name: 'ללא זריקות', desc: 'אין זריקות! (0 זריקות)', icon: '⛔' },
  { id: 'expensive', name: 'היקר', desc: 'כל קלף שווה רק 1 נקודה', icon: '💸' },
  { id: 'short_only', name: 'רק קצרות', desc: 'רק מילים בנות 2-3 אותיות', icon: '📐' },
  { id: 'no_finals', name: 'ללא סופיות', desc: 'אסור באותיות סופיות: ךםןףץ', icon: '🔒' },
  { id: 'few_hands', name: 'מעט ידיים', desc: 'רק 2 ידיים במקום 4!', icon: '✋' },
  { id: 'weak_letters', name: 'אותיות חלשות', desc: 'אסור באותיות א-ה', icon: '🔴' },
  { id: 'no_mult', name: 'ללא מכפילים', desc: 'כל הג׳וקרים שנותנים מכפיל לא עובדים', icon: '⭕' },
  { id: 'half_score', name: 'חצי ניקוד', desc: 'כל מילה נותנת רק 50% מהנקודות', icon: '📉' },
  { id: 'expensive_shop', name: 'חנות יקרה', desc: 'כל הפריטים בחנות ×2 במחיר', icon: '💰' },
  { id: 'time_limit', name: 'מגבלת זמן', desc: 'רק 3 ידיים במקום 4', icon: '⏱️' },
  { id: 'final_boss', name: 'הבוס הסופי', desc: 'כל האתגרים ביחד!', icon: '👹' },
];

const BLIND_CONFIGS = {
  small: {
    name: 'שלב קטן',
    icon: '🟢',
    scoreMultiplier: 1,
    reward: 3,
    hands: 4,
    discards: 3
  },
  big: {
    name: 'שלב גדול',
    icon: '🟡',
    scoreMultiplier: 1.67,
    reward: 4,
    hands: 4,
    discards: 3
  },
  boss: {
    name: 'שלב בוס',
    icon: '🔴',
    scoreMultiplier: 2,
    reward: 5,
    hands: 4,
    discards: 3
  }
};

// ===============================
// פונקציות עזר
// ===============================

function createDeck() {
  const letters = 'אבגדהוזחטיכלמנסעפצקרשת';
  const finals = 'ךםןףץ';
  const deck = [];
  
  for (let letter of letters) {
    deck.push({ letter, value: LETTER_VALUES[letter], id: Math.random(), upgrades: [] });
    deck.push({ letter, value: LETTER_VALUES[letter], id: Math.random(), upgrades: [] });
  }
  
  for (let letter of finals) {
    deck.push({ letter, value: LETTER_VALUES[letter], id: Math.random(), upgrades: [] });
  }
  
  for (let i = 0; i < 3; i++) {
    deck.push({ letter: '*', value: 0, id: Math.random(), upgrades: [], isWildcard: true });
  }
  
  return shuffleArray(deck);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getCardValue(card) {
  let value = card.value;
  if (card.upgrades?.includes('gold')) value *= 2;
  if (card.upgrades?.includes('diamond')) value *= 3;
  if (card.upgrades?.includes('plus')) value += 10;
  return Math.floor(value);
}

function calculateScore(cards, jokers, bossBlind) {
  /* 
  📊 הסבר מערכת הניקוד:
  
  1. ערך בסיסי של אותיות: א=1, ב=2, ... ת=22
  2. בונוס בסיס לפי אורך מילה:
     - 2 אותיות: +10 צ'יפס, ×1 מכפיל
     - 3 אותיות: +20 צ'יפס, ×2 מכפיל
     - 4 אותיות: +40 צ'יפס, ×4 מכפיל
     - 5 אותיות: +60 צ'יפס, ×5 מכפיל
  
  3. נוסחה סופית: (סכום אותיות + בונוס בסיס) × מכפיל
  
  דוגמה: "שלום" (5 אותיות)
  - ש(21) + ל(12) + ו(6) + ם(13) = 52
  - בונוס בסיס: +60
  - סה"כ צ'יפס: 112
  - מכפיל: ×5
  - ניקוד: 112 × 5 = 560 נקודות!
  */
  
  let chips = 0;
  let mult = 1;
  let wordLength = cards.length;
  
  // בוס "משנה מילים" - כל מילה נחשבת ל-5
  const hasWordChanger = jokers.some(j => j.id === 'word_changer');
  if (hasWordChanger) {
    wordLength = 5;
  }
  
  // חישוב ערך אותיות
  cards.forEach((card, index) => {
    let value = getCardValue(card);
    
    // ⚠️ FIX: Wildcard מתחיל מ-0, אז תן לו ערך לפני הכל
    if (card.isWildcard && jokers.some(j => j.id === 'wildcard_lover')) {
      value = 10; // מתחיל מ-10 במקום 0
    }
    
    // ג'וקרים שמשפיעים על אותיות בודדות
    jokers.forEach(joker => {
      if (joker.id === 'bgdkft' && ['ב','ג','ד','כ','ך','פ','ף','ת'].includes(card.letter)) {
        value *= 1.5;
      }
      if (joker.id === 'heavy' && ['ק','ר','ש','ת'].includes(card.letter)) {
        value *= 2;
      }
      if (joker.id === 'first10' && card.value >= 1 && card.value <= 10) {
        value += 5;
      }
      if (joker.id === 'middle' && card.value >= 11 && card.value <= 16) {
        value += 8;
      }
      if (joker.id === 'vowels' && ['א','ו','י'].includes(card.letter)) {
        value += 3;
      }
      if (joker.id === 'golden_finals' && ['ך','ם','ן','ף','ץ'].includes(card.letter)) {
        value *= 3;
      }
      if (joker.id === 'big_head' && index === 0) {
        value *= 4;
      }
      if (joker.id === 'happy_end' && index === cards.length - 1) {
        value *= 4;
      }
      if (joker.id === 'middle_king' && index === Math.floor(cards.length / 2)) {
        value *= 5;
      }
      if (joker.id === 'alphabet') {
        value += 2;
      }
      if (joker.id === 'wildcard_lover' && card.isWildcard) {
        // כבר קיבל 10, עכשיו ×10 = 100
        value *= 10;
      }
      if (joker.id === 'golden_touch') {
        value *= 5;
      }
    });
    
    chips += value;
  });
  
  // בונוס בסיס
  const baseChips = { 2: 10, 3: 20, 4: 40, 5: 60 }[wordLength] || 10;
  const baseMult = { 2: 1, 3: 2, 4: 4, 5: 5 }[wordLength] || 1;
  
  chips += baseChips;
  mult = baseMult;
  
  // ג'וקרים שנותנים בונוס צ'יפס
  jokers.forEach(joker => {
    if (joker.id === 'short_words' && cards.length <= 3) {
      chips += 25;
    }
    if (joker.id === 'chip_boost') {
      chips += 100;
    }
    if (joker.id === 'mult_boost') {
      mult += 2;
    }
  });
  
  // בדיקות מיוחדות
  const letterCount = {};
  cards.forEach(c => {
    if (!c.isWildcard) {
      letterCount[c.letter] = (letterCount[c.letter] || 0) + 1;
    }
  });
  const hasDouble = Object.values(letterCount).some(count => count >= 2);
  const uniqueCount = Object.keys(letterCount).length;
  const letterSum = cards.reduce((sum, c) => sum + c.value, 0);
  
  jokers.forEach(joker => {
    if (joker.id === 'doubles' && hasDouble) {
      chips += 20;
    }
    if (joker.id === 'neighbor') {
      for (let i = 0; i < cards.length - 1; i++) {
        if (cards[i].letter === cards[i+1].letter) {
          chips += 15;
          break;
        }
      }
    }
    if (joker.id === 'collector') {
      chips += uniqueCount * 10;
    }
    if (joker.id === 'leap') {
      for (let i = 0; i < cards.length - 1; i++) {
        if (Math.abs(cards[i].value - cards[i+1].value) >= 10) {
          chips += 50;
          break;
        }
      }
    }
    if (joker.id === 'balance' && letterSum % 2 === 0) {
      chips += 25;
    }
    if (joker.id === 'lucky_7' && letterSum % 7 === 0) {
      mult *= 3;
    }
    if (joker.id === 'five_stars' && wordLength === 5) {
      mult *= 25;
    }
    if (joker.id === 'double_mult') {
      mult *= 2;
    }
    if (joker.id === 'gematria' && letterSum % 7 === 0) {
      mult *= 20;
    }
    if (joker.id === 'round_numbers' && [10,20,30,40,50,60,70,80,90,100].includes(letterSum)) {
      mult *= 15;
    }
    if (joker.id === 'rising') {
      let isRising = true;
      for (let i = 1; i < cards.length; i++) {
        if (cards[i].value <= cards[i-1].value) {
          isRising = false;
          break;
        }
      }
      if (isRising) mult *= 10;
    }
    if (joker.id === 'falling') {
      let isFalling = true;
      for (let i = 1; i < cards.length; i++) {
        if (cards[i].value >= cards[i-1].value) {
          isFalling = false;
          break;
        }
      }
      if (isFalling) mult *= 10;
    }
    if (joker.id === 'holy_word') {
      const hasAlef = cards.some(c => c.letter === 'א');
      const hasMem = cards.some(c => c.letter === 'מ' || c.letter === 'ם');
      const hasShin = cards.some(c => c.letter === 'ש');
      if (hasAlef && hasMem && hasShin) {
        mult *= 77;
      }
    }
    if (joker.id === 'destiny' && Math.random() < 0.05) {
      mult *= 100;
    }
    
    // ג'וקרים חדשים שהוספנו
    if (joker.id === 'even_odd') {
      const hasEven = cards.some(c => c.value % 2 === 0);
      const hasOdd = cards.some(c => c.value % 2 === 1);
      if (hasEven && hasOdd) {
        chips += 30;
      }
    }
    if (joker.id === 'mirror') {
      const word = cards.map(c => c.letter).join('');
      const reversed = cards.map(c => c.letter).reverse().join('');
      if (word === reversed && word.length >= 2) {
        mult *= 10;
      }
    }
    if (joker.id === 'letter_13') {
      cards.forEach(c => {
        if (c.letter === 'מ' || c.letter === 'ם') {
          chips += c.value * 3; // ×4 total (already counted once)
        }
      });
    }
    if (joker.id === 'first_last_same') {
      if (cards.length >= 2 && cards[0].letter === cards[cards.length-1].letter) {
        mult *= 8;
      }
    }
    if (joker.id === 'three_in_row') {
      const hasThree = Object.values(letterCount).some(count => count >= 3);
      if (hasThree) {
        mult *= 12;
      }
    }
    if (joker.id === 'prime_number') {
      const isPrime = (n) => {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) return false;
        }
        return true;
      };
      if (isPrime(letterSum)) {
        mult *= 7;
      }
    }
    if (joker.id === 'vowel_heavy') {
      const vowelCount = cards.filter(c => ['א','ו','י'].includes(c.letter)).length;
      if (vowelCount > cards.length / 2) {
        mult *= 6;
      }
    }
    if (joker.id === 'mega_combo') {
      // צריך לשמור counter - נעשה בפשטות
      mult *= 1; // placeholder - צריך state
    }
    if (joker.id === 'wild_master') {
      cards.forEach(c => {
        if (c.isWildcard) {
          chips += 25;
        }
      });
    }
    if (joker.id === 'all_letters_bonus') {
      const allDifferent = cards.length === uniqueCount;
      if (allDifferent && cards.length >= 3) {
        mult *= 20;
      }
    }
  });
  
  // בוס "היקר"
  if (bossBlind?.id === 'expensive') {
    return cards.length * 10;
  }
  
  return Math.floor(chips * mult);
}

function validateBossChallenge(cards, bossBlind) {
  if (!bossBlind) return { valid: true };
  
  const word = cards.map(c => c.letter).join('');
  
  switch (bossBlind.id) {
    case 'censor':
      if (word.includes('ס') || word.includes('ע')) {
        return { valid: false, reason: 'אסור להשתמש באותיות ס או ע!' };
      }
      break;
    case 'long_only':
      if (cards.length < 4) {
        return { valid: false, reason: 'רק מילים בנות 4-5 אותיות!' };
      }
      break;
    case 'short_only':
      if (cards.length > 3) {
        return { valid: false, reason: 'רק מילים בנות 2-3 אותיות!' };
      }
      break;
    case 'no_finals':
      if (cards.some(c => ['ך','ם','ן','ף','ץ'].includes(c.letter))) {
        return { valid: false, reason: 'אסור באותיות סופיות!' };
      }
      break;
    case 'expensive':
      // זה משנה רק את החישוב, לא את הוולידציה
      break;
    case 'final_boss':
      // כל האתגרים
      if (word.includes('ס') || word.includes('ע')) {
        return { valid: false, reason: 'אסור ס/ע (בוס סופי)' };
      }
      if (cards.some(c => ['ך','ם','ן','ף','ץ'].includes(c.letter))) {
        return { valid: false, reason: 'אסור סופיות (בוס סופי)' };
      }
      break;
  }
  
  return { valid: true };
}

// ===============================
// קומפוננטות
// ===============================

function Card({ card, onClick, selected, inHand }) {
  const hasUpgrades = card.upgrades && card.upgrades.length > 0;
  const isWildcard = card.isWildcard;
  
  return (
    <div
      onClick={onClick}
      className={`
        relative w-24 h-32 rounded-xl border-4 flex flex-col items-center justify-center 
        transition-all duration-300 select-none
        ${isWildcard ? 'bg-gradient-to-br from-purple-300 via-purple-200 to-purple-100' : 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-50'}
        ${selected ? 'border-blue-500 -translate-y-8 shadow-2xl scale-110' : hasUpgrades ? 'border-yellow-500 shadow-lg shadow-yellow-500/40' : 'border-amber-900 shadow-lg'}
        ${inHand ? 'cursor-pointer hover:-translate-y-4 hover:shadow-2xl hover:scale-105' : 'cursor-default'}
      `}
      style={{
        boxShadow: selected ? '0 20px 60px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)' : 
                   hasUpgrades ? '0 10px 30px rgba(255, 215, 0, 0.4)' : 
                   '0 4px 15px rgba(0,0,0,0.2)'
      }}
    >
      {/* רקע מעוצב */}
      <div className="absolute inset-0 opacity-10 rounded-xl overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '15px 15px'
        }} />
      </div>

      {/* אייקוני שדרוג */}
      {hasUpgrades && (
        <div className="absolute -top-2 -right-2 flex gap-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1.5 shadow-lg animate-pulse z-10">
          {card.upgrades.map((upg, i) => {
            const upgrade = UPGRADES.find(u => u.id === upg);
            return upgrade ? (
              <span key={i} className="text-base filter drop-shadow-lg">{upgrade.icon}</span>
            ) : null;
          })}
        </div>
      )}
      
      {/* האות */}
      <div className={`text-5xl font-bold relative z-10 ${isWildcard ? 'text-purple-900' : 'text-amber-900'}`}
           style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.15)' }}>
        {card.letter}
      </div>
      
      {/* הערך */}
      <div className={`text-xl font-bold mt-1 px-2 py-0.5 rounded-full ${
        hasUpgrades ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md' : 
        isWildcard ? 'bg-purple-200 text-purple-900' : 
        'bg-amber-200 text-amber-900'
      }`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
        {isWildcard ? '★' : getCardValue(card)}
      </div>

      {/* אפקט זוהר כשנבחר */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-xl pointer-events-none" />
      )}
    </div>
  );
}

function JokerCard({ joker, onClick, canBuy, small }) {
  const rarityColors = {
    common: 'from-gray-600 to-gray-800',
    uncommon: 'from-green-600 to-green-800',
    rare: 'from-blue-600 to-blue-800',
    legendary: 'from-purple-600 to-purple-900'
  };

  return (
    <div
      onClick={canBuy ? onClick : undefined}
      className={`
        ${small ? 'p-2' : 'p-4'} bg-gradient-to-br ${rarityColors[joker.rarity]}
        rounded-lg border-2 border-white/20 ${small ? 'min-w-[100px]' : 'min-w-[140px]'} 
        transition-all duration-200
        ${canBuy ? 'cursor-pointer hover:border-white/50 hover:scale-105 hover:shadow-xl' : canBuy === undefined ? '' : 'opacity-50 cursor-not-allowed'}
      `}
    >
      <div className={`${small ? 'text-2xl' : 'text-3xl'} mb-1`}>{joker.icon}</div>
      <div className={`font-bold ${small ? 'text-xs' : 'text-sm'}`}>{joker.name}</div>
      <div className={`text-xs text-white/80 ${small ? 'text-[10px]' : 'mt-1'}`}>{joker.desc}</div>
      {canBuy !== undefined && (
        <div className={`text-yellow-400 font-bold ${small ? 'text-sm mt-1' : 'mt-2'}`}>{joker.cost}₪</div>
      )}
    </div>
  );
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-[fall_2s_ease-out_forwards]"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            animationDelay: `${i * 50}ms`,
            width: '10px',
            height: '10px',
            background: ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98'][Math.floor(Math.random() * 4)],
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function Game() {
  const [gameMode, setGameMode] = useState('menu');
  const [kidsMode, setKidsMode] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [handSize, setHandSize] = useState(8);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(300);
  const [money, setMoney] = useState(4);
  const [handsLeft, setHandsLeft] = useState(4);
  const [discardsLeft, setDiscardsLeft] = useState(3);
  const [baseHands, setBaseHands] = useState(4);
  const [baseDiscards, setBaseDiscards] = useState(3);
  const [ante, setAnte] = useState(1);
  const [blind, setBlind] = useState('small');
  const [currentBossBlind, setCurrentBossBlind] = useState(null);
  const [jokers, setJokers] = useState([]);
  const [maxJokers, setMaxJokers] = useState(5);
  const [vouchers, setVouchers] = useState([]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasFreeReroll, setHasFreeReroll] = useState(false);
  const [shuffledBosses, setShuffledBosses] = useState([]);
  
  const [shopJokers, setShopJokers] = useState([]);
  const [shopUpgrades, setShopUpgrades] = useState([]);
  const [shopVouchers, setShopVouchers] = useState([]);
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  const startGame = (kids = false, selectedDifficulty = 'normal') => {
    setKidsMode(kids);
    setDifficulty(selectedDifficulty);
    setNeedsApproval(false);
    setScore(0);
    
    // כסף לפי רמת קושי
    const diffConfig = DIFFICULTIES[selectedDifficulty];
    setMoney(diffConfig.startMoney);
    
    setAnte(1);
    setBlind('small');
    setJokers([]);
    setVouchers([]);
    setShowConfetti(false);
    setCurrentBossBlind(null);
    
    // ערבב אתגרי בוס באקראי!
    const bossList = [...BOSS_BLINDS];
    const finalBoss = bossList.pop(); // שמור את הבוס הסופי
    const shuffled = shuffleArray(bossList);
    shuffled.push(finalBoss); // הבוס הסופי תמיד אחרון
    setShuffledBosses(shuffled);
    
    // צור חפיסה חדשה
    const newDeck = createDeck();
    setDeck(newDeck);
    setHand([]);
    
    setGameMode('blindSelect');
  };

  const toggleCard = (card) => {
    if (needsApproval) return;
    
    if (selected.find(c => c.id === card.id)) {
      setSelected(selected.filter(c => c.id !== card.id));
    } else if (selected.length < 5) {
      setSelected([...selected, card]);
    }
  };

  const playHand = () => {
    if (selected.length < 2 || selected.length > 5) {
      return;
    }

    // בדיקת אתגר בוס
    if (currentBossBlind) {
      const validation = validateBossChallenge(selected, currentBossBlind);
      if (!validation.valid) {
        alert('❌ ' + validation.reason);
        return;
      }
    }

    if (kidsMode) {
      setNeedsApproval(true);
    } else {
      approveWord();
    }
  };

  const approveWord = () => {
    let points = calculateScore(selected, jokers);
    
    // בוס "היקר" - כל קלף שווה רק 1
    if (currentBossBlind?.id === 'expensive') {
      points = selected.length * 10; // בסיסי בלבד
    }
    
    const newScore = score + points;
    setScore(newScore);
    
    const newHand = hand.filter(c => !selected.find(s => s.id === c.id));
    
    // משוך קלפים חדשים
    const cardsToDrawCount = 8 - newHand.length;
    const newCards = deck.slice(0, cardsToDrawCount);
    setHand([...newHand, ...newCards]);
    setDeck(deck.slice(cardsToDrawCount));
    
    setSelected([]);
    const newHandsLeft = handsLeft - 1;
    setHandsLeft(newHandsLeft);
    setNeedsApproval(false);
    
    // אנימציית confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    
    if (newScore >= targetScore) {
      // ניצחון! תן כסף
      const config = BLIND_CONFIGS[blind];
      const reward = config.reward + Math.floor(newHandsLeft); // כסף עבור ידיים שנשארו
      setMoney(money + reward);
      
      setTimeout(() => {
        setGameMode('shop');
        generateShop();
      }, 1000);
    } else if (newHandsLeft <= 0) {
      setTimeout(() => {
        alert('Game Over! הגעת ל-' + newScore + ' נקודות. נסה שוב!');
        setGameMode('menu');
      }, 1000);
    }
  };

  const rejectWord = () => {
    setNeedsApproval(false);
    setSelected([]);
    const newHandsLeft = handsLeft - 1;
    setHandsLeft(newHandsLeft);
    
    if (newHandsLeft <= 0) {
      setTimeout(() => {
        alert('Game Over! הידיים נגמרו. נסה שוב!');
        setGameMode('menu');
      }, 500);
    }
  };

  const discardCards = () => {
    if (selected.length === 0 || needsApproval || discardsLeft <= 0) return;
    
    const newHand = hand.filter(c => !selected.find(s => s.id === c.id));
    const newCards = deck.slice(0, selected.length);
    setHand([...newHand, ...newCards]);
    setDeck(deck.slice(selected.length));
    setSelected([]);
    setDiscardsLeft(discardsLeft - 1);
  };

  const generateShop = () => {
    const availableJokers = JOKERS.filter(j => !jokers.find(oj => oj.id === j.id));
    const shopJ = shuffleArray(availableJokers).slice(0, 3);
    setShopJokers(shopJ);
    
    const shopU = shuffleArray(UPGRADES).slice(0, 3);
    setShopUpgrades(shopU);
  };

  const buyJoker = (joker) => {
    if (money >= joker.cost && jokers.length < 5) {
      setJokers([...jokers, joker]);
      setMoney(money - joker.cost);
      setShopJokers(shopJokers.filter(j => j.id !== joker.id));
    }
  };

  const buyUpgrade = (upgrade) => {
    if (money >= upgrade.cost) {
      setSelectedUpgrade(upgrade);
      setGameMode('upgrade');
    }
  };

  const applyUpgrade = (card) => {
    if (!selectedUpgrade || card.upgrades?.includes(selectedUpgrade.id)) return;
    
    const allCards = [...hand, ...deck];
    const updatedCards = allCards.map(c => {
      if (c.id === card.id) {
        return { ...c, upgrades: [...(c.upgrades || []), selectedUpgrade.id] };
      }
      return c;
    });
    
    setHand(updatedCards.slice(0, hand.length));
    setDeck(updatedCards.slice(hand.length));
    setMoney(money - selectedUpgrade.cost);
    setSelectedUpgrade(null);
    setGameMode('shop');
  };

  const continueGame = () => {
    let newBlind = blind;
    let newAnte = ante;
    
    if (blind === 'small') {
      newBlind = 'big';
    } else if (blind === 'big') {
      newBlind = 'boss';
    } else {
      newAnte = ante + 1;
      newBlind = 'small';
    }
    
    setBlind(newBlind);
    setAnte(newAnte);
    
    // עבור לבחירת blind
    setGameMode('blindSelect');
  };

  const startBlind = () => {
    const config = BLIND_CONFIGS[blind];
    const diffConfig = DIFFICULTIES[difficulty];
    const baseScore = 300;
    const newTargetScore = Math.floor(baseScore * ante * config.scoreMultiplier * diffConfig.scoreMultiplier);
    setTargetScore(newTargetScore);
    
    // הגדר אתגר בוס - מהרשימה המעורבבת!
    if (blind === 'boss') {
      const bossIndex = Math.min(ante - 1, shuffledBosses.length - 1);
      const bossBlind = shuffledBosses[bossIndex] || shuffledBosses[0];
      setCurrentBossBlind(bossBlind);
      
      // אתגרים מיוחדים
      if (bossBlind.id === 'no_discards') {
        setDiscardsLeft(0);
        setHandsLeft(config.hands);
      } else if (bossBlind.id === 'few_hands' || bossBlind.id === 'time_limit') {
        setHandsLeft(2);
        setDiscardsLeft(config.discards);
      } else {
        setHandsLeft(config.hands);
        setDiscardsLeft(config.discards);
      }
    } else {
      setCurrentBossBlind(null);
      setHandsLeft(config.hands);
      setDiscardsLeft(config.discards);
    }
    
    setScore(0);
    
    // אם אין חפיסה (משחק חדש), צור חפיסה
    // אחרת - שמור את החפיסה הקיימת עם השדרוגים!
    if (deck.length === 0 && hand.length === 0) {
      const newDeck = createDeck();
      setDeck(newDeck.slice(8));
      setHand(newDeck.slice(0, 8));
    } else {
      // ערבב את כל הקלפים (יד + חפיסה) ותן יד חדשה
      const allCards = shuffleArray([...hand, ...deck]);
      setDeck(allCards.slice(8));
      setHand(allCards.slice(0, 8));
    }
    
    setSelected([]);
    setGameMode('game');
  };

  // ===============================
  // מסכים
  // ===============================

  if (gameMode === 'blindSelect') {
    const config = BLIND_CONFIGS[blind];
    const baseScore = 300;
    const newTargetScore = Math.floor(baseScore * ante * config.scoreMultiplier);
    const bossBlind = blind === 'boss' ? (BOSS_BLINDS[ante - 1] || BOSS_BLINDS[BOSS_BLINDS.length - 1]) : null;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-2xl w-full bg-black/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border-4 border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 text-yellow-400">
              {config.icon} {config.name}
            </h1>
            <div className="text-2xl text-gray-300">
              Ante {ante}
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {/* דרישות */}
            <div className="bg-blue-900/50 p-6 rounded-xl border-2 border-blue-500">
              <div className="text-xl font-bold mb-3 text-blue-300">🎯 דרישות:</div>
              <div className="text-3xl font-bold text-white">
                {newTargetScore.toLocaleString()} נקודות
              </div>
            </div>

            {/* משאבים */}
            <div className="bg-green-900/50 p-6 rounded-xl border-2 border-green-500">
              <div className="text-xl font-bold mb-3 text-green-300">🎮 משאבים:</div>
              <div className="grid grid-cols-2 gap-4 text-lg">
                <div>
                  🃏 <span className="font-bold">{bossBlind?.id === 'few_hands' ? 2 : config.hands}</span> ידיים
                </div>
                <div>
                  🔄 <span className="font-bold">{bossBlind?.id === 'no_discards' ? 0 : config.discards}</span> זריקות
                </div>
              </div>
            </div>

            {/* פרס */}
            <div className="bg-yellow-900/50 p-6 rounded-xl border-2 border-yellow-500">
              <div className="text-xl font-bold mb-3 text-yellow-300">💰 פרס:</div>
              <div className="text-2xl font-bold text-white">
                {config.reward}₪ + 1₪ עבור כל יד שנשארה
              </div>
            </div>

            {/* אתגר בוס */}
            {bossBlind && (
              <div className="bg-red-900/50 p-6 rounded-xl border-2 border-red-500 animate-pulse">
                <div className="text-xl font-bold mb-3 text-red-300">
                  {bossBlind.icon} אתגר בוס: {bossBlind.name}
                </div>
                <div className="text-lg text-white">
                  {bossBlind.desc}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={startBlind}
            className="w-full px-8 py-6 bg-gradient-to-r from-green-600 to-green-800 rounded-xl font-bold text-2xl hover:from-green-700 hover:to-green-900 transition-all transform hover:scale-105 shadow-xl"
          >
            ▶️ התחל!
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // מסך בחירת רמת קושי
  // ===============================
  
  if (gameMode === 'difficulty' || gameMode === 'difficulty_kids') {
    const isKids = gameMode === 'difficulty_kids';
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-4xl w-full">
          <button
            onClick={() => setGameMode('menu')}
            className="mb-6 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            ← חזור לתפריט
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">
              {isKids ? '👶 מצב ילדים' : '🎮 משחק חופשי'}
            </h1>
            <p className="text-xl text-gray-300">בחר רמת קושי</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(DIFFICULTIES).map(([key, diff]) => (
              <button
                key={key}
                onClick={() => startGame(isKids, key)}
                className={`p-6 bg-gradient-to-r ${diff.color} rounded-xl hover:scale-105 transition-all transform shadow-xl`}
              >
                <div className="text-5xl mb-3">{diff.icon}</div>
                <div className="text-2xl font-bold mb-2">{diff.name}</div>
                <div className="text-sm mb-3">{diff.desc}</div>
                <div className="text-xs space-y-1 bg-black/30 p-3 rounded-lg">
                  <div>💰 כסף התחלה: {diff.startMoney}₪</div>
                  <div>🎯 יעד: ×{diff.scoreMultiplier}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // מסך הוראות
  // ===============================
  
  if (gameMode === 'help') {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setGameMode('menu')}
            className="mb-4 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            ← חזור לתפריט
          </button>

          <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl">
            <h1 className="text-4xl font-bold mb-6 text-yellow-400 text-center">
              📖 איך לשחק ב"כתב"
            </h1>

            {/* מטרת המשחק */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3 text-blue-300">🎯 מטרת המשחק</h2>
              <p className="text-lg">
                בנה מילים מאותיות עבריות כדי לצבור נקודות והגע ליעד!
              </p>
            </div>

            {/* איך זה עובד */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3 text-green-300">🎮 איך זה עובד?</h2>
              <div className="space-y-2 text-lg">
                <div>1️⃣ בחר 2-5 אותיות מהיד שלך</div>
                <div>2️⃣ לחץ "שחק מילה" כדי לקבל נקודות</div>
                <div>3️⃣ הגע ליעד לפני שהידיים נגמרות</div>
                <div>4️⃣ קנה ג׳וקרים בחנות לאחר כל Blind</div>
              </div>
            </div>

            {/* מערכת הניקוד */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3 text-purple-300">📊 מערכת הניקוד</h2>
              <div className="bg-purple-900/30 p-4 rounded-lg space-y-2">
                <div>💎 <strong>ערך אותיות:</strong> א=1, ב=2, ... ת=22</div>
                <div>⭐ <strong>בונוס לפי אורך:</strong></div>
                <div className="mr-6 space-y-1 text-sm">
                  <div>• 2 אותיות: +10 צ׳יפס × 1</div>
                  <div>• 3 אותיות: +20 צ׳יפס × 2</div>
                  <div>• 4 אותיות: +40 צ׳יפס × 4</div>
                  <div>• 5 אותיות: +60 צ׳יפס × 5</div>
                </div>
                <div className="mt-3 p-3 bg-yellow-900/40 rounded-lg text-sm">
                  <strong>נוסחה:</strong> (סכום אותיות + בונוס) × מכפיל
                </div>
              </div>
            </div>

            {/* דוגמה */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3 text-yellow-300">💡 דוגמה</h2>
              <div className="bg-yellow-900/30 p-4 rounded-lg text-sm">
                <div className="text-lg mb-2">מילה: "שלום" (5 אותיות)</div>
                <div>ש(21) + ל(12) + ו(6) + ם(13) = 52</div>
                <div>בונוס: +60 צ׳יפס</div>
                <div>סה"כ: 112 צ׳יפס</div>
                <div>מכפיל: ×5</div>
                <div className="text-xl font-bold text-yellow-400 mt-2">
                  ניקוד: 112 × 5 = 560 נקודות! 🎉
                </div>
              </div>
            </div>

            {/* טיפים */}
            <div>
              <h2 className="text-2xl font-bold mb-3 text-orange-300">💡 טיפים</h2>
              <div className="space-y-2">
                <div>🎴 קנה ג׳וקרים שמשלימים אחד את השני</div>
                <div>⬆️ שדרג אותיות חזקות (כמו ש, ת, ר)</div>
                <div>🎯 שמור ידיים לסוף - תקבל כסף בונוס!</div>
                <div>📏 מילים ארוכות = יותר נקודות</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // מסך תפריט ראשי
  // ===============================
  
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-6 text-yellow-400 animate-pulse">🎴 כתב 🎴</h1>
          <p className="text-2xl mb-2 text-blue-300">משחק קלפי האותיות</p>
          <p className="text-sm mb-8 text-gray-400">מבוסס על Balatro</p>
          
          <div className="space-y-4">
            <button
              onClick={() => setGameMode('difficulty')}
              className="w-72 px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-blue-900 transition-all transform hover:scale-105 shadow-xl hover:shadow-blue-500/50"
            >
              🎮 משחק חופשי
            </button>
            
            <button
              onClick={() => setGameMode('difficulty_kids')}
              className="w-72 px-8 py-5 bg-gradient-to-r from-green-600 to-green-800 rounded-xl font-bold text-xl hover:from-green-700 hover:to-green-900 transition-all transform hover:scale-105 shadow-xl hover:shadow-green-500/50"
            >
              👶 מצב ילדים
            </button>
            
            <button
              onClick={() => setGameMode('help')}
              className="w-72 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105 shadow-xl hover:shadow-purple-500/50"
            >
              📖 הוראות והסבר
            </button>
            
            <div className="text-sm text-gray-400 mt-6 max-w-md mx-auto bg-black/30 p-4 rounded-lg">
              <p className="mb-3"><strong className="text-blue-400">🎮 משחק חופשי:</strong><br/>כל מילה מתקבלת אוטומטית</p>
              <p><strong className="text-green-400">👶 מצב ילדים:</strong><br/>מבוגר צריך לאשר שהמילה נכונה</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'shop') {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6 bg-black/30 p-4 rounded-xl">
            <h1 className="text-4xl font-bold text-yellow-400">🏪 החנות</h1>
            <div className="text-3xl font-bold text-yellow-400">💰 {money}₪</div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-300">ג'וקרים ({jokers.length}/5)</h2>
            <div className="flex gap-4 flex-wrap">
              {shopJokers.length > 0 ? shopJokers.map(joker => (
                <JokerCard
                  key={joker.id}
                  joker={joker}
                  onClick={() => buyJoker(joker)}
                  canBuy={money >= joker.cost && jokers.length < 5}
                />
              )) : (
                <div className="text-gray-400">אין עוד ג'וקרים זמינים</div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-purple-300">שדרוגי אותיות</h2>
            <div className="flex gap-4 flex-wrap">
              {shopUpgrades.map(upgrade => (
                <div
                  key={upgrade.id}
                  onClick={() => buyUpgrade(upgrade)}
                  className={`
                    p-4 bg-gradient-to-br from-purple-600 to-purple-800
                    rounded-lg border-2 border-white/20 min-w-[140px] transition-all duration-200
                    ${money >= upgrade.cost ? 'cursor-pointer hover:border-white/50 hover:scale-105 hover:shadow-xl' : 'opacity-50 cursor-not-allowed'}
                  `}
                >
                  <div className="text-3xl mb-2">{upgrade.icon}</div>
                  <div className="font-bold text-sm">{upgrade.name}</div>
                  <div className="text-xs text-white/80 mt-1">{upgrade.desc}</div>
                  <div className="text-yellow-400 font-bold mt-2">{upgrade.cost}₪</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={continueGame}
            className="w-full px-8 py-5 bg-gradient-to-r from-green-600 to-green-800 rounded-xl font-bold text-2xl hover:from-green-700 hover:to-green-900 transition-all transform hover:scale-105 shadow-xl"
          >
            ➡️ המשך למשחק
          </button>
        </div>
      </div>
    );
  }

  if (gameMode === 'upgrade') {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/30 p-6 rounded-xl mb-6">
            <h1 className="text-3xl font-bold mb-2 text-yellow-400">
              בחר אות לשדרוג
            </h1>
            <div className="text-xl text-purple-300">
              {selectedUpgrade?.icon} {selectedUpgrade?.name} - {selectedUpgrade?.desc}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {[...hand, ...deck].map(card => (
              <div key={card.id} className="relative">
                <Card
                  card={card}
                  onClick={() => applyUpgrade(card)}
                  selected={false}
                  inHand={true}
                />
                {card.upgrades?.includes(selectedUpgrade?.id) && (
                  <div className="absolute inset-0 bg-red-500/50 rounded-lg flex items-center justify-center text-xs font-bold">
                    כבר יש
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setGameMode('shop')}
            className="px-8 py-4 bg-gray-600 rounded-lg hover:bg-gray-700 font-bold text-xl transition"
          >
            ← חזור לחנות
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // מסך משחק ראשי
  // ===============================

  const selectedWord = selected.map(c => c.letter).join('');
  const selectedScore = selected.length >= 2 ? calculateScore(selected, jokers) : 0;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {showConfetti && <Confetti />}
      
      <div className="max-w-7xl mx-auto">
        {/* סטטוס בר */}
        <div className="flex justify-between items-center mb-4 bg-black/40 backdrop-blur-sm p-5 rounded-xl shadow-2xl">
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">
              Ante {ante} - {blind === 'small' ? '🟢 קטן' : blind === 'big' ? '🟡 גדול' : '🔴 בוס'}
            </div>
            <div className="text-3xl font-bold mb-2">
              {score.toLocaleString()} / {targetScore.toLocaleString()}
            </div>
            <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-500 shadow-lg"
                style={{ width: `${Math.min(100, (score / targetScore) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="text-center mx-8">
            <div className="text-yellow-400 text-4xl font-bold drop-shadow-lg">💰 {money}₪</div>
            {kidsMode && (
              <div className="text-xs text-green-400 mt-2 bg-green-900/30 px-3 py-1 rounded-full">
                👶 מצב ילדים
              </div>
            )}
          </div>
          
          <div className="flex-1 text-left">
            <div className="text-xl mb-1">🃏 ידיים: <span className="font-bold text-blue-400">{handsLeft}</span></div>
            <div className="text-xl">🔄 זריקות: <span className="font-bold text-orange-400">{discardsLeft}</span></div>
          </div>
        </div>

        {/* ג'וקרים */}
        {jokers.length > 0 && (
          <div className="mb-4 flex gap-2 bg-black/30 backdrop-blur-sm p-4 rounded-xl overflow-x-auto shadow-lg">
            {jokers.map(joker => (
              <JokerCard key={joker.id} joker={joker} small />
            ))}
          </div>
        )}

        {/* אתגר בוס */}
        {currentBossBlind && (
          <div className="mb-4 bg-red-900/30 backdrop-blur-sm p-4 rounded-xl border-2 border-red-500 animate-pulse">
            <div className="text-center">
              <span className="text-2xl mr-2">{currentBossBlind.icon}</span>
              <span className="font-bold text-red-300 text-lg">{currentBossBlind.name}:</span>
              <span className="text-white text-lg mr-2">{currentBossBlind.desc}</span>
            </div>
          </div>
        )}

        {/* יד הקלפים */}
        <div className="mb-6">
          <div className="flex justify-center gap-3 flex-wrap mb-6 min-h-[140px]">
            {hand.map(card => (
              <Card
                key={card.id}
                card={card}
                onClick={() => toggleCard(card)}
                selected={!!selected.find(c => c.id === card.id)}
                inHand={!needsApproval}
              />
            ))}
          </div>

          {/* תצוגת מילה נבחרת */}
          {selected.length > 0 && (
            <div className="text-center mb-6 bg-black/40 backdrop-blur-sm p-6 rounded-xl shadow-2xl">
              <div className="text-5xl font-bold mb-3 tracking-wider text-yellow-300 drop-shadow-lg">
                {selectedWord}
              </div>
              {selected.length >= 2 && (
                <div>
                  <div className="text-3xl text-green-400 font-bold animate-pulse mb-3">
                    {selectedScore.toLocaleString()} נקודות
                  </div>
                  
                  {/* פירוט מהיר */}
                  <div className="text-sm space-y-1 bg-black/30 p-3 rounded-lg">
                    <div className="text-blue-300">
                      💎 אותיות: {selected.reduce((sum, c) => sum + getCardValue(c), 0)}
                    </div>
                    <div className="text-green-300">
                      ⭐ בונוס: +{ { 2: 10, 3: 20, 4: 40, 5: 60 }[selected.length] || 10 }
                    </div>
                    <div className="text-purple-300">
                      ✖️ מכפיל: ×{ { 2: 1, 3: 2, 4: 4, 5: 5 }[selected.length] || 1 }
                    </div>
                    {jokers.some(j => j.id === 'doubles') && selected.reduce((count, c) => {
                      const letterCount = selected.filter(card => card.letter === c.letter).length;
                      return Math.max(count, letterCount);
                    }, 0) >= 2 && (
                      <div className="text-yellow-300">🃏 כפילות: +20</div>
                    )}
                  </div>
                </div>
              )}
              {selected.length < 2 && (
                <div className="text-lg text-gray-400">
                  בחר לפחות 2 אותיות
                </div>
              )}
            </div>
          )}

          {/* אישור מילה - מצב ילדים */}
          {needsApproval && (
            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-4 border-yellow-500 rounded-xl p-6 mb-6 shadow-2xl backdrop-blur-sm">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold mb-3 text-yellow-300">
                  המילה: {selectedWord}
                </div>
                <div className="text-xl mb-2 text-white">מבוגר, האם המילה נכונה?</div>
                <div className="text-green-400 font-bold text-2xl">{selectedScore.toLocaleString()} נקודות</div>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={approveWord}
                  className="px-12 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl font-bold text-xl transition-all transform hover:scale-110 shadow-xl"
                >
                  ✓ כן, נכונה
                </button>
                <button
                  onClick={rejectWord}
                  className="px-12 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-bold text-xl transition-all transform hover:scale-110 shadow-xl"
                >
                  ✗ לא נכונה
                </button>
              </div>
            </div>
          )}

          {/* כפתורי פעולה */}
          {!needsApproval && (
            <div className="flex justify-center gap-4">
              <button
                onClick={playHand}
                disabled={selected.length < 2}
                className={`
                  px-12 py-5 rounded-xl font-bold text-2xl transition-all transform shadow-2xl
                  ${selected.length >= 2
                    ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 hover:scale-110 cursor-pointer'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }
                `}
              >
                ✅ שחק מילה
              </button>
              
              <button
                onClick={discardCards}
                disabled={selected.length === 0 || discardsLeft <= 0}
                className={`
                  px-12 py-5 rounded-xl font-bold text-2xl transition-all transform shadow-2xl
                  ${selected.length > 0 && discardsLeft > 0
                    ? 'bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 hover:scale-110 cursor-pointer'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }
                `}
              >
                🔄 זרוק קלפים
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
