# System Architecture Diagram - TEMBERA Tourism Platform

## High-Level System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser[Web Browser]
        Mobile[Mobile Device]
    end
    
    subgraph Frontend["Frontend Layer - React SPA"]
        Pages[Pages/Routes]
        Components[UI Components]
        Redux[Redux State Management]
        APILayer[API Client Axios]
    end
    
    subgraph Backend["Backend Layer - Express API"]
        Routes[Express Routes]
        Middleware[Auth & Upload MW]
        Controllers[Controllers Layer]
        Services[Business Logic Layer]
        Repositories[Data Access Layer]
    end
    
    subgraph External["External Services"]
        Cloudinary[Cloudinary CDN]
        JWT[JWT Authentication]
    end
    
    subgraph Database["Database Layer"]
        Prisma[Prisma ORM]
        PostgreSQL[(PostgreSQL Database)]
    end
    
    Browser --> Pages
    Mobile --> Pages
    Pages --> APILayer
    APILayer -->|REST API/JSON| Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Prisma
    Prisma --> PostgreSQL
    Controllers --> Cloudinary
    Middleware --> JWT
    
    style Client fill:#e1f5ff
    style Frontend fill:#61dafb
    style Backend fill:#90ee90
    style External fill:#ffe66d
    style Database fill:#336791
```

## Three-Tier Architecture

```mermaid
graph TB
    subgraph Tier1["Tier 1: Presentation Layer"]
        UI[User Interface - React]
        State[State Management - Redux]
        Routing[Client Routing]
    end
    
    subgraph Tier2["Tier 2: Application Layer"]
        API[RESTful API - Express]
        BizLogic[Business Logic - Services]
        Auth[Authentication & Authorization]
    end
    
    subgraph Tier3["Tier 3: Data Layer"]
        ORM[Prisma ORM]
        DB[(PostgreSQL Database)]
        Cache[Connection Pool]
    end
    
    UI --> API
    State --> API
    API --> Auth
    API --> BizLogic
    BizLogic --> ORM
    ORM --> Cache
    Cache --> DB
    
    style Tier1 fill:#ffd1dc
    style Tier2 fill:#d1e7ff
    style Tier3 fill:#d1ffd7
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant React
    participant API
    participant Auth
    participant Service
    participant Repository
    participant Database
    participant Cloudinary
    
    User->>Browser: Initiate Action
    Browser->>React: User Interaction
    React->>API: HTTP Request + JWT Token
    API->>Auth: Validate Token & Role
    
    alt Token Invalid
        Auth-->>API: 401 Unauthorized
        API-->>React: Error Response
        React-->>User: Show Error
    else Token Valid
        Auth-->>API: Authorized
        API->>Service: Execute Business Logic
        Service->>Repository: Data Operation
        Repository->>Database: Query/Update
        Database-->>Repository: Result
        Repository-->>Service: Data
        
        opt Image Upload
            Service->>Cloudinary: Upload File
            Cloudinary-->>Service: Image URL
        end
        
        Service-->>API: Processed Data
        API-->>React: JSON Response
        React-->>User: Update UI
    end
```

## Component Architecture

```mermaid
graph TB
    subgraph FrontendComponents["Frontend Components"]
        AdminPages[Admin Pages]
        CompanyPages[Company Pages]
        UserPages[User Pages]
        PublicPages[Public Pages]
        SharedComp[Shared Components]
    end
    
    subgraph BackendComponents["Backend Components"]
        AuthRoutes[Auth Routes]
        UserRoutes[User Routes]
        CompanyRoutes[Company Routes]
        ItineraryRoutes[Itinerary Routes]
        BookingRoutes[Booking Routes]
    end
    
    subgraph ServiceLayer["Service Layer"]
        UserService[User Service]
        CompanyService[Company Service]
        ItineraryService[Itinerary Service]
        BookingService[Booking Service]
    end
    
    subgraph DataLayer["Data Layer"]
        UserRepo[User Repository]
        CompanyRepo[Company Repository]
        ItineraryRepo[Itinerary Repository]
        BookingRepo[Booking Repository]
        PrismaClient[Prisma Client]
    end
    
    AdminPages --> AuthRoutes
    AdminPages --> UserRoutes
    CompanyPages --> CompanyRoutes
    UserPages --> BookingRoutes
    PublicPages --> ItineraryRoutes
    
    AuthRoutes --> UserService
    UserRoutes --> UserService
    CompanyRoutes --> CompanyService
    ItineraryRoutes --> ItineraryService
    BookingRoutes --> BookingService
    
    UserService --> UserRepo
    CompanyService --> CompanyRepo
    ItineraryService --> ItineraryRepo
    BookingService --> BookingRepo
    
    UserRepo --> PrismaClient
    CompanyRepo --> PrismaClient
    ItineraryRepo --> PrismaClient
    BookingRepo --> PrismaClient
