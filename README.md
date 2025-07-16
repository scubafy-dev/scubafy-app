# Scubafy - Dive Center Management System

A comprehensive dive center management system built with Next.js, TypeScript, and Prisma.

## Features

### Authentication & Role Management
- **Google OAuth Integration**: Secure login with Google accounts
- **Role-Based Access Control**: Two user roles - Manager and Staff
- **Staff Code Verification**: Managers assign unique codes to staff members for secure login
  - Managers can create staff accounts with automatically generated 6-character codes
  - Staff members must enter their assigned code during login
  - Codes are unique per dive center and verified against active staff accounts

### Dive Center Management
- **Multi-Dive Center Support**: Manage multiple dive centers from one account
- **Staff Directory**: Complete staff management with permissions and contact information
- **Equipment Management**: Track dive equipment inventory, maintenance, and rentals
- **Customer Management**: Manage customer information and bookings
- **Financial Tracking**: Monitor dive center finances and revenue

### Dive Operations
- **Trip Management**: Plan and organize dive trips with capacity tracking
- **Calendar Integration**: Visual scheduling of dive activities
- **Task Management**: Assign and track staff tasks and responsibilities
- **Course Tracking**: Manage dive courses and student progress

## Staff Code System

The application implements a secure staff verification system:

1. **Manager creates staff account**: When a manager adds a new staff member, a unique 6-character code is automatically generated
2. **Code assignment**: The generated code is displayed to the manager and should be shared with the staff member
3. **Staff login**: When staff members log in, they must enter their assigned code
4. **Verification**: The system verifies the code against the staff database for the specific dive center
5. **Access granted**: Upon successful verification, staff members gain access based on their assigned permissions

### Security Features
- Codes are unique across the system
- Codes are tied to specific dive centers
- Only active staff members can use their codes
- Failed verification attempts are logged

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your database and environment variables
4. Run migrations: `npx prisma migrate dev`
5. Start the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="your-database-url"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: NextAuth user accounts with role management
- **DiveCenter**: Dive center information and settings
- **Staff**: Staff member profiles with permissions and verification codes
- **Equipment**: Dive equipment inventory and maintenance tracking
- **Customer**: Customer information and booking history
- **DiveTrip**: Trip planning and participant management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
