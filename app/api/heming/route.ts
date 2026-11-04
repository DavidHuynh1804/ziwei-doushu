import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/ai/config';
import { formatSynastryContext, SYSTEM_PROMPT_VI } from '@/lib/ai/prompt';
import { createAIStreamResponse, type ChatMessage } from '@/lib/ai/stream';
import type { ZiweiChart } from '@/lib/ziwei/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const config = getAIConfig();
    if (!config) {
      return NextResponse.json(
        {
          error: 'api-missing',
          message: 'Chưa cấu hình API Key cho tính năng Hợp Mệnh.',
        },
        { status: 404 },
      );
    }

    const body = await req.json();
    const chartA: ZiweiChart | undefined = body.chartA;
    const chartB: ZiweiChart | undefined = body.chartB;
    const question: string | undefined = body.question;

    if (!chartA || !chartB) {
      return NextResponse.json({ error: 'Missing chartA or chartB' }, { status: 400 });
    }

    const synastrySummary = formatSynastryContext(chartA, chartB);

    const defaultInstruction = `Hãy đối chiếu và phân tích sự hòa hợp giữa hai lá số trên theo trường phái của thầy Nghê Hải Hạ:
1. **【Tổng Quan Duyên Nợ & Tương Hợp】**: So sánh Cung Mệnh, Thân, Cục ngũ hành và chính tinh toạ thủ của hai người.
2. **【Cung Phu Thê & Tình Cảm】**: Phân tích sao toạ thủ tại cung Phu Thê của mỗi bên và sao của đối phương.
3. **【Tứ Hóa Phi Tinh Tương Tác】**: Xem Tứ hóa năm của người này bay vào cung nào của người kia (Lộc, Quyền, Khoa, Kỵ).
4. **【Điểm Thuận Lợi & Điểm Thử Thách】**: Các khía cạnh dễ hòa hợp và những góc dễ phát sinh bất đồng.
5. **【Lời Khuyên Đồng Hành】**: Lời khuyên cụ thể, tích cực để hai bên thấu hiểu và cùng nhau phát triển.`;

    const userPrompt = question ? `Câu hỏi bổ sung về hợp mệnh của hai đương số: "${question}"` : defaultInstruction;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `${SYSTEM_PROMPT_VI}\n\n${synastrySummary}`,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    return await createAIStreamResponse(config, messages);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error in /api/heming:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
