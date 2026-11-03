import assert from 'node:assert/strict';
import {
  VIETNAM_PROVINCES,
  getProvincesByLocale,
  isVietnamProvince,
} from '../../lib/ziwei/cities';
import { calculateTrueSolarTime } from '../../lib/ziwei/true-solar-time';
import { calcTrueSolarBranch, formToBirthInfo } from '../../lib/ziwei/share';

// ── 1. Kiểm tra danh mục tỉnh thành Việt Nam ────────────────────────
assert.ok(Array.isArray(VIETNAM_PROVINCES), 'VIETNAM_PROVINCES phải là mảng');
assert.ok(VIETNAM_PROVINCES.length >= 10, 'VIETNAM_PROVINCES phải chứa ít nhất 10 tỉnh/thành');

// Tìm các thành phố lớn
function findCity(provinceName: string, cityName?: string) {
  const prov = VIETNAM_PROVINCES.find(p => p.name.includes(provinceName));
  assert.ok(prov, `Không tìm thấy tỉnh/thành: ${provinceName}`);
  if (cityName) {
    const city = prov.cities.find(c => c.name.includes(cityName));
    assert.ok(city, `Không tìm thấy quận/huyện/thị xã: ${cityName} trong ${provinceName}`);
    return city;
  }
  return prov.cities[0];
}

const hanoi = findCity('Hà Nội');
assert.equal(hanoi.longitude, 105.85, 'Kinh độ Hà Nội phải là 105.85');

const hcm = findCity('Hồ Chí Minh');
assert.equal(hcm.longitude, 106.66, 'Kinh độ TP.HCM phải là 106.66');

const danang = findCity('Đà Nẵng');
assert.equal(danang.longitude, 108.22, 'Kinh độ Đà Nẵng phải là 108.22');

const haiphong = findCity('Hải Phòng');
assert.equal(haiphong.longitude, 106.68, 'Kinh độ Hải Phòng phải là 106.68');

const cantho = findCity('Cần Thơ');
assert.equal(cantho.longitude, 105.78, 'Kinh độ Cần Thơ phải là 105.78');

const hue = findCity('Huế');
assert.equal(hue.longitude, 107.59, 'Kinh độ Thừa Thiên Huế phải là 107.59');

const khanhhoa = findCity('Khánh Hòa');
assert.equal(khanhhoa.longitude, 109.19, 'Kinh độ Khánh Hòa phải là 109.19');

// ── 2. Helper lấy tỉnh thành theo Locale & nhận diện ────────────────
const viProvs = getProvincesByLocale('vi');
assert.equal(viProvs, VIETNAM_PROVINCES, 'getProvincesByLocale(vi) phải trả về VIETNAM_PROVINCES');

const zhProvs = getProvincesByLocale('zh');
assert.notEqual(zhProvs, VIETNAM_PROVINCES, 'getProvincesByLocale(zh) không được là VIETNAM_PROVINCES');

assert.equal(isVietnamProvince('Hà Nội'), true);
assert.equal(isVietnamProvince('TP. Hồ Chí Minh'), true);
assert.equal(isVietnamProvince('北京市'), false);
assert.equal(isVietnamProvince(''), false);

// ── 3. Độ lệch kinh độ chân thái dương (True Solar Time offset) ──────
// Múi giờ Việt Nam: UTC+7 -> utcOffsetMinutes = 420 -> Kinh tuyến chuẩn: 105°E
// Độ lệch kinh độ = (kinh độ - 105) * 4 phút

// Hà Nội (105.85°E): lệch +0.85° ~ +3.4 phút
const hanoiSolar = calculateTrueSolarTime({
  year: 2024,
  month: 6,
  day: 1,
  clockHour: 12,
  clockMinute: 0,
  longitude: 105.85,
  utcOffsetMinutes: 420,
});
assert.ok(
  Math.abs(hanoiSolar.longitudeCorrectionMinutes - 3.4) < 1e-6,
  `Hà Nội kinh độ correction phải là +3.4 phút, thực tế: ${hanoiSolar.longitudeCorrectionMinutes}`,
);

// TP. Hồ Chí Minh (106.66°E): lệch +1.66° ~ +6.64 phút
const hcmSolar = calculateTrueSolarTime({
  year: 2024,
  month: 6,
  day: 1,
  clockHour: 12,
  clockMinute: 0,
  longitude: 106.66,
  utcOffsetMinutes: 420,
});
assert.ok(
  Math.abs(hcmSolar.longitudeCorrectionMinutes - 6.64) < 1e-6,
  `TP.HCM kinh độ correction phải là +6.64 phút, thực tế: ${hcmSolar.longitudeCorrectionMinutes}`,
);

