# Hệ Thống Dự Đoán Tuyển Sinh Đại Học - Tài Liệu Dự Án Chi Tiết

> **Tổng quan**: Hệ thống full-stack gồm Backend Spring Boot (AI-powered) và Frontend React (Vite) cho phép dự đoán khả năng trúng tuyển đại học dựa trên điểm thi và học bạ.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
D:\dev-spring-boot\Resfest\
├── admissionPredic-main/          # Frontend - React Application
├── university/                    # Backend - Spring Boot API
└── PROJECT_DOCUMENTATION.md       # Tài liệu này
```

---

# PHẦN 1: BACKEND - University Admission Prediction API

## 1.1 Thông Tin Cơ Bản

| Thuộc tính | Giá trị |
|------------|---------|
| **Tên dự án** | University Admission Prediction API |
| **Ngôn ngữ** | Java 21 |
| **Framework** | Spring Boot 4.0.5 |
| **Build tool** | Maven 3.6+ |
| **Database** | MySQL 8.0+ |
| **AI Service** | Google Gemini API (via Spring AI OpenAI adapter) |
| **Documentation** | SpringDoc OpenAPI (Swagger UI) |

## 1.2 Cấu Trúc Thư Mục Backend

```
university/
├── src/
│   ├── main/
│   │   ├── java/com/prediction/university/
│   │   │   ├── Config/                     # Cấu hình ứng dụng
│   │   │   │   └── Config.java
│   │   │   ├── Controller/                 # REST API Controllers
│   │   │   │   ├── ChatController.java
│   │   │   │   └── UniversityController.java
│   │   │   ├── DTO/                        # Data Transfer Objects
│   │   │   │   ├── AdmissionPredictReponseDTO.java
│   │   │   │   ├── AdmissionPredictRequestDTO.java
│   │   │   │   ├── EntityErrorResponse.java
│   │   │   │   ├── MajorDTO.java
│   │   │   │   └── UniversityDTO.java
│   │   │   ├── Dao/                        # Data Access Objects
│   │   │   │   ├── UniversityDAO.java
│   │   │   │   └── UniversityDAOImpl.java
│   │   │   ├── Entity/                     # JPA Entities
│   │   │   │   ├── Major.java
│   │   │   │   └── University.java
│   │   │   ├── Exception/                  # Exception Handling
│   │   │   │   ├── ExceptionHandler/
│   │   │   │   │   └── RestControllerException.java
│   │   │   │   └── UniversityNotFoundException.java
│   │   │   ├── Repository/                 # Spring Data Repositories
│   │   │   │   └── UniversityRepository.java
│   │   │   ├── Service/                    # Business Logic Services
│   │   │   │   ├── ChatService/
│   │   │   │   │   ├── ChatService.java
│   │   │   │   │   └── ChatServiceImpl.java
│   │   │   │   └── UniversityService/
│   │   │   │       ├── UniversityService.java
│   │   │   │       └── UniversityServiceImpl.java
│   │   │   └── UniversityApplication.java  # Main Application Class
│   │   └── resources/
│   │       └── application.properties      # App Configuration
│   └── test/                               # Unit Tests
├── pom.xml                                 # Maven Dependencies
├── mvnw / mvnw.cmd                         # Maven Wrapper
├── README.md
├── FEASIBILITY_ANALYSIS.md                 # Phân tích khả thi nghiên cứu
├── HELP.md
└── target/                                 # Build output
```

## 1.3 Dependencies Chính (pom.xml)

```xml
- Spring Boot Starter Data JPA
- Spring Boot Starter Validation
- Spring Boot Starter WebMVC
- Spring AI Starter Model OpenAI (Gemini integration)
- MySQL Connector/J
- Lombok (boilerplate reduction)
- SpringDoc OpenAPI WebMVC UI 2.5.0
- Spring Boot DevTools
```

## 1.4 Cấu Hình Database (application.properties)

```properties
spring.application.name=university
spring.datasource.url=jdbc:mysql://localhost:3306/admissionpredicdb
spring.datasource.username=springstudent
spring.datasource.password=springstudent
```

## 1.5 Cấu Hình AI (Google Gemini)

```properties
spring.ai.openai.api-key=AIzaSyD6X_bjRMHjdEZKTFlDg-B8YlTqKaIztKs
spring.ai.openai.chat.base-url=https://generativelanguage.googleapis.com/v1beta/openai/
spring.ai.openai.chat.completions-path=chat/completions
spring.ai.openai.chat.options.model=gemini-2.5-flash-lite
spring.ai.openai.chat.timeout=60s
```

## 1.6 Cấu Hình Swagger/OpenAPI

```properties
springdoc.swagger-ui.path=/my-ui.html
springdoc.api-docs.path=/my-api-docs
```

## 1.7 API Endpoints

| Method | Endpoint | Mô tả | Parameters |
|--------|----------|-------|------------|
| GET | `/api/university` | Lấy danh sách tất cả trường đại học | - |
| GET | `/api/major` | Lấy danh sách ngành theo trường | `universityDTO` (String) |
| POST | `/api/admission-predic` | Dự đoán khả năng trúng tuyển | `data` (JSON) + `file` (optional) |

### DTO - Admission Prediction Request

```java
@Data
@Builder
public class AdmissionPredictRequestDTO {
    @NotBlank(message = "Tên trường không được để trống")
    private String universityName;
    
