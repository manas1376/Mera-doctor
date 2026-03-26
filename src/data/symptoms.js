export const symptomIcons = [
  { id: 'fever', label: { en: 'Fever', hi: 'बुखार', hinglish: 'Bukhar', mr: 'ताप', bn: 'জ্বর', ta: 'காய்ச்சல்', te: 'జ్వరం' }, icon: '🌡️', color: 'bg-red-50 border-red-200 text-red-700', keywords: ['fever', 'temperature', 'hot', 'bukhar', 'tap'] },
  { id: 'headache', label: { en: 'Headache', hi: 'सिरदर्द', hinglish: 'Sir dard', mr: 'डोकेदुखी', bn: 'মাথাব্যথা', ta: 'தலைவலி', te: 'తలనొప్పి' }, icon: '🧠', color: 'bg-purple-50 border-purple-200 text-purple-700', keywords: ['headache', 'head', 'sir', 'dard'] },
  { id: 'cough', label: { en: 'Cough', hi: 'खांसी', hinglish: 'Khansi', mr: 'खोकला', bn: 'কাশি', ta: 'இருமல்', te: 'దగ్గు' }, icon: '🫁', color: 'bg-blue-50 border-blue-200 text-blue-700', keywords: ['cough', 'khansi', 'khoka'] },
  { id: 'chest_pain', label: { en: 'Chest Pain', hi: 'सीने में दर्द', hinglish: 'Chest dard', mr: 'छातीत दुखणे', bn: 'বুকে ব্যথা', ta: 'மார்பு வலி', te: 'ఛాతీ నొప్పి' }, icon: '❤️', color: 'bg-red-50 border-red-300 text-red-800', keywords: ['chest', 'seena', 'heart'] },
  { id: 'stomach_pain', label: { en: 'Stomach Pain', hi: 'पेट दर्द', hinglish: 'Pet dard', mr: 'पोट दुखणे', bn: 'পেটে ব্যথা', ta: 'வயிற்று வலி', te: 'కడుపు నొప్పి' }, icon: '🫃', color: 'bg-yellow-50 border-yellow-200 text-yellow-700', keywords: ['stomach', 'pet', 'abdomen', 'belly'] },
  { id: 'vomiting', label: { en: 'Vomiting', hi: 'उल्टी', hinglish: 'Ulti', mr: 'उलटी', bn: 'বমি', ta: 'வாந்தி', te: 'వాంతి' }, icon: '🤢', color: 'bg-green-50 border-green-200 text-green-700', keywords: ['vomit', 'nausea', 'ulti', 'sick'] },
  { id: 'dizziness', label: { en: 'Dizziness', hi: 'चक्कर', hinglish: 'Chakkar', mr: 'चक्कर', bn: 'মাথা ঘোরা', ta: 'தலைச்சுற்று', te: 'తలతిరగడం' }, icon: '😵', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', keywords: ['dizzy', 'chakkar', 'spinning'] },
  { id: 'weakness', label: { en: 'Weakness', hi: 'कमज़ोरी', hinglish: 'Kamzori', mr: 'अशक्तपणा', bn: 'দুর্বলতা', ta: 'பலவீனம்', te: 'బలహీనత' }, icon: '💪', color: 'bg-gray-50 border-gray-200 text-gray-700', keywords: ['weak', 'tired', 'fatigue', 'kamzor'] },
  { id: 'breathing', label: { en: 'Breathing Problem', hi: 'सांस की तकलीफ', hinglish: 'Saans taklif', mr: 'श्वास घेण्यास त्रास', bn: 'শ্বাস নিতে সমস্যা', ta: 'சுவாசிக்க கஷ்டம்', te: 'శ్వాస తీసుకోవడంలో ఇబ్బంది' }, icon: '🫧', color: 'bg-blue-50 border-blue-300 text-blue-800', keywords: ['breath', 'breathe', 'saans', 'lungs'] },
  { id: 'body_pain', label: { en: 'Body Pain', hi: 'शरीर में दर्द', hinglish: 'Body dard', mr: 'अंगदुखी', bn: 'শরীর ব্যথা', ta: 'உடல் வலி', te: 'శరీర నొప్పి' }, icon: '🦴', color: 'bg-orange-50 border-orange-200 text-orange-700', keywords: ['pain', 'ache', 'body', 'dard'] },
  { id: 'diarrhea', label: { en: 'Diarrhea', hi: 'दस्त', hinglish: 'Dast', mr: 'अतिसार', bn: 'ডায়রিয়া', ta: 'வயிற்றுப்போக்கு', te: 'విరేచనాలు' }, icon: '🚽', color: 'bg-brown-50 border-yellow-300 text-yellow-800', keywords: ['diarrhea', 'loose motion', 'dast'] },
  { id: 'rash', label: { en: 'Skin Rash', hi: 'त्वचा पर दाने', hinglish: 'Skin rash', mr: 'पुरळ', bn: 'চামড়ায় ফুসকুড়ি', ta: 'தோல் வெடிப்பு', te: 'చర్మం దద్దుర్లు' }, icon: '🔴', color: 'bg-pink-50 border-pink-200 text-pink-700', keywords: ['rash', 'skin', 'itch', 'allergy'] },
];

export const bodyParts = [
  { id: 'head', label: 'Head', x: 50, y: 8, width: 12, height: 14 },
  { id: 'neck', label: 'Neck', x: 50, y: 22, width: 6, height: 5 },
  { id: 'chest', label: 'Chest', x: 50, y: 35, width: 20, height: 14 },
  { id: 'abdomen', label: 'Abdomen', x: 50, y: 50, width: 18, height: 12 },
  { id: 'left_arm', label: 'Left Arm', x: 28, y: 38, width: 8, height: 18 },
  { id: 'right_arm', label: 'Right Arm', x: 72, y: 38, width: 8, height: 18 },
  { id: 'left_leg', label: 'Left Leg', x: 42, y: 70, width: 8, height: 26 },
  { id: 'right_leg', label: 'Right Leg', x: 58, y: 70, width: 8, height: 26 },
  { id: 'back', label: 'Back', x: 50, y: 40, width: 18, height: 16 },
  { id: 'throat', label: 'Throat', x: 50, y: 27, width: 7, height: 5 },
];

export const keywordMap = {
  fever: ['fever', 'temperature', 'hot body', 'bukhar', 'tap', 'गर्मी', 'ताप', 'বুখার'],
  headache: ['headache', 'head pain', 'sir dard', 'सिरदर्द', 'डोकेदुखी', 'মাথাব্যথা'],
  cough: ['cough', 'khansi', 'खांसी', 'खोकला', 'কাশি', 'இருமல்', 'దగ్గు'],
  chest_pain: ['chest pain', 'chest', 'seena dard', 'सीने में दर्द', 'heart pain'],
  stomach_pain: ['stomach pain', 'pet dard', 'abdominal pain', 'पेट दर्द', 'পেটে ব্যথা'],
  vomiting: ['vomiting', 'nausea', 'ulti', 'उल्टी', 'बमी', 'বমি'],
  dizziness: ['dizzy', 'dizziness', 'chakkar', 'चक्कर', 'মাথা ঘোরা'],
  weakness: ['weakness', 'tired', 'fatigue', 'kamzori', 'कमज़ोरी', 'দুর্বলতা'],
  breathing: ['breathing problem', 'shortness of breath', 'saans', 'सांस', 'শ্বাস'],
  body_pain: ['body pain', 'muscle pain', 'ache', 'dard', 'दर्द', 'শরীর ব্যথা'],
  diarrhea: ['diarrhea', 'loose motion', 'dast', 'दस्त', 'ডায়রিয়া'],
  rash: ['rash', 'skin rash', 'itching', 'allergy', 'त्वचा', 'চামড়া'],
};

export const detectKeywords = (text) => {
  const lower = text.toLowerCase();
  const detected = [];
  for (const [symptom, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(k => lower.includes(k.toLowerCase()))) {
      detected.push(symptom);
    }
  }
  return detected;
};
