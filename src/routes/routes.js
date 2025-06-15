import adminRoutes from "./adminRoutes";
import userRoutes from "./userRoutes";
import organizerRoutes from "./organizerRoutes";
import authRoutes from "./authRoutes";

// Export as function to use in App.js
export default function getRoutesFunc(role) {
    // console.log("Role in getRoutesFunc:", role);
  switch (role) {
    case "admin":
      return [...adminRoutes];
    case "organizer":
      return [...organizerRoutes];
    case "user":
      return [...userRoutes];
    default:
      return [...authRoutes];
  }
}
