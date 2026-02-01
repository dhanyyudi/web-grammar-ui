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

      let corrected = '';
      let changes = '';

      // Use regex to reliably extract CORRECTED and CHANGES parts
      if (result.includes('CORRECTED:') && result.includes('CHANGES:')) {
        // Extract CORRECTED part (everything between CORRECTED: and CHANGES:)
        const correctedMatch = result.match(/CORRECTED:\s*([\s\S]*?)(?=CHANGES:|$)/i);
        if (correctedMatch) {
          corrected = correctedMatch[1].trim();
        }

        // Extract CHANGES part (everything after CHANGES:)
        const changesMatch = result.match(/CHANGES:\s*([\s\S]*?)$/i);
        if (changesMatch) {
          changes = changesMatch[1].trim();
        }
      } else {
        // Fallback: treat entire result as corrected text
        corrected = result.trim();
        changes = 'Unable to parse changes';
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
