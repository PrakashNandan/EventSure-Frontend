// Imports remain unchanged
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import baseURL from "baseurl";
import { useParams, useNavigate } from "react-router-dom";
import { MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBIcon, MDBBtn, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { Modal, Box, Typography, Button, FormControl, Select, MenuItem, Divider } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PulseLoader from "react-spinners/PulseLoader";

function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem("userId");

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleProceedToCheckout = () => {
    handleCloseModal();
    navigate("/checkout", {
      state: {
        eventId,
        eventName: event.name,
        location: event.location,
        time: event.time,
        ticketPrice: (event.price * (100 - event.discount)) / 100,
        quantity: ticketQuantity,
        loggedInUserId,
        totalPrice: ticketQuantity * ((event.price * (100 - event.discount)) / 100),
      },
    });
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading || !event) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <PulseLoader color="#0388fc" loading={true} size={20} />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <MDBContainer fluid>
        <MDBCard
          className="shadow-0 border rounded-4 mt-5 p-4"
          style={{
            backgroundColor: "#f9fafc",
            boxShadow: "0 10px 24px rgba(0,0,0,0.1)",
          }}
        >
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="12" lg="6" className="mb-4 mb-lg-0">
                <MDBCardImage
                  src={event.eventPhoto || "https://www.adobe.com/content/dam/www/us/en/events/overview-page/eventshub_evergreen_opengraph_1200x630_2x.jpg"}
                  fluid
                  className="w-100 rounded-3 shadow-lg"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    maxHeight: "27.5rem",
                    maxWidth: "28.3rem",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                />
              </MDBCol>

              <MDBCol md="12" lg="6">
                <h3 className="text-primary mb-3 fw-bold">{event.name}</h3>

                <MDTypography variant="body2" className="mb-2 text-muted">
                  <MDBIcon fas icon="map-marker-alt" className="me-2" />
                  <strong>Location:</strong> {event.location}
                </MDTypography>

                <MDTypography variant="body2" className="mb-2 text-muted">
                  <MDBIcon fas icon="calendar-alt" className="me-2" />
                  <strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-GB")}
                </MDTypography>

                <MDTypography variant="body2" className="mb-2 text-muted">
                  <MDBIcon fas icon="clock" className="me-2" />
                  <strong>Time:</strong> {event.time}
                </MDTypography>

                <MDTypography variant="body2" className="mb-2 text-muted">
                  <MDBIcon fas icon="user" className="me-2" />
                  <strong>Organizer:</strong> {event.organizerName}
                </MDTypography>

                <MDTypography variant="body2" className="mb-2 text-muted">
                  <MDBIcon fas icon="users" className="me-2" />
                  <strong>Total Seats:</strong> {event.totalSeats}
                </MDTypography>

                <MDTypography variant="body2" className="mb-2" sx={{ color: "black" }}>
                  <MDBIcon fas icon="user-check" className="me-2" />
                  <strong>Seats Left:</strong> {event.totalSeats - event.bookedSeats}
                </MDTypography>


                <MDTypography variant="body2" className="mb-3 text-success">
                  <MDBIcon fas icon="rupee-sign" className="me-2" />
                  <strong>Price:</strong> ₹ {(event.price * (100 - event.discount)) / 100}
                </MDTypography>

                <p className="text-muted mb-4">{event.description}</p>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
          <div className="d-flex justify-content-end mt-4">
          <MDBBtn
            color="success"
            size="lg"
            className="rounded-pill"
            style={{
              boxShadow: "0 8px 16px rgba(72, 239, 123, 0.3)",
              width: "auto",
              marginRight: "3rem",
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={handleOpenModal}
          >
            <MDBIcon fas icon="ticket-alt" className="me-2" />
            Book Ticket
          </MDBBtn>
        </div>
        </MDBCard>

        
      </MDBContainer>

  <Modal open={showModal} onClose={handleCloseModal}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: 480,
      bgcolor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(15px)",
      borderRadius: 4,
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
      p: 4,
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: "700",
        textAlign: "center",
        mb: 2,
        color: "#2e3c55",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <EventAvailableIcon sx={{ color: "#4caf50", mr: 1 }} />
      Reserve Your Spot
    </Typography>

    <Divider sx={{ mb: 3, borderColor: "#d0d0d0" }} />

    <Box sx={{ mb: 2, color: "#3e3e3e" }}>
      <Typography sx={{ mb: 1 }}>
        <strong>🎉 Event:</strong> {event.name}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        <strong>📍 Location:</strong> {event.location}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        <strong>🕒 Time:</strong> {event.time}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        <strong>🎫 Ticket Price:</strong>{" "}
        ₹ {(event.price * (100 - event.discount)) / 100}
      </Typography>
    </Box>

    <FormControl fullWidth sx={{ mt: 1 }}>
      <Typography fontWeight="600" gutterBottom color="text.primary">
        How many tickets would you like?
      </Typography>
      <Select
        value={ticketQuantity}
        onChange={(e) => setTicketQuantity(e.target.value)}
        sx={{
          borderRadius: 2,
          backgroundColor: "#f8f9fa",
          '&:hover': { backgroundColor: "#f0f0f0" },
        }}
      >
        {[1, 2, 3, 4, 5].map((qty) => (
          <MenuItem key={qty} value={qty}>
            {qty} {qty === 1 ? "ticket" : "tickets"}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Typography
      variant="h6"
      sx={{
        textAlign: "center",
        fontWeight: "bold",
        color: "#1e8449",
        mt: 3,
        mb: 2,
      }}
    >
      Total: ₹ {(event.price * (100 - event.discount)) / 100 * ticketQuantity}
    </Typography>

    <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
      <Button
        variant="outlined"
        color="error"
        onClick={handleCloseModal}
        sx={{
          borderRadius: 8,
          textTransform: "none",
          flex: 1,
          fontWeight: "600",
          borderColor: "#e57373",
          color: "#d32f2f",
          "&:hover": {
            borderColor: "#d32f2f",
            backgroundColor: "#ffebee",
          },
        }}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={handleProceedToCheckout}
        sx={{
          borderRadius: 8,
          textTransform: "none",
          flex: 1,
          fontWeight: "600",
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
      >
        Proceed to Checkout
      </Button>
    </Box>
  </Box>
</Modal>


    </DashboardLayout>
  );
}

export default EventDetails;
