package com.prediction.university.Service.ChatService;


import com.prediction.university.DTO.AdmissionPredictReponseDTO;
import com.prediction.university.DTO.AdmissionPredictRequestDTO;
import com.prediction.university.Dao.UniversityDAO;
import com.prediction.university.Entity.University;
import com.prediction.university.Exception.UniversityNotFoundException;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.content.Media;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ChatServiceImpl implements ChatService {
    private final ChatClient chatClient;
    private  final UniversityDAO universityDAO;
    public ChatServiceImpl(UniversityDAO universityDAO,ChatClient.Builder builder) {
        this.chatClient = builder.build();
        this.universityDAO = universityDAO;
    }

    @Override
    public AdmissionPredictReponseDTO reponse(MultipartFile file, AdmissionPredictRequestDTO requestDTO) {
        University university = universityDAO.findUniversity(requestDTO.getUniversityName());
        if(university==null){
            throw new UniversityNotFoundException("University not found");
        }
        String userText = String.format(
                "### THÔNG TIN THÍ SINH:\n" +
                        "- Ngành đăng ký: %s\n" +
                        "- Trường: %s\n" +
                        "- Điểm thi THPT: %.2f\n" +
                        "- Điểm chuẩn năm trước: %.2f\n\n" +
                        "### YÊU CẦU:\n" +
                        "1. So sánh điểm của tôi với điểm chuẩn năm trước.\n" +
                        "2. Kiểm tra hình ảnh bảng điểm đính kèm để xác thực điểm số (nếu có).\n" +
                        "3. Đưa ra dự báo khả năng trúng tuyển (Thấp/Trung bình/Cao) không trả về giá trị ậm.\n" +
                        "4. Đưa ra lời khuyên cụ thể để tăng cơ hội vào trường",
                requestDTO.getMajorName(),
                requestDTO.getUniversityName(),
                requestDTO.getExamScore(),
                university.getAverageAdmissionScore()
        );
        String systemMessage = "Bạn là một chuyên gia tư vấn tuyển sinh ở Việt Nam và ở Việt Nam hãy đưa ra nhận xét và cho thêm gợi ý ngành hoặc trường khác nếu % đậu thấp";
        if(file != null) {
            Media media = Media.builder()
                    .mimeType(MimeTypeUtils.parseMimeType(file.getContentType()))
                    .data(file.getResource())
                    .build();
            return chatClient.prompt()
                    .user(promptUserSpec -> promptUserSpec.text(userText).media(media))
                    .system(systemMessage)
                    .call()
                    .entity(AdmissionPredictReponseDTO.class);
        }
        AdmissionPredictReponseDTO reponseDTO = chatClient.prompt()
                .system(systemMessage)
                .user(promptUserSpec -> promptUserSpec.text(userText))
                .call()
                .entity(AdmissionPredictReponseDTO.class);
        return reponseDTO;
    }
}
