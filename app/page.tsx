import GrammarForm from '@/components/GrammarForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Grammar Bot</h1>
          <p className="text-slate-400">
            Fix your grammar instantly with AI-powered correction
          </p>
        </header>

        {/* Main Form */}
        <GrammarForm />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>
            Powered by{' '}
            <span className="text-indigo-400">Google Gemini AI</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
