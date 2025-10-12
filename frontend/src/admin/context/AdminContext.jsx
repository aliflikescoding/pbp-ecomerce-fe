import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = "http://localhost:5000";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await axios.get("/api/user/me");
      if (response.data.status === "success" && response.data.user.is_admin) {
        setAdmin(response.data.user);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.log("Admin not authenticated");
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  // Login is now handled by main LoginPage, this just refreshes admin state
  const refreshAdminAuth = async () => {
    await checkAdminAuth();
  };

  const logout = async () => {
    try {
      await axios.post("/api/user/logout");
      setAdmin(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      setAdmin(null);
      return { success: false };
    }
  };

  const value = {
    admin,
    loading,
    logout,
    refreshAdminAuth,
    isAuthenticated: !!admin,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
