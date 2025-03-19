import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import midtransClient from "midtrans-client";

if (!process.env.MIDTRANS_SERVER_KEY) {
  throw new Error('Missing required Midtrans secret: MIDTRANS_SERVER_KEY');
}

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Room routes
  app.get("/api/rooms", async (req, res) => {
    const rooms = await storage.getRooms();
    res.json(rooms);
  });

  app.post("/api/rooms", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const room = await storage.createRoom(req.body);
    res.status(201).json(room);
  });

  app.patch("/api/rooms/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const room = await storage.updateRoom(parseInt(req.params.id), req.body);
    res.json(room);
  });

  // Booking routes
  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const bookings = await storage.getBookings();
    res.json(bookings);
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const booking = await storage.createBooking(req.body);
    res.status(201).json(booking);
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const booking = await storage.updateBooking(parseInt(req.params.id), req.body);
    res.json(booking);
  });

  // Payment routes
  app.get("/api/payments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const payments = await storage.getPayments();
    res.json(payments);
  });

  app.post("/api/payments/create", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { booking, user } = req.body;

    try {
      const parameter = {
        transaction_details: {
          order_id: `BOOK-${booking.id}-${Date.now()}`,
          gross_amount: booking.total
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          first_name: user.username,
          email: user.email || 'guest@example.com'
        },
        item_details: [{
          id: `ROOM-${booking.roomId}`,
          price: booking.total,
          quantity: 1,
          name: `Room Booking #${booking.id}`
        }]
      };

      const transaction = await snap.createTransaction(parameter);

      // Create a payment record
      const payment = await storage.createPayment({
        bookingId: booking.id,
        amount: booking.total,
        status: 'pending',
        method: 'midtrans',
        createdAt: new Date()
      });

      res.json({
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        payment
      });
    } catch (error: any) {
      console.error('Midtrans Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/payments/notification", async (req, res) => {
    try {
      const notification = await snap.transaction.notification(req.body);
      const orderId = notification.order_id;
      const transactionStatus = notification.transaction_status;
      const fraudStatus = notification.fraud_status;

      const bookingId = parseInt(orderId.split('-')[1]);

      let paymentStatus;
      if (transactionStatus == 'capture') {
        if (fraudStatus == 'challenge') {
          paymentStatus = 'challenge';
        } else if (fraudStatus == 'accept') {
          paymentStatus = 'success';
        }
      } else if (transactionStatus == 'settlement') {
        paymentStatus = 'success';
      } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
        paymentStatus = 'failure';
      } else if (transactionStatus == 'pending') {
        paymentStatus = 'pending';
      }

      // Update booking payment status
      if (paymentStatus) {
        await storage.updateBooking(bookingId, {
          paymentStatus: paymentStatus === 'success' ? 'paid' : 'unpaid'
        });
      }

      res.status(200).json({ status: 'OK' });
    } catch (error: any) {
      console.error('Notification Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}