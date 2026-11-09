# Kế hoạch phát triển ứng dụng "Quiet Class" - Lớp Học Trật Tự Thông Minh

Ứng dụng web tương tác hỗ trợ giáo viên quản lý tiếng ồn trong lớp học bằng micro thời gian thực, trực quan hóa trạng thái 3 cấp độ (Xanh lá - Vàng - Đỏ), cảnh báo giọng nói "Im lặng đi!", hỗ trợ thi đua cộng/trừ điểm cho cả lớp và các tổ nhóm, trên nền đồ họa bầu trời cầu vồng sân trường sôi động.

### User Review & Critical Decisions

> [!IMPORTANT]
> Dựa trên phản hồi từ Thầy/Cô trong bước khảo sát trước:
> 1. **Cơ chế tính điểm**: Giáo viên có nút bấm nhanh (+ / -) để thưởng phạt trực quan, kết hợp cơ chế cảnh báo thị giác khi mức ồn thay đổi.
> 2. **Cảnh báo mức Đỏ**: Ứng dụng tích hợp giọng đọc Web Speech tiếng Việt ("Im lặng đi các bạn ơi! / Hãy giữ trật tự!") cùng hiệu ứng âm thanh chuông nhắc nhở nhẹ nhàng, tránh gây giật mình cho học sinh.
> 3. **Chế độ thi đua**: Hỗ trợ chuyển đổi mượt mà giữa chế độ **Cả Lớp** (tích lũy sao/điểm mục tiêu) và **Tổ Nhóm** (Tổ 1, Tổ 2, Tổ 3, Tổ 4 thi đua lành mạnh).

---

### 1. Overview & Core Concept

- **Mục tiêu ứng dụng**: Giải quyết bài toán lớp học hay bị ồn ào khiến giáo viên phải nhắc nhở liên tục. Ứng dụng biến việc giữ trật tự thành trò chơi thi đua trực quan, hấp dẫn, giúp học sinh tự giác điều chỉnh âm lượng.
- **Đối tượng sử dụng**: Giáo viên tiểu học, THCS, trung tâm ngoại ngữ, và học sinh trong giờ học trên lớp hoặc giờ tự quản.
- **Giá trị cốt lõi**:
  - Đo mức âm lượng chính xác từ microphone (Web Audio API).
  - Trực quan hóa 3 mức độ rõ ràng:
    - **Xanh (Yên lặng)**: Lớp trật tự, chỉ định cộng điểm thưởng, học sinh ngoan.
    - **Vàng (Hơi ồn)**: Cảnh báo nhắc nhở nhẹ, giữ nguyên điểm, nhắc học sinh tập trung.
    - **Đỏ (Quá ồn)**: Cảnh báo vi phạm trật tự, trừ điểm, kích hoạt cảnh báo giọng nói *"Im lặng đi!"* và rung thị giác.
  - Công tắc Microphone 2 trạng thái: Biểu tượng Mic gạch chéo (Đang tắt, chưa đo) và Mic bật sóng (Đang hoạt động đo âm lượng thực tế).
  - Bảng quản lý điểm số: Tùy chỉnh cộng/trừ điểm thủ công nhanh (+1, +2, +5, -1, -2, -5), đặt mốc thưởng (ví dụ: đạt 50 điểm cả lớp được nghe 1 bài hát hoặc nhận sticker).

---

### 2. User Experience & Visual Design

#### A. Trực quan & Đồ họa (Theme & Visual Language)
- **Hình ảnh chủ đạo**: Nền trời xanh dương tươi sáng năng động, cầu vồng rực rỡ uốn lượn, mây trắng bồng bềnh, và hình ảnh các bạn học sinh vui đùa trên sân chơi trường học đầy sức sống.
- **Bảng màu chủ đạo (60-30-10)**:
  - 60% Bầu trời xanh dương trong sáng (`#38bdf8` - `#0284c7`), mây trắng và mặt cỏ sân trường xanh mát.
  - 30% Thẻ điều khiển trung tâm kính mờ (Glassmorphism bán trong suốt sạch sẽ, viền mảnh), tương phản cao với chữ đậm dễ nhìn từ xa khi chiếu lên màn hình máy chiếu hoặc TV lớp học.
  - 10% Điểm nhấn semantic 3 cấp độ:
    - **Màu Xanh lá tươi (Emerald `#10b981`)**: Trạng thái "Lớp rất ngoan & trật tự" (+ Điểm).
    - **Màu Vàng ấm (Amber `#f59e0b`)**: Trạng thái "Chú ý! Hơi ồn rồi nhé" (~ Giữ nguyên).
    - **Màu Đỏ tươi (Rose `#ef4444`)**: Trạng thái "Quá ồn! Hãy im lặng" (- Điểm & Cảnh báo tiếng).
