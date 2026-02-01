'use client';

import CopyButton from './CopyButton';
import { GrammarResult } from '@/lib/api';

interface ResultCardProps {
  result: GrammarResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const hasChanges = result.changes.toLowerCase() !== 'none' &&
                     result.changes.toLowerCase() !== 'no changes detected' &&
                     result.original !== result.corrected;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Corrected Text */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Corrected Text
          </h3>
          <CopyButton text={result.corrected} />
        </div>
        <p className="text-white text-lg leading-relaxed bg-slate-700/50 rounded-lg p-4">
          {result.corrected}
        </p>
      </div>

      {/* Changes */}
      <div className="card">
        <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Changes Made
        </h3>
        <p className={`leading-relaxed ${hasChanges ? 'text-slate-300' : 'text-emerald-400'}`}>
          {hasChanges ? result.changes : 'No changes needed - your text is already correct!'}
        </p>
      </div>

      {/* Original Text (collapsed by default if same as corrected) */}
      {hasChanges && (
        <details className="card group">
          <summary className="cursor-pointer text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            View Original Text
          </summary>
          <p className="mt-3 text-slate-400 bg-slate-700/30 rounded-lg p-4">
            {result.original}
          </p>
        </details>
      )}
    </div>
  );
}
