# BDS-MASTER.md
# Kiến trúc hệ thống + Database Schema + Sprint Roadmap
# Đọc file này khi cần: kiến trúc / DB / SQL / RLS / sprint plan
# Thị trường: TP.HCM | Thiết kế sẵn multi-city

---
## PHẦN 1: QUY TẮC CODE CỨNG (không bao giờ thay đổi)
---

```
1. Một file một trách nhiệm — mỗi JS module chỉ làm 1 việc
2. Giao tiếp qua CustomEvent — modules không import lẫn nhau
3. Frontend không bao giờ gọi Claude API — luôn qua Edge Function
4. Mọi async function phải có try/catch — không để lỗi im lặng
5. Mọi input phải validate — cả frontend lẫn Edge Function
6. RLS là tầng bảo vệ cuối cùng — không dựa vào frontend
7. Không hardcode secret — API keys chỉ trong Supabase env
8. Comment bằng tiếng Việt — để anh Ari đọc hiểu được
9. Mobile-first — test 375px trước khi test desktop
10. SEO-friendly — slug URL, meta tags, structured data
11. Tách giao diện khỏi logic — sửa CSS không chạm JS và ngược lại
12. city_id trong mọi bảng liên quan — thiết kế sẵn multi-city
```

**Thứ tự ưu tiên khi có conflict:**
Security > Correctness > Performance > DX

---
## PHẦN 2: STACK CHÍNH THỨC
---

```
Frontend:   HTML5 + CSS3 + Vanilla JS (ES6+) — không dùng framework
Backend:    Supabase (PostgreSQL + Auth + Storage + Edge Functions + Realtime)
Deploy:     Vercel (static hosting + Edge Middleware)
AI:         Claude API (claude-sonnet-4-6) — chỉ qua Edge Functions
Automation: n8n self-host 
Email:      SendGrid (transactional)
Zalo:       ZNS (giao dịch) + OA (marketing, Sprint 4+)
            ⚠️ Đăng ký ZNS ngay — mất 1-2 tuần duyệt
Payment:    VNPay (giai đoạn 2) → Stripe (khi có khách quốc tế)
Analytics:  Google Analytics 4 + Sentry.io
Maps:       Google Maps API (bản đồ mờ) + Distance Matrix (commute filter)
Places:     Google Places API (tiện ích khu vực, cache kết quả)
i18n:       js/i18n.js (Việt → Anh Sprint 3 → Trung/Hàn Sprint 5+)
```

---
## PHẦN 3: CẤU TRÚC THƯ MỤC
---