// Đà Nẵng (108.22°E): lệch +3.22° ~ +12.88 phút
const danangSolar = calculateTrueSolarTime({
  year: 2024,
  month: 6,
  day: 1,
  clockHour: 12,
  clockMinute: 0,
  longitude: 108.22,
  utcOffsetMinutes: 420,
});
assert.ok(
  Math.abs(danangSolar.longitudeCorrectionMinutes - 12.88) < 1e-6,
  `Đà Nẵng kinh độ correction phải là +12.88 phút, thực tế: ${danangSolar.longitudeCorrectionMinutes}`,
);

// ── 4. Tính toán giờ Can Chi (Địa Chi) với Giờ Chân Thái Dương ──────
// Đà Nẵng: 10:50 + 12.88m = 11:02.88m -> sang giờ Ngọ (branch 6: 11:00-13:00)
// Nếu không bù chân thái dương: 10:50 là giờ Tỵ (branch 5: 09:00-11:00)
const danangBranch = calcTrueSolarBranch(10, 50, 108.22, 105);
assert.equal(danangBranch, 6, '10:50 tại Đà Nẵng sau bù chân thái dương (+12.88m) phải là giờ Ngọ (6)');

// Hà Nội: 12:55 + 3.4m = 12:58.4m -> vẫn là giờ Ngọ (branch 6)
const hanoiBranch = calcTrueSolarBranch(12, 55, 105.85, 105);
assert.equal(hanoiBranch, 6, '12:55 tại Hà Nội sau bù chân thái dương (+3.4m) phải là giờ Ngọ (6)');

// TP. Hồ Chí Minh: 22:58 + 6.64m = 23:04.64m -> sang giờ Tý (branch 0: 23:00-01:00)
const hcmBranch = calcTrueSolarBranch(22, 58, 106.66, 105);
assert.equal(hcmBranch, 0, '22:58 tại TP.HCM sau bù chân thái dương (+6.64m) phải là giờ Tý (0)');

// ── 5. Tích hợp formToBirthInfo chuyển ngày giờ Tý chính xác ─────────
// TP.HCM: 2024-05-15 22:58 -> Giờ Chân Thái Dương là 23:04 (vào giờ Vãn Tý -> sang ngày 2024-05-16, giờ 0)
const birthHcm = formToBirthInfo({
  name: 'Nguyễn Văn A',
  year: '2024',
  month: '5',
  day: '15',
  clockHour: '22',
  clockMinute: '58',
  unknownTime: false,
  province: hcm.name.includes('Hồ Chí Minh') ? hcm.name : 'TP. Hồ Chí Minh',
  city: hcm.name,
  longitude: 106.66,
  gender: 'male',
});
assert.equal(birthHcm.year, 2024);
assert.equal(birthHcm.month, 5);
assert.equal(birthHcm.day, 16, 'TP.HCM 22:58 do bù +6.64 phút nên vượt 23:00, phải chuyển sang ngày hôm sau');
assert.equal(birthHcm.hour, 0, 'Phải là giờ Tý (0)');

// Hà Nội: 2024-05-15 22:50 -> Giờ Chân Thái Dương là 22:53.4 -> vẫn chưa tới 23:00 -> giữ nguyên ngày 15, giờ Hợi (11)
const birthHanoi = formToBirthInfo({
  name: 'Trần Thị B',
  year: '2024',
  month: '5',
  day: '15',
  clockHour: '22',
  clockMinute: '50',
  unknownTime: false,
  province: 'Hà Nội',
  city: 'Hà Nội',
  longitude: 105.85,
  gender: 'female',
});
assert.equal(birthHanoi.year, 2024);
assert.equal(birthHanoi.month, 5);
assert.equal(birthHanoi.day, 15, 'Hà Nội 22:50 bù +3.4 phút chưa tới 23:00, giữ nguyên ngày 15');
assert.equal(birthHanoi.hour, 11, 'Vẫn là giờ Hợi (11)');

// Kiểm tra thành phố Trung Quốc có kinh độ trong dải 102°E–111°E (vd: Tứ Xuyên / Thành Đô 104.06°E) vẫn dùng kinh tuyến 120°E
const birthChengdu = formToBirthInfo({
  name: 'Trương Tam',
  year: '2024',
  month: '5',
  day: '15',
  clockHour: '23',
  clockMinute: '30',
  unknownTime: false,
  province: '四川省',
  city: '成都',
  longitude: 104.06,
  gender: 'male',
});
assert.equal(birthChengdu.day, 15, 'Thành Đô 23:30 bù -63.76 phút theo kinh tuyến 120°E phải ở ngày 15');
assert.equal(birthChengdu.hour, 11, 'Thành Đô 23:30 phải là giờ Hợi (11)');

console.log('✅ Vietnam solar time regression tests passed successfully!');