- **Typography**: Phông chữ `Plus Jakarta Sans` / `Outfit` tròn trịa, thân thiện, dễ đọc từ cuối lớp học; số điểm dùng chữ số cố định độ rộng (`tabular-nums font-bold`).

#### B. Trải nghiệm người dùng (Key User Flows)
1. **Khởi động & Bật Micro**:
   - Màn hình mở ra ở trạng thái an toàn: Nút Micro gạch chéo màu xám/cam nổi bật với hướng dẫn ngắn "Nhấn để bắt đầu theo dõi tiếng ồn".
   - Giáo viên nhấn nút Micro -> Trình duyệt yêu cầu quyền truy cập micro -> Icon chuyển sang Micro bật phát sáng với sóng âm động nhảy múa theo thời gian thực.
2. **Theo dõi độ ồn & Đồng hồ đo âm lượng**:
   - Thang đo độ nhạy dB trực quan (Decibel Gauge) với vạch phân định rõ ràng 3 ngưỡng Xanh - Vàng - Đỏ.
   - Giáo viên có thể trượt thanh điều chỉnh độ nhạy micro (Sensitivity Slider) phù hợp với lớp nhỏ hoặc lớp rộng.
3. **Phản hồi khi chạm ngưỡng Đỏ**:
   - Màn hình phát hiệu ứng nhấp nháy viền đỏ cảnh báo.
   - Ứng dụng phát âm thanh giọng nói thân thiện nhưng dứt khoát: *"Im lặng đi các bạn ơi!"* thông qua Web Speech Synthesis tiếng Việt.
   - Nút trừ điểm nhấp nháy hoặc giáo viên nhấn nhanh trừ điểm cho lớp / tổ vi phạm.
4. **Chế độ thi đua Cả Lớp & Tổ Nhóm**:
   - Tab chuyển đổi: **"Chế độ Cả Lớp"** (Điểm tích lũy toàn lớp, thanh tiến độ nhận quà) & **"Thi đua 4 Tổ"** (Tổ 1: Họa Mi, Tổ 2: Sơn Ca, Tổ 3: Đại Bàng, Tổ 4: Vàng Anh).
   - Giáo viên cộng/trừ điểm tức thì chỉ bằng 1 chạm, có bảng âm thanh vui nhộn khi đạt mốc sao.

---

### 3. Key Product Decisions & Trade-Offs

- **Xử lý Audio trên trình duyệt (Web Audio API)**:
  - *Giải pháp*: Sử dụng `AudioContext` và `AnalyserNode` tính toán RMS (Root Mean Square) hoặc mức decibel tương đối mượt mà (chống giật bằng EMA - Exponential Moving Average).
  - *Lý do*: Chạy hoàn toàn client-side, tức thì với độ trễ < 50ms, không tốn dữ liệu mạng, bảo vệ tối đa quyền riêng tư học sinh trong lớp (âm thanh không gửi lên server).
- **Giọng nói cảnh báo "Im lặng đi" (Web Speech Synthesis + Web Audio Chime)**:
  - *Giải pháp*: Kết hợp âm chuông "ting ting" hoạt hình thân thiện bằng bộ dao động tần số Web Audio, tiếp theo là giọng đọc tiếng Việt của trình duyệt (`window.speechSynthesis`). Có thêm công tắc âm lượng và chọn câu khẩu hiệu ("Im lặng đi!", "Trật tự nào cả lớp!", "Giữ yên lặng nhé!").
  - *Lý do*: Đảm bảo đúng theo phản hồi của Thầy/Cô, không phụ thuộc file âm thanh ngoài có thể bị lỗi mạng.