```
bds-app/
├── index.html                    # Landing + AI search
├── listings.html                 # Danh sách + bộ lọc
├── detail.html                   # Chi tiết listing (?slug=xxx)
├── compare.html                  # So sánh 2-3 listing + AI phân tích
├── auth.html                     # Đăng ký / đăng nhập
├── saved.html                    # Đã lưu [login required]
├── match.html                    # Match flow [trust_level ≥ 4]
├── schedule.html                 # Chọn giờ xem nhà
├── negotiate.html                # Đàm phán giá
│
├── dashboard-owner/
│   ├── index.html                # Tổng quan + listing performance stats
│   ├── post-listing.html         # Đăng tin mới (form hybrid + AI)
│   ├── edit-listing.html
│   ├── my-listings.html
│   ├── leads.html                # Khách quan tâm
│   ├── negotiations.html         # Các offer đang nhận
│   ├── match-requests.html
│   ├── schedule.html             # Lịch xem nhà
│   ├── qr-codes.html
│   ├── rewards.html              # Set thưởng cho môi giới
│   └── profile.html
│
├── dashboard-admin/
│   ├── index.html                # KPIs + alerts
│   ├── listings.html
│   ├── users.html
│   ├── verifications.html        # Duyệt thủ công (score < 70)
│   ├── leads.html
│   ├── matches.html
│   ├── commissions.html          # Quản lý hoa hồng
│   ├── reports.html
│   ├── revenue.html
│   └── moderation.html
│
├── dashboard-broker/             # Môi giới đối tác
│   ├── index.html                # Dashboard + hoa hồng
│   ├── my-listings.html          # Listing đang quản lý
│   ├── leads.html                # Lead của mình
│   ├── rewards.html              # Thưởng đang active
│   └── profile.html              # Rating + lịch sử giao dịch
│
├── css/
│   ├── style.css                 # Design system (tách hoàn toàn khỏi JS)
│   ├── components.css
│   ├── filter.css
│   ├── dashboard.css
│   ├── negotiate.css             # UI đàm phán
│   └── chatbot.css
│
├── js/
│   ├── config.js                 # Constants, Supabase keys
│   ├── supabase.js               # Supabase client + session
│   ├── auth.js                   # Auth flow + role routing
│   ├── i18n.js                   # ĐỌC FILE NÀY — đa ngôn ngữ từ Sprint 1
│   ├── listings.js
│   ├── filter.js                 # Filter + sort + URL sync
│   ├── ai-search.js
│   ├── detail.js
│   ├── compare.js
│   ├── chatbot.js
│   ├── match.js
│   ├── negotiate.js              # Đàm phán giá (blind auction)
│   ├── schedule.js               # Chọn giờ + QR
│   ├── qr.js
│   ├── labels.js                 # Label system (tự động + thủ công)
│   ├── notifications.js          # Smart notification + saved search
│   ├── address-mapper.js         # Map địa chỉ cũ/mới sau sáp nhập
│   ├── price-tier.js             # Logic phân tier giá (tách riêng)
│   ├── commute.js                # Commute time filter
│   ├── calculator.js             # ROI + vay ngân hàng + so sánh thuê/mua
│   ├── nearby.js                 # Tiện ích khu vực (Google Places)
│   ├── contract.js
│   ├── payment.js
│   ├── upload.js
│   ├── share.js
│   ├── seo.js                    # Dynamic meta tags
│   ├── analytics.js
│   └── utils.js                  # Helpers: format giá VND, validate SĐT
│
├── supabase/functions/
│   ├── ai-chatbot/               # Sprint 3: AI filter → Sprint 5: tư vấn
│   ├── ai-describe-listing/      # AI rewrite mô tả từ form
│   ├── ai-search-match/
│   ├── ai-compare/
│   ├── ai-moderate/              # Chấm điểm listing (0-100)
│   ├── ai-price-suggest/         # Gợi ý giá offer cho khách
│   ├── generate-qr/
│   ├── validate-qr/
│   ├── generate-contract/        # PDF → OTP → eSign
│   ├── send-notification/        # Email + Zalo ZNS
│   ├── score-calculator/
│   ├── intervention-engine/      # Tự động can thiệp khi cần
│   └── content-generator/        # Sinh bài blog từ data listing
│
├── llms.txt                      # AEO: mô tả platform cho AI crawlers
├── robots.txt
├── sitemap.xml
└── manifest.json                 # PWA
```

---
## PHẦN 4: DATABASE SCHEMA ĐẦY ĐỦ
---

### 4.1 Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### 4.2 Profiles

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'member'
    CHECK (role IN ('member','owner','broker','admin')),
  trust_level INTEGER DEFAULT 1 CHECK (trust_level BETWEEN 1 AND 4),
  trust_score DECIMAL(3,2) DEFAULT 5.0,
  trust_score_count INTEGER DEFAULT 0,
  phone_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  -- Broker partner (10 bạn môi giới của anh Ari)
  broker_partner BOOLEAN DEFAULT false,
  broker_referral_code TEXT UNIQUE,
  broker_license TEXT,             -- Số chứng chỉ hành nghề (từ 3/2026 có mã số)
  broker_response_time_avg INTEGER, -- Giây, tự động track
  broker_rating DECIMAL(2,1),      -- Rating từ user sau giao dịch
  broker_deal_count INTEGER DEFAULT 0,
  -- Multi-city
  city_id TEXT DEFAULT 'hcm'
    CHECK (city_id IN ('hcm', 'hn', 'dn', 'ct')),
  preferred_cities TEXT[] DEFAULT '{hcm}',
  -- Trust
  terms_match_accepted_at TIMESTAMPTZ,
  terms_match_ip TEXT,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  ban_until TIMESTAMPTZ,
  membership_expires_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 Listings

