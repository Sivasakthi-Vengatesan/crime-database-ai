package com.example.crimechatbot.controller;

import com.example.crimechatbot.dto.ComplaintRequest;
import com.example.crimechatbot.dto.ComplaintResponse;
import com.example.crimechatbot.service.ComplaintService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private static final Logger log = LoggerFactory.getLogger(ComplaintController.class);

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    /**
     * Citizen e-FIR / Complaint submission endpoint.
     */
    @PostMapping
    public ResponseEntity<ComplaintResponse> registerComplaint(@Valid @RequestBody ComplaintRequest request) {
        log.info("Received complaint registration for crime type: '{}' in '{}'", request.getCrimeType(), request.getLocation());
        ComplaintResponse response = complaintService.registerComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Complaint / FIR tracking endpoint.
     */
    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<?> trackComplaint(@PathVariable String trackingNumber) {
        log.info("Tracking lookup for case/FIR: '{}'", trackingNumber);
        return complaintService.trackComplaint(trackingNumber)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                        "error", "NOT_FOUND",
                        "message", "No case or complaint found matching tracking identifier: " + trackingNumber
                )));
    }
}
