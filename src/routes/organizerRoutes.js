import MyEvents from "layouts/myEvents";
import Icon from "@mui/material/Icon";
import OrganizerHome from "layouts/Organizer/orgHomePage";
import CreateEvent from "layouts/Organizer/createEvent";


const organizerRoutes = [
  {
    type: "collapse",
    name: "Organizer Home",
    key: "organizer-home",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/organizer",
    component: <OrganizerHome />,
  },
  {
    type: "collapse",
    name: "Create An Event",
    key: "create-event",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/organizer/create-event",
    component: <CreateEvent />,
  },
  {
    type: "collapse",
    name: "View all Events",
    key: "create-event",
    icon: <Icon fontSize="small">event_note</Icon>,
    route: "/organizer/view-events",
    component: <MyEvents />,
  },
];

export default organizerRoutes;
