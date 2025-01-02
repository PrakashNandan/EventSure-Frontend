/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import React, { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "baseurl";
import "./dashboard.css";


import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBRipple,
  MDBBtn,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBSelect,
  MDBSelectOption,
  MDBSelectInput
} from "mdb-react-ui-kit";

function Dashboard() {

  const [page_number, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10); // Number of items per page
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [currentPage, setCurrentPage] = useState(1);  

  useEffect( () => {
    console.log("useEffect");
    console.log(localStorage.getItem("authToken"));

    const fetchData = async () => {
      try {
        const {data} = await axios.get(`${baseURL}/event?page_number=${page_number}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setEvents(data.events);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        console.log("Total Pages: ", data.totalPages);
      } catch (error) { 
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();

  }, [page_number, limit]);

   // Handle next page
   const handleNextPage = () => {
    if (page_number < totalPages) {
      setPageNumber(prevPage => prevPage + 1);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (page_number > 1) {
      setPageNumber(prevPage => prevPage - 1);
    }
  };

  // Handle limit change
  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setPageNumber(1); // Reset to page 1 when limit changes
  };


 

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBContainer fluid>

      {events && events.map((event, index) => (
           <MDBRow style={{ marginBottom: '-1.7rem' }}className="justify-content-center " key={index}>
           <MDBCol md="12" xl="10">
             <MDBCard className="shadow-0 border rounded-3 mt-5 mb-3">
               <MDBCardBody>
                 <MDBRow>
                   <MDBCol md="12" lg="3" className="mb-4 mb-lg-0">
                     <MDBRipple
                       rippleColor="light"
                       rippleTag="div"
                       className="bg-image rounded hover-zoom hover-overlay"
                     >
                       <MDBCardImage
                         src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/img%20(4).webp"
                         fluid
                         className="w-100"
                       />
                       <a href="#!">
                         <div
                           className="mask"
                           style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                         ></div>
                       </a>
                     </MDBRipple>
                   </MDBCol>
                   <MDBCol md="6">
  <h5>{event.name}</h5>
  <div className="d-flex flex-row align-items-center">
    <div className="text-danger mb-1 me-2">
      <MDBIcon fas icon="star" />
      <MDBIcon fas icon="star" />
      <MDBIcon fas icon="star" />
      <MDBIcon fas icon="star" />
    </div>
    <span className="rating-count">310</span>
  </div>
  <h6 className="mb-1">
    <MDBIcon fas icon="map-marker-alt" className="me-2 text-black" />
    <strong>Location:</strong> {event.location}
  </h6>
  <h6 className="mb-1">
    <MDBIcon fas icon="calendar-alt" className="me-2 text-black" />
    <strong>Date:</strong> {event.date}
  </h6>
  <h6 className="mb-1">
    <MDBIcon fas icon="clock" className="me-2 text-black" />
    <strong>Time:</strong> {event.time}
  </h6>
  {/* Uncomment this section if event descriptions are needed */}
  {/* <p className="text mb-4 mb-md-0">
    {event.description}
  </p> */}
</MDBCol>


                   <MDBCol
                     md="6"
                     lg="3"
                     className="border-sm-start-none border-start"
                   >
                     <div className="d-flex flex-row align-items-center mb-1">
                       <h4 className="mb-1 me-1">Rs. {(event.price * (100 - event.discount)) / 100}</h4>
                       <span className="text-danger">
                         <s>{event.price}</s>
                       </span>
                     </div>
                     <h6 className="text-success">Free shipping</h6>
                     <div className="d-flex flex-column mt-4">
                       <MDBBtn color="primary" size="sm">
                         Details
                       </MDBBtn>
                       <MDBBtn outline color="primary" size="sm" className="mt-2">
                         Add to wish list
                       </MDBBtn>
                     </div>
                   </MDBCol>
                 </MDBRow>
               </MDBCardBody>
             </MDBCard>
           </MDBCol>
         </MDBRow>
      ))
    }
        
  
    </MDBContainer>

    <MDBRow className="pagination-container">
  <MDBCol md="auto" className="limit-input">
    <span className="me-2" style={{ fontSize: "16px", fontWeight: "500" }}>Limit:</span>
    <input
      type="number"
      min="1"
      value={limit}
      onChange={(e) => setLimit(Number(e.target.value))}
      className="form-control w-auto"
      style={{
        maxWidth: "100px",
        fontSize: "14px",
        padding: "6px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
      }}
    />
  </MDBCol>

  <MDBCol className="pagination">
    <MDBPagination>
      <MDBPaginationItem disabled={page_number === 1} className="pagination-item">
        <MDBPaginationLink
          onClick={handlePreviousPage}
          className="pagination-link"
        >
          Previous
        </MDBPaginationLink>
      </MDBPaginationItem>
      
      {/* Current Page Display */}
      <MDBPaginationItem className="pagination-item">
        <span className="current-page">
          {page_number}
        </span>
      </MDBPaginationItem>

      <MDBPaginationItem disabled={page_number === totalPages} className="pagination-item">
        <MDBPaginationLink
          onClick={handleNextPage}
          className="pagination-link"
        >
          Next
        </MDBPaginationLink>
      </MDBPaginationItem>
    </MDBPagination>
  </MDBCol>
</MDBRow>

    </DashboardLayout>

    
  );
}

export default Dashboard;
