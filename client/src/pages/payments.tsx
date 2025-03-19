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
import { PaymentWithDetails, BookingWithDetails } from '@shared/schema';
import { Search, Filter, Receipt, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaUniversity } from 'react-icons/fa';

const Payments = () => {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [bookingDetailOpen, setBookingDetailOpen] = useState(false);
  const itemsPerPage = 10;

  // Fetch payments
  const { data: payments = [], isLoading } = useQuery<PaymentWithDetails[]>({
    queryKey: ['/api/payments'],
  });

  // Filter payments based on status, method, and search term
  const filteredPayments = payments.filter(payment => {
    // Status filter
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    
    // Method filter
    const methodMatch = methodFilter === 'all' || payment.payment_method === methodFilter;
    
    // Search filter - check transaction ID, booking number, or guest name
    const searchMatch = 
      searchTerm === '' || 
      (payment.transaction_id && payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.booking.booking_number && payment.booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.booking.guest.name && payment.booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && methodMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openBookingDetail = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setBookingDetailOpen(true);
  };

  // Helper function to render status badges
  const renderStatusBadge = (status: string) => {
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
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Render payment method
  const renderPaymentMethod = (method: string, lastFour?: string) => {
    switch (method) {
      case 'visa':
        return (
          <div className="flex items-center">
            <FaCcVisa className="text-blue-800 mr-2 text-lg" /> 
            Visa {lastFour ? `****${lastFour}` : ''}
          </div>
        );
      case 'mastercard':
        return (
          <div className="flex items-center">
            <FaCcMastercard className="text-red-600 mr-2 text-lg" /> 
            MasterCard {lastFour ? `****${lastFour}` : ''}
          </div>
        );
      case 'amex':
        return (
          <div className="flex items-center">
            <FaCcAmex className="text-blue-500 mr-2 text-lg" /> 
            Amex {lastFour ? `****${lastFour}` : ''}
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="flex items-center">
            <FaUniversity className="text-gray-700 mr-2 text-lg" /> 
            Bank Transfer
          </div>
        );
      default:
        return method;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary mb-6">{t('nav.payments')}</h1>
          
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-40">
              <Select 
                value={methodFilter}
                onValueChange={setMethodFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">MasterCard</SelectItem>
                  <SelectItem value="amex">Amex</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transaction ID, booking #, or guest..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="sm:w-auto gap-1">
              <Filter className="h-4 w-4 mr-1" />
              More Filters
            </Button>
            <Button variant="outline" className="sm:w-auto gap-1">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
          
          {/* Payments table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-secondary">
                    <tr>
                      <th className="px-4 py-3">{t('payment.transactionId')}</th>
                      <th className="px-4 py-3">{t('booking.id')}</th>
                      <th className="px-4 py-3">{t('booking.guest')}</th>
                      <th className="px-4 py-3">{t('payment.date')}</th>
                      <th className="px-4 py-3">{t('payment.totalAmount')}</th>
                      <th className="px-4 py-3">{t('payment.paymentMethod')}</th>
                      <th className="px-4 py-3">{t('common.status')}</th>
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
                    ) : paginatedPayments.length > 0 ? (
                      paginatedPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-slate-100">
                          <td className="px-4 py-3">{payment.transaction_id || '-'}</td>
                          <td className="px-4 py-3">{payment.booking?.booking_number || '-'}</td>
                          <td className="px-4 py-3">{payment.booking?.guest?.name || '-'}</td>
                          <td className="px-4 py-3">{payment.payment_date ? formatDate(payment.payment_date) : '-'}</td>
                          <td className="px-4 py-3">${payment.amount || '0.00'}</td>
                          <td className="px-4 py-3">
                            {renderPaymentMethod(payment.payment_method || '', payment.card_last_four)}
                          </td>
                          <td className="px-4 py-3">
                            {renderStatusBadge(payment.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openBookingDetail(payment.booking)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-primary"
                              >
                                <Receipt className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                          No payments found matching your criteria.
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
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal 
          open={bookingDetailOpen} 
          onOpenChange={setBookingDetailOpen} 
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default Payments;
