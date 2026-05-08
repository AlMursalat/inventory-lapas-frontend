import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Borrowers from "./pages/Borrowers";
import Borrowings from "./pages/Borrowings";
import BorrowViaQR from "./pages/BorrowViaQR";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:ml-64 min-h-screen">

        {/* NAVBAR */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* QR BORROW PUBLIC */}
        <Route path="/borrow" element={<BorrowViaQR />} />

        {/* =========================
            PROTECTED ADMIN ROUTES
        ========================= */}

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* BORROWERS */}
        <Route
          path="/borrowers"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Borrowers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* BORROWINGS */}
        <Route
          path="/borrowings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Borrowings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;