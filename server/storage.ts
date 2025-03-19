import { 
  users, type User, type InsertUser,
  roomCategories, type RoomCategory, type InsertRoomCategory,
  rooms, type Room, type InsertRoom,
  guests, type Guest, type InsertGuest,
  bookings, type Booking, type InsertBooking,
  payments, type Payment, type InsertPayment,
  type RoomWithCategory,
  type BookingWithDetails,
  type PaymentWithDetails
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Room category operations
  getRoomCategories(): Promise<RoomCategory[]>;
  getRoomCategory(id: number): Promise<RoomCategory | undefined>;
  createRoomCategory(category: InsertRoomCategory): Promise<RoomCategory>;
  updateRoomCategory(id: number, category: Partial<RoomCategory>): Promise<RoomCategory | undefined>;
  deleteRoomCategory(id: number): Promise<boolean>;

  // Room operations
  getRooms(): Promise<Room[]>;
  getRoomsWithCategory(): Promise<RoomWithCategory[]>;
  getRoom(id: number): Promise<Room | undefined>;
  getRoomByNumber(roomNumber: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<Room>): Promise<Room | undefined>;
  deleteRoom(id: number): Promise<boolean>;
  getAvailableRooms(checkIn: Date, checkOut: Date, categoryId?: number): Promise<RoomWithCategory[]>;

  // Guest operations
  getGuests(): Promise<Guest[]>;
  getGuest(id: number): Promise<Guest | undefined>;
  getGuestByEmail(email: string): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: number, guest: Partial<Guest>): Promise<Guest | undefined>;
  deleteGuest(id: number): Promise<boolean>;

  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBookingsWithDetails(): Promise<BookingWithDetails[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingByNumber(bookingNumber: string): Promise<Booking | undefined>;
  getBookingWithDetails(id: number): Promise<BookingWithDetails | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<Booking>): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;

  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPaymentsWithDetails(): Promise<PaymentWithDetails[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentByTransactionId(transactionId: string): Promise<Payment | undefined>;
  getPaymentByXenditInvoiceId(invoiceId: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<Payment>): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private roomCategories: Map<number, RoomCategory>;
  private rooms: Map<number, Room>;
  private guests: Map<number, Guest>;
  private bookings: Map<number, Booking>;
  private payments: Map<number, Payment>;
  
  private currentUserId: number;
  private currentRoomCategoryId: number;
  private currentRoomId: number;
  private currentGuestId: number;
  private currentBookingId: number;
  private currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.roomCategories = new Map();
    this.rooms = new Map();
    this.guests = new Map();
    this.bookings = new Map();
    this.payments = new Map();
    
    this.currentUserId = 1;
    this.currentRoomCategoryId = 1;
    this.currentRoomId = 1;
    this.currentGuestId = 1;
    this.currentBookingId = 1;
    this.currentPaymentId = 1;
    
    // Initialize with default data
    this.initializeData();
  }

  private initializeData() {
    // Add default admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In production, this would be hashed
      role: "admin",
      name: "Admin User",
      email: "admin@hotelx.com"
    });

    // Add room categories
    const standardRoom = this.createRoomCategory({
      name: "Standard Room",
      description: "A comfortable room with all the basic amenities.",
      base_price: "120.00",
      capacity: 2
    });

    const deluxeRoom = this.createRoomCategory({
      name: "Deluxe Room",
      description: "Spacious room with premium amenities and city views.",
      base_price: "200.00",
      capacity: 2
    });

    const suite = this.createRoomCategory({
      name: "Suite",
      description: "Luxury suite with separate living area and premium services.",
      base_price: "350.00",
      capacity: 4
    });

    // Add rooms
    this.createRoom({
      room_number: "101",
      category_id: standardRoom.id,
      status: "available",
      floor: 1,
      has_wifi: true,
      has_ac: true,
      has_minibar: false,
      has_room_service: true,
      has_tv: true,
      has_balcony: false
    });

    this.createRoom({
      room_number: "102",
      category_id: standardRoom.id,
      status: "available",
      floor: 1,
      has_wifi: true,
      has_ac: true,
      has_minibar: false,
      has_room_service: true,
      has_tv: true,
      has_balcony: false
    });

    this.createRoom({
      room_number: "201",
      category_id: deluxeRoom.id,
      status: "available",
      floor: 2,
      has_wifi: true,
      has_ac: true,
      has_minibar: true,
      has_room_service: true,
      has_tv: true,
      has_balcony: true
    });

    this.createRoom({
      room_number: "301",
      category_id: suite.id,
      status: "available",
      floor: 3,
      has_wifi: true,
      has_ac: true,
      has_minibar: true,
      has_room_service: true,
      has_tv: true,
      has_balcony: true
    });

    // Add sample guests
    const johnSmith = this.createGuest({
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St",
      city: "New York",
      country: "USA",
      id_type: "Passport",
      id_number: "ABC123456"
    });

    const mariaGarcia = this.createGuest({
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "+1 (555) 234-5678",
      address: "456 Park Ave",
      city: "Miami",
      country: "USA",
      id_type: "Passport",
      id_number: "XYZ789012"
    });

    // Add sample bookings
    const booking1 = this.createBooking({
      booking_number: "B10428",
      guest_id: johnSmith.id,
      room_id: 3, // Deluxe Room
      status: "confirmed",
      check_in_date: new Date("2023-08-12"),
      check_out_date: new Date("2023-08-15"),
      adults: 2,
      children: 0,
      total_price: "580.00"
    });

    const booking2 = this.createBooking({
      booking_number: "B10429",
      guest_id: mariaGarcia.id,
      room_id: 4, // Suite
      status: "new",
      check_in_date: new Date("2023-08-14"),
      check_out_date: new Date("2023-08-18"),
      adults: 2,
      children: 2,
      total_price: "950.00"
    });

    // Add sample payments
    this.createPayment({
      booking_id: booking1.id,
      transaction_id: "XND-58472",
      xendit_invoice_id: "inv_123456789",
      amount: "580.00",
      payment_method: "visa",
      status: "paid",
      card_last_four: "4582"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...userData, id, created_at: now };
    this.users.set(id, user);
    return user;
  }

  // Room category operations
  async getRoomCategories(): Promise<RoomCategory[]> {
    return Array.from(this.roomCategories.values());
  }

  async getRoomCategory(id: number): Promise<RoomCategory | undefined> {
    return this.roomCategories.get(id);
  }

  async createRoomCategory(categoryData: InsertRoomCategory): Promise<RoomCategory> {
    const id = this.currentRoomCategoryId++;
    const category: RoomCategory = { ...categoryData, id };
    this.roomCategories.set(id, category);
    return category;
  }

  async updateRoomCategory(id: number, categoryData: Partial<RoomCategory>): Promise<RoomCategory | undefined> {
    const category = this.roomCategories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.roomCategories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteRoomCategory(id: number): Promise<boolean> {
    return this.roomCategories.delete(id);
  }

  // Room operations
  async getRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoomsWithCategory(): Promise<RoomWithCategory[]> {
    return Array.from(this.rooms.values()).map(room => {
      const category = this.roomCategories.get(room.category_id);
      return { 
        ...room, 
        category: category! 
      };
    });
  }

  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async getRoomByNumber(roomNumber: string): Promise<Room | undefined> {
    return Array.from(this.rooms.values()).find(
      (room) => room.room_number === roomNumber
    );
  }

  async createRoom(roomData: InsertRoom): Promise<Room> {
    const id = this.currentRoomId++;
    const room: Room = { ...roomData, id };
    this.rooms.set(id, room);
    return room;
  }

  async updateRoom(id: number, roomData: Partial<Room>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...roomData };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async deleteRoom(id: number): Promise<boolean> {
    return this.rooms.delete(id);
  }

  async getAvailableRooms(checkIn: Date, checkOut: Date, categoryId?: number): Promise<RoomWithCategory[]> {
    // Get all rooms with their categories
    const allRooms = await this.getRoomsWithCategory();
    
    // Filter by category if provided
    const categoryFiltered = categoryId 
      ? allRooms.filter(room => room.category_id === categoryId)
      : allRooms;
    
    // Get all bookings that overlap with the requested dates
    const bookings = Array.from(this.bookings.values()).filter(booking => {
      return (
        booking.status !== 'cancelled' &&
        booking.check_in_date < checkOut &&
        booking.check_out_date > checkIn
      );
    });
    
    // Get IDs of rooms that are booked during the requested period
    const bookedRoomIds = new Set(bookings.map(booking => booking.room_id));
    
    // Filter out rooms that are unavailable or booked
    return categoryFiltered.filter(room => 
      room.status === "available" && !bookedRoomIds.has(room.id)
    );
  }

  // Guest operations
  async getGuests(): Promise<Guest[]> {
    return Array.from(this.guests.values());
  }

  async getGuest(id: number): Promise<Guest | undefined> {
    return this.guests.get(id);
  }

  async getGuestByEmail(email: string): Promise<Guest | undefined> {
    return Array.from(this.guests.values()).find(
      (guest) => guest.email === email
    );
  }

  async createGuest(guestData: InsertGuest): Promise<Guest> {
    const id = this.currentGuestId++;
    const now = new Date();
    const guest: Guest = { ...guestData, id, created_at: now };
    this.guests.set(id, guest);
    return guest;
  }

  async updateGuest(id: number, guestData: Partial<Guest>): Promise<Guest | undefined> {
    const guest = this.guests.get(id);
    if (!guest) return undefined;
    
    const updatedGuest = { ...guest, ...guestData };
    this.guests.set(id, updatedGuest);
    return updatedGuest;
  }

  async deleteGuest(id: number): Promise<boolean> {
    return this.guests.delete(id);
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingsWithDetails(): Promise<BookingWithDetails[]> {
    return Array.from(this.bookings.values()).map(booking => {
      const guest = this.guests.get(booking.guest_id)!;
      const room = this.rooms.get(booking.room_id)!;
      const category = this.roomCategories.get(room.category_id)!;
      const payment = Array.from(this.payments.values()).find(
        payment => payment.booking_id === booking.id
      );
      
      return {
        ...booking,
        guest,
        room: { ...room, category },
        payment
      };
    });
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingByNumber(bookingNumber: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(
      (booking) => booking.booking_number === bookingNumber
    );
  }

  async getBookingWithDetails(id: number): Promise<BookingWithDetails | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const guest = this.guests.get(booking.guest_id)!;
    const room = this.rooms.get(booking.room_id)!;
    const category = this.roomCategories.get(room.category_id)!;
    const payment = Array.from(this.payments.values()).find(
      payment => payment.booking_id === booking.id
    );
    
    return {
      ...booking,
      guest,
      room: { ...room, category },
      payment
    };
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const now = new Date();
    const booking: Booking = { 
      ...bookingData, 
      id, 
      created_at: now, 
      updated_at: now 
    };
    this.bookings.set(id, booking);
    
    // Update room status to reserved
    const room = this.rooms.get(booking.room_id);
    if (room) {
      room.status = "reserved";
      this.rooms.set(room.id, room);
    }
    
    return booking;
  }

  async updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const now = new Date();
    const updatedBooking = { 
      ...booking, 
      ...bookingData, 
      updated_at: now 
    };
    this.bookings.set(id, updatedBooking);
    
    // Update room status if booking status changed
    if (bookingData.status) {
      const room = this.rooms.get(booking.room_id);
      if (room) {
        if (bookingData.status === "cancelled") {
          room.status = "available";
        } else if (bookingData.status === "checked_in") {
          room.status = "occupied";
        } else if (bookingData.status === "checked_out") {
          room.status = "available";
        }
        this.rooms.set(room.id, room);
      }
    }
    
    return updatedBooking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const booking = this.bookings.get(id);
    if (booking) {
      // Free up the room
      const room = this.rooms.get(booking.room_id);
      if (room) {
        room.status = "available";
        this.rooms.set(room.id, room);
      }
    }
    return this.bookings.delete(id);
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getPaymentsWithDetails(): Promise<PaymentWithDetails[]> {
    return Promise.all(
      Array.from(this.payments.values()).map(async payment => {
        const bookingWithDetails = await this.getBookingWithDetails(payment.booking_id);
        return {
          ...payment,
          booking: bookingWithDetails!
        };
      })
    );
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentByTransactionId(transactionId: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(
      (payment) => payment.transaction_id === transactionId
    );
  }

  async getPaymentByXenditInvoiceId(invoiceId: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(
      (payment) => payment.xendit_invoice_id === invoiceId
    );
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const now = new Date();
    const payment: Payment = { 
      ...paymentData, 
      id, 
      payment_date: paymentData.status === "paid" ? now : undefined,
      created_at: now, 
      updated_at: now 
    };
    this.payments.set(id, payment);
    
    // Update booking status if payment is completed
    if (payment.status === "paid") {
      const booking = this.bookings.get(payment.booking_id);
      if (booking && booking.status === "new") {
        booking.status = "confirmed";
        this.bookings.set(booking.id, booking);
      }
    }
    
    return payment;
  }

  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const now = new Date();
    const updatedPayment = { 
      ...payment, 
      ...paymentData, 
      updated_at: now 
    };
    
    // If status changed to paid, set payment date
    if (paymentData.status === "paid" && payment.status !== "paid") {
      updatedPayment.payment_date = now;
      
      // Update booking status if payment is completed
      const booking = this.bookings.get(payment.booking_id);
      if (booking && booking.status === "new") {
        booking.status = "confirmed";
        this.bookings.set(booking.id, booking);
      }
    }
    
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async deletePayment(id: number): Promise<boolean> {
    return this.payments.delete(id);
  }
}

export const storage = new MemStorage();
