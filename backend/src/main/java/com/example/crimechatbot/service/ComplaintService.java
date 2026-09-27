package com.example.crimechatbot.service;

import com.example.crimechatbot.dto.ComplaintRequest;
import com.example.crimechatbot.dto.ComplaintResponse;
import com.example.crimechatbot.entity.CrimeRecord;
import com.example.crimechatbot.repository.CrimeRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ComplaintService {

    private static final Logger log = LoggerFactory.getLogger(ComplaintService.class);

    private final CrimeRecordRepository crimeRecordRepository;
    private final EmbeddingService embeddingService;

    public ComplaintService(CrimeRecordRepository crimeRecordRepository, EmbeddingService embeddingService) {
        this.crimeRecordRepository = crimeRecordRepository;
        this.embeddingService = embeddingService;
    }

    /**
     * Registers a citizen complaint / e-FIR, performs AI triage, generates vector embeddings,
     * and persists it into the shared crime database.
     */
    @Transactional
    public ComplaintResponse registerComplaint(ComplaintRequest request) {
        String cityCode = getCityCode(request.getLocation());
        int randomNum = 1000 + new Random().nextInt(9000);
        String year = String.valueOf(LocalDate.now().getYear());
        String caseId = "FIR-" + year + "-" + cityCode + "-" + randomNum;

        LocalDate incidentDate = request.getIncidentDate() != null ? request.getIncidentDate() : LocalDate.now();
        String severity = determineSeverity(request);

        // Build descriptive text for embedding & AI semantic retrieval
        String fullDescription = request.getDescription().trim();
        if (request.getLandmark() != null && !request.getLandmark().isBlank()) {
            fullDescription += " (Location landmark: " + request.getLandmark().trim() + ")";
        }
        if (request.getSuspectDetails() != null && !request.getSuspectDetails().isBlank()) {
            fullDescription += " (Suspect info: " + request.getSuspectDetails().trim() + ")";
        }

        // Generate vector embedding
        String embeddingText = request.getCrimeType() + " in " + request.getLocation() + ": " + fullDescription;
        float[] vector = embeddingService.embed(embeddingText);
        String embeddingJson = embeddingService.toJson(vector);

        // Create & Persist entity
        CrimeRecord record = CrimeRecord.builder()
                .caseId(caseId)
                .crimeType(request.getCrimeType())
                .location(request.getLocation())
                .incidentDate(incidentDate)
                .description(fullDescription)
                .victimAge(request.getVictimAge())
                .suspectAge(request.getSuspectAge())
                .status("Open")
                .severity(severity)
                .createdAt(LocalDateTime.now())
                .embeddingJson(embeddingJson)
                .build();

        crimeRecordRepository.save(record);
        log.info("Successfully registered new e-FIR [{}] for crime type '{}' in '{}'", caseId, request.getCrimeType(), request.getLocation());

        // Construct AI Triage & Response Receipt
        String penalCode = getPenalCodeMapping(request.getCrimeType());
        String station = getPoliceStationMapping(request.getLocation(), request.getCrimeType());
        String triageSummary = generateTriageSummary(request, severity, penalCode);

        List<String> milestones = List.of(
                "FIR Registered & Digitally Signed (" + LocalDate.now() + ")",
                "Assigned to " + station + " Duty Officer",
                "Automated Vector Intelligence Indexing Completed",
                "Pending Physical Evidence & Station Verification"
        );

        return ComplaintResponse.builder()
                .trackingNumber(caseId)
                .caseId(caseId)
                .status("Open")
                .severity(severity)
                .crimeType(request.getCrimeType())
                .location(request.getLocation())
                .incidentDate(incidentDate.toString())
                .complainantName(request.getComplainantName())
                .aiTriageSummary(triageSummary)
                .recommendedPenalCode(penalCode)
                .assignedPoliceStation(station)
                .createdAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .message("Your complaint has been successfully registered and indexed in the Crime Intelligence Database.")
                .investigationMilestones(milestones)
                .build();
    }

    /**
     * Tracks an existing complaint or crime case by case ID / tracking number.
     */
    public Optional<ComplaintResponse> trackComplaint(String trackingNumber) {
        Optional<CrimeRecord> optRecord = crimeRecordRepository.findByCaseId(trackingNumber.trim().toUpperCase());
        if (optRecord.isEmpty()) {
            // Also try exact match
            optRecord = crimeRecordRepository.findByCaseId(trackingNumber.trim());
        }

        return optRecord.map(record -> {
            String penalCode = getPenalCodeMapping(record.getCrimeType());
            String station = getPoliceStationMapping(record.getLocation(), record.getCrimeType());

            List<String> milestones = new ArrayList<>();
            milestones.add("Case Registered (" + record.getIncidentDate() + ")");
            milestones.add("Dispatched to " + station);

            if ("Under Investigation".equalsIgnoreCase(record.getStatus())) {
                milestones.add("Active Field Investigation in Progress");
                milestones.add("Forensic & Witness Statements Being Recorded");
            } else if ("Closed".equalsIgnoreCase(record.getStatus())) {
                milestones.add("Investigation Completed & Charge Sheet Submitted");
                milestones.add("Case Closed / Resolved");
            } else {
                milestones.add("Initial Triage & Evidence Collection Active");
            }

            return ComplaintResponse.builder()
                    .trackingNumber(record.getCaseId())
                    .caseId(record.getCaseId())
                    .status(record.getStatus())
                    .severity(record.getSeverity())
                    .crimeType(record.getCrimeType())
                    .location(record.getLocation())
                    .incidentDate(record.getIncidentDate() != null ? record.getIncidentDate().toString() : "N/A")
                    .complainantName("Citizen Record")
                    .aiTriageSummary(record.getDescription())
                    .recommendedPenalCode(penalCode)
                    .assignedPoliceStation(station)
                    .createdAt(record.getCreatedAt() != null ? record.getCreatedAt().toString() : "N/A")
                    .message("Case found in official registry.")
                    .investigationMilestones(milestones)
                    .build();
        });
    }

    private String determineSeverity(ComplaintRequest req) {
        if (req.getSeverity() != null && !req.getSeverity().isBlank()) {
            return req.getSeverity();
        }
        String lowerDesc = req.getDescription().toLowerCase();
        String lowerType = req.getCrimeType().toLowerCase();

        if (lowerDesc.contains("weapon") || lowerDesc.contains("gun") || lowerDesc.contains("knife") ||
            lowerDesc.contains("hospital") || lowerDesc.contains("hostage") || lowerType.contains("homicide") ||
            lowerType.contains("armed")) {
            return "Critical";
        }
        if (lowerType.contains("robbery") || lowerType.contains("assault") || lowerDesc.contains("injury") ||
            lowerDesc.contains("threat") || lowerDesc.contains("lakh") || lowerDesc.contains("crore")) {
            return "High";
        }
        if (lowerType.contains("theft") || lowerType.contains("fraud") || lowerType.contains("cyber")) {
            return "Medium";
        }
        return "Low";
    }

    private String getCityCode(String location) {
        if (location == null) return "IND";
        String l = location.toUpperCase().trim();
        if (l.contains("CHENNAI")) return "CHN";
        if (l.contains("BENGALURU") || l.contains("BANGALORE")) return "BLR";
        if (l.contains("MUMBAI")) return "BOM";
        if (l.contains("DELHI")) return "DEL";
        if (l.contains("HYDERABAD")) return "HYD";
        if (l.contains("KOLKATA")) return "CCU";
        if (l.contains("PUNE")) return "PNQ";
        if (l.contains("JAIPUR")) return "JAI";
        if (l.contains("AHMEDABAD")) return "AMD";
        if (l.contains("LUCKNOW")) return "LKO";
        return l.substring(0, Math.min(3, l.length()));
    }

    private String getPenalCodeMapping(String crimeType) {
        if (crimeType == null) return "BNS Sec. 303 (Theft)";
        String t = crimeType.toLowerCase();
        if (t.contains("theft") || t.contains("mobile") || t.contains("snatching")) {
            return "IPC Sec. 379 / BNS Sec. 303 (Theft)";
        }
        if (t.contains("vehicle")) {
            return "IPC Sec. 379/411 / BNS Sec. 303(2) (Motor Vehicle Theft)";
        }
        if (t.contains("cyber") || t.contains("phishing") || t.contains("otp") || t.contains("online")) {
            return "IT Act Sec. 66D & IPC Sec. 420 (Cheating by Impersonation via Computer)";
        }
        if (t.contains("robbery") || t.contains("armed")) {
            return "IPC Sec. 392 / BNS Sec. 309 (Robbery with Aggravating Circumstances)";
        }
        if (t.contains("burglary") || t.contains("housebreak")) {
            return "IPC Sec. 454 / BNS Sec. 331 (Lurking House-trespass & Burglary)";
        }
        if (t.contains("assault") || t.contains("violence")) {
            return "IPC Sec. 323/352 / BNS Sec. 115 (Voluntarily Causing Hurt)";
        }
        if (t.contains("fraud") || t.contains("scam") || t.contains("financial")) {
            return "IPC Sec. 420 / BNS Sec. 318 (Cheating and Dishonesty)";
        }
        if (t.contains("harassment") || t.contains("stalking")) {
            return "IPC Sec. 354D / BNS Sec. 78 (Stalking & Harassment)";
        }
        if (t.contains("missing")) {
            return "CrPC Sec. 100 / Missing Person Protocol (Priority SAR)";
        }
        return "IPC General Offenses / BNS Statutory Code";
    }

    private String getPoliceStationMapping(String location, String crimeType) {
        String loc = location != null ? location : "General";
        if (crimeType != null && crimeType.toLowerCase().contains("cyber")) {
            return loc + " Central Cyber Crime & Digital Forensics Wing";
        }
        return loc + " Law & Order Division (Zonal Command PS)";
    }

    private String generateTriageSummary(ComplaintRequest req, String severity, String penalCode) {
        return String.format(
                "Automated AI Triage: Classified under %s [%s Priority]. Incident registered in %s jurisdiction. Preliminary legal assessment maps to %s. Case queued for forensic validation.",
                req.getCrimeType(), severity.toUpperCase(), req.getLocation(), penalCode
        );
    }
}
