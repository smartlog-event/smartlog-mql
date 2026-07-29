# MA TRẬN TÍNH ĐIỂM & BỘ CÂU HỎI PHÂN LOẠI LEAD – TEAM MKT

> Công cụ do team MKT xây, giao cho CBD dùng tại sự kiện: sau khi tư vấn khách, CBD điền bộ câu hỏi để phân loại lead thành **Raw / MQL / SQL** và lưu về Google Sheet.
> Các chỗ **⚠️ cần bạn xác nhận** ở cuối.

---

## I. Nguyên tắc tổng quan

- **Chọn sản phẩm quan tâm ở ngay đầu** (Câu 1) — đây là bộ **định tuyến**, không tính điểm.
- **Chỉ hỏi & tính điểm các câu quy mô thuộc sản phẩm đã chọn.** Khách không quan tâm mảng nào thì câu quy mô mảng đó **không xuất hiện & không kéo điểm**.
- **Câu chung** (hệ thống hiện tại, cấp bách, ngân sách, đã triển khai, tiêu chí chọn) **luôn tính** cho mọi lead — vì đó là độ sẵn sàng mua, không thuộc riêng sản phẩm nào.
- **Phân bậc theo điểm %:** **≥ 70% → SQL** · **45–69% → MQL** · **< 45% → Raw**.
- **Cửa nhu cầu (Câu 10) là "vượt bậc":** CBD đánh giá **"Phù hợp"** → lead lên thẳng **SQL** dù điểm chưa tới 70%.
- Tức **SQL = điểm ≥ 70% HOẶC "Phù hợp"** (hai đường độc lập).
- Điểm % = điểm đạt ÷ điểm tối đa của các câu áp dụng × 100. Action Tag chỉ để **gợi ý hành động**.
- Trường thông tin đầu vào **không bắt buộc**. Mỗi câu quy mô/chung có đáp án **"Chưa lấy được thông tin" = 0đ**.

---

## II. Bản đồ Sản phẩm → Câu quy mô

| Sản phẩm | Câu quy mô được tính |
| --- | --- |
| STM – Transportation Management | Số lượng xe |
| SWM – Warehouse Management | Diện tích kho |
| SOM – Order Management | Số đơn hàng/tháng |
| COS · STX · SSCP · SGTM · Global Partner | *Chưa map câu quy mô — chỉ tính câu chung + đánh giá qua cửa nhu cầu* |

---

## III. BỘ CÂU HỎI

**Câu 1 (ĐỊNH TUYẾN): Doanh nghiệp quan tâm đến (các) sản phẩm/giải pháp nào? (Chọn nhiều — KHÔNG tính điểm)**

STM · SWM · SOM · COS · STX · SSCP · SGTM (vận tải quốc tế) · Smartlog Global Partner · *Chưa xác định rõ, cần tư vấn thêm*.
→ Chọn STM hiện câu Số xe; chọn SWM hiện câu Diện tích kho; chọn SOM hiện câu Số đơn hàng.

### Câu quy mô (chỉ hiện theo sản phẩm đã chọn)

**Số lượng xe/phương tiện vận tải** *(chỉ khi chọn STM — tối đa 8đ)*

| Đáp án | Điểm |
| --- | :---: |
| Chưa lấy được thông tin | 0 |
| Dưới 50 xe / 50–100 / 100–200 / Trên 200 xe | 2 / 4 / 6 / 8 |

**Quy mô kho bãi (diện tích)** *(chỉ khi chọn SWM — tối đa 7đ)*

| Đáp án | Điểm |
| --- | :---: |
| Chưa lấy được thông tin | 0 |
| Dưới 1.000 m² / 1.000–5.000 / 5.000–10.000 / Trên 10.000 m² | 2 / 4 / 6 / 7 |

**Số đơn hàng/tháng** *(chỉ khi chọn SOM — tối đa 8đ)*

| Đáp án | Điểm |
| --- | :---: |
| Chưa lấy được thông tin | 0 |
| Dưới 500 / 500–2.000 / 2.000–10.000 / Trên 10.000 đơn | 2 / 4 / 6 / 8 |

### Câu chung (luôn hỏi mọi lead)

**Hệ thống/công cụ đang dùng** *(tối đa 7đ)* — Chưa lấy 0 · Excel/thủ công 2 · Nội bộ tự phát triển 4 · Đơn vị khác 6 · Đang dùng một phần Smartlog 7.

**Mức độ cấp bách** *(tối đa 18đ)*

| Đáp án | Điểm | Action Tag |
| --- | :---: | --- |
| Chưa lấy được thông tin | 0 | — |
| Chỉ đang tìm hiểu | 2 | `NURTURE` |
| Đang lên kế hoạch cho năm tới | 7 | `EDUCATE` |
| Dự kiến triển khai trong thời gian tới | 13 | `SCHEDULE` |
| Cần triển khai ngay trong quý này | 18 | `URGENT_CALL` → **đẩy SQL** |