```sql
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES profiles(id),  -- Môi giới đối tác đăng tin
  city_id TEXT DEFAULT 'hcm',              -- Multi-city support
  -- Thông tin cơ bản
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  purpose TEXT CHECK (purpose IN ('ban','thue')),
  property_type TEXT CHECK (property_type IN (
    'can_ho','nha_pho','dat_nen','biet_thu',
    'officetel','shophouse','nha_tro','condotel'
  )),
  -- Giá
  price BIGINT NOT NULL,
  price_negotiable BOOLEAN DEFAULT false,
  broker_reward BIGINT DEFAULT 0,  -- Thưởng thêm cho môi giới nếu bán được
  -- Địa chỉ (2 lớp: cũ + mới sau sáp nhập)
  address_ward_new TEXT,           -- Tên phường mới (sau 1/7/2025)
  address_ward_old TEXT,           -- Tên phường cũ (để user nhận ra)
  address_district_old TEXT,       -- Quận cũ (Quận 1, Quận 3, v.v.)
  address_street TEXT,             -- Tên đường
  address_house_number TEXT,       -- Số nhà (chỉ reveal sau khi request xem)
  address_lat DECIMAL(10,8),
  address_lng DECIMAL(11,8),
  address_lat_fuzzy DECIMAL(10,8), -- Tọa độ giả lệch ~300-500m cho bản đồ mờ
  address_lng_fuzzy DECIMAL(11,8),
  -- Thông số
  area DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  floors INTEGER,
  road_width TEXT CHECK (road_width IN ('hem_nho','hem_vua','noi_khu','pho_lon')),
  direction TEXT,
  legal_status TEXT CHECK (legal_status IN (
    'so_do','so_hong','hop_dong','dang_lam','chua_co'
  )),
  year_built INTEGER,
  -- Tiện ích
  has_elevator BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT false,
  has_balcony BOOLEAN DEFAULT false,
  has_rooftop BOOLEAN DEFAULT false,
  is_new_construction BOOLEAN DEFAULT false,
  is_cashflow_property BOOLEAN DEFAULT false,
  -- Media
  images TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  video_url TEXT,
  -- Trạng thái & Labels
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','active','negotiating','matched','sold','expired','removed')),
  moderation_score INTEGER,        -- 0-100, AI chấm
  is_featured BOOLEAN DEFAULT false,
  label_hot BOOLEAN DEFAULT false,        -- "Xem nhiều"
  label_price_drop BOOLEAN DEFAULT false, -- "Đang giảm giá"
  label_new BOOLEAN DEFAULT false,        -- "Mới đăng" (< 72h)
  label_negotiating BOOLEAN DEFAULT false, -- "Đang giao dịch"
  label_good_deal BOOLEAN DEFAULT false,  -- "Nhà ngon" (thủ công)
  label_flexible BOOLEAN DEFAULT false,   -- "Thương lượng"
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  -- Counters (denormalized để query nhanh)
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  -- Timestamps
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  last_price_change_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_city ON listings(city_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_purpose ON listings(purpose);
CREATE INDEX idx_listings_district ON listings(address_district_old);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_slug ON listings(slug);
```

### 4.4 Price History (cho label "Vừa giảm giá")

```sql
CREATE TABLE price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  old_price BIGINT,
  new_price BIGINT,
  change_pct DECIMAL(5,2), -- % thay đổi (âm = giảm)
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);
-- Label "Đang giảm giá" chỉ gán khi: change_pct 
```

### 4.5 Saved Searches (Smart Notification)

```sql
CREATE TABLE saved_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  city_id TEXT DEFAULT 'hcm',
  name TEXT,                    -- User đặt tên cho search này
  criteria JSONB NOT NULL,      -- {purpose, property_type, price_min, price_max, ...}
  notify_new BOOLEAN DEFAULT true,
  notify_price_drop BOOLEAN DEFAULT true,
  notify_hot BOOLEAN DEFAULT false,
  frequency TEXT DEFAULT 'daily'
    CHECK (frequency IN ('instant','daily','weekly','off')),
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.6 Negotiations (Đàm phán giá)

```sql
CREATE TABLE negotiations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  buyer_id UUID REFERENCES profiles(id),
  -- Offer hiện tại
  current_offer BIGINT,
  current_note TEXT,            -- Ghi chú của khách
  round INTEGER DEFAULT 1,      -- Vòng đàm phán (tối đa 3)
  -- Phản hồi của chủ
  counter_offer BIGINT,
  counter_note TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','countered','accepted','rejected','expired')),
  expires_at TIMESTAMPTZ,       -- Auto expire sau 48h
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Chỉ chủ nhà thấy tất cả negotiations của listing mình
-- Khách chỉ thấy negotiation của mình
```

### 4.7 Schedules (Hẹn giờ xem nhà)

```sql
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  owner_id UUID REFERENCES profiles(id),
  visitor_id UUID REFERENCES profiles(id),
  broker_id UUID REFERENCES profiles(id),  -- Môi giới phụ trách nếu có
  -- Thời gian
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  -- QR check-in
  qr_token TEXT UNIQUE,
  qr_expires_at TIMESTAMPTZ,
  owner_checked_in_at TIMESTAMPTZ,
  visitor_checked_in_at TIMESTAMPTZ,
  -- Trạng thái
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','completed','cancelled','no_show')),
  -- Auto-cancel nếu 1 bên không confirm sau 24h
  auto_cancel_at TIMESTAMPTZ,
  cancel_reason TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.8 Matches

