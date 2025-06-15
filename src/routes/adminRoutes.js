import Dashboard from "layouts/dashboard";
import MyEvents from "layouts/myEvents";
import Icon from "@mui/material/Icon";
import AdminDashboard from "layouts/admin/AdminDashboard";
import AllEventsPage from "layouts/admin/AllEvents";
import AllOrganizersPage from "layouts/admin/ManageOrganizer";
import GroupsIcon from "@mui/icons-material/Groups";
import ManageEventsPage from "layouts/admin/ApproveReject";


const adminRoutes = [
  {
    type: "collapse",
    name: "Admin Dashboard",
    key: "admin-dashboard",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    route: "/admin/dashboard",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Manage Events",
    key: "manage-events",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/admin/manage-events",
    component: <AllEventsPage />,
  },
{
  type: "collapse",
  name: "Manage Organizers",
  key: "manage-organizers",
  icon: <GroupsIcon fontSize="small" />,
  route: "/admin/manage-organizers",
  component: <AllOrganizersPage />,
},
{
  type: "collapse",
  name: "Approve/Rejects Events",
  key: "manage-organizers",
  icon: <GroupsIcon fontSize="small" />,
  route: "/admin/Approve-Reject-Events",
  component: <ManageEventsPage />,
}
];

export default adminRoutes;
