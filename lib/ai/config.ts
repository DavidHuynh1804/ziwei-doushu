export interface AIProviderConfig {
  provider: string;
  apiKey: string;
  baseURL: string;
  model: string;
}

/**
 * Danh sách cấu hình mặc định cho các AI Provider thông dụng.
 * Hỗ trợ các provider HOÀN TOÀN MIỄN PHÍ:
 * - Gemini (Google AI Studio - miễn phí 100%, không cần thẻ tín dụng)
 * - Groq (siêu nhanh, miễn phí 100%)
 * - OpenRouter (có các model :free)
 * - Ollama (chạy local trên máy tính, 100% miễn phí)
 * Và các provider trả phí / chi phí siêu rẻ:
 * - DeepSeek (rất rẻ, tối ưu cho thuật số phương Đông)
 * - OpenAI (gpt-4o-mini)
 */
export const DEFAULT_PROVIDERS: Record<string, { baseURL: string; defaultModel: string }> = {
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-1.5-flash',
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
  },
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    defaultModel: 'google/gemini-2.0-flash-exp:free',
  },
  deepseek: {
    baseURL: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
  },
  openai: {
    baseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
  },
  ollama: {
    baseURL: 'http://localhost:11434/v1',
    defaultModel: 'llama3.1',
  },
};

export function getAIConfig(): AIProviderConfig | null {
  // 1. Kiểm tra cấu hình tường minh AI_PROVIDER
  const explicitProvider = (process.env.AI_PROVIDER || '').trim().toLowerCase();

  // 2. Tìm API key tương ứng
  let provider = explicitProvider;
  let apiKey = process.env.AI_API_KEY || '';
  let baseURL = process.env.AI_BASE_URL || '';
  let model = process.env.AI_MODEL || '';

  if (!provider) {
    if (process.env.GEMINI_API_KEY) {
      provider = 'gemini';
      apiKey = process.env.GEMINI_API_KEY;
    } else if (process.env.GROQ_API_KEY) {
      provider = 'groq';
      apiKey = process.env.GROQ_API_KEY;
    } else if (process.env.OPENROUTER_API_KEY) {
      provider = 'openrouter';
      apiKey = process.env.OPENROUTER_API_KEY;
    } else if (process.env.DEEPSEEK_API_KEY) {
      provider = 'deepseek';
      apiKey = process.env.DEEPSEEK_API_KEY;
    } else if (process.env.OPENAI_API_KEY) {
      provider = 'openai';
      apiKey = process.env.OPENAI_API_KEY;
    } else if (process.env.OLLAMA_BASE_URL || explicitProvider === 'ollama') {
      provider = 'ollama';
      apiKey = 'ollama'; // Ollama không yêu cầu key
      baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1';
    }
  } else {
    // Nếu có chỉ định AI_PROVIDER
    if (provider === 'gemini') apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    else if (provider === 'groq') apiKey = apiKey || process.env.GROQ_API_KEY || '';
    else if (provider === 'openrouter') apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    else if (provider === 'deepseek') apiKey = apiKey || process.env.DEEPSEEK_API_KEY || '';
    else if (provider === 'openai') apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    else if (provider === 'ollama') apiKey = apiKey || 'ollama';
  }

  // Nếu không có API Key và không phải Ollama local -> coi như chưa cấu hình
  if (!apiKey && provider !== 'ollama') {
    return null;
  }

  const def = DEFAULT_PROVIDERS[provider] || { baseURL: 'https://api.openai.com/v1', defaultModel: 'gpt-4o-mini' };
  baseURL = baseURL || def.baseURL;
  model = model || def.defaultModel;

  return {
    provider: provider || 'custom',
    apiKey,
    baseURL: baseURL.replace(/\/+$/, ''),
    model,
  };
}
