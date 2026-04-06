# BDS-CODE.md
# Patterns code chuẩn cho BDS Platform HCM
# Đọc file này khi: viết JS module / CSS / HTML / Edge Function
# QUAN TRỌNG: Giao diện và logic PHẢI tách hoàn toàn

---
## PHẦN 1: QUY TẮC TÁCH GIAO DIỆN VÀ LOGIC
---

```
ĐÂY LÀ QUY TẮC CỨNG — KHÔNG CÓ NGOẠI LỆ:

File CSS:    Chỉ chứa styles, không có logic nào
File JS:     Không viết inline styles (style.xxx = yyy)
             Chỉ thêm/xóa CSS class
File HTML:   Không chứa business logic
             Chỉ chứa cấu trúc + data attributes

VÍ DỤ ĐÚNG (JS thay đổi UI):
  element.classList.add('is-loading');
  element.classList.remove('is-loading');
  element.dataset.score = score;

VÍ DỤ SAI:
  element.style.display = 'none';
  element.style.color = '#red';
```

---
## PHẦN 2: MODULE PATTERN CHUẨN
---

```javascript
// Template cho mọi JS module — copy và thay [ModuleName]
const [ModuleName]Module = (() => {
  'use strict';

  // ─── PRIVATE STATE ───────────────────────────────────────────
  let initialized = false;
  let currentData = null;

  // ─── PRIVATE FUNCTIONS ────────────────────────────────────────
  async function _fetchData(params) {
    try {
      const { data, error } = await window.SupabaseClient
        .from('table_name')
        .select('col1, col2')
        .eq('city_id', window.BDS_CONFIG.CURRENT_CITY) // LUÔN có city_id
        .match(params);
      if (error) throw error;
      return data;
    } catch (err) {
      _handleError(err, '_fetchData');
      return null;
    }
  }

  function _render(data) {
    // Chỉ thay đổi DOM — không có business logic ở đây
    const container = document.getElementById('container-id');
    if (!container) return;
    container.innerHTML = data.map(_renderItem).join('');
  }

  function _renderItem(item) {
    // Template literal thuần túy — không có logic phức tạp
    return `<div class="card" data-id="${item.id}">${item.title}</div>`;
  }

  function _handleError(err, context) {
    // Log cho Sentry + thông báo user thân thiện
    console.error(`[${[ModuleName]}] ${context}:`, err.message);
    if (window.Sentry) Sentry.captureException(err, { extra: { context } });
    _showToast(window.i18n('error.generic'), 'error'); // Dùng i18n
  }

  function _showToast(message, type = 'info') {
    window.dispatchEvent(new CustomEvent('toast:show', {
      detail: { message, type }
    }));
  }

  function _bindEvents() {
    // Lắng nghe events từ module khác
    window.addEventListener('auth:ready', (e) => {
      // Xử lý khi auth xong
    });
  }

  // ─── PUBLIC API ───────────────────────────────────────────────
  return {
    async init() {
      if (initialized) return; // Chống double-init
      _bindEvents();
      await this.refresh();
      initialized = true;
    },

    async refresh(params = {}) {
      currentData = await _fetchData(params);
      if (currentData) _render(currentData);
    },

    destroy() {
      initialized = false;
      currentData = null;
    }
  };
})();

// Auto-init khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
  [ModuleName]Module.init();
});
```

---
## PHẦN 3: SUPABASE CLIENT CHUẨN
---

```javascript
// js/supabase.js
(() => {
  'use strict';

  const { createClient } = supabase;

  window.SupabaseClient = createClient(
    window.BDS_CONFIG.SUPABASE_URL,
    window.BDS_CONFIG.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  );

  window.SupabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      window.dispatchEvent(new CustomEvent('auth:ready', {
        detail: {
          user: session.user,
          role: session.user?.user_metadata?.role || 'member',
          trust_level: session.user?.user_metadata?.trust_level || 1,
          city_id: session.user?.user_metadata?.city_id || 'hcm'
        }
      }));
    }
    if (event === 'SIGNED_OUT') {
      window.dispatchEvent(new CustomEvent('auth:guest'));
    }

    if (event === 'USER_UPDATED') {
      // Profile user thay đổi (trust_level lên, v.v.)
      window.dispatchEvent(new CustomEvent('auth:changed', {
        detail: { user: session.user }
      }));
    }
  });

  window.SupabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      window.dispatchEvent(new CustomEvent('auth:ready', {
        detail: {
          user: session.user,
          role: session.user?.user_metadata?.role || 'member',
          trust_level: session.user?.user_metadata?.trust_level || 1,
          city_id: 'hcm'
        }
      }));
    } else {
      window.dispatchEvent(new CustomEvent('auth:guest'));
    }
  });
})();
```

---
## PHẦN 4: i18n — ĐA NGÔN NGỮ TỪ SPRINT 1
---

