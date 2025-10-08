import { Bell, ChevronDown, Settings, LogOut, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistance } from "date-fns";

interface DashboardHeaderProps {
  restaurantName: string;
  ownerName: string;
  ownerEmail?: string;
  restaurantLogo?: string;
}

export const DashboardHeader = ({ 
  restaurantName, 
  ownerName, 
  ownerEmail,
  restaurantLogo 
}: DashboardHeaderProps) => {
  const { logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-md bg-background/80">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Restaurant Logo & Name */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {restaurantLogo ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={restaurantLogo} alt={restaurantName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {restaurantName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-lg">
                  {restaurantName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-foreground">{restaurantName}</h1>
              <p className="text-sm text-muted-foreground">Restaurant Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Real-time Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">Order Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    {unreadCount > 0 ? `${unreadCount} new order${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border hover:bg-muted/50 transition-colors relative group ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                      )}
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>

                      <div className="pl-3">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-semibold text-foreground">
                            New Order - Table {notification.tableNumber}
                          </p>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
{notification.customerName} • {notification.itemCount} item{notification.itemCount > 1 ? 's' : ''} • ${notification.totalPrice.toFixed(2)}                        </p>
                        
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {notification.items.join(", ")}
                        </p>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-3 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-primary">
                      View all orders
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {ownerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground font-medium hidden md:block">{ownerName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-sm font-medium text-foreground">{ownerName}</p>
                <p className="text-xs text-muted-foreground">{ownerEmail || "Restaurant Owner"}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Restaurant Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="cursor-pointer text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};