import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BookingDetailModal from '@/components/modals/booking-detail-modal';
import PaymentModal from '@/components/modals/payment-modal';
import { BookingWithDetails, PaymentWithDetails } from '@shared/schema';
import { Eye, Calendar, DollarSign, Bed, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsData {
  bookings: number;
  revenue: string;
  occupancy: string;
  pendingPayments: number;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [bookingDetailOpen, setBookingDetailOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
  });

  // Fetch recent bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ['/api/bookings'],
  });

  // Fetch recent payments
  const { data: payments, isLoading: paymentsLoading } = useQuery<PaymentWithDetails[]>({
    queryKey: ['/api/payments'],
  });

  const openBookingDetail = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setBookingDetailOpen(true);
  };

  const openPaymentModal = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
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
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderPaymentStatusBadge = (status: string) => {
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
          <h1 className="gradient-heading text-3xl mb-6">{t('common.dashboard')}</h1>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statsLoading ? (
              <>
                <Card>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="stat-card shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
                  <div className="absolute h-2 w-full bg-gradient-to-r from-cyan-400 to-cyan-600 top-0 left-0"></div>
                  <CardContent className="p-5 pt-7">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-500 text-sm mb-1">{t('common.totalBookings')}</p>
                        <h3 className="text-3xl font-bold text-secondary bg-gradient-to-r from-cyan-700 to-teal-500 bg-clip-text text-transparent">{stats?.bookings}</h3>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-full text-cyan-600 shadow-sm">
                        <Calendar className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-emerald-500 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                        12% {t('common.from')} last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
                <Card className="stat-card shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
                  <div className="absolute h-2 w-full bg-gradient-to-r from-blue-400 to-blue-600 top-0 left-0"></div>
                  <CardContent className="p-5 pt-7">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-500 text-sm mb-1">{t('common.revenue')}</p>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">${stats?.revenue}</h3>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full text-blue-600 shadow-sm">
                        <DollarSign className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-blue-500 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                        8% {t('common.from')} last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
                <Card className="stat-card shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
                  <div className="absolute h-2 w-full bg-gradient-to-r from-cyan-400 to-sky-400 top-0 left-0"></div>
                  <CardContent className="p-5 pt-7">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-500 text-sm mb-1">{t('common.roomOccupancy')}</p>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">{stats?.occupancy}</h3>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-sky-50 to-sky-100 rounded-full text-sky-600 shadow-sm">
                        <Bed className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-sky-500 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        3% {t('common.from')} last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
                <Card className="stat-card shadow-lg hover:shadow-xl transition-all duration-300 border-none overflow-hidden">
                  <div className="absolute h-2 w-full bg-gradient-to-r from-indigo-400 to-purple-400 top-0 left-0"></div>
                  <CardContent className="p-5 pt-7">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-500 text-sm mb-1">{t('common.pendingPayments')}</p>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">{stats?.pendingPayments}</h3>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full text-indigo-600 shadow-sm">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm mt-2 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                      Requires attention
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Recent bookings */}
          <Card className="mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">{t('nav.bookings')}</h2>
                <Button variant="link" className="text-primary btn-hover-effect">
                  {t('common.viewAll')}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">{t('booking.guest')}</th>
                      <th className="px-4 py-3">{t('room.type')}</th>
                      <th className="px-4 py-3">{t('booking.checkIn')}</th>
                      <th className="px-4 py-3">{t('booking.checkOut')}</th>
                      <th className="px-4 py-3">{t('booking.status')}</th>
                      <th className="px-4 py-3">{t('booking.paymentStatus')}</th>
                      <th className="px-4 py-3">{t('common.action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsLoading ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-3">
                          <Skeleton className="h-10 w-full" />
                        </td>
                      </tr>
                    ) : bookings && bookings.length > 0 ? (
                      bookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100">
                          <td className="px-4 py-3">{booking.booking_number}</td>
                          <td className="px-4 py-3">{booking.guest?.name ?? 'N/A'}</td>
                          <td className="px-4 py-3">{booking.room?.category?.name ?? 'N/A'}</td>
                          <td className="px-4 py-3">{formatDate(booking.check_in_date)}</td>
                          <td className="px-4 py-3">{formatDate(booking.check_out_date)}</td>
                          <td className="px-4 py-3">
                            {renderStatusBadge(booking.status)}
                          </td>
                          <td className="px-4 py-3">
                            {booking.payment ? 
                              renderPaymentStatusBadge(booking.payment.status) : 
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Unpaid</Badge>
                            }
                          </td>
                          <td className="px-4 py-3">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openBookingDetail(booking)}
                              className="hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-3 text-center">
                          No bookings found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent payments */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Recent Payments</h2>
                <Button variant="link" className="text-primary btn-hover-effect">
                  {t('common.viewAll')}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="px-4 py-3">{t('payment.transactionId')}</th>
                      <th className="px-4 py-3">{t('booking.id')}</th>
                      <th className="px-4 py-3">{t('payment.date')}</th>
                      <th className="px-4 py-3">{t('payment.totalAmount')}</th>
                      <th className="px-4 py-3">{t('payment.paymentMethod')}</th>
                      <th className="px-4 py-3">{t('common.status')}</th>
                      <th className="px-4 py-3">{t('common.action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsLoading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-3">
                          <Skeleton className="h-10 w-full" />
                        </td>
                      </tr>
                    ) : payments && payments.length > 0 ? (
                      payments.slice(0, 5).map((payment) => (
                        <tr key={payment.id} className="border-b border-slate-100">
                          <td className="px-4 py-3">{payment.transaction_id}</td>
                          <td className="px-4 py-3">{payment.booking?.booking_number}</td>
                          <td className="px-4 py-3">{payment.payment_date ? formatDate(payment.payment_date) : '-'}</td>
                          <td className="px-4 py-3">${payment.amount}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {payment.payment_method === 'visa' && (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-800 mr-2" viewBox="0 0 576 512" fill="currentColor">
                                    <path d="M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43.5 16-43.5-.2.3 3.3-9.1 5.3-14.9l2.8 13.4zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.4-12.7-18.2-13.1H32.7l-.7 3.1c15.8 4 29.9 9.8 42.2 17.1l35.8 135h42.5zm94.4.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6 1.7 5.5-33.6c-7.9-3.1-20.5-6.6-36-6.6-39.7 0-67.6 21.2-67.8 51.4-.3 22.3 20 34.7 35.2 42.2 15.5 7.6 20.8 12.6 20.8 19.3-.2 10.4-12.6 15.2-24.1 15.2-16 0-24.6-2.5-37.7-8.3l-5.3-2.5-5.6 34.9c9.4 4.3 26.8 8.1 44.8 8.3 42.2.1 69.7-20.8 70-53zM528 331.4L495.6 176h-31.1c-9.6 0-16.9 2.8-21 12.9l-59.7 142.5H426s6.9-19.2 8.4-23.3H486c1.2 5.5 4.8 23.3 4.8 23.3H528z" />
                                  </svg>
                                  Visa ****{payment.card_last_four}
                                </>
                              )}
                              {payment.payment_method === 'mastercard' && (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 mr-2" viewBox="0 0 576 512" fill="currentColor">
                                    <path d="M482.9 410.3c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.6 0 11.2 5.2 11.2 11.7zm-310.8-11.7c-7.1 0-11.2 5.2-11.2 11.7 0 6.5 4.1 11.7 11.2 11.7 6.5 0 10.9-4.9 10.9-11.7-.1-6.5-4.4-11.7-10.9-11.7zm117.5-.3c-5.4 0-8.7 3.5-9.5 8.7h19.1c-.9-5.7-4.4-8.7-9.6-8.7zm107.8.3c-6.8 0-10.9 5.2-10.9 11.7 0 6.5 4.1 11.7 10.9 11.7 6.8 0 11.2-4.9 11.2-11.7 0-6.5-4.4-11.7-11.2-11.7zm105.9 26.1c0 .3.3.5.3 1.1 0 .3-.3.5-.3 1.1-.3.3-.3.5-.5.8-.3.3-.5.5-1.1.5-.3.3-.5.3-1.1.3-.3 0-.5 0-1.1-.3-.3 0-.5-.3-.8-.5-.3-.3-.5-.5-.5-.8-.3-.5-.3-.8-.3-1.1 0-.5 0-.8.3-1.1 0-.5.3-.8.5-.8.3-.3.5-.5.8-.5.5-.3.8-.3 1.1-.3.5 0 .8 0 1.1.3.5.3.8.3.8.5.5.3.5.5.5.8zm-2.2 1.4c.5 0 .5-.3.8-.3.3-.3.3-.5.3-.5 0-.3 0-.5-.3-.5-.3 0-.5-.3-.8-.3-.3 0-.5 0-.8.3 0 0-.3.3-.3.5 0 .3.3.5.3.5.3-.2.5-.2.8-.2zm-4.4-2.1c0-.8-.3-1.6-.8-2.1-.8-.5-1.6-.8-2.7-.8-.8 0-1.6 0-2.4.8-.8.5-1.1 1.3-1.1 2.4 0 .8.3 1.6.8 2.1.8.5 1.6.8 2.7.8.8 0 1.6-.3 2.4-.8.8-.5 1.1-1.4 1.1-2.4zm-3.5-1.1c-.3 0-.5.3-.8.3-.3 0-.3.5-.3.8 0 .3 0 .5.3.8.3.3.5.3.8.3.3 0 .5-.3.8-.3.3-.3.3-.5.3-.8 0-.3 0-.5-.3-.8-.3-.2-.5-.3-.8-.3zm9 0c-.3 0-.5.3-.8.3-.3 0-.3.5-.3.8 0 .3 0 .5.3.8.3.3.5.3.8.3.3 0 .5-.3.8-.3.3-.3.3-.5.3-.8 0-.3 0-.5-.3-.8-.3-.2-.5-.3-.8-.3zm2.6 7.6h-11.7c-3.5 0-5.9-2.4-5.9-5.9V5.9c0-3.2 2.4-5.9 5.9-5.9h11.7c3.2 0 5.9 2.7 5.9 5.9v270.2c0 3.5-2.7 5.9-5.9 5.9zM4.2 497.1h469.9V6H5.9L4.2 497.1zm12.4-490.7h450.7v478.3h-450.7V6.2zM156.5 427.9h-11.3c-3.5 0-5.9-2.4-5.9-5.9V151.7c0-3.2 2.4-5.9 5.9-5.9h11.3c3.2 0 5.9 2.7 5.9 5.9v270.2c0 3.5-2.7 5.9-5.9 6zM133.5 427.9h-11.3c-3.5 0-5.9-2.4-5.9-5.9V151.7c0-3.2 2.4-5.9 5.9-5.9h11.3c3.2 0 5.9 2.7 5.9 5.9v270.2c0 3.5-2.7 5.9-5.9 6zM44.4 410.3c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.8 0 11.2 5.2 11.2 11.7zm-.8-140.1H31.3v46.3h12.4v-46.3zm66.6 140.1c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.8 0 11.2 5.2 11.2 11.7zm0-140.1h-12.4v46.3h12.4v-46.3zm203.1 140.1c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.6 0 11.2 5.2 11.2 11.7zm0-140.1h-12.4v46.3h12.4v-46.3zm22.9 109.3c0 5.5-4.4 9.8-9.8 9.8-5.5 0-9.8-4.4-9.8-9.8 0-5.5 4.4-9.8 9.8-9.8 5.5-.1 9.8 4.3 9.8 9.8zm0-68.9c0 5.5-4.4 9.8-9.8 9.8-5.5 0-9.8-4.4-9.8-9.8 0-5.5 4.4-9.8 9.8-9.8 5.5 0 9.8 4.3 9.8 9.8zm-53.2 68.9c0 5.5-4.4 9.8-9.8 9.8-5.5 0-9.8-4.4-9.8-9.8 0-5.5 4.4-9.8 9.8-9.8 5.4-.1 9.8 4.3 9.8 9.8zm0-68.9c0 5.5-4.4 9.8-9.8 9.8-5.5 0-9.8-4.4-9.8-9.8 0-5.5 4.4-9.8 9.8-9.8 5.4 0 9.8 4.3 9.8 9.8zm-32.1 5.7V215c0-5.2-3.5-9-8.7-9h-10.1c-5.2 0-8.7 3.8-8.7 9v37.7c-18.9 4.4-28.6 20.5-28.6 39.7 0 18.9 9.8 35 28.6 39.7v38c0 5.2 3.5 9 8.7 9h10.1c5.2 0 8.7-3.8 8.7-9v-38c18.9-4.7 28.6-20.5 28.6-39.7-.1-19.1-9.8-35.4-28.6-39.7zm-9.5 59.9c-10.4 0-18.9-8.4-18.9-18.9 0-10.4 8.4-18.9 18.9-18.9 10.4 0 18.9 8.4 18.9 18.9 0 10.4-8.5 18.9-18.9 18.9zm-147.9-5.7c0 5.5-4.4 9.8-9.8 9.8-5.5 0-9.8-4.4-9.8-9.8 0-5.5 4.4-9.8 9.8-9.8 5.4-.1 9.8 4.3 9.8 9.8zm0-68.9c0 5.5-4.4 9.8-9.8 9.8-5.5 0-9.8-4.4-9.8-9.8 0-5.5 4.4-9.8 9.8-9.8 5.4 0 9.8 4.3 9.8 9.8zm-53.2 68.9c0 5.5-4.4 9.8-9.8 9.8-5.5 0-9.8-4.4-9.8-9.8 0-5.5 4.4-9.8 9.8-9.8 5.5-.1 9.8 4.3 9.8 9.8zm0-68.9c0 5.5-4.4 9.8-9.8 9.8-5.5 0-9.8-4.4-9.8-9.8 0-5.5 4.4-9.8 9.8-9.8 5.5 0 9.8 4.3 9.8 9.8zM53.7 344.2c-18.9-4.7-28.6-20.8-28.6-39.7 0-19.1 9.8-35.3 28.6-39.7V227c0-5.2 3.5-9 8.7-9h10.1c5.2 0 8.7 3.8 8.7 9v37.7c18.9 4.4 28.6 20.5 28.6 39.7 0 18.9-9.8 35-28.6 39.7v38c0 5.2-3.5 9-8.7 9H62.4c-5.2 0-8.7-3.8-8.7-9v-38zm9.5-59.9c10.4 0 18.9 8.4 18.9 18.9 0 10.4-8.4 18.9-18.9 18.9-10.4 0-18.9-8.4-18.9-18.9 0-10.4 8.4-18.9 18.9-18.9z" />
                                  </svg>
                                  MasterCard ****{payment.card_last_four}
                                </>
                              )}
                              {payment.payment_method === 'amex' && (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500 mr-2" viewBox="0 0 576 512" fill="currentColor">
                                    <path d="M325.1 167.8c0-16.4-14.1-18.4-27.4-18.4l-39.1-.3v69.3H275v-25.1h18c18.4 0 14.5 10.3 14.8 25.1h16.6v-13.5c0-9.2-1.5-15.1-11-18.4 7.4-3 11.8-10.7 11.7-18.7zm-29.4 11.3H275v-15.3h21c5.1 0 10.7 1 10.7 7.4 0 6.6-5.3 7.9-11 7.9zM279 268.6h-52.7l-21 22.8-20.5-22.8h-66.5l-.1 69.3h65.4l21.3-23 20.4 23h32.2l.1-23.3c18.9 0 49.3 4.6 49.3-23.3 0-17.3-12.3-22.7-27.9-22.7zm-103.8 54.7h-40.6v-13.8h36.3v-14.1h-36.3v-12.5h41.7l17.9 20.2zm65.8 8.2l-25.3-28.1L241 276zm37.8-31h-21.2v-17.6h21.5c5.6 0 10.2 2.3 10.2 8.4 0 6.4-4.6 9.2-10.5 9.2zm-31.6-136.7v-14.6h-55.5v69.3h55.5v-14.3h-38.9v-13.8h37.8v-14.1h-37.8v-12.5zM576 255.4h-.2zm-194.6 31.9c0-16.4-14.1-18.7-27.1-18.7h-39.4l-.1 69.3h16.6l.1-25.3h17.6c11 0 14.8 2 14.8 13.8l-.1 11.5h16.6l.1-13.8c0-8.9-1.8-15.1-11-18.4 7.7-3.1 11.8-10.8 11.9-18.4zm-29.2 11.2h-20.7v-15.6h21c5.1 0 10.7 1 10.7 7.7 0 6.4-5.3 7.9-11 7.9zm-172.8-80v-69.3h-27.6l-19.7 47-21.7-47H83.3v65.7l-28.1-65.7H30.7L1 187.7h17.9l6.4 15.3h31.1l6.1-15.3h17.9l-22.2 55.1c-1 2.5-1.8 5.3-1.8 8.5 0 8.4 6.4 14.3 14.8 14.3 8.1 0 15.1-5.6 15.1-13.8 0-2.8-.8-5.6-2-8.1zm-73.6-11.2l9.2-22.3 9.2 22.3zm287 30.1h-16.6L340.2 255l6.1 6.4h-27.6v-47.5h-16.6v69.3h16.6v-10.2l6.4-6.4 14 16.6h26.2zM151.4 218.5h16.6v-14.3h-16.6v-20.2h-16.6v20.2h-15.3v14.3h15.3v21.2c0 14 7.4 20.7 21.5 20.7 4.6 0 9.2-1.3 14-2.8v-14.1c-3.1.8-6.4 1.5-9.2 1.5-6.4 0-9.9-3.3-9.9-9.5v-17zm71.9-14.3H206v69.3h16.6V239h13.8l13.5 34.2h17.9l-16.1-37.5c8.7-4.3 13.5-11.2 13.5-20.7 0-14.8-10.2-22.8-26.9-22.8zm2.8 30.1h-20.7v-15.9h21c5.6 0 10.2 2.3 10.2 8.2 0 6.1-4.9 7.7-10.5 7.7zM93.7 176.4c-2.9-5.6-8.4-9-14.6-9-9.9 0-17.7 8-17.9 17.8-.1 9.7 7.6 17.8 17.4 17.9 7 .1 13.4-4.5 16-11h-15.7v-15.7h37.5v39.5h-12.5l-2.8-7c-3.5 6.1-11 9.8-18.5 9.8-21.4-.4-34.2-18.3-33.7-39.8.4-21.4 18.3-34.2 39.8-33.7 14.2.3 25.7 8.3 30.9 21.3zm262.3 85h-39.2V237h36.3v-14.1h-36.3V210h38.9v-14.3h-55.5v69.3h55.8zm-72 0h-16.6l-.1-55h-16.6v69.3h33.3zm-114.2-55h-16.6v69.3h16.6zm-73.6 55.8h-27.6l-19.7-47-21.7 47H39.7V193H23.1l-21.2 55.5c-1 2.5-1.8 5.3-1.8 8.5 0 8.4 6.4 14.3 14.8 14.3 8.1 0 15.1-5.6 15.1-13.8 0-2.8-.8-5.6-2-8.1l9.9-24.7 19.7 47h7.4l19.7-47 9.9 24.6-2 8.1c0 8.2 7.1 13.8 15.3 13.8 8.4 0 14.8-5.8 14.8-14.3 0-3.3-.8-6.1-1.8-8.5l-21-55.2h-16.6v55.5zm298-11.3c0-16.4-14.1-18.7-27.1-18.7h-39.4l-.1 69.3h16.6l.1-25.3h17.6c11 0 14.8 2 14.8 13.8l-.1 11.5h16.6l.1-13.8c0-8.9-1.8-15.1-11-18.4 7.7-3.1 11.9-10.9 11.9-18.4zm-29.2 11.2h-20.7v-15.6h21c5.1 0 10.7 1 10.7 7.7-.1 6.4-5.3 7.9-11 7.9z" />
                                  </svg>
                                  Amex ****{payment.card_last_four}
                                </>
                              )}
                              {payment.payment_method === 'bank_transfer' && (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="8" width="18" height="12" rx="2" ry="2"></rect>
                                    <line x1="7" y1="16" x2="7" y2="16"></line>
                                    <line x1="12" y1="16" x2="12" y2="16"></line>
                                    <line x1="17" y1="16" x2="17" y2="16"></line>
                                    <path d="M3 8l2-4h14l2 4"></path>
                                  </svg>
                                  Bank Transfer
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {renderPaymentStatusBadge(payment.status)}
                          </td>
                          <td className="px-4 py-3">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openBookingDetail(payment.booking)}
                              className="hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center">
                          No payments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
            onPaymentClick={() => {
              setBookingDetailOpen(false);
              setPaymentModalOpen(true);
            }}
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

export default Dashboard;