```javascript
// js/i18n.js — QUAN TRỌNG: Làm ngay Sprint 1 dù chưa cần
// Toàn bộ text UI đều lấy từ đây, không hardcode trong HTML

const STRINGS = {
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.listings': 'Tìm nhà',
    'nav.post': 'Đăng tin',
    'nav.saved': 'Đã lưu',
    'nav.login': 'Đăng nhập',

    // Listing
    'listing.price': 'Giá',
    'listing.area': 'Diện tích',
    'listing.bedrooms': 'Phòng ngủ',
    'listing.bathrooms': 'Phòng tắm',
    'listing.direction': 'Hướng',
    'listing.legal': 'Pháp lý',
    'listing.road_width': 'Đường trước nhà',

    // Actions
    'btn.contact': 'Liên hệ chủ nhà',
    'btn.save': 'Lưu',
    'btn.saved': 'Đã lưu',
    'btn.schedule': 'Đặt lịch xem nhà',
    'btn.negotiate': 'Đề xuất giá',
    'btn.match': 'Yêu cầu Match',

    // Labels
    'label.new': 'Mới đăng',
    'label.price_drop': 'Vừa giảm giá',
    'label.hot': 'Xem nhiều',
    'label.negotiating': 'Đang giao dịch',
    'label.good_deal': 'Nhà ngon',
    'label.verified': 'Đã xác minh',
    'label.unverified': 'Chưa xác minh',

    // Trust
    'trust.pending': 'Chờ xác minh',
    'trust.verified': 'Đã xác minh',
    'trust.reported': 'Đã báo cáo',

    // Address
    'address.ward_new': 'Phường (mới)',
    'address.ward_old': 'Trước 7/2025',
    'address.full_after_match': 'Địa chỉ đầy đủ (sau khi đặt lịch)',

    // Calculator
    'calc.roi.title': 'Tính ROI đầu tư',
    'calc.roi.yield': 'Lợi nhuận/năm',
    'calc.roi.payback': 'Hoàn vốn sau',
    'calc.loan.title': 'Tính vay ngân hàng',
    'calc.loan.monthly': 'Trả góp hàng tháng',

    // Errors
    'error.generic': 'Có lỗi xảy ra. Vui lòng thử lại.',
    'error.auth': 'Bạn chưa đăng nhập.',
    'error.not_found': 'Không tìm thấy dữ liệu.',
    'error.permission': 'Bạn không có quyền thực hiện.',
    'error.rate_limit': 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.',
  },

  en: {
    // Thêm dần từ Sprint 3
    'nav.home': 'Home',
    'listing.price': 'Price',
    'btn.contact': 'Contact Owner',
    'btn.schedule': 'Schedule Viewing',
    'error.generic': 'Something went wrong. Please try again.',
  },

  // zh, ko — thêm từ Sprint 5+
};

// Lấy string theo ngôn ngữ hiện tại
window.i18n = function(key) {
  const lang = window.BDS_CONFIG.CURRENT_LANG || 'vi';
  return STRINGS[lang]?.[key] || STRINGS['vi']?.[key] || key;
};
```

---
## PHẦN 5: LABELS MODULE
---

```javascript
// js/labels.js
const LabelsModule = (() => {
  'use strict';

  // Tự động cập nhật labels dựa trên data — không fake
  function getAutoLabels(listing) {
    const labels = [];
    const now = new Date();

    // "Mới đăng" — < 72 giờ
    if (listing.published_at) {
      const hoursAgo = (now - new Date(listing.published_at)) / 3600000;
      if (hoursAgo < 72) labels.push('new');
    }

    // "Đang giao dịch" — có match request pending
    if (listing.label_negotiating) labels.push('negotiating');

    // "Đang giảm giá" — chỉ khi có price_history xác nhận
    if (listing.label_price_drop) labels.push('price_drop');

    // "Xem nhiều" — top 10% theo view_count tuần này
    if (listing.label_hot) labels.push('hot');

    // "Nhà ngon" — thủ công, admin/broker gán
    if (listing.label_good_deal) labels.push('good_deal');

    // "Thương lượng" — chủ nhà bật
    if (listing.label_flexible) labels.push('flexible');

    return labels;
  }

  // Render label badges — CHỈ thêm CSS class, không inline style
  function renderLabels(listing) {
    const labels = getAutoLabels(listing);
    return labels.map(label => {
      const config = {
        new:         { text: window.i18n('label.new'),         class: 'badge--new' },
        negotiating: { text: window.i18n('label.negotiating'), class: 'badge--hot' },
        price_drop:  { text: window.i18n('label.price_drop'),  class: 'badge--sale' },
        hot:         { text: window.i18n('label.hot'),         class: 'badge--popular' },
        good_deal:   { text: window.i18n('label.good_deal'),   class: 'badge--premium' },
        flexible:    { text: '💬 Thương lượng',                class: 'badge--flexible' },
      };
      const c = config[label];
      return c ? `<span class="badge ${c.class}">${c.text}</span>` : '';
    }).join('');
  }

  return { getAutoLabels, renderLabels };
})();
```

---
## PHẦN 6: SCHEDULE MODULE — GIỜ XEM NHÀ
---

