import React from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./Pages/HomePage";
import StorePage from "./Pages/StorePage";
import AboutPage from "./Pages/AboutPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import { Routes, Route, Navigate } from "react-router-dom";
import NotFoundPage from "./Pages/NotFoundPage";
import ProductRoutePage from "./Pages/ProductRoutePage";
import CartPage from "./Pages/CartPage";

// Admin imports
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import ContactPage from "./Pages/ContactPage";
import { AdminProvider } from "./admin/context/AdminContext";

// Layout wrapper for regular pages
const RegularLayout = ({ children }) => (
  <div>
    <Header />
    <div>{children}</div>
    <Footer />
  </div>
);

const App = () => {
  return (
    <AdminProvider>
      <Routes>
        {/* Admin routes - No Header/Footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* Regular routes - With Header/Footer */}
        <Route
          path="/"
          element={
            <RegularLayout>
              <HomePage />
            </RegularLayout>
          }
        />
        <Route
          path="/store"
          element={
            <RegularLayout>
              <StorePage />
            </RegularLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <RegularLayout>
              <ContactPage />
            </RegularLayout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <RegularLayout>
              <ProductRoutePage />
            </RegularLayout>
          }
        />
        <Route
          path="/login"
          element={
            <RegularLayout>
              <LoginPage />
            </RegularLayout>
          }
        />
        <Route
          path="/about"
          element={
            <RegularLayout>
              <AboutPage />
            </RegularLayout>
          }
        />
        <Route
          path="/register"
          element={
            <RegularLayout>
              <RegisterPage />
            </RegularLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <RegularLayout>
              <CartPage />
            </RegularLayout>
          }
        />
        <Route
          path="*"
          element={
            <RegularLayout>
              <NotFoundPage />
            </RegularLayout>
          }
        />
      </Routes>
    </AdminProvider>
  );
};

export default App;
