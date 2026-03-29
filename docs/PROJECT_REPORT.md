# TEMBERA PROJECT REPORT

**Team 3 Members:**
1. Robert Tony MITALI NIYONKURU
2. Victor Mugisha Shyaka
3. Elie Kuradusenge
4. Ange Muhawenimana
5. Kevin Rebakure
6. Deborah Kamikazi

---

## 3.1 Introduction

### 3.1.1 Project Overview

**TEMBERA** is a comprehensive tourism management and booking platform designed to revolutionize how travelers discover, book, and manage their travel experiences. The name "Tembera," meaning "travel" in Kinyarwanda, reflects the platform's core mission to facilitate seamless travel planning and booking experiences.

The platform serves as a multi-stakeholder ecosystem connecting:
- **Tourists/Users**: Individuals seeking to book travel experiences and itineraries
- **Tour Companies**: Organizations offering tourism services and itineraries
- **System Administrators**: Platform managers overseeing operations and user management

### 3.1.2 Problem Statement

The tourism industry faces several challenges:
1. **Fragmented Booking Systems**: Tourists must navigate multiple platforms to find and book travel experiences
2. **Limited Visibility for Tour Operators**: Small and medium tour companies struggle to reach potential customers
3. **Manual Booking Processes**: Traditional booking methods are time-consuming and prone to errors
4. **Lack of Centralized Management**: No unified platform for managing bookings, itineraries, and customer relationships

### 3.1.3 Solution

TEMBERA addresses these challenges by providing:
- A centralized platform for discovering and booking tourism experiences
- An intuitive interface for tour companies to manage their itineraries and bookings
- Real-time booking management and tracking
- Role-based access control for different user types (Admin, Company, User, Visitor)
- Comprehensive booking management with support for both personal and group bookings
- Rich media management for showcasing tourism destinations (images and videos)
- Rating and review system for companies and itineraries
- Detailed itinerary information including pricing, scheduling, inclusions, and safety measures
- Advanced company profiles with branding, contact information, and specializations

### 3.1.4 Project Objectives

1. **Streamline Tourism Booking**: Create a user-friendly platform for discovering and booking travel experiences
2. **Empower Tour Companies**: Provide tools for companies to manage itineraries, bookings, and customer relationships
3. **Enhance User Experience**: Deliver a responsive, intuitive interface accessible across devices
4. **Ensure Security**: Implement robust authentication and authorization mechanisms
5. **Scalability**: Build a system that can handle growing numbers of users, companies, and bookings
6. **Build Trust**: Implement a comprehensive rating and review system for transparency and quality assurance
7. **Rich Content**: Support multimedia content (images and videos) for better destination showcasing

---

## 3.2 Research Design

### 3.2.1 Software Development Life Cycle (SDLC) Model

This project follows the **Agile Iterative Development** model with elements of the **Incremental Model**. This approach was chosen for several key reasons:

#### Agile Methodology
- **Iterative Development**: Features are developed in sprints, allowing for continuous improvement
- **Flexibility**: Requirements can evolve based on stakeholder feedback
- **Continuous Integration**: Regular testing and integration throughout the development process
- **Collaborative Approach**: Team members work together with frequent communication

#### Development Phases

1. **Planning & Requirements Gathering**
   - Identified stakeholders and their needs
   - Defined core features and user stories
   - Established technical requirements and constraints
   - Selected technology stack

2. **Design Phase**
   - Created system architecture diagrams
   - Designed database schema using Entity-Relationship modeling
   - Developed UI/UX wireframes and mockups
   - Defined API endpoints and data structures

3. **Implementation Phase (Iterative)**
   - **Sprint 1**: User authentication and role management
   - **Sprint 2**: Company management and registration
   - **Sprint 3**: Itinerary creation and management
   - **Sprint 4**: Booking system implementation
   - **Sprint 5**: Image upload and management
   - **Sprint 6**: Frontend UI development
   - **Sprint 7**: Integration and testing

4. **Testing Phase**
   - Unit testing for individual components
   - Integration testing for API endpoints
   - User acceptance testing (UAT)
   - Security and performance testing

