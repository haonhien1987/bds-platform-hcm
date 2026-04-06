/**
 * js/supabase.js
 * BDS Platform HCM — Supabase client + quản lý auth state
 *
 * Module này làm 2 việc:
 * 1. Khởi tạo Supabase client duy nhất (singleton)
 * 2. Lắng nghe thay đổi auth → dispatch CustomEvent cho các module khác
 *
 * [TƯ DUY HỆ THỐNG]: File này như trạm điều phối trung tâm.
 * Mọi module khác không tự kết nối Supabase — họ nhận tín hiệu từ đây.
 * Nếu auth thay đổi ở 1 chỗ, toàn bộ platform biết ngay.
 */

(() => {
  'use strict';

  // Kiểm tra Supabase SDK đã load chưa (load từ CDN trong HTML)
  if (typeof supabase === 'undefined') {
    console.error('[Supabase] ❌ SDK chưa được load. Kiểm tra thẻ <script> trong HTML.');
    return;
  }

  // Kiểm tra config đã điền chưa
  if (!window.BDS_CONFIG?.SUPABASE_URL || !window.BDS_CONFIG?.SUPABASE_ANON_KEY) {
    console.error('[Supabase] ❌ Thiếu SUPABASE_URL hoặc SUPABASE_ANON_KEY trong config.js');
    return;
  }

  // ─── KHỞI TẠO CLIENT ─────────────────────────────────────
  const { createClient } = supabase;

  window.SupabaseClient = createClient(
    window.BDS_CONFIG.SUPABASE_URL,
    window.BDS_CONFIG.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,       // Tự gia hạn token — user không bị đăng xuất oan
        persistSession: true,         // Giữ session sau khi đóng tab
        detectSessionInUrl: true,     // Hỗ trợ magic link và OAuth redirect
      }
    }
  );

  // ─── HELPERS NỘI BỘ ──────────────────────────────────────

  /**
   * Lấy role và trust_level từ user metadata
   * Supabase lưu custom data trong user_metadata khi đăng ký
   */
  function _extractUserInfo(user) {
    if (!user) return null;
    return {
      user,
      role: user.user_metadata?.role || 'member',
      trust_level: user.user_metadata?.trust_level || 1,
      city_id: user.user_metadata?.city_id || window.BDS_CONFIG.CURRENT_CITY,
    };
  }

  /**
   * Dispatch event để các module khác biết auth thay đổi
   * Tất cả module lắng nghe event này — không gọi trực tiếp vào nhau
   */
  function _dispatchAuthEvent(eventName, detail = {}) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));

    if (window.BDS_CONFIG.IS_DEV) {
      console.log(`[Supabase] 📡 ${eventName}`, detail);
    }
  }

  // ─── LẮNG NGHE THAY ĐỔI AUTH ─────────────────────────────
  // onAuthStateChange bắt mọi sự kiện: login, logout, token refresh, v.v.
  window.SupabaseClient.auth.onAuthStateChange((event, session) => {

    switch (event) {

      case 'SIGNED_IN':
      case 'TOKEN_REFRESHED':
        // User vừa đăng nhập hoặc token được refresh
        _dispatchAuthEvent('auth:ready', _extractUserInfo(session?.user));
        break;

      case 'SIGNED_OUT':
        // User đăng xuất hoặc token hết hạn
        _dispatchAuthEvent('auth:guest');
        break;

      case 'USER_UPDATED':
        // Profile thay đổi (trust_level lên, v.v.)
        _dispatchAuthEvent('auth:changed', _extractUserInfo(session?.user));
        break;

      case 'PASSWORD_RECOVERY':
        // User đang reset mật khẩu qua email
        _dispatchAuthEvent('auth:password_recovery', { user: session?.user });
        break;

      default:
        // Các event khác: bỏ qua, không cần xử lý
        break;
    }
  });

  // ─── KIỂM TRA SESSION HIỆN TẠI ───────────────────────────
  // Khi page load, kiểm tra xem có session cũ không
  // Dùng async IIFE để không block page render
  (async () => {
    try {
      const { data: { session }, error } = await window.SupabaseClient.auth.getSession();

      if (error) {
        console.error('[Supabase] Lỗi khi lấy session:', error.message);
        _dispatchAuthEvent('auth:guest');
        return;
      }

      if (session?.user) {
        // Có session → báo cho các module biết
        _dispatchAuthEvent('auth:ready', _extractUserInfo(session.user));
      } else {
        // Không có session → user là khách vãng lai
        _dispatchAuthEvent('auth:guest');
      }

    } catch (err) {
      console.error('[Supabase] Lỗi không xử lý được:', err.message);
      _dispatchAuthEvent('auth:guest');
    }
  })();

  // ─── EXPORT HELPERS TIỆN ÍCH ────────────────────────────
  // Các hàm hay dùng — không cần import lại Supabase trong module khác

  /**
   * Lấy user hiện tại (async)
   * Dùng: const user = await window.getCurrentUser();
   */
  window.getCurrentUser = async function() {
    const { data: { user } } = await window.SupabaseClient.auth.getUser();
    return user || null;
  };

  /**
   * Kiểm tra đã đăng nhập chưa (sync, dùng cache)
   * Dùng cho các check UI nhanh — không dùng cho security
   */
  window.isLoggedIn = function() {
    // getSession() là sync trong v2 nếu dùng từ cache
    return !!window.SupabaseClient.auth.session;
  };

  if (window.BDS_CONFIG.IS_DEV) {
    console.log('[Supabase] ✅ Client khởi tạo thành công.');
  }

})();
