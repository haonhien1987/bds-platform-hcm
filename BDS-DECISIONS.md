# BDS-DECISIONS.md
# Toàn bộ quyết định đã chốt cho BDS Platform HCM
# Aria cập nhật file này sau mỗi buổi làm việc có quyết định mới
# Đọc file này khi cần biết: "tại sao mình làm vậy?" hoặc "đã chốt gì rồi?"

---
## QUYẾT ĐỊNH ĐÃ CHỐT — Buổi 1 (2026-04)
---

### 1. THỊ TRƯỜNG & MỞ RỘNG

```
QUYẾT ĐỊNH: Bắt đầu với TP.HCM, thiết kế sẵn để mở rộng
LÝ DO: Anh muốn mở rộng địa bàn sau này nhưng chưa biết khi nào.
       Thiết kế sẵn city_id tốn 5 phút nhưng cứu hàng tuần migrate sau.
THỰC HIỆN:
  → Thêm city_id TEXT DEFAULT 'hcm' vào bảng listings và profiles
  → CHECK (city_id IN ('hcm', 'hn', 'dn', 'ct'))
  → Mọi query thêm .eq('city_id', currentCity)
```

### 2. KHÁCH HÀNG MỤC TIÊU — Theo giai đoạn

```
GIAI ĐOẠN 1 (Sprint 1-6):
  → Anh đăng bài để bán cho khách muốn mua.
  → Chủ nhà muốn tự bán/cho thuê không qua môi giới
  → Người mua/thuê muốn tìm nhà trực tiếp từ chủ
  LÝ DO: Core value rõ ràng, dễ marketing, tránh phân tán

GIAI ĐOẠN 2 (Sprint 7-12):
  → Mở thêm môi giới (có trả phí)
  LÝ DO: Lúc này đã có listing, môi giới mới thấy giá trị

GIAI ĐOẠN 3 (Năm 2+):
  → Nhà đầu tư cần phân tích dữ liệu thị trường
  LÝ DO: Cần tối thiểu 6-12 tháng data lịch sử giao dịch
```

### 3. XÁC THỰC DANH TÍNH — Phân tầng, KHÔNG lưu CCCD

```
QUYẾT ĐỊNH: Hệ thống 4 trust level, không yêu cầu CCCD trong DB
LÝ DO: Lưu CCCD = rủi ro pháp lý nếu bị breach (Nghị định 13/2023)
       Tỷ lệ hoàn thành cao hơn khi không yêu cầu quá nhiều

TRUST LEVEL 1 — OTP email + SĐT:
  → Có thể: xem listing, lưu yêu thích
TRUST LEVEL 2 — SĐT verified:
  → Có thể: liên hệ chủ nhà qua platform
TRUST LEVEL 3 — Chủ nhà đăng tin:
  → Xác minh: SĐT + tự khai họ tên + admin gọi điện confirm
  → KHÔNG lưu CCCD trong DB
TRUST LEVEL 4 — Match (giao dịch thật):
  → Ký điều khoản Match online
  → CCCD chỉ yêu cầu khi có tranh chấp (gửi qua email mã hóa)
```

### 4. SEED SUPPLY — 10 MÔI GIỚI ĐỐI TÁC

```
QUYẾT ĐỊNH: Anh Ari mời 10 bạn môi giới vào đăng tin ngay từ đầu
LÝ DO: Tránh cold start problem, có listing ngay khi launch

CẤU TRÚC:
  → Môi giới mặc định sẽ không ẩn danh tuy nhiên anh có thể tạo tài khoản môi giới nội bộ để đăng tin ẩn danh
  → Khách liên hệ qua platform, platform route đến môi giới đúng
  → Sau match: reveal thông tin đầy đủ để hoàn tất giao dịch

HOA HỒNG:( Chỉ áp dụng cho môi giới nội bộ hoặc môi giới ký thỏa thuận phân chia hoa hồng với anh theo form đề xuất )
  → Giai đoạn 1: 0.3% platform / 0.7% môi giới
  → Giai đoạn 2 (sau khi có credibility): 0.8% tổng (điều chỉnh split)
  LÝ DO 0.3%: Cần khuyến khích giao dịch đi qua platform trước

DB CẦN THÊM:
  → profiles.broker_partner BOOLEAN DEFAULT false
  → profiles.broker_referral_code TEXT UNIQUE
  → Bảng commissions (match_id, broker_id, platform_amount, broker_amount, status)
  → listings.broker_reward BIGINT (thưởng thêm nếu chủ nhà set)
```

