# FRONTEND SCOPE — SmartParking (Gate 1 MVP)

> Tài liệu này ghi phạm vi công việc frontend và **toàn bộ giả định (ASSUMPTION)** được đưa ra khi tài liệu nguồn thiếu hoặc mâu thuẫn.
> Mọi giả định đều có mã `A-xx`, lý do, và điểm neo trong tài liệu để soát lại được.

**Ngày lập:** 2026-08-012
**Nguồn tham chiếu (theo đúng thứ tự ưu tiên khi mâu thuẫn):**
1. `docs/product/PRD-PARKSMARTAIAGENT.docx` — 85 FR, 12 NFR, 51 BR, 39 AC, 14 entity, 9 Demo Scenario
2. `docs/product/UI Flow.png` — sơ đồ 37 màn, 3 vai trò, 4 sub-flow (A–D)
3. `docs/product/Page Brief.docx` — pitch 1 trang, không chứa yêu cầu mới
5. Code hiện có trong repository

---

## 1. Phạm vi

### Trong phạm vi
- Frontend hoàn chỉnh cho 3 vai trò: Resident, Security Guard, Parking Manager.
- Toàn bộ 37 màn hình trong UI Flow, cộng màn đăng nhập (xem `A-05`).
- Mock service có type rõ ràng, thực thi đúng state machine của PRD.
- i18n scaffold: `vi` mặc định, `en` dựng sẵn cùng bộ key.
- Design token dẫn xuất từ Lab029s + cơ chế nav pill của Di Sản Việt.

### Ngoài phạm vi
- **Không** sửa backend (`src/**` là scaffold FastAPI + LangGraph của chat agent, không liên quan nghiệp vụ bãi đỗ xe).
- **Không** tạo database, migration, hay AI agent thật.
- **Không** phát sinh HTTP request nào ở Gate 1 — backend hiện có không có endpoint parking (chỉ `POST /api/v1/chat`, `GET /api/v1/status`, `GET /health`).
- **Không** tự đặt API contract HTTP. Chỉ định nghĩa TypeScript service interface.
- Theo PRD "Không phải mục tiêu" và "Out of Scope": không camera/ANPR, không cảm biến, không barrier, không thanh toán, không đặt chỗ theo lịch, không indoor navigation, không tích hợp hệ thống tòa nhà, không điều phối nhiều bãi.

### Nguyên tắc mock
Mock **có logic nghiệp vụ thật**, không phải hàm rỗng. Mọi method trả về `Result<T>` cụ thể; không method nào trả `undefined` hay để `// TODO`. Điểm hoán đổi mock ↔ API thật gói trong **một file duy nhất**: `frontend/src/services/index.ts`.

---

## 2. Bảng ASSUMPTION

### 2.1 Mâu thuẫn giữa PRD và UI Flow — PRD thắng

| Mã | Vấn đề | Quyết định | Điểm neo |
|---|---|---|---|
| **A-01** | UI Flow đặt nút "Đề xuất lại tất cả" ở **chân màn kết quả** (cạnh "Hủy tìm chỗ") → nghe như phạm vi toàn session. Nhưng PRD yêu cầu mỗi phương tiện xử lý độc lập, không rollback lẫn nhau. | Giữ **cả hai nút** đúng UI Flow: nút "Khác" trên mỗi card đề xuất lại **chỉ card đó**; nút "Đề xuất lại tất cả" ở chân màn chạy lại cho **các phương tiện đang `ALTERNATIVE_REQUIRED`**, tuyệt đối không rollback phương tiện đã `RESERVED` thành công. | PRD Step 7 (`Recommend Again → Step 6 của phương tiện đó`), FR-24, FR-74, NFR-11, BR-39, AC-09 |
| **A-02** ✅ | Form đăng ký xe khách trong UI Flow có **2 field**: "Ngày đến" và "Ngày về". Nhưng `GuestVehicleRegistration` chỉ có `valid_until` (14 field, không có `valid_from`). Đồng thời PRD Out of Scope ghi rõ "Đặt chỗ theo ngày hoặc khung giờ tương lai". | Dựng **cả 2 field** theo UI Flow. Chỉ "Ngày về" map vào `valid_until`. **"Ngày đến" là thông tin hiển thị, KHÔNG tạo ràng buộc thời gian bắt đầu** — không có khái niệm registration "chưa hiệu lực". Backend sau này cần biết field này hiện chưa có chỗ chứa trong model. | PRD Data Model `GuestVehicleRegistration`, Out of Scope, FE-04 |
| **A-03** | UI Flow màn 4 có tab "Đề xuất \| Chọn thủ công" luôn hiển thị. PRD Step 8 mô tả chọn thủ công như một nhánh riêng sau khi từ chối đề xuất. | Cho phép truy cập tab thủ công **tự do, không gate**. FR-25/FR-27 không nói bị chặn. | PRD Step 8, FR-25, FR-27, AC-06 |
| **A-04** | Dashboard trong UI Flow ghi "Đang đỗ 128" và "Sẵn có 672". Vì 672 > 128, "128" không thể là tổng số slot. | Coi toàn bộ số trên UI Flow là **dữ liệu minh họa**. Mock tự tính lại từ fixtures cho nhất quán. Nhãn tile giữ đúng UI Flow. | UI Flow mục 3.1 Dashboard |