```sql
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  owner_id UUID REFERENCES profiles(id),
  buyer_id UUID REFERENCES profiles(id),
  broker_id UUID REFERENCES profiles(id),
  negotiation_id UUID REFERENCES negotiations(id),
  schedule_id UUID REFERENCES schedules(id),
  -- Giá trị giao dịch
  transaction_value BIGINT,
  -- Hoa hồng
  commission_total DECIMAL(5,4),   -- % tổng (VD: 0.003 = 0.3%)
  commission_platform BIGINT,       -- Số tiền platform nhận (VND)
  commission_broker BIGINT,         -- Số tiền môi giới nhận (VND)
  broker_reward BIGINT DEFAULT 0,   -- Thưởng thêm từ chủ nhà
  -- Hợp đồng
  contract_type TEXT DEFAULT 'pdf'
    CHECK (contract_type IN ('pdf','otp','esign')),
  contract_url TEXT,
  contract_signed_at TIMESTAMPTZ,
  -- Trạng thái
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','completed','disputed','cancelled')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.9 Commissions

```sql
CREATE TABLE commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id),
  broker_id UUID REFERENCES profiles(id),
  platform_amount BIGINT,
  broker_amount BIGINT,
  broker_reward_amount BIGINT DEFAULT 0,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','paid','disputed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.10 Notifications

