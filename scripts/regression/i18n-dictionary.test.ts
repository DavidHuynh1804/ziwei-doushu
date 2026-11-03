import assert from 'node:assert/strict';
import {
  type Locale,
  t,
  tStar,
  tPalace,
  tStem,
  tBranch,
  tBrightness,
  tSiHua,
  tWuxingJu,
  tPattern,
} from '../../lib/i18n';

// 1. 14 chính tinh dịch chính xác sang tiếng Việt
const majorStars = [
  ['紫微', 'Tử Vi'],
  ['天机', 'Thiên Cơ'],
  ['太阳', 'Thái Dương'],
  ['武曲', 'Vũ Khúc'],
  ['天同', 'Thiên Đồng'],
  ['廉贞', 'Liêm Trinh'],
  ['天府', 'Thiên Phủ'],
  ['太阴', 'Thái Âm'],
  ['贪狼', 'Tham Lang'],
  ['巨门', 'Cự Môn'],
  ['天相', 'Thiên Tướng'],
  ['天梁', 'Thiên Lương'],
  ['七杀', 'Thất Sát'],
  ['破军', 'Phá Quân'],
];

for (const [zh, vi] of majorStars) {
  assert.equal(tStar(zh), vi, `tStar(${zh}) should be ${vi}`);
  assert.equal(tStar(zh, 'vi'), vi, `tStar(${zh}, 'vi') should be ${vi}`);
  assert.equal(tStar(zh, 'zh'), zh, `tStar(${zh}, 'zh') should be ${zh}`);
}

// 2. 12 Cung
const palaces = [
  ['命宫', 'Mệnh'],
  ['兄弟宫', 'Huynh Đệ'],
  ['兄弟', 'Huynh Đệ'],
  ['夫妻宫', 'Phu Thê'],
  ['夫妻', 'Phu Thê'],
  ['子女宫', 'Tử Nữ'],
  ['子女', 'Tử Nữ'],
  ['财帛宫', 'Tài Bạch'],
  ['财帛', 'Tài Bạch'],
  ['疾厄宫', 'Tật Ách'],
  ['疾厄', 'Tật Ách'],
  ['迁移宫', 'Thiên Di'],
  ['迁移', 'Thiên Di'],
  ['交友宫', 'Nô Bộc'],
  ['交友', 'Nô Bộc'],
  ['仆役', 'Nô Bộc'],
  ['官禄宫', 'Quan Lộc'],
  ['官禄', 'Quan Lộc'],
  ['田宅宫', 'Điền Trạch'],
  ['田宅', 'Điền Trạch'],
  ['福德宫', 'Phúc Đức'],
  ['福德', 'Phúc Đức'],
  ['父母宫', 'Phụ Mẫu'],
  ['父母', 'Phụ Mẫu'],
  ['身宫', 'Thân'],
];

for (const [zh, vi] of palaces) {
  assert.equal(tPalace(zh), vi, `tPalace(${zh}) should be ${vi}`);
  assert.equal(tPalace(zh, 'vi'), vi, `tPalace(${zh}, 'vi') should be ${vi}`);
  assert.equal(tPalace(zh, 'zh'), zh, `tPalace(${zh}, 'zh') should be ${zh}`);
}

// 3. 10 Thiên Can & 12 Địa Chi
const stems = [
  ['甲', 'Giáp'],
  ['乙', 'Ất'],
  ['丙', 'Bính'],
  ['丁', 'Đinh'],
  ['戊', 'Mậu'],
  ['己', 'Kỷ'],
  ['庚', 'Canh'],
  ['辛', 'Tân'],
  ['壬', 'Nhâm'],
  ['癸', 'Quý'],
];

for (let i = 0; i < stems.length; i++) {
  const [zh, vi] = stems[i];
  assert.equal(tStem(zh), vi, `tStem(${zh}) should be ${vi}`);
  assert.equal(tStem(i), vi, `tStem(${i}) should be ${vi}`);
  assert.equal(tStem(zh, 'zh'), zh, `tStem(${zh}, 'zh') should be ${zh}`);
}

const branches = [
  ['子', 'Tý'],
  ['丑', 'Sửu'],
  ['寅', 'Dần'],
  ['卯', 'Mão'],
  ['辰', 'Thìn'],
  ['巳', 'Tỵ'],
  ['午', 'Ngọ'],
  ['未', 'Mùi'],
  ['申', 'Thân'],
  ['酉', 'Dậu'],
  ['戌', 'Tuất'],
  ['亥', 'Hợi'],
];

for (let i = 0; i < branches.length; i++) {
  const [zh, vi] = branches[i];
  assert.equal(tBranch(zh), vi, `tBranch(${zh}) should be ${vi}`);
  assert.equal(tBranch(i), vi, `tBranch(${i}) should be ${vi}`);
  assert.equal(tBranch(zh, 'zh'), zh, `tBranch(${zh}, 'zh') should be ${zh}`);
}

