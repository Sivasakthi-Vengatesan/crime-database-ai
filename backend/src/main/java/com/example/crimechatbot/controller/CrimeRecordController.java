package com.example.crimechatbot.controller;

import com.example.crimechatbot.entity.CrimeRecord;
import com.example.crimechatbot.repository.CrimeRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CrimeRecordController {

    private final CrimeRecordRepository crimeRecordRepository;

    public CrimeRecordController(CrimeRecordRepository crimeRecordRepository) {
        this.crimeRecordRepository = crimeRecordRepository;
    }

    /**
     * Lists all crime records with optional filtering.
     */
    @GetMapping("/records")
    public ResponseEntity<List<Map<String, Object>>> getRecords(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String crimeType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "150") int limit
    ) {
        List<CrimeRecord> records = crimeRecordRepository.findAll();

        List<Map<String, Object>> filtered = records.stream()
                .filter(r -> location == null || location.isBlank() || r.getLocation().equalsIgnoreCase(location.trim()))
                .filter(r -> crimeType == null || crimeType.isBlank() || r.getCrimeType().equalsIgnoreCase(crimeType.trim()))
                .filter(r -> status == null || status.isBlank() || r.getStatus().equalsIgnoreCase(status.trim()))
                .filter(r -> severity == null || severity.isBlank() || r.getSeverity().equalsIgnoreCase(severity.trim()))
                .filter(r -> {
                    if (search == null || search.isBlank()) return true;
                    String s = search.toLowerCase().trim();
                    return r.getCaseId().toLowerCase().contains(s) ||
                            r.getDescription().toLowerCase().contains(s) ||
                            r.getLocation().toLowerCase().contains(s) ||
                            r.getCrimeType().toLowerCase().contains(s);
                })
                .sorted(Comparator.comparing(CrimeRecord::getIncidentDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(limit)
                .map(this::mapRecord)
                .collect(Collectors.toList());

        return ResponseEntity.ok(filtered);
    }

    /**
     * Deep analytics endpoint aggregating real-time intelligence data.
     */
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<CrimeRecord> records = crimeRecordRepository.findAll();
        long total = records.size();

        long closed = records.stream().filter(r -> "Closed".equalsIgnoreCase(r.getStatus())).count();
        long underInvestigation = records.stream().filter(r -> "Under Investigation".equalsIgnoreCase(r.getStatus())).count();
        long open = records.stream().filter(r -> "Open".equalsIgnoreCase(r.getStatus())).count();

        long critical = records.stream().filter(r -> "Critical".equalsIgnoreCase(r.getSeverity())).count();
        long high = records.stream().filter(r -> "High".equalsIgnoreCase(r.getSeverity())).count();
        long medium = records.stream().filter(r -> "Medium".equalsIgnoreCase(r.getSeverity())).count();
        long low = records.stream().filter(r -> "Low".equalsIgnoreCase(r.getSeverity())).count();

        Map<String, Long> cityDistribution = records.stream()
                .collect(Collectors.groupingBy(CrimeRecord::getLocation, Collectors.counting()));

        Map<String, Long> typeDistribution = records.stream()
                .collect(Collectors.groupingBy(CrimeRecord::getCrimeType, Collectors.counting()));

        double solvedRate = total > 0 ? ((double) closed / total) * 100 : 0;

        List<Map<String, Object>> recentHotspots = records.stream()
                .filter(r -> "Critical".equalsIgnoreCase(r.getSeverity()) || "High".equalsIgnoreCase(r.getSeverity()))
                .sorted(Comparator.comparing(CrimeRecord::getIncidentDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .map(this::mapRecord)
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalRecords", total);
        result.put("solvedRate", Math.round(solvedRate * 10.0) / 10.0);
        result.put("openCases", open);
        result.put("underInvestigationCases", underInvestigation);
        result.put("closedCases", closed);
        result.put("severityCounts", Map.of("Critical", critical, "High", high, "Medium", medium, "Low", low));
        result.put("cityDistribution", cityDistribution);
        result.put("typeDistribution", typeDistribution);
        result.put("recentHotspots", recentHotspots);

        return ResponseEntity.ok(result);
    }

    private Map<String, Object> mapRecord(CrimeRecord r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", r.getId());
        map.put("caseId", r.getCaseId());
        map.put("crimeType", r.getCrimeType());
        map.put("location", r.getLocation());
        map.put("incidentDate", r.getIncidentDate() != null ? r.getIncidentDate().toString() : "");
        map.put("description", r.getDescription());
        map.put("status", r.getStatus());
        map.put("severity", r.getSeverity());
        map.put("victimAge", r.getVictimAge());
        map.put("suspectAge", r.getSuspectAge());
        return map;
    }
}
