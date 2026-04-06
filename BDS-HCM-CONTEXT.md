# BDS-HCM-CONTEXT.md
# Dữ liệu đặc thù thị trường TP.HCM cho BDS Platform
# Nguồn: Nghị quyết 87/2025/NQ-HĐND (bảng giá đất 1/1/2026)
#         Nghị quyết 1685/NQ-UBTVQH15 (sáp nhập phường 1/7/2025)
# Đọc file này khi cần: quận/phường, giá thị trường, pháp lý, địa chỉ HCM

---
## PHẦN 1: CẤU TRÚC HÀNH CHÍNH MỚI SAU SÁP NHẬP (từ 1/7/2025)
---

### Thay đổi lớn nhất — Anh Ari cần hiểu rõ

```
TRƯỚC 1/7/2025:          SAU 1/7/2025:
  TP.HCM                   TP.HCM (bao gồm Bình Dương + Bà Rịa-Vũng Tàu cũ)
  ├── Quận 1               ├── 113 phường
  ├── Quận 3               ├── 54 xã
  ├── Quận 7               └── 1 đặc khu (Côn Đảo)
  ├── TP. Thủ Đức
  └── ... (cấp quận/huyện)

SAU SÁP NHẬP:
  → Không còn cấp quận/huyện chính thức
  → Quận 1, Quận 3, v.v. trở thành "khu vực định danh" (dùng trong quy hoạch)
  → Cấp quản lý: UBND TP.HCM → UBND phường/xã mới
  → 168 đơn vị hành chính cấp xã
```

### Tại sao platform cần quan tâm

```
1. LISTING CŨ (trước 7/2025): sổ đỏ/hồng ghi "Phường Bến Nghé, Quận 1"
   → Vẫn có giá trị pháp lý
   → Nhưng khi đăng tin mới phải dùng tên phường mới

2. LISTING MỚI (sau 7/2025): phải dùng "Phường Sài Gòn, TP.HCM"

3. PLATFORM PHẢI HIỂN THỊ CẢ 2:
   "Phường Sài Gòn, TP.HCM
    (trước 7/2025: Phường Bến Nghé, Quận 1)"
   → Khách nhận ra khu vực quen thuộc
```

### Mapping phường quan trọng nhất cho BĐS

