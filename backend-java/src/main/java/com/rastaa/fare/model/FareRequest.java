package com.rastaa.fare.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class FareRequest {

    @NotBlank
    private String cabTypeId;

    @PositiveOrZero
    private double distanceKm;

    /** e.g. "outstation-oneway", "outstation-round", "local", "airport" */
    private String tripType;

    public String getCabTypeId() {
        return cabTypeId;
    }

    public void setCabTypeId(String cabTypeId) {
        this.cabTypeId = cabTypeId;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getTripType() {
        return tripType;
    }

    public void setTripType(String tripType) {
        this.tripType = tripType;
    }
}
