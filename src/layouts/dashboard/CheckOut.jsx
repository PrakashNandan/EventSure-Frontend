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

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    eventId,
    eventName,
    ticketPrice,
    quantity,
    totalPrice,
  } = location.state;

  const handleRazorPayment = async () => {
    try {
      const userDetails = await axios.get(`${baseURL}/auth/getUserDetails`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const { data } = await axios.post(
        `${baseURL}/ticket/checkout`,
        { eventId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const { name, email } = userDetails.data.user;
      const { razorpayKeyId, razorpayOrderId, ticketId } = data;

      const options = {
        key: razorpayKeyId,
        amount: Math.floor(totalPrice) * 100,
        currency: "INR",
        name: eventName,
        description: "Event Ticket Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const res = await axios.post(
              `${baseURL}/ticket/bookticket`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                ticketId,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            );

            if (res.status === 200) {
              alert("✅ Payment successful! Ticket booked.");
              navigate("/my-tickets");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("❌ Payment verification failed. Try again.");
          }
        },
        prefill: {
          name,
          email,
          contact: "9999999999",
        },
        theme: {
          color: "#5dade2", // Light Blue Theme
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <MDBContainer
      fluid
      className="py-5"
      style={{
        background: "linear-gradient(to right, #e8f1f9, #f0f8ff)",
        minHeight: "100vh",
      }}
    >
      <MDBRow className="justify-content-center">
        <MDBCol md="6" lg="5">
          <MDBCard
            className="border-0 shadow-lg p-4"
            style={{
              borderRadius: "18px",
              background: "white",
              animation: "slideUp 0.6s ease-in-out",
            }}
          >
            <MDBCardBody>
              <MDBTypography
                tag="h3"
                className="text-center mb-4 fw-bold"
                style={{ color: "#2e86c1" }}
              >
                Checkout
              </MDBTypography>

              <hr className="mb-4" style={{ borderColor: "#d6eaf8" }} />

              <MDBTypography tag="h5" className="mb-3 text-secondary">
                📌 <strong>Event:</strong> {eventName}
              </MDBTypography>

              <MDBTypography tag="h5" className="mb-3 text-secondary">
                🎟️ <strong>Tickets:</strong> {quantity}
              </MDBTypography>

              <MDBTypography tag="h5" className="mb-3 text-secondary">
                💵 <strong>Price per Ticket:</strong> ₹{ticketPrice}
              </MDBTypography>

              <MDBTypography
                tag="h4"
                className="my-4 fw-bold text-primary text-center"
              >
                🧾 Total: ₹{totalPrice}
              </MDBTypography>

              <div className="d-flex justify-content-center">
                <MDBBtn
                  size="lg"
                  className="rounded-pill px-5 py-2"
                  style={{
                    background:
                      "linear-gradient(to right, #5dade2, #3498db)",
                    color: "white",
                    fontWeight: "600",
                    letterSpacing: "1px",
                    boxShadow: "0 8px 20px rgba(52, 152, 219, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleRazorPayment}
                  onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Confirm Payment
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </MDBContainer>
  );
}

export default Checkout;
