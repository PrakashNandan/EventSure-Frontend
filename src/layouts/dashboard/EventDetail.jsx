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

function EventDetails() {

  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <MDBContainer fluid>
        <MDBCard className="shadow-0 border rounded-3 mt-5 p-4" style={{ boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" }}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="12" lg="6" className="mb-4 mb-lg-0">
                <MDBCardImage
                  src={event.imageUrl || "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/img%20(4).webp"}
                  fluid
                  className="w-100 rounded-3 shadow-lg"
                  style={{ transition: "transform 0.3s ease-in-out", cursor: "pointer" }}
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
                  <strong>Date:</strong> {event.date}
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
  <strong>Price:</strong> Rs. {(event.price * (100 - event.discount)) / 100}
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
  >
    Book Ticket
  </MDBBtn>
</div>



    </DashboardLayout>
  );
}

export default EventDetails;
