import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/layout/stats-card";
import { BookingTable } from "@/components/bookings/booking-table";
import { Booking } from "@shared/schema";
import { 
  BadgeDollarSign, 
  BedDouble, 
  CalendarDays,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const stats = {
    totalBookings: bookings.length,
    revenue: bookings.reduce((sum, b) => sum + b.total, 0),
    occupancy: 75, // This would be calculated based on room availability
    pendingPayments: bookings.filter(b => b.paymentStatus === "unpaid").length
  };

  // Mock data for the chart
  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 5500 },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Revenue"
              value={`$${stats.revenue}`}
              icon={<BadgeDollarSign className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Room Occupancy"
              value={`${stats.occupancy}%`}
              icon={<BedDouble className="h-4 w-4 text-muted-foreground" />}
              trend={{ value: 3, isPositive: false }}
            />
            <StatsCard
              title="Pending Payments"
              value={stats.pendingPayments}
              icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
              description="Requires attention"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingTable 
                  bookings={bookings.slice(0, 5)} 
                  onViewBooking={() => {}} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
