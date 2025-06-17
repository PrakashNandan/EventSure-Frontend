// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";

// React + Axios
import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "baseurl";

// Animations
import { motion } from "framer-motion";

function Overview() {
  const token = localStorage.getItem("authToken");

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/auth/getUserDetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails(response.data.user);
      } catch (error) {
        console.error("Profile fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={3} justifyContent="center">
            {loading ? (
              <CircularProgress color="info" />
            ) : userDetails ? (
              <Grid item xs={12} md={10} lg={8}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: "#f9f9f9",
                      borderRadius: 4,
                      boxShadow: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Avatar
                          src={userDetails.avatar || ""}
                          alt={userDetails.name}
                          sx={{
                            width: 100,
                            height: 100,
                            mx: "auto",
                            border: "3px solid #fff",
                            boxShadow: 2,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={9}>
                        <ProfileInfoCard
                          title={
                            <MDTypography variant="h5" fontWeight="bold" color="dark">
                              Profile Overview
                            </MDTypography>
                          }
                          description={
                           `Hi, I'm ${userDetails.name || "User"}. Welcome to profile page!`
                            
                          }
                          info={{
                            "Full Name": userDetails.name || "N/A",
                            Role: userDetails.role || "N/A",
                            Email: userDetails.email || "N/A",
                            Location: userDetails.address || "N/A",
                          }}
                          social={[
                            {
                              link: userDetails.facebook || "#",
                              icon: <FacebookIcon />,
                              color: "facebook",
                            },
                            {
                              link: userDetails.twitter || "#",
                              icon: <TwitterIcon />,
                              color: "twitter",
                            },
                            {
                              link: userDetails.instagram || "#",
                              icon: <InstagramIcon />,
                              color: "instagram",
                            },
                          ]}
                          action={{ route: "", tooltip: "Edit Profile" }}
                          shadow
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </motion.div>
              </Grid>
            ) : (
              <MDTypography color="error">Failed to load user details.</MDTypography>
            )}
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
