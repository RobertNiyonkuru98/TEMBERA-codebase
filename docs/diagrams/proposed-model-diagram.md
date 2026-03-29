# Proposed Model Diagram - TEMBERA Tourism Platform

## System Workflow Model

### 1. User Registration and Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant AuthController
    participant UserRepository
    participant Database
    
    User->>Frontend: Fill Registration Form
    Frontend->>API: POST /api/auth/register
    API->>AuthController: register(req, res)
    AuthController->>UserRepository: findByEmail(email)
    
    alt Email Exists
        UserRepository-->>AuthController: User Found
        AuthController-->>API: 409 Conflict
        API-->>Frontend: Email Already Used
        Frontend-->>User: Show Error Message
    else Email Available
        UserRepository-->>AuthController: null
        AuthController->>AuthController: Hash Password (bcrypt)
        AuthController->>UserRepository: create(userData)
        UserRepository->>Database: INSERT INTO User
        Database-->>UserRepository: User Created
        UserRepository-->>AuthController: User Data
        AuthController-->>API: 201 Created
        API-->>Frontend: Success Response
        Frontend-->>User: Registration Successful
    end
```

### 2. Booking Creation Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant AuthMW
    participant BookingController
    participant BookingService
    participant BookingRepo
    participant Database
    
    User->>Frontend: Select Itinerary & Create Booking
    Frontend->>API: POST /api/bookings (with JWT)
    API->>AuthMW: Validate Token
    
    alt Invalid Token
        AuthMW-->>API: 401 Unauthorized
        API-->>Frontend: Authentication Failed
        Frontend-->>User: Redirect to Login
    else Valid Token
        AuthMW-->>API: Authorized User
        API->>BookingController: createBooking(req, res)
        BookingController->>BookingService: createBooking(data)
        BookingService->>BookingService: Validate Booking Data
        BookingService->>BookingService: Check Date Availability
        
        alt Validation Failed
            BookingService-->>BookingController: Validation Error
            BookingController-->>API: 400 Bad Request
            API-->>Frontend: Error Details
            Frontend-->>User: Show Validation Errors
        else Valid Booking
            BookingService->>BookingRepo: create(bookingData)
            BookingRepo->>Database: INSERT INTO Booking
            
            opt Group Booking
                BookingRepo->>Database: INSERT INTO BookingMember
            end
            
            Database-->>BookingRepo: Booking Created
            BookingRepo-->>BookingService: Booking Data
            BookingService-->>BookingController: Success
            BookingController-->>API: 201 Created
            API-->>Frontend: Booking Confirmation
            Frontend-->>User: Show Booking Details
        end
    end
```

### 3. Itinerary Creation with Media Upload

```mermaid
sequenceDiagram
    participant Company
    participant Frontend
    participant API
    participant AuthMW
    participant ItineraryController
    participant ItineraryService
    participant Cloudinary
    participant Database
    
    Company->>Frontend: Create Itinerary Form
    Frontend->>API: POST /api/itineraries (with JWT)
    API->>AuthMW: Validate Token & Role
    
    alt Not Company Role
        AuthMW-->>API: 403 Forbidden
        API-->>Frontend: Access Denied
        Frontend-->>Company: Show Error
    else Company Role
        AuthMW-->>API: Authorized
        API->>ItineraryController: createItinerary(req, res)
        ItineraryController->>ItineraryService: createItinerary(data)
        ItineraryService->>Database: INSERT INTO Itinerary
        Database-->>ItineraryService: Itinerary Created
        
        opt Images Provided
            ItineraryService->>Cloudinary: Upload Images
            Cloudinary-->>ItineraryService: Image URLs
            ItineraryService->>Database: INSERT INTO ItineraryImage
        end
        
        opt Videos Provided
            ItineraryService->>Cloudinary: Upload Videos (max 5)
            Cloudinary-->>ItineraryService: Video URLs & Thumbnails
            ItineraryService->>Database: INSERT INTO ItineraryVideo
        end
        
        ItineraryService-->>ItineraryController: Success
        ItineraryController-->>API: 201 Created
        API-->>Frontend: Itinerary Data
        Frontend-->>Company: Show Success
    end
```