```javascript
// js/schedule.js
const ScheduleModule = (() => {
  'use strict';

  // Giờ recommend — anh Ari đã confirm các giờ này
  const RECOMMENDED_SLOTS = {
    weekday: [
      { time: '09:00', label: '9h sáng', score: 3, reason: 'Ánh sáng tự nhiên tốt nhất' },
      { time: '17:00', label: '5h chiều', score: 3, reason: 'Giờ tan làm, tiện đi xem' },
      { time: '19:00', label: '7h tối', score: 2, reason: 'Sau giờ làm, còn đủ sáng' },
      { time: '10:00', label: '10h sáng', score: 2, reason: 'Buổi sáng thoáng mát' },
      { time: '15:00', label: '3h chiều', score: 1, reason: 'Nắng chiều — kém đẹp' },
    ],
    weekend: [
      { time: '09:00', label: '9h sáng', score: 3, reason: 'Lý tưởng nhất cuối tuần' },
      { time: '10:30', label: '10h30', score: 3, reason: 'Ánh sáng đẹp, không vội' },
      { time: '15:00', label: '3h chiều', score: 2, reason: 'Cuối tuần OK' },
      { time: '16:30', label: '4h30 chiều', score: 2, reason: 'Xem trước khi tối' },
    ]
  };

  // Render slot picker — tự động mark giờ recommend
  function renderSlotPicker(availableSlots, onSelect) {
    const container = document.getElementById('slot-picker');
    if (!container) return;

    const today = new Date();
    const isWeekend = [0, 6].includes(today.getDay());
    const slots = isWeekend ? RECOMMENDED_SLOTS.weekend : RECOMMENDED_SLOTS.weekday;

    container.innerHTML = slots.map(slot => {
      const isAvailable = availableSlots.includes(slot.time);
      const isRecommended = slot.score >= 3;
      return `
        <button
          class="slot-btn ${isAvailable ? 'slot-btn--available' : 'slot-btn--taken'}
                          ${isRecommended ? 'slot-btn--recommended' : ''}"
          data-time="${slot.time}"
          ${!isAvailable ? 'disabled' : ''}
          title="${slot.reason}"
        >
          ${slot.label}
          ${isRecommended ? '<span class="slot-badge">⭐ Đề xuất</span>' : ''}
        </button>
      `;
    }).join('');

    // Event binding — dùng event delegation
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.slot-btn--available');
      if (btn) onSelect(btn.dataset.time);
    });
  }

  // Auto-cancel nếu không confirm sau 24h
  async function scheduleAutoCancel(scheduleId) {
    const cancelAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await window.SupabaseClient
      .from('schedules')
      .update({ auto_cancel_at: cancelAt.toISOString() })
      .eq('id', scheduleId);
  }

  return { renderSlotPicker, scheduleAutoCancel };
})();
```

---
## PHẦN 7: CALCULATOR MODULE — ROI + VAY NGÂN HÀNG
---

```javascript
// js/calculator.js
const CalculatorModule = (() => {
  'use strict';

  // ROI Calculator — cho nhà đầu tư
  function calcRentalROI(purchasePrice, monthlyRent, annualExpenses = 0) {
    const annualRent = monthlyRent * 12;
    const netIncome = annualRent - annualExpenses;
    const yieldPct = (netIncome / purchasePrice) * 100;
    const paybackYears = purchasePrice / netIncome;

    return {
      yieldPct: parseFloat(yieldPct.toFixed(2)),
      paybackYears: parseFloat(paybackYears.toFixed(1)),
      annualRent,
      netIncome,
      // Đánh giá: > 5% là tốt cho HCM
      rating: yieldPct >= 5 ? 'good' : yieldPct >= 3 ? 'fair' : 'low'
    };
  }

  // Vay ngân hàng — lãi suất tham khảo 2026
  // Aria cập nhật hàng quý — không cần API ngân hàng
  const LOAN_RATE_2026 = 0.09; // 9%/năm (trung bình 2026)

  function calcMortgage(propertyPrice, downPaymentPct, loanYears) {
    const loanAmount = propertyPrice * (1 - downPaymentPct / 100);
    const monthlyRate = LOAN_RATE_2026 / 12;
    const numPayments = loanYears * 12;

    const monthlyPayment = loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;

    return {
      loanAmount: Math.round(loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      downPayment: Math.round(propertyPrice * downPaymentPct / 100),
      rateNote: `Lãi suất tham khảo ${(LOAN_RATE_2026 * 100).toFixed(1)}%/năm (2026)`
    };
  }

  // So sánh thuê vs mua
  function calcRentVsBuy(monthlyRent, purchasePrice, years = 10) {
    const totalRentCost = monthlyRent * 12 * years;
    const mortgage = calcMortgage(purchasePrice, 30, 20);
    const totalMortgageCost = mortgage.monthlyPayment * 12 * years;
    // Giả định giá nhà tăng 7%/năm tại HCM
    const estimatedValue = purchasePrice * Math.pow(1.07, years);
    const equity = estimatedValue - (purchasePrice * 0.7 * (1 - years/20)); // Đơn giản hóa

    return {
      totalRentCost: Math.round(totalRentCost),
      totalMortgageCost: Math.round(totalMortgageCost),
      estimatedPropertyValue: Math.round(estimatedValue),
      netBuyingCost: Math.round(totalMortgageCost - (estimatedValue - purchasePrice)),
      recommendation: totalRentCost > totalMortgageCost * 0.9 ? 'buy' : 'rent'
    };
  }

  return { calcRentalROI, calcMortgage, calcRentVsBuy };
})();
```

