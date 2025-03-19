// Simple i18n implementation for the server-side
// This provides translations for server responses

export type Language = "en" | "id";

export interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

// Define translations
const translations: Translations = {
  // Success messages
  "success.room.created": {
    en: "Room has been created successfully",
    id: "Kamar telah berhasil dibuat"
  },
  "success.room.updated": {
    en: "Room has been updated successfully",
    id: "Kamar telah berhasil diperbarui"
  },
  "success.room.deleted": {
    en: "Room has been deleted successfully",
    id: "Kamar telah berhasil dihapus"
  },
  "success.booking.created": {
    en: "Booking has been created successfully",
    id: "Pemesanan telah berhasil dibuat"
  },
  "success.booking.updated": {
    en: "Booking has been updated successfully",
    id: "Pemesanan telah berhasil diperbarui"
  },
  "success.booking.deleted": {
    en: "Booking has been deleted successfully",
    id: "Pemesanan telah berhasil dihapus"
  },
  "success.payment.created": {
    en: "Payment has been processed successfully",
    id: "Pembayaran telah berhasil diproses"
  },
  "success.payment.updated": {
    en: "Payment has been updated successfully",
    id: "Pembayaran telah berhasil diperbarui"
  },
  
  // Error messages
  "error.room.notFound": {
    en: "Room not found",
    id: "Kamar tidak ditemukan"
  },
  "error.booking.notFound": {
    en: "Booking not found",
    id: "Pemesanan tidak ditemukan"
  },
  "error.payment.notFound": {
    en: "Payment not found",
    id: "Pembayaran tidak ditemukan"
  },
  "error.payment.failed": {
    en: "Payment processing failed",
    id: "Pemrosesan pembayaran gagal"
  },
  "error.validation.required": {
    en: "Required fields are missing",
    id: "Kolom yang wajib diisi tidak lengkap"
  },
  "error.room.alreadyBooked": {
    en: "This room is already booked for the selected dates",
    id: "Kamar ini sudah dipesan untuk tanggal yang dipilih"
  },
  "error.dates.invalid": {
    en: "Invalid check-in or check-out dates",
    id: "Tanggal check-in atau check-out tidak valid"
  },
  
  // Generic messages
  "generic.notFound": {
    en: "Resource not found",
    id: "Sumber daya tidak ditemukan"
  },
  "generic.serverError": {
    en: "An unexpected error occurred",
    id: "Terjadi kesalahan yang tidak diharapkan"
  },
  "generic.unauthorized": {
    en: "Unauthorized access",
    id: "Akses tidak diizinkan"
  }
};

export class I18nService {
  private defaultLanguage: Language = "en";
  
  // Get translation for a key in the specified language
  translate(key: string, language: Language = this.defaultLanguage): string {
    const translation = translations[key];
    if (!translation) {
      return key; // Return the key itself if no translation found
    }
    
    return translation[language] || translation[this.defaultLanguage];
  }
  
  // Set the default language
  setDefaultLanguage(language: Language): void {
    this.defaultLanguage = language;
  }
  
  // Get the default language
  getDefaultLanguage(): Language {
    return this.defaultLanguage;
  }
}

// Create a singleton instance of the i18n service
export const i18nService = new I18nService();