**Ngân sách triển khai** *(tối đa 18đ)*

| Đáp án | Điểm | Action Tag |
| --- | :---: | --- |
| Chưa lấy được thông tin | 0 | — |
| Chưa có ngân sách | 2 | `BUILD_CASE` |
| Đang đề xuất/xét duyệt nội bộ | 8 | `SUPPORT_PROPOSAL` |
| Đã có ngân sách dự kiến, chưa duyệt chính thức | 13 | `FAST_TRACK_DEMO` |
| Ngân sách đã được phê duyệt | 18 | `DIRECT_PROPOSAL` → **đẩy SQL** |

**Đã từng triển khai phần mềm quản lý vận hành chưa** *(tối đa 9đ)* — Chưa lấy 0 · Chưa bao giờ 2 · Đã thử/thất bại 5 · Đang dùng không đủ 7 · Đã triển khai muốn nâng cấp 9.

**Tiêu chí quan trọng nhất khi chọn đối tác** *(tối đa 10đ)* — Chưa lấy 0 · Giá cả 6 `PRICE_SENSITIVE` · Tốc độ 7 `SPEED_DRIVEN` · Tích hợp 8 `INTEGRATION_FOCUSED` · Hỗ trợ/dịch vụ 8 `SERVICE_FOCUSED` · Khả năng mở rộng 10 `SCALE_FOCUSED`.

### 2 ô tích ghi nhận tương tác (KHÔNG tính điểm)
- ☐ Đã tư vấn 1:1 tại sự kiện
- ☐ Đã book meeting với khách hàng sau sự kiện

**Câu 10 (CỬA NHU CẦU): Nhu cầu của khách có phù hợp với giải pháp Smartlog không?** *(CBD đánh giá — KHÔNG tính điểm)*

| Đáp án | Tác dụng |
| --- | --- |
| Phù hợp | **Vượt bậc → SQL** (dù điểm chưa tới 70%) |
| Chưa rõ | Không vượt bậc → xếp theo điểm % |
| Không phù hợp | Không vượt bậc → xếp theo điểm % |

---

## IV. CÁCH TÍNH ĐIỂM (%)

`Điểm phù hợp (%) = (tổng điểm đạt được) ÷ (tổng điểm tối đa của các câu ÁP DỤNG) × 100`

- Câu áp dụng = câu chung (luôn có, tối đa **62đ**) + câu quy mô của sản phẩm đã chọn (xe 8 / kho 7 / đơn 8).
- Câu quy mô của mảng **không chọn** → không nằm trong phép tính (không kéo điểm).
- Câu chọn sản phẩm & câu cửa nhu cầu **không tính điểm**.
- **Điểm % phân 3 bậc** (≥70 → SQL · 45–69 → MQL · <45 → Raw). Riêng Câu 10 = "Phù hợp" → **vượt bậc lên SQL** dù điểm thấp.

Ví dụ khách chỉ chọn STM → mẫu số = 62 + 8 (xe) = **70**; không có câu kho/đơn trong mẫu số.

---

## V. LOGIC PHÂN LOẠI Raw / MQL / SQL

| Bậc | Điều kiện |
| --- | --- |
| 🟢 **SQL** | **% ≥ 70** **HOẶC** Câu 10 = "Phù hợp" (vượt bậc) |
| 🟡 **MQL** | % 45–69 **và** Câu 10 ≠ "Phù hợp" |
| ⚪ **Raw** | % < 45 **và** Câu 10 ≠ "Phù hợp" |

**Ví dụ (đã kiểm chứng):**
- STM, "Không phù hợp", 99% → **SQL** (điểm cao).
- STM, "Chưa rõ", 81% → **SQL** (điểm cao).
- SWM, "Phù hợp", 30% → **SQL** (⭐ vượt bậc).
- STM, "Chưa rõ", 66% → **MQL**.
- SWM, "Chưa rõ", 17% → **Raw**.

---

## VI. ⚠️ CẦN BẠN XÁC NHẬN

1. **COS, STX, SSCP, SGTM, Global Partner:** hiện chưa map câu quy mô. Khi nào có tiêu chí quy mô cho các mảng này, báo mình bổ sung.
2. **SGTM** hiển thị: "Smartlog Global Transportation Management – SGTM (vận tải quốc tế)" — chỉnh tên nếu cần.
3. **Ngưỡng %:** SQL ≥ 70% · MQL ≥ 45%. Muốn chỉnh không?
4. **Điểm câu chung:** cấp bách & ngân sách nặng nhất (18đ). Rà lại nếu cần cân lại.
