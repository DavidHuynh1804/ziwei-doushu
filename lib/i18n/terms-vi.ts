/**
 * Bảng ánh xạ thuật ngữ Tử Vi Đẩu Số sang Tiếng Việt.
 * Sử dụng chuẩn âm Hán-Việt truyền thống ngành Tử Vi Việt Nam.
 */

// 14 Chính Tinh
export const MAJOR_STARS_VI: Record<string, string> = {
  '紫微': 'Tử Vi',
  '天机': 'Thiên Cơ',
  '太阳': 'Thái Dương',
  '武曲': 'Vũ Khúc',
  '天同': 'Thiên Đồng',
  '廉贞': 'Liêm Trinh',
  '天府': 'Thiên Phủ',
  '太阴': 'Thái Âm',
  '贪狼': 'Tham Lang',
  '巨门': 'Cự Môn',
  '天相': 'Thiên Tướng',
  '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát',
  '破军': 'Phá Quân',
};

// Phụ tinh, Lục Cát, Lục Sát, Tứ Hóa, Tạp Diệu, v.v.
export const MINOR_STARS_VI: Record<string, string> = {
  // Lục cát & trợ tinh
  '左辅': 'Tả Phù',
  '右弼': 'Hữu Bật',
  '文昌': 'Văn Xương',
  '文曲': 'Văn Khúc',
  '天魁': 'Thiên Khôi',
  '天钺': 'Thiên Việt',
  '禄存': 'Lộc Tồn',
  '天马': 'Thiên Mã',

  // Lục sát & hình diệu
  '擎羊': 'Kình Dương',
  '陀罗': 'Đà La',
  '火星': 'Hỏa Tinh',
  '铃星': 'Linh Tinh',
  '地空': 'Địa Không',
  '地劫': 'Địa Kiếp',
  '天空': 'Thiên Không',
  '劫杀': 'Kiếp Sát',
  '劫煞': 'Kiếp Sát',

  // Tứ Hóa
  '化禄': 'Hóa Lộc',
  '化权': 'Hóa Quyền',
  '化科': 'Hóa Khoa',
  '化忌': 'Hóa Kỵ',

  // Cát tinh / Tạp tinh thường gặp
  '天刑': 'Thiên Hình',
  '天姚': 'Thiên Diêu',
  '解神': 'Giải Thần',
  '阴煞': 'Âm Sát',
  '天喜': 'Thiên Hỷ',
  '天官': 'Thiên Quan',
  '天福': 'Thiên Phúc',
  '天哭': 'Thiên Khốc',
  '天虚': 'Thiên Hư',
  '龙池': 'Long Trì',
  '凤阁': 'Phụng Các',
  '红鸾': 'Hồng Loan',
  '孤辰': 'Cô Thần',
  '寡宿': 'Quả Tú',
  '蜚廉': 'Phi Liêm',
  '飞廉': 'Phi Liêm',
  '破碎': 'Phá Toái',
  '台辅': 'Đài Phụ',
  '封诰': 'Phong Cáo',
  '天巫': 'Thiên Vu',
  '天月': 'Thiên Nguyệt',
  '三台': 'Tam Thai',
  '八座': 'Bát Tọa',
  '恩光': 'Ân Quang',
  '天贵': 'Thiên Quý',
  '天才': 'Thiên Tài',
  '天寿': 'Thiên Thọ',
  '截空': 'Triệt Không',
  '旬中': 'Tuần Trung',
  '旬空': 'Tuần Không',
  '空亡': 'Không Vong',
  '截路': 'Triệt Lộ',
  '月德': 'Nguyệt Đức',
  '天伤': 'Thiên Thương',
  '天使': 'Thiên Sứ',
  '天厨': 'Thiên Trù',
  '华盖': 'Hoa Cái',
  '咸池': 'Hàm Trì',
  '大耗': 'Đại Hao',
  '小耗': 'Tiểu Hao',

  // 12 Thần Trường Sinh
  '长生': 'Trường Sinh',
  '沐浴': 'Mục Dục',
  '冠带': 'Quan Đới',
  '临官': 'Lâm Quan',
  '帝旺': 'Đế Vượng',
  '衰': 'Suy',
  '病': 'Bệnh',
  '死': 'Tử',
  '墓': 'Mộ',
  '绝': 'Tuyệt',
  '胎': 'Thai',
  '养': 'Dưỡng',

  // 12 Thần Bác Sĩ
  '博士': 'Bác Sỹ',
  '力士': 'Lực Sỹ',
  '青龙': 'Thanh Long',
  '将军': 'Tướng Quân',
  '奏书': 'Tấu Thư',
  '喜神': 'Hỷ Thần',
  '病符': 'Bệnh Phù',
  '伏兵': 'Phục Binh',
  '官府': 'Quan Phủ',

  // 12 Thần Thái Tuế (Tuế Tiền Thập Nhị Thần)
  '岁建': 'Tuế Kiện',
  '晦气': 'Hối Khí',
  '丧门': 'Tang Môn',
  '贯索': 'Quán Tác',
  '官符': 'Quan Phù',
  '小耗(岁前)': 'Tiểu Hao',
  '岁破': 'Tuế Phá',
  '龙德': 'Long Đức',
  '白虎': 'Bạch Hổ',
  '天德': 'Thiên Đức',
  '吊客': 'Điếu Khách',

  // 12 Thần Tướng Tinh (Tướng Tinh Thập Nhị Thần)
  '将星': 'Tướng Tinh',
  '攀鞍': 'Phan Án',
  '岁驿': 'Tuế Dịch',
  '息神': 'Tức Thần',
  '灾煞': 'Tai Sát',
  '天煞': 'Thiên Sát',
  '指背': 'Chỉ Bối',
  '月煞': 'Nguyệt Sát',
  '亡神': 'Vong Thần',

  // Lưu Diệu / Vận Tinh
  '运魁': 'Vận Khôi',
  '运钺': 'Vận Việt',
  '运昌': 'Vận Xương',
  '运曲': 'Vận Khúc',
  '运鸾': 'Vận Loan',
  '运喜': 'Vận Hỷ',
  '运禄': 'Vận Lộc',
  '运羊': 'Vận Dương',
  '运陀': 'Vận Đà',
  '流魁': 'Lưu Khôi',
  '流钺': 'Lưu Việt',
  '流昌': 'Lưu Xương',
  '流曲': 'Lưu Khúc',
  '流鸾': 'Lưu Loan',
  '流喜': 'Lưu Hỷ',
  '流禄': 'Lưu Lộc',
  '流羊': 'Lưu Dương',
  '流陀': 'Lưu Đà',
};

