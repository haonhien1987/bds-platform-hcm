#!/bin/bash
# ============================================================
# BDS Platform HCM — Scaffold folder structure
# Chạy 1 lần trong thư mục gốc của project: bash setup-folders.sh
# ============================================================

echo "🏗️  Tạo folder structure cho BDS Platform HCM..."

# ─── ROOT HTML PAGES ─────────────────────────────────────────
touch index.html              # Landing + AI search
touch listings.html           # Danh sách + bộ lọc
touch detail.html             # Chi tiết listing (?slug=xxx)
touch compare.html            # So sánh 2-3 listing
touch auth.html               # Đăng ký / đăng nhập
touch saved.html              # Đã lưu [cần đăng nhập]
touch match.html              # Match flow [trust_level >= 4]
touch schedule.html           # Chọn giờ xem nhà
touch negotiate.html          # Đàm phán giá
touch faq.html                # FAQ (AEO - được AI cite)
touch robots.txt
touch sitemap.xml
touch llms.txt                # AEO: mô tả platform cho AI crawlers
touch manifest.json           # PWA

# ─── DASHBOARD OWNER ─────────────────────────────────────────
mkdir -p dashboard-owner
touch dashboard-owner/index.html          # Tổng quan + stats
touch dashboard-owner/post-listing.html  # Đăng tin mới
touch dashboard-owner/edit-listing.html
touch dashboard-owner/my-listings.html
touch dashboard-owner/leads.html         # Khách quan tâm
touch dashboard-owner/negotiations.html  # Các offer đang nhận
touch dashboard-owner/match-requests.html
touch dashboard-owner/schedule.html
touch dashboard-owner/qr-codes.html
touch dashboard-owner/rewards.html       # Set thưởng cho môi giới
touch dashboard-owner/profile.html

# ─── DASHBOARD ADMIN ─────────────────────────────────────────
mkdir -p dashboard-admin
touch dashboard-admin/index.html         # KPIs + alerts
touch dashboard-admin/listings.html
touch dashboard-admin/users.html
touch dashboard-admin/verifications.html # Duyệt thủ công score < 70
touch dashboard-admin/matches.html
touch dashboard-admin/commissions.html
touch dashboard-admin/reports.html
touch dashboard-admin/moderation.html

# ─── DASHBOARD BROKER ────────────────────────────────────────
mkdir -p dashboard-broker
touch dashboard-broker/index.html        # Dashboard + hoa hồng
touch dashboard-broker/my-listings.html
touch dashboard-broker/leads.html
touch dashboard-broker/rewards.html      # Thưởng đang active
touch dashboard-broker/profile.html      # Rating + lịch sử

# ─── CSS ─────────────────────────────────────────────────────
mkdir -p css
touch css/style.css        # Design system (tokens, reset, utilities)
touch css/components.css   # Components: card, badge, toast, modal
touch css/filter.css       # UI bộ lọc tìm kiếm
touch css/dashboard.css    # Layout dashboard chung
touch css/negotiate.css    # UI đàm phán giá
touch css/chatbot.css      # Widget chatbot AI

# ─── JS ──────────────────────────────────────────────────────
mkdir -p js
touch js/config.js         # Constants, Supabase keys (public only)
touch js/supabase.js       # Supabase client + auth state
touch js/auth.js           # Auth flow + role routing
touch js/i18n.js           # Đa ngôn ngữ (bắt đầu tiếng Việt)
touch js/utils.js          # Helpers: formatBDSPrice, validatePhone, slug...
touch js/listings.js       # Danh sách listing + pagination
touch js/filter.js         # Filter + sort + URL sync + debounce
touch js/ai-search.js      # AI search (Sprint 3)
touch js/detail.js         # Trang chi tiết listing
touch js/compare.js        # So sánh listing
touch js/chatbot.js        # Widget chatbot
touch js/match.js          # Match flow
touch js/negotiate.js      # Đàm phán giá (blind auction)
touch js/schedule.js       # Chọn giờ + QR
touch js/qr.js             # QR code generation
touch js/labels.js         # Label system (tự động + thủ công)
touch js/notifications.js  # Smart notification + saved search
touch js/address-mapper.js # Map địa chỉ cũ/mới sau sáp nhập
touch js/price-tier.js     # Logic phân tier giá HCM
touch js/commute.js        # Commute time filter (Sprint 3)
touch js/calculator.js     # ROI + vay ngân hàng + so sánh thuê/mua
touch js/nearby.js         # Tiện ích khu vực (Google Places)
touch js/contract.js       # Hợp đồng điện tử
touch js/payment.js        # VNPay (giai đoạn 2)
touch js/upload.js         # Upload ảnh → Supabase Storage → WebP
touch js/share.js          # Chia sẻ listing
touch js/seo.js            # Dynamic meta tags + Schema.org
touch js/analytics.js      # GA4 + Sentry
touch js/scoring.js        # Hệ thống chấm điểm user

# ─── SUPABASE EDGE FUNCTIONS ─────────────────────────────────
mkdir -p supabase/functions/ai-chatbot
mkdir -p supabase/functions/ai-describe-listing
mkdir -p supabase/functions/ai-search-match
mkdir -p supabase/functions/ai-compare
mkdir -p supabase/functions/ai-moderate
mkdir -p supabase/functions/ai-price-suggest
mkdir -p supabase/functions/generate-qr
mkdir -p supabase/functions/validate-qr
mkdir -p supabase/functions/generate-contract
mkdir -p supabase/functions/send-notification
mkdir -p supabase/functions/score-calculator
mkdir -p supabase/functions/intervention-engine
mkdir -p supabase/functions/content-generator
mkdir -p supabase/functions/update-sitemap

# ─── ASSETS ──────────────────────────────────────────────────
mkdir -p assets/images
mkdir -p assets/icons

# ─── CONFIG FILES ────────────────────────────────────────────
touch .env.example    # Template .env — commit lên Git
touch .gitignore

echo ""
echo "✅ Xong! Folder structure đã sẵn sàng."
echo ""
echo "📋 Bước tiếp theo:"
echo "   1. Chạy migration_001_initial.sql trong Supabase SQL Editor (staging)"
echo "   2. Điền thông tin vào .env.example → copy thành .env.local"
echo "   3. Điền SUPABASE_URL và SUPABASE_ANON_KEY vào js/config.js"
echo ""
echo "🌳 Cấu trúc đã tạo:"
find . -type f | grep -v '.git' | sort
