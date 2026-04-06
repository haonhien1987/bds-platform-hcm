/**
 * js/utils.js
 * BDS Platform HCM — Utility functions dùng chung toàn platform
 *
 * Quy tắc: File này chỉ chứa pure functions — không có side effects,
 * không gọi Supabase, không dispatch event.
 * Mọi function đều có thể test độc lập.
 */

'use strict';

// ─── FORMAT GIÁ VND ──────────────────────────────────────────
// Chuẩn thị trường HCM: ưu tiên đơn vị tỷ/triệu

/**
 * Format số VND thành dạng đọc được
 * @param {number} amountVND - Số tiền tính bằng VND
 * @param {boolean} short - true = "4.5tỷ", false = "4.5 tỷ đồng"
 * @returns {string}
 *
 * Ví dụ: formatBDSPrice(4500000000) → "4.5 tỷ đồng"
 *        formatBDSPrice(500000000, true) → "500tr"
 */
window.formatBDSPrice = function(amountVND, short = false) {
  if (!amountVND || isNaN(amountVND)) return '—';

  if (amountVND >= 1_000_000_000) {
    const ty = amountVND / 1_000_000_000;
    // Giữ tối đa 2 chữ số thập phân, bỏ số 0 thừa
    const rounded = parseFloat(ty.toFixed(2));
    return short ? `${rounded}tỷ` : `${rounded} tỷ đồng`;
  }

  if (amountVND >= 1_000_000) {
    const trieu = amountVND / 1_000_000;
    const rounded = parseFloat(trieu.toFixed(0));
    return short ? `${rounded}tr` : `${rounded} triệu đồng`;
  }

  // Dưới 1 triệu — hiếm gặp trong BĐS HCM
  return amountVND.toLocaleString('vi-VN') + ' đồng';
};

/**
 * Format giá cho thuê (luôn theo tháng)
 * Ví dụ: formatRentPrice(15000000) → "15 triệu/tháng"
 */
window.formatRentPrice = function(amountVND) {
  if (!amountVND) return '—';
  const trieu = amountVND / 1_000_000;
  return `${parseFloat(trieu.toFixed(1))} triệu/tháng`;
};

/**
 * Tính và format giá trên mỗi m²
 * Ví dụ: formatPricePerM2(4500000000, 90) → "50 triệu/m²"
 */
window.formatPricePerM2 = function(totalVND, areaM2) {
  if (!totalVND || !areaM2 || areaM2 <= 0) return '';
  const perM2 = totalVND / areaM2;
  if (perM2 >= 1_000_000) {
    return `${(perM2 / 1_000_000).toFixed(1)} triệu/m²`;
  }
  return `${Math.round(perM2).toLocaleString('vi-VN')} đ/m²`;
};

// ─── FORMAT THỜI GIAN ─────────────────────────────────────────

/**
 * Chuyển ISO date thành dạng "X ngày trước", "Hôm nay", v.v.
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string}
 */
