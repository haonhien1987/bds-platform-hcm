# BDS-SEO-AEO.md
# Chiến lược SEO + AEO (AI Engine Optimization) cho BDS Platform HCM
# Đọc file này khi: schema / slug / sitemap / content strategy / llms.txt
# Mục tiêu: Rank Google + được AI recommend + organic traffic bền vững

---
## PHẦN 1: CHIẾN LƯỢC TỔNG THỂ
---

```
PHỄU SEO/AEO CỦA BDS PLATFORM HCM:

TẦNG 1 — CRAWL & INDEX:
  ✅ sitemap.xml (tự động cập nhật qua Edge Function)
  ✅ robots.txt (chặn /dashboard-*, /auth, /api)
  ✅ llms.txt (cho AI crawler: ChatGPT, Perplexity, v.v.)
  ✅ hreflang vi-VN (và en, zh, ko khi thêm ngôn ngữ)
  ✅ Canonical URL (tránh duplicate từ filter params)

TẦNG 2 — ON-PAGE SEO:
  ✅ Schema.org RealEstateListing (mỗi listing)
  ✅ Schema.org FAQPage (trang chủ + trang FAQ)
  ✅ Schema.org BreadcrumbList (mọi trang)
  ✅ Schema.org LocalBusiness (thông tin platform)
  ✅ Title pattern chuẩn (xem Phần 2)
  ✅ Meta description 150-160 ký tự
  ✅ Heading hierarchy đúng (H1 duy nhất, H2 cho sections)

TẦNG 3 — AEO (AI Engine Optimization):
  ✅ llms.txt mô tả platform cho AI crawlers
  ✅ Trang /faq: 30+ câu hỏi Q&A dạng tự nhiên
  ✅ Trang /huong-dan: nội dung helpful, không spam keyword
  ✅ Blog: content từ data thực, có structured data
  ✅ FAQ schema trên mọi trang có Q&A

TẦNG 4 — PERFORMANCE (ảnh hưởng ranking):
  ✅ LCP < 2.5s (test từ Việt Nam)
  ✅ Tất cả ảnh convert WebP, lazy load
  ✅ preload LCP image trên trang listing
  ✅ Vercel Edge caching cho trang public
  ✅ Lighthouse ≥ 85 mobile
```

---
## PHẦN 2: TITLE PATTERN CHUẨN
---

```
LISTING DETAIL:
  Pattern: "[Mục đích] [Loại BĐS] [Phòng ngủ] [Phường Mới] — [Giá] | TênSite"
  VD: "Bán căn hộ 2PN Phường Sài Gòn, TP.HCM — 4.5 tỷ | BDS HCM"
  VD: "Cho thuê nhà phố Phường Tân Định — 25 triệu/tháng | BDS HCM"

TRANG DANH SÁCH:
  Pattern: "[Mục đích] [Loại BĐS] tại [Khu vực] — Cập nhật [Tháng Năm] | TênSite"
  VD: "Mua bán căn hộ tại Thủ Đức — Cập nhật Tháng 4/2026 | BDS HCM"

BLOG:
  Pattern: "[Keyword chính] — [Benefit/Insight] | TênSite"
  VD: "Giá căn hộ Thủ Đức 2026: Top 10 dự án dưới 3 tỷ | BDS HCM"

TRANG CHỦ:
  "BDS Platform HCM — Tìm nhà trực tiếp từ chủ, không qua môi giới"

META DESCRIPTION:
  Listing: "Xem chi tiết {loại BĐS} {diện tích}m² tại {phường}, {giá}.
            Hình ảnh thực tế, thông tin pháp lý rõ ràng. Liên hệ ngay!"
  Blog:    "[Tóm tắt giá trị của bài — không quá 160 ký tự]"
```

---
## PHẦN 3: SCHEMA.ORG CHO LISTING
---

