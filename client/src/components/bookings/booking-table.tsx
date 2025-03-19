import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Booking } from "@shared/schema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CreditCard } from "lucide-react";

interface BookingTableProps {
  bookings: Booking[];
  onViewBooking: (booking: Booking) => void;
}

export function BookingTable({ bookings, onViewBooking }: BookingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Guest Name</TableHead>
          <TableHead>Check In</TableHead>
          <TableHead>Check Out</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>B{booking.id.toString().padStart(5, '0')}</TableCell>
            <TableCell>{booking.guestName}</TableCell>
            <TableCell>{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</TableCell>
            <TableCell>{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</TableCell>
            <TableCell>
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                {booking.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                {booking.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>${booking.total}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewBooking(booking)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {booking.paymentStatus === 'unpaid' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onViewBooking(booking)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Pay Now
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}