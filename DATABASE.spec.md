# Prisma Schema Definition (PostgreSQL)

First configure Prisma to use PostgreSQL.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

# User Model

This model stores all users of the system.

```prisma
model User {
  id           BigInt   @id @default(autoincrement())
  name         String   @db.VarChar(255)
  email        String   @unique @db.VarChar(255)
  phone_number String?  @db.VarChar(50)
  password     String   @db.VarChar(255)

  bookings     Booking[]
  companies    Company[] @relation("CompanyOwner")
}
```

### Explanation

* `id` is the primary key.
* `email` is unique.
* A **User can have many Bookings**.
* A **User can own multiple Companies**.

---

# Company Model

Represents companies that provide itineraries.

```prisma
model Company {
  id          BigInt   @id @default(autoincrement())
  name        String   @db.VarChar(50)
  description String?  @db.VarChar(255)
  contact     String?  @db.VarChar(50)

  owner_id    BigInt
  owner       User     @relation("CompanyOwner", fields: [owner_id], references: [id])

  itineraries Itinerary[]
}
```

### Explanation

* `owner_id` references the **User who owns the company**.
* One company can create **many itineraries**.

---

# Itinerary Model

Stores travel or activity information.

```prisma
model Itinerary {
  id          BigInt    @id @default(autoincrement())
  company_id  BigInt
  title       String    @db.VarChar(50)
  activity    String?   @db.VarChar(255)
  description String?   @db.VarChar(255)
  location    String?   @db.VarChar(255)
  date        DateTime  @db.Date
  price       Float

  company     Company   @relation(fields: [company_id], references: [id])
  bookingItems BookingItem[]
}
```

### Explanation

* `company_id` links the itinerary to the company offering it.
* One itinerary may appear in **multiple booking items**.

---

# Booking Model

Represents a booking created by a user.

```prisma
model Booking {
  id          BigInt   @id @default(autoincrement())
  user_id     BigInt
  description String?  @db.VarChar(255)
  status      String   @db.VarChar(10)
  date        DateTime @db.Date

  user        User     @relation(fields: [user_id], references: [id])
  items       BookingItem[]
}
```

### Explanation

* `user_id` references the user who made the booking.
* A booking can contain **multiple booking items**.

---

# BookingItem Model

This table connects bookings and itineraries.

```prisma
model BookingItem {
  id           BigInt    @id @default(autoincrement())
  itinerary_id BigInt
  booking_id   BigInt

  itinerary    Itinerary @relation(fields: [itinerary_id], references: [id])
  booking      Booking   @relation(fields: [booking_id], references: [id])

  @@unique([booking_id, itinerary_id])
}
```

### Explanation

This model acts as a **junction table** between bookings and itineraries.

* One booking can include **many itineraries**.
* One itinerary can appear in **many bookings**.

The `@@unique` constraint ensures the **same itinerary cannot be added twice to the same booking**.

---

# Relationship Overview

```
User
 ├── Bookings
 │     └── BookingItems
 │           └── Itinerary
 │                 └── Company
 │
 └── Companies (owned)
        └── Itineraries
```

---

# Example `.env` Configuration

```env
DATABASE_URL="postgresql://user:password@localhost:5432/travel_booking_db"
```

---

# Run Prisma Migration

Create the database schema in PostgreSQL.

```bash
npx prisma migrate dev --name init_schema
```

Generate Prisma Client.

```bash
npx prisma generate
```