### 5. BẢN ĐỒ & ĐỊA CHỈ — 3 tầng theo trust level

```
QUYẾT ĐỊNH: Ẩn dần địa chỉ, reveal sau khi user commit
LÝ DO: Tránh bypass platform, tạo lý do đăng ký tài khoản

KHÁCH VÃNG LAI (chưa đăng nhập):
  → Thấy: Tên phường + bản đồ mờ bán kính 500m
  → Mục đích: Tạo tò mò, ép đăng ký

TRUST LEVEL 1 (đã đăng ký):
  → Thấy: Tên đường + số nhà ẩn (VD: "đường Nguyễn Trãi, gần số 100")
  → Mục đích: Đủ biết khu vực, vẫn cần liên hệ qua platform

SAU KHI GỬI YÊU CẦU XEM NHÀ:
  → platform sẽ kết nối với đúng môi giới,anh hoặc chủ nhà tùy theo trường hợp
  → Mục đích: Reward cho user đi đúng flow
```

### 6. NGÔN NGỮ — i18n từ đầu

```
QUYẾT ĐỊNH: Bắt đầu tiếng Việt, thiết kế sẵn i18n từ Sprint 1
LÝ DO: Chi phí thêm i18n từ đầu: 2-3 giờ. Thêm vào sau: 2-3 tuần.

LỘ TRÌNH:
  Sprint 1: Tiếng Việt + file i18n skeleton
  Sprint 3: Thêm tiếng Anh 
  Sprint 5: Tiếng Trung 
  Sprint 6: Tiếng Hàn 

THỰC HIỆN: Toàn bộ text UI trong js/i18n.js, không hardcode trong HTML
```

### 7. CHATBOT AI — Mở rộng dần theo Sprint

```
QUYẾT ĐỊNH: Phương án D — build dần từ đơn giản đến phức tạp
LÝ DO: Chi phí API không đáng kể ở giai đoạn đầu (~$1-4/tháng với 1000 lượt)
       Quan trọng hơn là build đúng thứ đúng lúc

Sprint 3: AI filter (user nói tự nhiên, AI tự hiểu và filter)
          Chi phí ~$0.003/lượt, UX tốt nhất
Sprint 5: AI tư vấn (phong thủy, so sánh khu vực, ROI đầu tư)
Sprint 7: Predictive recommendation (cần 500+ user có lịch sử)

LÝ DO THỨ TỰ: Filter (C) tăng conversion ngay, tư vấn (B) là premium feature
```

### 8. KIỂM DUYỆT LISTING — Label + AI moderate

```
QUYẾT ĐỊNH: Đăng ngay có label → AI moderate → anh xem bị flag
LÝ DO: Cân bằng giữa tốc độ cho chủ nhà và uy tín platform

LABEL TỰ ĐỘNG:
  🟡 "Chờ xác minh"   — AI đang xử lý (< 5 phút)
  🟠 "Chưa xác minh"  — AI duyệt OK, trust_level < 3
  🟢 "Đã xác minh"    — trust_level ≥ 3, lịch sử tốt
  🔴 "Đã báo cáo"     — có khiếu nại, đang xem xét

QUY TRÌNH AI:
  Score ≥ 70: tự động publish có label
  Score < 70: notify anh xem thủ công (~5-10 phút/ngày)

RULE QUAN TRỌNG:
  Label phải reflect thực tế — không fake scarcity
  "Đang giao dịch" tự xóa sau 7 ngày nếu không có update
```

### 9. LABEL HỆ THỐNG — Scarcity + Social proof

```
LABEL TỰ ĐỘNG (hệ thống gán):
  🔴 "Đang giao dịch"  — có match request pending
  🟢 "Mới đăng"        — listing < 72 giờ
  🟡 "Đang giảm giá"    — giá giảm verify từ price_history
  ⭐ "Xem nhiều"       — top 10% listing được view nhiều nhất tuần này
  🏷️ "Thương lượng" — chủ nhà sẵn sàng negotiate

LABEL THỦ CÔNG (môi giới/admin gán):
  👑 "Nhà ngon"         — chất lượng cao, ảnh đẹp, giá hợp lý
  (Giai đoạn 2: thu phí để boost lên label này)

DB CẦN: Bảng price_history để verify "Đang giảm giá"
```

