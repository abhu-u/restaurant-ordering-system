import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Award,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroButton, GlassButton } from "@/components/ui/button-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dummy data for charts
const ordersOverTime = [
  { date: "Mon", orders: 45 },
  { date: "Tue", orders: 52 },
  { date: "Wed", orders: 48 },
  { date: "Thu", orders: 61 },
  { date: "Fri", orders: 78 },
  { date: "Sat", orders: 95 },
  { date: "Sun", orders: 87 },
];

const revenueData = [
  { date: "Mon", revenue: 3450 },
  { date: "Tue", revenue: 4120 },
  { date: "Wed", revenue: 3890 },
  { date: "Thu", revenue: 4650 },
  { date: "Fri", revenue: 6200 },
  { date: "Sat", revenue: 7850 },
  { date: "Sun", revenue: 7100 },
];

const categorySales = [
  { name: "Mains", value: 4500, percentage: 38 },
  { name: "Drinks", value: 2800, percentage: 24 },
  { name: "Starters", value: 2200, percentage: 19 },
  { name: "Desserts", value: 2300, percentage: 19 },
];

const popularHours = [
  { hour: "11am", orders: 12 },
  { hour: "12pm", orders: 28 },
  { hour: "1pm", orders: 35 },
  { hour: "2pm", orders: 22 },
  { hour: "6pm", orders: 45 },
  { hour: "7pm", orders: 62 },
  { hour: "8pm", orders: 58 },
  { hour: "9pm", orders: 38 },
];

const recentOrders = [
  {
    id: "ORD-001",
    date: "2025-10-06",
    table: "Table 5",
    items: "Margherita Pizza, Caesar Salad",
    amount: 42.5,
    payment: "Card",
    status: "Completed",
  },
  {
    id: "ORD-002",
    date: "2025-10-06",
    table: "Table 12",
    items: "Ribeye Steak, Red Wine",
    amount: 85.0,
    payment: "Cash",
    status: "Completed",
  },
  {
    id: "ORD-003",
    date: "2025-10-06",
    table: "Table 3",
    items: "Spaghetti Carbonara, Tiramisu",
    amount: 38.5,
    payment: "Card",
    status: "Pending",
  },
  {
    id: "ORD-004",
    date: "2025-10-06",
    table: "Table 8",
    items: "Burger, Fries, Milkshake",
    amount: 28.0,
    payment: "Card",
    status: "Completed",
  },
  {
    id: "ORD-005",
    date: "2025-10-05",
    table: "Table 1",
    items: "Chicken Curry, Naan Bread",
    amount: 32.5,
    payment: "Cash",
    status: "Completed",
  },
];

const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  success: "hsl(var(--chart-2))",
  accent: "hsl(var(--chart-3))",
  warning: "hsl(var(--chart-4))",
  danger: "hsl(var(--chart-5))",
};

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, trend, icon }: MetricCardProps) => {
  return (
    <Card className="stat-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs mt-2">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-success" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <span
            className={
              trend === "up" ? "text-success" : "text-destructive"
            }
          >
            {change}
          </span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("This Week");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default">Completed</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your restaurant performance and insights
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <GlassButton className="gap-2">
                  <Calendar className="h-4 w-4" />
                  {dateRange}
                </GlassButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Select Period</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDateRange("Today")}>
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("This Week")}>
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("This Month")}>
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("Custom Range")}>
                  Custom Range
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <GlassButton className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </GlassButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Tables</DropdownMenuItem>
                <DropdownMenuItem>Section A</DropdownMenuItem>
                <DropdownMenuItem>Section B</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Categories</DropdownMenuItem>
                <DropdownMenuItem>Mains</DropdownMenuItem>
                <DropdownMenuItem>Drinks</DropdownMenuItem>
                <DropdownMenuItem>Desserts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <HeroButton className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </HeroButton>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Total Orders"
            value="466"
            change="+12.5%"
            trend="up"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <MetricCard
            title="Total Revenue"
            value="$37,210"
            change="+18.2%"
            trend="up"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <MetricCard
            title="Avg Order Value"
            value="$79.80"
            change="+4.7%"
            trend="up"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricCard
            title="Top Item"
            value="Ribeye"
            change="125 orders"
            trend="up"
            icon={<Award className="h-4 w-4" />}
          />
          <MetricCard
            title="Repeat Customers"
            value="68%"
            change="-2.3%"
            trend="down"
            icon={<Users className="h-4 w-4" />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Over Time */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
              <CardDescription>Daily order volume this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ordersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.primary, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Trend */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.success}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.success}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={CHART_COLORS.success}
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Sales Breakdown */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Category Sales</CardTitle>
              <CardDescription>Revenue by menu category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categorySales.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          Object.values(CHART_COLORS)[
                            index % Object.values(CHART_COLORS).length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Popular Hours */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Popular Hours</CardTitle>
              <CardDescription>Busiest times of the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="hour"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    fill={CHART_COLORS.accent}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card className="glass">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest orders from your restaurant</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-80"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.table}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {order.items}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{order.payment}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}