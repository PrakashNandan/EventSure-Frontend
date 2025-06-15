import React, { useState, useEffect } from "react";
import { Card, Grid, Button, Avatar, Divider } from "@mui/material";
import { motion } from "framer-motion";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import EventIcon from "@mui/icons-material/Event";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import baseURL from "baseurl";
import { useNavigate } from "react-router-dom";
import PulseLoader  from "react-spinners/PulseLoader";

const MotionCard = motion(Card);

function OrganizerHome() {

    const [loading, setLoading] = useState(false);
    const [totalEvents, setTotalEvents] = useState(0);
    const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [totalTicketsBookedInLatestEvent, setTotalTicketsBookedInLatestEvent] = useState(0);

    const navigate = useNavigate();
  
    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${baseURL}/auth/getUserDetails`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                console.log(response.data);
            } catch (error) {
                console.error("Profile fetch failed:", error);
            }
        } 

        // fetchProfile();

        const fetchEventsData = async () => { 
            try {
              setLoading(true);
                const {data} = await axios.get(`${baseURL}/event/getEventMetaData`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                
                console.log("Fetched events data:", data);  

                setLoading(false);
                setTotalEvents(data.totalEvents);
                setUpcomingEventsCount(data.upcomingEventsCount);
                setTotalTicketsBookedInLatestEvent(data.totalTicketsBookedInLatestEvent);
                setUpcomingEvents(data.upcomingEventsList);



            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }

        fetchEventsData();




    }, []);





  return (
    <DashboardLayout>

        {loading && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", margin: "0.5rem" }}>
                    <PulseLoader 
                      color="#0388fc"
                      loading={loading}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
            )}


    <MDBox py={4} px={2}>
      {/* Welcome Section */}
      <MDBox mb={4} textAlign="center">
        <MDTypography variant="h3" fontWeight="bold" color="info">
          👋 Welcome, Organizer!
        </MDTypography>
        <MDTypography variant="subtitle1" color="text" mt={1}>
          Manage your events, track registrations and grow your community.
        </MDTypography>
      </MDBox>

      {/* Stats Section */}
      <Grid container spacing={3}>
        {[
          { icon: <EventIcon />, label: "Total Events", value: totalEvents, color: "primary" },
          { icon: <CalendarTodayIcon />, label: "Upcoming Events", value: upcomingEventsCount, color: "info" },
          { icon: <GroupIcon />, label: "Booked Tkt in Latest Event", value: totalTicketsBookedInLatestEvent, color: "success" },
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i}>
            <MotionCard
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                boxShadow: 4,
                borderRadius: "2xl",
                cursor: "pointer",
              }}
            >
              <Avatar sx={{ bgcolor: `${item.color}.main`, mr: 2 }}>{item.icon}</Avatar>
              <div>
                <MDTypography variant="h6" color="text">{item.label}</MDTypography>
                <MDTypography variant="h4" fontWeight="bold">{item.value}</MDTypography>
              </div>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* CTA + Events */}
      <MDBox mt={5} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h5" fontWeight="medium">
          📅 Recent Events
        </MDTypography>
        <Button
          variant="contained"
          color="info"
          size="medium"
          startIcon={<AddIcon />}
          sx={{ borderRadius: "xl", px: 3, py: 1 }}
          onClick={() => navigate("/organizer/view-events")}      >
          View All Events
        </Button>
      </MDBox>

      {/* Recent Events List */}
      <Card sx={{ mt: 2, p: 3, boxShadow: 3 }}>
        {Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, idx) => (
            <MDBox key={event._id || idx} mb={2}>
              <MDTypography variant="h6" fontWeight="medium" display="flex" alignItems="center">
                <EmojiEventsIcon fontSize="small" color="warning" sx={{ mr: 1 }} />
                {event.name}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                📅 {new Date(event.date).toLocaleDateString("en-GB")} | 📍 {event.location}
              </MDTypography>
              {idx < upcomingEvents.length - 1 && <Divider sx={{ my: 2 }} />}
            </MDBox>
          ))
        ) : (
          <MDTypography variant="body1" color="text" textAlign="center">
            No upcoming events found.
          </MDTypography>
        )}
      </Card>

    </MDBox>
    </DashboardLayout>
  );
}

export default OrganizerHome;
