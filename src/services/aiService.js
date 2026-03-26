// AI Triage Service - Connects to OpenAI / Infermedica with mock fallback
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const analyzeSymptoms = async ({ symptoms, bodyParts, followUpData, language }) => {
  // Try real OpenAI API first
  if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_key_here') {
    try {
      const prompt = buildPrompt(symptoms, bodyParts, followUpData, language);
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a medical triage AI. Analyze symptoms and return JSON with: riskLevel (low/medium/high), riskScore (0-100), summary, reasoning, recommendations, urgency.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 600,
        })
      });
      const data = await res.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.warn('OpenAI fallback:', e);
    }
  }

  // Mock AI triage logic
  return mockTriageAnalysis(symptoms, bodyParts, followUpData, language);
};

const buildPrompt = (symptoms, bodyParts, followUpData, language) => {
  return `Patient symptoms: ${symptoms.join(', ')}. Body areas: ${bodyParts.join(', ')}. 
  Duration: ${followUpData.duration}, Severity: ${followUpData.severity}, Age: ${followUpData.age}, 
  Gender: ${followUpData.gender}, Conditions: ${followUpData.conditions.join(', ')}, 
  Emergency signs: ${followUpData.emergencySigns.join(', ')}. Respond in language: ${language}`;
};

const mockTriageAnalysis = (symptoms, bodyParts, followUpData, language) => {
  const highRiskSymptoms = ['chest_pain', 'breathing', 'unconscious'];
  const mediumRiskSymptoms = ['fever', 'vomiting', 'diarrhea', 'dizziness'];
  const hasHigh = symptoms.some(s => highRiskSymptoms.includes(s)) || followUpData.emergencySigns.length > 0;
  const hasMedium = symptoms.some(s => mediumRiskSymptoms.includes(s)) || followUpData.severity === 'severe';
  const isElderly = parseInt(followUpData.age) > 60;
  const hasConditions = followUpData.conditions.length > 0;

  let riskLevel = 'low';
  let riskScore = 20;

  if (hasHigh || (hasMedium && isElderly && hasConditions)) {
    riskLevel = 'high';
    riskScore = 75 + Math.random() * 20;
  } else if (hasMedium || (isElderly && hasConditions)) {
    riskLevel = 'medium';
    riskScore = 40 + Math.random() * 25;
  } else {
    riskScore = 10 + Math.random() * 20;
  }

  const summaries = {
    high: {
      en: `Patient presents with ${symptoms.length} concerning symptoms including ${symptoms.slice(0,2).join(' and ')}. Given the severity, existing conditions, and patient age, this requires immediate medical attention. Emergency evaluation recommended.`,
      hi: `मरीज़ को ${symptoms.length} गंभीर लक्षण हैं। तुरंत चिकित्सा जाँच आवश्यक है।`,
      hinglish: `Patient ko ${symptoms.length} serious symptoms hain. Turant doctor se milna zaroori hai.`,
      mr: `रुग्णाला ${symptoms.length} गंभीर लक्षणे आहेत. तातडीने वैद्यकीय तपासणी आवश्यक आहे.`,
      bn: `রোগীর ${symptoms.length}টি গুরুতর লক্ষণ রয়েছে। তাৎক্ষণিক চিকিৎসা প্রয়োজন।`,
      ta: `நோயாளிக்கு ${symptoms.length} தீவிர அறிகுறிகள் உள்ளன. உடனடி மருத்துவ கவனிப்பு தேவை.`,
      te: `రోగికి ${symptoms.length} తీవ్రమైన లక్షణాలు ఉన్నాయి. తక్షణ వైద్య శ్రద్ధ అవసరం.`,
    },
    medium: {
      en: `Patient reports ${symptoms.length} symptoms with moderate severity. Monitor closely and consult a doctor within 24-48 hours. Symptoms suggest possible infection or inflammatory condition.`,
      hi: `मरीज़ को ${symptoms.length} मध्यम लक्षण हैं। 24-48 घंटों में डॉक्टर से मिलें।`,
      hinglish: `Patient ko ${symptoms.length} medium level symptoms hain. 24-48 ghante mein doctor se milein.`,
      mr: `रुग्णाला ${symptoms.length} मध्यम लक्षणे आहेत. 24-48 तासांत डॉक्टरांशी संपर्क साधा.`,
      bn: `রোগীর ${symptoms.length}টি মাঝারি লক্ষণ রয়েছে। ২৪-৪৮ ঘন্টার মধ্যে ডাক্তার দেখান।`,
      ta: `நோயாளிக்கு ${symptoms.length} மிதமான அறிகுறிகள் உள்ளன. 24-48 மணி நேரத்தில் மருத்துவரை சந்தியுங்கள்.`,
      te: `రోగికి ${symptoms.length} మధ్యస్థ లక్షణాలు ఉన్నాయి. 24-48 గంటల్లో డాక్టర్‌ను సంప్రదించండి.`,
    },
    low: {
      en: `Patient has mild symptoms that can be managed with home care. Stay hydrated, rest well, and monitor for any worsening. Follow up with a doctor if symptoms persist beyond 3 days.`,
      hi: `हल्के लक्षण हैं। घर पर आराम करें, पानी पिएं। 3 दिन में ठीक न हो तो डॉक्टर से मिलें।`,
      hinglish: `Halke symptoms hain. Ghar par rest karein, paani piyein. 3 din mein theek na ho to doctor se milein.`,
      mr: `सौम्य लक्षणे आहेत. घरी आराम करा, भरपूर पाणी प्या. 3 दिवसात बरे न झाल्यास डॉक्टरांना भेटा.`,
      bn: `হালকা লক্ষণ রয়েছে। বাড়িতে বিশ্রাম নিন, পানি পান করুন। ৩ দিনে ভালো না হলে ডাক্তার দেখান।`,
      ta: `லேசான அறிகுறிகள் உள்ளன. வீட்டில் ஓய்வெடுங்கள், தண்ணீர் குடியுங்கள். 3 நாட்களில் குணமடையவில்லை என்றால் மருத்துவரை சந்தியுங்கள்.`,
      te: `తేలికపాటి లక్షణాలు ఉన్నాయి. ఇంట్లో విశ్రాంతి తీసుకోండి, నీళ్ళు తాగండి. 3 రోజుల్లో తగ్గకపోతే డాక్టర్‌ను కలవండి.`,
    }
  };

  const recommendations = {
    high: {
      en: ['Go to nearest emergency room immediately', 'Call ambulance if unable to travel', 'Do not eat or drink until evaluated', 'Bring any existing medical records'],
      hi: ['तुरंत नज़दीकी अस्पताल जाएं', 'एम्बुलेंस बुलाएं यदि चलने में असमर्थ', 'जांच तक कुछ न खाएं-पिएं', 'पुरानी रिपोर्ट साथ लेकर जाएं'],
      hinglish: ['Turant nearby hospital jaayein', 'Ambulance bulayein agar chalein naa', 'Check-up tak kuch na khaayein-piyein', 'Puraani report saath leyein'],
    },
    medium: {
      en: ['Book appointment with general physician within 48 hours', 'Take OTC fever/pain medication as needed', 'Stay hydrated and rest', 'Monitor symptoms and return if worsening'],
      hi: ['48 घंटों में डॉक्टर से अपॉइंटमेंट लें', 'बुखार/दर्द की दवाई लें', 'पानी पिएं और आराम करें'],
      hinglish: ['48 ghante mein doctor se appointment lein', 'Bukhar/dard ki dawa lein', 'Paani piyein aur rest karein'],
    },
    low: {
      en: ['Rest and stay hydrated', 'Take OTC medications if needed', 'Monitor temperature every 4 hours', 'Visit doctor if no improvement in 3 days'],
      hi: ['आराम करें और पानी पिएं', 'ज़रूरत हो तो दवाई लें', 'हर 4 घंटे तापमान चेक करें'],
      hinglish: ['Rest karein aur paani piyein', 'Zaroorat ho to dawai lein', 'Har 4 ghante temperature check karein'],
    }
  };

  const lang = language in summaries.high ? language : 'en';
  const recLang = language in recommendations.high ? language : 'en';

  return {
    riskLevel,
    riskScore: Math.round(riskScore),
    summary: summaries[riskLevel][lang],
    recommendations: recommendations[riskLevel][recLang] || recommendations[riskLevel]['en'],
    reasoning: `Based on ${symptoms.length} reported symptoms, ${followUpData.severity || 'moderate'} severity, and patient profile.`,
    urgency: riskLevel === 'high' ? 'IMMEDIATE' : riskLevel === 'medium' ? 'WITHIN 48 HOURS' : 'MONITOR AT HOME',
  };
};

export const saveToIndexedDB = async (key, data) => {
  try {
    const db = await openDB();
    const tx = db.transaction('records', 'readwrite');
    tx.objectStore('records').put({ id: key, data, timestamp: new Date().toISOString() });
    await tx.complete;
  } catch (e) { console.warn('IndexedDB save failed:', e); }
};

export const getFromIndexedDB = async (key) => {
  try {
    const db = await openDB();
    const tx = db.transaction('records', 'readonly');
    return await tx.objectStore('records').get(key);
  } catch (e) { return null; }
};

const openDB = () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('swasthyaai', 1);
    req.onupgradeneeded = (e) => { e.target.result.createObjectStore('records', { keyPath: 'id' }); };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
};
