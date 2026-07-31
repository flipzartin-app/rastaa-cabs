import { useMemo, useState } from "react";
import { CAB_TYPES, CITIES, TRIP_TYPES, estimateFare } from "../lib/data";
import FareMeter from "./FareMeter";

export default function SearchWidget() {
  const [tripType, setTripType] = useState(TRIP_TYPES[0].id);
  const [from, setFrom] = useState(CITIES[0]);
  const [to, setTo] = useState(CITIES[2]);
  const [date, setDate] = useState("");
  const [cabTypeId, setCabTypeId] = useState(CAB_TYPES[1].id);
  const [distanceKm, setDistanceKm] = useState(247);
  const [status, setStatus] = useState(null);

  // Rider details
  const [riderName, setRiderName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  const fare = useMemo(
    () => estimateFare(cabTypeId, Number(distanceKm) || 0),
    [cabTypeId, distanceKm]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripType,
          from,
          to,
          date,
          cabTypeId,
          distanceKm: Number(distanceKm) || 0,
          estimatedFare: fare,
          riderName,
          contactNumber,
          address,
        }),
      });
      if (!res.ok) throw new Error("Booking request failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div
      id="book"
      className="bg-paper rounded-lg shadow-2xl shadow-black/40 p-5 md:p-6 -mt-16 relative z-10 max-w-4xl mx-auto"
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {TRIP_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTripType(t.id)}
            className={`font-mono text-[11px] uppercase tracking-widest px-3 py-2 rounded-sm border transition-colors ${
              tripType === t.id
                ? "bg-road text-taxi border-road"
                : "bg-transparent text-road/70 border-road/20 hover:border-road/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-4">
        <label className="md:col-span-3 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-road/60">
            Pickup city
          </span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-road/20 rounded-sm px-3 py-2 bg-white text-road font-medium"
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="md:col-span-3 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-road/60">
            Drop city
          </span>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-road/20 rounded-sm px-3 py-2 bg-white text-road font-medium"
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="md:col-span-3 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-road/60">
            Pickup date
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border border-road/20 rounded-sm px-3 py-2 bg-white text-road font-medium"
          />
        </label>

        <label className="md:col-span-3 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-road/60">
            Approx. distance (km)
          </span>
          <input
            type="number"
            min="1"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            className="border border-road/20 rounded-sm px-3 py-2 bg-white text-road font-medium font-mono"
          />
        </label>

        <label className="md:col-span-4 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-road/60">
            Your name
          </span>
          <input
            type="text"
            value={riderName}
            onChange={(e) => setRiderName(e.target.value)}
            required
            className="border border-road/20 rounded-sm px-3 py-2 bg-white text-road font-medium"
          />
        </label>

        <label className="md:col-span-4 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-road/60">
            Contact number
          </span>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
            className="border border-road/20 rounded-sm px-3 py-2 bg-white text-road font-medium"
            placeholder="e.g. +919876543210"
          />
        </label>

        <label className="md:col-span-12 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-road/60">
            Pickup address (optional)
          </span>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-road/20 rounded-sm px-3 py-2 bg-white text-road font-medium"
            placeholder="Street, building, landmark..."
          />
        </label>

        <label className="md:col-span-7 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-road/60">
            Cab type
          </span>
          <select
            value={cabTypeId}
            onChange={(e) => setCabTypeId(e.target.value)}
            className="border border-road/20 rounded-sm px-3 py-2 bg-white text-road font-medium"
          >
            {CAB_TYPES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} — {c.example}
              </option>
            ))}
          </select>
        </label>

        <div className="md:col-span-5">
          <FareMeter
            target={fare}
            subLabel={`${distanceKm || 0} km · incl. taxes on booking`}
          />
        </div>

        <div className="md:col-span-12 flex items-center gap-4 pt-1">
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-taxi hover:bg-taxi-dark disabled:opacity-60 text-road font-mono text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-sm transition-colors"
          >
            {status === "loading" ? "Booking…" : "Search cabs"}
          </button>
          {status === "success" && (
            <span className="font-mono text-xs text-meter">
              Request received — a dispatcher will confirm your cab shortly.
            </span>
          )}
          {status === "error" && (
            <span className="font-mono text-xs text-alert">
              Couldn't reach the booking service. Is the backend running?
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
