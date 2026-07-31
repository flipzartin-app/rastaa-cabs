import { useEffect, useState } from "react";
import BookingAdminPanel from "./BookingAdminPanel2";

const AUTH_API_URL = "/api/admin";

async function parseApiResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error(text || `HTTP ${res.status}`);
}

export default function AdminAuthGate2() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function verifySession() {
      const token = window.localStorage.getItem("rastaa-admin-token");
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch(`${AUTH_API_URL}/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await parseApiResponse(res);
        if (!res.ok) throw new Error(data.error || "Session expired");
        setIsAuthenticated(true);
      } catch (err) {
        window.localStorage.removeItem("rastaa-admin-token");
        setError(err.message || "Please sign in again");
      } finally {
        setCheckingAuth(false);
      }
    }

    verifySession();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await parseApiResponse(res);
      if (!res.ok || !data.token) throw new Error(data.error || "Invalid credentials");

      window.localStorage.setItem("rastaa-admin-token", data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="rounded-lg border border-roadline/70 bg-paper/95 p-8 text-road/70">
        Checking admin access...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-roadline/70 bg-paper/95 p-6 md:p-8 shadow-2xl shadow-black/30">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-taxi">Admin sign in</p>
        <h2 className="font-display text-road text-2xl mt-1">Access the dispatcher panel</h2>
        <p className="text-steel mt-2">Use the admin username and password to view and manage bookings.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4 max-w-md">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-road/60">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="rounded-sm border border-road/20 px-3 py-2 bg-white text-road"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-road/60">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-sm border border-road/20 px-3 py-2 bg-white text-road"
            />
          </label>

          {error ? (
            <div className="rounded-sm border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-sm bg-taxi px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-road transition-colors hover:bg-taxi-dark disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return <BookingAdminPanel />;
}
