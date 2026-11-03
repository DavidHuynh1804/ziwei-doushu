# Vietnamese Language Support (Hỗ Trợ Tiếng Việt) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm hỗ trợ ngôn ngữ Tiếng Việt toàn diện cho ứng dụng Tử Vi Đẩu Số (từ điển thuật ngữ Tử Vi chuẩn Hán-Việt, form an sao hỗ trợ tỉnh thành Việt Nam & giờ Chân Thái Dương, giao diện 12 cung lá số, trung cung, bảng luận giải cách cục, và chia sẻ lá số).

**Architecture:** Áp dụng nguyên tắc tách biệt tầng lõi tính toán và tầng hiển thị (Presentation Layer Decoupling): giữ nguyên 100% định danh Hán tự trong thuật toán cốt lõi (`lib/ziwei/algorithm.ts`, `patterns.ts`, `types.ts`) để bảo đảm toàn bộ 17 regression test tính toán hiện hữu giữ nguyên tính toàn vẹn (100% pass), đồng thời xây dựng hệ thống i18n chuyên dụng (`lib/i18n/`) gồm từ điển thuật ngữ Hán-Việt chuẩn mực, bộ chuyển ngữ (lookup formatters), React Context (`LanguageProvider`), và Language Toggle cho phép chuyển đổi mượt mà giữa Tiếng Việt và Tiếng Trung.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, iztro (tích hợp tham chiếu vi-VN), tsx (regression testing).

**Spec:** Kế hoạch thực thi tích hợp đa ngôn ngữ (Tiếng Việt) cho ứng dụng Tử Vi Đẩu Số Ziwei Master.

## Global Constraints

- **Bảo toàn lõi thuật toán**: Tuyệt đối không thay đổi kiểu trả về hay tên trường nội bộ của `ZiweiChart`, `Palace`, `Star` trong `algorithm.ts` để tránh phá vỡ 17 bài test an sao, độ sáng, tứ hóa, bốn mùa và ranh giới tiết khí.
- **Chuẩn hóa thuật ngữ Tử Vi Hán-Việt**: 14 chính tinh (Tử Vi, Thiên Cơ, Thái Dương...), phụ tinh (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc...), sát tinh (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh...), 12 cung (Mệnh, Huynh Đệ, Phu Thê, Tử Tức...), Tứ Hóa (Lộc, Quyền, Khoa, Kỵ), Ngũ Hành Cục (Thủy Nhị Cục, Mộc Tam Cục...), Miếu Vượng Đắc Hãm phải tuân thủ nghiêm ngặt quy ước thuật ngữ Tử Vi chính thống tại Việt Nam.
- **Giờ Chân Thái Dương Việt Nam**: Bổ sung kinh độ chuẩn cho các tỉnh thành Việt Nam (Hà Nội 105.85°E, TP.HCM 106.66°E...) và múi giờ GMT+7 vào danh mục địa điểm của `BirthForm`.
- **Tương thích giao diện & phông chữ**: Tiếng Việt có các ký tự dấu thanh (sắc, huyền, hỏi, ngã, nặng, ư, ơ, đ) và độ dài từ thường dài hơn chữ Hán (vd: "Thái Dương" vs "太阳"). Các ô 12 cung và Share Canvas phải xử lý kích thước chữ, khoảng cách đệm và ngắt dòng co giãn để không bị tràn ô hoặc cắt cụt dấu.
- **Không vỡ SSR / Hydration**: Lưu tùy chọn ngôn ngữ trong `localStorage` với khóa `'ziwei-lang'`, có script khởi tạo chống chớp giao diện (flash of unlocalized content) tương tự cơ chế `ThemeProvider`.

## Review Focus

