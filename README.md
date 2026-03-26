<<<<<<< HEAD
# Mera-Doctor – Multilingual AI Health Triage


=======
# 🏥 SwasthyaAI – Multilingual AI Health Triage

## ▶️ HOW TO RUN (3 steps)

```
1. Open this folder in terminal / PowerShell
2. npm install
3. npm start
```
>>>>>>> 9c63f71 (connect project)

App opens at → http://localhost:3000

## Demo Login
- Aadhaar: any 12 digits (e.g. 123456789012)
- OTP: 123456

## Features
- 7 languages: English, Hindi, Hinglish, Marathi, Bengali, Tamil, Telugu
- Voice + Text + Icon + Body Map symptom input
- AI triage with risk scoring (Low / Medium / High)
- PDF report download
- Appointment booking
- Text-to-speech on every page
- PWA offline support

<<<<<<< HEAD

=======
## Add OpenAI API Key (optional)
Create a `.env` file:
```
VITE_OPENAI_API_KEY=sk-your-key-here
```
Without it, the app uses a smart mock AI engine.
>>>>>>> 9c63f71 (connect project)

## Tech Stack
- React 18 + Vite + Tailwind CSS
- React Router v6
- jsPDF (report generation)
- lucide-react (icons)
- Web Speech API (voice input + text-to-speech)
- IndexedDB (offline storage)
