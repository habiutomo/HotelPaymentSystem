import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { BookingTable } from "@/components/bookings/booking-table";
import { PaymentDialog } from "@/components/payments/payment-dialog";
import { Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Bookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const queryClient = useQueryClient();

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Bookings</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>

          <BookingTable 
            bookings={bookings} 
            onViewBooking={(booking) => setSelectedBooking(booking)} 
          />

          {selectedBooking && (
            <PaymentDialog
              open={true}
              onOpenChange={() => setSelectedBooking(null)}
              booking={selectedBooking}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}