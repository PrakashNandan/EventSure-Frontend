import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { red, green, lightBlue } from "@mui/material/colors";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import baseURL from "baseurl";

const AllOrganizersPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/admin/getAllEventOrganizers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setOrganizers(data.organizers);
    } catch (err) {
      console.error("Error fetching organizers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (organizerId, isBanned) => {
    try {
      const url = isBanned
        ? `${baseURL}/admin/unbanOrganizer/${organizerId}`
        : `${baseURL}/admin/banOrganizer/${organizerId}`;
      await axios.put(url, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      fetchOrganizers();
    } catch (error) {
      console.error("Error updating ban status", error);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4} px={2}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(to right, #377df0, #81d4fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
          }}
        >
         Event Organizers
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <MDBox display="flex" justifyContent="center">
            <CircularProgress color="info" />
          </MDBox>
        ) : (
          <Grid container spacing={3}>
            {organizers.map((org) => (
              <Grid item xs={12} sm={6} md={4} key={org._id}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                    boxShadow: "0 8px 20px rgba(33,150,243,0.2)",
                    height: "100%",
                    transition: "transform 0.3s",
                    '&:hover': {
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: "#fff",
                        color: "#039be5",
                        width: 56,
                        height: 56,
                        fontWeight: "bold",
                        border: "2px solid #039be5",
                        mr: 2,
                      }}
                    >
                      {org.name[0].toUpperCase()}
                    </Avatar>
                    <div>
                      <Typography fontWeight="bold" fontSize="1.2rem">
                        {org.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {org.email}
                      </Typography>
                    </div>
                  </MDBox>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    📍 <strong>Address:</strong> {org.address || "N/A"}
                  </Typography>

                  <Chip
                    label={org.isBanned ? "Banned" : "Active"}
                    color={org.isBanned ? "error" : "success"}
                    icon={org.isBanned ? <BlockIcon /> : <CheckCircleIcon />} 
                    sx={{ mb: 2 }}
                  />

                  <Button
                    variant="outlined"
                    color={org.isBanned ? "success" : "error"}
                    onClick={() => handleBanToggle(org._id, org.isBanned)}
                    sx={{
                      color: org.isBanned ? green[700] : red[700],
                      borderColor: org.isBanned ? green[400] : red[300],
                      fontWeight: "bold",
                      borderRadius: 2,
                      backgroundColor: org.isBanned ? green[50] : red[50],
                      '&:hover': {
                        backgroundColor: org.isBanned ? green[100] : red[100],
                      },
                    }}
                  >
                    {org.isBanned ? "Unban" : "Ban"}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </MDBox>
    </DashboardLayout>
  );
};

export default AllOrganizersPage;
