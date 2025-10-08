import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext"; // ✅ Add this

// Pages
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CustomerOrdering from "./pages/CustomerOrdering";
import NotFound from "./pages/NotFound";

// Auth
import PrivateRoute from "@/components/auth/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          {/* ✅ Wrap NotificationProvider inside AuthProvider */}
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* 🔒 Protected Dashboard */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard/*" element={<Dashboard />} />
              </Route>

              {/* ✅ Customer Order page */}
              <Route path="/order/:tableId" element={<CustomerOrdering />} />

              {/* Default fallback */}
              <Route path="/index" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;