// 4. Tứ Hóa
const sihua = [
  ['禄', 'Lộc'],
  ['权', 'Quyền'],
  ['科', 'Khoa'],
  ['忌', 'Kỵ'],
  ['化禄', 'Hóa Lộc'],
  ['化权', 'Hóa Quyền'],
  ['化科', 'Hóa Khoa'],
  ['化忌', 'Hóa Kỵ'],
];

for (const [zh, vi] of sihua) {
  assert.equal(tSiHua(zh), vi, `tSiHua(${zh}) should be ${vi}`);
  assert.equal(tSiHua(zh, 'vi'), vi, `tSiHua(${zh}, 'vi') should be ${vi}`);
  assert.equal(tSiHua(zh, 'zh'), zh, `tSiHua(${zh}, 'zh') should be ${zh}`);
}

// 5. Cấp độ sáng (Brightness)
const brightnesses = [
  ['庙', 'Miếu'],
  ['旺', 'Vượng'],
  ['得', 'Đắc'],
  ['利', 'Lợi'],
  ['平', 'Bình'],
  ['不', 'Bất'],
  ['陷', 'Hãm'],
  ['bright', 'Miếu Vượng'],
  ['normal', 'Bình Hòa'],
  ['dim', 'Hãm Địa'],
];

for (const [zh, vi] of brightnesses) {
  assert.equal(tBrightness(zh), vi, `tBrightness(${zh}) should be ${vi}`);
  assert.equal(tBrightness(zh, 'vi'), vi, `tBrightness(${zh}, 'vi') should be ${vi}`);
  assert.equal(tBrightness(zh, 'zh'), zh, `tBrightness(${zh}, 'zh') should be ${zh}`);
}
assert.equal(tBrightness(undefined), '');

// 6. Ngũ Hành Cục
const wuxingJu = [
  ['水二局', 'Thủy Nhị Cục', 2],
  ['木三局', 'Mộc Tam Cục', 3],
  ['金四局', 'Kim Tứ Cục', 4],
  ['土五局', 'Thổ Ngũ Cục', 5],
  ['火六局', 'Hỏa Lục Cục', 6],
];

for (const [zh, vi, num] of wuxingJu) {
  assert.equal(tWuxingJu(zh as string), vi, `tWuxingJu(${zh}) should be ${vi}`);
  assert.equal(tWuxingJu(num as number), vi, `tWuxingJu(${num}) should be ${vi}`);
  assert.equal(tWuxingJu(zh as string, 'zh'), zh, `tWuxingJu(${zh}, 'zh') should be ${zh}`);
}

// 7. Minor stars, sha stars, tràng sinh, 12 thần bác sĩ
const otherStars = [
  ['左辅', 'Tả Phù'],
  ['右弼', 'Hữu Bật'],
  ['文昌', 'Văn Xương'],
  ['文曲', 'Văn Khúc'],
  ['禄存', 'Lộc Tồn'],
  ['天马', 'Thiên Mã'],
  ['擎羊', 'Kình Dương'],
  ['陀罗', 'Đà La'],
  ['火星', 'Hỏa Tinh'],
  ['铃星', 'Linh Tinh'],
  ['地空', 'Địa Không'],
  ['地劫', 'Địa Kiếp'],
  ['长生', 'Trường Sinh'],
  ['帝旺', 'Đế Vượng'],
  ['墓', 'Mộ'],
  ['绝', 'Tuyệt'],
  ['博士', 'Bác Sỹ'],
  ['青龙', 'Thanh Long'],
];

for (const [zh, vi] of otherStars) {
  assert.equal(tStar(zh), vi, `tStar(${zh}) should be ${vi}`);
}

// 8. Cách cục (Patterns)
const p1 = tPattern('君臣庆会');
assert.ok(p1.name.includes('Quân Thần Khánh Hội'));
assert.ok(p1.description && p1.description.length > 0);

const pZh = tPattern('君臣庆会', 'zh');
assert.equal(pZh.name, '君臣庆会');

// 9. Fallback an toàn
assert.equal(tStar('未知星星'), '未知星星');
assert.equal(tPalace('神秘宫位'), '神秘宫位');
assert.equal(tStem('未知干'), '未知干');
assert.equal(tBranch('未知支'), '未知支');
assert.equal(tBrightness('未知亮'), '未知亮');
assert.equal(tSiHua('未知化'), '未知化');
assert.equal(tWuxingJu('未知局'), '未知局');
assert.equal(t('unknown.key'), 'unknown.key');

console.log('✓ i18n dictionary test passed!');