---
## PHẦN 8: NEGOTIATE MODULE — ĐÀM PHÁN GIÁ
---

```javascript
// js/negotiate.js
const NegotiateModule = (() => {
  'use strict';

  const MAX_ROUNDS = 3; // Tối đa 3 vòng counter
  const EXPIRE_HOURS = 48; // Auto expire sau 48h

  // Submit offer từ phía khách
  async function submitOffer(listingId, offerAmount, note = '') {
    try {
      const user = await _getCurrentUser();
      if (!user) throw new Error('Chưa đăng nhập');

      // Kiểm tra đã có negotiation chưa
      const { data: existing } = await window.SupabaseClient
        .from('negotiations')
        .select('id, round, status')
        .eq('listing_id', listingId)
        .eq('buyer_id', user.id)
        .eq('status', 'pending')
        .single();

      if (existing && existing.round >= MAX_ROUNDS) {
        _showToast('Đã đạt giới hạn vòng đàm phán.', 'error');
        return null;
      }

      const expiresAt = new Date(Date.now() + EXPIRE_HOURS * 3600000);

      const { data, error } = await window.SupabaseClient
        .from('negotiations')
        .upsert({
          listing_id: listingId,
          buyer_id: user.id,
          current_offer: offerAmount,
          current_note: note,
          round: (existing?.round || 0) + 1,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      window.dispatchEvent(new CustomEvent('negotiate:submitted', {
        detail: { negotiation_id: data?.[0]?.id, offer_amount: offerAmount }
      }));

      return data;
    } catch (err) {
      console.error('[Negotiate] submitOffer:', err.message);
      if (window.Sentry) Sentry.captureException(err);
      _showToast(window.i18n('error.generic'), 'error');
      return null;
    }
  }

  // Chủ nhà counter-offer
  async function counterOffer(negotiationId, counterAmount, counterNote = '') {
    const expiresAt = new Date(Date.now() + EXPIRE_HOURS * 3600000);
    const { data, error } = await window.SupabaseClient
      .from('negotiations')
      .update({
        counter_offer: counterAmount,
        counter_note: counterNote,
        status: 'countered',
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', negotiationId);

    if (error) throw error;

    window.dispatchEvent(new CustomEvent('negotiate:countered', {
      detail: { negotiation_id: negotiationId, counter_amount: counterAmount }
    }));

    return data;
  }

  function _showToast(message, type) {
    window.dispatchEvent(new CustomEvent('toast:show', { detail: { message, type } }));
  }

  async function _getCurrentUser() {
    const { data: { user } } = await window.SupabaseClient.auth.getUser();
    return user;
  }

  return { submitOffer, counterOffer };
})();
```

---
## PHẦN 9: EDGE FUNCTION TEMPLATE
---

```typescript
// supabase/functions/[function-name]/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Xác thực user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Chưa đăng nhập' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token không hợp lệ' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Rate limiting
    const { data: rateOk } = await supabase.rpc('check_rate_limit', {
      p_user_id: user.id,
      p_action: '[function-name]',
      p_limit: 10,
      p_window_minutes: 1
    })
    if (!rateOk) {
      return new Response(
        JSON.stringify({ error: 'Thao tác quá nhanh. Thử lại sau 1 phút.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Parse + validate input
    const body = await req.json()
    const { param1 } = body
    if (!param1) {
      return new Response(
        JSON.stringify({ error: 'Thiếu thông tin bắt buộc' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Gọi Claude API (nếu cần)
    const CLAUDE_SYSTEM = `Bạn là trợ lý BĐS chuyên thị trường TP.HCM.
