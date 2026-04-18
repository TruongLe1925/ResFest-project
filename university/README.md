# 🎓 University Admission Prediction API

An AI-powered API for predicting university admission chances using Spring Boot and Ollama.

## 📋 Project Overview

This system provides a RESTful API that allows users to:
- Retrieve a list of universities
- Get majors offered by each university
- Predict admission probability based on exam scores and transcript scores using AI

## 🛠️ Tech Stack

- **Java 21**
- **Spring Boot 4.0.5**
- **Spring Data JPA** - ORM and data access
- **MySQL** - Database
- **Spring AI + Ollama** - AI integration (model: qwen2.5)
- **SpringDoc OpenAPI** - API documentation (Swagger UI)
- **Lombok** - Reduces boilerplate code
- **Maven** - Dependency management and build tool

## 🚀 Getting Started

### Prerequisites

- Java JDK 21+
- Maven 3.6+
- MySQL Server
- Ollama (with qwen2.5 model installed)

### Database Setup

Create a MySQL database with the following configuration:
```sql
CREATE DATABASE admissionpredicdb;
CREATE USER 'springstudent'@'localhost' IDENTIFIED BY 'springstudent';
GRANT ALL PRIVILEGES ON admissionpredicdb.* TO 'springstudent'@'localhost';
```

### Run the Application

```bash
# Clone the repository
git clone <repository-url>
cd university

# Build and run
./mvnw spring-boot:run

# Or build the JAR first
./mvnw clean package
java -jar target/university-0.0.1-SNAPSHOT.jar
```

### Ollama Setup

Ensure Ollama is running at `http://localhost:11434` and pull the qwen2.5 model:

```bash
ollama pull qwen2.5
ollama serve
```

## 📚 API Documentation

Once the application is running, access the Swagger UI at:
- **Swagger UI**: http://localhost:8080/my-ui.html
- **API Docs**: http://localhost:8080/my-api-docs

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/university` | Get all universities |
| GET | `/api/major?universityDTO={university_name}` | Get majors by university |
| POST | `/api/admission-predic` | Predict admission probability |

### Admission Prediction API

**Endpoint**: `POST /api/admission-predic`

**Content-Type**: `multipart/form-data`

**Parameters**:
- `data` (JSON): Prediction request data
  - `universityName` (String, required): University name
  - `majorName` (String, required): Major name
  - `examScore` (Double, required): Exam score (0-30)
  - `StranscriptScore` (Double, required): Transcript score (0-10)
- `file` (File, optional): Attachment file

**Example request**:
```bash
curl -X POST http://localhost:8080/api/admission-predic \
  -F "data={\"universityName\":\"University of Technology\",\"majorName\":\"Computer Science\",\"examScore\":25.5,\"StranscriptScore\":8.5}" \
  -F "file=@transcript.pdf"
```

## 📁 Project Structure

```
university/
├── src/main/java/com/prediction/university/
│   ├── Config/          # Application configuration
│   ├── Controller/      # REST Controllers
│   ├── DTO/             # Data Transfer Objects
│   ├── Dao/             # Data Access Objects
│   ├── Entity/          # JPA Entities
│   ├── Exception/       # Custom Exceptions
│   ├── Repository/      # Spring Data Repositories
│   └── Service/         # Business Logic Services
├── src/main/resources/
│   └── application.properties  # Application configuration
├── pom.xml              # Maven configuration
└── README.md            # This file
```

## ⚙️ Configuration

Key configurations in `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/admissionpredicdb
spring.datasource.username=springstudent
spring.datasource.password=springstudent

# Ollama AI
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.options.model=qwen2.5
spring.ai.ollama.chat.options.temperature=0.7

# Swagger
springdoc.swagger-ui.path=/my-ui.html
springdoc.api-docs.path=/my-api-docs
```

## 🧪 Testing

```bash
./mvnw test
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is distributed under the MIT License.

---

**Author**: Prediction Team
