import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroButton, GlassButton } from "@/components/ui/button-variants";
import {
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  ShoppingBag,
  Star,
  Plus,
  Eye,
  Users,
  ChefHat,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface OrderItem {
  id: number;
  tableNumber: number;
  customerName: string;
  items: string[];
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  timestamp: string;
}

const recentOrders: OrderItem[] = [
  {
    id: 1,
    tableNumber: 5,
    customerName: "John Smith",
    items: ["Caesar Salad", "Grilled Salmon"],
    total: 37.98,
    status: "pending",
    timestamp: "2 mins ago"
  },
  {
    id: 2,
    tableNumber: 3,
    customerName: "Sarah Wilson",
    items: ["Chicken Wings", "Caesar Salad"],
    total: 28.98,
    status: "preparing",
    timestamp: "5 mins ago"
  },
  {
    id: 3,
    tableNumber: 8,
    customerName: "Mike Johnson",
    items: ["Grilled Salmon"],
    total: 24.99,
    status: "ready",
    timestamp: "8 mins ago"
  },
  {
    id: 4,
    tableNumber: 12,
    customerName: "Emily Davis",
    items: ["Pasta Carbonara", "Garlic Bread"],
    total: 19.99,
    status: "delivered",
    timestamp: "15 mins ago"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "status-pending";
    case "preparing": return "status-preparing";
    case "ready": return "status-ready";
    case "delivered": return "status-completed";
    default: return "bg-muted";
  }
};

export const DashboardOverview = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your restaurant today.</p>
        </div>
        <div className="flex space-x-3">
          <GlassButton>
            <Eye className="h-4 w-4 mr-2" />
            View Menu
          </GlassButton>
          <HeroButton>
            <Plus className="h-4 w-4 mr-2" />
            Add New Dish
          </HeroButton>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glass border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Orders Today</p>
                <p className="text-3xl font-bold text-foreground">24</p>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+12% from yesterday</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Revenue Today</p>
                <p className="text-3xl font-bold text-foreground">$542</p>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+8% from yesterday</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Pending Orders</p>
                <p className="text-3xl font-bold text-foreground">3</p>
                <div className="flex items-center text-sm text-warning mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Needs attention</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-warning/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Popular Dish</p>
                <p className="text-lg font-bold text-foreground">Caesar Salad</p>
                <div className="flex items-center text-sm text-primary mt-1">
                  <ChefHat className="h-4 w-4 mr-1" />
                  <span>12 orders today</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-secondary rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 card-glass border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">T{order.tableNumber}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-foreground">{order.customerName}</p>
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.items.join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${order.total}</p>
                    <p className="text-xs text-muted-foreground">Table {order.tableNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Sales Chart Placeholder */}
          <Card className="card-glass border-0">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Sales Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Chart Coming Soon</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-semibold text-foreground">$3,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Week</span>
                  <span className="font-semibold text-muted-foreground">$2,891</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Insights */}
          <Card className="card-glass border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Menu Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <ArrowUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Most Ordered</p>
                    <p className="text-xs text-muted-foreground">Caesar Salad - 12 orders</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                    <ArrowDown className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Least Ordered</p>
                    <p className="text-xs text-muted-foreground">Fish Tacos - 1 order</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Feedback */}
          <Card className="card-glass border-0">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Star className="h-5 w-5 mr-2 text-primary" />
                Recent Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-foreground">"Amazing food and great service!"</p>
                  <p className="text-xs text-muted-foreground mt-1">- Sarah W.</p>
                </div>
                
                <div className="p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                  </div>
                  <p className="text-sm text-foreground">"Good food, quick service."</p>
                  <p className="text-xs text-muted-foreground mt-1">- Mike J.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="card-glass border-0">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Plus className="h-6 w-6" />
              <span>Add New Dish</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Manage Staff</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};