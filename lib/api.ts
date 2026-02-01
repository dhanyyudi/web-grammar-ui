export interface GrammarResult {
  original: string;
  corrected: string;
  changes: string;
  status: string;
}

export interface GrammarError {
  error: string;
}

export async function correctGrammar(text: string): Promise<GrammarResult> {
  const response = await fetch('/api/correct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData: GrammarError = await response.json();
    throw new Error(errorData.error || 'Failed to correct grammar');
  }

  return response.json();
}