### 2.2 Tài liệu thiếu hoàn toàn — dựng tối thiểu

| Mã | Vấn đề | Quyết định | Điểm neo |
|---|---|---|---|
| **A-05** | PRD yêu cầu 3 vai trò và cho phép "đăng nhập bằng tài khoản mẫu hoặc session giả lập", nhưng UI Flow **không vẽ màn login nào**. | Dựng `/login` liệt kê **3 tài khoản mẫu dạng card**, bấm một cái là vào. Session lưu `localStorage` qua `AuthService` mock. Route guard theo vai trò để thể hiện RBAC. Đây là màn duy nhất không có trong UI Flow. | FR-01, PRD In Scope, NFR-07, AC-18, AC-37 |
| **A-06** | "Thông báo" là mục nav thứ 5 của Resident trong UI Flow; PRD In Scope ghi "Activity Log và thông báo trong ứng dụng"; nhiều FR/AC nhắc "hệ thống thông báo Resident". Nhưng **không màn nào được thiết kế** và không định nghĩa kênh gửi. | Dựng **inbox in-app** đơn giản: list thông báo có read/unread, nguồn từ mock. Không push notification, không email, không realtime. | PRD In Scope, FR-77, FR-79, FR-43, AC-28, AC-31 |
| **A-07** | UI Flow màn 7 (Resident) có nút **"Xem vẽ đỗ xe"** nhưng không có màn đích. PRD không nhắc. | Tái dùng `ParkingLayoutGrid` ở chế độ **read-only**, highlight slot đang đỗ. | UI Flow mục 1, màn 7 |
| **A-08** ✅ | Dropdown "Chọn lý do" khi báo cáo bất thường **không có giá trị nào** trong UI Flow. Đã đọc hết 85 FR, 51 BR, 39 AC — **không có enum nào được định nghĩa**. | Dùng 5 giá trị, ba cái đầu suy từ đúng 3 nhánh lỗi trong UI Flow, hai cái sau từ màn chi tiết báo cáo: `NO_RESERVATION` ("Không có Reservation"), `RESERVATION_EXPIRED` ("Reservation hết hạn"), `PLATE_MISMATCH` ("Biển số không khớp"), `VEHICLE_NOT_FOUND` ("Không tìm thấy phương tiện"), `OTHER` ("Khác"). Kèm ô ghi chú tự do. | UI Flow mục 2 (3 nhánh lỗi + màn "Chi tiết báo cáo"), AC-36, BR-47 |
| **A-09** | PRD mô tả nghiệp vụ "báo cáo bất thường" ở 16 chỗ, có cả metric `Gate Anomaly Rate`, nhưng **không có entity nào** trong Data Model. | Định nghĩa `AnomalyReport` từ chính các field UI Flow hiển thị: `report_id` (dạng `#AB12345`), `reported_by`, `plate_number`, `reason` (enum A-08), `note`, `status`, `related_reservation_id`, `created_at`, `resolved_at`, `resolved_by`. Đánh dấu rõ là entity suy ra. | UI Flow mục 2 & 3 (màn chi tiết báo cáo), AC-36, FR-54, BR-47, BR-49 |
| **A-10** | UI Flow có nút "Xử lý" và "Đóng" ở màn chi tiết báo cáo, và 3 tab "Mới / Đang xử lý / Đã xử lý", nhưng **không định nghĩa kết quả của việc "Xử lý"**. | Chỉ đổi trạng thái báo cáo `NEW → IN_PROGRESS → RESOLVED` khớp 3 tab. **KHÔNG** tự động force-transition `ParkingSession` hay `ParkingSlot` — tránh thêm nghiệp vụ ngoài tài liệu. | UI Flow mục 3 (tab + nút), NFR-03 |
| **A-11** ✅ | UI Flow màn A-5 "Quản lý xe" có đủ 3 action: "Chi tiết xe", "Chỉnh sửa", "Xóa xe". PRD rất chi tiết về sửa biển số xe **khách** (5 chỗ) nhưng **im lặng hoàn toàn** về sửa xe **cư dân**: không nói field nào sửa được, sửa có kích hoạt lại phê duyệt không, có bị chặn sau `APPROVED` không. | Dựng cả 3 action theo UI Flow. **"Chỉnh sửa" chỉ bật khi `approval_status = PENDING`**; khi đã `APPROVED` hoặc `REJECTED` thì chỉ xem và xóa. Chọn bảo toàn vì sửa biển số xe đã duyệt sẽ phá vỡ ràng buộc của FR-76 (Bảo vệ đối chiếu biển số với xe `APPROVED`). | UI Flow sub-flow A màn 5; đối chiếu FR-69, AC-29, AC-30 (quy định cho xe khách), FR-76 |
| **A-12** | Nav Bảo vệ có "Danh sách chờ" và "Lịch sử" nhưng **không màn nào được vẽ**. | Dựng list cơ bản: "Danh sách chờ" = các `ParkingSession` trạng thái `WAITING_ENTRY`; "Lịch sử" = lịch sử vào/ra theo thời gian, phạm vi giới hạn theo vai trò. | UI Flow mục 2 (nav), FR-85, NFR-07 |

