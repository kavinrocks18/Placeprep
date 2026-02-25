# Smart Placement & Interview Preparation Portal

A full-stack MERN application for tracking job applications, practicing coding problems, and interview preparation.

## Features

- **User Authentication**: Secure Login/Register with JWT.
- **Job Application Tracker**: Track status of applications (Applied, Interview, Offer, etc.).
- **Coding Practice**: Solve DSA problems with syntax highlighting (Mock execution).
- **Dashboard**: specialized analytics and progress tracking.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on port 27017

### Installation

1.  **Clone the repository** (if you haven't already).

2.  **Install Server Dependencies**:
    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies**:
    ```bash
    cd client
    npm install
    ```

4.  **Environment Variables**:
    - The server uses default values in `.env` (`MONGO_URI=mongodb://localhost:27017/placement_portal`).
    - Change them if needed.

### Running the Application

1.  **Start the Backend**:
    ```bash
    cd server
    npm run dev
    ```
    Server runs on `http://localhost:5000`.

2.  **Start the Frontend**:
    ```bash
    cd client
    npm run dev
    ```
    Client runs on `http://localhost:5173`.

3.  **Open Browser**:
    Navigate to `http://localhost:5173`.

## Seeding Data

When you visit the **Practice** page for the first time, the questions will be automatically seeded into the database.

## License

MIT
