// Import necessary libraries and components
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import CoverLayout from "layouts/authentication/components/CoverLayout";

import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import baseURL from "baseurl";
import toast, { Toaster } from 'react-hot-toast';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";


function Cover() {
  // State to store form data and errors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    pincode: "",
    password: "",
    role:'user', // Default role for sign-up
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseURL}/auth/signup`, {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        pincode: formData.pincode,
        password: formData.password,
        role: formData.role,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Sign-UP Successfully done');
        // Redirect to sign-in page
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={1}
          mt={-11}
          p={3}
          mb={-1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={0}>
            SIGN-UP
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details below
          </MDTypography>
        </MDBox>
        <MDBox pt={3} pb={2} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={1}>
              <MDInput
                type="text"
                label="Name"
                name="name"
                variant="standard"
                fullWidth
                value={formData.name}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="email"
                variant="standard"
                fullWidth
                value={formData.email}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Address"
                name="address"
                variant="standard"
                fullWidth
                value={formData.address}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Pincode"
                name="pincode"
                variant="standard"
                fullWidth
                value={formData.pincode}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                variant="standard"
                fullWidth
                value={formData.password}
                onChange={handleChange}
              />
            </MDBox>
           <MDBox mb={2}>
            <FormControl fullWidth variant="standard">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                {['user', 'organizer'].map((role) => (
                  <MenuItem
                    key={role}
                    value={role}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#e3f2fd', // light blue
                        color: '#1565c0',           // darker blue text
                      },
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </MDBox>        


              {error && (
              <MDTypography color="error" variant="caption" display="block" mt={1}>
                {error}
              </MDTypography>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Sign Up
              </MDButton>
            </MDBox>
            <MDBox mt={1} mb={0} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <Toaster 
      position="top-right"
      reverseOrder={false}/>
    </CoverLayout>
  );
}

export default Cover;