1. **Khớp nối tên sao và cung vị (Star & Palace Mapping)**: Đảm bảo 100% sao trong `iztro` và sao tùy biến của hệ thống (kể cả sao tạp diệu như Thiên Tài, Thiên Thọ, Bác Sĩ...) đều có bản dịch Hán-Việt chuẩn xác, không bị rơi vào fallback tiếng Trung hoặc chuỗi rỗng.
2. **Kích thước hiển thị 12 ô cung (PalaceCell Layout Overflow)**: Chữ tiếng Việt dài hơn chữ Hán, cần đảm bảo trên màn hình di động lẫn máy tính, tên sao và huy hiệu độ sáng (Miếu/Vượng/Đắc/Hãm), nhãn Tứ Hóa không bị đè lên nhau.
3. **Giờ Chân Thái Dương & Giờ Tý tại Việt Nam**: Kiểm tra việc tính đổi kinh độ tỉnh thành Việt Nam không làm lệch mốc chuyển ngày giờ Tý (23:00 - 01:00) so với giờ chuẩn Hà Nội/TP.HCM (múi giờ GMT+7).
4. **Vẽ chữ tiếng Việt trên HTML5 Canvas (ShareCardCanvas)**: Chữ có dấu tiếng Việt không bị cắt phía trên/dưới khi render qua canvas và xuất ảnh PNG.
5. **Chuyển đổi ngôn ngữ tức thời (Instant Locale Toggle)**: Người dùng bấm đổi giữa 🇻🇳 Tiếng Việt và 🇨🇳 中文 thì toàn bộ form, bàn lá số, bảng luận giải và thanh điều hướng cập nhật ngay mà không cần reload trang hay mất dữ liệu lá số đang xem.

---

### Task 1: Bộ Từ Điển Thuật Ngữ Tử Vi & Trình Chuyển Ngữ (`lib/i18n/`)

**Files:**
- Create: `lib/i18n/types.ts`
- Create: `lib/i18n/terms-vi.ts`
- Create: `lib/i18n/ui-vi.ts`
- Create: `lib/i18n/patterns-vi.ts`
- Create: `lib/i18n/index.ts`
- Test: `scripts/regression/i18n-dictionary.test.ts`

**Interfaces:**
- Consumes: `lib/ziwei/constants.ts` (`STEMS`, `BRANCHES`, `JU_NAMES`, `PALACE_NAMES_ORDER`)
- Produces:
  - `type Locale = 'vi' | 'zh'`
  - `tStar(name: string, locale?: Locale): string`
  - `tPalace(name: string, locale?: Locale): string`
  - `tStem(stem: string | number, locale?: Locale): string`
  - `tBranch(branch: string | number, locale?: Locale): string`
  - `tBrightness(b?: string, locale?: Locale): string`
  - `tSiHua(s: string, locale?: Locale): string`
  - `tWuxingJu(ju: string | number, locale?: Locale): string`
  - `t(key: string, locale?: Locale): string`
  - `tPattern(patternName: string, locale?: Locale): { name: string; description?: string }`

- [ ] **Step 1: Viết test kiểm tra từ điển thuật ngữ Tử Vi**

Tạo `scripts/regression/i18n-dictionary.test.ts` kiểm tra:
- Đủ 14 chính tinh dịch chính xác sang tiếng Việt (紫微 -> Tử Vi, 破军 -> Phá Quân...).
- Đủ 12 cung (命宫 -> Mệnh, 兄弟 -> Huynh Đệ, 夫妻 -> Phu Thê...).
- Đủ 10 Thiên Can (甲 -> Giáp, 乙 -> Ất...) và 12 Địa Chi (子 -> Tý, 丑 -> Sửu...).
- Đủ 4 Tứ Hóa (禄 -> Lộc, 权 -> Quyền, 科 -> Khoa, 忌 -> Kỵ).
- Đủ các cấp độ sáng (庙 -> Miếu, 旺 -> Vượng, 得 -> Đắc, 利 -> Lợi, 平 -> Bình, 陷 -> Hãm...).
- Đủ 5 Ngũ Hành Cục (水二局 -> Thủy Nhị Cục, 木三局 -> Mộc Tam Cục...).
- Fallback an toàn: nếu gặp chuỗi chưa biết thì trả về chính chuỗi đó, không quăng lỗi.

- [ ] **Step 2: Chạy test để xác nhận test thất bại (Red)**

Run: `npx tsx scripts/regression/i18n-dictionary.test.ts`
Expected: FAIL do chưa có file `lib/i18n/index.ts`.

