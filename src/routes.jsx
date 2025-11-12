import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import {
  Home,
  About,
  Contact,
  Products,
  ProductDetail,
  PartnershipPage,
  QuotationPage,
  PageNotFound,
} from "./pages";

// Auth pages
import { Login, Signup, ForgotPassword } from "./pages/auth";

// Admin, Manager, and Customer dashboards
import {
  AdminLayout,
  QuotationsList,
  ProductsList,
  Reports,
  RestockList,
  SalesList,
  AdminDashboard,
} from "./pages/admin";
import {
  Customers,
  Orders,
  Inventory,
  ManagerDashboard,
  ManagerLayout,
} from "./pages/manager";

import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import PartnerDashboard from "./pages/PartnershipDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partnership" element={<PartnershipPage />} />
        <Route path="/quotation" element={<QuotationPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="quotations" element={<QuotationsList />} />
        <Route path="partnership" element={<PartnerDashboard />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="restocks" element={<RestockList />} />
        <Route path="sales" element={<SalesList />} />
      </Route>

      {/* MANAGER ROUTES */}
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="partnership" element={<PartnerDashboard />} />
      </Route>

      {/* CUSTOMER ROUTES */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={["customer", "user"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="orders" element={<div>My Orders</div>} />
        <Route path="profile" element={<div>Profile Settings</div>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
