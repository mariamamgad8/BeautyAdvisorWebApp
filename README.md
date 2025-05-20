# Beauty Advisor Application

A comprehensive beauty recommendation system that uses AI to analyze facial features and provide personalized makeup and hairstyle recommendations.

## Application Structure

This application consists of three main components:

1. **Frontend**: React-based UI for users to interact with the application
2. **Backend**: Node.js/Express server to handle API requests and database operations
3. **ML Model**: Python-based beauty advisor model that analyzes facial features

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL database
- npm or yarn package manager

## Python Dependencies

Install the required Python packages:

```bash
cd BAback
pip install -r models/requirements.txt
```

The main Python dependencies include:
- opencv-python
- numpy
- mediapipe
- Pillow

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database for the application:

```sql
CREATE DATABASE beauty_advisor;
```

### 2. Backend Configuration

Navigate to the backend directory and install dependencies:

```bash
cd BAback
npm install
```

Configure environment variables by creating/updating the `.env` file:

```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/beauty_advisor
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=development
```

Replace `username` and `password` with your PostgreSQL credentials.

Run database migrations to set up the schema:

```bash
npx prisma migrate deploy
```

Seed the database with initial data (if needed):

```bash
node prisma/seed.js
```

### 3. Frontend Configuration

Navigate to the frontend directory and install dependencies:

```bash
cd ../BAfront
npm install
```

Configure environment variables by creating/updating the `.env` file:

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_NAME=Beauty Advisor
```

### 4. Running the Application

#### Start the Backend Server

```bash
cd ../BAback
npm start
```

#### Start the Frontend Development Server

```bash
cd ../BAfront
npm start
```

The application should now be running with:
- Frontend accessible at: http://localhost:3000
- Backend API accessible at: http://localhost:3001

## Testing the Integration

To test if the model integration is working correctly, run:

```bash
cd BAback
node test-integration.js
```

This will run the beauty advisor model on sample images and log the results.

## Features

- User authentication
- Photo upload and management
- AI-powered beauty recommendations
- User feedback and rating system
- Personalized recommendation history

## License

This project is licensed under the MIT License.