```javascript
// js/address-mapper.js
const WARD_MAPPING = {
  // ========== VÙNG QUẬN 1 CŨ ==========
  'Phường Bến Nghé, Quận 1':         { new: 'Phường Sài Gòn', zone: 'Quận 1 (cũ)', tier: 1 },
  'Phường Nguyễn Thái Bình, Quận 1': { new: 'Phường Sài Gòn', zone: 'Quận 1 (cũ)', tier: 1 },
  'Phường Đa Kao, Quận 1':           { new: 'Phường Tân Định', zone: 'Quận 1 (cũ)', tier: 1 },
  'Phường Tân Định, Quận 1':         { new: 'Phường Tân Định', zone: 'Quận 1 (cũ)', tier: 1 },
  'Phường Bến Thành, Quận 1':        { new: 'Phường Bến Thành', zone: 'Quận 1 (cũ)', tier: 1 },

  // ========== VÙNG QUẬN 3 CŨ ==========
  'Phường 1, Quận 3':  { new: 'Phường Bàn Cờ', zone: 'Quận 3 (cũ)', tier: 1 },
  'Phường 2, Quận 3':  { new: 'Phường Bàn Cờ', zone: 'Quận 3 (cũ)', tier: 1 },
  'Phường 3, Quận 3':  { new: 'Phường Bàn Cờ', zone: 'Quận 3 (cũ)', tier: 1 },
  'Phường 4, Quận 3':  { new: 'Phường Xuân Hòa', zone: 'Quận 3 (cũ)', tier: 1 },
  'Phường 5, Quận 3':  { new: 'Phường Bàn Cờ', zone: 'Quận 3 (cũ)', tier: 1 },
  'Phường Võ Thị Sáu, Quận 3': { new: 'Phường Xuân Hòa', zone: 'Quận 3 (cũ)', tier: 1 },
  'Phường 9, Quận 3':  { new: 'Phường Nhiêu Lộc', zone: 'Quận 3 (cũ)', tier: 1 },
  'Phường 11, Quận 3': { new: 'Phường Nhiêu Lộc', zone: 'Quận 3 (cũ)', tier: 1 },
  'Phường 12, Quận 3': { new: 'Phường Nhiêu Lộc', zone: 'Quận 3 (cũ)', tier: 1 },
  'Phường 14, Quận 3': { new: 'Phường Nhiêu Lộc', zone: 'Quận 3 (cũ)', tier: 1 },

  // ========== VÙNG QUẬN 4 CŨ ==========
  'Phường 13, Quận 4': { new: 'Phường Xóm Chiếu', zone: 'Quận 4 (cũ)', tier: 2 },
  'Phường 16, Quận 4': { new: 'Phường Xóm Chiếu', zone: 'Quận 4 (cũ)', tier: 2 },
  'Phường 8, Quận 4':  { new: 'Phường Khánh Hội', zone: 'Quận 4 (cũ)', tier: 2 },
  'Phường 9, Quận 4':  { new: 'Phường Khánh Hội', zone: 'Quận 4 (cũ)', tier: 2 },

  // ========== VÙNG QUẬN 7 CŨ (Phú Mỹ Hưng) ==========
  'Phường Tân Phú, Quận 7':     { new: 'Phường Tân Phú (Q7)', zone: 'Quận 7 (cũ)', tier: 2 },
  'Phường Tân Hưng, Quận 7':    { new: 'Phường Tân Hưng', zone: 'Quận 7 (cũ)', tier: 2 },
  'Phường Phú Mỹ, Quận 7':      { new: 'Phường Phú Mỹ (Q7)', zone: 'Quận 7 (cũ)', tier: 2 },

  // ========== VÙNG QUẬN 10 CŨ ==========
  'Phường 1, Quận 10':  { new: 'Phường Vườn Lài', zone: 'Quận 10 (cũ)', tier: 2 },
  'Phường 2, Quận 10':  { new: 'Phường Vườn Lài', zone: 'Quận 10 (cũ)', tier: 2 },
  'Phường 4, Quận 10':  { new: 'Phường Vườn Lài', zone: 'Quận 10 (cũ)', tier: 2 },
  'Phường 9, Quận 10':  { new: 'Phường Vườn Lài', zone: 'Quận 10 (cũ)', tier: 2 },
  'Phường 10, Quận 10': { new: 'Phường Vườn Lài', zone: 'Quận 10 (cũ)', tier: 2 },

  // ========== VÙNG TP. THỦ ĐỨC CŨ ==========
  'Phường Hiệp Bình Chánh, TP.Thủ Đức': { new: 'Phường Hiệp Bình', zone: 'Thủ Đức (cũ)', tier: 3 },
  'Phường Hiệp Bình Phước, TP.Thủ Đức': { new: 'Phường Hiệp Bình', zone: 'Thủ Đức (cũ)', tier: 3 },
  'Phường Linh Đông, TP.Thủ Đức':       { new: 'Phường Hiệp Bình', zone: 'Thủ Đức (cũ)', tier: 3 },

  // ========== VÙNG BÌNH TÂN CŨ ==========
  'Phường An Lạc, Quận Bình Tân':   { new: 'Phường An Lạc', zone: 'Bình Tân (cũ)', tier: 3 },
  'Phường An Lạc A, Quận Bình Tân': { new: 'Phường An Lạc', zone: 'Bình Tân (cũ)', tier: 3 },
  'Phường Thới Hòa, Quận Bình Tân': { new: 'Phường Thới Hòa', zone: 'Bình Tân (cũ)', tier: 3 },

  // ========== VÙNG TÂN PHÚ CŨ ==========
  'Phường Tây Thạnh, Quận Tân Phú':  { new: 'Phường Tây Thạnh', zone: 'Tân Phú (cũ)', tier: 3 },
  'Phường Tân Sơn Nhì, Quận Tân Phú':{ new: 'Phường Tân Sơn Nhì', zone: 'Tân Phú (cũ)', tier: 3 },
  'Phường Phú Thạnh, Quận Tân Phú':  { new: 'Phường Phú Thạnh', zone: 'Tân Phú (cũ)', tier: 3 },
  'Phường Phú Trung, Quận Tân Phú':  { new: 'Phường Tân Phú', zone: 'Tân Phú (cũ)', tier: 3 },

  // ========== VÙNG GÒ VẤP CŨ ==========
  'Phường 1, Quận Gò Vấp':  { new: 'Phường Hạnh Thông', zone: 'Gò Vấp (cũ)', tier: 3 },
  'Phường 3, Quận Gò Vấp':  { new: 'Phường Hạnh Thông', zone: 'Gò Vấp (cũ)', tier: 3 },
  'Phường 5, Quận Gò Vấp':  { new: 'Phường An Nhơn', zone: 'Gò Vấp (cũ)', tier: 3 },
  'Phường 6, Quận Gò Vấp':  { new: 'Phường An Nhơn', zone: 'Gò Vấp (cũ)', tier: 3 },
  'Phường 10, Quận Gò Vấp': { new: 'Phường Gò Vấp', zone: 'Gò Vấp (cũ)', tier: 3 },
  'Phường 17, Quận Gò Vấp': { new: 'Phường Gò Vấp', zone: 'Gò Vấp (cũ)', tier: 3 },

  // ========== VÙNG QUẬN 8 CŨ ==========
  'Phường 6, Quận 8':     { new: 'Phường Bình Đông', zone: 'Quận 8 (cũ)', tier: 3 },
  'Phường 14, Quận 8':    { new: 'Phường Phú Định', zone: 'Quận 8 (cũ)', tier: 3 },
  'Phường 15, Quận 8':    { new: 'Phường Phú Định', zone: 'Quận 8 (cũ)', tier: 3 },
  'Phường Xóm Củi, Quận 8': { new: 'Phường Phú Định', zone: 'Quận 8 (cũ)', tier: 3 },
};
```

