package com.prediction.university.Controller;


import com.prediction.university.DTO.AdmissionPredictReponseDTO;
import com.prediction.university.DTO.AdmissionPredictRequestDTO;
import com.prediction.university.Service.ChatService.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
    @Operation(
            summary = "Dự đoán khả năng trúng tuyển",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            encoding = @Encoding(name = "data", contentType = "application/json")
                    )
            )
    )
    @PostMapping(value = "/admission-predic", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AdmissionPredictReponseDTO admissinPredic(@RequestPart(value = "data") AdmissionPredictRequestDTO admissionPredictRequestDTO,
                                                     @RequestPart(value = "file", required = false) MultipartFile file) {
        return chatService.reponse(file, admissionPredictRequestDTO);
    }
}
