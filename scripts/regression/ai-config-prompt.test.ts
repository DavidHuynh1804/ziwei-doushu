import assert from 'node:assert/strict';
import { getAIConfig } from '../../lib/ai/config';
import { formatChartContext, formatSynastryContext } from '../../lib/ai/prompt';
import { generateChart } from '../../lib/ziwei/algorithm';

// 1. Kiểm tra getAIConfig khi chưa có biến môi trường
const origEnv = { ...process.env };
delete process.env.AI_PROVIDER;
delete process.env.AI_API_KEY;
delete process.env.GEMINI_API_KEY;
delete process.env.GROQ_API_KEY;
delete process.env.DEEPSEEK_API_KEY;
delete process.env.OPENAI_API_KEY;
delete process.env.OPENROUTER_API_KEY;
delete process.env.OLLAMA_BASE_URL;

assert.equal(getAIConfig(), null, 'Khi chưa có key phải trả về null');

// 2. Kiểm tra Gemini auto-detection
process.env.GEMINI_API_KEY = 'test-gemini-key';
const geminiConfig = getAIConfig();
assert.ok(geminiConfig, 'Phải nhận diện được Gemini config');
assert.equal(geminiConfig.provider, 'gemini');
assert.equal(geminiConfig.apiKey, 'test-gemini-key');
assert.ok(geminiConfig.baseURL.includes('generativelanguage.googleapis.com'));
assert.equal(geminiConfig.model, 'gemini-1.5-flash');
delete process.env.GEMINI_API_KEY;

// 3. Kiểm tra Groq auto-detection
process.env.GROQ_API_KEY = 'test-groq-key';
const groqConfig = getAIConfig();
assert.ok(groqConfig);
assert.equal(groqConfig.provider, 'groq');
assert.ok(groqConfig.baseURL.includes('api.groq.com'));
assert.equal(groqConfig.model, 'llama-3.3-70b-versatile');
delete process.env.GROQ_API_KEY;

// 4. Kiểm tra DeepSeek auto-detection
process.env.DEEPSEEK_API_KEY = 'test-deepseek-key';
const deepseekConfig = getAIConfig();
assert.ok(deepseekConfig);
assert.equal(deepseekConfig.provider, 'deepseek');
assert.ok(deepseekConfig.baseURL.includes('api.deepseek.com'));
assert.equal(deepseekConfig.model, 'deepseek-chat');
delete process.env.DEEPSEEK_API_KEY;

// 5. Kiểm tra Ollama local (không cần key)
process.env.AI_PROVIDER = 'ollama';
const ollamaConfig = getAIConfig();
assert.ok(ollamaConfig);
assert.equal(ollamaConfig.provider, 'ollama');
assert.ok(ollamaConfig.baseURL.includes('11434'));
delete process.env.AI_PROVIDER;

// Khôi phục env gốc
process.env = origEnv;

// 6. Kiểm tra formatChartContext xuất dữ liệu lá số tiếng Việt đầy đủ
const chart = generateChart({
  year: 1990,
  month: 5,
  day: 15,
  hour: 6, // giờ Ngọ
  gender: 'male',
  name: 'Nguyễn Văn A',
});

const formatted = formatChartContext(chart);
assert.ok(formatted.includes('Nguyễn Văn A'));
assert.ok(formatted.includes('MỆNH'));
assert.ok(formatted.includes('THÂN'));
assert.ok(formatted.includes('ĐẠI HẠN HIỆN TẠI'));
assert.ok(formatted.includes('CHI TIẾT 12 CUNG VỊ'));

const synastry = formatSynastryContext(chart, chart);
assert.ok(synastry.includes('LÁ SỐ BÊN A'));
assert.ok(synastry.includes('LÁ SỐ BÊN B'));

console.log('✅ AI config and prompt regression tests passed successfully!');
