import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { xenditService } from "./xendit";
import { i18nService, type Language } from "./i18n";
import { ZodError } from "zod";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  insertRoomSchema,
  insertRoomCategorySchema,
  insertGuestSchema,
  insertBookingSchema,
  insertPaymentSchema,
  paymentFormSchema
} from "@shared/schema";

// Utility function to get language preference from request
function getLanguage(req: Request): Language {
  const lang = req.headers["accept-language"] || "en";
  return lang.includes("id") ? "id" : "en";
}

// Utility function to handle validation errors
function handleValidationError(error: ZodError, res: Response, lang: Language) {
  const validationError = fromZodError(error);
  return res.status(400).json({
    message: validationError.message,
    errors: error.errors
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API prefix for all routes
  const API_PREFIX = "/api";
  
  // Middleware to set language based on request
  app.use((req, res, next) => {
    const lang = getLanguage(req);
    req.lang = lang;
    next();
  });
  
  // === Room Categories API ===
  app.get(`${API_PREFIX}/room-categories`, async (req, res) => {
    try {
      const categories = await storage.getRoomCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.get(`${API_PREFIX}/room-categories/:id`, async (req, res) => {
    try {
      const category = await storage.getRoomCategory(Number(req.params.id));
      if (!category) {
        return res.status(404).json({ message: i18nService.translate("generic.notFound", req.lang) });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.post(`${API_PREFIX}/room-categories`, async (req, res) => {
    try {
      const categoryData = insertRoomCategorySchema.parse(req.body);
      const category = await storage.createRoomCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.put(`${API_PREFIX}/room-categories/:id`, async (req, res) => {
    try {
      const categoryData = insertRoomCategorySchema.parse(req.body);
      const category = await storage.updateRoomCategory(Number(req.params.id), categoryData);
      if (!category) {
        return res.status(404).json({ message: i18nService.translate("generic.notFound", req.lang) });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.delete(`${API_PREFIX}/room-categories/:id`, async (req, res) => {
    try {
      const success = await storage.deleteRoomCategory(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: i18nService.translate("generic.notFound", req.lang) });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  // === Rooms API ===
  app.get(`${API_PREFIX}/rooms`, async (req, res) => {
    try {
      const rooms = await storage.getRoomsWithCategory();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.get(`${API_PREFIX}/rooms/:id`, async (req, res) => {
    try {
      const room = await storage.getRoom(Number(req.params.id));
      if (!room) {
        return res.status(404).json({ message: i18nService.translate("error.room.notFound", req.lang) });
      }
      const category = await storage.getRoomCategory(room.category_id);
      res.json({ ...room, category });
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.get(`${API_PREFIX}/rooms/available`, async (req, res) => {
    try {
      const schema = z.object({
        checkIn: z.string().transform(val => new Date(val)),
        checkOut: z.string().transform(val => new Date(val)),
        categoryId: z.string().optional().transform(val => val ? Number(val) : undefined)
      });
      
      const query = schema.parse(req.query);
      
      if (query.checkIn >= query.checkOut) {
        return res.status(400).json({ message: i18nService.translate("error.dates.invalid", req.lang) });
      }
      
      const availableRooms = await storage.getAvailableRooms(
        query.checkIn,
        query.checkOut,
        query.categoryId
      );
      
      res.json(availableRooms);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.post(`${API_PREFIX}/rooms`, async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      res.status(201).json({
        ...room,
        message: i18nService.translate("success.room.created", req.lang)
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.put(`${API_PREFIX}/rooms/:id`, async (req, res) => {
    try {
      const roomData = insertRoomSchema.partial().parse(req.body);
      const room = await storage.updateRoom(Number(req.params.id), roomData);
      if (!room) {
        return res.status(404).json({ message: i18nService.translate("error.room.notFound", req.lang) });
      }
      res.json({
        ...room,
        message: i18nService.translate("success.room.updated", req.lang)
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.delete(`${API_PREFIX}/rooms/:id`, async (req, res) => {
    try {
      const success = await storage.deleteRoom(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: i18nService.translate("error.room.notFound", req.lang) });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  // === Guests API ===
  app.get(`${API_PREFIX}/guests`, async (req, res) => {
    try {
      const guests = await storage.getGuests();
      res.json(guests);
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.get(`${API_PREFIX}/guests/:id`, async (req, res) => {
    try {
      const guest = await storage.getGuest(Number(req.params.id));
      if (!guest) {
        return res.status(404).json({ message: i18nService.translate("generic.notFound", req.lang) });
      }
      res.json(guest);
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.post(`${API_PREFIX}/guests`, async (req, res) => {
    try {
      const guestData = insertGuestSchema.parse(req.body);
      
      // Check if guest with this email already exists
      const existingGuest = await storage.getGuestByEmail(guestData.email);
      if (existingGuest) {
        // Return existing guest if found
        return res.status(200).json(existingGuest);
      }
      
      // Create new guest
      const guest = await storage.createGuest(guestData);
      res.status(201).json(guest);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.put(`${API_PREFIX}/guests/:id`, async (req, res) => {
    try {
      const guestData = insertGuestSchema.partial().parse(req.body);
      const guest = await storage.updateGuest(Number(req.params.id), guestData);
      if (!guest) {
        return res.status(404).json({ message: i18nService.translate("generic.notFound", req.lang) });
      }
      res.json(guest);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  // === Bookings API ===
  app.get(`${API_PREFIX}/bookings`, async (req, res) => {
    try {
      const bookingsWithDetails = await storage.getBookingsWithDetails();
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.get(`${API_PREFIX}/bookings/:id`, async (req, res) => {
    try {
      const booking = await storage.getBookingWithDetails(Number(req.params.id));
      if (!booking) {
        return res.status(404).json({ message: i18nService.translate("error.booking.notFound", req.lang) });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.post(`${API_PREFIX}/bookings`, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check if room is available for the requested dates
      const room = await storage.getRoom(bookingData.room_id);
      if (!room) {
        return res.status(404).json({ message: i18nService.translate("error.room.notFound", req.lang) });
      }
      
      // Generate booking number
      const bookingNumber = `B${Date.now().toString().substr(-8)}`;
      
      const booking = await storage.createBooking({
        ...bookingData,
        booking_number: bookingNumber
      });
      
      res.status(201).json({
        ...booking,
        message: i18nService.translate("success.booking.created", req.lang)
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.put(`${API_PREFIX}/bookings/:id`, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.partial().parse(req.body);
      const booking = await storage.updateBooking(Number(req.params.id), bookingData);
      if (!booking) {
        return res.status(404).json({ message: i18nService.translate("error.booking.notFound", req.lang) });
      }
      res.json({
        ...booking,
        message: i18nService.translate("success.booking.updated", req.lang)
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.delete(`${API_PREFIX}/bookings/:id`, async (req, res) => {
    try {
      const success = await storage.deleteBooking(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: i18nService.translate("error.booking.notFound", req.lang) });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  // === Payments API ===
  app.get(`${API_PREFIX}/payments`, async (req, res) => {
    try {
      const paymentsWithDetails = await storage.getPaymentsWithDetails();
      res.json(paymentsWithDetails);
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  app.get(`${API_PREFIX}/payments/:id`, async (req, res) => {
    try {
      const payment = await storage.getPayment(Number(req.params.id));
      if (!payment) {
        return res.status(404).json({ message: i18nService.translate("error.payment.notFound", req.lang) });
      }
      
      const booking = await storage.getBookingWithDetails(payment.booking_id);
      res.json({ ...payment, booking });
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  // Process payment with Xendit
  app.post(`${API_PREFIX}/payments/process`, async (req, res) => {
    try {
      const paymentData = paymentFormSchema.parse(req.body);
      
      // Get booking details
      const booking = await storage.getBooking(paymentData.booking_id);
      if (!booking) {
        return res.status(404).json({ message: i18nService.translate("error.booking.notFound", req.lang) });
      }
      
      // Get guest details
      const guest = await storage.getGuest(booking.guest_id);
      if (!guest) {
        return res.status(404).json({ message: i18nService.translate("generic.notFound", req.lang) });
      }
      
      // Process payment with Xendit
      try {
        // 1. Create credit card token (this would normally be done on the frontend)
        const [month, year] = paymentData.card_expiry.split('/');
        const cardToken = await xenditService.createCreditCardToken({
          cardNumber: paymentData.card_number,
          expMonth: month,
          expYear: `20${year}`,
          cardCvn: paymentData.card_cvv
        });
        
        // 2. Create 3DS authentication
        const authentication = await xenditService.create3dsAuthentication({
          tokenId: cardToken.id,
          amount: Number(paymentData.amount)
        });
        
        // 3. Create credit card charge
        const charge = await xenditService.createCreditCardCharge({
          tokenId: cardToken.id,
          authId: authentication.id,
          externalId: `booking_${booking.id}_${Date.now()}`,
          amount: Number(paymentData.amount)
        });
        
        // 4. Capture the charge
        const captureResult = await xenditService.captureCharge(
          charge.id,
          Number(paymentData.amount)
        );
        
        // 5. Create payment record
        const payment = await storage.createPayment({
          booking_id: booking.id,
          transaction_id: charge.id,
          xendit_invoice_id: charge.id, // In a real app, these would be different
          amount: paymentData.amount,
          payment_method: paymentData.payment_method,
          status: captureResult.status === "CAPTURED" ? "paid" : "processing",
          card_last_four: paymentData.card_number.slice(-4)
        });
        
        res.json({
          success: true,
          payment,
          message: i18nService.translate("success.payment.created", req.lang)
        });
      } catch (paymentError) {
        console.error("Payment processing error:", paymentError);
        
        // Create failed payment record
        await storage.createPayment({
          booking_id: booking.id,
          transaction_id: `failed_${Date.now()}`,
          xendit_invoice_id: null,
          amount: paymentData.amount,
          payment_method: paymentData.payment_method,
          status: "failed",
          card_last_four: paymentData.card_number.slice(-4)
        });
        
        res.status(400).json({
          success: false,
          message: i18nService.translate("error.payment.failed", req.lang),
          error: paymentError
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return handleValidationError(error, res, req.lang);
      }
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  // Webhook for Xendit payment status updates
  app.post(`${API_PREFIX}/xendit/webhook`, async (req, res) => {
    try {
      const { event, data } = req.body;
      const result = await xenditService.handleWebhook(event, data);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  // === Stats API ===
  app.get(`${API_PREFIX}/stats`, async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      const rooms = await storage.getRooms();
      const payments = await storage.getPayments();
      
      // Calculate stats
      const totalBookings = bookings.length;
      
      const totalRevenue = payments
        .filter(p => p.status === "paid")
        .reduce((sum, p) => sum + Number(p.amount), 0);
      
      const occupiedRooms = rooms.filter(r => r.status === "occupied").length;
      const totalRooms = rooms.length;
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
      
      const pendingPayments = payments.filter(p => p.status === "unpaid").length;
      
      res.json({
        bookings: totalBookings,
        revenue: totalRevenue.toFixed(2),
        occupancy: `${occupancyRate}%`,
        pendingPayments
      });
    } catch (error) {
      res.status(500).json({ message: i18nService.translate("generic.serverError", req.lang) });
    }
  });
  
  return httpServer;
}