    @NotNull(message = "Điểm thi không được để trống")
    @Min(value = 0, message = "Điểm thi không được nhỏ hơn 0")
    @Max(value = 30, message = "Điểm thi tối đa là 30")
    private Double examScore;
    
    @NotBlank(message = "Tên ngành không được để trống")
    private String majorName;
}
```

### DTO - Admission Prediction Response

```java
@Data
@Builder
public class AdmissionPredictReponseDTO {
    private Integer percentage;      // 0-100
    private String feedback;         // Phản hồi từ AI
    private String strengths;        // Điểm mạnh
    private String weaknesses;       // Điểm yếu
}
```

## 1.8 Entity Classes

### University Entity

```java
@Entity
@Table(name = "university")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "university_name")
    private String universityName;
    
    @Column(name = "average_admission_score")
    private Double averageAdmissionScore;
    
    @Column(name = "year")
    private int year;
    
    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Major> major;
}
```

### Major Entity

```java
@Entity
@Table(name = "major")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Major {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "major_name")
    private String majorName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id")
    private University university;
}
```

## 1.9 Controller Layer

### UniversityController.java

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UniversityController {
    
    @GetMapping("/university")
    public List<UniversityDTO> getUniversity() {
        return universityService.university();
    }
    
    @GetMapping("/major")
    public List<MajorDTO> getMajor(@RequestParam String universityDTO) {
        return universityService.major(universityDTO);
    }
}
```

## 1.10 Service Layer Architecture

```
Service Interface
    ↓
Service Implementation (Business Logic)
    ↓
Repository (Data Access)
    ↓
Database
```

---

# PHẦN 2: FRONTEND - Academic Oracle (React + Vite)

## 2.1 Thông Tin Cơ Bản

| Thuộc tính | Giá trị |
|------------|---------|
| **Tên dự án** | Academic Oracle - Admission Predictor |
| **Framework** | React 19.2.4 |
| **Build tool** | Vite 8.0.4 |
| **Router** | React Router DOM 7.14.0 |
| **HTTP Client** | Axios 1.15.0 |
| **Node.js** | 20+ (LTS recommended) |

## 2.2 Cấu Trúc Thư Mục Frontend

```
admissionPredic-main/
├── public/                      # Static assets
│   └── vite.svg
├── src/
│   ├── assets/                  # Images, fonts, etc.
│   ├── components/              # Reusable UI Components
│   │   ├── Card.jsx            # Container component
│   │   ├── ErrorMessage.jsx    # Error display
│   │   ├── Input.jsx           # Form input
│   │   ├── Layout.jsx          # Page layout wrapper
│   │   ├── Loader.jsx          # Loading spinner
│   │   ├── Navbar.jsx          # Navigation bar + CSS
│   │   ├── ProbabilityBar.jsx  # Progress bar for probability
│   │   ├── ResultCard.jsx      # Prediction result display
│   │   ├── ResultStatus.jsx    # Status indicator
│   │   ├── ScoreForm.jsx       # Score input form
│   │   ├── Select.jsx          # Dropdown component
│   │   ├── LoginForm.jsx       # Login form (empty)
│   │   ├── RegisterForm.jsx    # Register form (empty)
│   │   └── UniversityFetchExample.jsx # Example component
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useAuth.jsx         # Authentication context
│   │   └── usePredict.jsx      # Prediction logic hook
│   ├── pages/                   # Page Components
│   │   ├── Home.jsx + Home.css         # Dashboard/Landing
│   │   ├── Login.jsx + Auth.css        # Login page
│   │   ├── Register.jsx + Auth.css     # Register page
│   │   ├── Prediction.jsx + Prediction.css  # Main prediction
│   │   └── Profile.jsx + Profile.css   # User profile
│   ├── routes/                  # Routing configuration
│   │   └── AppRoutes.jsx       # Route definitions
│   ├── services/                # API Services
│   │   ├── api.js              # Axios instance + API calls
│   │   └── aiService.js        # AI service wrapper
│   ├── App.jsx                  # Root component
│   ├── App.css                  # App styles
│   ├── index.css                # Global styles
│   └── main.jsx                 # Entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── package-lock.json            # Lock file
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint config
├── .gitignore                   # Git ignore rules
├── README.md                    # Project README
└── TODO.md                      # Development checklist
```

