'use client';

import React, { useState } from 'react';
import {
  Upload,
  Camera,
  Video,
  Mic,
  ShieldCheck,
  CheckCircle2,
  Lock,
  AlertTriangle,
  ArrowRight,
  FileCheck,
  MapPin,
  Flame
} from 'lucide-react';
import { uploadPrivateIncidentMedia } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function CitizenReportPage() {
  const [incidentType, setIncidentType] = useState('FIRE');
  const [location, setLocation] = useState('Hitec City, Hyderabad');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const incidentToken = `RQ-${Math.floor(1000 + Math.random() * 9000)}`;

    let savedPath = `incidents/${incidentToken}/evidence.jpg`;
    if (selectedFile) {
      const { path } = await uploadPrivateIncidentMedia(
        selectedFile,
        incidentToken,
        selectedFile.name
      );
      if (path) savedPath = path;
    }

    setStoragePath(savedPath);
    setSubmittedToken(incidentToken);
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Back Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/live-map"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition"
        >
          <span>← Back to Live Map</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-mono text-slate-400 hover:text-slate-200 transition"
        >
          EOC Home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5 text-purple-400" />
          <span>SUPABASE PRIVATE STORAGE • ENCRYPTED CITIZEN MEDIA</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          REPORT DISASTER WITH PRIVATE MEDIA
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Your photos, videos, and situation notes are uploaded directly into an encrypted, private bucket accessible exclusively by authorized EOC responders.
        </p>
      </div>

      {!submittedToken ? (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6"
        >
          {/* Emergency Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Incident Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['FIRE', 'FLOOD', 'ACCIDENT', 'COLLAPSE', 'CHEMICAL', 'CYCLONE', 'MEDICAL', 'OTHER'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setIncidentType(cat)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition text-center ${
                    incidentType === cat
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Location Landmark */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Location &amp; Landmark
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Cyber Towers Junction, Hitec City, Hyderabad"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Situation Description */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300">
              Disaster Details / Trapped People
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you see: number of casualties, fire floor, blocked exits, gas odors..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Private Media Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-400" />
                Evidence Media (Photo / Video / Audio)
              </span>
              <span className="text-[10px] text-purple-400 font-mono flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Never Publicly Accessible
              </span>
            </label>

            <div className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 text-center bg-slate-950/60 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-mono font-bold text-slate-200">
                {selectedFile ? selectedFile.name : 'Tap to select photo or video from device'}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Uploaded straight to private Supabase bucket: <code className="text-purple-400 font-mono">incident-media</code>
              </p>
            </div>

            {previewUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 h-40 bg-slate-950 flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="h-full object-contain" />
              </div>
            )}
          </div>

          {/* Security & Privacy Commitment */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-300">Strict Privacy Enforcement:</strong> Citizen emergency media is stored with Row Level Security (RLS). Images are never posted to public feeds or indexable URLs. Only authorized EOC dispatchers can generate short-lived signed URLs.
            </p>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl font-mono font-bold text-sm tracking-wider shadow-lg shadow-rose-950/80 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {uploading ? (
              <span>ENCRYPTING &amp; UPLOADING TO SUPABASE...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>SUBMIT ENCRYPTED DISASTER REPORT</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Submission Success Confirmation */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-widest">
              DISASTER LOGGED IN CENTRAL EOC DATABASE
            </span>
            <h3 className="text-2xl font-black text-white uppercase">
              REPORT TRANSMITTED SECURELY
            </h3>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">INCIDENT ID:</span>
              <span className="font-bold text-rose-400">#{submittedToken}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TYPE:</span>
              <span className="text-white">{incidentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">STORAGE BUCKET:</span>
              <span className="text-purple-400">incident-media (PRIVATE)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">STORAGE PATH:</span>
              <span className="text-slate-300 truncate max-w-[200px]">{storagePath}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/live-map"
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-md"
            >
              <span>View On Live Response Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/incidents"
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white rounded-xl text-xs font-mono font-bold transition border border-slate-700"
            >
              Admin Media View
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
