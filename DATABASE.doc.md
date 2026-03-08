# 3.4 Database Design Documentation

The system database is designed to support a **travel or activity booking platform** where users can browse itineraries offered by companies and create bookings for them. The schema consists of five main entities:

* **User**
* **Company**
* **Itinerary**
* **Booking**
* **Booking Item**

These entities work together to manage users, travel activities, companies providing them, and the booking process.

---

# 1. User Table

The **User** table stores information about people who use the system to book itineraries.

| Column       | Type         | Description                                                  |
| ------------ | ------------ | ------------------------------------------------------------ |
| id           | bigint       | Unique identifier for each user                              |
| name         | varchar(255) | Full name of the user                                        |
| email        | varchar(255) | User email address used for authentication and communication |
| phone_number | varchar(50)  | Contact phone number                                         |
| password     | varchar(255) | Encrypted password for login                                 |

### Role in the System

Users are customers who browse itineraries and make bookings.

### Relationships

* One **User** can create **many Bookings**.

```
User (1) ------ (N) Booking
```

---

# 2. Company Table

The **Company** table represents organizations that provide travel itineraries or activities.

| Column      | Type         | Description                                |
| ----------- | ------------ | ------------------------------------------ |
| id          | bigint       | Unique identifier for each company         |
| name        | varchar(50)  | Company name                               |
| description | varchar(255) | Description of the company                 |
| contact     | varchar(50)  | Contact information                        |
| owner_id    | bigint       | Reference to the user who owns the company |

### Role in the System

Companies publish itineraries that users can book.

### Relationships

* One **Company** can create **many Itineraries**.
* `owner_id` may reference a **User** who manages the company.

```
User (1) ------ (N) Company
Company (1) ------ (N) Itinerary
```

---

# 3. Itinerary Table

The **Itinerary** table represents activities, trips, or experiences offered by companies.

| Column      | Type             | Description                                     |
| ----------- | ---------------- | ----------------------------------------------- |
| id          | bigint           | Unique identifier for the itinerary             |
| company_id  | bigint           | Reference to the company offering the itinerary |
| title       | varchar(50)      | Title of the itinerary                          |
| activity    | varchar(255)     | Type of activity                                |
| description | varchar(255)     | Details of the itinerary                        |
| location    | varchar(255)     | Where the activity takes place                  |
| date        | date             | Scheduled date                                  |
| price       | double precision | Cost of the itinerary                           |

### Role in the System

This table stores all bookable activities available to users.

### Relationships

* One **Company** can provide **many Itineraries**.
* One **Itinerary** can appear in **many Booking Items**.

```
Company (1) ------ (N) Itinerary
Itinerary (1) ------ (N) Booking Item
```

---

# 4. Booking Table

The **Booking** table represents a booking transaction made by a user.

| Column      | Type         | Description                                          |
| ----------- | ------------ | ---------------------------------------------------- |
| id          | bigint       | Unique booking identifier                            |
| user_id     | bigint       | Reference to the user making the booking             |
| description | varchar(255) | Additional notes about the booking                   |
| status      | varchar(10)  | Booking status (e.g., pending, confirmed, cancelled) |
| date        | date         | Date the booking was created                         |

### Role in the System

Bookings act as **containers for one or more booked itineraries**.

### Relationships

* One **User** can create **multiple Bookings**.
* One **Booking** can contain **multiple Booking Items**.

```
User (1) ------ (N) Booking
Booking (1) ------ (N) Booking Item
```

---

# 5. Booking Item Table

The **Booking Item** table connects bookings with itineraries.

| Column       | Type   | Description                       |
| ------------ | ------ | --------------------------------- |
| id           | bigint | Unique identifier                 |
| itinerary_id | bigint | Reference to the booked itinerary |
| booking_id   | bigint | Reference to the booking          |

### Role in the System

This table allows a **single booking to include multiple itineraries**.

It functions as a **junction table** that implements a many-to-many relationship between bookings and itineraries.

### Relationships

```
Booking (1) ------ (N) Booking Item
Itinerary (1) ------ (N) Booking Item
```

Which results in:

```
Booking (N) ------ (N) Itinerary
```

---

# How the Tables Work Together (System Workflow)

### 1. User Registration

A user creates an account in the **User** table.

### 2. Company Creates Itineraries

A company registered in the **Company** table creates travel experiences stored in the **Itinerary** table.

### 3. User Browses Itineraries

Users view available itineraries offered by different companies.

### 4. User Creates Booking

When a user decides to book activities:

1. A record is created in **Booking**
2. Each selected itinerary is inserted into **Booking Item**

Example:

```
Booking
-------
id: 10
user_id: 3
status: confirmed
```

```
Booking Item
------------
id: 1 | booking_id: 10 | itinerary_id: 5
id: 2 | booking_id: 10 | itinerary_id: 9
```

This means booking **#10** includes **two itineraries**.

---

# Entity Relationship Summary

```
User
 ├── creates ── Booking
 │                 └── contains ── Booking Item ── references ── Itinerary
 │                                                        │
 │                                                        │
 └── may own ── Company ── creates ── Itinerary
```

---

# Design Advantages

1. **Scalable booking system**

   * Users can book multiple itineraries in a single booking.

2. **Separation of concerns**

   * Companies manage itineraries.
   * Users manage bookings.

3. **Flexible relationships**

   * The `Booking Item` table allows many itineraries per booking.

4. **Expandable**

   * Additional features like payments, reviews, or availability can be added easily.