---
## PHẦN 2: PHÂN TIER GIÁ THỊ TRƯỜNG 2026
---

### Bảng giá nhà nước (Nghị quyết 87/2025/NQ-HĐND, từ 1/1/2026)

```
Lưu ý: Giá nhà nước thường bằng 20-40% giá thị trường thực tế.
Dùng để: tính thuế, phí trước bạ, bồi thường — KHÔNG phải giá mua bán.

Khu vực I (TP.HCM cũ):
  Đất ở cao nhất: 687.2 triệu/m² (Đồng Khởi, Nguyễn Huệ, Lê Lợi)
  Đất ở thấp nhất: 2.3 triệu/m²
  Đất TMDV: 573.6 triệu/m²
  Đất sản xuất kinh doanh: 481 triệu/m²

Khu vực II (Bình Dương cũ):
  Đất TMDV cao nhất: 89.6 triệu/m²
  Đất sản xuất kinh doanh: 44.8 triệu/m²

Khu vực III (Bà Rịa-Vũng Tàu cũ):
  Đất sản xuất kinh doanh: ~75 triệu/m²
```

### Giá thị trường thực tế 2026 (dùng cho tier system)

```javascript
// js/price-tier.js — cập nhật theo quý
const PRICE_TIERS_HCM = {
  tier1: {
    name: 'Trung tâm',
    zones: ['Quận 1 (cũ)', 'Quận 3 (cũ)', 'Quận 5 (cũ)'],
    wards: ['Phường Sài Gòn', 'Phường Bến Thành', 'Phường Tân Định',
            'Phường Bàn Cờ', 'Phường Xuân Hòa', 'Phường Nhiêu Lộc'],
    prices: {
      nha_pho_mt: { min: 300, max: 700 },     // triệu/m²
      can_ho_cc:  { min: 80,  max: 200 },      // triệu/m²
      dat_nen:    null,                          // không có đất nền
    },
    rent: {
      can_ho:  { min: 20, max: 80 },           // triệu/tháng
      nha_pho: { min: 30, max: 200 },
    }
  },
  tier2: {
    name: 'Nội thành mở rộng',
    zones: ['Quận 4 (cũ)', 'Quận 7 (cũ)', 'Bình Thạnh (cũ)',
            'Phú Nhuận (cũ)', 'Quận 10 (cũ)'],
    prices: {
      nha_pho_mt: { min: 100, max: 300 },
      can_ho_cc:  { min: 45,  max: 100 },
      dat_nen:    null,
    },
    rent: {
      can_ho:  { min: 10, max: 40 },
      nha_pho: { min: 15, max: 80 },
    }
  },
  tier3: {
    name: 'Vùng trung',
    zones: ['Thủ Đức (cũ)', 'Quận 7 (cũ) - Bình Chánh giáp',
            'Bình Tân (cũ)', 'Tân Phú (cũ)', 'Gò Vấp (cũ)'],
    prices: {
      nha_pho_mt: { min: 50,  max: 120 },
      can_ho_cc:  { min: 30,  max: 65 },
      dat_nen:    { min: 20,  max: 50 },
    },
    rent: {
      can_ho:  { min: 6, max: 20 },
      nha_pho: { min: 8, max: 30 },
    }
  },
  tier4: {
    name: 'Vùng ven',
    zones: ['Bình Chánh', 'Hóc Môn', 'Củ Chi', 'Nhà Bè', 'Cần Giờ'],
    prices: {
      nha_pho_mt: { min: 15, max: 50 },
      dat_nen:    { min: 3,  max: 25 },
      can_ho_cc:  { min: 20, max: 40 },
    },
    rent: {
      nha_pho: { min: 3, max: 12 },
    }
  },
  tier_binh_duong: {
    name: 'Bình Dương (khu vực II mới)',
    zones: ['Dĩ An', 'Thuận An', 'Thủ Dầu Một', 'Bến Cát'],
    prices: {
      can_ho_cc: { min: 25, max: 55 },
      dat_nen:   { min: 10, max: 35 },
    },
    rent: {
      can_ho: { min: 5, max: 15 },
    }
  },
  tier_brvt: {
    name: 'Bà Rịa-Vũng Tàu (khu vực III mới)',
    zones: ['Vũng Tàu', 'Bà Rịa', 'Long Điền'],
    prices: {
      nha_pho_mt: { min: 20, max: 80 },
      dat_nen:    { min: 5,  max: 30 },
    }
  }
};

// Phát hiện giá bất thường — cần admin review
function detectAbnormalPrice(listing) {
  const tier = getTierForListing(listing);
  if (!tier) return false;
  const range = tier.prices[listing.property_type];
  if (!range) return false;
  const pricePerM2 = listing.price / listing.area / 1_000_000; // triệu/m²
  return pricePerM2 < range.min * 0.6 || pricePerM2 > range.max * 2;
}
```

