import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "baseurl";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import PulseLoader  from "react-spinners/PulseLoader";


function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${baseURL}/ticket`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setLoading(false);
        setTickets(data.tickets);
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleMenuOpen = (event, ticketId, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicketId(ticketId);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTicketId(null);
  };

  const handleEventDetail = () => {
    if (selectedEventId) {
        // window.location.href = `/event-detail/${selectedEventId}`;
        navigate(`/event-detail/${selectedEventId}`);
    }
    handleMenuClose();
  };

  const handleCancelTicket = async () => {
    try {
      const res = await axios.delete(`${baseURL}/ticket/${selectedTicketId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
     

      if(res.status === 200) {
          alert(`${res.data.message}`);
          setTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== selectedTicketId));
      }
      else{
          alert( `${res.data.message}`);
      }
      
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      alert("Error cancelling ticket. Please try again.");
    }
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Tickets
                </MDTypography>
              </MDBox>

              <MDBTable align="middle">
                <MDBTableHead>
                  <tr>
                    <th scope="col" style={{ paddingLeft: "2.45rem" }}>Event</th>
                    <th scope="col">Location</th>
                    <th scope="col">Booking Date</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </MDBTableHead>

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


                <MDBTableBody>
                  {tickets.map((ticket, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ paddingLeft: "2rem" }}>
                          <p className="fw-bold mb-1">{ticket.eventId?.name || "No Event"}</p>
                          <p className="text-muted mb-0">
                            {ticket.eventId?.date ? formatDate(ticket.eventId.date) : "No Date"}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p className="fw-normal mb-1">
                          {ticket.eventId?.location || "No Location"}
                        </p>
                      </td>
                      <td>{formatDate(ticket.createdAt)}</td>
                      <td>{ticket.quantity || "N/A"}</td>
                      <td>
                        <MDBBadge color={ticket.status === "confirmed" ? "success" : "danger"} pill>
                          {ticket.status || "Unknown Status"}
                        </MDBBadge>
                      </td>
                      <td>
                        <button
                          onClick={(event) => handleMenuOpen(event, ticket._id, ticket?.eventId?._id)}
                          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
                        >
                          Action
                        </button>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>

              


            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
        <MenuItem onClick={handleEventDetail}>Event Detail</MenuItem>
        <MenuItem onClick={handleCancelTicket}>Cancel Ticket</MenuItem>
      </Menu>
    </DashboardLayout>
  );
}

export default Tickets;