- [ ] **Step 3: Triển khai từ điển và các hàm helper trong `lib/i18n/`**

Tạo các file:
- `lib/i18n/types.ts`: định nghĩa `Locale`, interface từ điển UI và từ điển thuật ngữ.
- `lib/i18n/terms-vi.ts`: bảng ánh xạ toàn bộ sao (14 chính tinh, lục cát, lục sát, tứ hóa, vòng tràng sinh, 12 thần bác sĩ, tạp diệu), 12 cung, 10 can, 12 chi, độ sáng, ngũ hành cục.
- `lib/i18n/ui-vi.ts`: bản dịch các chuỗi giao diện (tiêu đề trang, nhãn trường, thông báo lỗi, nút bấm, tab điều hướng).
- `lib/i18n/patterns-vi.ts`: bảng ánh xạ tên và lời giải nghĩa các cách cục kinh điển (Tử Phủ Đồng Cung, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Nhật Nguyệt Giáp Mệnh, Tam Kỳ Gia Hội, v.v.).
- `lib/i18n/index.ts`: gom xuất khẩu và triển khai các hàm `tStar`, `tPalace`, `tStem`, `tBranch`, `tBrightness`, `tSiHua`, `tWuxingJu`, `tPattern`, `t`.

- [ ] **Step 4: Chạy test kiểm tra từ điển (Green)**

Run: `npx tsx scripts/regression/i18n-dictionary.test.ts`
Expected: PASS toàn bộ các assertion.

- [ ] **Step 5: Chạy lại toàn bộ test suite để đảm bảo không ảnh hưởng code cũ**

Run: `npm test`
Expected: PASS toàn bộ 17 regression test ban đầu.

---

### Task 2: Language Context & Nút Chuyển Đổi Ngôn Ngữ (`LanguageProvider` & `LanguageToggle`)

