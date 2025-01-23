import React from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "baseurl";
import {io} from 'socket.io-client';


function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const socket = io(`${baseURL}`);

  const {
    eventId,
    eventName,
    ticketPrice,
    quantity,
    totalPrice,
  } = location.state;

  const handlePayment = async () => {
    try {
      const res = await axios.post(
        `${baseURL}/ticket/book`,
        { eventId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (res.status === 200) {
        console.log("Payment successful:", res);

         // Emit an event to join the event room
        // socket.emit('join-event-room', { eventId });

        alert(`${res.data.message}`);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <MDBContainer className="py-5" fluid>
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="6">
          <MDBCard className="shadow-0 border rounded-3 p-4">
            <MDBCardBody>
              <MDBTypography tag="h4" className="text-center mb-4">
                Checkout
              </MDBTypography>
              <MDBTypography tag="h5" className="mb-3">
                <strong>Event:</strong> {eventName}
              </MDBTypography>
              <MDBTypography tag="h5" className="mb-3">
                <strong>Price per Ticket:</strong> ₹{ticketPrice}
              </MDBTypography>
              <MDBTypography tag="h5" className="mb-3">
                <strong>Total Price:</strong> ₹{totalPrice}
              </MDBTypography>
              <div className="d-flex justify-content-center mt-4">
                <MDBBtn
                  color="success"
                  size="lg"
                  className="rounded-pill"
                  style={{
                    background: "linear-gradient(90deg, #28a745, #218838)",
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: "0 8px 16px rgba(40, 167, 69, 0.3)",
                  }}
                  onClick={handlePayment}
                >
                  Confirm Payment
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Checkout;
