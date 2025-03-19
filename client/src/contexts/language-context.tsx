import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'id';

// Translation interface
interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

// Define translations
const translations: Translations = {
  // Common UI elements
  'nav.home': {
    en: 'Home',
    id: 'Beranda'
  },
  'nav.rooms': {
    en: 'Rooms',
    id: 'Kamar'
  },
  'nav.bookings': {
    en: 'Bookings',
    id: 'Pemesanan'
  },
  'nav.guests': {
    en: 'Guests',
    id: 'Tamu'
  },
  'nav.payments': {
    en: 'Payments',
    id: 'Pembayaran'
  },
  'nav.settings': {
    en: 'Settings',
    id: 'Pengaturan'
  },
  'nav.contact': {
    en: 'Contact',
    id: 'Kontak'
  },
  'common.dashboard': {
    en: 'Dashboard',
    id: 'Dasbor'
  },
  'common.admin': {
    en: 'Admin Panel',
    id: 'Panel Admin'
  },
  'common.totalBookings': {
    en: 'Total Bookings',
    id: 'Total Pemesanan'
  },
  'common.revenue': {
    en: 'Revenue',
    id: 'Pendapatan'
  },
  'common.roomOccupancy': {
    en: 'Room Occupancy',
    id: 'Okupansi Kamar'
  },
  'common.pendingPayments': {
    en: 'Pending Payments',
    id: 'Pembayaran Tertunda'
  },
  'common.viewAll': {
    en: 'View All',
    id: 'Lihat Semua'
  },
  'common.addNew': {
    en: 'Add New',
    id: 'Tambah Baru'
  },
  'common.save': {
    en: 'Save',
    id: 'Simpan'
  },
  'common.cancel': {
    en: 'Cancel',
    id: 'Batal'
  },
  'common.edit': {
    en: 'Edit',
    id: 'Edit'
  },
  'common.delete': {
    en: 'Delete',
    id: 'Hapus'
  },
  'common.view': {
    en: 'View',
    id: 'Lihat'
  },
  'common.print': {
    en: 'Print',
    id: 'Cetak'
  },
  'common.details': {
    en: 'Details',
    id: 'Rincian'
  },
  'common.status': {
    en: 'Status',
    id: 'Status'
  },
  'common.action': {
    en: 'Action',
    id: 'Tindakan'
  },
  'common.from': {
    en: 'from',
    id: 'dari'
  },
  
  // Room related
  'room.management': {
    en: 'Room Management',
    id: 'Manajemen Kamar'
  },
  'room.addNew': {
    en: 'Add New Room',
    id: 'Tambah Kamar Baru'
  },
  'room.name': {
    en: 'Room Name',
    id: 'Nama Kamar'
  },
  'room.number': {
    en: 'Room Number',
    id: 'Nomor Kamar'
  },
  'room.type': {
    en: 'Room Type',
    id: 'Tipe Kamar'
  },
  'room.price': {
    en: 'Price Per Night',
    id: 'Harga Per Malam'
  },
  'room.capacity': {
    en: 'Capacity',
    id: 'Kapasitas'
  },
  'room.floor': {
    en: 'Floor',
    id: 'Lantai'
  },
  'room.status': {
    en: 'Status',
    id: 'Status'
  },
  'room.features': {
    en: 'Features',
    id: 'Fitur'
  },
  'room.description': {
    en: 'Description',
    id: 'Deskripsi'
  },
  'room.wifi': {
    en: 'Wi-Fi',
    id: 'Wi-Fi'
  },
  'room.ac': {
    en: 'Air Conditioning',
    id: 'AC'
  },
  'room.minibar': {
    en: 'Mini Bar',
    id: 'Mini Bar'
  },
  'room.roomService': {
    en: 'Room Service',
    id: 'Layanan Kamar'
  },
  'room.tv': {
    en: 'TV',
    id: 'TV'
  },
  'room.balcony': {
    en: 'Balcony',
    id: 'Balkon'
  },
  
  // Booking related
  'booking.details': {
    en: 'Booking Details',
    id: 'Rincian Pemesanan'
  },
  'booking.id': {
    en: 'Booking ID',
    id: 'ID Pemesanan'
  },
  'booking.guest': {
    en: 'Guest',
    id: 'Tamu'
  },
  'booking.checkIn': {
    en: 'Check In',
    id: 'Check In'
  },
  'booking.checkOut': {
    en: 'Check Out',
    id: 'Check Out'
  },
  'booking.status': {
    en: 'Status',
    id: 'Status'
  },
  'booking.confirmed': {
    en: 'Confirmed',
    id: 'Dikonfirmasi'
  },
  'booking.pending': {
    en: 'Pending',
    id: 'Tertunda'
  },
  'booking.cancelled': {
    en: 'Cancelled',
    id: 'Dibatalkan'
  },
  'booking.new': {
    en: 'New',
    id: 'Baru'
  },
  'booking.checkedIn': {
    en: 'Checked In',
    id: 'Sudah Check In'
  },
  'booking.checkedOut': {
    en: 'Checked Out',
    id: 'Sudah Check Out'
  },
  'booking.email': {
    en: 'Email',
    id: 'Email'
  },
  'booking.phone': {
    en: 'Phone',
    id: 'Telepon'
  },
  'booking.paymentStatus': {
    en: 'Payment Status',
    id: 'Status Pembayaran'
  },
  'booking.roomDetails': {
    en: 'Room Details',
    id: 'Rincian Kamar'
  },
  'booking.roomType': {
    en: 'Room Type',
    id: 'Tipe Kamar'
  },
  'booking.roomNumber': {
    en: 'Room Number',
    id: 'Nomor Kamar'
  },
  'booking.capacity': {
    en: 'Capacity',
    id: 'Kapasitas'
  },
  'booking.extras': {
    en: 'Extras',
    id: 'Tambahan'
  },
  'booking.cancelBooking': {
    en: 'Cancel Booking',
    id: 'Batalkan Pemesanan'
  },
  
  // Payment related
  'payment.processPayment': {
    en: 'Process Payment',
    id: 'Proses Pembayaran'
  },
  'payment.totalAmount': {
    en: 'Total Amount',
    id: 'Jumlah Total'
  },
  'payment.paymentMethod': {
    en: 'Payment Method',
    id: 'Metode Pembayaran'
  },
  'payment.cardNumber': {
    en: 'Card Number',
    id: 'Nomor Kartu'
  },
  'payment.expiryDate': {
    en: 'Expiry Date',
    id: 'Tanggal Kadaluarsa'
  },
  'payment.cvv': {
    en: 'CVV',
    id: 'CVV'
  },
  'payment.cardholderName': {
    en: 'Cardholder Name',
    id: 'Nama Pemegang Kartu'
  },
  'payment.secureTransaction': {
    en: 'This transaction is secured with 3D Secure 2.0',
    id: 'Transaksi ini diamankan dengan 3D Secure 2.0'
  },
  'payment.secure': {
    en: 'Your payment information is secure',
    id: 'Informasi pembayaran Anda aman'
  },
  'payment.paid': {
    en: 'Paid',
    id: 'Dibayar'
  },
  'payment.unpaid': {
    en: 'Unpaid',
    id: 'Belum Dibayar'
  },
  'payment.processing': {
    en: 'Processing',
    id: 'Sedang Diproses'
  },
  'payment.failed': {
    en: 'Failed',
    id: 'Gagal'
  },
  'payment.information': {
    en: 'Payment Information',
    id: 'Informasi Pembayaran'
  },
  'payment.date': {
    en: 'Payment Date',
    id: 'Tanggal Pembayaran'
  },
  'payment.transactionId': {
    en: 'Transaction ID',
    id: 'ID Transaksi'
  },
  
  // Footer
  'footer.quickLinks': {
    en: 'Quick Links',
    id: 'Tautan Cepat'
  },
  'footer.support': {
    en: 'Support',
    id: 'Dukungan'
  },
  'footer.contact': {
    en: 'Contact',
    id: 'Kontak'
  },
  'footer.helpCenter': {
    en: 'Help Center',
    id: 'Pusat Bantuan'
  },
  'footer.documentation': {
    en: 'Documentation',
    id: 'Dokumentasi'
  },
  'footer.api': {
    en: 'API',
    id: 'API'
  },
  'footer.contactUs': {
    en: 'Contact Us',
    id: 'Hubungi Kami'
  },
  'footer.allRightsReserved': {
    en: 'All rights reserved.',
    id: 'Hak cipta dilindungi.'
  },
  'footer.privacyPolicy': {
    en: 'Privacy Policy',
    id: 'Kebijakan Privasi'
  },
  'footer.termsOfService': {
    en: 'Terms of Service',
    id: 'Ketentuan Layanan'
  }
};

// Create context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Try to get saved language from localStorage
  const getSavedLanguage = (): Language => {
    try {
      const savedLanguage = localStorage.getItem('language');
      return (savedLanguage === 'id' ? 'id' : 'en') as Language;
    } catch (error) {
      return 'en';
    }
  };

  const [language, setLanguageState] = useState<Language>(getSavedLanguage());

  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      console.error('Could not save language preference:', error);
    }
  };

  // Translation function
  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || key;
  };

  // Set document language attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
