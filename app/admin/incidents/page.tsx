'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  Key,
  FileCheck,
  MapPin,
  Clock,
  Flame,
  Users,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Truck,
  RotateCcw,
  Sparkles,
  Gavel,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useEmergency } from '@/context/EmergencyContext';
import { DisasterReport, DisasterStatus } from '@/types';

export default function AdminIncidentsPage() {
  const { disasterReports, updateReportVerification, incidents } = useEmergency();

  // Selected report
  const [selectedReportId, setSelectedReportId] = useState<string>(
    disasterReports[0]?.id || ''
  );
  const selectedReport = disasterReports.find(r => r.id === selectedReportId) || disasterReports[0];

  // Privacy Face Anonymization Toggle (Default: Blurred for privacy protection)
  const [revealFaces, setRevealFaces] = useState<boolean>(false);

  // False report modal state
  const [showFalseReportModal, setShowFalseReportModal] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string>('EOC-SUP-409');
  const [falseReason, setFalseReason] = useState<string>('Unrelated historical stock photo submitted; no current emergency at GPS coordinates.');
  const [falseNotes, setFalseNotes] = useState<string>('Verified via ground CCTV & nearest patrol unit. Incident location clear.');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Handle status transitions
  const handleStatusChange = async (status: DisasterStatus) => {
    if (!selectedReport) return;
    try {
      updateReportVerification(
        selectedReport.id,
        status,
        `Status changed to ${status} by EOC operator.`,
        adminId
      );
      setActionSuccessMsg(`Report #${selectedReport.id} successfully updated to ${status}`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Failed to update report status:', err);
    }
  };

  // Confirm false report with statutory warning & demo penalty notice
  const handleConfirmFalseReport = async () => {
    if (!selectedReport) return;
    try {
      updateReportVerification(
        selectedReport.id,
        'FALSE_REPORT',
        `Reason: ${falseReason} | Notes: ${falseNotes}`,
        adminId
      );
      setShowFalseReportModal(false);
      setActionSuccessMsg(`Report #${selectedReport.id} marked FALSE_REPORT. Demo statutory penalty notice logged.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to mark false report:', err);
    }
  };

  const getStatusBadge = (status: DisasterStatus) => {
    switch (status) {
      case 'UNDER_VERIFICATION':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'VERIFIED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
      case 'DISPATCHED':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
      case 'RESOLVED':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'REJECTED':
        return 'bg-zinc-900 text-zinc-400 border-zinc-700';
      case 'FALSE_REPORT':
        return 'bg-rose-950/90 text-rose-300 border-rose-500/70 animate-pulse';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Top Security Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              AUTHENTICATED EOC CONSOLE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ROLE: EOC_COMMANDER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            DISASTER REPORT VERIFICATION &amp; EVIDENCE DESK
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Privacy-first face anonymization &bull; Gemini 2.5 Flash Vision AI analysis &bull; Statutory false report logging
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-mono transition"
          >
            &larr; EOC Home
          </Link>
          <Link
            href="/live-map"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 shadow self-start md:self-auto"
          >
            <span>Open Tactical Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionSuccessMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-white text-xs font-mono flex items-center justify-between shadow-2xl animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-slate-400 hover:text-white font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Security & Privacy Doctrine Banner */}
      <div className="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-4 mb-8 flex items-start gap-3.5 text-xs text-purple-200">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider font-mono">
            EOC EVIDENCE PRIVACY PROTOCOL (DIGITAL DATA PROTECTION COMPLIANT)
          </span>
          <p className="text-slate-300 leading-relaxed">
            By default, all bystander faces are pixelated on the client device prior to public storage. Only authenticated EOC personnel with supervisor authority may reveal unmasked evidentiary media for search and rescue identification. AI recommendations do not replace human sign-off.
          </p>
        </div>
      </div>

      {/* Main Split Console: Reports Queue | Selected Evidence & Verification Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Disaster Reports Queue */}
        <div className="lg:col-span-4 space-y-3 bg-slate-900/60 border border-slate-800 p-4 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              REPORTS QUEUE ({disasterReports.length})
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              {disasterReports.filter(r => r.status === 'UNDER_VERIFICATION').length} Awaiting Review
            </span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {disasterReports.map((report) => {
              const isSelected = selectedReport?.id === report.id;
              return (
                <button
                  key={report.id}
                  onClick={() => {
                    setSelectedReportId(report.id);
                    setRevealFaces(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/20 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-black text-cyan-300">
                      {report.id}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${getStatusBadge(report.status)}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                    {report.category.toUpperCase()}: {report.description.slice(0, 50)}...
                  </h4>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span className="truncate max-w-[170px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      {report.location.address.split(',')[0]}
                    </span>
                    {report.aiAnalysis && (
                      <span className="text-emerald-400 font-bold shrink-0">
                        AI: {report.aiAnalysis.confidence}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Evidence & Verification Actions */}
        {selectedReport ? (
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm space-y-6">
            
            {/* Header / Report ID & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    REPORT {selectedReport.id}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedReport.status)}`}>
                    {selectedReport.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 uppercase">
                    {selectedReport.category}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white">
                  {selectedReport.category} Distress Verification
                </h2>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{selectedReport.location.address}</span>
                  <span className="text-slate-500">
                    ({selectedReport.location.lat.toFixed(5)}° N, {selectedReport.location.lng.toFixed(5)}° E)
                  </span>
                </p>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-[10px] text-slate-400 block uppercase">
                  CITIZEN USER ID
                </span>
                <span className="text-slate-200 font-bold">
                  {selectedReport.userId}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {new Date(selectedReport.reportedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Description Briefing */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  CITIZEN SITUATION NARRATIVE
                </span>
                {selectedReport.location?.accuracy && (
                  <span className="font-mono text-[10px] text-emerald-400">
                    GPS Accuracy: &plusmn;{selectedReport.location.accuracy}m
                  </span>
                )}
              </div>
              <p className="leading-relaxed font-sans text-sm text-slate-200">
                &ldquo;{selectedReport.description}&rdquo;
              </p>
            </div>

            {/* AI Verification Analysis Card */}
            {selectedReport.aiAnalysis && (
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white uppercase tracking-wider">
                      GEMINI 2.5 FLASH VISION AI ANALYSIS
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/50 text-emerald-300 text-[11px] font-bold">
                    Confidence: {selectedReport.aiAnalysis.confidence}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Detected Category:</span>
                    <strong className="text-cyan-300">{selectedReport.aiAnalysis.detectedCategory}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Category Match Status:</span>
                    <strong className={selectedReport.aiAnalysis.matchConfirmed ? 'text-emerald-400' : 'text-amber-400'}>
                      {selectedReport.aiAnalysis.matchConfirmed ? 'MATCH CONFIRMED' : 'POTENTIAL MISMATCH'}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block">AI Operational Analysis:</span>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {selectedReport.aiAnalysis.explanation}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Recommendation: <strong>{selectedReport.aiAnalysis.statusRecommendation}</strong> (Human-in-the-loop requirement)</span>
                </div>
              </div>
            )}

            {/* Evidence Image Viewer with Face Anonymization Blur Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    CITIZEN SUBMITTED EVIDENCE
                  </span>
                  {selectedReport.faceMetadata?.faceDetected ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-600/40 text-blue-300">
                      {selectedReport.faceMetadata.faceCount} Faces Detected
                    </span>
                  ) : null}
                </div>

                {/* Face Anonymization Privacy Toggle */}
                <button
                  type="button"
                  onClick={() => setRevealFaces(!revealFaces)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                    revealFaces
                      ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 hover:bg-amber-900/60'
                      : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60'
                  }`}
                >
                  {revealFaces ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>RE-BLUR FACES (SAFE MODE)</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>REVEAL RAW EVIDENCE (EOC AUTH)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Photo Display */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-3 space-y-2">
                <div className="max-h-96 min-h-[220px] rounded-xl overflow-hidden bg-slate-900 relative flex items-center justify-center">
                  <img
                    src={revealFaces ? (selectedReport.evidence?.previewUrl || selectedReport.evidence?.anonymizedPreviewUrl || 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?w=800') : (selectedReport.evidence?.anonymizedPreviewUrl || selectedReport.evidence?.previewUrl || 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?w=800')}
                    alt="Disaster evidence"
                    className="w-full max-h-96 object-contain"
                  />

                  {/* Privacy Badge overlay */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 font-mono text-[10px] text-white flex items-center gap-1.5">
                    {revealFaces ? (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-300 font-bold">RAW UNMASKED EVIDENCE</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">PRIVACY-PRESERVED (FACES ANONYMIZED)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span>Storage: {selectedReport.evidence?.imagePath || `encrypted-evidence/${selectedReport.id}.webp`}</span>
                  <span className="text-emerald-400">Authenticated EOC Access</span>
                </div>
              </div>
            </div>

            {/* Admin Verification Action Bar */}
            <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  EOC VERIFICATION WORKFLOW ACTIONS
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Logged by: {adminId}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* 1. Mark Verified */}
                <button
                  type="button"
                  onClick={() => handleStatusChange('VERIFIED')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>MARK VERIFIED</span>
                </button>

                {/* 2. Dispatch Units */}
                <button
                  type="button"
                  onClick={() => handleStatusChange('DISPATCHED')}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>DISPATCH UNITS</span>
                </button>

                {/* 3. Mark Resolved */}
                <button
                  type="button"
                  onClick={() => handleStatusChange('RESOLVED')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-slate-400" />
                  <span>RESOLVED</span>
                </button>

                {/* 4. Reject / Inconclusive */}
                <button
                  type="button"
                  onClick={() => handleStatusChange('REJECTED')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-800 transition cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>REJECT</span>
                </button>

                {/* 5. Confirm False Report (With Statutory Warning Modal) */}
                <button
                  type="button"
                  onClick={() => setShowFalseReportModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/70 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow transition cursor-pointer ml-auto"
                >
                  <Gavel className="w-3.5 h-3.5 text-rose-400" />
                  <span>CONFIRM FALSE REPORT</span>
                </button>
              </div>

              {/* Recorded Admin Verification Data if Present */}
              {selectedReport.adminVerification && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">
                    Audit Trail: Last Action Recorded
                  </div>
                  <div className="text-slate-300">
                    Admin ID: <span className="text-cyan-300">{selectedReport.adminVerification.adminId}</span> &bull; Time: <span className="text-slate-400">{new Date(selectedReport.adminVerification.verifiedAt).toLocaleString()}</span>
                  </div>
                  {selectedReport.adminVerification.reason && (
                    <div className="text-rose-300">
                      Reason: {selectedReport.adminVerification.reason}
                    </div>
                  )}
                  {selectedReport.adminVerification.notes && (
                    <div className="text-slate-400">
                      Notes: {selectedReport.adminVerification.notes}
                    </div>
                  )}
                  {selectedReport.adminVerification.penaltyNoticeAmount && (
                    <div className="text-amber-400 font-bold">
                      Demo Statutory Penalty Notice: &#8377;{selectedReport.adminVerification.penaltyNoticeAmount.toLocaleString('en-IN')} (Recorded for administrative reference)
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-slate-400 font-mono text-sm bg-slate-900/40 rounded-3xl border border-slate-800">
            No disaster report selected. Select a report from the queue.
          </div>
        )}
      </div>

      {/* FALSE REPORT CONFIRMATION MODAL */}
      {showFalseReportModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="max-w-lg w-full bg-zinc-950 border-2 border-rose-500/60 rounded-3xl p-6 space-y-5 shadow-2xl text-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                <Gavel className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Confirm Unsubstantiated / False Report
                </h3>
                <p className="text-xs text-rose-300 font-mono mt-0.5">
                  Report ID: {selectedReport.id} &bull; Category: {selectedReport.category}
                </p>
              </div>
            </div>

            {/* Statutory Warning Notice */}
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs font-mono space-y-2 text-rose-200">
              <div className="font-bold flex items-center gap-1.5 text-rose-300 uppercase">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Statutory Warning Notice</span>
              </div>
              <p className="leading-relaxed">
                Under the Disaster Management Act, 2005 (Section 54), lodging intentionally misleading or mischievous distress alerts carries statutory penalties.
              </p>
              <div className="p-2 rounded-xl bg-black/60 border border-rose-500/30 text-amber-300 font-bold">
                Potential penalty: &#8377;5,000 &mdash; subject to applicable law and authorized administrative action.
              </div>
              <p className="text-[10px] text-slate-400">
                Notice: In this demo platform, confirming this action records the statutory administrative warning in the audit log. Real monetary charges require formal legal proceedings.
              </p>
            </div>

            {/* Inputs: Admin ID, Reason, Notes */}
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Verifying Admin ID
                </label>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Rejection / Misuse Reason
                </label>
                <input
                  type="text"
                  value={falseReason}
                  onChange={(e) => setFalseReason(e.target.value)}
                  placeholder="e.g. Stock photo, fabricated claim, no incident at scene"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Investigation Audit Notes
                </label>
                <textarea
                  value={falseNotes}
                  onChange={(e) => setFalseNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFalseReportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmFalseReport}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl transition cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                <span>Confirm &amp; Log Warning</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

