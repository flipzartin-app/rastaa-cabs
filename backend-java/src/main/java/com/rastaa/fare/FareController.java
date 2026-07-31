package com.rastaa.fare;

import com.rastaa.fare.model.FareRequest;
import com.rastaa.fare.model.FareResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fare")
@CrossOrigin(origins = "*") // demo only — restrict this in production
public class FareController {

    private final FareService fareService;

    public FareController(FareService fareService) {
        this.fareService = fareService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<FareResponse> calculate(@Valid @RequestBody FareRequest request) {
        return ResponseEntity.ok(fareService.calculate(request));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("fare-engine ok");
    }
}
