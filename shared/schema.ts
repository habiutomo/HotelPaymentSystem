import { pgTable, text, serial, integer, boolean, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums for various statuses
export const roomStatusEnum = pgEnum('room_status', ['available', 'occupied', 'maintenance', 'reserved']);
export const bookingStatusEnum = pgEnum('booking_status', ['new', 'confirmed', 'checked_in', 'checked_out', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['unpaid', 'processing', 'paid', 'failed']);
export const paymentMethodEnum = pgEnum('payment_method', ['visa', 'mastercard', 'amex', 'bank_transfer']);

// Users (admin users for the system)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Room Categories
export const roomCategories = pgTable("room_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  base_price: numeric("base_price").notNull(),
  capacity: integer("capacity").notNull(),
});

// Rooms
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  room_number: text("room_number").notNull().unique(),
  category_id: integer("category_id").notNull(),
  status: roomStatusEnum("status").notNull().default("available"),
  floor: integer("floor").notNull(),
  has_wifi: boolean("has_wifi").default(true),
  has_ac: boolean("has_ac").default(true),
  has_minibar: boolean("has_minibar").default(false),
  has_room_service: boolean("has_room_service").default(false),
  has_tv: boolean("has_tv").default(true),
  has_balcony: boolean("has_balcony").default(false),
  notes: text("notes"),
});

// Guests
export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  id_type: text("id_type"), // Passport, National ID, etc.
  id_number: text("id_number"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  booking_number: text("booking_number").notNull().unique(),
  guest_id: integer("guest_id").notNull(),
  room_id: integer("room_id").notNull(),
  status: bookingStatusEnum("status").notNull().default("new"),
  check_in_date: timestamp("check_in_date").notNull(),
  check_out_date: timestamp("check_out_date").notNull(),
  adults: integer("adults").notNull().default(1),
  children: integer("children").notNull().default(0),
  total_price: numeric("total_price").notNull(),
  special_requests: text("special_requests"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  booking_id: integer("booking_id").notNull(),
  transaction_id: text("transaction_id").unique(),
  xendit_invoice_id: text("xendit_invoice_id").unique(),
  amount: numeric("amount").notNull(),
  payment_method: paymentMethodEnum("payment_method"),
  status: paymentStatusEnum("status").notNull().default("unpaid"),
  card_last_four: text("card_last_four"),
  payment_date: timestamp("payment_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Create Insert Schemas with Zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true, created_at: true });
export const insertRoomCategorySchema = createInsertSchema(roomCategories).omit({ id: true });
export const insertRoomSchema = createInsertSchema(rooms).omit({ id: true });
export const insertGuestSchema = createInsertSchema(guests).omit({ id: true, created_at: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});
export const insertPaymentSchema = createInsertSchema(payments).omit({ 
  id: true, 
  payment_date: true, 
  created_at: true, 
  updated_at: true 
});

// Create types for inserts
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRoomCategory = z.infer<typeof insertRoomCategorySchema>;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

// Create types for selects
export type User = typeof users.$inferSelect;
export type RoomCategory = typeof roomCategories.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Guest = typeof guests.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Payment = typeof payments.$inferSelect;

// Extended schemas for validation
export const bookingFormSchema = insertBookingSchema.extend({
  guest_name: z.string().min(1, "Guest name is required"),
  guest_email: z.string().email("Valid email is required"),
  guest_phone: z.string().min(1, "Phone number is required"),
});

export const paymentFormSchema = insertPaymentSchema.extend({
  card_number: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  card_expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry date must be in MM/YY format"),
  card_cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  cardholder_name: z.string().min(1, "Cardholder name is required"),
});

// Create types for extended schemas
export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type PaymentFormData = z.infer<typeof paymentFormSchema>;

// Custom types for frontend
export type RoomWithCategory = Room & {
  category: RoomCategory;
};

export type BookingWithDetails = Booking & {
  guest: Guest;
  room: RoomWithCategory;
  payment?: Payment;
};

export type PaymentWithDetails = Payment & {
  booking: BookingWithDetails;
};
