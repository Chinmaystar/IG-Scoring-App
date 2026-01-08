import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperLoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    // TODO: fetch or pull here for password and username
    // 🔐 Fake auth logic (temporary)
    if (username === "admin" && password === "admin123") {
      // later: store token / role
      navigate("/superadmin");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Admin Login
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 mb-4 text-center">
            {error}
          </p>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Hint (remove later) */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          Demo credentials: <span className="font-mono">admin / admin123</span>
        </p>
      </div>
    </div>
  );
}