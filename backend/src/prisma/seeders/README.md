# Database Seeder Tool

This is an interactive command-line tool for seeding the TEMBERA database with roles and users.

## Features

- **Interactive prompts**: Collects user details (names, emails, passwords) from the user
- **Data viewing**: View current roles and users with detailed information before deciding what to do
- **Password hashing**: Automatically hashes passwords using bcrypt
- **Data validation**: Validates email formats and password requirements
- **Existing data handling**: Shows current database status and offers options to clear/replace existing data
- **Independent database access**: Connects directly to the database without going through the application's authentication/authorization layers
- **Graceful cleanup**: Properly closes database connections on exit

## Usage

### Running the Seeder

```bash
# From the backend directory
npm run seed
```

### Menu Options

1. **View current roles**: Displays all existing roles with user details
2. **View current users**: Displays all existing users with their assigned roles
3. **Seed roles only**: Creates admin and user roles (requires existing user IDs)
4. **Seed users only**: Creates admin and normal users with their corresponding roles
5. **Seed both roles and users**: Creates both users and their roles in one operation
6. **Clear all data**: Removes all existing users and roles
7. **Exit**: Closes the tool

### User Input Flow

When creating users, the tool will prompt for:

#### Admin User
- Name (minimum 2 characters)
- Email (valid email format)
- Password (minimum 6 characters)
- Password confirmation
- Phone number (optional)

#### Normal User
- Name (minimum 2 characters)
- Email (valid email format)
- Password (minimum 6 characters)
- Password confirmation
- Phone number (optional)

### Data Handling

- **Existing data detection**: Shows current count of roles and users
- **Overwrite options**: Prompts before overwriting existing users with the same email
- **Clear options**: Offers to clear existing data before seeding
- **Automatic role assignment**: Each user gets their corresponding role with "active" status

## Technical Details

### Database Connection

The seeder creates its own independent Prisma client instance using the same database configuration as the main application:

```typescript
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

### Security

- Passwords are hashed using bcrypt with 10 salt rounds
- Direct database access bypasses application validation layers
- Email validation prevents invalid email formats
- Password confirmation prevents typos

### Error Handling

- Graceful error messages for all operations
- Database connection error handling
- Process interruption handling (SIGINT, SIGTERM)
- Proper cleanup of resources

## Example Session

### Viewing Current Data

```
============================================================
DATABASE SEEDER TOOL
============================================================

Current database status:
  - Roles: 2
  - Users: 2

Please select an operation:
1. View current roles
2. View current users
3. Seed roles only
4. Seed users only
5. Seed both roles and users
6. Clear all data
7. Exit

Enter your choice (1-7): 2

============================================================
CURRENT USERS
============================================================

Found 2 user(s):

1. User Details:
   ID: 123e4567-e89b-12d3-a456-426614174000
   Name: Admin User
   Email: admin@example.com
   Phone: +1234567890
   Roles: 1 role(s)
     1. admin (active)

2. User Details:
   ID: 456e7890-e12b-34d5-a678-426614174111
   Name: Normal User
   Email: user@example.com
   Phone: +0987654321
   Roles: 1 role(s)
     1. user (active)

Press Enter to continue...
```

### Seeding New Data

```
============================================================
DATABASE SEEDER TOOL
============================================================

Current database status:
  - Roles: 0
  - Users: 0

Please select an operation:
1. View current roles
2. View current users
3. Seed roles only
4. Seed users only
5. Seed both roles and users
6. Clear all data
7. Exit

Enter your choice (1-7): 5

============================================================
SEED ROLES AND USERS
============================================================
This will create both users with their corresponding roles

============================================================
CREATE ADMIN USER
============================================================
Enter admin user name: Admin User
Enter admin user email: admin@example.com
Enter admin user password: admin123
Confirm password: admin123
Enter phone number (optional, press Enter to skip): +1234567890

✅ Admin user and role created successfully

============================================================
CREATE NORMAL USER
============================================================
Enter normal user name: Normal User
Enter normal user email: user@example.com
Enter normal user password: user123
Confirm password: user123
Enter phone number (optional, press Enter to skip): +0987654321

✅ Normal user and role created successfully

Press Enter to continue...
```

## Environment Variables

Make sure your `.env` file contains the `DATABASE_URL`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

## Dependencies

The seeder uses the following dependencies (already included in the project):

- `@prisma/client` - Database ORM
- `@prisma/adapter-pg` - PostgreSQL adapter
- `pg` - PostgreSQL client
- `bcrypt` - Password hashing
- `tsx` - TypeScript execution

## Notes

- The tool is completely independent from the main application
- It bypasses all authentication and authorization middleware
- All created roles have `access_status` set to "active"
- The tool automatically handles foreign key relationships
- Database connections are properly closed on exit
