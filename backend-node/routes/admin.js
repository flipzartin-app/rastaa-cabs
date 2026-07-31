const express = require("express");
const crypto = require("crypto");

const router = express.Router();

function getAdminUsers() {
  // ADMIN_USERS format: username:password:role,username2:password2:role2
  const env = process.env.ADMIN_USERS || "";
  if (env) {
    return env.split(",").map((entry) => {
      const [username, password, role] = entry.split(":");
      return { username, password, role: role || "dispatcher" };
    });
  }

  // Fallback single-user env vars
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const role = process.env.ADMIN_ROLE || "admin";
  return [{ username, password, role, }];
}

function createToken(username, role, secret) {
  // Token includes role so callers can show role-aware UI
  const payload = `${username}:${role}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${username}:${role}:${signature}`;
}

function verifyToken(token, secret) {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length < 3) return false;
  const username = parts[0];
  const role = parts[1];
  const signature = parts.slice(2).join(":");
  const expected = crypto.createHmac("sha256", secret).update(`${username}:${role}`).digest("hex");
  return signature === expected ? { username, role } : false;
}

function authenticateAdmin(req, res, next) {
  const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Authentication required" });

  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "rastaa-admin-dev-secret";
  const verified = verifyToken(token, sessionSecret);
  if (!verified) return res.status(401).json({ error: "Invalid token" });

  req.adminUser = verified; // { username, role }
  next();
}

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const users = getAdminUsers();
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "rastaa-admin-dev-secret";
  const token = createToken(user.username, user.role, sessionSecret);
  res.json({ username: user.username, role: user.role, token });
});

router.get("/verify", (req, res) => {
  const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "rastaa-admin-dev-secret";
  const verified = verifyToken(token, sessionSecret);
  if (!verified) return res.status(401).json({ error: "Invalid token" });

  res.json({ ok: true, username: verified.username, role: verified.role });
});

module.exports = { router, authenticateAdmin };