## 2.3 Dependencies (package.json)

```json
{
  "dependencies": {
    "axios": "^1.15.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "vite": "^8.0.4",
    "eslint": "^9.39.4"
  }
}
```

## 2.4 Scripts

```json
{
  "dev": "vite",           // Development server
  "build": "vite build",   // Production build
  "lint": "eslint .",      // Run ESLint
  "preview": "vite preview" // Preview production build
}
```

## 2.5 Cấu Trúc Components

### Component Tree

```
App
├── AuthProvider (Context)
└── Router
    └── AppRoutes
        ├── Layout
        │   └── Navbar
        ├── Home (Dashboard)
        ├── Login
        ├── Register
        ├── Prediction
        │   ├── ScoreForm
        │   ├── ResultCard
        │   ├── ProbabilityBar
        │   └── ResultStatus
        └── Profile
```

## 2.6 Custom Hooks

### useAuth.jsx - Authentication Context

```javascript
// Provides: { user, login, logout, isAuthenticated }
// Stores user data in localStorage
// Handles token-based authentication
```

### usePredict.jsx - Prediction Logic

```javascript
// State Management:
- result: Prediction result object
- loading: Boolean for prediction loading
- uploading: Boolean for file upload
- error: Error message string
- universities: List of universities
- majors: List of majors for selected university

// Methods:
- makePrediction(score, university, file, major)
- uploadTranscriptFile(file)
- fetchMajorsForUniversity(universityName)
- clearPrediction()
```

## 2.7 API Service Layer

### api.js - Axios Configuration

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor adds auth token
// Response handlers for university/major/prediction data
```

### API Methods

```javascript
// Fetch all universities
export async function fetchUniversities()

// Fetch majors for a university
export async function fetchMajors(universityName)

// Submit prediction request (multipart/form-data)
export async function postAdmissionPrediction(payload, file)

// Upload transcript image for score extraction
export async function uploadTranscriptImage(file)
```

## 2.8 Routes Configuration

```javascript
// AppRoutes.jsx
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/predict" element={<Prediction />} />
<Route path="/profile" element={<Profile />} />
```

## 2.9 Key Features

### Authentication Flow
```
1. User enters credentials on Login/Register page
2. useAuth validates and stores user in localStorage
3. Protected routes check isAuthenticated
4. API requests include Bearer token in headers
```

### Prediction Flow
```
1. User selects university from dropdown
2. Majors load dynamically based on selection
3. User enters exam score (0-30)
4. Optional: Upload transcript image
5. Submit triggers multipart POST to /api/admission-predic
6. AI returns: percentage, feedback, strengths, weaknesses
7. Result displays with probability bar and status
```

### Score Validation
- Exam Score: 0-30 (Vietnamese university entrance scale)
- Transcript Score: Extracted via AI from uploaded image
- University: Required selection
- Major: Required selection

---

# PHẦN 3: Tích Hợp Frontend-Backend

## 3.1 Communication Flow

```
User Interaction (React)
         ↓
Custom Hook (usePredict/useAuth)
         ↓
Service Layer (api.js/aiService.js)
         ↓
Axios HTTP Request
         ↓
Spring Boot REST Controller
         ↓
Service Layer (Business Logic)
         ↓
Repository Layer (JPA/Hibernate)
         ↓
MySQL Database
         ↓
