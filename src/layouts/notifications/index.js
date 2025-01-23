import { useState, useEffect, use } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import baseURL from "baseurl";
import {io} from 'socket.io-client';
import axios from "axios";

const token = localStorage.getItem("authToken");

const socket = io(`${baseURL}`);


function Notifications() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      A simple {name} alert with{" "}
      <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
        an example link
      </MDTypography>
      . Give it a click if you like.
    </MDTypography>
  );

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  const renderWarningSB = (
    <MDSnackbar
      color="warning"
      icon="star"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );


  // developer

  const [ticketUpdateNotifications, setTicketUpdateNotifications] = useState([]);
  const [ticketCancleNotifications, setTicketCancleNotifications] = useState([]);

  useEffect(() => {
    // socket.on('receive-event-message', (data) => {
    //     console.log("Event Received: ", data);
    //     alert(data.message);

    //     // Update state with logging
    //     setTicketUpdateNotifications((prev) => {
    //         const updated = [...prev, data.message];
    //         console.log("Updated Notifications:", updated);
    //         return updated;
    //     });
    // });



    const fetchNotifications = async () => {  
      try{
        const res = await axios.get(`${baseURL}/notification`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Notifications http: ", res.data);
        res && res.data && res.data.notifications && res.data.notifications.map((notification) => {

          if(notification.type === "update"){
            setTicketUpdateNotifications((prev) => {
              const updated = [...prev, notification.message];
              return updated;
            });
          }else if(notification.type === "delete"){
            setTicketCancleNotifications((prev) => {
              const updated = [...prev, notification.message];
              return updated;
            });
          }


        });
      }
      catch(err){
        console.log("Error is fetching the notification: ", err);
      }
    };

    fetchNotifications();



    return () => {
        // Cleanup listener on component unmount
        socket.off('receive-event-message');
    };
}, []);



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Notifications</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>

                {
                  ticketUpdateNotifications && ticketUpdateNotifications.map((notification, index) => (
                    <MDAlert key={index} color="info" dismissible>
                      {notification}
                    </MDAlert>
                  ))
                }{
                  ticketCancleNotifications && ticketCancleNotifications.map((notification, index) => (
                    <MDAlert key={index} color="error" dismissible>
                      {notification}
                    </MDAlert>
                  ))

                }

              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2} lineHeight={0}>
                <MDTypography variant="h5">Notifications</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Notifications on this page use Toasts from Bootstrap. Read more details here.
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="success" onClick={openSuccessSB} fullWidth>
                      success notification
                    </MDButton>
                    {renderSuccessSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="info" onClick={openInfoSB} fullWidth>
                      info notification
                    </MDButton>
                    {renderInfoSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="warning" onClick={openWarningSB} fullWidth>
                      warning notification
                    </MDButton>
                    {renderWarningSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="error" onClick={openErrorSB} fullWidth>
                      error notification
                    </MDButton>
                    {renderErrorSB}
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    
    </DashboardLayout>
  );
}

export default Notifications;
