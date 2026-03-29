# TEMBERA Project Diagrams Summary

## Available Diagrams

This document provides an overview of all project diagrams created for the TEMBERA Tourism Platform.

### 1. Use Case Diagram
**File**: `diagrams/use-case-diagram.md`

Shows the interactions between different system actors and use cases:
- **Actors**: Visitor, User/Tourist, Company Owner, Administrator
- **Use Cases**: 30+ use cases covering browsing, booking, company management, and administration
- Includes use case descriptions and relationships

### 2. Entity-Relationship Diagram (ERD)
**File**: `diagrams/erd-diagram.md`

Depicts the database schema with all entities and relationships:
- **Entities**: User, Role, Company, Itinerary, ItineraryImage, Booking, BookingItem, BookingMember
- Shows cardinality and relationships between tables
- Includes detailed entity descriptions with attributes and constraints

### 3. Class Diagram
**File**: `diagrams/class-diagram.md`

Illustrates the object-oriented structure of the backend system:
- **Controllers**: AuthController, UserController, CompanyController, ItineraryController, BookingController
- **Services**: UserService, CompanyService, ItineraryService, BookingService
- **Repositories**: UserRepository, CompanyRepository, ItineraryRepository, BookingRepository
- **Models**: User, Role, Company, Itinerary, Booking entities
- Shows relationships and design patterns used

## Additional Diagrams to Create

### 4. System Architecture Diagram

**Mermaid Diagram**:
```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser[Web Browser]
        Mobile[Mobile Device]
    end
    
    subgraph Frontend["Frontend Layer - React SPA"]
        Pages[Pages/Routes]
        Components[UI Components]
        Redux[Redux State]
        APILayer[API Client]
    end
    
    subgraph Backend["Backend Layer - Express API"]
        Routes[Express Routes]
        Middleware[Middlewares]
        Controllers[Controllers]
        Services[Business Logic]
        Repositories[Data Access]
    end
    
    subgraph External["External Services"]
        Cloudinary[Cloudinary CDN]
        JWT[JWT Auth]
    end
    
    subgraph Database["Database Layer"]
        Prisma[Prisma ORM]
        PostgreSQL[(PostgreSQL DB)]
    end
    
    Browser --> Pages
    Mobile --> Pages
    Pages --> APILayer
    APILayer -->|REST API| Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Prisma
    Prisma --> PostgreSQL
    Controllers --> Cloudinary
    Middleware --> JWT
    
    style Browser fill:#e1f5ff
    style Frontend fill:#61dafb
    style Backend fill:#90ee90
    style Database fill:#336791
```

**Components:**
- **Client Layer**: Web and mobile browsers
- **Frontend**: React SPA with Redux state management
- **Backend**: Express.js RESTful API with layered architecture
- **External Services**: Cloudinary for images, JWT for authentication
- **Database**: PostgreSQL with Prisma ORM

### 5. Proposed Model Diagram

**Request-Response Flow**:
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Auth
    participant Controller
    participant Service
    participant Repository
    participant Database
    participant Cloudinary
    
    User->>Frontend: User Action
    Frontend->>API: HTTP Request + JWT
    API->>Auth: Validate Token
    Auth-->>API: Token Valid
    API->>Controller: Route Handler
    Controller->>Service: Business Logic
    Service->>Repository: Data Operation
    Repository->>Database: SQL Query
    Database-->>Repository: Query Result
    Repository-->>Service: Data
    Service-->>Controller: Processed Result
    
    alt Image Upload Required
        Controller->>Cloudinary: Upload Image
        Cloudinary-->>Controller: Image URL
    end
    
    Controller-->>API: Response Data
    API-->>Frontend: JSON Response
    Frontend-->>User: Update UI
```

**Layered Architecture Model**:
```mermaid
graph LR
    subgraph Presentation["Presentation Layer"]
        UI[User Interface]
        Forms[Forms]
        Display[Display Components]
    end
    
    subgraph Application["Application Layer"]
        Controllers2[Controllers]
        Services2[Services]
        Validation[Validation]
    end
    
    subgraph DataAccess["Data Access Layer"]
        Repositories2[Repositories]
        ORM[Prisma ORM]
    end
    
    subgraph DataStore["Data Storage"]
        DB[(Database)]
    end
    
    UI --> Controllers2
    Forms --> Controllers2
    Controllers2 --> Services2
    Services2 --> Validation
    Services2 --> Repositories2
    Repositories2 --> ORM
    ORM --> DB
    
    style Presentation fill:#ff6b6b
    style Application fill:#4ecdc4
    style DataAccess fill:#95e1d3
    style DataStore fill:#a8e6cf
```

## Quick Reference

| Diagram Type | Purpose | Key Elements |
|--------------|---------|--------------|
| Use Case | User interactions | Actors, Use Cases, Relationships |
| ERD | Database design | Tables, Columns, Foreign Keys |
| Class | Code structure | Classes, Methods, Relationships |
| Architecture | System overview | Layers, Components, Data Flow |
| Model | Process flows | Sequences, Workflows, Patterns |

## How to View Diagrams

1. **GitHub**: Diagrams render automatically in markdown files
2. **Mermaid Live Editor**: Copy mermaid code to https://mermaid.live
3. **VS Code**: Install "Markdown Preview Mermaid Support" extension
4. **IDE**: Most modern IDEs support Mermaid rendering

## Diagram Standards

All diagrams follow these standards:
- **Format**: Mermaid syntax in markdown files
- **Style**: Consistent color schemes and naming conventions
- **Documentation**: Each diagram includes descriptions and legends
- **Version Control**: All diagrams are versioned with the codebase

---

**Last Updated**: March 29, 2026  
**Maintained By**: Team 3


