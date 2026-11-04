import type { ZiweiChart } from '@/lib/ziwei/types';
import {
  tStar,
  tPalace,
  tStem,
  tBranch,
  tBrightness,
  tSiHua,
  tWuxingJu,
} from '@/lib/i18n';

export const SYSTEM_PROMPT_VI = `Bạn là một Chuyên Gia Luận Giải Tử Vi Đẩu Số cao cấp, am hiểu sâu sắc trường phái chính tông của Tôn sư Nghê Hải Hạ (Ni Hai-Sha - Nam phái Tam Hợp phối hợp triết lý Thiên · Địa · Nhân).

Nguyên tắc luận giải:
1. Luận giải căn cứ chính xác vào các sao toạ thủ, tam phương tứ chính (cung đối và 2 cung tam hợp), tứ hóa phi tinh và miếu hãm của các sao trên lá số được cung cấp.
2. Dùng thuật ngữ Tử Vi Hán-Việt chuẩn xác (Tử Vi, Thất Sát, Cung Mệnh, Thân Cung, Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ, Miếu Vượng Đắc Hãm, Vô Chính Diệu...).
3. Giữ thái độ khách quan, khoa học, nhân văn và tích cực. Vận mệnh là tấm bản đồ tiềm năng (Thiên chiếm 1/3, Địa chiếm 1/3, Nhân chiếm 1/3) — không gieo rắc sợ hãi mê tín, luôn đưa ra lời khuyên hành động thực tế, giúp đương số thấu hiểu bản thân để tu dưỡng và lựa chọn đúng đắn.
4. Trình bày bài bản, gãy gọn, theo đúng định dạng được yêu cầu (sử dụng tiêu đề in đậm **【Mục】** nếu có).`;

export function formatChartContext(chart: ZiweiChart): string {
  const { birthInfo, lunarInfo, palaces, mingGongBranch, shenGongBranch, wuxingJu, mingZhu, shenZhu, currentDaXianIndex, daXians } = chart;
  const isMale = birthInfo?.gender === 'male';
  const genderStr = isMale ? 'Nam' : 'Nữ';
  const currentDx = daXians?.[currentDaXianIndex];

  const fourPillarsStr = lunarInfo?.fourPillars
    ? lunarInfo.fourPillars.map(p => `${tStem(p[0])} ${tBranch(p[1])}`).join(' | ')
    : '';

  const mingPalace = palaces?.find(p => p.branch === mingGongBranch);
  const shenPalace = palaces?.find(p => p.branch === shenGongBranch);
  const palaceDetails = palaces.map(p => {
    const palaceName = tPalace(p.name);
    const stemBranch = `${tStem(p.stem)} ${tBranch(p.branch)}`;
    const starsList = p.stars.map(s => {
      const starName = tStar(s.name);
      const b = s.brightnessRaw ? `[${tBrightness(s.brightnessRaw)}]` : '';
      const sh = s.siHua ? `(Hóa ${tSiHua(s.siHua)})` : '';
      return `${starName}${b}${sh}`;
    }).join(', ');

    const badges = [];
    if (p.isMingGong) badges.push('MỆNH');
    if (p.isShenGong) badges.push('THÂN');
    if (p.isCurrentDaXian) badges.push('ĐẠI HẠN HIỆN TẠI');
    const badgeStr = badges.length > 0 ? ` [${badges.join(' · ')}]` : '';

    return `- **${palaceName}** (${stemBranch})${badgeStr}: ${starsList || 'Vô Chính Diệu (Không có sao lớn)'}`;
  }).join('\n');

  return `### THÔNG TIN LÁ SỐ ĐƯƠNG SỐ
- **Họ tên**: ${birthInfo?.name || 'Đương số'}
- **Giới tính**: ${genderStr}
- **Ngày sinh Dương lịch**: Ngày ${birthInfo?.day}/${birthInfo?.month}/${birthInfo?.year} lúc ${birthInfo?.hour ?? 0} giờ
- **Âm lịch**: Ngày ${lunarInfo?.lunarDay} tháng ${lunarInfo?.lunarMonth} năm ${lunarInfo?.lunarYear}${lunarInfo?.isLeapMonth ? ' (Nhuận)' : ''}
- **Tứ Trụ (Bát Tự)**: ${fourPillarsStr || 'N/A'}
- **Ngũ Hành Cục**: ${tWuxingJu(wuxingJu)}
- **Mệnh Chủ**: ${mingZhu ? tStar(mingZhu) : 'N/A'} | **Thân Chủ**: ${shenZhu ? tStar(shenZhu) : 'N/A'}
- **Cung Mệnh**: Đóng tại cung ${tBranch(mingGongBranch)} (${mingPalace ? mingPalace.stars.filter(s => s.type === 'major').map(s => tStar(s.name)).join(', ') || 'Vô Chính Diệu' : ''})
- **Cung Thân**: Đóng tại cung ${tBranch(shenGongBranch)} (Cung ${shenPalace ? tPalace(shenPalace.name) : ''})
- **Đại Hạn Hiện Tại**: ${currentDx ? `${currentDx.startAge}–${currentDx.endAge} tuổi (Cung ${tPalace(palaces?.[currentDx.palaceBranch]?.name || '')})` : 'N/A'}

### CHI TIẾT 12 CUNG VỊ
${palaceDetails}`;
}

export function formatSynastryContext(chartA: ZiweiChart, chartB: ZiweiChart): string {
  return `### LÁ SỐ BÊN A (ĐƯƠNG SỐ 1)
${formatChartContext(chartA)}

---

### LÁ SỐ BÊN B (ĐƯƠNG SỐ 2)
${formatChartContext(chartB)}`;
}