**Files:**
- Create: `components/LanguageProvider.tsx`
- Create: `components/LanguageToggle.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `lib/i18n/index.ts`
- Produces:
  - React hook: `useLanguage(): { locale: Locale; setLocale: (l: Locale) => void; t: (k: string) => string; tStar: (n: string) => string; ... }`
  - Component: `<LanguageProvider>`
  - Component: `<LanguageToggle>`

- [ ] **Step 1: Tạo `components/LanguageProvider.tsx`**

- Lưu trạng thái ngôn ngữ với kiểu `Locale` ('vi' | 'zh').
- Đọc từ `localStorage.getItem('ziwei-lang')` khi khởi động, mặc định là `'vi'`.
- Lưu vào `localStorage` và cập nhật thuộc tính `data-lang` trên thẻ `<html>` khi thay đổi.
- Cung cấp hook `useLanguage` đóng gói sẵn các hàm dịch theo locale hiện hành.

- [ ] **Step 2: Tạo `components/LanguageToggle.tsx`**

- Thiết kế component nút chuyển đổi nhỏ gọn, sang trọng (tông màu vàng đồng hoàng gia đồng bộ với `ThemeToggle`).
- Hiển thị cờ và tên ngôn ngữ: 🇻🇳 Tiếng Việt / 🇨🇳 中文.
- Có animation mượt mà bằng `framer-motion`.

- [ ] **Step 3: Cập nhật `app/layout.tsx`**

- Bao bọc `{children}` bên trong `<LanguageProvider>`.
- Bổ sung đoạn script nhỏ trong thẻ `<head>` để đọc `localStorage.getItem('ziwei-lang')` và set `lang="vi"` hoặc `lang="zh-CN"` trước khi hydrate, tránh nhấp nháy giao diện.

- [ ] **Step 4: Kiểm tra build TypeScript**

Run: `npm run typecheck`
Expected: PASS, không có lỗi kiểu.

---

### Task 3: Bổ Sung Tỉnh Thành Việt Nam & Giờ Chân Thái Dương (`lib/ziwei/cities.ts` & `BirthForm.tsx`)

**Files:**
- Modify: `lib/ziwei/cities.ts`
- Modify: `components/BirthForm.tsx`
- Test: `scripts/regression/vietnam-solar-time.test.ts`

**Interfaces:**
- Consumes: `lib/ziwei/true-solar-time.ts`, `lib/ziwei/cities.ts`
- Produces: Danh mục tỉnh thành Việt Nam trong `PROVINCES` (hoặc `VIETNAM_PROVINCES`), `formToBirthInfo` tính đúng giờ Chân Thái Dương với kinh độ Việt Nam.

- [ ] **Step 1: Viết test tính Giờ Chân Thái Dương tại Việt Nam**

Tạo `scripts/regression/vietnam-solar-time.test.ts`:
- Hà Nội (kinh độ ~105.85°E, múi giờ +7 / kinh tuyến chuẩn 105°E): độ lệch kinh độ ~+0.85° tương đương ~+3.4 phút.
- TP. Hồ Chí Minh (kinh độ ~106.66°E): độ lệch kinh độ ~+1.66° tương đương ~+6.6 phút.
- Đà Nẵng (kinh độ ~108.22°E): độ lệch ~+12.8 phút.
- Kiểm tra tính toán giờ sinh theo Can Chi (Giờ Tý, Sửu, Dần...) sau khi bù trừ Chân Thái Dương tại Việt Nam không sinh ra kết quả bất thường.

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Run: `npx tsx scripts/regression/vietnam-solar-time.test.ts`
Expected: FAIL do chưa có danh sách tỉnh thành Việt Nam hoặc hàm tương ứng.

- [ ] **Step 3: Cập nhật dữ liệu tỉnh thành Việt Nam và `BirthForm.tsx`**

- Trong `lib/ziwei/cities.ts`: thêm dữ liệu danh sách các tỉnh/thành phố lớn của Việt Nam (Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Hải Phòng, Cần Thơ, Thừa Thiên Huế, Quảng Ninh, Khánh Hòa, Nghệ An, Thanh Hóa, Lâm Đồng, Bình Dương, Đồng Nai...) kèm kinh độ kinh tuyến tương ứng.
- Trong `components/BirthForm.tsx`:
  - Dùng `useLanguage()` để chuyển ngữ toàn bộ nhãn form: "Họ và tên", "Năm", "Tháng", "Ngày", "Giờ", "Phút", "Giới tính" (Nam / Nữ), "Chưa rõ giờ sinh", "Nơi sinh (để tính giờ thật)", "Dương lịch / Âm lịch", nút "Lập lá số Tử Vi".
  - Cho phép người dùng dễ dàng chọn tỉnh thành Việt Nam làm nơi sinh mặc định khi ở ngôn ngữ tiếng Việt.
  - Chuyển ngữ các thông báo validation ("Vui lòng chọn ngày hợp lệ", v.v.).

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npx tsx scripts/regression/vietnam-solar-time.test.ts`
Expected: PASS toàn bộ.

- [ ] **Step 5: Chạy lại toàn bộ test suite**

Run: `npm test`
Expected: PASS toàn bộ.

---

### Task 4: Bản Đồ Lá Số 12 Cung & Trung Cung (`PalaceCell.tsx`, `ChartBoard.tsx`, `ChartSummary.tsx`, `TimeNav.tsx`)

