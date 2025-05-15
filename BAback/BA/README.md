# Beauty Advisor - Backend API

The Beauty Advisor backend is a Node.js/Express application that powers the Beauty Advisor platform, providing personalized beauty recommendations through a RESTful API.

## Features

- **User Management**: Authentication and user profile storage
- **Photo Processing**: Upload and storage of user photos
- **Beauty Recommendations**: Generation of personalized beauty recommendations
- **Feedback Collection**: Storage and retrieval of user feedback
- **Database Integration**: PostgreSQL database with Prisma ORM
- **Security**: JWT-based authentication and authorization

## Technologies Used

- **Node.js**: JavaScript runtime for server-side code
- **Express.js**: Web framework for the API
- **PostgreSQL**: Relational database (hosted on Neon.tech)
- **Prisma ORM**: Database access and management
- **JWT**: Authentication mechanism
- **Multer**: Middleware for handling file uploads
- **Cors**: Cross-Origin Resource Sharing support

## Project Structure

```
BA/
├── middleware/       # Express middleware (auth, error handling)
├── prisma/           # Database schema and migrations
│   └── migrations/   # Database migration files
├── routes/           # API route definitions
├── uploads/          # Uploaded user photos
├── utils/            # Utility functions
├── server.js         # Main application entry point
└── package.json      # Project dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and receive token
- `GET /api/auth/profile` - Get current user profile (protected)

### Photos
- `POST /api/images/upload` - Upload a user photo
- `GET /api/images/:id` - Get a specific photo

### Recommendations
- `POST /api/recommendations/generate` - Generate a new recommendation
- `GET /api/recommendations` - Get all recommendations for current user
- `GET /api/recommendations/:id` - Get a specific recommendation

### Feedback
- `POST /api/feedback` - Submit feedback for a recommendation
- `GET /api/feedback/recommendation/:id` - Get feedback for a specific recommendation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)
- PostgreSQL database (or Neon.tech account)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd beauty-advisor/BAback/BA
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the project root with the following variables:
```
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
JWT_SECRET="your-jwt-secret-key"
PORT=3000
```

4. Set up the database
```bash
npx prisma migrate dev
```

5. Seed the database (optional)
```bash
npx prisma db seed
```

### Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at [http://localhost:3000](http://localhost:3000).

## Database Schema

The application uses a PostgreSQL database with the following main entities:

- **User**: User account information
- **Photo**: Uploaded user photos
- **Recommendation**: Beauty recommendations generated for users
- **Feedback**: User feedback on recommendations

The complete schema can be found in `prisma/schema.prisma`.

## File Upload

User photos are stored in the `uploads/` directory. In a production environment, consider using a cloud storage solution like AWS S3.

## Error Handling

The API implements standardized error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

## Security Considerations

- JWT tokens are used for authentication
- Password hashing is implemented for user security
- Input validation is performed on all API endpoints
- CORS is configured for secure cross-origin requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request