### 2.3 Chi tiết UI Flow không có trong PRD — dựng theo UI Flow

| Mã | Chi tiết | Quyết định |
|---|---|---|
| **A-13** | Form "Thêm xe" có ô upload **"Hình ảnh đăng ký"** — PRD không nhắc, `Vehicle` entity không có field ảnh. | Dựng UI upload cho đúng giao diện, nhưng **không lưu file** ở Gate 1 (không có backend storage). Ghi rõ là placeholder. |
| **A-14** | Màn "Xác nhận giữ chỗ" có **checkbox** "Tôi đã kiểm tra và đồng ý với thông tin giữ chỗ" — PRD không yêu cầu. | Dựng theo UI Flow. Checkbox bắt buộc tick mới bật nút "Giữ chỗ". |
| **A-15** | UI Flow gán **màu riêng cho từng vai trò**: Resident xanh dương, Security Guard xanh lá, Parking Manager tím. | Dùng làm **accent phân biệt vai trò** ở nav/header, lấy từ `--color-primary` / `--color-success` / `--color-ev`. **Không** đổi toàn bộ palette theo vai trò. |
| **A-16** | Toàn bộ 37 màn trong UI Flow được vẽ dạng **khung điện thoại dọc**, kể cả Parking Manager. Không có bố cục dashboard desktop nào. | **Mobile-first**: thiết kế gốc ở 375px, desktop là mở rộng. `GlassNav` pill ngang chỉ xuất hiện từ breakpoint `lg`; dưới `lg` Resident dùng `BottomTabBar`, Guard/Manager dùng nav list dọc. |

---

## 3. Ràng buộc nghiệp vụ dễ làm sai

Ba điểm dưới đây trái trực giác hoặc bị UI Flow thể hiện gây nhầm. Mock engine **phải** thực thi đúng.

### 3.1 Nút gia hạn chỉ mở trong 30 giây cuối
FR-38 và BR-15 yêu cầu đủ **cả ba** điều kiện: reservation còn hiệu lực, **thời gian còn lại ≤ 30 giây**, và `extend_count < 1`.

Nghĩa là nút "Gia hạn (1/1)" trong UI Flow **phải disabled suốt 4 phút 30 giây đầu**, chỉ bật ở 30 giây cuối. UI Flow vẽ nút trông như bấm được bất cứ lúc nào. Đây là chi tiết trái trực giác nhất trong toàn bộ tài liệu.

*Neo:* FR-34, FR-36, FR-37, FR-38, BR-11, BR-15, AC-10, AC-11, AC-12

### 3.2 Xe khách chuyển `USED` ở đúng một thời điểm
- Xác nhận **xe vào** → `ParkingSession` thành `PARKING`, nhưng `GuestVehicleRegistration` **vẫn `ACTIVE`, chưa có `used_at`**.
- Xác nhận **xe ra** → `ParkingSession` thành `COMPLETED`, lúc này mới `ACTIVE → USED` + ghi `used_at`.
- Reservation `CANCELLED`/`EXPIRED` **không** làm registration mất hiệu lực — vẫn `ACTIVE`, tạo được reservation mới.
- `CANCELLED`/`EXPIRED` của registration **chỉ** phát sinh khi Resident tự hủy hoặc hết `valid_until`.

*Neo:* FR-66, FR-67, BR-32, BR-35, BR-36, AC-13, AC-26, AC-33, AC-34, AC-35