Luôn trả lời bằng tiếng Việt. Giá format theo đơn vị tỷ/triệu.
Địa chỉ dùng tên phường mới (sau 1/7/2025). Ngắn gọn, thực tế.`

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('CLAUDE_API_KEY') ?? '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: CLAUDE_SYSTEM,
        messages: [{ role: 'user', content: `${param1}` }]
      })
    })

    const claudeData = await claudeRes.json()
    const result = claudeData.content[0].text

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[function-name] error:', error)
    return new Response(
      JSON.stringify({ error: 'Lỗi server. Vui lòng thử lại.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---
## PHẦN 10: CSS DESIGN SYSTEM
---

```css
/* css/style.css — Design tokens BDS Platform HCM */
/* ĐÂY LÀ FILE CSS — chỉ chứa styles, không có logic JS nào */
:root {
  /* Brand Colors */
  --color-primary: #1A3C5E;        /* Navy — trust, authority */
  --color-primary-dark: #0F2840;
  --color-primary-light: #E8F0F7;
  --color-accent: #F5A623;         /* Amber — CTA, giá, highlight */
  --color-accent-dark: #D4891B;

  /* Semantic */
  --color-success: #27AE60;
  --color-danger: #E74C3C;
  --color-warning: #F39C12;
  --color-info: #2980B9;

  /* Neutrals */
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #5A6478;
  --color-text-muted: #9CA3AF;
  --color-bg: #F8FAFC;
  --color-bg-card: #FFFFFF;
  --color-border: #E2E8F0;
  --color-border-focus: #1A3C5E;   /* Border khi focus input */

  /* Legal status colors */
  --color-legal-so-do: #27AE60;
  --color-legal-so-hong: #16A085;
  --color-legal-dang-lam: #F39C12;
  --color-legal-hop-dong: #E67E22;
  --color-legal-chua-co: #E74C3C;

  /* Label badge colors */
  --color-badge-new: #3498DB;
  --color-badge-hot: #E74C3C;
  --color-badge-sale: #27AE60;
  --color-badge-premium: #F5A623;
  --color-badge-verified: #27AE60;

  /* Typography */
  --font-display: 'Be Vietnam Pro', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;   /* Dùng cho số, code */

  /* Spacing */
  --space-xs: 4px;   --space-sm: 8px;
  --space-md: 16px;  --space-lg: 24px;
  --space-xl: 32px;  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Border radius */
  --radius-sm: 4px;  --radius-md: 8px;
  --radius-lg: 12px; --radius-xl: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.12);
  --shadow-modal: 0 20px 60px rgba(0,0,0,0.2);

  /* Touch targets — mobile-first */
  --touch-target-min: 44px;  /* Tối thiểu cho ngón tay */
  --input-font-size: 16px;   /* Tránh zoom trên iOS */

  /* Z-index scale */
  --z-dropdown: 100;  --z-sticky: 200;
  --z-overlay: 300;   --z-modal: 400;
  --z-toast: 500;     --z-chatbot: 600;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #F1F5F9;
    --color-text-secondary: #94A3B8;
    --color-bg: #0F172A;
    --color-bg-card: #1E293B;
    --color-border: #334155;
  }
}

/* Reset tối thiểu */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
img { max-width: 100%; height: auto; display: block; }
button { cursor: pointer; border: none; background: none; font: inherit;
         min-height: var(--touch-target-min); } /* Mobile touch target */
a { color: inherit; text-decoration: none; }
input, select, textarea { font-size: var(--input-font-size); } /* Tránh zoom iOS */

/* Utility classes */
.sr-only { position: absolute; width: 1px; height: 1px;
           overflow: hidden; clip: rect(0,0,0,0); }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2;
                -webkit-box-orient: vertical; overflow: hidden; }
```

---
## PHẦN 11: HTML PAGE BOILERPLATE
---

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Page Title} | BDS Platform HCM</title>
  <meta name="description" content="{160 ký tự mô tả}">
  <link rel="canonical" href="https://yourdomain.vn/{slug}">

  <!-- Open Graph -->
  <meta property="og:locale" content="vi_VN">
  <meta property="og:type" content="website">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- CSS — Tách hoàn toàn khỏi JS -->
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/components.css">

  <!-- Structured Data -->
  <script type="application/ld+json" id="page-schema"></script>
</head>
<body>
  <a href="#main" class="sr-only">Bỏ qua điều hướng</a>
  <header id="site-header"></header>
  <main id="main"></main>
  <footer id="site-footer"></footer>
  <div id="chatbot-widget"></div>

  <!-- Supabase -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

  <!-- Config (public keys — OK để expose) -->
  <script>
    window.BDS_CONFIG = {
      SUPABASE_URL: 'https://xxx.supabase.co',
      SUPABASE_ANON_KEY: 'eyJ...',
      CURRENT_CITY: 'hcm',
      CURRENT_LANG: 'vi',
      GA_ID: 'G-XXXXXXXXXX',
      GOOGLE_MAPS_KEY: 'AIza...',
    };
  </script>

  <!-- Core modules — thứ tự quan trọng -->
  <script src="/js/utils.js"></script>
  <script src="/js/i18n.js"></script>      <!-- i18n trước -->
  <script src="/js/supabase.js"></script>
  <script src="/js/auth.js"></script>

  <!-- Page-specific modules -->
  <!-- <script src="/js/listings.js"></script> -->

  <!-- Always last -->
  <script src="/js/chatbot.js"></script>
  <script src="/js/analytics.js"></script>
</body>
</html>
```

---
## PHẦN 12: ERROR HANDLING CHUẨN
---