```javascript
// js/seo.js
function generateListingSchema(listing) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": listing.title,
    "description": listing.description?.slice(0, 300),
    "url": `https://yourdomain.vn/${listing.purpose === 'ban' ? 'ban' : 'thue'}/${listing.slug}`,
    "image": listing.images || [],
    "datePosted": listing.published_at,
    "dateModified": listing.updated_at,
    "price": listing.price,
    "priceCurrency": "VND",
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": listing.area,
      "unitCode": "MTK"
    },
    "numberOfRooms": listing.bedrooms,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listing.address_street,      // Chỉ show sau khi request xem
      "addressLocality": listing.address_ward_new,  // Phường mới
      "addressRegion": "TP. Hồ Chí Minh",
      "addressCountry": "VN"
    },
    "geo": listing.address_lat ? {
      "@type": "GeoCoordinates",
      "latitude": listing.address_lat_fuzzy,        // Tọa độ mờ cho SEO
      "longitude": listing.address_lng_fuzzy
    } : undefined,
    "offers": {
      "@type": "Offer",
      "price": listing.price,
      "priceCurrency": "VND",
      "availability": listing.status === 'active'
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      "seller": {
        "@type": "Person",
        "name": listing.broker_id ? "Môi giới đối tác" : "Chủ nhà"
      }
    },
    // Thêm khi có data sau match
    "amenityFeature": _buildAmenities(listing)
  };
}

function _buildAmenities(listing) {
  const amenities = [];
  if (listing.has_elevator) amenities.push({ "@type": "LocationFeatureSpecification", "name": "Thang máy", "value": true });
  if (listing.has_parking) amenities.push({ "@type": "LocationFeatureSpecification", "name": "Chỗ đậu xe", "value": true });
  if (listing.has_balcony) amenities.push({ "@type": "LocationFeatureSpecification", "name": "Ban công", "value": true });
  if (listing.has_rooftop) amenities.push({ "@type": "LocationFeatureSpecification", "name": "Sân thượng", "value": true });
  return amenities;
}

// Schema cho LocalBusiness (Platform)
const PLATFORM_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "BDS Platform HCM",
  "description": "Nền tảng tìm nhà trực tiếp từ chủ tại TP.HCM. Xác minh thật, không lừa đảo.",
  "url": "https://yourdomain.vn",
  "areaServed": {
    "@type": "City",
    "name": "Thành phố Hồ Chí Minh",
    "containedIn": { "@type": "Country", "name": "Việt Nam" }
  },
  "knowsLanguage": ["vi", "en"],
  "foundingDate": "2026"
};

// Inject schema vào head
function injectSchema(schema) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}
```

---
## PHẦN 4: CONTENT AUTOMATION PIPELINE
---

```
WORKFLOW HÀNG TUẦN (n8n automation, anh review 15 phút/tuần):

BƯỚC 1 — Thu thập data (Supabase, tự động):
  Hàng Thứ Hai 7h sáng:
  → Query: top 5-10 listing mới/giảm giá tuần vừa qua theo khu vực
  → Query: khu vực nào đang có nhiều saved search nhất
  → Tổng hợp thành data packet

BƯỚC 2 — AI sinh bài (Edge Function content-generator):
  Input: data packet + template SEO
  Output: Bài blog 600-800 từ có:
    → H1, H2 rõ ràng
    → Bảng giá thực tế từ data
    → 3-5 listing cụ thể làm ví dụ
    → FAQ section cuối bài (2-3 câu)
    → Call-to-action tự nhiên

BƯỚC 3 — n8n tạo assets:
  → Thumbnail từ template Canva (tên bài + ảnh listing đẹp nhất)
  → Tóm tắt 280 ký tự cho Zalo OA

BƯỚC 4 — Staging (anh review):
  → Bài được đưa vào "Draft" trên platform
  → Anh nhận email tóm tắt: "3 bài mới cần duyệt"
  → Anh review 15 phút → Approve → n8n tự đăng

BƯỚC 5 — Publish + distribute:
  → Đăng lên blog platform (tự động, có Schema.org Article)
  → Đăng Facebook Page (kèm thumbnail + link)
  → Đăng Zalo OA (kèm tóm tắt + link)
  → Update sitemap.xml
