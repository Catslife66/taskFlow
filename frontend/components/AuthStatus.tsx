"use client";

import { useAuth } from "@/context/AuthContext";

export default function AuthStatus() {
  const { user, loading, error, logout } = useAuth();

  if (loading) return <div>Checking login...</div>;

  if (user) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div>
          Logged in as: <b>{user.email}</b>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <div>Not logged in</div>
      {error ? <div style={{ opacity: 0.7 }}>{error}</div> : null}
    </div>
  );
}
