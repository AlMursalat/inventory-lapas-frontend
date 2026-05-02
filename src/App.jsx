import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

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
    <div className="flex min-h-screen">

      {/* SIDEBAR (ONLY ONCE — IMPORTANT) */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* PAGE CONTENT */}
        <main className="w-full p-4 md:p-6 bg-gray-100 min-h-screen">
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

        {/* PUBLIC */}
        <Route path="/borrow" element={<BorrowViaQR />} />

        {/* ADMIN */}
        <Route
          path="/"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/products"
          element={
            <AdminLayout>
              <Products />
            </AdminLayout>
          }
        />

        <Route
          path="/borrowers"
          element={
            <AdminLayout>
              <Borrowers />
            </AdminLayout>
          }
        />

        <Route
          path="/borrowings"
          element={
            <AdminLayout>
              <Borrowings />
            </AdminLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;