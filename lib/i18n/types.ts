export type Locale = 'vi' | 'zh';

export interface PatternTranslation {
  name: string;
  description?: string;
}

export interface I18nDictionary {
  stars: Record<string, string>;
  palaces: Record<string, string>;
  stems: Record<string, string>;
  branches: Record<string, string>;
  brightness: Record<string, string>;
  sihua: Record<string, string>;
  wuxingJu: Record<string, string>;
  patterns: Record<string, PatternTranslation>;
  ui: Record<string, string>;
}