Spring AI (Gemini API)
         ↓
JSON Response → React Components
```

## 3.2 CORS Configuration

Backend (`UniversityController.java`):
```java
@CrossOrigin(origins = "*")
```

## 3.3 Environment Variables (Frontend)

Create `.env` file in `admissionPredic-main/`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 3.4 Data Flow Example

### Prediction Request

```
POST /api/admission-predic
Content-Type: multipart/form-data

Form Data:
- data: {"universityName":"ĐH Bách Khoa HN","majorName":"Công nghệ thông tin","examScore":25.5}
- file: [optional transcript image]
```

### Prediction Response

```json
{
  "percentage": 78,
  "feedback": "Với điểm số 25.5, bạn có khả năng cao đỗ vào ngành CNTT của ĐH Bách Khoa.",
  "strengths": "Điểm thi vượt ngưỡng trúng tuyển năm trước",
  "weaknesses": "Cần cân nhắc điểm chuẩn có thể tăng năm nay"
}
```

---

# PHẦN 4: Phân Tích Khả Thi Nghiên Cứu

## 4.1 Câu Hỏi Nghiên Cứu

**Câu hỏi chính:**
Làm thế nào để tận dụng AI để dự đoán chính xác khả năng trúng tuyển đại học cho học sinh THPT Việt Nam?

**Mục tiêu:**
1. Phát triển mô hình AI phân tích dữ liệu học tập
2. Xác thực độ chính xác so với dữ liệu lịch sử
3. Triển khai xử lý đa phương thức (văn bản + hình ảnh)
4. Đánh giá khả năng áp dụng thực tế

## 4.2 Thiết Kế Nghiên Cứu

| Thành phần | Chi tiết |
|------------|----------|
| **Phương pháp** | Mixed-Methods (Quantitative-dominant) |
| **Mẫu dữ liệu lịch sử** | 10,000+ hồ sơ tuyển sinh |
| **Sinh viên thử nghiệm** | 500 sinh viên |
| **Số trường** | 50-100 trường đại học |
| **Số ngành** | 200+ chương trình |

## 4.3 Kiến Trúc Kỹ Thuật

```
Input Layer → Processing Layer → AI Analysis Layer → Output Layer
     ↓              ↓                  ↓                ↓
Student Data   Validation      Gemini AI Model    Prediction
Historical     JPA Queries     Prompt Engineering Feedback
Scores         Multimodal      Structured Output
```

## 4.4 Chi Phí Ước Tính (Năm 1)

| Hạng mục | Chi phí (USD) |
|----------|---------------|
| Cloud Server | $200/tháng |
| Database MySQL | $50/tháng |
| Gemini API | $100/tháng |
| Development | $5,000 |
| Testing | $1,000 |
| **Tổng năm 1** | **$10,700** |

## 4.5 Timeline Dự Án (6 tháng)

```
Tháng 1-2: [PHASE 1] Setup & Data Collection
├── Tuần 1-2: Cài đặt hạ tầng
├── Tuần 3-4: Thu thập và làm sạch dữ liệu
└── Tuần 5-8: Phát triển API

Tháng 3-4: [PHASE 2] AI Integration
├── Tuần 9-10: Tích hợp Gemini AI
├── Tuần 11-12: Prompt engineering
├── Tuần 13-14: Xử lý đa phương thức
└── Tuần 15-16: Thuật toán dự đoán

Tháng 5: [PHASE 3] Testing
├── Tuần 17-18: Unit testing
├── Tuần 19-20: User acceptance testing
└── Tuần 21-22: Validation

Tháng 6: [PHASE 4] Deployment
├── Tuần 23-24: Documentation
├── Tuần 25-26: Production deployment
└── Tuần 26: Final report
```

---

# PHẦN 5: Hướng Dẫn Triển Khai

## 5.1 Yêu Cầu Hệ Thống

### Backend
- Java JDK 21+
- Maven 3.6+
- MySQL Server 8.0+
- Google Gemini API Key

### Frontend
- Node.js 20+ (LTS)
- npm (đi kèm Node)
- Modern browser with ES6+ support

## 5.2 Cài Đặt Database

```sql
CREATE DATABASE admissionpredicdb;
CREATE USER 'springstudent'@'localhost' IDENTIFIED BY 'springstudent';
GRANT ALL PRIVILEGES ON admissionpredicdb.* TO 'springstudent'@'localhost';
FLUSH PRIVILEGES;
```

## 5.3 Chạy Backend

```bash
cd university
./mvnw spring-boot:run

