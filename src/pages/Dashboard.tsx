import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Import useAuth
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import OverviewPage from "./dashboard/OverviewPage";
import OrdersPage from "./dashboard/OrdersPage";
import MenuManagementPage from "./dashboard/MenuManagementPage";
import TablesPage from "./dashboard/TablesPage";
import ReservationsPage from "./dashboard/ReservationsPage";
import FeedbackPage from "./dashboard/FeedbackPage";
import StaffManagementPage from "./dashboard/StaffManagementPage";
import AnalyticsPage from "./dashboard/AnalyticsPage";
import SettingsPage from "./dashboard/SettingsPage";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth(); // ✅ Get user data from AuthContext

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user data, show error (shouldn't happen with PrivateRoute)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p>Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Now gets real data from AuthContext */}
        <DashboardHeader 
          restaurantName={user.restaurantName}
          ownerName={user.name}
          ownerEmail={user.email}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<OverviewPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="menu" element={<MenuManagementPage />} />
            <Route path="tables" element={<TablesPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="staff" element={<StaffManagementPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;