- **Lưu trữ dữ liệu điểm**:
  - *Giải pháp*: Lưu điểm số và cấu hình tên các tổ vào `localStorage` của trình duyệt, có nút "Làm mới tiết học mới" và "Khôi phục điểm mặc định".
  - *Lý do*: Thầy cô có thể tắt máy và mở lại vào tiết học sau mà không bị mất điểm thi đua của lớp.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        QUIET CLASS APPLICATION                         │
├────────────────────────────────────────┬───────────────────────────────┤
│           AUDIO INPUT ENGINE           │       UI & SCORING STORE      │
│  ┌──────────────────────────────────┐  │  ┌─────────────────────────┐  │
│  │   Navigator.mediaDevices.getUser │  │  │ Mode: Whole Class /     │  │
│  │   Media (Microphone On / Mute)   │  │  │       4 Groups Teams    │  │
│  └────────────────┬─────────────────┘  │  ├─────────────────────────┤  │
│                   │                    │  │ Scores, Stars, Threshold│  │
│  ┌────────────────▼─────────────────┐  │  │ Settings & LocalStorage │  │
│  │  Web Audio AnalyserNode (RMS/dB) │  │  └────────────┬────────────┘  │
│  └────────────────┬─────────────────┘  │               │               │
├───────────────────┼────────────────────┴───────────────┼───────────────┤
│                   ▼                                    ▼               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  NOISE CLASSIFIER & STATE MACHINE                │  │
│  │  - GREEN (< Threshold 1) : "Lớp rất trật tự" -> Gợi ý cộng điểm  │  │
│  │  - YELLOW (Threshold 1-2): "Hơi ồn, cần chú ý" -> Giữ nguyên    │  │
│  │  - RED (> Threshold 2)   : "Quá ồn!" -> Cảnh báo giọng nói & trừ │  │
│  └────────────────┬─────────────────────────────────────────────────┘  │
│                   ▼                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     PLAYGROUND CANVAS & VIEWS                    │  │
│  │  - Top Bar: Brand, Mic Toggle (Muted / Active), Mode Switcher    │  │
│  │  - Main Stage: Rainbow Sky Background, Noise Gauge & 3 Lights    │  │
│  │  - Alert Engine: Web Speech TTS "Im lặng đi!" + Chime Alert      │  │
│  │  - Scoreboard: Team/Class Cards with Quick (+ / -) Buttons       │  │
│  │  - Settings Modal: Sensitivity slider & Custom trigger phrases   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### A. Interactive Component & State Mapping
1. **MicStateController**: Quản lý trạng thái Micro (`isListening: boolean`, `audioVolume: number 0-100`, `permissionGranted: boolean`, `errorNotice`).
2. **NoiseStatusCard**: Hiển thị trạng thái lớn trực quan với 3 màu Xanh - Vàng - Đỏ, kèm biểu tượng nhân vật hoạt hình cảm xúc tương ứng (Xanh: Cười tươi nghe giảng; Vàng: Đưa ngón tay lên môi suỵt; Đỏ: Giật mình che tai).
3. **VoiceAlertService**: Kích hoạt phát câu nói "Im lặng đi!" khi trạng thái Đỏ duy trì quá 1.5 giây (có debounce để tránh nói liên tục gây phiền nhiễu).
4. **ClassCompetitionView**: Hiển thị bảng điểm cả lớp (thanh năng lượng trật tự) hoặc bảng xếp hạng 4 Tổ nhóm với các huy hiệu sao vàng.
5. **TeacherQuickToolbar**: Các nút thao tác nhanh: Reset điểm, Chỉnh độ nhạy mic, Bật/tắt giọng nói, Chế độ toàn màn hình (Fullscreen) để trình chiếu trên bảng thông minh.

---

### Kế hoạch triển khai sau khi được phê duyệt:
1. Tạo hình ảnh nền sống động (Bầu trời xanh, cầu vồng, sân trường vui tươi) đạt chuẩn đồ họa cao cấp.
2. Xây dựng dịch vụ phân tích âm thanh Web Audio và công tắc Micro 2 trạng thái mượt mà.
3. Tích hợp bộ cảnh báo giọng nói tiếng Việt "Im lặng đi!" và chuông cảnh báo.
4. Triển khai bảng điểm thi đua 2 chế độ (Cả lớp & 4 Tổ nhóm) với các nút cộng trừ tiện lợi.
5. Kiểm thử, biên dịch và bàn giao ứng dụng hoàn chỉnh.