---
## PHẦN 3: VALIDATION SỐ ĐIỆN THOẠI VIỆT NAM
---

```javascript
// Cập nhật 2024 — hỗ trợ đầu số mới
const VN_PHONE_REGEX = /^(0|\+84)(3[2-9]|5[6-9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$/;

function validateVNPhone(phone) {
  const cleaned = phone.replace(/[\s.-]/g, '');
  return VN_PHONE_REGEX.test(cleaned);
}

function formatVNPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('84')) {
    return '+84 ' + cleaned.slice(2,5) + ' ' + cleaned.slice(5,8) + ' ' + cleaned.slice(8);
  }
  return cleaned.slice(0,3) + ' ' + cleaned.slice(3,6) + ' ' + cleaned.slice(6);
}

const CARRIERS = {
  VIETTEL:     ['032','033','034','035','036','037','038','039','086','096','097','098'],
  MOBIFONE:    ['070','079','077','076','078','089','090','093'],
  VINAPHONE:   ['081','082','083','084','085','088','091','094'],
  VIETNAMOBILE:['052','056','058','092'],
  GMOBILE:     ['059','099'],
};
```

---
## PHẦN 4: FORMAT GIÁ VND
---

```javascript
// Ưu tiên đơn vị tỷ/triệu — chuẩn thị trường HCM
function formatBDSPrice(amountVND, short = false) {
  if (amountVND >= 1_000_000_000) {
    const ty = amountVND / 1_000_000_000;
    const rounded = ty % 1 === 0 ? ty : parseFloat(ty.toFixed(2));
    return short ? `${rounded}tỷ` : `${rounded} tỷ đồng`;
  }
  if (amountVND >= 1_000_000) {
    const trieu = amountVND / 1_000_000;
    const rounded = parseFloat(trieu.toFixed(0));
    return short ? `${rounded}tr` : `${rounded} triệu đồng`;
  }
  return amountVND.toLocaleString('vi-VN') + ' đồng';
}

function formatRentPrice(amountVND) {
  const trieu = amountVND / 1_000_000;
  return `${parseFloat(trieu.toFixed(1))} triệu/tháng`;
}

function formatPricePerM2(totalVND, areaM2) {
  const perM2 = totalVND / areaM2;
  if (perM2 >= 1_000_000) {
    return `${(perM2/1_000_000).toFixed(1)} triệu/m²`;
  }
  return `${Math.round(perM2).toLocaleString('vi-VN')} đ/m²`;
}
```

