import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Grid,
  Avatar,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";

import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import baseURL from "baseurl";

const MotionCard = motion(Card);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalUpcomingEvents: 0,
    totalTickets: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/admin/getAllDetails`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: <GroupIcon style={{ color: "#2196f3", fontSize: 32 }} />,
      label: "Total Users",
      value: stats.totalUsers,
      bgColor: "linear-gradient(135deg, #2193b0, #6dd5ed)",
    },
    {
      icon: <EventIcon style={{ color: "#9c27b0", fontSize: 32 }} />,
      label: "Total Events",
      value: stats.totalEvents,
      bgColor: "linear-gradient(135deg, #8e2de2, #4a00e0)",
    },
    {
      icon: <CalendarTodayIcon style={{ color: "#43a047", fontSize: 32 }} />,
      label: "Upcoming Events",
      value: stats.totalUpcomingEvents,
      bgColor: "linear-gradient(135deg, #56ab2f, #a8e063)",
    },
    {
      icon: <ConfirmationNumberIcon style={{ color: "#f9a825", fontSize: 32 }} />,
      label: "Tickets Booked",
      value: stats.totalTickets,
      bgColor: "linear-gradient(135deg, #f7971e, #ffd200)",
    },
    {
      icon: <AttachMoneyIcon style={{ color: "#ef5350", fontSize: 32 }} />,
      label: "Total Revenue",
      value: `₹ ${stats.totalRevenue}`,
      bgColor: "linear-gradient(135deg, #ff416c, #ff4b2b)",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4} px={2}>
        <MDTypography
            variant="h3"
            fontWeight="bold"
            sx={{ color: "#377df0", mb: 1 }}
            >
            Admin Dashboard
        </MDTypography>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {statCards.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    background: item.bgColor,
                    color: "white",
                    p: 3,
                    boxShadow: 5,
                    borderRadius: 4,
                    minHeight: 120,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "white",
                      width: 64,
                      height: 64,
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <div>
                    <MDTypography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                      {item.label}
                    </MDTypography>
                    <MDTypography variant="h4" fontWeight="bold" color="white">
                      {item.value}
                    </MDTypography>
                  </div>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        )}
      </MDBox>
    </DashboardLayout>
  );
};

export default AdminDashboard;
