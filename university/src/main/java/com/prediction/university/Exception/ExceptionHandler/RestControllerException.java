package com.prediction.university.Exception.ExceptionHandler;

import com.prediction.university.DTO.EntityErrorResponse;
import com.prediction.university.Exception.UniversityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice(annotations = RestController.class)
public class RestControllerException {
    @ExceptionHandler(UniversityNotFoundException.class)
    public ResponseEntity<EntityErrorResponse> handleUniversityNotFoundException(UniversityNotFoundException e) {
        EntityErrorResponse entityErrorResponse = new EntityErrorResponse();
        entityErrorResponse.setStatus(HttpStatus.NOT_FOUND.value());
        entityErrorResponse.setMessage(e.getMessage());
        entityErrorResponse.setTimestamp(System.currentTimeMillis());
        return new ResponseEntity<>(entityErrorResponse, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
}