### 4. Rating Submission Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant AuthMW
    participant RatingController
    participant RatingService
    participant RatingRepo
    participant ItineraryRepo
    participant Database
    
    User->>Frontend: Submit Rating & Review
    Frontend->>API: POST /api/ratings/itinerary/:id/rating (with JWT)
    API->>AuthMW: Validate Token
    
    alt Invalid Token
        AuthMW-->>API: 401 Unauthorized
        API-->>Frontend: Authentication Failed
    else Valid Token
        AuthMW-->>API: Authorized User
        API->>RatingController: createRating(req, res)
        RatingController->>RatingService: createRating(userId, data)
        
        RatingService->>RatingRepo: findUserRatingForItinerary(userId, itineraryId)
        
        alt Rating Already Exists
            RatingRepo-->>RatingService: Existing Rating Found
            RatingService-->>RatingController: Conflict Error
            RatingController-->>API: 409 Conflict
            API-->>Frontend: Already Rated
            Frontend-->>User: Show Error
        else No Existing Rating
            RatingRepo-->>RatingService: null
            RatingService->>RatingService: Validate Rating Data (1-10)
            RatingService->>RatingRepo: create(ratingData)
            RatingRepo->>Database: INSERT INTO ItineraryRating
            Database-->>RatingRepo: Rating Created
            
            %% Update cached statistics
            RatingService->>ItineraryRepo: updateRatingStats(itineraryId)
            ItineraryRepo->>Database: Calculate AVG & COUNT
            Database-->>ItineraryRepo: Statistics
            ItineraryRepo->>Database: UPDATE Itinerary SET average_rating, total_ratings
            
            RatingRepo-->>RatingService: Rating Data
            RatingService-->>RatingController: Success
            RatingController-->>API: 201 Created
            API-->>Frontend: Rating Submitted
            Frontend-->>User: Thank You Message
        end
    end
```
    participant Database
    
    Company->>Frontend: Create Itinerary Form
    Frontend->>API: POST /api/itineraries (with JWT)
    API->>AuthMW: Validate Token & Role
    
    alt Not Company Role
        AuthMW-->>API: 403 Forbidden
        API-->>Frontend: Access Denied
        Frontend-->>Company: Show Error
    else Company Role
        AuthMW-->>API: Authorized
        API->>ItineraryController: createItinerary(req, res)
        ItineraryController->>ItineraryService: createItinerary(data)
        ItineraryService->>Database: INSERT INTO Itinerary
        Database-->>ItineraryService: Itinerary Created
        
        opt Images Provided
            ItineraryService->>Cloudinary: Upload Images
            Cloudinary-->>ItineraryService: Image URLs
            ItineraryService->>Database: INSERT INTO ItineraryImage
        end
        
        ItineraryService-->>ItineraryController: Success
        ItineraryController-->>API: 201 Created
        API-->>Frontend: Itinerary Data
        Frontend-->>Company: Show Success
    end
```

## Layered Architecture Model

```mermaid
graph TB
    subgraph PresentationLayer["Presentation Layer"]
        direction TB
        Pages[Route Pages]
        Components[UI Components]
        Forms[Form Components]
        Cards[Display Cards]
    end
    
    subgraph APILayer["API Layer"]
        direction TB
        Routes[Express Routes]
        AuthMiddleware[Auth Middleware]
        UploadMiddleware[Upload Middleware]
        ErrorHandler[Error Handler]
    end
    
    subgraph ControllerLayer["Controller Layer"]
        direction TB
        AuthCtrl[AuthController]
        UserCtrl[UserController]
        CompanyCtrl[CompanyController]
        ItineraryCtrl[ItineraryController]
        BookingCtrl[BookingController]
    end
    
    subgraph ServiceLayer["Service/Business Logic Layer"]
        direction TB
        UserService[UserService]
        CompanyService[CompanyService]
        ItineraryService[ItineraryService]
        BookingService[BookingService]
    end
    
    subgraph RepositoryLayer["Repository/Data Access Layer"]
        direction TB
        UserRepo[UserRepository]
        CompanyRepo[CompanyRepository]
        ItineraryRepo[ItineraryRepository]
        BookingRepo[BookingRepository]
    end
    
    subgraph DatabaseLayer["Database Layer"]
        direction TB
        Prisma[Prisma Client]
        PostgreSQL[(PostgreSQL)]
    end
    
    Pages --> Routes
    Components --> Routes
    Forms --> Routes
    
    Routes --> AuthMiddleware
    Routes --> UploadMiddleware
    AuthMiddleware --> AuthCtrl
    Routes --> UserCtrl
    Routes --> CompanyCtrl
    Routes --> ItineraryCtrl
    Routes --> BookingCtrl
    
    AuthCtrl --> UserService
    UserCtrl --> UserService
    CompanyCtrl --> CompanyService
    ItineraryCtrl --> ItineraryService
    BookingCtrl --> BookingService
    
    UserService --> UserRepo
    CompanyService --> CompanyRepo
    ItineraryService --> ItineraryRepo
    BookingService --> BookingRepo
    
    UserRepo --> Prisma
    CompanyRepo --> Prisma
    ItineraryRepo --> Prisma
    BookingRepo --> Prisma
    
    Prisma --> PostgreSQL
    
    style PresentationLayer fill:#ffd1dc
    style APILayer fill:#fff4cc
    style ControllerLayer fill:#d1e7ff
    style ServiceLayer fill:#d4f4dd
    style RepositoryLayer fill:#e7d1ff
    style DatabaseLayer fill:#d1f5ff
```

