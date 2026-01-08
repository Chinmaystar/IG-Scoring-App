import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicPage from "./PublicPage";
import AdminPage from "./AdminPage";
import LoginPage from "./LoginPage";
import MatchAdminPage from "./MatchAdminPage";
import MatchPublicPage from "./MatchPublicPage";
import SuperLoginPage from "./SuperLoginPage";
import SuperAdminPage from "./SuperAdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/match/:matchId" element={<MatchAdminPage />} />
      <Route path="/match/:matchId" element={<MatchPublicPage />} />
      <Route path="/superlogin" element={<SuperLoginPage />} />
      <Route path="/superadmin" element={<SuperAdminPage />} />
    </Routes>
  );
}