5. **Deployment & Maintenance**
   - Cloud deployment setup
   - Continuous monitoring
   - Bug fixes and feature enhancements

#### Benefits of the Chosen Model

- **Rapid Prototyping**: Quickly deliver working features for stakeholder review
- **Risk Mitigation**: Early detection of issues through continuous testing
- **Adaptability**: Easily incorporate feedback and changing requirements
- **Team Collaboration**: Enhanced communication and shared understanding
- **Quality Assurance**: Continuous integration and testing ensure high-quality output

---

## 3.3 Functional and Non-functional Requirements

### 3.3.1 Functional Requirements

#### User Management (FR-1)
- **FR-1.1**: Users must be able to register with name, email, password, and phone number
- **FR-1.2**: Users must be able to login with email and password
- **FR-1.3**: System must support role-based access (Admin, Company, User, Visitor)
- **FR-1.4**: Users must be able to update their profile information
- **FR-1.5**: Admin must be able to manage user roles and access status

#### Company Management (FR-2)
- **FR-2.1**: Companies must be able to register on the platform
- **FR-2.2**: Companies must have unique profiles with name, description, and contact details
- **FR-2.3**: Admin must be able to approve or suspend companies
- **FR-2.4**: Company owners must be able to update their company information
- **FR-2.5**: Companies must be able to view their booking statistics

#### Itinerary Management (FR-3)
- **FR-3.1**: Companies must be able to create itineraries with comprehensive details (title, description, location, date, price, duration, capacity, etc.)
- **FR-3.2**: Companies must be able to upload multiple images and videos for each itinerary
- **FR-3.3**: Companies must be able to specify inclusions, exclusions, meal options, and transportation details
- **FR-3.4**: Companies must be able to set difficulty level, age restrictions, and accessibility information
- **FR-3.5**: Companies must be able to define pricing models (per person, per group, deposits, refund policies)
- **FR-3.6**: Companies must be able to edit and delete their itineraries
- **FR-3.7**: All users must be able to browse available itineraries
- **FR-3.8**: Itineraries must be searchable and filterable by location, date, price, difficulty, and category
- **FR-3.9**: System must track average ratings and total reviews for each itinerary

#### Booking Management (FR-4)
- **FR-4.1**: Authenticated users must be able to book itineraries
- **FR-4.2**: System must support both personal and group bookings
- **FR-4.3**: Group bookings must allow adding multiple members with their details
- **FR-4.4**: Users must be able to view their booking history
- **FR-4.5**: Companies must be able to view bookings for their itineraries
- **FR-4.6**: Booking status must be trackable (pending, confirmed, cancelled)
- **FR-4.7**: Users must be able to cancel their bookings

#### Image Management (FR-5)
- **FR-5.1**: System must support image upload for itineraries
- **FR-5.2**: Images must be stored securely in cloud storage (Cloudinary)
- **FR-5.3**: Multiple images per itinerary must be supported with ordering
- **FR-5.4**: Images must be optimized for web display

#### Admin Dashboard (FR-6)
- **FR-6.1**: Admin must have access to all system data
- **FR-6.2**: Admin must be able to manage users, companies, and bookings
- **FR-6.3**: Admin must be able to view system statistics and reports
- **FR-6.4**: Admin must be able to create companies and assign owners

### 3.3.2 Non-functional Requirements

#### Performance (NFR-1)
- **NFR-1.1**: API response time must be under 2 seconds for 95% of requests
- **NFR-1.2**: System must support at least 1000 concurrent users
- **NFR-1.3**: Database queries must be optimized with appropriate indexing
- **NFR-1.4**: Images must be compressed and optimized for fast loading

#### Security (NFR-2)
- **NFR-2.1**: All passwords must be hashed using bcrypt with salt rounds
- **NFR-2.2**: Authentication must use JWT tokens with appropriate expiration
- **NFR-2.3**: API endpoints must implement proper authorization checks
- **NFR-2.4**: Sensitive data must be transmitted over HTTPS
- **NFR-2.5**: SQL injection and XSS attacks must be prevented
- **NFR-2.6**: File uploads must be validated and sanitized

