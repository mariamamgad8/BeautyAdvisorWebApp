# Beauty Advisor - Frontend Application

The Beauty Advisor frontend is a React-based web application that provides users with personalized beauty recommendations based on their facial features and preferences.

## Features

- **User Authentication**: Secure login and registration system
- **Photo Upload**: Easy-to-use interface for uploading facial photos
- **Personalized Recommendations**: View tailored makeup and hairstyle recommendations
- **Detailed Views**: Comprehensive recommendation details with product suggestions
- **User Feedback**: Rate and provide feedback on recommendations
- **Responsive Design**: Optimized for both desktop and mobile devices

## Technologies Used

- **React**: Frontend library for building the user interface
- **React Router**: For handling client-side routing
- **Axios**: For making HTTP requests to the backend API
- **CSS3**: For styling components with responsive design
- **JWT**: For secure user authentication

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React context providers (e.g., AuthContext)
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # API service integration
├── styles/           # CSS stylesheets
└── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd beauty-advisor/BAfront
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables (if needed)
Create a `.env` file in the project root:
```
REACT_APP_API_URL=http://localhost:3000
```

### Running the Application

```bash
npm start
```

The application will start on [http://localhost:3001](http://localhost:3001).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Key Components

### Pages
- **Home**: Landing page with service introduction
- **Login/Register**: User authentication forms
- **PhotoUpload**: Interface for uploading facial photos
- **Recommendations**: List of user's beauty recommendations
- **RecommendationDetail**: Detailed view of a specific recommendation
- **Profile**: User profile management
- **FeedbackForm**: Form for submitting recommendation feedback

### Services
- **API Service**: Handles communication with the backend API
- **Authentication Service**: Manages user authentication state

## Connect with the Backend

The frontend application communicates with the Beauty Advisor backend API, which should be running on `http://localhost:3000`. Make sure the backend server is running before using the frontend application.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