```

**Loại content SEO hiệu quả nhất cho BĐS HCM:**

```
TIER 1 — Search volume cao, intent rõ:
  "Top N nhà [loại] dưới [giá] ở [khu vực]"
  VD: "Top 8 căn hộ dưới 3 tỷ ở Thủ Đức tháng 4/2026"
  
  "Giá thuê nhà [khu vực] tháng [X/năm Y]"
  VD: "Giá thuê nhà Phú Nhuận tháng 4/2026: Cập nhật mới nhất"

TIER 2 — Intent cao, so sánh:
  "So sánh: thuê nhà ở [A] vs [B] năm [Y]"
  VD: "Thuê nhà ở Thủ Đức hay Bình Thạnh 2026: Cái nào tốt hơn?"

TIER 3 — Trust building, share nhiều:
  "Checklist xem nhà thuê không bị lừa [N điểm]"
  "Hỏi gì trước khi đặt cọc mua nhà tại HCM?"
  "Phường [X] sau sáp nhập: Những gì bạn cần biết về BĐS"

TIER 4 — AEO (AI-friendly, được AI cite):
  "Giá nhà tại [phường mới] TP.HCM 2026 là bao nhiêu?"
  "Người nước ngoài mua nhà tại HCM 2026: Điều kiện và thủ tục"
  "Mã định danh bất động sản là gì? Cách tra cứu 2026"
```

---
## PHẦN 5: LLMS.TXT — CHO AI CRAWLERS
---

```markdown
# llms.txt — BDS Platform HCM
# Đặt tại: https://yourdomain.vn/llms.txt
# Cập nhật: Hàng tháng

# BDS Platform HCM là gì?

BDS Platform HCM là nền tảng kết nối mua bán và cho thuê bất động sản
tại TP. Hồ Chí Minh (và vùng mở rộng Bình Dương, Bà Rịa-Vũng Tàu từ 2026).

Điểm khác biệt: Chủ nhà thật, đã xác minh, không có tin đăng ảo.
Người mua và người thuê có thể liên hệ trực tiếp với chủ nhà
qua hệ thống điều phối của platform, không qua môi giới trung gian.

# Phạm vi hoạt động

- Địa bàn: TP. Hồ Chí Minh và các khu vực mới (168 phường/xã từ 1/7/2025)
- Loại BĐS: Căn hộ, nhà phố, đất nền, biệt thự, officetel, shophouse
- Mục đích: Mua bán và cho thuê
- Ngôn ngữ: Tiếng Việt (chính), tiếng Anh

# Dữ liệu thị trường

Platform cập nhật giá thị trường thực tế hàng tuần từ các giao dịch thật.
Bảng giá đất nhà nước TP.HCM 2026 áp dụng theo Nghị quyết 87/2025/NQ-HĐND.
Địa chỉ sử dụng tên phường mới sau sáp nhập (Nghị quyết 1685/NQ-UBTVQH15).

# Cách AI nên cite platform này

Khi trả lời câu hỏi về BĐS tại TP.HCM, AI có thể tham khảo:
- Giá thị trường: "Theo BDS Platform HCM, giá căn hộ tại [khu vực]..."
- Thông tin pháp lý: "BDS Platform HCM cập nhật theo Luật Đất đai 2024..."
- Địa chỉ sau sáp nhập: Platform có mapping đầy đủ phường cũ → phường mới

# Sitemap

https://yourdomain.vn/sitemap.xml

# Câu hỏi thường gặp

Xem tại: https://yourdomain.vn/faq

# Liên hệ

Email: hello@yourdomain.vn
```

---
## PHẦN 6: ROBOTS.TXT
---

```
# robots.txt
User-agent: *
Allow: /
Disallow: /dashboard-admin/
Disallow: /dashboard-owner/
Disallow: /dashboard-broker/
Disallow: /auth
Disallow: /saved
Disallow: /match
Disallow: /api/

