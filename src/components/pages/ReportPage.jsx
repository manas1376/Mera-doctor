import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, Printer, ChevronLeft, FileText, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { symptomIcons } from '../../data/symptoms';
import Layout from '../layout/Layout';
import ReadAloudBtn from '../common/ReadAloudBtn';

const ReportPage = () => {
  const navigate = useNavigate();
  const { t, language, patientId, symptoms, bodyParts, followUpData, triageResult } = useApp();
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef();

  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const getLabel = (id) => {
    const sym = symptomIcons.find(s => s.id === id);
    return sym?.label?.[language] || sym?.label?.en || id.replace(/_/g,' ');
  };

  const riskColors = { low: 'text-emerald-700 bg-emerald-50', medium: 'text-amber-700 bg-amber-50', high: 'text-red-700 bg-red-50' };
  const riskIcons = { low: CheckCircle, medium: AlertCircle, high: AlertTriangle };
  const RiskIcon = riskIcons[triageResult?.riskLevel] || CheckCircle;
  const riskLabel = t(`risk${triageResult?.riskLevel?.charAt(0).toUpperCase() + triageResult?.riskLevel?.slice(1)}`) || triageResult?.riskLevel;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Header
      doc.setFillColor(2, 132, 199);
      doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('SwasthyaAI', 20, 15);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Medical Summary Report', 20, 24);
      doc.text(`Date: ${date}  |  Time: ${time}`, 20, 31);

      // Patient info
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Patient Information', 20, 50);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Patient ID: ${patientId || 'N/A'}`, 20, 60);
      doc.text(`Language: ${language.toUpperCase()}`, 20, 68);
      doc.text(`Age: ${followUpData.age || 'N/A'}  |  Gender: ${followUpData.gender || 'N/A'}`, 20, 76);
      doc.text(`Duration: ${followUpData.duration || 'N/A'}  |  Severity: ${followUpData.severity || 'N/A'}`, 20, 84);

      // Risk Level
      doc.setFillColor(triageResult?.riskLevel === 'high' ? 254 : triageResult?.riskLevel === 'medium' ? 254 : 209,
                        triageResult?.riskLevel === 'high' ? 202 : triageResult?.riskLevel === 'medium' ? 215 : 250,
                        triageResult?.riskLevel === 'high' ? 202 : triageResult?.riskLevel === 'medium' ? 170 : 224);
      doc.rect(15, 92, 180, 18, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Risk Level: ${riskLabel?.toUpperCase()} (Score: ${triageResult?.riskScore}/100)`, 20, 104);

      // Symptoms
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Symptoms Reported', 20, 122);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const sympList = symptoms.map(s => `• ${getLabel(s)}`).join('   ');
      const sympLines = doc.splitTextToSize(sympList || 'None reported', 170);
      doc.text(sympLines, 20, 132);

      // Body areas
      const yAfterSymp = 132 + sympLines.length * 7;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Body Areas Affected', 20, yAfterSymp + 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(bodyParts.length > 0 ? bodyParts.join(', ') : 'None selected', 20, yAfterSymp + 20);

      // AI Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('AI Clinical Summary', 20, yAfterSymp + 35);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(triageResult?.summary || '', 170);
      doc.text(summaryLines, 20, yAfterSymp + 45);

      // Recommendations
      const yRec = yAfterSymp + 45 + summaryLines.length * 7 + 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Recommended Next Steps', 20, yRec);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      (triageResult?.recommendations || []).forEach((rec, i) => {
        doc.text(`${i+1}. ${rec}`, 20, yRec + 12 + i * 8);
      });

      // Footer
      doc.setFillColor(240, 249, 255);
      doc.rect(0, 275, 210, 25, 'F');
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text('This report is AI-generated and should be reviewed by a qualified healthcare professional.', 20, 285);
      doc.text('SwasthyaAI – Powered by Anthropic AI | UIDAI Verified', 20, 291);

      doc.save(`SwasthyaAI_Report_${patientId || 'patient'}.pdf`);
    } catch (e) {
      alert('PDF generation failed. Please try again.');
    }
    setDownloading(false);
  };

  const reportText = `${t('reportTitle')}. Patient ID: ${patientId}. ${t('symptomsReported')}: ${symptoms.map(getLabel).join(', ')}. ${t('riskLevel')}: ${riskLabel}. ${triageResult?.summary}. ${t('nextSteps')}: ${triageResult?.recommendations?.join('. ')}`;

  return (
    <Layout step="report" readText={reportText}>
      <div className="animate-fade-in">
        {/* Header actions */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl text-slate-800">{t('reportTitle')}</h1>
            <p className="text-xs text-slate-400">{date} • {time}</p>
          </div>
          <ReadAloudBtn text={reportText} />
        </div>

        {/* Report card */}
        <div ref={reportRef} className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden mb-5">
          {/* Report header */}
          <div className="bg-gradient-to-r from-primary-700 to-teal-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-lg">SwasthyaAI</p>
                <p className="text-primary-100 text-xs">Medical Summary Report</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/15 rounded-xl px-3 py-2">
                <p className="text-primary-200 mb-0.5">{t('patientId')}</p>
                <p className="font-bold">{patientId || 'N/A'}</p>
              </div>
              <div className="bg-white/15 rounded-xl px-3 py-2">
                <p className="text-primary-200 mb-0.5">{t('reportDate')}</p>
                <p className="font-bold">{date}</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Patient details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Age', val: followUpData.age || 'N/A' },
                { label: 'Gender', val: followUpData.gender ? t(followUpData.gender) : 'N/A' },
                { label: 'Duration', val: followUpData.duration ? t(followUpData.duration) : 'N/A' },
                { label: 'Severity', val: followUpData.severity ? t(followUpData.severity) : 'N/A' },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl px-3 py-2.5">
                  <p className="text-slate-400 text-xs">{item.label}</p>
                  <p className="font-semibold text-slate-800 capitalize">{item.val}</p>
                </div>
              ))}
            </div>

            {/* Risk */}
            <div className={`flex items-center gap-4 p-4 rounded-2xl border ${riskColors[triageResult?.riskLevel] || ''} border-current/20`}>
              <div className="w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center">
                <RiskIcon size={22} className="text-current" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide opacity-70">{t('riskLevel')}</p>
                <p className="font-display font-bold text-xl">{riskLabel}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-3xl">{triageResult?.riskScore}</p>
                <p className="text-xs opacity-60">/100</p>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">{t('symptomsReported')}</p>
              <div className="flex flex-wrap gap-2">
                {symptoms.length > 0 ? symptoms.map(id => {
                  const sym = symptomIcons.find(s => s.id === id);
                  return (
                    <span key={id} className={`text-xs px-3 py-1.5 rounded-full border font-medium ${sym?.color || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {sym?.icon} {getLabel(id)}
                    </span>
                  );
                }) : <p className="text-slate-400 text-sm">None reported</p>}
              </div>
            </div>

            {/* Body areas */}
            {bodyParts.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">{t('bodyAreasAffected')}</p>
                <p className="text-sm text-slate-700">{bodyParts.join(' • ')}</p>
              </div>
            )}

            {/* Conditions */}
            {followUpData.conditions.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Existing Conditions</p>
                <p className="text-sm text-slate-700">{followUpData.conditions.map(c => t(c)).join(' • ')}</p>
              </div>
            )}

            {/* AI Summary */}
            <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl p-4 border border-primary-100">
              <p className="text-xs font-bold uppercase tracking-wide text-primary-500 mb-2">{t('aiSummary')}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{triageResult?.summary}</p>
            </div>

            {/* Next steps */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">{t('nextSteps')}</p>
              <div className="space-y-2">
                {(triageResult?.recommendations || []).map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center flex-shrink-0 font-bold">{i+1}</span>
                    <p className="text-sm text-slate-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
              ⚠️ This AI-generated report is for triage guidance only. Always consult a qualified healthcare professional for medical decisions.
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button onClick={handleDownloadPDF} disabled={downloading}
            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-primary-600 text-white text-xs font-semibold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all disabled:opacity-60">
            {downloading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={20} />}
            <span>{downloading ? 'Saving...' : t('downloadReport')}</span>
          </button>
          <button onClick={() => navigate('/appointment')}
            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 border-primary-200 text-primary-700 text-xs font-semibold hover:bg-primary-50 transition-all">
            <Share2 size={20} />
            <span>{t('shareReport')}</span>
          </button>
          <button onClick={() => window.print()}
            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all">
            <Printer size={20} />
            <span>Print</span>
          </button>
        </div>

        <button onClick={() => navigate('/appointment')}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2
            bg-gradient-to-r from-teal-600 to-emerald-600 shadow-lg hover:from-teal-700 hover:to-emerald-700 transition-all">
          {t('bookAppointment')} →
        </button>
      </div>
    </Layout>
  );
};

export default ReportPage;
