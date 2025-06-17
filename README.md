# 🎟️ EventSure Frontend

This is the frontend of **EventSure**, a full-stack MERN platform for event management and ticket booking. It offers a responsive and role-based dashboard for users, organizers, and admins, with features like event listing, ticket booking, event creation, moderation, and user management.

> Built using **React**, **Material UI**, **React Router**, and integrated with the EventSure backend for dynamic content and secure operations.

---

## 🌟 Key Features

- 🎫 Browse, book, and manage event tickets
- 👥 Role-based dashboards:
  - **Users** can view and book events
  - **Organizers** can create and manage their events
  - **Admins** can moderate events and manage users
- 🔐 Secure login and signup with JWT-based authentication
- 📊 Admin features for banning/unbanning users and approving/rejecting events
- ✨ Responsive UI with Material Dashboard 2 and MUI components
- 🔄 Dynamic routing based on role (RBAC logic)
- 📥 Paginated tables for event listing and filtering

---

## 🧱 Tech Stack

- **React.js**
- **Material UI / Material Dashboard 2 React**
- **React Router DOM**
- **Axios** – for API calls
- **Context API** – for global state and auth
- **JWT** – for user sessions

---

## 📁 Folder Structure

EventSure-Frontend/
├── src/
│ ├── assets/ # Static images & logos
│ ├── auth/ # Auth helpers (getUserRole, useRole)
│ ├── components/ # Reusable components
│ ├── context/ # Auth context provider
│ ├── layouts/ # Dashboard layout
│ ├── pages/ # Pages based on routes and roles
│ ├── routes/ # Role-based route config
│ ├── services/ # Axios and API services
│ ├── App.js # Entry component
│ └── index.js # Root rendering

yaml
Copy
Edit

---

## ⚙️ Getting Started

### 1. Clone the Repository

bash
git clone https://github.com/PrakashNandan/EventSure-Frontend.git
cd EventSure-Frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add:

env
Copy
Edit
REACT_APP_BASE_URL=http://localhost:5000
Adjust the BASE_URL to your deployed backend if applicable.

4. Run the Application
bash
Copy
Edit
npm start
The app will start on http://localhost:3000.

🔐 Role-Based Routing
Dynamic route rendering is implemented using:

getUserRole() utility to fetch role from JWT or context

Separate route files for adminRoutes, organizerRoutes, userRoutes, and authRoutes

Conditional rendering in App.js or Routes.jsx for secured access

🧭 Pages Overview
Role	Pages/Features
User	View all events, book tickets, view bookings
Organizer	Create/edit events, view organizer dashboard
Admin	View/manage all events, approve/reject events, manage users

📬 API Integration
API services are defined using Axios in the services/ directory. All major requests are sent to the backend:

/api/users/register – Register new user

/api/users/login – User login

/api/events/ – Fetch events

/api/tickets/book/:id – Book event ticket

/api/admin/ – Admin-specific actions

JWT token is attached to every protected API request.

🎨 UI/UX Highlights
Based on Material Dashboard 2 React

Clean sidebar navigation, styled tables, cards, and modals

Loading states and error messages for all major actions

Paginated event lists with filters (Pending, Approved, Rejected)