```javascript
// Pattern cho mọi async function
async function fetchData(params) {
  try {
    const { data, error } = await window.SupabaseClient
      .from('listings')
      .select('...')
      .eq('city_id', window.BDS_CONFIG.CURRENT_CITY)
      .match(params);

    if (error) throw error;
    return { success: true, data };

  } catch (err) {
    if (window.Sentry) Sentry.captureException(err, { extra: { params } });
    console.error('[module] [function] failed:', err.message);
    window.dispatchEvent(new CustomEvent('toast:show', {
      detail: { message: getErrorMessage(err.code), type: 'error' }
    }));
    return { success: false, data: null, error: err };
  }
}

// Error messages tiếng Việt
const ERROR_MESSAGES = {
  'PGRST116': 'Không tìm thấy dữ liệu',
  'PGRST301': 'Bạn không có quyền truy cập',
  '23505':    'Dữ liệu đã tồn tại',
  '429':      'Thao tác quá nhanh. Vui lòng thử lại sau.',
  'default':  'Có lỗi xảy ra. Vui lòng thử lại.'
};

function getErrorMessage(code) {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES['default'];
}
```

---
## PHẦN 13: LISTING CARD HTML COMPONENT
---

```html
<!-- Template cho listing card — dùng trong listings.js -->
<!-- Grid: 3 cột desktop / 2 cột tablet / 1 cột mobile -->
<!-- QUAN TRỌNG: badges và labels dùng CSS class, không inline style -->
<article class="listing-card" data-id="{id}" data-score="{score}">

  <!-- Thumbnail -->
  <div class="card-image">
    <img
      src="{thumbnail_url}"
      alt="{title}"
      loading="lazy"
      width="400" height="267"
      onerror="this.src='/assets/images/placeholder-house.jpg'"
    >

    <!-- Labels từ LabelsModule — không hardcode ở đây -->
    <div class="card-badges">
      <!-- LabelsModule.renderLabels(listing) sẽ inject vào đây -->
    </div>

    <!-- Match score nếu có AI search -->
    {#if score >= 80}
      <div class="card-score">{score}% phù hợp</div>
    {/if}

    <!-- Favorite button — JS xử lý toggle -->
    <button class="btn-favorite" data-listing-id="{id}" aria-label="Lưu yêu thích">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  </div>

  <!-- Card body -->
  <div class="card-body">
    <!-- Meta: loại + khu vực (dùng địa chỉ 2 lớp) -->
    <p class="card-meta">
      {property_type_label}
      · <span class="card-ward-new">{address_ward_new}</span>
      <span class="card-ward-old">(tr. 7/2025: {address_ward_old})</span>
    </p>

    <h3 class="card-title">
      <a href="/{purpose}/{slug}">{title}</a>
    </h3>

    <!-- Giá + Diện tích -->
    <div class="card-price-row">
      <span class="card-price">{price_formatted}</span>
      <span class="card-area">{area}m²</span>
      {#if area > 0}
        <span class="card-price-m2">~{price_per_m2}/m²</span>
      {/if}
    </div>

    <!-- Thông số -->
    <div class="card-stats">
      {#if bedrooms}
        <span class="stat" title="Phòng ngủ">
          <svg width="14" height="14" aria-hidden="true"><!-- bed icon --></svg>
          {bedrooms} PN
        </span>
      {/if}
      {#if bathrooms}
        <span class="stat" title="Phòng tắm">
          <svg width="14" height="14" aria-hidden="true"><!-- bath icon --></svg>
          {bathrooms} PT
        </span>
      {/if}
      {#if floors}
        <span class="stat" title="Số tầng">
          <svg width="14" height="14" aria-hidden="true"><!-- building icon --></svg>
          {floors} tầng
        </span>
      {/if}
      {#if road_width}
        <span class="stat">🛣 {road_width_label}</span>
      {/if}
    </div>

    <!-- Footer: pháp lý + thời gian -->
    <div class="card-footer">
      <span class="badge-legal badge-legal--{legal_status}">
        {legal_status_label}
      </span>
      <time class="card-date" datetime="{published_at}">{relative_time}</time>
    </div>
  </div>
</article>
```

---
## PHẦN 14: FORM VALIDATION PATTERN
---