---
## PHẦN 5: THUẬT NGỮ BĐS VIỆT NAM
---

```
PHÁP LÝ:
  Sổ đỏ (GCNQSDĐ): Giấy chứng nhận quyền sử dụng đất
  Sổ hồng: GCNQSDĐ mới (bìa hồng) — đất + tài sản gắn liền
  HĐMB: Hợp đồng mua bán chưa có sổ
  Giấy tờ tay: không qua công chứng — RỦI RO CAO
  Quy hoạch treo: đất nằm trong vùng quy hoạch chưa triển khai
  Pháp lý sạch: có sổ đỏ/hồng, không tranh chấp, không thế chấp
  Mã định danh BĐS: từ 1/3/2026, mỗi BĐS có mã số riêng (Nghị định 357/2025)

LOẠI BĐS HCM PHỔ BIẾN:
  Căn hộ chung cư, Nhà phố, Đất nền, Biệt thự
  Officetel, Shophouse, Nhà trọ, Condotel

THÔNG SỐ NHÀ:
  Mặt tiền (MT): chiều rộng mặt đường
  Diện tích thông thủy: sử dụng thực tế (không tính tường)
  Hướng nhà: hướng cửa chính hoặc ban công

ĐƯỜNG TRƯỚC NHÀ (quan trọng cho giá HCM):
  hem_nho:  < 3m — xe máy đi được, ô tô không vào
  hem_vua:  3-5m — ô tô 1 làn đi được
  noi_khu:  5-10m — đường nội khu, ô tô 2 làn
  pho_lon:  > 10m — phố lớn, mặt tiền chính

HƯỚNG NHÀ (phong thủy VN — người mua rất quan tâm):
  Tốt: Nam, Đông Nam, Đông (thoáng, ánh sáng nhiều)
  Kém hơn: Tây (nắng chiều), Bắc (ít sáng)
```

---
## PHẦN 6: TIỆN ÍCH ƯA CHUỘNG TẠI HCM
---

```
TOP TIỆN ÍCH THEO KHẢO SÁT NGƯỜI MUA HCM:
1. Không bị ngập úng (vấn đề đặc thù HCM — hỏi bắt buộc khi đăng tin)
2. Gần trường quốc tế hoặc trường tốt
3. Gần bệnh viện lớn (Chợ Rẫy, Bạch Mai, Vinmec)
4. Gần TTTM/siêu thị (Vincom, Aeon, Lotte)
5. Commute time đến chỗ làm < 30 phút xe máy
6. Có hầm xe hoặc bãi xe rộng (vấn đề lớn ở HCM)
7. Khu dân cư an ninh (có bảo vệ, camera)
8. Gần công viên / mảng xanh
9. Không gần nghĩa địa, bệnh viện tâm thần (phong thủy)
10. Ngõ thông (không bị bí)

TIỆN ÍCH ĐẶC BIỆT CHO EXPAT (Quận 2, 7, Bình Thạnh cũ):
  → Gần trường quốc tế (RMIT, BIS, ISHCMC)
  → Gần siêu thị nước ngoài (Annam, Citimart)
  → Có hồ bơi, gym trong tòa nhà
  → Dịch vụ quản lý chuyên nghiệp (tiếng Anh)

CỘNG ĐỒNG NGƯỜI NƯỚC NGOÀI TẠI HCM:
  Hàn Quốc: Phú Mỹ Hưng (Q7 cũ), Bình Chánh, Tân Phú
  Nhật Bản: Thảo Điền (Thủ Đức cũ), Phú Nhuận
  Trung Quốc: Chợ Lớn (Q5, Q6, Q11 cũ)
  Phương Tây: Thảo Điền, Bình Thạnh cũ, Trung tâm
```

---
## PHẦN 7: SLUG GENERATION TIẾNG VIỆT
---

