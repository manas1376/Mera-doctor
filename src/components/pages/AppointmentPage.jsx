import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, CheckCircle2, MapPin, User, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Layout from '../layout/Layout';

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
];

const doctors = [
  { id: 1, name: 'Dr. Priya Sharma', spec: 'General Physician', rating: 4.8, exp: '12 yrs', avatar: '👩‍⚕️' },
  { id: 2, name: 'Dr. Rajesh Kumar', spec: 'Internal Medicine', rating: 4.7, exp: '9 yrs', avatar: '👨‍⚕️' },
  { id: 3, name: 'Dr. Anita Desai', spec: 'Family Medicine', rating: 4.9, exp: '15 yrs', avatar: '👩‍⚕️' },
];

const AppointmentPage = () => {
  const navigate = useNavigate();
  const { t, triageResult, appointment, setAppointment } = useApp();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      val: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
    };
  });

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const appt = {
      doctor: doctors.find(d => d.id === selectedDoctor),
      date: selectedDate,
      slot: selectedSlot,
      bookingId: 'APT-' + Date.now().toString(36).toUpperCase(),
    };
    setAppointment(appt);
    setConfirmed(true);
    setLoading(false);
  };

  const isUrgent = triageResult?.riskLevel === 'high';

  if (confirmed && appointment) {
    return (
      <Layout step="report" readText={`Appointment confirmed with ${appointment.doctor?.name} on ${appointment.date} at ${appointment.slot}`}>
        <div className="animate-scale-in flex flex-col items-center text-center pt-8 pb-4">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-5 shadow-lg shadow-emerald-100">
            <CheckCircle2 size={44} className="text-emerald-500" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">Appointment Confirmed!</h2>
          <p className="text-slate-500 text-sm mb-6">Your appointment has been successfully booked.</p>

          <div className="w-full bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl border border-primary-100 p-5 text-left mb-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{appointment.doctor?.avatar}</span>
              <div>
                <p className="font-bold text-slate-800">{appointment.doctor?.name}</p>
                <p className="text-sm text-primary-600">{appointment.doctor?.spec}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar size={15} className="text-primary-500" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock size={15} className="text-primary-500" />
                <span>{appointment.slot}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2">
                <MapPin size={15} className="text-primary-500" />
                <span>Primary Health Centre, Block A</span>
              </div>
            </div>
            <div className="bg-white rounded-xl px-3 py-2 border border-primary-100">
              <p className="text-xs text-slate-400">Booking ID</p>
              <p className="font-bold text-primary-700 font-mono">{appointment.bookingId}</p>
            </div>
          </div>

          <div className="w-full space-y-3">
            <button onClick={() => navigate('/dashboard')}
              className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary-600 to-teal-600 shadow-lg shadow-primary-200">
              View Summary Dashboard
            </button>
            <button onClick={() => navigate('/report')}
              className="w-full py-3 rounded-2xl font-medium text-slate-500 border border-slate-200 hover:bg-slate-50">
              Back to Report
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout step="report" readText={`${t('appointmentTitle')}. ${t('selectDate')}`}>
      <div className="animate-fade-in space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-slate-800">{t('appointmentTitle')}</h1>
            <p className="text-slate-500 text-sm">{t('selectDate')}</p>
          </div>
        </div>

        {isUrgent && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <p className="font-bold text-red-700 text-sm">Urgent Appointment Recommended</p>
              <p className="text-red-600 text-xs mt-1">Based on your symptoms, please book the earliest available slot or visit the emergency department.</p>
            </div>
          </div>
        )}

        {/* Doctor Selection */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Select Doctor</p>
          <div className="space-y-3">
            {doctors.map(doc => (
              <button key={doc.id} onClick={() => setSelectedDoctor(doc.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                  ${selectedDoctor === doc.id ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <span className="text-3xl">{doc.avatar}</span>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${selectedDoctor === doc.id ? 'text-primary-800' : 'text-slate-800'}`}>{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.spec} • {doc.exp} experience</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs font-semibold text-slate-600">{doc.rating}</span>
                  </div>
                </div>
                {selectedDoctor === doc.id && <CheckCircle2 size={20} className="text-primary-600 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Select Date</p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {dates.map(d => (
              <button key={d.val} onClick={() => setSelectedDate(d.val)}
                className={`flex flex-col items-center gap-1 min-w-[58px] py-3 rounded-2xl border-2 transition-all
                  ${selectedDate === d.val ? 'border-primary-500 bg-primary-600 text-white' : 'border-slate-200 text-slate-700 hover:border-primary-300'}`}>
                <span className="text-[10px] font-bold uppercase">{d.day}</span>
                <span className="text-lg font-display font-bold">{d.date}</span>
                <span className="text-[10px]">{d.month}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Select Time Slot</p>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(slot => {
                const taken = ['9:30 AM', '11:00 AM', '3:00 PM'].includes(slot);
                return (
                  <button key={slot} disabled={taken} onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all border-2
                      ${taken ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed line-through'
                        : selectedSlot === slot ? 'border-primary-500 bg-primary-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-primary-300'}`}>
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">Strikethrough = Booked</p>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedDoctor || !selectedDate || !selectedSlot || loading}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all
            bg-gradient-to-r from-primary-600 to-teal-600 shadow-lg shadow-primary-200
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Confirming...</span></>
          ) : (
            <span>{t('confirmAppointment')}</span>
          )}
        </button>
      </div>
    </Layout>
  );
};

export default AppointmentPage;
