import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Grid,
  Avatar,
  Typography,
  Button,
  Pagination,
  CircularProgress,
  Divider,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import baseURL from "baseurl";
import { blue } from "@mui/material/colors";

const MotionCard = motion(Card);

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const limit = 6;

  const fetchEvents = async (page) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseURL}/admin/getAllEvents?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setEvents(data.events);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  const openModal = async (id) => {
    try {
      const { data } = await axios.get(`${baseURL}/event/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setSelectedEvent({ ...data, _id: id });
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching event details", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/admin/deleteEvent/${selectedEvent._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setModalOpen(false);
      setDeleteDialogOpen(false);
      fetchEvents(page);
    } catch (err) {
      console.error("Error deleting event", err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4} px={2}>
       <Typography
        variant="h3"
        fontWeight="bold"
        color={"#377df0"}
        // sx={{ color: blue[300] }} // MUI's sky blue-ish shade
        gutterBottom
        >
        All Events
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <MDBox display="flex" justifyContent="center">
            <CircularProgress color="info" />
          </MDBox>
        ) : (
          <>
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
                  <MotionCard
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background:
                        "linear-gradient(135deg, #dbe9f4 0%, #cfe0f9 100%)",
                      color: "#1a237e",
                      boxShadow: "0 8px 20px rgba(30,60,114,0.2)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#fff",
                        color: "#1e3c72",
                        width: 56,
                        height: 56,
                        mb: 2,
                      }}
                    >
                      <EventIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {event.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {event.description.length > 70
                        ? event.description.slice(0, 70) + "..."
                        : event.description}
                    </Typography>
                    <Typography variant="body2">
                      <LocationOnIcon fontSize="small" /> {event.location}
                    </Typography>
                    <Typography variant="body2">
                      <ScheduleIcon fontSize="small" /> {new Date(event.date).toLocaleDateString("en-GB")} | {event.time}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      👤 Organizer: {event.createdBy?.name || "Unknown"}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      sx={{ mt: 2, alignSelf: "flex-end" }}
                      onClick={() => openModal(event._id)}
                    >
                      View
                    </Button>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>

            <MDBox display="flex" justifyContent="center" mt={4}>
             
            <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            size="large"
            sx={{
                "& .MuiPaginationItem-root": {
                color: blue[300],                 // Text color
                borderColor: blue[300],           // Border color
                },
                "& .Mui-selected": {
                backgroundColor: blue[300],       // Selected background
                color: "#fff",                    // Selected text
                "&:hover": {
                    backgroundColor: blue[400],     // Hover for selected
                },
                },
            }}
            />
            </MDBox>
          </>
        )}
      </MDBox>

      {/* Event Detail Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <MDBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#ffffff",
            borderRadius: 3,
            boxShadow: 24,
            width: 450,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <MDBox
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              🎛 Event Details
            </Typography>
            <IconButton onClick={() => setModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </MDBox>

          <MDBox px={3} py={2}>
            {selectedEvent?.eventPhoto && (
              <MDBox display="flex" justifyContent="center" mb={2}>
                <img
                  src={selectedEvent.eventPhoto}
                  alt="Event Thumbnail"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: 12,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </MDBox>
            )}
            <Typography mb={1}><strong>Name:</strong> <span style={{ color: "#1e88e5" }}>{selectedEvent?.name}</span></Typography>
            <Typography mb={1}><strong>Description:</strong> <span style={{ color: "#37474f" }}>{selectedEvent?.description}</span></Typography>
            <Typography mb={1}><strong>Date:</strong> <span style={{ color: "#1e88e5" }}>{new Date(selectedEvent?.date).toLocaleDateString()}</span></Typography>
            <Typography mb={1}><strong>Time:</strong> <span style={{ color: "#1e88e5" }}>{selectedEvent?.time}</span></Typography>
            <Typography mb={1}><strong>Location:</strong> <span style={{ color: "#4caf50" }}>{selectedEvent?.location}</span></Typography>
            <Typography mb={1}><strong>Price:</strong> ₹{selectedEvent?.price} <small style={{ color: "#f44336" }}>({selectedEvent?.discount}% off)</small></Typography>
            <Typography mb={1}><strong>Discounted Price:</strong> <span style={{ color: "#e91e63", fontWeight: 500 }}>₹{selectedEvent?.discountedPrice}</span></Typography>
            <Typography mb={1}><strong>Seats:</strong> {selectedEvent?.availableSeats} available / {selectedEvent?.totalSeats}</Typography>
            <Typography mb={2}><strong>Organizer:</strong> <span style={{ fontStyle: "italic" }}>{selectedEvent?.organizerName || "N/A"}</span></Typography>

            <MDBox display="flex" justifyContent="flex-end">
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  bgcolor: "#ffebee",
                  color: "#d32f2f",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#ffcdd2",
                  },
                }}
              >
                Delete Event
              </Button>
            </MDBox>
          </MDBox>
        </MDBox>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
                backgroundColor: "#f28b82", // light red
                color: "#fff",
                "&:hover": {
                backgroundColor: "#e57373", // slightly darker on hover
                },
            }}
            >
            Delete
            </Button>

        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AllEventsPage;
