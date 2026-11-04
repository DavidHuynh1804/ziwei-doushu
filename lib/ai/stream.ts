import type { AIProviderConfig } from './config';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function createAIStreamResponse(
  config: AIProviderConfig,
  messages: ChatMessage[],
  temperature = 0.7,
): Promise<Response> {
  const url = `${config.baseURL}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey && config.apiKey !== 'ollama') {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  // Đối với OpenRouter, hỗ trợ thêm header định danh
  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = 'http://localhost:3000';
    headers['X-Title'] = 'Ziwei Master';
  }

  const payload = {
    model: config.model,
    messages,
    stream: true,
    temperature,
  };

  const upstreamRes = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!upstreamRes.ok) {
    const errorText = await upstreamRes.text().catch(() => '');
    throw new Error(`AI Provider error (${upstreamRes.status}): ${errorText || upstreamRes.statusText}`);
  }

  if (!upstreamRes.body) {
    throw new Error('AI Provider returned empty body');
  }

  const reader = upstreamRes.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(':')) continue; // Comment hoặc dòng trống

            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6).trim();
              if (dataStr === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              try {
                const parsed = JSON.parse(dataStr);
                // Trích xuất token từ nhiều cấu trúc phản hồi thông dụng
                const token =
                  parsed.choices?.[0]?.delta?.content ??
                  parsed.choices?.[0]?.delta?.text ??
                  parsed.delta?.text ??
                  '';

                if (token) {
                  const sseLine = `data: ${JSON.stringify({ delta: { text: token } })}\n\n`;
                  controller.enqueue(encoder.encode(sseLine));
                }
              } catch {
                // Bỏ qua dòng json không hoàn chỉnh
              }
            }
          }
        }

        // Đảm bảo gửi tín hiệu [DONE] kết thúc stream
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