#### Reliability (NFR-3)
- **NFR-3.1**: System uptime must be at least 99.5%
- **NFR-3.2**: Database backups must be performed daily
- **NFR-3.3**: Error handling must be comprehensive with proper logging
- **NFR-3.4**: System must gracefully handle database connection failures

#### Usability (NFR-4)
- **NFR-4.1**: Interface must be intuitive and require minimal training
- **NFR-4.2**: System must be responsive and work on mobile, tablet, and desktop
- **NFR-4.3**: Error messages must be clear and actionable
- **NFR-4.4**: Navigation must be consistent across all pages

#### Maintainability (NFR-5)
- **NFR-5.1**: Code must follow consistent style guidelines
- **NFR-5.2**: System must use modular architecture for easy updates
- **NFR-5.3**: API must be well-documented using Swagger/OpenAPI
- **NFR-5.4**: Database schema must be version-controlled with migrations

#### Scalability (NFR-6)
- **NFR-6.1**: System architecture must support horizontal scaling
- **NFR-6.2**: Database must handle growing data volumes efficiently
- **NFR-6.3**: Stateless API design to support load balancing
- **NFR-6.4**: Caching strategies for frequently accessed data

#### Compatibility (NFR-7)
- **NFR-7.1**: Frontend must support modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-7.2**: API must follow RESTful conventions
- **NFR-7.3**: System must use standard data formats (JSON)

---

## 3.4 System Architecture

### 3.4.1 Overall Architecture Pattern

TEMBERA follows a **Three-Tier Client-Server Architecture** with clear separation of concerns:

1. **Presentation Layer (Frontend)**
   - React-based single-page application (SPA)
   - Responsive UI built with Tailwind CSS
   - State management using Redux Toolkit
   - Client-side routing with React Router

2. **Application Layer (Backend API)**
   - RESTful API built with Express.js and TypeScript
   - Layered architecture with controllers, services, and repositories
   - JWT-based authentication middleware
   - Swagger documentation for API endpoints

3. **Data Layer (Database)**
   - PostgreSQL relational database
   - Prisma ORM for database operations
   - Migration-based schema management
   - Database connection pooling for performance

### 3.4.2 Backend Architecture

The backend follows a **Layered Architecture** pattern:

