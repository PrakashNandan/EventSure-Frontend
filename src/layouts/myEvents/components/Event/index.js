import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box, TextField, Button } from "@mui/material";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import axios from "axios";
import baseURL from "baseurl";



function Event({ eventId, name, organizerName, location, price, discount, date, time, setFetchAgain }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [open, setOpen] = useState(false); // State for modal visibility
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    name,
    organizerName,
    location,
    price,
    discount,
    date,
    time,
  });

  const handleDeleteConfirmationOpen = () => {
    setConfirmationOpen(true); // Open the confirmation modal
  };

  const handleDeleteConfirmationClose = () => {
    setConfirmationOpen(false); // Close the confirmation modal
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateNotification = async () => {  

      try{
        const res = await axios.post(`${baseURL}/notification/create`, {
          type: "update",
          message: `Event ${name} has been updated`,
          eventId: eventId
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (res.status === 201) {
          console.log("Notification created successfully");
          console.log(res.data);
        }
      }
      catch (error) {
        console.error("Error creating notification:", error);
      }
  }

  const handleDeleteNotification  = async () => {


    try{
      const res = await axios.post(`${baseURL}/notification/create`, {
        type: "delete",
        message: `Event ${name} has been Cancelled`,
        eventId: eventId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (res.status === 201) {
        console.log("Notification created successfully");
        console.log(res.data);
      }
    }
    catch (error) {
      console.error("Error creating notification:", error);
    }


  }

  const handleUpdateSubmit = async () => {
    try {
      const res = await axios.patch(`${baseURL}/event/${eventId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (res.status === 200) {
        console.log("Event updated successfully");
        setFetchAgain(true); // Notify parent about the update
        handleClose();
        handleCreateNotification();
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${baseURL}/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (res.status === 200) {
        console.log("Event deleted successfully");
          handleDeleteNotification();
         setFetchAgain(true)// Notify parent about the deletion
        setConfirmationOpen(false); // Close the confirmation modal
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={darkMode ? "transparent" : "grey-200"}
      borderRadius="lg"

      p={3}
      mt={2}
    >
      <MDBox width="100%" display="flex" flexDirection="column">
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
            {name}
          </MDTypography>

          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton variant="text" color="error" onClick={handleDeleteConfirmationOpen}>
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
            <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={handleOpen}>
              <Icon>edit</Icon>&nbsp;edit
            </MDButton>
          </MDBox>
        </MDBox>

        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Organizer:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
              {organizerName}
            </MDTypography>
          </MDTypography>
        </MDBox>

        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Location:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {location}
            </MDTypography>
          </MDTypography>
        </MDBox>

        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Price:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {price}
            </MDTypography>
          </MDTypography>
        </MDBox>

        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Discount:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {discount}
            </MDTypography>
          </MDTypography>
        </MDBox>

        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {date}
            </MDTypography>
          </MDTypography>
        </MDBox>

        <MDTypography variant="caption" color="text">
          Time:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <MDTypography variant="caption" fontWeight="medium">
            {time}
          </MDTypography>
        </MDTypography>
      </MDBox>

      {/* Confirmation Modal */}
      <Modal open={confirmationOpen} onClose={handleDeleteConfirmationClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            width: "400px",
          }}
        >
          <MDTypography variant="h6" fontWeight="medium" mb={2}>
            Are you sure you want to delete this event?
          </MDTypography>
          <Box display="flex" justifyContent="space-between">
          <Button 
            variant="container" 
            onClick={handleDelete} 
            sx={{ backgroundColor: "#ba2037", '&:hover': { backgroundColor: "#e53935" } }}
          >
            Yes, Delete
          </Button>

            <Button variant="contained" color="error" onClick={handleDeleteConfirmationClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal for editing the event details */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            width: "400px",
          }}
        >
          <MDTypography variant="h6" fontWeight="medium" mb={2}>
            Edit Event Details
          </MDTypography>

          {/* Form Fields */}
          <TextField
            label="Event Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Organizer"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
            value={formData.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Discount"
            name="discount"
            value={formData.discount}
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
            value={formData.time}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Submit Button */}
          <Button variant="contained" color="primary" onClick={handleUpdateSubmit} fullWidth sx={{ mt: 2 }}>
            Update Event
          </Button>
        </Box>
      </Modal>
    </MDBox>
  );
}

Event.propTypes = {
  name: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  organizerName: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  discount: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  setFetchAgain: PropTypes.func.isRequired,
};

export default Event;
