import { apiRequest } from '@/lib/queryClient';

// Define the Xendit client interface for frontend integration
export interface XenditCheckoutOptions {
  amount: number;
  bookingId: number;
  paymentMethod: 'visa' | 'mastercard' | 'amex' | 'bank_transfer';
  cardNumber: string;
  cardExpiry: string; // MM/YY format
  cardCvv: string;
  cardholderName: string;
}

export interface XenditPaymentResult {
  success: boolean;
  payment?: any;
  message: string;
  error?: any;
}

export class XenditClient {
  // Process a credit card payment
  async processCardPayment(options: XenditCheckoutOptions): Promise<XenditPaymentResult> {
    try {
      const response = await apiRequest('POST', '/api/payments/process', {
        booking_id: options.bookingId,
        amount: options.amount.toString(),
        payment_method: options.paymentMethod,
        card_number: options.cardNumber.replace(/\s+/g, ''),
        card_expiry: options.cardExpiry,
        card_cvv: options.cardCvv,
        cardholder_name: options.cardholderName
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while processing payment'
      };
    }
  }
  
  // Utility method to format credit card number with spaces
  formatCardNumber(value: string): string {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  }
  
  // Utility method to format expiry date with slash
  formatExpiryDate(value: string): string {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  }
  
  // Get card icon based on card number
  getCardType(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'unknown' {
    const number = cardNumber.replace(/\s+/g, '');
    
    // Visa: Starts with 4
    if (/^4/.test(number)) return 'visa';
    
    // Mastercard: Starts with 5 (and 51-55)
    if (/^5[1-5]/.test(number)) return 'mastercard';
    
    // Amex: Starts with 34 or 37
    if (/^3[47]/.test(number)) return 'amex';
    
    return 'unknown';
  }
}

// Create a singleton instance of the XenditClient
export const xenditClient = new XenditClient();
