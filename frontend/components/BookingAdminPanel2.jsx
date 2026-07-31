import { useEffect, useState } from "react";

const BOOKINGS_API_URL = "/api/bookings";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("rastaa-admin-token");
  return token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : {};
}

function parseAdminToken() {
  if (typeof window === "undefined") return null;
  try {
    const token = window.localStorage.getItem("rastaa-admin-token");
    if (!token) return null;
    const parts = token.split(":");
    if (parts.length < 3) return null;
    return { username: parts[0], role: parts[1] };
  } catch (e) {
    return null;
  }
}

function logoutAdmin() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("rastaa-admin-token");
  window.location.reload();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusTone(status) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
    case "cancelled":
      return "bg-rose-500/15 text-rose-300 border-rose-400/30";
    case "completed":
      return "bg-sky-500/15 text-sky-300 border-sky-400/30";
    default:
      return "bg-amber-500/15 text-amber-300 border-amber-400/30";
  }
}

export default function BookingAdminPanel2() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    setAdmin(parseAdminToken());
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BOOKINGS_API_URL}?limit=50`, {
        cache: "no-store",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        if (res.status === 401) {
          window.localStorage.removeItem("rastaa-admin-token");
          window.location.reload();
          return;
        }
        const body = await res.text();
        throw new Error(body || "Unable to load bookings");
      }
      const data = await res.json();
      setBookings(data.results || []);
    } catch (err) {
      setError(err.message || "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleConfirm(id) {
    setConfirmingId(id);
    try {
      const res = await fetch(`${BOOKINGS_API_URL}/${id}/confirm`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Could not confirm booking");
      }
      const updated = await res.json();
      setBookings((current) => current.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      setError(err.message || "Could not confirm booking");
    } finally {
      setConfirmingId(null);
    }
  }

  async function handleCancel(id) {
    setCancellingId(id);
    try {
      const res = await fetch(`${BOOKINGS_API_URL}/${id}/cancel`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Could not cancel booking");
      }
      const updated = await res.json();
      setBookings((current) => current.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      setError(err.message || "Could not cancel booking");
    } finally {
      setCancellingId(null);
    }
  }

  async function handleComplete(id) {
    setCompletingId(id);
    try {
      const res = await fetch(`${BOOKINGS_API_URL}/${id}/complete`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Could not mark booking as completed");
      }
      const updated = await res.json();
      setBookings((current) => current.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      setError(err.message || "Could not mark booking as completed");
    } finally {
      setCompletingId(null);
    }
  }

  function matchesFilter(booking) {
    const today = new Date().toISOString().slice(0, 10);

    if (filter === "pending") {
      return booking.status === "pending_confirmation";
    }
    if (filter === "today") {
      return booking.date === today;
    }
    if (filter === "pending_today") {
      return booking.status === "pending_confirmation" && booking.date === today;
    }
    return true;
  }

  const visibleBookings = bookings.filter(matchesFilter);

  return (
    <div className="rounded-lg border border-roadline/70 bg-paper/95 p-5 md:p-8 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-taxi">Dispatcher panel</p>
          <h2 className="font-display text-road text-2xl mt-1">Booking requests</h2>
          <p className="text-steel mt-2">Review trip details, contact info, and confirm rides in one place.</p>
        </div>

        <div className="flex items-center gap-3">
          {admin ? (
            <div className="flex items-center gap-3 mr-4">
              <div className="text-road text-sm font-mono">{admin.username} • <span className="text-road/60">{admin.role}</span></div>
              <button onClick={logoutAdmin} className="rounded-sm border border-road/20 bg-white px-3 py-2 text-road text-sm">Logout</button>
            </div>
          ) : null}

          <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-road/60">
            <span className="sr-only">Status filter</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-sm border border-road/20 bg-white px-3 py-2 text-road"
            >
              <option value="all">All bookings</option>
              <option value="pending">Pending</option>
              <option value="today">Today</option>
              <option value="pending_today">Pending today</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <button
            type="button"
            onClick={loadBookings}
            className="rounded-sm border border-road/20 bg-road px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-paper transition-colors hover:bg-road/90"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-sm border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 rounded-sm border border-road/10 bg-road/5 p-6 text-sm text-road/70">
          Loading bookings...
        </div>
      ) : null}

      {!loading && visibleBookings.length === 0 ? (
        <div className="mt-8 rounded-sm border border-road/10 bg-road/5 p-6 text-sm text-road/70">
          No bookings match this filter yet.
        </div>
      ) : null}

      <div className="mt-8 space-y-4">
        {visibleBookings.map((booking) => (
          <article key={booking._id} className="rounded-lg border border-road/10 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-road text-xl">{booking.riderName || "Guest rider"}</h3>
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] ${getStatusTone(booking.status)}`}>
                    {booking.status || "pending_confirmation"}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-road/50">Route</p>
                    <p className="text-road font-medium">{booking.from} → {booking.to}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-road/50">Pickup date</p>
                    <p className="text-road font-medium">{booking.date}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-road/50">Contact</p>
                    <p className="text-road font-medium">{booking.contactNumber}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-road/50">Fare</p>
                    <p className="text-road font-medium">{formatCurrency(booking.estimatedFare)}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-road/50">Address</p>
                    <p className="text-road">{booking.address || "No pickup address provided"}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-road/50">Cab type</p>
                    <p className="text-road">{booking.cabTypeId}</p>
                  </div>
                </div>

                <div className="mt-4 text-sm text-road/70">
                  <span className="font-medium">Booked:</span> {formatDate(booking.createdAt)}
                </div>
              </div>

              <div className="flex flex-col gap-2 lg:min-w-[220px]">
                {booking.status === "pending_confirmation" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleConfirm(booking._id)}
                      disabled={confirmingId === booking._id}
                      className="rounded-sm bg-taxi px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-road transition-colors hover:bg-taxi-dark disabled:opacity-70"
                    >
                      {confirmingId === booking._id ? "Confirming…" : "Confirm booking"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="rounded-sm border border-rose-400/40 bg-rose-500/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-rose-700 transition-colors hover:bg-rose-500/20 disabled:opacity-70"
                    >
                      {cancellingId === booking._id ? "Cancelling…" : "Cancel booking"}
                    </button>
                  </>
                ) : (
                  <div className="rounded-sm border border-road/10 bg-road/5 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-road/70">
                    {booking.status === "confirmed" ? "Confirmed" : booking.status}
                  </div>
                )}

                {booking.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={() => handleComplete(booking._id)}
                    disabled={completingId === booking._id}
                    className="rounded-sm bg-sky-500 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-white transition-colors hover:bg-sky-600 disabled:opacity-70 mt-2"
                  >
                    {completingId === booking._id ? "Completing…" : "Mark as completed"}
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