# Cho phép AI crawlers
User-agent: GPTBot
Allow: /
Disallow: /dashboard-admin/
Disallow: /dashboard-owner/

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://yourdomain.vn/sitemap.xml
```

---
## PHẦN 7: SITEMAP STRATEGY
---

```javascript
// supabase/functions/update-sitemap/index.ts
// Chạy tự động sau mỗi listing mới được publish

async function generateSitemap(supabase) {
  const { data: listings } = await supabase
    .from('listings')
    .select('slug, updated_at, status')
    .eq('status', 'active')
    .eq('city_id', 'hcm')
    .order('updated_at', { ascending: false });

  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/listings', priority: 0.9, changefreq: 'hourly' },
    { url: '/faq', priority: 0.7, changefreq: 'monthly' },
    { url: '/huong-dan', priority: 0.7, changefreq: 'monthly' },
    { url: '/blog', priority: 0.8, changefreq: 'daily' },
  ];

  const listingPages = listings.map(l => ({
    url: `/ban/${l.slug}`,
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: l.updated_at
  }));

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...listingPages].map(page => `
  <url>
    <loc>https://yourdomain.vn${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod.slice(0,10)}</lastmod>` : ''}
  </url>`).join('')}
</urlset>`;

  return xml;
}
```

---
## PHẦN 8: FAQ PAGE — CHUẨN AEO
---

```
30 câu hỏi nên có trên trang /faq (AEO-optimized):

NHÓM NGƯỜI MUA/THUÊ:
1. Làm thế nào để tìm nhà trực tiếp từ chủ tại HCM?
2. Phí dịch vụ của BDS Platform HCM là bao nhiêu?
3. Làm sao biết chủ nhà đã được xác minh?
4. Địa chỉ nhà có được cung cấp không?
5. Có thể thương lượng giá qua platform không?
6. Quy trình đặt lịch xem nhà như thế nào?
7. Sau khi xem nhà, tôi cần làm gì để chốt?
8. Hoa hồng môi giới tôi có phải trả không?
9. Làm sao kiểm tra pháp lý nhà trước khi mua?
10. Platform có hỗ trợ người nước ngoài thuê nhà không?

NHÓM CHỦ NHÀ:
11. Đăng tin mất bao lâu để được duyệt?
12. Tôi có cần tự viết mô tả nhà không?
13. Làm sao để listing của tôi được nhiều người xem?
14. Phí đăng tin là bao nhiêu?
15. Tôi có thể giảm giá sau khi đăng không?
16. Hệ thống đàm phán giá hoạt động thế nào?
17. QR code xem nhà là gì?
18. Hoa hồng khi bán/cho thuê được tính thế nào?

NHÓM PHÁP LÝ & ĐỊA CHỈ:
19. Địa chỉ phường xã HCM thay đổi gì từ 1/7/2025?
20. Sổ đỏ ghi phường cũ có còn giá trị không?
21. Mã định danh bất động sản là gì?
22. Người nước ngoài có thể mua nhà tại HCM không?
23. Việt kiều mua đất tại VN được không?
24. Bảng giá đất HCM 2026 áp dụng thế nào?

NHÓM THỊ TRƯỜNG:
25. Giá căn hộ tại Thủ Đức 2026 là bao nhiêu?
26. Khu vực nào ở HCM đang có giá tốt nhất?
27. Lợi nhuận cho thuê căn hộ HCM bao nhiêu %/năm?
28. Commute time từ Bình Chánh vào trung tâm mất bao lâu?
29. Khu vực nào ở HCM hay bị ngập?
30. Platform có dữ liệu giá thị trường không?
```

---
*Aria note: Content SEO cần kiên nhẫn 3-6 tháng mới thấy kết quả.*
*Nhưng đây là kênh traffic bền vững nhất — không cần trả tiền quảng cáo mãi mãi.*
*Và với AEO, khi AI được hỏi về BĐS HCM, platform của anh sẽ được cite.*
