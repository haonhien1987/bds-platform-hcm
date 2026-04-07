/**
 * js/i18n.js
 * BDS Platform HCM — Hệ thống đa ngôn ngữ
 *
 * Làm ngay Sprint 1 dù chưa cần — chi phí thêm i18n từ đầu: 2 giờ.
 * Thêm vào sau khi đã có 1000 dòng HTML: 2 tuần + đau đầu.
 *
 * Cách dùng: window.i18n('btn.contact') → "Liên hệ chủ nhà"
 * Thêm ngôn ngữ: copy block 'vi', dịch sang ngôn ngữ mới
 */

'use strict';

const STRINGS = {

  /* ─── TIẾNG VIỆT (ngôn ngữ chính) ─────────────────────────── */
  vi: {

    // Navigation
    'nav.home':       'Trang chủ',
    'nav.listings':   'Tìm nhà',
    'nav.post':       'Đăng tin',
    'nav.saved':      'Đã lưu',
    'nav.login':      'Đăng nhập',
    'nav.register':   'Đăng ký',
    'nav.logout':     'Đăng xuất',
    'nav.dashboard':  'Quản lý',
    'nav.profile':    'Hồ sơ',

    // Auth
    'auth.login.title':          'Đăng nhập',
    'auth.login.subtitle':       'Chào mừng trở lại',
    'auth.register.title':       'Tạo tài khoản',
    'auth.register.subtitle':    'Bắt đầu tìm nhà hoặc đăng tin ngay',
    'auth.email':                'Email',
    'auth.email.placeholder':    'email@example.com',
    'auth.phone':                'Số điện thoại',
    'auth.phone.placeholder':    '0901234567',
    'auth.password':             'Mật khẩu',
    'auth.password.placeholder': 'Tối thiểu 8 ký tự',
    'auth.password.confirm':     'Xác nhận mật khẩu',
    'auth.full_name':            'Họ và tên',
    'auth.full_name.placeholder':'Nguyễn Văn A',
    'auth.btn.login':            'Đăng nhập',
    'auth.btn.register':         'Tạo tài khoản',
    'auth.btn.google':           'Tiếp tục với Google',
    'auth.forgot_password':      'Quên mật khẩu?',
    'auth.have_account':         'Đã có tài khoản?',
    'auth.no_account':           'Chưa có tài khoản?',
    'auth.terms':                'Bằng cách đăng ký, bạn đồng ý với',
    'auth.terms.link':           'Điều khoản sử dụng',
    'auth.and':                  'và',
    'auth.privacy.link':         'Chính sách bảo mật',
    'auth.verify.title':         'Xác nhận email',
    'auth.verify.desc':          'Chúng tôi đã gửi email xác nhận đến',
    'auth.verify.check':         'Kiểm tra hộp thư và nhấn vào link xác nhận',
    'auth.reset.title':          'Đặt lại mật khẩu',
    'auth.reset.desc':           'Nhập email để nhận link đặt lại mật khẩu',
    'auth.reset.btn':            'Gửi link đặt lại',
    'auth.reset.back':           'Quay lại đăng nhập',
    'auth.or':                   'hoặc',
    'auth.role.member':          'Người tìm nhà',
    'auth.role.owner':           'Chủ nhà / Muốn bán',
    'auth.role.label':           'Bạn là',

    // Listing
    'listing.price':             'Giá',
    'listing.area':              'Diện tích',
    'listing.bedrooms':          'Phòng ngủ',
    'listing.bathrooms':         'Phòng tắm',
    'listing.floors':            'Số tầng',
    'listing.direction':         'Hướng nhà',
    'listing.legal':             'Pháp lý',
    'listing.road_width':        'Đường trước nhà',
    'listing.year_built':        'Năm xây',
    'listing.purpose.ban':       'Bán',
    'listing.purpose.thue':      'Cho thuê',

    // Property types
    'type.can_ho':    'Căn hộ chung cư',
    'type.nha_pho':   'Nhà phố',
    'type.dat_nen':   'Đất nền',
    'type.biet_thu':  'Biệt thự',
    'type.officetel': 'Officetel',
    'type.shophouse': 'Shophouse',
    'type.nha_tro':   'Nhà trọ',
    'type.condotel':  'Condotel',

    // Road width
    'road.hem_nho': 'Hẻm nhỏ (< 3m)',
    'road.hem_vua': 'Hẻm vừa (3-5m)',
    'road.noi_khu': 'Đường nội khu',
    'road.pho_lon': 'Phố lớn (> 10m)',

    // Legal status
    'legal.so_do':   'Sổ đỏ',
    'legal.so_hong': 'Sổ hồng',
    'legal.hop_dong':'Hợp đồng',
    'legal.dang_lam':'Đang làm sổ',
    'legal.chua_co': 'Chưa có sổ',

    // Actions
    'btn.contact':    'Liên hệ chủ nhà',
    'btn.save':       'Lưu',
    'btn.saved':      'Đã lưu',
    'btn.unsave':     'Bỏ lưu',
    'btn.schedule':   'Đặt lịch xem nhà',
    'btn.negotiate':  'Đề xuất giá',
    'btn.match':      'Yêu cầu Match',
    'btn.share':      'Chia sẻ',
    'btn.compare':    'So sánh',
    'btn.view_more':  'Xem thêm',
    'btn.load_more':  'Tải thêm',
    'btn.back':       'Quay lại',
    'btn.confirm':    'Xác nhận',
    'btn.cancel':     'Hủy',
    'btn.close':      'Đóng',
    'btn.submit':     'Gửi',
    'btn.edit':       'Chỉnh sửa',
    'btn.delete':     'Xóa',
    'btn.post':       'Đăng tin',

    // Labels
    'label.new':         '🟢 Mới đăng',
    'label.price_drop':  '📉 Vừa giảm giá',
    'label.hot':         '🔥 Xem nhiều',
    'label.negotiating': '🤝 Đang giao dịch',
    'label.good_deal':   '👑 Nhà ngon',
    'label.flexible':    '💬 Thương lượng',
    'label.verified':    '✅ Đã xác minh',
    'label.unverified':  '⏳ Chưa xác minh',
    'label.pending':     '🟡 Chờ xác minh',
    'label.reported':    '🔴 Đã báo cáo',

    // Trust levels
    'trust.1': 'Mới đăng ký',
    'trust.2': 'Đã xác minh SĐT',
    'trust.3': 'Chủ nhà xác minh',
    'trust.4': 'Đã giao dịch',

    // Address
    'address.ward_new':       'Phường (mới)',
    'address.ward_old':       'Trước 7/2025',
    'address.district_old':   'Khu vực',
    'address.street':         'Đường',
    'address.full':           'Địa chỉ đầy đủ',
    'address.reveal_after':   'Xem sau khi đặt lịch',
    'address.near':           'gần số',

    // Directions
    'direction.bac':     'Bắc',
    'direction.nam':     'Nam',
    'direction.dong':    'Đông',
    'direction.tay':     'Tây',
    'direction.dong_bac':'Đông Bắc',
    'direction.tay_bac': 'Tây Bắc',
    'direction.dong_nam':'Đông Nam',
    'direction.tay_nam': 'Tây Nam',

    // Filter
    'filter.title':       'Bộ lọc',
    'filter.purpose':     'Mục đích',
    'filter.type':        'Loại bất động sản',
    'filter.price':       'Mức giá',
    'filter.area':        'Diện tích',
    'filter.bedrooms':    'Số phòng ngủ',
    'filter.district':    'Khu vực',
    'filter.legal':       'Pháp lý',
    'filter.clear':       'Xóa bộ lọc',
    'filter.apply':       'Áp dụng',
    'filter.results':     'kết quả',
    'filter.sort':        'Sắp xếp',
    'filter.sort.newest': 'Mới nhất',
    'filter.sort.price_asc': 'Giá tăng dần',
    'filter.sort.price_desc': 'Giá giảm dần',
    'filter.sort.area_desc': 'Diện tích lớn nhất',

    // Calculator
    'calc.roi.title':      'Tính ROI đầu tư',
    'calc.roi.purchase':   'Giá mua',
    'calc.roi.monthly_rent': 'Tiền thuê/tháng',
    'calc.roi.expenses':   'Chi phí hàng năm',
    'calc.roi.yield':      'Lợi suất/năm',
    'calc.roi.payback':    'Hoàn vốn sau',
    'calc.roi.years':      'năm',
    'calc.roi.good':       'Tốt (>5%)',
    'calc.roi.fair':       'Ổn (3-5%)',
    'calc.roi.low':        'Thấp (<3%)',
    'calc.loan.title':     'Tính vay ngân hàng',
    'calc.loan.price':     'Giá nhà',
    'calc.loan.down_pct':  'Vốn tự có (%)',
    'calc.loan.years':     'Thời hạn vay (năm)',
    'calc.loan.monthly':   'Trả góp hàng tháng',
    'calc.loan.total':     'Tổng tiền trả',
    'calc.loan.interest':  'Tổng lãi phải trả',
    'calc.loan.note':      '* Lãi suất tham khảo 9%/năm (2026)',

    // Errors
    'error.generic':      'Có lỗi xảy ra. Vui lòng thử lại.',
    'error.auth':         'Bạn chưa đăng nhập.',
    'error.not_found':    'Không tìm thấy dữ liệu.',
    'error.permission':   'Bạn không có quyền thực hiện.',
    'error.rate_limit':   'Bạn thao tác quá nhanh. Vui lòng thử lại sau.',
    'error.network':      'Mất kết nối. Kiểm tra internet và thử lại.',
    'error.upload':       'Tải ảnh thất bại. Vui lòng thử lại.',
    'error.phone_invalid':'Số điện thoại không hợp lệ.',
    'error.email_invalid':'Email không hợp lệ.',
    'error.required':     'Vui lòng điền đầy đủ thông tin.',
    'error.password_short':'Mật khẩu tối thiểu 8 ký tự.',
    'error.password_mismatch': 'Mật khẩu xác nhận không khớp.',
    'error.email_exists': 'Email này đã được đăng ký.',
    'error.wrong_password': 'Email hoặc mật khẩu không đúng.',

    // Success
    'success.login':      'Đăng nhập thành công!',
    'success.register':   'Tạo tài khoản thành công! Kiểm tra email xác nhận.',
    'success.logout':     'Đã đăng xuất.',
    'success.saved':      'Đã lưu vào danh sách yêu thích.',
    'success.unsaved':    'Đã xóa khỏi danh sách yêu thích.',
    'success.posted':     'Đăng tin thành công! Đang chờ duyệt.',
    'success.updated':    'Cập nhật thành công.',
    'success.submitted':  'Gửi thành công!',
    'success.reset_sent': 'Email đặt lại mật khẩu đã được gửi.',
    'success.copied':     'Đã sao chép!',

    // Units
    'unit.m2':     'm²',
    'unit.billion':'tỷ',
    'unit.million':'triệu',
    'unit.month':  '/tháng',
    'unit.year':   '/năm',
    'unit.room':   'phòng',

    // Time
    'time.just_now':    'Vừa xong',
    'time.minutes_ago': 'phút trước',
    'time.hours_ago':   'giờ trước',
    'time.yesterday':   'Hôm qua',
    'time.days_ago':    'ngày trước',
    'time.weeks_ago':   'tuần trước',
    'time.months_ago':  'tháng trước',

    // Misc
    'misc.loading':      'Đang tải...',
    'misc.no_results':   'Không tìm thấy kết quả phù hợp.',
    'misc.try_adjust':   'Thử điều chỉnh bộ lọc để xem thêm.',
    'misc.contact_via':  'Liên hệ qua platform',
    'misc.or':           'hoặc',
    'misc.and':          'và',
    'misc.see_all':      'Xem tất cả',
    'misc.new':          'Mới',
    'misc.verify_phone': 'Xác minh số điện thoại',
    'misc.optional':     '(tùy chọn)',
  },

  /* ─── TIẾNG ANH (thêm dần từ Sprint 3) ───────────────────── */
  en: {
    'nav.home':       'Home',
    'nav.listings':   'Find Property',
    'nav.post':       'Post Listing',
    'nav.saved':      'Saved',
    'nav.login':      'Login',
    'nav.register':   'Sign Up',
    'nav.logout':     'Sign Out',

    'auth.login.title':    'Sign In',
    'auth.register.title': 'Create Account',
    'auth.email':          'Email',
    'auth.password':       'Password',
    'auth.btn.login':      'Sign In',
    'auth.btn.register':   'Create Account',
    'auth.or':             'or',

    'listing.price':    'Price',
    'listing.area':     'Area',
    'listing.bedrooms': 'Bedrooms',
    'listing.bathrooms':'Bathrooms',

    'btn.contact':   'Contact Owner',
    'btn.save':      'Save',
    'btn.saved':     'Saved',
    'btn.schedule':  'Schedule Viewing',
    'btn.negotiate': 'Make Offer',

    'error.generic': 'Something went wrong. Please try again.',
    'error.auth':    'Please sign in to continue.',

    'misc.loading':   'Loading...',
    'misc.no_results':'No results found.',
  },

  /* ─── TIẾNG TRUNG (Sprint 5+) ─────────────────────────────── */
  zh: {},

  /* ─── TIẾNG HÀN (Sprint 5+) ───────────────────────────────── */
  ko: {},
};

