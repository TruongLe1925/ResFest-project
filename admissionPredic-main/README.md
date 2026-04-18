# Academic Oracle — Admission Predictor (Frontend)

Giao diện React (Vite) cho ứng dụng dự đoán tuyển sinh: đăng nhập/đăng ký, danh sách trường từ API, form điểm và gọi API dự đoán (multipart).

## Yêu cầu

- **Node.js** phiên bản **20 trở lên** (LTS khuyến nghị). Kiểm tra: `node -v`
- **npm** đi kèm Node (dùng npm cho toàn bộ lệnh dưới đây). Kiểm tra: `npm -v`

## Khởi tạo và chạy local

Trong thư mục `admission_predic`:

```bash
npm install
npm run dev
```

Vite sẽ in địa chỉ (thường là `http://localhost:5173`). Mở trình duyệt tại đó.

## Các lệnh npm hữu ích

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Chạy server phát triển (hot reload) |
| `npm run build` | Build production vào thư mục `dist/` |
| `npm run preview` | Xem bản build production trên máy |
| `npm run lint` | Chạy ESLint |

## Cấu hình API (Spring Boot)

Ứng dụng gọi backend qua Axios. Mặc định base URL nằm trong `src/services/api.js`; có thể ghi đè bằng biến môi trường.

1. Tạo file `.env` **cùng cấp** với `package.json` (thư mục `admission_predic`).
2. Thêm (sửa URL cho đúng máy chủ của bạn):

```env
VITE_API_BASE_URL=http://192.168.100.23:8080/api
```

3. Khởi động lại `npm run dev` sau khi đổi `.env`.

**Lưu ý:** Trình duyệt gọi trực tiếp sang host/IP backend cần **CORS** được cấu hình trên Spring Boot, hoặc bạn dùng **proxy** trong `vite.config` nếu muốn tránh CORS khi dev.

## Công nghệ

- React 19, React Router
- Vite 8
- Axios

---

Template gốc: [Vite + React](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react).