## MVC Pattern Implementation

```mermaid
graph LR
    subgraph View["View (Frontend)"]
        ReactViews[React Components]
        StateManagement[Redux Store]
    end
    
    subgraph Controller["Controller (Backend)"]
        ExpressControllers[Express Controllers]
        RouteHandlers[Route Handlers]
    end
    
    subgraph Model["Model (Data)"]
        PrismaModels[Prisma Models]
        BusinessLogic[Business Services]
        DataAccess[Repositories]
    end
    
    ReactViews -->|HTTP Requests| ExpressControllers
    ExpressControllers -->|Response| ReactViews
    ExpressControllers --> BusinessLogic
    BusinessLogic --> DataAccess
    DataAccess --> PrismaModels
    PrismaModels --> DataAccess
    DataAccess --> BusinessLogic
    BusinessLogic --> ExpressControllers
    
    style View fill:#61dafb
    style Controller fill:#90ee90
    style Model fill:#ffd700
```

## Role-Based Access Control Model

```mermaid
flowchart TB
    Start[Incoming Request] --> Auth{Authenticated?}
    Auth -->|No| CheckPublic{Public Route?}
    Auth -->|Yes| CheckRole{Check User Role}
    
    CheckPublic -->|Yes| AllowAccess[Allow Access]
    CheckPublic -->|No| Deny401[401 Unauthorized]
    
    CheckRole --> Visitor[Visitor Role]
    CheckRole --> User[User Role]
    CheckRole --> Company[Company Role]
    CheckRole --> Admin[Admin Role]
    
    Visitor --> VisitorPermissions[View Itineraries Only]
    User --> UserPermissions[Create Bookings<br/>View Own Bookings<br/>Update Profile]
    Company --> CompanyPermissions[Manage Itineraries<br/>View Bookings<br/>Upload Images]
    Admin --> AdminPermissions[Full Access<br/>Manage Users<br/>Manage Companies]
    
    VisitorPermissions --> ValidateAction{Action Allowed?}
    UserPermissions --> ValidateAction
    CompanyPermissions --> ValidateAction
    AdminPermissions --> ValidateAction
    
    ValidateAction -->|Yes| AllowAccess
    ValidateAction -->|No| Deny403[403 Forbidden]
    
    AllowAccess --> ProcessRequest[Process Request]
    ProcessRequest --> Response[Return Response]
    
    style Auth fill:#4ecdc4
    style CheckRole fill:#95e1d3
    style ValidateAction fill:#ffe66d
    style AllowAccess fill:#a8e6cf
    style Deny401 fill:#ff6b6b
    style Deny403 fill:#ff6b6b
```

## Data Persistence Model

```mermaid
graph TB
    subgraph Application["Application Layer"]
        Service[Service Layer]
    end
    
    subgraph DataAccess["Data Access Pattern"]
        Repository[Repository Interface]
        Implementation[Repository Implementation]
    end
    
    subgraph ORM["ORM Layer"]
        PrismaClient[Prisma Client]
        QueryBuilder[Query Builder]
        Migration[Migrations]
    end
    
    subgraph Database["Database"]
        Tables[Tables]
        Relations[Relations]
        Constraints[Constraints]
        Indexes[Indexes]
    end
    
    Service --> Repository
    Repository --> Implementation
    Implementation --> PrismaClient
    PrismaClient --> QueryBuilder
    QueryBuilder --> Tables
    Migration --> Tables
    Tables --> Relations
    Relations --> Constraints
    Tables --> Indexes
    
    style Service fill:#d4f4dd
    style Repository fill:#d1e7ff
    style PrismaClient fill:#e7d1ff
    style Database fill:#336791
```

