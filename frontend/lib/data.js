export const CAB_TYPES = [
  {
    id: "hatchback",
    label: "Hatchback",
    example: "Swift, Tiago or similar",
    seats: 4,
    baseKm: 50,
    baseFare: 700,
    perKm: 17.5,
  },
  {
    id: "sedan",
    label: "Sedan",
    example: "Dzire, Etios or similar",
    seats: 4,
    baseKm: 50,
    baseFare: 875,
    perKm: 13,
  },
  {
    id: "suv",
    label: "SUV",
    example: "Ertiga, Xylo or similar",
    seats: 6,
    baseKm: 50,
    baseFare: 1400,
    perKm: 15,
  },
  {
    id: "prime-sedan",
    label: "Prime Sedan",
    example: "Amaze, Etios or similar",
    seats: 4,
    baseKm: 50,
    baseFare: 1540,
    perKm: 18.5,
  },
  {
    id: "prime-suv",
    label: "Prime SUV",
    example: "Innova Crysta or similar",
    seats: 6,
    baseKm: 50,
    baseFare: 1925,
    perKm: 21,
  },
];

export const TRIP_TYPES = [
  { id: "outstation-oneway", label: "Outstation • One way" },
  { id: "outstation-round", label: "Outstation • Round trip" },
  { id: "local", label: "Local / Hourly" },
  { id: "airport", label: "Airport transfer" },
];

export const CITIES = [
  "Chandigarh",
  "Ludhiana",
  "Delhi",
  "Mohali",
  "Panchkula",
  "Amritsar",
  "Shimla",
  "Zirakpur",
];

export const POPULAR_ROUTES = [
  { from: "Chandigarh", to: "Delhi", km: 247, hours: "4h 17m", fare: 2989 },
  { from: "Chandigarh", to: "Shimla", km: 112, hours: "3h 09m", fare: 1423 },
  { from: "Chandigarh", to: "Manali", km: 310, hours: "7h 40m", fare: 4550 },
  { from: "Chandigarh", to: "Amritsar", km: 234, hours: "4h 05m", fare: 2810 },
  { from: "Ludhiana", to: "Chandigarh", km: 100, hours: "2h 05m", fare: 1330 },
  { from: "Delhi", to: "Chandigarh", km: 247, hours: "4h 20m", fare: 2989 },
];

// Mirrors the pricing rules implemented for real by the Java fare-engine
// microservice (see /backend-java) — used here only for the instant,
// client-side meter preview before the user submits a booking.
export function estimateFare(cabTypeId, distanceKm) {
  const cab = CAB_TYPES.find((c) => c.id === cabTypeId) || CAB_TYPES[0];
  const extraKm = Math.max(0, distanceKm - cab.baseKm);
  const total = cab.baseFare + extraKm * cab.perKm;
  return Math.round(total);
}