```javascript
const VIET_MAP = {
  'à':'a','á':'a','ả':'a','ã':'a','ạ':'a',
  'ă':'a','ắ':'a','ặ':'a','ằ':'a','ẵ':'a','ẳ':'a',
  'â':'a','ấ':'a','ậ':'a','ầ':'a','ẫ':'a','ẩ':'a',
  'đ':'d',
  'è':'e','é':'e','ẻ':'e','ẽ':'e','ẹ':'e',
  'ê':'e','ế':'e','ệ':'e','ề':'e','ễ':'e','ể':'e',
  'ì':'i','í':'i','ỉ':'i','ĩ':'i','ị':'i',
  'ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o',
  'ô':'o','ố':'o','ộ':'o','ồ':'o','ổ':'o','ỗ':'o',
  'ơ':'o','ớ':'o','ợ':'o','ờ':'o','ở':'o','ỡ':'o',
  'ù':'u','ú':'u','ủ':'u','ũ':'u','ụ':'u',
  'ư':'u','ứ':'u','ự':'u','ừ':'u','ử':'u','ữ':'u',
  'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y'
};

function toSlug(text) {
  return text.toLowerCase()
    .replace(/./g, c => VIET_MAP[c] || c)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Slug listing: "Bán căn hộ 2PN Sài Gòn 4.5 tỷ" → "ban-can-ho-2pn-sai-gon-4-5-ty-abc123"
function toListingSlug(listing) {
  const parts = [
    listing.purpose === 'ban' ? 'ban' : 'thue',
    listing.property_type.replace('_','-'),
    listing.address_ward_new || listing.address_district_old,
    formatBDSPrice(listing.price, true)
  ];
  return toSlug(parts.join(' ')) + '-' + listing.id.slice(0,6);
}
```

---
## PHẦN 8: PHÁP LÝ NGƯỜI NƯỚC NGOÀI MUA BĐS VN (2026)
---

```
THEO LUẬT NHÀ Ở 2023 + LUẬT ĐẤT ĐAI 2024:

NGƯỜI NƯỚC NGOÀI (cá nhân):
  ✅ Được mua: Nhà ở thương mại từ dự án đầu tư xây dựng
  ❌ Không được: Mua đất (đất thuộc sở hữu toàn dân)
  ⏰ Thời hạn: Tối đa 50 năm (có thể gia hạn)
  📋 Điều kiện: Có hộ chiếu + dấu nhập cảnh còn hiệu lực

VIỆT KIỀU (công dân VN định cư nước ngoài):
  ✅ Được: Đầy đủ quyền như công dân trong nước (từ 1/8/2024)
  ✅ Được: Mua đất, nhận thừa kế, giao dịch trực tiếp
  ❌ Không cần: Nhờ người thân trong nước đứng tên nữa

MÃ ĐỊNH DANH BĐS (từ 1/3/2026):
  → Mỗi BĐS có mã số riêng theo Nghị định 357/2025
  → Platform nên thêm trường: listing.bds_id_code TEXT
  → Đây là lợi thế pháp lý nếu anh integrate sớm

PLATFORM NÊN LÀM:
  → Thêm filter "Phù hợp cho người nước ngoài" (chỉ show nhà thương mại)
  → Hiển thị rõ: "Người nước ngoài có thể mua loại nhà này"
  → Trang FAQ riêng cho expat/Việt kiều bằng tiếng Anh/Hàn/Trung
```

---
## PHẦN 9: EMAIL & THÔNG BÁO TIẾNG VIỆT
---

```
SUBJECT LINE:
  Lead mới:  "[BDS HCM] Lead mới: {name} quan tâm {listing_title}"
  Match:     "[BDS HCM] 🎉 Match thành công! Lịch xem nhà {date}"
  QR:        "[BDS HCM] QR code xem nhà {address} - {date}"
  Giảm giá:  "[BDS HCM] 📉 Nhà bạn đã xem vừa giảm {amount}"
  Offer:     "[BDS HCM] 💬 Có người đề xuất giá cho nhà của bạn"

GREETING:
  Khách:    "Kính chào Anh/Chị {name},"
  Chủ nhà:  "Kính chào Chủ nhà {name},"
  Môi giới: "Kính chào {name},"
  Admin:    "Thông báo hệ thống:"

CTA BUTTONS:
  "Xem chi tiết →"
  "Xác nhận lịch →"
  "Tải QR code →"
  "Xem đề xuất giá →"
  "Đặt lịch xem nhà →"

PLATFORM IDENTITY trong tin nhắn:
  "BDS Platform HCM là bên điều phối trung lập,
   đảm bảo quyền lợi của cả hai bên trong giao dịch.
   Mọi thắc mắc: [contact]"
```

---
*Nguồn: Nghị quyết 87/2025/NQ-HĐND (1/1/2026) | Nghị quyết 1685/NQ-UBTVQH15 (1/7/2025)*
*Cập nhật giá thị trường: Hàng quý | Cập nhật mapping phường: Khi có thay đổi pháp lý*
