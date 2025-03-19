import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import BookingDetailModal from '@/components/modals/booking-detail-modal';
import PaymentModal from '@/components/modals/payment-modal';
import { BookingWithDetails } from '@shared/schema';
import { Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Bookings = () => {
  const { t } = useLanguage();
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [bookingDetailOpen, setBookingDetailOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch bookings
  const { data: bookings = [], isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ['/api/bookings'],
  });

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    // Status filter
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    
    // Search filter - check booking number, guest name, room type
    const searchMatch = 
      searchTerm === '' || 
      booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openBookingDetail = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setBookingDetailOpen(true);
  };

  const handlePaymentClick = () => {
    setBookingDetailOpen(false);
    setPaymentModalOpen(true);
  };

  // Helper function to render status badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Confirmed</Badge>;
      case 'new':
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">New</Badge>;
      case 'checked_in':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Checked In</Badge>;
      case 'checked_out':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Checked Out</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderPaymentStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Unpaid</Badge>;
    
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Unpaid</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary mb-6">{t('nav.bookings')}</h1>
          
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="sm:w-40">
              <Select 
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="checked_out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search booking #, guest name, or room type..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="sm:w-40 gap-1">
              <Calendar className="h-4 w-4" />
              New Booking
            </Button>
          </div>
          
          {/* Bookings table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-secondary">
                    <tr>
                      <th className="px-4 py-3 whitespace-nowrap">ID</th>
                      <th className="px-4 py-3">{t('booking.guest')}</th>
                      <th className="px-4 py-3">{t('room.type')}</th>
                      <th className="px-4 py-3">{t('booking.checkIn')}</th>
                      <th className="px-4 py-3">{t('booking.checkOut')}</th>
                      <th className="px-4 py-3">{t('booking.status')}</th>
                      <th className="px-4 py-3">{t('booking.paymentStatus')}</th>
                      <th className="px-4 py-3 text-right">{t('common.action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, index) => (
                        <tr key={index}>
                          <td colSpan={8} className="px-4 py-3">
                            <Skeleton className="h-10 w-full" />
                          </td>
                        </tr>
                      ))
                    ) : paginatedBookings.length > 0 ? (
                      paginatedBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100">
                          <td className="px-4 py-3 whitespace-nowrap">{booking.booking_number}</td>
                          <td className="px-4 py-3">{booking.guest.name}</td>
                          <td className="px-4 py-3">{booking.room.category.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(booking.check_in_date)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(booking.check_out_date)}</td>
                          <td className="px-4 py-3">
                            {renderStatusBadge(booking.status)}
                          </td>
                          <td className="px-4 py-3">
                            {booking.payment ? 
                              renderPaymentStatusBadge(booking.payment.status) : 
                              renderPaymentStatusBadge('unpaid')
                            }
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openBookingDetail(booking)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                          No bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-4 py-3 border-t border-slate-200">
                  <div className="text-sm text-slate-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {selectedBooking && (
        <>
          <BookingDetailModal 
            open={bookingDetailOpen} 
            onOpenChange={setBookingDetailOpen} 
            booking={selectedBooking}
            onPaymentClick={handlePaymentClick}
          />
          <PaymentModal 
            open={paymentModalOpen} 
            onOpenChange={setPaymentModalOpen} 
            booking={selectedBooking}
          />
        </>
      )}
    </div>
  );
};

export default Bookings;