### 10. SMART NOTIFICATION — 2 tầng

```
QUYẾT ĐỊNH: Notification 2 tầng (chủ đề + tần suất) + Digest thay vì spam

TẦNG 1 — Chủ đề (user chọn khi đăng ký):
  □ Nhà mới trong tiêu chí
  □ Nhà giảm giá trong tiêu chí
  □ Nhà ngon / chất lượng cao
  □ Nhà đang giao dịch (FOMO)
  □ Cập nhật giá thị trường khu vực quan tâm

TẦNG 2 — Tần suất:
  ○ Ngay lập tức
  ○ 1 lần/ngày — digest 8h sáng
  ○ 1 lần/tuần
  ○ Tắt hết

THÊM: Saved Search — lưu tiêu chí tìm kiếm + notify khi có listing mới match
LÝ DO: Data quý giá về nhu cầu thị trường từng khu vực
```

### 11. LUỒNG LIÊN LẠC — Không để 2 bên chủ và khách chat trực tiếp

```
QUYẾT ĐỊNH: Chat trực tiếp bị chặn, thay bằng flow có kiểm soát
LÝ DO: Tránh bypass platform, tạo bằng chứng giao dịch

FLOW:
  Khách bấm "Muốn xem nhà"
  → Chủ bấm "Đồng ý gặp"
  → Hiện khung giờ (platform recommend giờ đẹp)
  → Một bên chọn → bên kia xác nhận
  → Auto gửi tin xác nhận + QR
  → Tin nhắn: "Platform là bên điều phối đảm bảo quyền lợi 2 bên"

GIỜ RECOMMEND:
  Weekday: 9h sáng ⭐, 5h chiều ⭐, 7h tối ⭐, 10h sáng ✓
  Weekend: 9h sáng ⭐, 10h30 ⭐, 3h chiều ✓, 4h30 chiều ✓

AUTO-CANCEL: Sau khi có hẹn xem nhà. Nếu 1 bên không confirm sau 12h thì anh hoặc môi giới trực tiếp sẽ liên hệ. Nếu không có phản hồi thì sau 24h sẽ cancel + notify + mở slot
```

### 12. HỢP ĐỒNG ĐIỆN TỬ — Theo giai đoạn

```
GIAI ĐOẠN 1: PDF đẹp (không có giá trị pháp lý chính thức)
GIAI ĐOẠN 2: Chữ ký OTP (bằng chứng nội bộ, gần như miễn phí)
LÝ DO CHỮ KÝ OTP: User phải nhập vào website/app của mình để xác nhận
                   → Tạo evidence rõ ràng hơn
GIAI ĐOẠN 3: FPT.eSign (pháp lý cao nhất, khi đã có revenue)

GHI CHÚ: Cần hợp đồng có giá trị pháp lý để thu hoa hồng 0.8%
```

### 13. THƯƠNG LƯỢNG GIÁ — Blind auction một chiều

```
QUYẾT ĐỊNH: Khách submit offer ẩn với nhau, chủ thấy toàn bộ
LÝ DO: Tránh race-to-bottom và bid war giả tạo

FLOW:
  Khách: Nhập giá + ghi chú → Submit (CHỈ chủ thấy)
  Chủ: Thấy all offers → Accept / Counter / Từ chối / Ignore
  Tối đa 3 vòng counter → hết không chốt thì expire 48h

PLATFORM INTERVENTION (khi nào xuất hiện):
  1. Listing sắp hết hạn (còn 5 ngày) mà chưa match
  2. Đàm phán stall (qua 2 vòng counter, còn 48h)
  3. Khách xem >3 lần trong 7 ngày nhưng không action
  4. Chủ giảm giá → notify khách từng xem nhưng không contact
LÝ DO: Platform can thiệp = justify hoa hồng một cách tự nhiên
```

### 14. CHẤT LƯỢNG LISTING — Form hybrid + AI rewrite

