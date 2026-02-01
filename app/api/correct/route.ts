import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`n8n webhook error: ${response.status}`);
      }

      const data = await response.json();

      // Parse the result to extract corrected text and changes
      const result = data.result || '';
      const lines = result.split('\n');

      let corrected = '';
      let changes = '';

      for (const line of lines) {
        if (line.startsWith('CORRECTED:')) {
          corrected = line.replace('CORRECTED:', '').trim();
        } else if (line.startsWith('CHANGES:')) {
          changes = line.replace('CHANGES:', '').trim();
        }
      }

      return NextResponse.json({
        original: data.original || text.trim(),
        corrected: corrected || result,
        changes: changes || 'No changes detected',
        status: 'success'
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 504 }
        );
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Grammar correction error:', error);
    return NextResponse.json(
      { error: 'Failed to correct grammar. Please try again.' },
      { status: 500 }
    );
  }
}