**Files:**
- Modify: `components/PalaceCell.tsx`
- Modify: `components/ChartBoard.tsx`
- Modify: `components/ChartSummary.tsx`
- Modify: `components/TimeNav.tsx`
- Modify: `app/chart/page.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `lib/i18n/index.ts`, `lib/ziwei/types.ts`
- Produces: Giao diện bàn Tử Vi 12 cung hoàn chỉnh bằng Tiếng Việt.

- [ ] **Step 1: Cập nhật `PalaceCell.tsx`**

- Dùng `tPalace(palace.name)` để hiển thị tên cung: "Mệnh", "Huynh Đệ", "Phu Thê", "Tử Tức", "Tài Bạch", "Tật Ách", "Thiên Di", "Nô Bộc", "Quan Lộc", "Điền Trạch", "Phúc Đức", "Phụ Mẫu", "Thân".
- Hiển thị Can Chi cung bằng tiếng Việt: `tStem(stem) + ' ' + tBranch(branch)` (vd: "Giáp Dần", "Ất Mão"...).
- Dùng `tStar(star.name)` để hiển thị tên sao: "Tử Vi", "Thiên Cơ", "Thất Sát", "Kình Dương"...
- Dùng `tBrightness(star.brightnessRaw)` để hiển thị nhãn độ sáng: [M] / Miếu, [V] / Vượng, [Đ] / Đắc, [H] / Hãm...
- Dùng `tSiHua(star.siHua)` để hiển thị huy hiệu Tứ Hóa: "Lộc", "Quyền", "Khoa", "Kỵ".
- Điều chỉnh CSS padding, font size và flexbox để chữ tiếng Việt hiển thị gọn gàng, không bị vỡ bố cục ô.

- [ ] **Step 2: Cập nhật `ChartSummary.tsx` (Trung Cung)**

- Dịch các đề mục:
  - "命格总览" -> "Tổng Quan Lá Số"
  - "命宫主星" -> "Chính Tinh Thủ Mệnh" (hoặc "Sao Cung Mệnh")
  - "性格特质" -> "Đặc Tính Khí Chất"
  - "四化分布" -> "Phân Bố Tứ Hóa Năm"
  - "基本信息" -> "Thông Tin Bát Tự"
  - Dương lịch / Âm lịch / Bát tự 4 trụ (Năm, Tháng, Ngày, Giờ) hiển thị theo Can Chi tiếng Việt.
  - "Mệnh Chủ": `tStar(chart.mingZhu)`
  - "Thân Chủ": `tStar(chart.shenZhu)`
  - "Cục": `tWuxingJu(chart.wuxingJu)` (vd: "Thủy Nhị Cục", "Kim Tứ Cục"...)
  - Giới tính & Âm Dương: "Dương Nam", "Dương Nữ", "Âm Nam", "Âm Nữ".

- [ ] **Step 3: Cập nhật `TimeNav.tsx`**

- Dịch các tab chuyển đổi thời gian:
  - "本命" -> "Bản Mệnh"
  - "大限" -> "Đại Hạn"
  - "流年" -> "Lưu Niên"
  - "流月" -> "Lưu Nguyệt"
  - "流日" -> "Lưu Nhật"
  - "流时" -> "Lưu Thời"
- Nhãn hiển thị năm, tuổi, can chi năm lưu niên (vd: "2026 Bính Ngọ - 37 tuổi").

- [ ] **Step 4: Cập nhật `app/chart/page.tsx`**

- Dịch nút "← 重新起盘" -> "← Lập lá số khác".
- Dịch tiêu đề trang và phần hướng dẫn khi chưa có lá số.
- Thêm `<LanguageToggle />` trên đầu trang để người dùng có thể đổi ngôn ngữ ngay tại trang lá số.

- [ ] **Step 5: Kiểm tra typecheck và smoke test**

Run: `npm run typecheck`
Expected: PASS.

---

### Task 5: Bảng Luận Giải Cách Cục, Chi Tiết Sao & AI Chat (`InsightPanel`, `StarDetailPanel`, `PatternsCard`, `ChatPanel`)

**Files:**
- Modify: `components/PatternsCard.tsx`
- Modify: `components/StarDetailPanel.tsx`
- Modify: `components/InsightPanel.tsx`
- Modify: `components/ChatPanel.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `lib/i18n/patterns-vi.ts`, `lib/i18n/index.ts`
- Produces: Luận giải các cách cục, ý nghĩa sao, và prompt tương tác AI bằng tiếng Việt.

- [ ] **Step 1: Cập nhật `PatternsCard.tsx`**

- Sử dụng `tPattern(pattern.name)` để dịch tên các cách cục:
  - "君臣庆会" -> "Quân Thần Khánh Hội"
  - "紫府同宫" -> "Tử Phủ Đồng Cung"
  - "杀破狼" -> "Sát Phá Tham"
  - "机月同梁" -> "Cơ Nguyệt Đồng Lương"
  - "府相朝垣" -> "Phủ Tướng Triều Viên"
  - "日月夹命" -> "Nhật Nguyệt Giáp Mệnh"
  - "三奇加会" -> "Tam Kỳ Gia Hội"
  - ... và hơn 30 cách cục khác trong `patterns.ts`.
