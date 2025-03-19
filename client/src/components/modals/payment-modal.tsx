import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/lib/i18n';
import { Lock, CreditCard } from 'lucide-react';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PaymentFormData, BookingWithDetails } from '@shared/schema';
import { useQueryClient, useMutation } from '@tanstack/react-query';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: BookingWithDetails;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onOpenChange, booking }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    card_number: z.string().regex(/^\d{16}$/, t('validation.cardNumber')),
    card_expiry: z.string().regex(/^\d{2}\/\d{2}$/, t('validation.cardExpiry')),
    card_cvv: z.string().regex(/^\d{3,4}$/, t('validation.cardCvv')),
    cardholder_name: z.string().min(2, t('validation.cardholderName')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      card_number: '',
      card_expiry: '',
      card_cvv: '',
      cardholder_name: '',
    },
  });

  const { mutate: processPayment } = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          booking_id: booking?.id,
          amount: booking?.total_price,
          payment_method: 'visa'
        }),
      });

      if (!response.ok) {
        throw new Error(t('error.payment.failed'));
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/payments']);
      queryClient.invalidateQueries(['/api/bookings']);
      toast({
        title: t('success.payment.title'),
        description: t('success.payment.description'),
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: t('error.payment.title'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    processPayment(data as PaymentFormData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('payment.title')}</DialogTitle>
          <DialogDescription>{t('payment.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {t('payment.amount')}: <span className="font-bold">Rp {booking?.total_price}</span>
            </div>
            <div className="flex gap-2">
              <FaCcVisa className="w-8 h-8 text-blue-700" />
              <FaCcMastercard className="w-8 h-8 text-red-600" />
              <FaCcAmex className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="card_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('payment.cardNumber')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="4111 1111 1111 1111" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="card_expiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment.expiry')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MM/YY" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="card_cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment.cvv')}</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="123" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cardholder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('payment.cardholderName')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isProcessing}
              >
                <Lock className="w-4 h-4 mr-2" />
                {isProcessing ? t('payment.processing') : t('payment.pay')}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;