export const ALL_STARS_VI: Record<string, string> = {
  ...MAJOR_STARS_VI,
  ...MINOR_STARS_VI,
};

// 12 Cung (và các biến thể có/không có chữ 宫)
export const PALACES_VI: Record<string, string> = {
  '命宫': 'Mệnh',
  '命': 'Mệnh',
  '兄弟宫': 'Huynh Đệ',
  '兄弟': 'Huynh Đệ',
  '夫妻宫': 'Phu Thê',
  '夫妻': 'Phu Thê',
  '子女宫': 'Tử Nữ',
  '子女': 'Tử Nữ',
  '财帛宫': 'Tài Bạch',
  '财帛': 'Tài Bạch',
  '疾厄宫': 'Tật Ách',
  '疾厄': 'Tật Ách',
  '迁移宫': 'Thiên Di',
  '迁移': 'Thiên Di',
  '交友宫': 'Nô Bộc',
  '交友': 'Nô Bộc',
  '仆役宫': 'Nô Bộc',
  '仆役': 'Nô Bộc',
  '官禄宫': 'Quan Lộc',
  '官禄': 'Quan Lộc',
  '田宅宫': 'Điền Trạch',
  '田宅': 'Điền Trạch',
  '福德宫': 'Phúc Đức',
  '福德': 'Phúc Đức',
  '父母宫': 'Phụ Mẫu',
  '父母': 'Phụ Mẫu',
  '身宫': 'Thân',
  '身': 'Thân',
  '来因宫': 'Lai Nhân',
  '来因': 'Lai Nhân',
};

// 10 Thiên Can
export const STEMS_VI: Record<string, string> = {
  '甲': 'Giáp',
  '乙': 'Ất',
  '丙': 'Bính',
  '丁': 'Đinh',
  '戊': 'Mậu',
  '己': 'Kỷ',
  '庚': 'Canh',
  '辛': 'Tân',
  '壬': 'Nhâm',
  '癸': 'Quý',
};

export const STEM_INDEX_VI: string[] = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu',
  'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý',
];

// 12 Địa Chi
export const BRANCHES_VI: Record<string, string> = {
  '子': 'Tý',
  '丑': 'Sửu',
  '寅': 'Dần',
  '卯': 'Mão',
  '辰': 'Thìn',
  '巳': 'Tỵ',
  '午': 'Ngọ',
  '未': 'Mùi',
  '申': 'Thân',
  '酉': 'Dậu',
  '戌': 'Tuất',
  '亥': 'Hợi',
};

export const BRANCH_INDEX_VI: string[] = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ',
  'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
];

// Cấp độ sáng sao (Brightness)
export const BRIGHTNESS_VI: Record<string, string> = {
  '庙': 'Miếu',
  '旺': 'Vượng',
  '得': 'Đắc',
  '利': 'Lợi',
  '平': 'Bình',
  '不': 'Bất',
  '陷': 'Hãm',
  'bright': 'Miếu Vượng',
  'normal': 'Bình Hòa',
  'dim': 'Hãm Địa',
};

// Tứ Hóa
export const SIHUA_VI: Record<string, string> = {
  '禄': 'Lộc',
  '权': 'Quyền',
  '科': 'Khoa',
  '忌': 'Kỵ',
  '化禄': 'Hóa Lộc',
  '化权': 'Hóa Quyền',
  '化科': 'Hóa Khoa',
  '化忌': 'Hóa Kỵ',
};

// Ngũ Hành Cục
export const WUXING_JU_VI: Record<string, string> = {
  '水二局': 'Thủy Nhị Cục',
  '木三局': 'Mộc Tam Cục',
  '金四局': 'Kim Tứ Cục',
  '土五局': 'Thổ Ngũ Cục',
  '火六局': 'Hỏa Lục Cục',
};

export const WUXING_JU_NUM_VI: Record<number, string> = {
  2: 'Thủy Nhị Cục',
  3: 'Mộc Tam Cục',
  4: 'Kim Tứ Cục',
  5: 'Thổ Ngũ Cục',
  6: 'Hỏa Lục Cục',
};