# Hoặc build JAR
./mvnw clean package
java -jar target/university-0.0.1-SNAPSHOT.jar
```

**URL:** http://localhost:8080
**Swagger UI:** http://localhost:8080/my-ui.html
**API Docs:** http://localhost:8080/my-api-docs

## 5.4 Chạy Frontend

```bash
cd admissionPredic-main
npm install
npm run dev
```

**URL:** http://localhost:5173 (mặc định Vite)

## 5.5 Production Build

### Frontend
```bash
npm run build
# Output: dist/ folder
```

### Backend
```bash
./mvnw clean package
# Output: target/university-0.0.1-SNAPSHOT.jar
```

---

# PHẦN 6: Tài Liệu API Chi Tiết

## 6.1 GET /api/university

**Response:**
```json
[
  {
    "name": "Đại học Bách Khoa Hà Nội",
    "cutoff_score": 24.5,
    "required_transcript_score": 8.0
  }
]
```

## 6.2 GET /api/major

**Parameters:** `universityDTO=Đại học Bách Khoa Hà Nội`

**Response:**
```json
[
  {"majorName": "Công nghệ thông tin"},
  {"majorName": "Khoa học máy tính"}
]
```

## 6.3 POST /api/admission-predic

**Content-Type:** `multipart/form-data`

**Parameters:**
- `data` (JSON): `{universityName, majorName, examScore}`
- `file` (File, optional): Transcript image

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/admission-predic \
  -F "data={\"universityName\":\"ĐH Bách Khoa HN\",\"majorName\":\"CNTT\",\"examScore\":25.5}" \
  -F "file=@transcript.pdf"
```

---

# PHẦN 7: Security & Best Practices

## 7.1 Security Considerations

| Vấn đề | Giải pháp |
|--------|-----------|
| API Key exposure | Store in application.properties (backend only) |
| CORS | Configured at controller level |
| Input validation | @Valid, @Min, @Max annotations |
| SQL Injection | JPA/Hibernate ORM (parameterized queries) |
| XSS | React built-in escaping |

## 7.2 Validation Rules

```java
@NotBlank(message = "Tên trường không được để trống")
private String universityName;

@NotNull(message = "Điểm thi không được để trống")
@Min(value = 0, message = "Điểm thi không được nhỏ hơn 0")
@Max(value = 30, message = "Điểm thi tối đa là 30")
private Double examScore;
```

---

# PHẦN 8: Troubleshooting

## 8.1 Common Issues

### Backend
| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-------------|-----------|
| Connection refused | MySQL chưa chạy | Start MySQL service |
| 404 API not found | Wrong context path | Check @RequestMapping |
| CORS error | Frontend domain khác | Verify @CrossOrigin |
| AI timeout | Gemini API chậm | Tăng timeout trong config |

### Frontend
| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-------------|-----------|
| Module not found | npm install chưa chạy | Run `npm install` |
| API 404 | Wrong BASE_URL | Check .env config |
| Proxy error | CORS chưa config | Kiểm tra backend CORS |

## 8.2 Debug Mode

```javascript
// Enable Axios debug
api.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});
```

```properties
# Spring Boot debug logging
logging.level.org.springframework.web=DEBUG
logging.level.com.prediction=DEBUG
```

---

# PHẦN 9: Tổng Kết

## 9.1 Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite 8 + React Router 7 |
| Backend | Spring Boot 4 + Java 21 |
| Database | MySQL 8 |
| AI | Google Gemini 2.5 Flash Lite |
| Docs | SpringDoc OpenAPI 2.5 |
| Build | Maven (backend) / npm (frontend) |

## 9.2 Project Status

- [x] Backend API hoàn thiện
- [x] Frontend UI/UX hoàn thiện
- [x] Tích hợp AI dự đoán
- [x] Authentication system
- [x] API Documentation (Swagger)
- [x] Phân tích khả thi nghiên cứu

## 9.3 Contact & Resources

- **Swagger UI**: http://localhost:8080/my-ui.html
- **API Base URL**: http://localhost:8080/api
- **Frontend Dev**: http://localhost:5173

---

*Document Version: 1.0*  
*Last Updated: April 2026*  
*Author: System Analysis*