```

## Deployment Architecture

```mermaid
graph TB
    subgraph Production["Production Environment"]
        subgraph CDN["Content Delivery Network"]
            StaticAssets[Static Assets]
            Images[Cloudinary Images]
        end
        
        subgraph WebServers["Web Servers"]
            FrontendApp[Frontend Application]
            HTTPS[HTTPS/SSL]
        end
        
        subgraph AppServers["Application Servers"]
            APIServer1[API Server Instance 1]
            APIServer2[API Server Instance 2]
            LoadBalancer[Load Balancer]
        end
        
        subgraph DataServers["Database Servers"]
            PrimaryDB[(Primary Database)]
            ReplicaDB[(Read Replica)]
        end
    end
    
    Users[End Users] --> CDN
    CDN --> HTTPS
    HTTPS --> FrontendApp
    FrontendApp --> LoadBalancer
    LoadBalancer --> APIServer1
    LoadBalancer --> APIServer2
    APIServer1 --> PrimaryDB
    APIServer2 --> PrimaryDB
    PrimaryDB -.Replication.-> ReplicaDB
    APIServer1 --> Images
    APIServer2 --> Images
    
    style Users fill:#e1f5ff
    style CDN fill:#ffe66d
    style WebServers fill:#90ee90
    style AppServers fill:#87ceeb
    style DataServers fill:#336791
```

## Security Architecture

```mermaid
graph TB
    Request[Incoming Request] --> HTTPS{HTTPS Check}
    HTTPS -->|Not Secure| Reject1[Reject Request]
    HTTPS -->|Secure| CORS{CORS Validation}
    CORS -->|Invalid Origin| Reject2[Reject Request]
    CORS -->|Valid| Auth{Authentication}
    Auth -->|No Token| Public{Public Route?}
    Auth -->|Invalid Token| Reject3[401 Unauthorized]
    Auth -->|Valid Token| RoleCheck{Role Authorization}
    Public -->|Yes| Controller[Controller]
    Public -->|No| Reject4[401 Unauthorized]
    RoleCheck -->|Authorized| Validation{Input Validation}
    RoleCheck -->|Not Authorized| Reject5[403 Forbidden]
    Validation -->|Invalid| Reject6[400 Bad Request]
    Validation -->|Valid| Controller
    Controller --> Response[Send Response]
    
    style HTTPS fill:#ff6b6b
    style Auth fill:#4ecdc4
    style RoleCheck fill:#95e1d3
    style Controller fill:#a8e6cf
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI Framework |
| | TypeScript | Type Safety |
| | Redux Toolkit | State Management |
| | Vite | Build Tool |
| | Tailwind CSS | Styling |
| **Backend** | Node.js | Runtime |
| | Express 5 | Web Framework |
| | TypeScript | Type Safety |
| | Prisma 7 | ORM |
| **Database** | PostgreSQL | Relational Database |
| **Storage** | Cloudinary | Image CDN |
| **Auth** | JWT | Token Authentication |
| | bcrypt | Password Hashing |

## Architecture Characteristics

### Scalability
- Horizontal scaling with stateless API
- Database connection pooling
- CDN for static content
- Load balancing capability

### Security
- HTTPS encryption
- JWT authentication
- Role-based access control
- Input validation & sanitization
- Password hashing with bcrypt

### Performance
- Optimized database queries
- Image optimization via CDN
- Frontend code splitting
- API response caching

### Reliability
- Error handling & logging
- Database transactions
- Graceful degradation
- Health monitoring

### Maintainability
- Modular architecture
- Type safety with TypeScript
- API documentation with Swagger
- Version-controlled migrations

---

**Architecture Style**: Layered Three-Tier Architecture  
**Communication Protocol**: REST over HTTPS  
**Data Format**: JSON  
**Last Updated**: March 29, 2026