```javascript
// js/utils.js — Form validation helpers
// Dùng chung cho mọi form: đăng tin, đăng ký, liên hệ, negotiate

const Validators = {
  required: (value) => ({
    valid: value !== null && value !== undefined && String(value).trim() !== '',
    message: 'Trường này không được để trống'
  }),

  phone: (value) => ({
    valid: /^(0|\+84)(3[2-9]|5[6-9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$/.test(
      value?.replace(/[\s.-]/g, '') || ''
    ),
    message: 'Số điện thoại không hợp lệ (VD: 0901234567)'
  }),

  email: (value) => ({
    valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Email không hợp lệ'
  }),

  minLength: (min) => (value) => ({
    valid: String(value || '').trim().length >= min,
    message: `Tối thiểu ${min} ký tự`
  }),

  maxLength: (max) => (value) => ({
    valid: String(value || '').trim().length <= max,
    message: `Tối đa ${max} ký tự`
  }),

  // Chặn SĐT trong mô tả — bảo vệ platform khỏi bypass
  noPhone: (value) => ({
    valid: !/0[3-9]\d{8}|\+84[3-9]\d{8}/.test(value || ''),
    message: 'Không được chứa số điện thoại trong nội dung'
  }),

  price: (value) => ({
    valid: !isNaN(value) && Number(value) > 0 && Number(value) <= 1e12,
    message: 'Giá không hợp lệ (tối đa 1,000 tỷ)'
  }),

  positiveNumber: (value) => ({
    valid: !isNaN(value) && Number(value) > 0,
    message: 'Vui lòng nhập số dương'
  }),

  // Validate năm xây dựng
  buildYear: (value) => ({
    valid: !value || (Number(value) >= 1950 && Number(value) <= new Date().getFullYear()),
    message: `Năm xây phải từ 1950 đến ${new Date().getFullYear()}`
  }),
};

// Validate toàn bộ form
function validateForm(formData, rules) {
  const errors = {};
  let valid = true;

  for (const [field, validators] of Object.entries(rules)) {
    const value = formData[field];
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        errors[field] = result.message;
        valid = false;
        break; // Chỉ hiện 1 lỗi/field
      }
    }
  }

  return { valid, errors };
}

// Hiện lỗi lên form — chỉ thêm/xóa CSS class, không inline style
function showFormErrors(errors) {
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
    errorEl.setAttribute('role', 'alert'); // Accessibility
    input.parentNode.insertBefore(errorEl, input.nextSibling);
  }

  // Focus field đầu tiên có lỗi
  const firstError = document.querySelector('.input-error');
  if (firstError) firstError.focus();
}

function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.remove());
  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
  });
}

// Ví dụ dùng trong form đăng tin:
// const { valid, errors } = validateForm(formData, {
//   title:       [Validators.required, Validators.minLength(10)],
//   phone:       [Validators.required, Validators.phone],
//   price:       [Validators.required, Validators.price],
//   description: [Validators.noPhone, Validators.maxLength(500)],
//   year_built:  [Validators.buildYear],
// });
// if (!valid) { showFormErrors(errors); return; }
```

---
## PHẦN 15: TOAST NOTIFICATION COMPONENT
---

```javascript
// js/utils.js — Toast system
// Hoạt động qua CustomEvent: window.dispatchEvent(new CustomEvent('toast:show', {...}))
// Không dùng inline style cho màu — dùng CSS class

const Toast = (() => {
  'use strict';
  let container;

  function _getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      // Position fixed — đây là exception cho phép inline style
      // vì container được tạo động và không có HTML template
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`; // CSS class, không inline style
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.onclick = () => toast.remove();

    _getContainer().appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.classList.add('toast--hiding');
      setTimeout(() => toast.remove(), 300); // Chờ animation
    }, duration);
  }

  // Lắng nghe event từ các module khác
  window.addEventListener('toast:show', (e) => {
    show(e.detail.message, e.detail.type, e.detail.duration);
  });

  return {
    show,
    success: (msg) => show(msg, 'success'),
    error:   (msg) => show(msg, 'error', 6000),  // Error hiện lâu hơn
    warning: (msg) => show(msg, 'warning'),
    info:    (msg) => show(msg, 'info')
  };
})();
```

```css
/* css/components.css — Toast styles */
#toast-container {
  position: fixed;
  bottom: var(--space-lg);
  right: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  z-index: var(--z-toast);
  max-width: 360px;
  /* Mobile: full width gần bottom */
}

.toast {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-size: 14px;
  line-height: 1.4;
  color: white;
  box-shadow: var(--shadow-card-hover);
  cursor: pointer;
  animation: toast-in var(--transition-base) ease;
  min-height: var(--touch-target-min); /* Mobile touch target */
  display: flex;
  align-items: center;
}