- Dịch các tiêu đề nhóm: "Cách cục cát lợi", "Cách cục cần lưu ý", "Điều kiện thành cách", "Xuất xứ cổ thư".

- [ ] **Step 2: Cập nhật `StarDetailPanel.tsx`**

- Dịch bảng đặc tính chi tiết khi click vào một sao: Tên sao tiếng Việt, thuộc tính ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ), loại sao (Chính tinh, Cát tinh, Hung tinh), tính chất luận giải cốt lõi.

- [ ] **Step 3: Cập nhật `InsightPanel.tsx` & `ChatPanel.tsx`**

- Dịch các tab chủ đề luận giải:
  - overview -> "Tổng Quan Mệnh Cách"
  - love -> "Tình Duyên & Hôn Nhân"
  - career -> "Công Danh & Sự Nghiệp"
  - wealth -> "Tài Lộc & Tiền Bạc"
  - health -> "Sức Khỏe & Tật Ách"
  - personality -> "Tính Cách & Xu Hướng"
- Thiết lập bộ prompt tiếng Việt chuẩn thuật ngữ Tử Vi tương ứng trong `TOPIC_PROMPTS_VI` để khi người dùng nhấn xem luận giải, request gửi tới AI sẽ yêu cầu trả lời trực tiếp bằng tiếng Việt có cấu trúc rõ ràng.
- Chuyển ngữ các thông báo: "Đang phân tích lá số...", "Không tìm thấy cấu hình API...", "Gợi ý câu hỏi nhanh...".

- [ ] **Step 4: Kiểm tra TypeScript**

Run: `npm run typecheck`
Expected: PASS.

---

### Task 6: Xuất Ảnh & Chia Sẻ Lá Số Tiếng Việt (`ShareCardCanvas.tsx` & `ShareModal.tsx`)

