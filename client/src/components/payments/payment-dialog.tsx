import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Booking } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  onSuccess?: () => void;
}

export function PaymentDialog({ open, onOpenChange, booking, onSuccess }: PaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create payment transaction
      const res = await apiRequest('POST', '/api/payments/create', {
        booking,
        user: {
          username: 'Guest User', // Will be replaced with actual user data
          email: 'guest@example.com'
        }
      });

      const { token } = await res.json();

      // Load the Midtrans Snap library
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);

      script.onload = () => {
        // @ts-ignore - Midtrans types are not available
        window.snap.pay(token, {
          onSuccess: () => {
            toast({
              title: "Payment Successful",
              description: "Your booking has been confirmed."
            });
            onSuccess?.();
            onOpenChange(false);
          },
          onPending: () => {
            toast({
              title: "Payment Pending",
              description: "Please complete your payment."
            });
          },
          onError: () => {
            toast({
              title: "Payment Failed",
              description: "There was an error processing your payment.",
              variant: "destructive"
            });
          },
          onClose: () => {
            onOpenChange(false);
          }
        });
      };

      document.head.appendChild(script);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Booking Details</p>
              <div className="text-sm text-muted-foreground">
                <p>Guest: {booking.guestName}</p>
                <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium">Payment Amount</p>
              <p className="text-2xl font-bold">${booking.total}</p>
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}