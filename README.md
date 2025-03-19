
# HotelX - Hotel Management System

A modern hotel management system built with React, Express, and TypeScript that handles room management, bookings, and payments.

## Features

- 🏨 Room Management
  - Add, edit and delete rooms
  - Set room status (available, occupied, maintenance)
  - Configure room amenities (WiFi, AC, minibar, etc.)

- 📅 Booking Management  
  - Create and manage reservations
  - Check-in/check-out functionality
  - View booking history

- 💳 Payment Processing
  - Secure payment integration with Xendit
  - View payment history
  - Generate invoices

- 🌐 Multilingual Support
  - English (en)
  - Indonesian (id)

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Express + TypeScript
- Database: SQLite with Drizzle ORM
- Payment: Xendit Integration
- i18n: React-Intl

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Backend Express API
├── shared/          # Shared TypeScript types
└── package.json     # Project configuration
```

## Environment Variables

Required environment variables:
- `XENDIT_SECRET_KEY`: Xendit API key for payment processing
- `JWT_SECRET`: Secret key for JWT authentication

## License

Copyright © 2024 HotelX. All rights reserved.