/**
 * Lấy string theo ngôn ngữ hiện tại
 * Fallback: ngôn ngữ hiện tại → tiếng Việt → key gốc
 *
 * @param {string} key - VD: 'btn.contact'
 * @param {Object} vars - Thay thế biến: {name: 'Ari'} trong "Xin chào {name}"
 * @returns {string}
 */
window.i18n = function(key, vars = {}) {
  const lang = window.BDS_CONFIG?.CURRENT_LANG || 'vi';

  // Lấy string, fallback về tiếng Việt nếu ngôn ngữ hiện tại chưa có
  let str = STRINGS[lang]?.[key] || STRINGS['vi']?.[key] || key;

  // Thay thế biến: i18n('hello', {name: 'Ari'}) trong "Xin chào {name}"
  if (vars && typeof vars === 'object') {
    str = str.replace(/\{(\w+)\}/g, (match, varName) => {
      return vars[varName] !== undefined ? vars[varName] : match;
    });
  }

  return str;
};

/**
 * Thay đổi ngôn ngữ toàn platform
 * @param {'vi'|'en'|'zh'|'ko'} lang
 */
window.setLang = function(lang) {
  if (!STRINGS[lang]) {
    console.warn(`[i18n] Ngôn ngữ '${lang}' chưa được hỗ trợ.`);
    return;
  }

  // Cập nhật config
  if (window.BDS_CONFIG) {
    // BDS_CONFIG dùng Object.freeze nên cần workaround
    Object.defineProperty(window.BDS_CONFIG, 'CURRENT_LANG', {
      value: lang,
      writable: true,
      configurable: true,
    });
  }

  // Cập nhật lang attribute trên HTML
  document.documentElement.lang = lang;

  // Lưu preference
  localStorage.setItem('bds_lang', lang);

  // Thông báo cho các module biết để re-render
  window.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang } }));

  if (window.BDS_CONFIG?.IS_DEV) {
    console.log(`[i18n] Đã chuyển sang: ${lang}`);
  }
};

// Tự load ngôn ngữ đã lưu từ lần trước
(function() {
  const savedLang = localStorage.getItem('bds_lang');
  if (savedLang && STRINGS[savedLang]) {
    document.documentElement.lang = savedLang;
    // Không gọi setLang() ở đây vì BDS_CONFIG chưa chắc đã load
    // supabase.js sẽ dispatch auth:ready sau, lúc đó các module mới render
  }
})();

if (window.BDS_CONFIG?.IS_DEV) {
  console.log('[i18n] ✅ Đã load. Ngôn ngữ hiện tại:', window.BDS_CONFIG?.CURRENT_LANG || 'vi');
}