```
QUYẾT ĐỊNH: 2 đường vào, AI hoàn thiện cả 2

ĐƯỜNG 1: Chủ viết mô tả ngắn → AI rewrite thành chuẩn 200-250 từ
ĐƯỜNG 2: Chủ điền form có cấu trúc → AI xuất listing

FORM CẤU TRÚC:
  Phần 1: Thông số cứng (dropdown/number) — không cần AI
  Phần 2: Mô tả tự do (≤500 ký tự, optional) — AI rewrite
  Phần 3: Upload ảnh (bắt buộc ≥4 ảnh, AI detect ảnh mờ/tối)
  KHÔNG có phần ghi chú thêm — giữ gọn

GIẢM GIÁ: Chủ set → update ngay → trigger notify chain
THƯỞNG MÔI GIỚI: Chủ set mức thưởng → broadcast đến broker network
```

### 15. ZALO STRATEGY — Đăng ký ZNS ngay, Email trước

```
QUYẾT ĐỊNH: Email trước, ZNS khi được duyệt, OA sau Sprint 4
LÝ DO ZNS > OA cho giao dịch: Tỷ lệ đọc >90%, không cần user follow trước
LÝ DO EMAIL TRƯỚC: ZNS mất 1-2 tuần duyệt → đăng ký song song ngay bây giờ

HÀNH ĐỘNG NGAY: Đăng ký Zalo Business account để bắt đầu process duyệt ZNS
```

### 16. AUTOMATION —n8n 

```

CONTENT AUTOMATION PIPELINE (n8n):
  Hàng tuần: Query top listing → AI viết bài blog → Post Facebook + Zalo OA
  Anh review 15 phút/tuần trước khi publish
  Loại content: "Top N nhà [loại] dưới [giá] ở [khu vực]"
```

### 17. LỢI THẾ CẠNH TRANH — TRUST

```
QUYẾT ĐỊNH: Lợi thế duy nhất = TRUST
            "Chủ nhà thật, xác minh được, không bị lừa"
LÝ DO: Batdongsan có 5M listing nhưng 70% rác, không xác minh được
        Trust là thứ khó copy nhất — cần thời gian để build

NGUYÊN TẮC DẪN ĐẠO:
"Mọi tính năng đều phải trả lời: cái này làm tăng hay giảm
 mức độ tin tưởng giữa các bên?"

PHÒNG THỦ TRƯỚC ĐỐI THỦ: Network effect + trust data
  → Người tốt attract người tốt
  → Đối thủ có thể copy features, không copy được community
```

### 18. METRIC 6 THÁNG — Số match thành công

```
QUYẾT ĐỊNH: Metric chính = số match thành công
LÝ DO: Không thể giả được — listing anh tự làm được,
        traffic anh chạy quảng cáo được,
        nhưng match thành công = platform thật sự tạo ra giá trị
```

### 19. TÍNH NĂNG TỪ CÁC SÀN QUỐC TẾ — Theo Sprint

```
SPRINT 1-2 (làm ngay):
  → Lịch sử giá listing (thêm bảng price_history trong DB)
  → ROI calculator cho thuê (công thức đơn giản)
  → Tính vay ngân hàng (không cần API)
  → Điểm tiện ích khu vực (Google Places API, cache)
  → Response time tracking (tự động từ data)
  → Listing performance dashboard cho chủ nhà

SPRINT 3-4:
  → Commute time filter (Google Maps Distance Matrix API)
  → So sánh giá với thị trường khu vực
  → Đánh giá khu vực bởi cư dân (sau match)
  → AI explain "vì sao phù hợp với bạn"
  → Broker/môi giới rating

SPRINT 5+:
  → Lịch sử ngập úng HCM
  → Predictive recommendation (cần 500+ user)
  → AI suggest giá offer
  → So sánh thuê vs mua

KHÔNG LÀM (2 năm đầu):
  → AR/3D tour, iBuyer, tích hợp trực tiếp ngân hàng
```

### 20. CẤU TRÚC FILE .MD — Kế hoạch tách

```
HIỆN TẠI (Sprint 1-2): 6 file
  BDS-POLICY.md, BDS-DECISIONS.md, BDS-MASTER.md,
  BDS-CODE.md, BDS-HCM-CONTEXT.md, BDS-SEO-AEO.md

SAU SPRINT 2: Review và tách nhỏ hơn dựa trên pattern thực tế
TIÊU CHÍ TÁCH: File nào >300 dòng và hay được đọc từng phần
```

---
*Cập nhật: Buổi 1 — 2026-04 | Aria*
*File tiếp theo cần đọc: BDS-MASTER.md (kiến trúc & DB)*

