'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto text-xl font-black">
            !
          </div>
          <h2 className="text-xl font-black font-mono text-white">Application Recovery</h2>
          <p className="text-xs font-mono text-slate-400">
            {error?.message || 'A global error occurred.'}
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl transition shadow"
          >
            Recover & Reload
          </button>
        </div>
      </body>
    </html>
  );
}
