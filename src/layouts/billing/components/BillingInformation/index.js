import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import { Modal, Box, TextField, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Bill from "layouts/billing/components/Bill";
import baseURL from "baseurl";

function BillingInformation() {
  const [events, setEvents] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    discount: "",
    totalSeats: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/event/create`,
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Event created successfully!");
        setFetchAgain(true);
        handleClose();
        setFormData({
          name: "",
          description: "",
          date: "",
          time: "",
          location: "",
          price: "",
          discount: "",
          totalSeats: "",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/event/getorgevents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchData();
    setFetchAgain(false);
  }, [fetchAgain]);

  return (
    <>
      <MDBox style={{ padding: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "30px",
            backgroundColor: "#1E90FF",
            color: "#fff",
            textTransform: "capitalize",
            boxShadow: "0 4px 6px rgba(30, 144, 255, 0.4)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4682B4")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1E90FF")}
          onClick={handleOpen}
        >
          Create an Event
        </Button>
      </MDBox>
      <Card id="delete-account">
        <MDBox pt={3} px={2}>
          <MDTypography variant="h6" fontWeight="medium">
            My Events
          </MDTypography>
        </MDBox>
        <MDBox pt={1} pb={2} px={2}>
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {events &&
              events.map((event) => (
                <Bill
                  key={event._id}
                  eventId={event._id}
                  name={event.name}
                  organizerName={event.organizerName}
                  location={event.location}
                  price={event.price}
                  discount={event.discount}
                  date={event.date}
                  time={event.time}
                  setFetchAgain={setFetchAgain}
                />
              ))}
          </MDBox>
        </MDBox>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: "8px",
          }}
        >
          <MDTypography variant="h6" mb={2}>
            Create Event
          </MDTypography>
          <form>
            <TextField
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Discount"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Total Seats"
              name="totalSeats"
              type="number"
              value={formData.totalSeats}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px" }}
              onClick={handleSubmit}
            >
              Create
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default BillingInformation;
