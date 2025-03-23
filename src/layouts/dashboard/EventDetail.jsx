import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import baseURL from "baseurl";
import { useParams } from "react-router-dom";
import { MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBIcon, MDBBtn } from "mdb-react-ui-kit";
import { MDBRow, MDBCol } from "mdb-react-ui-kit";

import { useNavigate } from "react-router-dom";
import { Modal, Box, Typography, Button, FormControl, Select, MenuItem, Divider } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PulseLoader  from "react-spinners/PulseLoader";



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
    handleCloseModal(false);
    navigate("/checkout", {
      state: {
      eventId: eventId, 
      eventName: event.name,
      location: event.location,
      time: event.time,
      ticketPrice: (event.price * (100 - event.discount)) / 100, // Price per ticket
      quantity: ticketQuantity,
      loggedInUserId: loggedInUserId, // Pass logged-in user ID
      totalPrice: ticketQuantity*((event.price * (100 - event.discount)) / 100), // Pass total price
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
        setLoading(false);
        setEvent(response.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (!event) {
    return  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem",  height: "100vh" }}>
        <PulseLoader 
          color="#0388fc"
          loading={loading}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>

  }

  return (
    <DashboardLayout>
      <MDBContainer fluid>
        <MDBCard className="shadow-0 border rounded-3 mt-5 p-4" style={{ boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" }}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="12" lg="6" className="mb-4 mb-lg-0">
                <MDBCardImage
                   src={event.eventPhoto || "https://www.adobe.com/content/dam/www/us/en/events/overview-page/eventshub_evergreen_opengraph_1200x630_2x.jpg"}
                  fluid
                  className="w-100 rounded-3 shadow-lg"
                  
                  style={{ transition: "transform 0.3s ease-in-out", cursor: "pointer", maxHeight: "27.5rem", maxWidth: "28.3rem" }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                />
              </MDBCol>

              <MDBCol md="12" lg="6">
                <h5 className="text-primary">{event.name}</h5>
                
                <MDTypography variant="body2" className="mb-2 text-muted">
                  <MDBIcon fas icon="map-marker-alt" className="me-2" />
                  <strong>Location:</strong> {event.location}
                </MDTypography>
                
                <MDTypography variant="body2" className="mb-2 text-muted">
                  <MDBIcon fas icon="calendar-alt" className="me-2" />
                  <strong>Date:</strong>  {new Date(event.date).toLocaleDateString("en-GB")}
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

                <MDTypography variant="body2" className="mb-2 text-warning">
                  <MDBIcon fas icon="user-check" className="me-2" />
                  <strong>Seats Left:</strong> {event.totalSeats - event.bookedSeats}
                </MDTypography>

                <MDTypography variant="body2" className="mb-2 text-success">
  <MDBIcon fas icon="rupee-sign" className="me-2" /> 
  <strong>Price:</strong> ₹ {(event.price * (100 - event.discount)) / 100}
</MDTypography>


                <p className="text-muted mb-4">{event.description}</p>

              
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      
      <div className="d-flex justify-content-end mt-4">
            <MDBBtn
            color="success"
            size="lg"
            className="rounded-pill"
            style={{
              boxShadow: "0 8px 16px rgba(0, 128, 0, 0.2)",
              width: "auto",
              marginRight: "3rem",
            }}
            onClick={handleOpenModal}
          >
            Book Ticket
      </MDBBtn>
</div>

          {/* Book ticket modal */}

<Modal open={showModal} onClose={handleCloseModal}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "450px",
            backgroundColor: "#fff",
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)",
            padding: "24px",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "16px",
              color: "#2c3e50",
            }}
          >
            <EventAvailableIcon
              style={{
                color: "#4caf50",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            Book Tickets
          </Typography>
          <Divider style={{ marginBottom: "16px" }} />
          <Typography style={{ marginBottom: "8px" }}>
            <strong>Event:</strong> {event.name}
          </Typography>
          <Typography style={{ marginBottom: "8px" }}>
            <strong>Location:</strong> {event.location}
          </Typography>
          <Typography style={{ marginBottom: "8px" }}>
            <strong>Time:</strong> {event.time}
          </Typography>
          <Typography style={{ marginBottom: "16px" }}>
            <strong>Ticket Price:</strong> ₹{" "}
            {(event.price * (100 - event.discount)) / 100}
          </Typography>
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
            <Typography>
              <strong>Select Number of Tickets:</strong>
            </Typography>
            <Select
              value={ticketQuantity}
              onChange={(e) => setTicketQuantity(e.target.value)}
              style={{
                marginTop: "8px",
                padding: "8px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {[1, 2, 3, 4, 5].map((qty) => (
                <MenuItem key={qty} value={qty}>
                  {qty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#4caf50",
              marginBottom: "16px",
            }}
          >
            Total Price: ₹{" "}
            {Math.floor((event.price * (100 - event.discount)) / 100 * ticketQuantity)}
          </Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "16px",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseModal}
              style={{
                borderRadius: "25px",
                padding: "10px 20px",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProceedToCheckout}
              style={{
                borderRadius: "25px",
                padding: "10px 20px",
                fontWeight: "bold",
                textTransform: "none",
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
