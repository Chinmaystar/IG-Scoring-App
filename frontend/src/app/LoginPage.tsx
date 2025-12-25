import React from 'react'
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // fake auth success
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Admin Login
        </h2>

        <p className="text-sm text-gray-600 mb-6 text-center">
          This is a fake login (frontend only)
        </p>

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
}