```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'new_listing','price_drop','match_request','qr_reminder',...
  title TEXT,
  message TEXT,
  data JSONB,          -- Extra data (listing_id, schedule_id, v.v.)
  is_read BOOLEAN DEFAULT false,
  sent_via TEXT[],     -- ['email','zalo_zns']
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.11 Neighborhood Reviews (sau match)

```sql
CREATE TABLE neighborhood_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES profiles(id),
  ward_new TEXT,            -- Phường mới
  district_old TEXT,        -- Quận cũ
  -- Đánh giá (1-5)
  safety_score INTEGER CHECK (safety_score BETWEEN 1 AND 5),
  flood_score INTEGER CHECK (flood_score BETWEEN 1 AND 5),  -- 5 = không ngập
  traffic_score INTEGER CHECK (traffic_score BETWEEN 1 AND 5),
  amenity_score INTEGER CHECK (amenity_score BETWEEN 1 AND 5),
  overall_score INTEGER CHECK (overall_score BETWEEN 1 AND 5),
  comment TEXT,
  -- Chỉ cho phép review sau khi match thành công tại khu vực đó
  match_id UUID REFERENCES matches(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.12 Rate Limiting

```sql
CREATE TABLE rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, action, window_start)
);

CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID, p_action TEXT, p_limit INTEGER, p_window_minutes INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO current_count
  FROM rate_limits
  WHERE user_id = p_user_id
    AND action = p_action
    AND window_start > NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  RETURN current_count < p_limit;
END;
$$ LANGUAGE plpgsql;
```

---
## PHẦN 5: SỰ KIỆN GIỮA CÁC MODULE (CustomEvent)
---

```javascript
// Nguyên tắc: Modules không import lẫn nhau — giao tiếp qua CustomEvent

EVENTS:
auth:ready          → {user, role, trust_level, city_id}
auth:guest          → {}
auth:changed        → {user, role}
filter:changed      → {criteria, priority[]}
listings:loaded     → {count, top_score}
match:requested     → {match_id, listing_id}
match:confirmed     → {match_id, qr_urls[]}
negotiate:submitted → {negotiation_id, offer_amount}
negotiate:countered → {negotiation_id, counter_amount}
schedule:confirmed  → {schedule_id, time, qr_token}
notification:new    → {type, message, link}
label:updated       → {listing_id, labels[]}
price:dropped       → {listing_id, old_price, new_price, pct}
toast:show          → {message, type}  -- 'success'|'error'|'info'|'warning'
```

---
## PHẦN 6: SPRINT ROADMAP THỰC TẾ
---

```
SPRINT 1 — Nền móng (Tuần 1-2):
🔴 Setup Supabase (staging + production)
🔴 Chạy toàn bộ SQL migration (theo thứ tự Phần 4)
🔴 Verify RLS với account user thường
?? js/config.js + js/supabase.js
🔴 js/auth.js: login, logout, role routing
🔴 js/i18n.js: skeleton Việt (quan trọng — làm ngay Sprint 1)
🔴 auth.html: form đăng ký/đăng nhập
🔴 css/style.css: design system hoàn chỉnh (TÁCH HOÀN TOÀN khỏi JS)
🔴 Setup Sentry + .env
🟡 Đăng ký Zalo Business + bắt đầu process duyệt ZNS
MILESTONE: Auth hoạt động, DB sẵn sàng

SPRINT 2 — Core Listing (Tuần 3-4):
🔴 index.html: hero + AI search form
🔴 listings.html + js/listings.js
🔴 js/filter.js: filter + sort + URL sync + debounce
🔴 js/labels.js: label system tự động
🔴 js/price-tier.js: phân tier giá HCM
🔴 js/address-mapper.js: map địa chỉ cũ/mới
🔴 detail.html + js/detail.js (3 tầng địa chỉ theo trust level)
🔴 js/calculator.js: ROI + vay ngân hàng (công thức đơn giản)
🔴 SEO: slug, meta tags, Schema, sitemap, robots.txt
🔴 Deploy Vercel + test mobile thật
🟡 dashboard-owner/post-listing.html (form hybrid)
🟡 js/upload.js: ảnh lên Supabase Storage → WebP
MILESTONE: Có thể đăng listing và khách xem được

SPRINT 3 — AI + Negotiation (Tuần 5-6):
🔴 Edge Function: ai-chatbot (AI filter tự nhiên)
🔴 Edge Function: ai-describe-listing (rewrite mô tả)
🔴 Edge Function: ai-moderate (chấm điểm 0-100)
🔴 js/negotiate.js + negotiate.html (blind auction)
🔴 js/notifications.js + saved search
🔴 js/nearby.js: Google Places API (tiện ích khu vực)
🟡 Edge Function: ai-search-match
🟡 js/commute.js: commute time filter
🟡 Thêm tiếng Anh vào i18n.js
MILESTONE: AI hoạt động, negotiation flow hoàn chỉnh

SPRINT 4 — Dashboard + Automation (Tuần 7-8):
🔴 dashboard-owner/ hoàn chỉnh (bao gồm negotiations + rewards)
🔴 dashboard-broker/ (cho 10 môi giới đối tác)
🔴 dashboard-admin/ (bao gồm commissions)
🔴 js/scoring.js: hệ thống chấm điểm
🔴 Migrate Make.com → n8n self-host
🔴 Edge Function: content-generator (sinh bài blog)
🔴 n8n: workflow tự động post content lên Facebook + Zalo OA
🟡 Zalo ZNS (nếu đã được duyệt từ Sprint 1)
MILESTONE: Chủ nhà + môi giới tự vận hành được

SPRINT 5 — Match System (Tuần 9-11):
🔴 match.html + js/match.js
🔴 js/schedule.js (chọn giờ đẹp + QR check-in)
🔴 Edge Function: generate-qr + validate-qr
🔴 Edge Function: generate-contract (PDF → OTP)
🔴 Edge Function: intervention-engine
🔴 Edge Function: send-notification (Email + Zalo ZNS)
🔴 Commissions flow hoàn chỉnh
🟡 Tiếng Trung + Tiếng Hàn (i18n)
🟡 Neighborhood reviews (sau match)
MILESTONE: Match system hoàn chỉnh end-to-end

SPRINT 6 — Polish & Launch (Tuần 12-14):
🔴 Performance audit (Lighthouse ≥ 85 mobile)
🔴 Security review (RLS + Edge Functions)
🔴 PWA manifest + service worker
🔴 llms.txt + FAQ page + blog đầu tiên
🔴 Google Search Console setup
🔴 Launch checklist đầy đủ
🟡 js/payment.js (VNPay) nếu bắt đầu thu phí
🟡 Edge Function: ai-price-suggest (gợi ý giá offer)
MILESTONE: LAUNCH
```

---
## PHẦN 7: ENVIRONMENT SETUP
---

```bash
# .env.local (KHÔNG commit lên Git)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...  # Chỉ Edge Functions

# Edge Function env (Supabase dashboard)
CLAUDE_API_KEY=sk-ant-...
SENDGRID_API_KEY=SG...
ZALO_ZNS_SECRET=xxx
MAKE_WEBHOOK_SECRET=xxx
VNPAY_HASH_SECRET=xxx
SENTRY_DSN=https://xxx@sentry.io/xxx
GOOGLE_MAPS_KEY=xxx
GOOGLE_PLACES_KEY=xxx
```

---
*Đọc tiếp: BDS-CODE.md (patterns code) | BDS-HCM-CONTEXT.md (data HCM)*

