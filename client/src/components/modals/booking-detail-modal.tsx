import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import { BookingWithDetails } from '@shared/schema';
import { X, Edit, Printer, User, Mail, Phone, Calendar, Bed, Users, CreditCard } from 'lucide-react';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaUniversity } from 'react-icons/fa';

interface BookingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingWithDetails;
  onPaymentClick?: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ 
  open, 
  onOpenChange, 
  booking,
  onPaymentClick 
}) => {
  const { t } = useLanguage();

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Determine if booking is unpaid
  const isUnpaid = !booking.payment || booking.payment.status === 'unpaid' || booking.payment.status === 'failed';

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

  // Render payment method icon
  const renderPaymentMethodIcon = (method: string | undefined) => {
    if (!method) return null;
    
    switch (method) {
      case 'visa':
        return <FaCcVisa className="text-blue-800 text-2xl mr-2" />;
      case 'mastercard':
        return <FaCcMastercard className="text-red-600 text-2xl mr-2" />;
      case 'amex':
        return <FaCcAmex className="text-blue-500 text-2xl mr-2" />;
      case 'bank_transfer':
        return <FaUniversity className="text-gray-700 text-2xl mr-2" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogTitle>{t('booking.details')}</DialogTitle>
        <DialogDescription>{t('booking.detailsDescription')}</DialogDescription>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex justify-between items-center">
            {t('booking.details')}
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
          <DialogDescription>
            {t('booking.detailsDescription') || 'Complete booking details and information'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-slate-500 text-sm mb-1">{t('booking.id')}</p>
              <p className="font-semibold text-secondary">{booking.booking_number}</p>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <User className="text-slate-400 h-4 w-4" />
              <div>
                <p className="text-slate-500 text-sm mb-1">{t('booking.guest')}</p>
                <p className="font-semibold text-secondary">{booking.guest.name}</p>
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <Mail className="text-slate-400 h-4 w-4" />
              <div>
                <p className="text-slate-500 text-sm mb-1">{t('booking.email')}</p>
                <p className="text-secondary">{booking.guest.email}</p>
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <Phone className="text-slate-400 h-4 w-4" />
              <div>
                <p className="text-slate-500 text-sm mb-1">{t('booking.phone')}</p>
                <p className="text-secondary">{booking.guest.phone}</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="text-slate-400 h-4 w-4" />
              <div>
                <p className="text-slate-500 text-sm mb-1">{t('booking.checkIn')}</p>
                <p className="text-secondary">{formatDate(booking.check_in_date)}</p>
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="text-slate-400 h-4 w-4" />
              <div>
                <p className="text-slate-500 text-sm mb-1">{t('booking.checkOut')}</p>
                <p className="text-secondary">{formatDate(booking.check_out_date)}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-slate-500 text-sm mb-1">{t('booking.status')}</p>
              <div>{renderStatusBadge(booking.status)}</div>
            </div>
            <div className="mb-4">
              <p className="text-slate-500 text-sm mb-1">{t('booking.paymentStatus')}</p>
              <div>
                {booking.payment ? 
                  renderPaymentStatusBadge(booking.payment.status) : 
                  renderPaymentStatusBadge('unpaid')
                }
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-4 mb-6">
          <h4 className="font-medium text-secondary mb-3">{t('booking.roomDetails')}</h4>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-2">
                <Bed className="text-slate-400 h-4 w-4" />
                <div>
                  <p className="text-slate-500 text-sm mb-1">{t('booking.roomType')}</p>
                  <p className="text-secondary">{booking.room.category.name}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-slate-500 text-sm mb-1">{t('booking.roomNumber')}</p>
                <p className="text-secondary">{booking.room.room_number}</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-2">
                <Users className="text-slate-400 h-4 w-4" />
                <div>
                  <p className="text-slate-500 text-sm mb-1">{t('booking.capacity')}</p>
                  <p className="text-secondary">{booking.room.category.capacity} People</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-slate-500 text-sm mb-1">{t('booking.extras')}</p>
                <p className="text-secondary">
                  {booking.special_requests || "No extras requested"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-4 mb-6">
          <h4 className="font-medium text-secondary mb-3">{t('payment.information')}</h4>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <p className="text-slate-500 text-sm mb-1">{t('payment.totalAmount')}</p>
                <p className="text-xl font-semibold text-secondary">${booking.total_price}</p>
              </div>
              {booking.payment && booking.payment.payment_method && (
                <div className="mb-4">
                  <p className="text-slate-500 text-sm mb-1">{t('payment.paymentMethod')}</p>
                  <div className="flex items-center">
                    {renderPaymentMethodIcon(booking.payment.payment_method)}
                    <p className="text-secondary">
                      {booking.payment.payment_method.charAt(0).toUpperCase() + booking.payment.payment_method.slice(1)}
                      {booking.payment.card_last_four && ` ****${booking.payment.card_last_four}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              {booking.payment && booking.payment.transaction_id && (
                <div className="mb-4">
                  <p className="text-slate-500 text-sm mb-1">{t('payment.transactionId')}</p>
                  <p className="text-secondary">{booking.payment.transaction_id}</p>
                </div>
              )}
              {booking.payment && booking.payment.payment_date && (
                <div className="mb-4">
                  <p className="text-slate-500 text-sm mb-1">{t('payment.date')}</p>
                  <p className="text-secondary">{formatDate(booking.payment.payment_date)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between border-t border-slate-200 pt-4">
          <div>
            {booking.status !== 'cancelled' && (
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600">
                <X className="mr-2 h-4 w-4" />
                {t('booking.cancelBooking')}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {isUnpaid && onPaymentClick && (
              <Button 
                variant="default"
                onClick={onPaymentClick}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {t('payment.processPayment')}
              </Button>
            )}
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              {t('common.edit')}
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              {t('common.print')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
