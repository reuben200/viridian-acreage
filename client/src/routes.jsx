import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import {
  Home,
  // About,
  Contact,
  Products,
  ProductDetail,
  PartnershipPage,
  QuotationPage,
  PageNotFound,
  HowItWorks,
} from "./pages";

// Auth pages
import { Login, Signup, ForgotPassword, VendorSignup } from "./pages/auth";

// Admin, Manager, and Customer dashboards
import {
  AdminLayout,
  QuotationsList,
  ProductsList,
  Reports,
  RestockList,
  SalesList,
  AdminDashboard,
  AdminVendorList,
  VendorDetails,
  VendorApprovals,
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
import {
  PartnerAnalytics,
  PartnerLayout,
  PartnerDashboard,
  PartnerInventory,
  PartnerOnboarding,
  PartnerProfile,
  PartnerStorefront,
} from "./pages/partners";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partnership" element={<PartnershipPage />} />
        <Route path="/quotation" element={<QuotationPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Signup />} />
        <Route path="/vendor" element={<VendorSignup />} />
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
        <Route path="vendors" element={<AdminVendorList />} />
        <Route path="vendors/:vendorId" element={<VendorDetails />} />
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
        <Route
          path="products"
          element={<p>Products management page for Manager</p>}
        />
        <Route
          path="reports"
          element={<p>Reports management page for Manager</p>}
        />
        <Route path="settings" element={<p>Settings page for Manager</p>} />
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
        <Route path="settings" element={<p>Settings page for Manager</p>} />
      </Route>

      {/* PARTNER ROUTES */}
      <Route
        path="/partner/*"
        element={
          <ProtectedRoute allowedRoles={["vendor", "partner"]}>
            <PartnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PartnerDashboard />} />
        <Route path="analytics" element={<PartnerAnalytics />} />
        <Route path="profile" element={<PartnerProfile />} />
        <Route path="storefront" element={<PartnerStorefront />} />
        <Route path="inventory" element={<PartnerInventory />} />
        <Route path="analytics" element={<PartnerAnalytics />} />
        <Route path="onboarding" element={<PartnerOnboarding />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
