import Dashboard from "layouts/dashboard";
import Tickets from "layouts/tickets";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import Icon from "@mui/material/Icon";

const userRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "My Tickets",
    key: "my-tickets",
    icon: <Icon fontSize="small">confirmation_number</Icon>,
    route: "/my-tickets",
    component: <Tickets />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
];

export default userRoutes;
