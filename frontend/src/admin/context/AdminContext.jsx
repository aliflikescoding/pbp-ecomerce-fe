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
      const response = await axios.get("/api/admin/me");
      if (response.data.status === "success") {
        setAdmin(response.data.admin);
      }
    } catch (error) {
      console.log("Admin not authenticated");
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/admin/login", {
        email,
        password,
      });
      if (response.data.status === "success") {
        setAdmin(response.data.admin);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/admin/logout");
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
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
