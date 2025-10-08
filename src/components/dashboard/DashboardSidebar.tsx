import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  ShoppingBag,
  Menu as MenuIcon,
  Calendar,
  Users,
  Star,
  Settings,
  ChevronLeft,
  Home,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
    badge: 3
  },
  {
    title: "Menu Management",
    href: "/dashboard/menu",
    icon: MenuIcon,
  },
  {
    title: "Tables & QR Codes",
    href: "/dashboard/tables",
    icon: QrCode,
  },
  {
    title: "Reservations",
    href: "/dashboard/reservations",
    icon: Calendar,
  },
  {
    title: "Customers & Feedback",
    href: "/dashboard/feedback",
    icon: Star,
  },
  {
    title: "Staff Management",
    href: "/dashboard/staff",
    icon: Users,
  },
  {
    title: "Analytics & Reports",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const DashboardSidebar = ({ collapsed, onToggle }: DashboardSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <MenuIcon className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = currentPath === item.href || 
                          (item.href !== "/dashboard" && currentPath.startsWith(item.href));
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground"
                )} 
              />
              {!collapsed && (
                <>
                  <span className="font-medium flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground text-center">
            <p>QRMenu Dashboard</p>
            <p>v1.0.0</p>
          </div>
        </div>
      )}
    </aside>
  );
};