window.formatRelativeTime = function(isoDate) {
  if (!isoDate) return '';

  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;

  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Format ngày tháng Việt Nam
 * Ví dụ: formatDate('2026-04-06') → "06/04/2026"
 */
window.formatDate = function(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

// ─── VALIDATE SĐT VIỆT NAM ────────────────────────────────────
// Hỗ trợ đầu số mới nhất 2024-2026

const VN_PHONE_REGEX = /^(0|\+84)(3[2-9]|5[6-9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$/;

/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ
 * @param {string} phone
 * @returns {boolean}
 */
window.validateVNPhone = function(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s.\-()]/g, '');
  return VN_PHONE_REGEX.test(cleaned);
};

/**
 * Format SĐT thành dạng đẹp: 090 123 4567
 */
window.formatVNPhone = function(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.startsWith('84') && cleaned.length === 11) {
    return `+84 ${cleaned.slice(2,4)} ${cleaned.slice(4,7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Che giấu SĐT để hiển thị an toàn: 0901***567
 * Dùng khi cần hint mà không expose full số
 */
window.maskPhone = function(phone) {
  if (!phone || phone.length < 7) return '***';
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.slice(0, 4) + '***' + cleaned.slice(-3);
};

// ─── SLUG GENERATION ─────────────────────────────────────────

// Bảng chuyển ký tự có dấu → không dấu
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
  'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y',
};

/**
 * Chuyển text thành slug URL-safe
 * Ví dụ: "Bán căn hộ Quận 3" → "ban-can-ho-quan-3"
 */
window.toSlug = function(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/./g, c => VIET_MAP[c] || c)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Tạo slug cho listing (có ID ở cuối để tránh trùng)
 * Pattern: "ban-can-ho-2pn-sai-gon-4-5-ty-abc123"
 */
window.toListingSlug = function(listing) {
  if (!listing) return '';
  const parts = [
    listing.purpose === 'ban' ? 'ban' : 'thue',
    listing.property_type?.replace('_', '-') || '',
    listing.bedrooms ? `${listing.bedrooms}pn` : '',
    listing.address_ward_new || listing.address_district_old || '',
    window.formatBDSPrice(listing.price, true),
  ].filter(Boolean);

  const base = window.toSlug(parts.join(' '));
  const shortId = listing.id ? listing.id.slice(0, 6) : '';
  return `${base}-${shortId}`;
};

// ─── FORM VALIDATION ─────────────────────────────────────────

/**
 * Bộ validators — dùng với validateForm()
 */
window.Validators = {
  required: (value) => ({
    valid: value !== null && value !== undefined && String(value).trim() !== '',
    message: 'Trường này không được để trống',
  }),

  phone: (value) => ({
    valid: window.validateVNPhone(value),
    message: 'Số điện thoại không hợp lệ (VD: 0901234567)',
  }),

  email: (value) => ({
    valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || ''),
    message: 'Email không hợp lệ',
  }),

  minLength: (min) => (value) => ({
    valid: String(value || '').trim().length >= min,
    message: `Tối thiểu ${min} ký tự`,
  }),

  maxLength: (max) => (value) => ({
    valid: String(value || '').trim().length <= max,
    message: `Tối đa ${max} ký tự`,
  }),

  // Chặn SĐT trong mô tả — bảo vệ platform khỏi bị bypass
  noPhone: (value) => ({
    valid: !/0[3-9]\d{8}|\+84[3-9]\d{8}/.test(value || ''),
    message: 'Không được chứa số điện thoại trong nội dung',
  }),

  price: (value) => ({
    valid: !isNaN(value) && Number(value) > 0 && Number(value) <= 1_000_000_000_000,
    message: 'Giá không hợp lệ (tối đa 1,000 tỷ)',
  }),

  positiveNumber: (value) => ({
    valid: !isNaN(value) && Number(value) > 0,
    message: 'Vui lòng nhập số dương',
  }),

  buildYear: (value) => {
    const year = Number(value);
    const currentYear = new Date().getFullYear();
    return {
      valid: !value || (year >= 1950 && year <= currentYear),
      message: `Năm xây phải từ 1950 đến ${currentYear}`,
    };
  },
};

/**
 * Validate form với bộ rules
 * @param {Object} formData - { fieldName: value }
 * @param {Object} rules - { fieldName: [validator1, validator2] }
 * @returns {{ valid: boolean, errors: Object }}
 *
 * Ví dụ:
 * const { valid, errors } = validateForm(formData, {
 *   phone: [Validators.required, Validators.phone],
 *   price: [Validators.required, Validators.price],
 * });
 */
window.validateForm = function(formData, rules) {
  const errors = {};
  let valid = true;

  for (const [field, validators] of Object.entries(rules)) {
    const value = formData[field];
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        errors[field] = result.message;
        valid = false;
        break; // Chỉ hiện 1 lỗi/field tại một thời điểm
      }
    }
  }

  return { valid, errors };
};

/**
 * Hiện lỗi lên form — chỉ dùng CSS class, KHÔNG dùng inline style
 */
window.showFormErrors = function(errors) {
  // Xóa lỗi cũ
  document.querySelectorAll('.field-error').forEach(el => el.remove());
  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
  });

  // Hiện lỗi mới
  for (const [field, message] of Object.entries(errors)) {
    const input = document.querySelector(`[name="${field}"], #${field}`);
    if (!input) continue;

    input.classList.add('input-error');

    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');  // Accessibility
    input.parentNode.insertBefore(errorEl, input.nextSibling);
  }

  // Focus vào field lỗi đầu tiên
  const firstError = document.querySelector('.input-error');
  if (firstError) firstError.focus();
};

window.clearFormErrors = function() {
  document.querySelectorAll('.field-error').forEach(el => el.remove());
  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
  });
};

// ─── ERROR HANDLING ───────────────────────────────────────────

// Map mã lỗi Supabase/PostgreSQL → tiếng Việt
const ERROR_MESSAGES = {
  'PGRST116': 'Không tìm thấy dữ liệu',
  'PGRST301': 'Bạn không có quyền truy cập',
  '23505':    'Dữ liệu đã tồn tại trong hệ thống',
  '23503':    'Dữ liệu liên quan không tồn tại',
  '42501':    'Không có quyền thực hiện thao tác này',
  '429':      'Thao tác quá nhanh. Vui lòng thử lại sau.',
  'default':  'Có lỗi xảy ra. Vui lòng thử lại.',
};

/**
 * Chuyển mã lỗi thành thông báo tiếng Việt
 */
window.getErrorMessage = function(code) {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES['default'];
};

// ─── DEBOUNCE ─────────────────────────────────────────────────

/**
 * Delay function call — dùng cho search/filter input
 * Dùng setTimeout thay vì library để không cần thêm dependency
 *
 * Ví dụ: const debouncedSearch = debounce(doSearch, 300);
 *        searchInput.addEventListener('input', debouncedSearch);
 */
window.debounce = function(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

// ─── MISCELLANEOUS ────────────────────────────────────────────

/**
 * Lấy query param từ URL hiện tại
 * Ví dụ: getParam('slug') → "ban-can-ho-quan-3-abc123"
 */
window.getParam = function(name) {
  return new URLSearchParams(window.location.search).get(name);
};

/**
 * Scroll mượt lên đầu trang
 */
window.scrollToTop = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Truncate text an toàn (không cắt giữa từ)
 */
window.truncate = function(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

if (window.BDS_CONFIG?.IS_DEV) {
  console.log('[Utils] ✅ Utilities đã sẵn sàng.');
}