#### Layer Structure

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│   (Controllers - HTTP Request/Response) │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│      (Services - Business Rules)        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│   (Repositories - Database Operations)  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│            Database Layer               │
│        (PostgreSQL + Prisma)            │
└─────────────────────────────────────────┘
```

#### Components

1. **Controllers**: Handle HTTP requests and responses
   - `AuthController`: User authentication (login/register)
   - `UserController`: User management operations
   - `CompanyController`: Company CRUD operations
   - `ItineraryController`: Itinerary management
   - `BookingController`: Booking operations
   - `UploadController`: Image upload handling

2. **Services**: Implement business logic
   - `UserService`: User-related business logic
   - `CompanyService`: Company operations and validation
   - `ItineraryService`: Itinerary management logic
   - `BookingService`: Booking workflow and validation

3. **Repositories**: Abstract database operations
   - Repository pattern for database access
   - Interfaces for type safety and testability
   - Prisma client wrapper for database queries

4. **Middlewares**
   - `auth.middleware.ts`: JWT token verification and role checking
   - `upload.middleware.ts`: File upload handling with Multer

5. **Utils**
   - `http-error.ts`: Custom error classes
   - `response.ts`: Standardized response handler
   - `logger.ts`: Winston-based logging
   - `date.validator.ts`: Date validation utilities

### 3.4.3 Frontend Architecture

The frontend follows a **Component-Based Architecture**:

#### Component Structure

```
┌─────────────────────────────────────────┐
│            Pages (Routes)               │
│  (User flows and page compositions)     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          Components                     │
│    (Reusable UI components)             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       API Layer / Services              │
│   (HTTP requests to backend)            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│        State Management                 │
│      (Redux Toolkit Store)              │
└─────────────────────────────────────────┘
```

#### Key Components

1. **Pages**: Route-level components
   - Admin pages (dashboard, users, companies, bookings)
   - Company pages (itineraries, bookings, statistics)
   - User pages (browse, book, profile)
   - Authentication pages (login, register)

2. **Components**: Reusable UI elements
   - `AuthenticatedSidebar`: Navigation for logged-in users
   - `GuestTopNav`: Navigation for visitors
   - `ItineraryCard`: Display itinerary information
   - `ProtectedRoute`: Route guard for authentication
   - `RoleSwitcher`: Role-based view switching

3. **API Layer**: HTTP request handling
   - `authApi.ts`: Authentication endpoints
   - `platformApi.ts`: Main API operations
   - `requestHelper.ts`: Axios configuration and interceptors

4. **State Management**
   - Redux Toolkit for global state
   - Context API for authentication state
   - Local component state for UI interactions

### 3.4.4 Database Architecture

- **Database**: PostgreSQL (Relational Database)
- **ORM**: Prisma
- **Connection**: Connection pooling with pg adapter
- **Migrations**: Version-controlled schema changes
- **Seeding**: Test data generation scripts

### 3.4.5 External Services Integration

1. **Cloudinary**: Image storage and optimization
   - Image upload and management
   - Automatic image optimization
   - CDN delivery for fast loading

2. **JWT**: Token-based authentication
   - Stateless authentication
   - Role-based access control
   - Token expiration and refresh

### 3.4.6 Deployment Architecture

- **Backend**: Node.js server (deployable to cloud platforms)
- **Frontend**: Static site hosting (Vite build)
- **Database**: Managed PostgreSQL instance
- **File Storage**: Cloudinary cloud storage
- **Environment**: Environment-based configuration

---

## 3.5 Diagrams

### 3.5.1 Use Case Diagram
See: [docs/diagrams/use-case-diagram.md](./diagrams/use-case-diagram.md)

The use case diagram illustrates the interactions between different actors (Admin, Company, User, Visitor) and the system functionalities.

### 3.5.2 Class Diagram
See: [docs/diagrams/class-diagram.md](./diagrams/class-diagram.md)

The class diagram shows the object-oriented structure of the system with classes, attributes, methods, and relationships.

### 3.5.3 Entity-Relationship Diagram (ERD)
See: [docs/diagrams/erd-diagram.md](./diagrams/erd-diagram.md)

The ERD depicts the database schema with entities, attributes, and relationships between tables.

### 3.5.4 System Architecture Diagram
See: [docs/diagrams/system-architecture-diagram.md](./diagrams/system-architecture-diagram.md)

The architecture diagram shows the overall system structure, layers, and component interactions.

---

## 3.6 Development Tools

### 3.6.1 Backend Development Tools

#### Core Technologies
- **Node.js** (v18+): JavaScript runtime environment
- **TypeScript** (v5.9.3): Typed superset of JavaScript for better code quality
- **Express.js** (v5.2.1): Web application framework for building RESTful APIs

#### Database & ORM
- **PostgreSQL**: Relational database management system
- **Prisma** (v7.5.0): Next-generation ORM for TypeScript
  - Schema definition and migration management
  - Type-safe database client
  - Visual database browser (Prisma Studio)
- **@prisma/adapter-pg** (v7.4.2): PostgreSQL adapter for Prisma
- **pg** (v8.20.0): PostgreSQL client for Node.js

#### Authentication & Security
- **bcrypt** (v6.0.0): Password hashing library
- **jsonwebtoken** (v9.0.3): JWT token generation and verification
- **cors** (v2.8.6): Cross-Origin Resource Sharing middleware

#### File Upload & Storage
- **multer** (v2.1.1): Middleware for handling multipart/form-data
- **cloudinary** (v2.9.0): Cloud-based image and video management

#### Documentation
- **swagger-jsdoc** (v6.2.8): Generate Swagger documentation from JSDoc comments
- **swagger-ui-express** (v5.0.1): Serve Swagger UI for API documentation
- **yamljs** (v0.3.0): YAML parser for Swagger configuration

#### Utilities
- **dotenv** (v17.3.1): Environment variable management
- **envalid** (v8.1.1): Environment variable validation
- **winston** (v3.19.0): Logging library

#### Development Tools
- **tsx** (v4.21.0): TypeScript execution for development
- **ts-node** (v10.9.2): TypeScript execution environment
- **nodemon** (v3.1.14): Auto-restart server on file changes

### 3.6.2 Frontend Development Tools

#### Core Technologies
- **React** (v19.2.4): JavaScript library for building user interfaces
- **TypeScript** (v5.9.3): Static type checking
- **Vite** (v8.0.0): Fast build tool and development server

#### UI & Styling
- **Tailwind CSS** (v4.2.1): Utility-first CSS framework
- **@tailwindcss/vite** (v4.2.1): Tailwind integration for Vite
- **Radix UI**: Unstyled, accessible UI components
  - `@radix-ui/react-menubar`: Menu components
- **Lucide React** (v0.577.0): Icon library
- **class-variance-authority** (v0.7.1): CSS class composition utility

#### State Management & Routing
- **@reduxjs/toolkit** (v2.11.2): State management
- **react-redux** (v9.2.0): React bindings for Redux
- **react-router-dom** (v7.6.0): Client-side routing

#### UI Components
- **embla-carousel-react** (v8.6.0): Carousel/slider component
- **sonner** (v2.0.7): Toast notifications

#### HTTP Client
- **axios** (v1.13.6): Promise-based HTTP client

#### Development Tools
- **ESLint** (v9.39.4): Code linting and style enforcement
- **@vitejs/plugin-react** (v6.0.0): React plugin for Vite

### 3.6.3 Version Control & Collaboration

- **Git**: Distributed version control system
- **GitHub**: Repository hosting and collaboration

### 3.6.4 API Testing

- **Postman**: API development and testing
  - Collection available at: `backend/postman/Tembera.postman_collection.json`

### 3.6.5 Development Environment

- **IDE**: JetBrains PyCharm / Visual Studio Code
- **Terminal**: PowerShell (Windows)
- **Package Manager**: npm (Node Package Manager)

### 3.6.6 Database Tools

- **Prisma Studio**: Visual database browser and editor
- **PostgreSQL CLI**: Command-line interface for database management

### 3.6.7 Cloud Services

- **Cloudinary**: Image hosting and optimization CDN
- **Cloud Database Provider**: Managed PostgreSQL hosting

---

## Appendices

### A. API Endpoints Summary

**Authentication**
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

**Users**
- GET `/api/users` - Get all users (Admin)
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user (Admin)

**Companies**
- GET `/api/companies` - Get all companies
- POST `/api/companies` - Create company (Admin)
- GET `/api/companies/:id` - Get company by ID
- PUT `/api/companies/:id` - Update company
- DELETE `/api/companies/:id` - Delete company

**Itineraries**
- GET `/api/itineraries` - Get all itineraries
- POST `/api/itineraries` - Create itinerary (Company)
- GET `/api/itineraries/:id` - Get itinerary by ID
- PUT `/api/itineraries/:id` - Update itinerary
- DELETE `/api/itineraries/:id` - Delete itinerary

**Bookings**
- GET `/api/bookings` - Get user bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/:id` - Get booking by ID
- PUT `/api/bookings/:id` - Update booking
- DELETE `/api/bookings/:id` - Cancel booking

**Upload**
- POST `/api/upload/image` - Upload image to Cloudinary

### B. Database Schema Tables

1. **User**: User account information
2. **Role**: User role and access level
3. **Company**: Tour company profiles
4. **Itinerary**: Travel itineraries and packages
5. **ItineraryImage**: Images for itineraries
6. **Booking**: Booking records
7. **BookingItem**: Link between bookings and itineraries
8. **BookingMember**: Members in group bookings

### C. Key Features Implemented

✅ User registration and authentication
✅ Role-based access control (Admin, Company, User, Visitor)
✅ Company management and registration
✅ Itinerary creation with multiple images
✅ Personal and group booking system
✅ Responsive UI for all device sizes
✅ Image upload and cloud storage integration
✅ RESTful API with Swagger documentation
✅ Comprehensive error handling and logging
✅ Database migrations and seeding

---

**Document Version**: 1.0  
**Last Updated**: March 29, 2026  
**Status**: Final