## Request-Response Cycle

```mermaid
graph LR
    A[Client Request] --> B[Express Router]
    B --> C[Middleware Stack]
    C --> D{Authentication}
    D -->|Fail| E[Return 401]
    D -->|Pass| F{Authorization}
    F -->|Fail| G[Return 403]
    F -->|Pass| H[Controller]
    H --> I[Service Layer]
    I --> J[Repository]
    J --> K[(Database)]
    K --> J
    J --> I
    I --> H
    H --> L[Response Handler]
    L --> M[JSON Response]
    M --> N[Client]
    
    style D fill:#4ecdc4
    style F fill:#95e1d3
    style H fill:#ffe66d
    style I fill:#a8e6cf
    style K fill:#336791
```

## Error Handling Model

```mermaid
flowchart TB
    Request[API Request] --> Try{Try Block}
    Try -->|Success| Process[Process Request]
    Try -->|Error| Catch[Catch Block]
    
    Process --> Database{Database Operation}
    Database -->|Success| Success[Return Success Response]
    Database -->|Error| DBError[Database Error]
    
    Catch --> ErrorType{Error Type}
    ErrorType --> NotFound[404 Not Found]
    ErrorType --> Unauthorized[401 Unauthorized]
    ErrorType --> Forbidden[403 Forbidden]
    ErrorType --> BadRequest[400 Bad Request]
    ErrorType --> Conflict[409 Conflict]
    ErrorType --> ServerError[500 Server Error]
    
    DBError --> Logger[Log Error]
    NotFound --> Logger
    Unauthorized --> Logger
    Forbidden --> Logger
    BadRequest --> Logger
    Conflict --> Logger
    ServerError --> Logger
    
    Logger --> ResponseHandler[Response Handler]
    ResponseHandler --> ErrorResponse[Error Response to Client]
    
    style Try fill:#a8e6cf
    style Catch fill:#ff6b6b
    style Logger fill:#ffe66d
    style Success fill:#90ee90
```

## State Management Model (Frontend)

```mermaid
graph TB
    subgraph Components["React Components"]
        AdminComp[Admin Components]
        CompanyComp[Company Components]
        UserComp[User Components]
    end
    
    subgraph StateManagement["Redux Toolkit"]
        Store[Redux Store]
        Slices[State Slices]
        Actions[Actions]
        Reducers[Reducers]
    end
    
    subgraph API["API Integration"]
        APIClient[Axios Client]
        Thunks[Async Thunks]
    end
    
    subgraph Context["Context API"]
        AuthContext[Auth Context]
        UserContext[User Context]
    end
    
    AdminComp --> Store
    CompanyComp --> Store
    UserComp --> Store
    
    Store --> Slices
    Slices --> Actions
    Actions --> Reducers
    Reducers --> Store
    
    Actions --> Thunks
    Thunks --> APIClient
    APIClient -->|HTTP| Backend[Backend API]
    
    Components --> AuthContext
    Components --> UserContext
    
    style Store fill:#764abc
    style APIClient fill:#61dafb
    style Backend fill:#90ee90
```

## Design Patterns Used

### Repository Pattern
- Abstracts data access logic
- Provides clean API for data operations
- Enables testing with mock repositories

### Service Layer Pattern
- Encapsulates business logic
- Coordinates multiple repositories
- Handles complex workflows

### Middleware Pattern
- Authentication verification
- Request logging
- Error handling
- File upload processing

### DTO Pattern
- Data transfer between layers
- Input validation
- Type safety

### Dependency Injection
- Services injected into controllers
- Repositories injected into services
- Promotes loose coupling

## Model Benefits

✅ **Separation of Concerns**: Clear boundaries between layers  
✅ **Scalability**: Easy to add new features without affecting existing code  
✅ **Testability**: Each layer can be tested independently  
✅ **Maintainability**: Code is organized and easy to understand  
✅ **Reusability**: Components and services can be reused  
✅ **Security**: Authentication and authorization at multiple levels  
✅ **Performance**: Optimized data access and caching strategies  

---

**Model Architecture**: Layered Architecture with MVC Pattern  
**Communication**: REST API with JSON  
**Authentication**: JWT Token-based  
**Database Access**: Repository Pattern with Prisma ORM  
**Last Updated**: March 29, 2026

