'use client';

import { useState, FormEvent, useCallback } from 'react';
import { correctGrammar, GrammarResult } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

export default function GrammarForm() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setError('Please enter some text to correct');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await correctGrammar(inputText);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }, [handleSubmit]);

  const charCount = inputText.length;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your text here... (e.g., 'i wants to go to the store yesterday')"
            className="input-textarea min-h-[160px]"
            disabled={isLoading}
            aria-label="Text to correct"
          />
          <div className="absolute bottom-3 right-3 text-sm text-slate-500">
            {charCount} characters
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Enter</kbd> to submit
          </p>
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="btn-primary min-w-[140px] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Fix Grammar
              </>
            )}
          </button>
        </div>
      </form>

      {result && <ResultCard result={result} />}
    </div>
  );
}
