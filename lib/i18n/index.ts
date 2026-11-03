import type { Locale, PatternTranslation } from './types';
import {
  ALL_STARS_VI,
  PALACES_VI,
  STEMS_VI,
  STEM_INDEX_VI,
  BRANCHES_VI,
  BRANCH_INDEX_VI,
  BRIGHTNESS_VI,
  SIHUA_VI,
  WUXING_JU_VI,
  WUXING_JU_NUM_VI,
} from './terms-vi';
import { UI_VI } from './ui-vi';
import { PATTERNS_VI } from './patterns-vi';
import { STEMS, BRANCHES, JU_NAMES } from '@/lib/ziwei/constants';

export * from './types';
export * from './terms-vi';
export * from './ui-vi';
export * from './patterns-vi';

export const DEFAULT_LOCALE: Locale = 'vi';

/**
 * Dịch tên ngôi sao (14 chính tinh, phụ tinh, sát tinh, tràng sinh, 12 thần...).
 */
export function tStar(name: string, locale: Locale = DEFAULT_LOCALE): string {
  if (locale === 'zh') return name;
  return ALL_STARS_VI[name] ?? name;
}

/**
 * Dịch tên cung vị (12 cung, Mệnh, Thân, Phụ Mẫu...).
 */
export function tPalace(name: string, locale: Locale = DEFAULT_LOCALE): string {
  if (locale === 'zh') return name;
  return PALACES_VI[name] ?? name;
}

/**
 * Dịch Thiên Can (tên can tiếng Trung hoặc index 0..9).
 */
export function tStem(stem: string | number, locale: Locale = DEFAULT_LOCALE): string {
  if (typeof stem === 'number') {
    if (locale === 'zh') {
      return STEMS[stem] ?? String(stem);
    }
    return STEM_INDEX_VI[stem] ?? String(stem);
  }
  if (locale === 'zh') return stem;
  return STEMS_VI[stem] ?? stem;
}

/**
 * Dịch Địa Chi (tên chi tiếng Trung hoặc index 0..11).
 */
export function tBranch(branch: string | number, locale: Locale = DEFAULT_LOCALE): string {
  if (typeof branch === 'number') {
    if (locale === 'zh') {
      return BRANCHES[branch] ?? String(branch);
    }
    return BRANCH_INDEX_VI[branch] ?? String(branch);
  }
  if (locale === 'zh') return branch;
  return BRANCHES_VI[branch] ?? branch;
}

/**
 * Dịch cấp độ sáng (庙, 旺, 得, 利, 平, 陷, bright, normal, dim...).
 */
export function tBrightness(brightness?: string, locale: Locale = DEFAULT_LOCALE): string {
  if (!brightness) return '';
  if (locale === 'zh') return brightness;
  return BRIGHTNESS_VI[brightness] ?? brightness;
}

/**
 * Dịch Tứ Hóa (禄, 权, 科, 忌, 化禄, 化权, 化科, 化忌).
 */
export function tSiHua(sihua: string, locale: Locale = DEFAULT_LOCALE): string {
  if (locale === 'zh') return sihua;
  return SIHUA_VI[sihua] ?? sihua;
}

/**
 * Dịch Cục (Ngũ Hành Cục: 水二局, 木三局... hoặc số cục 2, 3, 4, 5, 6).
 */
export function tWuxingJu(ju: string | number, locale: Locale = DEFAULT_LOCALE): string {
  if (typeof ju === 'number') {
    if (locale === 'zh') {
      return JU_NAMES[ju] ?? String(ju);
    }
    return WUXING_JU_NUM_VI[ju] ?? String(ju);
  }
  if (locale === 'zh') return ju;
  return WUXING_JU_VI[ju] ?? ju;
}

/**
 * Dịch chuỗi giao diện người dùng theo key.
 */
export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  if (locale === 'zh') return key;
  return UI_VI[key] ?? key;
}

/**
 * Dịch cách cục (Pattern). Trả về { name, description }.
 */
export function tPattern(patternName: string, locale: Locale = DEFAULT_LOCALE): PatternTranslation {
  if (locale === 'zh') {
    return { name: patternName };
  }
  const translated = PATTERNS_VI[patternName];
  if (translated) {
    return translated;
  }
  return { name: patternName };
}