**Files:**
- Modify: `components/ShareCardCanvas.tsx`
- Modify: `components/ShareModal.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `lib/i18n/index.ts`
- Produces: Ảnh thẻ chia sẻ 680x420 render tiếng Việt chuẩn mực, hỗ trợ tải ảnh PNG.

- [ ] **Step 1: Cập nhật `ShareCardCanvas.tsx`**

- Thay thế nhãn tiếng Trung bằng tiếng Việt:
  - "紫微斗数命盘" -> "Lá Số Tử Vi Đẩu Số"
  - 12 cung vẽ trên canvas dùng tên tiếng Việt: Mệnh, Huynh Đệ, Phu Thê...
  - Tên sao chính hiển thị tiếng Việt: Tử Vi, Thiên Phủ, Thất Sát...
  - Bát tự: Năm, Tháng, Ngày, Giờ (Can Chi).
  - Cục, Mệnh Chủ, Thân Chủ hiển thị tiếng Việt.
- Điều chỉnh khoảng cách dòng (`line-height`), đệm lề và cỡ chữ để các dấu thanh tiếng Việt (ư, ơ, ê, dấu sắc/hỏi/ngã/nặng) không bị chạm mép ô hay bị clipping.

- [ ] **Step 2: Cập nhật `ShareModal.tsx`**

- Dịch các nút thao tác: "Tải ảnh lá số về máy", "Sao chép liên kết lá số", "Đã sao chép vào bộ nhớ tạm", "Đóng".

- [ ] **Step 3: Kiểm tra TypeScript**

Run: `npm run typecheck`
Expected: PASS.

---

### Task 7: Trang Chủ, Điều Hướng & Metadata SEO (`app/page.tsx`, `app/layout.tsx`)

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `components/LanguageToggle.tsx`
- Produces: Trang chủ song ngữ Tiếng Việt - Tiếng Trung mượt mà.

- [ ] **Step 1: Tích hợp `LanguageToggle` vào Header trang chủ**

- Đặt `<LanguageToggle />` cạnh `<ThemeToggle />` ở góc phải thanh điều hướng.
- Khi người dùng bấm chuyển đổi, trạng thái lưu vào `localStorage` và đổi toàn bộ nội dung hiển thị ngay lập tức.

- [ ] **Step 2: Dịch các phần chính của Landing Page (`app/page.tsx`)**

- Phần Hero:
  - Tiêu đề: "Tử Vi Đẩu Số · Công Cụ Lập & Luận Giải Lá Số Mã Nguồn Mở"
  - Tagline: "Thuật toán cổ truyền minh bạch — Khám phá bản mệnh, vận hạn và tiềm năng cuộc đời"
  - Nút kêu gọi hành động (CTA): "Bắt đầu lập lá số ngay" -> dẫn tới `/chart`.
- Phần 14 Chính Tinh:
  - Giới thiệu 14 chính tinh bằng tiếng Việt (Tử Vi - Đế tinh, Thiên Cơ - Trí tuệ, Thái Dương - Quang minh, Vũ Khúc - Tài tinh...).
- Phần Giới thiệu tính năng & Nền tảng thuật toán.
- Footer: Điều khoản, chính sách, liên hệ.

- [ ] **Step 3: Cập nhật Metadata SEO trong `app/layout.tsx`**

- Hỗ trợ tiêu đề và mô tả tiếng Việt tối ưu cho tìm kiếm: "Tử Vi Đẩu Số - Lập Lá Số & Luận Giải Tử Vi Chuẩn Xác".
- Bổ sung từ khóa tiếng Việt: `Tử Vi Đẩu Số, Lập lá số tử vi, 14 chính tinh, luận giải lá số, bát tự, đại hạn, lưu niên`.

- [ ] **Step 4: Kiểm tra build Next.js**

Run: `npm run build`
Expected: Build thành công trang tĩnh và dynamic routes không có lỗi hydration hay syntax.

---

### Task 8: Kiểm Thử Toàn Diện & Hồi Quy (Verification & Regression)

**Files:**
- Test: Toàn bộ test suite trong `scripts/regression/`

- [ ] **Step 1: Chạy toàn bộ 17 regression test tính toán ban đầu**

Run: `npm test`
Expected: PASS 100% (bảo đảm 768 lá số mẫu, ranh giới Lập Xuân, giờ Chân Thái Dương, Tứ Hóa, Thất Sát, Hồng Loan... hoàn toàn không đổi).

- [ ] **Step 2: Chạy các bài test i18n mới**

Run: `npx tsx scripts/regression/i18n-dictionary.test.ts && npx tsx scripts/regression/vietnam-solar-time.test.ts`
Expected: PASS 100%.

- [ ] **Step 3: Khởi chạy môi trường dev và smoke test các luồng người dùng**

Kiểm tra trực tiếp các kịch bản:
1. Vào `/chart` -> Giao diện mặc định tiếng Việt, form hiển thị nhãn tiếng Việt.
2. Chọn nơi sinh: Hà Nội / TP.HCM -> kiểm tra giờ Chân Thái Dương tính đúng.
3. Bấm "Lập lá số" -> Bàn 12 ô hiển thị đầy đủ tên cung (Mệnh, Huynh Đệ...), sao chính (Tử Vi, Thất Sát...), độ sáng ([M], [V]...), Tứ Hóa (Lộc, Quyền...).
4. Trung cung hiển thị Bát tự, Mệnh Cục, Mệnh Chủ, Thân Chủ bằng tiếng Việt.
5. Chuyển qua tab "Cách Cục" -> Xem các cách cục hiển thị tên Hán-Việt chuẩn xác.
6. Bấm nút chuyển ngôn ngữ sang 🇨🇳 中文 -> Toàn bộ lá số đổi về tiếng Trung nguyên bản tức thì. Bấm lại 🇻🇳 Tiếng Việt -> Trở về tiếng Việt.
7. Mở modal chia sẻ lá số -> Xem ảnh thẻ hiển thị tiếng Việt rõ ràng, dấu thanh không bị đè.
