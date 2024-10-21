# Vlocity

### Project Overview
This project consists of both a client and server component. The backend follows the **MVC (Model-View-Controller)** design pattern for a clear separation of concerns, while the frontend is built using a component-based architecture for modularity and reusability.

### Loom Video Demo
[Correctly Working Demo](https://www.loom.com/share/37a068a8017e415588b9038e1b639c13?sid=2f31166d-0d5a-46b3-b440-ff81ca03537b)

[Partly Working Demo](https://www.loom.com/share/48fcf5e1d31e4723865e0f8e07471412?sid=ddec2b20-dbaf-4f61-86bd-c8476061a858)

---

## Getting Started

### Client Setup
To set up and run the client application:

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the client application:
   ```bash
   npm start
   ```

### Server Setup
To set up and run the server application:

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```

### Design Patterns

#### Backend (Server)
- The backend uses the **MVC (Model-View-Controller)** pattern to organize the codebase:
  - **Model**: Handles data logic and interactions with the database.
  - **View**: Not applicable here as we have an API, but in this context, the response is part of the view.
  - **Controller**: Handles incoming requests, processes them using models, and returns responses.

#### Frontend (Client)
- The frontend is structured using **components**. Each UI element is designed as a reusable component, adhering to React's component-based architecture. This modular approach ensures scalability and maintainability of the codebase.

---

## Hosting Information
Unfortunately, I couldn't host the application using services like Vercel or Netlify due to time constraints. However, I ran and tested the app on **GitHub Codespaces** during the development process, ensuring it works as expected.

---
