package com.rastaa.fare;

import com.rastaa.fare.model.FareRequest;
import com.rastaa.fare.model.FareResponse;
import org.springframework.stereotype.Service;

@Service
public class FareService {

    private static final double ROUND_TRIP_MULTIPLIER = 1.9; // return leg isn't quite 2x
    private static final double LOCAL_HOURLY_MULTIPLIER = 0.6; // hourly local packages price lower per km

    public FareResponse calculate(FareRequest request) {
        CabType cabType = CabType.fromId(request.getCabTypeId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Unknown cabTypeId: " + request.getCabTypeId()));

        double distanceKm = Math.max(0, request.getDistanceKm());
        double extraKm = Math.max(0, distanceKm - cabType.getIncludedKm());
        double extraKmCharge = extraKm * cabType.getPerKmRate();

        double multiplier = tripMultiplier(request.getTripType());
        double subtotal = (cabType.getBaseFare() + extraKmCharge) * multiplier;

        double total = Math.round(subtotal * 100.0) / 100.0;

        return new FareResponse(
                cabType.getId(),
                distanceKm,
                cabType.getBaseFare(),
                Math.round(extraKmCharge * 100.0) / 100.0,
                multiplier,
                total
        );
    }

    private double tripMultiplier(String tripType) {
        if (tripType == null) return 1.0;
        return switch (tripType) {
            case "outstation-round" -> ROUND_TRIP_MULTIPLIER;
            case "local" -> LOCAL_HOURLY_MULTIPLIER;
            default -> 1.0; // outstation-oneway, airport
        };
    }
}
