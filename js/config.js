/**
 * js/config.js
 * BDS Platform HCM — Cấu hình toàn cục
 *
 * QUAN TRỌNG: File này chỉ chứa public keys — an toàn để commit lên Git.
 * Secret keys (CLAUDE_API_KEY, SENDGRID_KEY, v.v.) → chỉ trong Supabase env.
 * Không bao giờ để API key nhạy cảm ở đây.
 */

window.BDS_CONFIG = Object.freeze({

  // ─── SUPABASE ─────────────────────────────────────────────
  // Lấy từ: Supabase Dashboard → Settings → API
  SUPABASE_URL:      'https://xjlcgokmrmmmzcdfcykt.supabase.co',   // TODO: điền vào
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbGNnb2ttcm1tbXpjZGZjeWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTY4NTIsImV4cCI6MjA5MTA3Mjg1Mn0.RPPJMLbFj93SH4UhH-1yBK9I8WyiQtSHy0RPsMUZ5Rw',                         // TODO: điền vào
  // ⚠️ Anon key an toàn để public — RLS bảo vệ data phía DB

  // ─── GOOGLE APIs (public key, hạn chế domain trong GCP Console) ──
  GOOGLE_MAPS_KEY:   'YOUR_GOOGLE_MAPS_KEY',      // TODO: điền vào
  GOOGLE_PLACES_KEY: 'YOUR_GOOGLE_PLACES_KEY',    // TODO: điền vào

  // ─── ANALYTICS ───────────────────────────────────────────
  GA_ID:             'G-XXXXXXXXXX',               // TODO: điền vào
  SENTRY_DSN:        '',                           // TODO: điền vào (Sprint 1)

  // ─── APP SETTINGS ────────────────────────────────────────
  CURRENT_CITY: 'hcm',          // Multi-city: 'hcm' | 'hn' | 'dn' | 'ct'
  CURRENT_LANG: 'vi',           // i18n: 'vi' | 'en' | 'zh' | 'ko'
  APP_NAME:     'BDS Platform HCM',
  APP_URL:      'https://yourdomain.vn',           // TODO: điền domain thật

  // ─── BUSINESS RULES ──────────────────────────────────────
  // Giữ các con số kinh doanh ở đây để dễ thay đổi sau này
  LISTING_EXPIRES_DAYS:         90,     // Listing tự expire sau 90 ngày
  LISTING_NEW_HOURS:            72,     // Label "Mới đăng" trong 72h đầu
  LABEL_HOT_PERCENTILE:         10,     // Top 10% view count = "Xem nhiều"
  PRICE_DROP_MIN_PCT:            2,     // Giảm >= 2% mới hiện label "Đang giảm"
  NEGOTIATION_MAX_ROUNDS:        3,     // Tối đa 3 vòng counter-offer
  NEGOTIATION_EXPIRE_HOURS:     48,     // Offer tự expire sau 48h
  SCHEDULE_AUTO_CANCEL_HOURS:   24,     // Tự cancel nếu không confirm sau 24h
  MODERATION_AUTO_APPROVE:      70,     // Score >= 70 thì tự publish
  MIN_IMAGES_REQUIRED:           4,     // Tối thiểu 4 ảnh khi đăng tin
  COMMISSION_PLATFORM:       0.003,     // 0.3% cho platform (giai đoạn 1)
  COMMISSION_BROKER:         0.007,     // 0.7% cho môi giới (giai đoạn 1)

  // ─── PAGINATION ──────────────────────────────────────────
  PAGE_SIZE: 12,   // 3 cột × 4 hàng desktop

  // ─── MAPS ────────────────────────────────────────────────
  // Bán kính làm mờ tọa độ để bảo vệ địa chỉ thật
  ADDRESS_FUZZ_RADIUS_M: 400,   // Lệch 300-500m

  // ─── FEATURE FLAGS ───────────────────────────────────────
  // Bật/tắt tính năng theo Sprint — không cần deploy lại
  FEATURES: {
    AI_SEARCH:     false,   // Sprint 3
    AI_CHATBOT:    false,   // Sprint 3
    COMMUTE_FILTER: false,  // Sprint 3
    NEGOTIATE:     false,   // Sprint 3
    SCHEDULE:      false,   // Sprint 5
    MATCH:         false,   // Sprint 5
    ZALO_ZNS:      false,   // Sprint 4 (khi được duyệt)
    PAYMENT:       false,   // Sprint 6
  },

  // ─── ENVIRONMENT ─────────────────────────────────────────
  // Tự detect dựa theo hostname — không cần thay đổi thủ công
  IS_DEV: window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1',
  IS_STAGING: window.location.hostname.includes('staging') ||
              window.location.hostname.includes('preview'),
});

// Warn khi đang dùng placeholder — tránh push config rỗng lên production
if (window.BDS_CONFIG.IS_DEV) {
  if (window.BDS_CONFIG.SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
    console.warn('[BDS Config] ⚠️ Chưa điền SUPABASE_URL. Mở js/config.js để cập nhật.');
  }
  if (window.BDS_CONFIG.SUPABASE_ANON_KEY === 'YOUR_ANON_KEY') {
    console.warn('[BDS Config] ⚠️ Chưa điền SUPABASE_ANON_KEY.');
  }
}