.toast--success { background: var(--color-success); }
.toast--error   { background: var(--color-danger); }
.toast--warning { background: var(--color-warning); color: #1A1A2E; }
.toast--info    { background: var(--color-primary); }
.toast--hiding  { animation: toast-out var(--transition-base) ease forwards; }

@keyframes toast-in {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
@keyframes toast-out {
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}

@media (max-width: 480px) {
  #toast-container {
    right: var(--space-md);
    left: var(--space-md);
    bottom: var(--space-md);
    max-width: 100%;
  }
}
```

---
## PHẦN 16: LOAD MORE / PAGINATION MODULE
---

```javascript
// js/listings.js — Pagination với Load More button
// Không dùng infinite scroll tự động vì:
// 1. User kiểm soát được khi nào load thêm
// 2. Dễ debug hơn
// 3. Tốt cho SEO (không block render)

const PaginationModule = (() => {
  'use strict';

  const PAGE_SIZE = 12; // 3 cột × 4 hàng desktop
  let currentPage = 0;
  let loading = false;
  let hasMore = true;
  let currentFilters = {};

  async function _loadPage(filters = {}) {
    if (loading || !hasMore) return;
    loading = true;

    const btn = document.getElementById('btn-load-more');
    if (btn) {
      btn.classList.add('is-loading');
      btn.textContent = 'Đang tải...';
    }

    try {
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await window.SupabaseClient
        .from('listings')
        .select(
          'id, title, slug, price, area, thumbnail_url, ' +
          'address_ward_new, address_ward_old, address_district_old, ' +
          'property_type, bedrooms, bathrooms, floors, road_width, ' +
          'legal_status, label_new, label_hot, label_price_drop, ' +
          'label_negotiating, label_good_deal, published_at',
          { count: 'exact' }
        )
        .eq('status', 'active')
        .eq('city_id', window.BDS_CONFIG.CURRENT_CITY)
        .match(filters)
        .range(from, to)
        .order('published_at', { ascending: false });

      if (error) throw error;

      hasMore = (from + data.length) < count;
      currentPage++;

      // Render cards và append vào grid
      const grid = document.getElementById('listings-grid');
      if (!grid) return;

      if (currentPage === 1) {
        // Lần đầu load: replace toàn bộ
        grid.innerHTML = data.length > 0
          ? data.map(_renderCard).join('')
          : '<p class="listings-empty">Không tìm thấy nhà phù hợp. Thử điều chỉnh bộ lọc.</p>';
      } else {
        // Load thêm: append
        data.forEach(listing => {
          grid.insertAdjacentHTML('beforeend', _renderCard(listing));
        });
      }

      // Cập nhật counter
      const counter = document.getElementById('listings-count');
      if (counter) counter.textContent = `${count} kết quả`;

      // Ẩn/hiện button
      if (btn) {
        if (!hasMore) {
          btn.classList.add('is-hidden');
        } else {
          btn.classList.remove('is-loading', 'is-hidden');
          btn.textContent = `Xem thêm (còn ${count - currentPage * PAGE_SIZE})`;
        }
      }

    } catch (err) {
      console.error('[Pagination] _loadPage:', err.message);
      if (window.Sentry) Sentry.captureException(err);
      window.dispatchEvent(new CustomEvent('toast:show', {
        detail: { message: 'Không tải được danh sách. Thử lại sau.', type: 'error' }
      }));
    } finally {
      loading = false;
      if (btn) btn.classList.remove('is-loading');
    }
  }

  function _renderCard(listing) {
    // Import từ PHẦN 13 — Listing Card HTML Component
    // Thay thế các {placeholder} bằng data thực
    const labels = window.LabelsModule?.renderLabels(listing) || '';
    const priceFormatted = window.formatBDSPrice?.(listing.price) || listing.price;
    const pricePerM2 = listing.area
      ? window.formatPricePerM2?.(listing.price, listing.area) || ''
      : '';

    return `
      <article class="listing-card" data-id="${listing.id}">
        <div class="card-image">
          <img src="${listing.thumbnail_url || '/assets/images/placeholder-house.jpg'}"
               alt="${listing.title}" loading="lazy" width="400" height="267"
               onerror="this.src='/assets/images/placeholder-house.jpg'">
          <div class="card-badges">${labels}</div>
          <button class="btn-favorite" data-listing-id="${listing.id}"
                  aria-label="Lưu yêu thích">♡</button>
        </div>
        <div class="card-body">
          <p class="card-meta">${listing.property_type} · ${listing.address_ward_new || listing.address_district_old}</p>
          <h3 class="card-title"><a href="/${listing.purpose || 'ban'}/${listing.slug}">${listing.title}</a></h3>
          <div class="card-price-row">
            <span class="card-price">${priceFormatted}</span>
            <span class="card-area">${listing.area}m²</span>
            ${pricePerM2 ? `<span class="card-price-m2">~${pricePerM2}</span>` : ''}
          </div>
          <div class="card-stats">
            ${listing.bedrooms ? `<span class="stat">${listing.bedrooms} PN</span>` : ''}
            ${listing.bathrooms ? `<span class="stat">${listing.bathrooms} PT</span>` : ''}
            ${listing.floors ? `<span class="stat">${listing.floors} tầng</span>` : ''}
          </div>
          <div class="card-footer">
            <span class="badge-legal badge-legal--${listing.legal_status}">${listing.legal_status}</span>
          </div>
        </div>
      </article>`;
  }

  return {
    init(initialFilters = {}) {
      currentFilters = initialFilters;
      currentPage = 0;
      hasMore = true;
      _loadPage(initialFilters);

      // Load more button
      document.getElementById('btn-load-more')?.addEventListener('click', () => {
        _loadPage(currentFilters);
      });

      // Lắng nghe filter thay đổi từ FilterModule
      window.addEventListener('filter:changed', (e) => {
        this.reset(e.detail.criteria);
      });
    },

    reset(newFilters = {}) {
      currentFilters = newFilters;
      currentPage = 0;
      hasMore = true;
      _loadPage(newFilters);
    }
  };
})();
```

---
*Đọc tiếp: BDS-SEO-AEO.md (chiến lược SEO + content)*

