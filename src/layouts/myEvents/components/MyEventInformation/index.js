import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import { Modal, Box, TextField, Button,CircularProgress } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Event from "layouts/myEvents/components/Event";
import baseURL from "baseurl";
import { Grid } from "@mui/material";
import toast, { Toaster } from 'react-hot-toast';
import PulseLoader  from "react-spinners/PulseLoader";

function MyEventInformation() {
  const [events, setEvents] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    discount: "",
    totalSeats: "",
    eventPhoto:null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const validateForm = () => {
    if (!formData.name || !formData.date || !formData.time || !formData.location) {
      alert("Please fill all the required fields.");
      return false;
    }
    if (formData.eventPhoto && !formData.eventPhoto.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return false;
    }
    return true;
  };
  
  const handleSubmit = async () => {

    if (!validateForm()) {
      return;
    }

    try {

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      setLoading(true);

      const response = await axios.post(
        `${baseURL}/event/create`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
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
          eventPhoto:null,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/event/getorgevents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        console.log("Fetched events:", response.data.events);
        setLoading(false);
        setEvents(response.data.events);
      } catch (error) {
        setLoading(false);
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


            {events &&
              events.map((event) => (
                <Event
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
      p: 3,
      borderRadius: "12px",
    }}
  >
    <MDTypography
      variant="h6"
      mb={3}
      sx={{ textAlign: "center", fontWeight: "bold" }}
    >
      Create Event
    </MDTypography>

    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Event Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: new Date().toISOString().split("T")[0],
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Discount"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Total Seats"
            name="totalSeats"
            type="number"
            value={formData.totalSeats}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="file"
            name="eventPhoto"
            inputProps={{ accept: "image/*" }}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                eventPhoto: e.target.files[0],
              }))
            }
            fullWidth
            margin="dense"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "8px",
              height: "40px",
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#1976d2" }} /> // Blue spinner
            ) : (
              "Create"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>

    {loading && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(173, 216, 230, 0.4)", // Light blue overlay
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
        }}
      >
        <CircularProgress sx={{ color: "#1976d2" }} /> {/* Blue spinner */}
      </Box>
    )}
  </Box>
</Modal>


          <Toaster position="top-right"
  reverseOrder={false}/>
    </>
  );
}

export default MyEventInformation;
