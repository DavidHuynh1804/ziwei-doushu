import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/ai/config';
import { formatChartContext, SYSTEM_PROMPT_VI } from '@/lib/ai/prompt';
import { createAIStreamResponse, type ChatMessage } from '@/lib/ai/stream';
import type { ZiweiChart } from '@/lib/ziwei/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const config = getAIConfig();
    if (!config) {
      // Chưa cấu hình API key -> trả về 404 để frontend hiển thị thông báo hướng dẫn
      return NextResponse.json(
        {
          error: 'api-missing',
          message: 'Chưa cấu hình API Key. Vui lòng tạo file .env.local và thêm GEMINI_API_KEY, GROQ_API_KEY hoặc DEEPSEEK_API_KEY.',
        },
        { status: 404 },
      );
    }

    const body = await req.json();
    const chart: ZiweiChart | undefined = body.chart;
    const clientMessages: Array<{ role: 'user' | 'assistant'; content: string }> = body.messages || [];

    if (!clientMessages.length) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
    }

    const chartSummary = chart ? formatChartContext(chart) : '';

    const systemMessage: ChatMessage = {
      role: 'system',
      content: `${SYSTEM_PROMPT_VI}\n\n${chartSummary}`,
    };

    const messages: ChatMessage[] = [
      systemMessage,
      ...clientMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    return await createAIStreamResponse(config, messages);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error in /api/interpret:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
