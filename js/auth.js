/**
 * js/auth.js
 * BDS Platform HCM — Auth flow + role routing
 *
 * Xử lý: đăng ký, đăng nhập, đăng xuất, Google OAuth,
 * quên mật khẩu, routing theo role sau khi login.
 *
 * [TƯ DUY HỆ THỐNG]: Module này như "cổng vào" của platform.
 * Ai vào, vào bằng cách nào, được đi đâu sau khi vào —
 * tất cả quyết định ở đây. Các module khác chỉ việc lắng nghe
 * event 'auth:ready' rồi làm việc của mình.
 */

const AuthModule = (() => {
  'use strict';

  // ─── PRIVATE STATE ─────────────────────────────────────────
  let currentView = 'login';    // 'login' | 'register' | 'verify' | 'reset'
  let isSubmitting = false;     // Chống double-submit

  // ─── ROUTE SAU KHI LOGIN ────────────────────────────────────
  // Mỗi role được redirect đến trang phù hợp
  const ROLE_ROUTES = {
    admin:   '/dashboard-admin/',
    broker:  '/dashboard-broker/',
    owner:   '/dashboard-owner/',
    member:  '/',              // Người tìm nhà → về trang chủ
  };

  // ─── PRIVATE: UI HELPERS ────────────────────────────────────

  /**
   * Chuyển sang view mới (login/register/verify/reset)
   * Chỉ toggle CSS class — không inline style
   */
  function _showView(viewName) {
    currentView = viewName;

    // Ẩn tất cả views
    document.querySelectorAll('[data-view]').forEach(el => {
      el.classList.remove('is-active');
    });

    // Hiện view được chọn
    const target = document.querySelector(`[data-view="${viewName}"]`);
    if (target) {
      target.classList.add('is-active');
    }

    // Cập nhật URL để back button hoạt động đúng
    const url = new URL(window.location);
    url.searchParams.set('tab', viewName === 'login' ? '' : viewName);
    window.history.replaceState({}, '', url.toString().replace('?tab=', ''));
  }

  function _setLoading(formEl, loading) {
    const btn = formEl?.querySelector('[type="submit"]');
    if (!btn) return;
    isSubmitting = loading;
    btn.classList.toggle('is-loading', loading);
    btn.disabled = loading;
  }

  function _showToast(message, type = 'info') {
    window.dispatchEvent(new CustomEvent('toast:show', {
      detail: { message, type }
    }));
  }

  function _showInlineError(formEl, message) {
    const errorEl = formEl?.querySelector('.form-global-error');
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
  }

  function _clearInlineError(formEl) {
    const errorEl = formEl?.querySelector('.form-global-error');
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.classList.remove('is-visible');
  }

  // ─── PRIVATE: ROUTE THEO ROLE ───────────────────────────────

  /**
   * Redirect user về đúng trang sau khi đăng nhập
   * Ưu tiên: trang trước đó (nếu bị redirect sang login) → trang theo role
   */
  function _redirectAfterLogin(role) {
    // Kiểm tra xem có returnUrl không (user bị redirect sang login)
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get('return');

    if (returnUrl && returnUrl.startsWith('/')) {
      // Validate returnUrl — chỉ cho phép URL trong domain
      window.location.href = returnUrl;
      return;
    }

    // Không có returnUrl → đi theo role
    const route = ROLE_ROUTES[role] || '/';
    window.location.href = route;
  }

  // ─── PRIVATE: XỬ LÝ ĐĂNG NHẬP ──────────────────────────────

  async function _handleLogin(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const email = form.querySelector('#login-email')?.value?.trim();
    const password = form.querySelector('#login-password')?.value;

    // Validate đơn giản
    const { valid, errors } = window.validateForm(
      { email, password },
      {
        email:    [window.Validators.required, window.Validators.email],
        password: [window.Validators.required],
      }
    );

    if (!valid) {
      window.showFormErrors(errors);
      return;
    }

    _clearInlineError(form);
    _setLoading(form, true);

    try {
      const { data, error } = await window.SupabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Lấy role từ profile (không lấy từ user_metadata vì có thể stale)
      const { data: profile } = await window.SupabaseClient
        .from('profiles')
        .select('role, trust_level')
        .eq('id', data.user.id)
        .single();

      _showToast(window.i18n('success.login'), 'success');

      // Redirect sau 800ms để user thấy toast
      setTimeout(() => {
        _redirectAfterLogin(profile?.role || 'member');
      }, 800);

    } catch (err) {
      console.error('[Auth] Login failed:', err.message);

      // Map lỗi Supabase sang tiếng Việt
      let message = window.i18n('error.generic');
      if (err.message?.includes('Invalid login credentials')) {
        message = window.i18n('error.wrong_password');
      } else if (err.message?.includes('Email not confirmed')) {
        message = 'Email chưa được xác nhận. Kiểm tra hộp thư của bạn.';
      } else if (err.message?.includes('Too many requests')) {
        message = window.i18n('error.rate_limit');
      }

      _showInlineError(form, message);
    } finally {
      _setLoading(form, false);
    }
  }

  // ─── PRIVATE: XỬ LÝ ĐĂNG KÝ ────────────────────────────────

  async function _handleRegister(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const fullName = form.querySelector('#reg-name')?.value?.trim();
    const phone    = form.querySelector('#reg-phone')?.value?.trim();
    const email    = form.querySelector('#reg-email')?.value?.trim();
    const password = form.querySelector('#reg-password')?.value;
    const confirm  = form.querySelector('#reg-confirm')?.value;
    const role     = form.querySelector('input[name="role"]:checked')?.value || 'member';

    // Validate đầy đủ
    const { valid, errors } = window.validateForm(
      { fullName, phone, email, password, confirm },
      {
        fullName: [window.Validators.required, window.Validators.minLength(2)],
        phone:    [window.Validators.required, window.Validators.phone],
        email:    [window.Validators.required, window.Validators.email],
        password: [window.Validators.required, window.Validators.minLength(8)],
        confirm:  [
          window.Validators.required,
          (value) => ({
            valid: value === password,
            message: window.i18n('error.password_mismatch'),
          }),
        ],
      }
    );

    if (!valid) {
      window.showFormErrors(errors);
      return;
    }

    _clearInlineError(form);
    _setLoading(form, true);

    try {
      const { data, error } = await window.SupabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            // Lưu vào user_metadata — trigger DB sẽ copy vào profiles table
            full_name: fullName,
            phone,
            role,
            city_id: window.BDS_CONFIG.CURRENT_CITY,
          },
          emailRedirectTo: `${window.BDS_CONFIG.APP_URL}/auth.html?tab=verified`,
        },
      });

      if (error) throw error;

      // Cập nhật thêm vào bảng profiles (trigger đã tạo row, giờ update thêm)
      if (data.user) {
        await window.SupabaseClient
          .from('profiles')
          .update({ full_name: fullName, phone, role })
          .eq('id', data.user.id);
      }

      // Chuyển sang màn hình "kiểm tra email"
      _showView('verify');

      // Điền email vào màn verify để user thấy
      const verifyEmailEl = document.getElementById('verify-email-display');
      if (verifyEmailEl) verifyEmailEl.textContent = email;

    } catch (err) {
      console.error('[Auth] Register failed:', err.message);

      let message = window.i18n('error.generic');
      if (err.message?.includes('already registered')) {
        message = window.i18n('error.email_exists');
      } else if (err.message?.includes('Password should be')) {
        message = window.i18n('error.password_short');
      } else if (err.message?.includes('Too many requests')) {
        message = window.i18n('error.rate_limit');
      }

      _showInlineError(form, message);
    } finally {
      _setLoading(form, false);
    }
  }

  // ─── PRIVATE: GOOGLE OAUTH ───────────────────────────────────

  async function _handleGoogleLogin() {
    try {
      const { error } = await window.SupabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.BDS_CONFIG.APP_URL}/auth.html`,
          queryParams: {
            // Gợi ý chọn account nếu đã login nhiều Google account
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;
      // Supabase tự redirect — không cần xử lý thêm

    } catch (err) {
      console.error('[Auth] Google login failed:', err.message);
      _showToast('Đăng nhập Google thất bại. Thử lại nhé!', 'error');
    }
  }

  // ─── PRIVATE: QUÊN MẬT KHẨU ─────────────────────────────────

  async function _handleResetPassword(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const email = form.querySelector('#reset-email')?.value?.trim();

    const { valid, errors } = window.validateForm(
      { email },
      { email: [window.Validators.required, window.Validators.email] }
    );

    if (!valid) {
      window.showFormErrors(errors);
      return;
    }

    _setLoading(form, true);

    try {
      const { error } = await window.SupabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.BDS_CONFIG.APP_URL}/auth.html?tab=new-password`,
      });

      if (error) throw error;

      _showToast(window.i18n('success.reset_sent'), 'success');

      // Quay lại login sau 3 giây
      setTimeout(() => _showView('login'), 3000);

    } catch (err) {
      console.error('[Auth] Reset password failed:', err.message);
      _showInlineError(form, window.i18n('error.generic'));
    } finally {
      _setLoading(form, false);
    }
  }

  // ─── PRIVATE: ĐĂNG XUẤT ─────────────────────────────────────

  async function _handleLogout() {
    try {
      await window.SupabaseClient.auth.signOut();
      _showToast(window.i18n('success.logout'), 'info');
      setTimeout(() => { window.location.href = '/'; }, 800);
    } catch (err) {
      console.error('[Auth] Logout failed:', err.message);
    }
  }

  // ─── PRIVATE: BIND EVENTS ────────────────────────────────────

  function _bindEvents() {
    // Form submit
    document.getElementById('form-login')
      ?.addEventListener('submit', _handleLogin);

    document.getElementById('form-register')
      ?.addEventListener('submit', _handleRegister);

    document.getElementById('form-reset')
      ?.addEventListener('submit', _handleResetPassword);

    // Google login buttons
    document.querySelectorAll('[data-action="google-login"]').forEach(btn => {
      btn.addEventListener('click', _handleGoogleLogin);
    });

    // Logout buttons (nhiều nơi có thể có)
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
      btn.addEventListener('click', _handleLogout);
    });

    // Chuyển view
    document.querySelectorAll('[data-goto]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        _showView(el.dataset.goto);
      });
    });

    // Lắng nghe auth events từ supabase.js
    window.addEventListener('auth:ready', (e) => {
      // Nếu đang ở trang auth mà đã đăng nhập → redirect
      if (window.location.pathname.includes('auth.html')) {
        const role = e.detail?.role || 'member';
        _redirectAfterLogin(role);
      }
    });

    window.addEventListener('auth:guest', () => {
      // User chưa đăng nhập — các trang protected phải redirect sang auth
      const protectedPaths = ['/saved', '/match', '/dashboard'];
      const currentPath = window.location.pathname;

      const isProtected = protectedPaths.some(p => currentPath.includes(p));
      if (isProtected) {
        const returnUrl = encodeURIComponent(currentPath + window.location.search);
        window.location.href = `/auth.html?return=${returnUrl}`;
      }
    });
  }

  // ─── PRIVATE: CHECK VIEW TỪ URL ─────────────────────────────

  function _initViewFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');

    const validViews = ['login', 'register', 'reset', 'verify'];
    if (tab && validViews.includes(tab)) {
      _showView(tab);
    } else {
      _showView('login'); // Default
    }
  }

  // ─── PUBLIC API ──────────────────────────────────────────────
  return {
    init() {
      _bindEvents();
      _initViewFromUrl();

      if (window.BDS_CONFIG?.IS_DEV) {
        console.log('[Auth] ✅ Module khởi tạo xong.');
      }
    },

    // Expose để các module khác gọi khi cần
    logout: _handleLogout,
    showView: _showView,
  };
})();

// Khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // Chỉ init nếu đang ở trang auth hoặc có logout button
  const isAuthPage = document.getElementById('form-login') ||
                     document.getElementById('form-register');
  const hasLogout = document.querySelector('[data-action="logout"]');

  if (isAuthPage || hasLogout) {
    AuthModule.init();
  }
});
