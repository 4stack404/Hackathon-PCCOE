# Pregnancy Care Backend API

This is the backend API for the Pregnancy Care application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pregnancy-care
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. Run the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile (protected)

### Users
- `PUT /api/users/profile` - Update user profile (protected)
- `DELETE /api/users/:id` - Delete a user (protected)


### Appointments
- `POST /api/appointments` - Create a new appointment (protected)
- `GET /api/appointments` - Get all user appointments (protected)
- `GET /api/appointments/:id` - Get appointment by ID (protected)
- `PUT /api/appointments/:id` - Update an appointment (protected)
- `DELETE /api/appointments/:id` - Delete an appointment (protected)


## Data Seeding

To seed the database with sample data: 