### 3.3 Hai nhánh thất bại ở cổng xử lý ngược nhau
| | Xe **vào** thất bại | Xe **ra** thất bại |
|---|---|---|
| ParkingSession | `WAITING_ENTRY → CANCELLED` | **giữ nguyên `PARKING`** |
| Slot | không chuyển `OCCUPIED` | **giữ nguyên `OCCUPIED`** |
| Hệ quả | thông báo Resident; registration giữ `ACTIVE` | ghi Activity Log thất bại + **tự tạo báo cáo bất thường** |

Lẫn hai nhánh này sẽ làm xe đang đỗ biến mất khỏi hệ thống.

*Neo:* FR-77, FR-79, FR-83, BR-47, AC-28, AC-31, AC-36

### 3.4 Các ràng buộc khác
- **Atomic reservation** — kiểm tra và chuyển `AVAILABLE → RESERVED` phải nguyên tử; hai phương tiện cùng session không bao giờ nhận cùng slot; slot đã cấp cho item khác bị loại khỏi ứng viên. (FR-30, FR-75, BR-40, AC-08)
- **Idempotency** — phê duyệt xe, xác nhận vào, xác nhận ra nhận `idempotencyKey`; gửi lại cùng key trả kết quả cũ. (NFR-12, AC-38)
- **Failure isolation** — lỗi của một `RecommendationItem` không rollback item đã thành công. (NFR-11, BR-39, AC-09)
- **Từ chối yêu cầu vô nghĩa** — input như `"1+1"` không tạo `RecommendationSession`. (FR-06B, BR-51, AC-39)
- **Cấu hình không hardcode** — trọng số xếp hạng (Near Entrance 40%, Near Elevator 30%, Easy Driving 20%, Near Destination 10%), thời lượng giữ chỗ 5 phút, giới hạn gia hạn 1 lần, quota căn hộ phải đọc từ file config. (FR-14, FR-15, NFR-08)
- **Bắt buộc hiển thị lý do đề xuất** cho từng phương tiện, không chỉ điểm %. (FR-16, FR-20, AC-04)
- **Chip chọn tầng phải hiện số slot `AVAILABLE` mỗi tầng.** (FR-26)
- **Màu không bao giờ là tín hiệu duy nhất** — mọi trạng thái phải có label hoặc icon kèm màu. (NFR-04)
- **Countdown, trạng thái phê duyệt, cảnh báo xác minh phải ở dạng text.** (NFR-05)
- **Banner "Dữ liệu Mock API"** hiện thường trú. (BR-23, AC-20)

---

## 4. Chuẩn nghiệm thu

PRD Appendix cho sẵn **9 Demo Scenario A–I**. Đây là chuẩn "xong", không phải tiêu chí tự đặt:

| Scenario | Nội dung |
|---|---|
| A | Happy path xe cư dân: đề xuất → giữ chỗ → vào → ra |
| B | Xe vượt hạn mức căn hộ → `PENDING` → Ban quản lý duyệt |
| C | Một yêu cầu 3 xe khách → 3 registration độc lập |
| D | Multi-vehicle có 1 phương tiện thất bại, 3 cái còn lại vẫn thành công |
| E | Gia hạn reservation ở 30 giây cuối |
| F | Reservation xe khách hết hạn, registration vẫn `ACTIVE` |
| G | Xe khách vào → `PARKING` (registration vẫn `ACTIVE`) → ra → `USED` |
| H | Hai phương tiện tranh cùng một slot, chỉ một thắng |
| I | Xác minh cổng thất bại, trạng thái không đổi, tạo báo cáo bất thường |

---

## 5. Điểm tích hợp backend sau này

Mọi điểm đã có service interface + mock implementation. Khi backend có endpoint parking thật, chỉ sửa `services/index.ts` và tạo mới `services/http.ts` (đọc `NEXT_PUBLIC_API_URL` ở một chỗ duy nhất).

`AuthService` · `VehicleService` · `GuestRegistrationService` · `RecommendationService` · `ReservationService` · `ParkingSessionService` · `LotService` · `ApprovalService` · `AnomalyReportService` · `ActivityLogService` · `DashboardService`

**Hai điểm cần backend đặc biệt lưu ý:**
- **Hết hạn reservation** — mock chạy timer client-side. Backend thật cần server-side expiry hoặc realtime push, vì đóng tab không được làm reservation sống mãi.
- **Field "Ngày đến"** của xe khách (xem `A-02`) hiện không có chỗ chứa trong model.

---

## 6. Lịch sử soát xét

| Ngày | Nội dung |
|---|---|
| 2026-08-04 | Lập tài liệu. `A-02`, `A-08`, `A-11` đã được chủ dự án xác nhận. `A-01`, `A-03`…`A-07`, `A-09`, `A-10`, `A-12`…`A-16` là suy luận, cần soát lại sau mỗi milestone. |
