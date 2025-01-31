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
        console.log("Order created:", res);

        alert(`${res.data.message}`);

        const { razorpayOrderId, razorpayKeyId } = response.data;

        

  
      }
    } catch (error) {
      console.error("Razor payment order error :", error);
      alert("Payment cannt be processed. Please try again.");
    }
  };



  const handleRazorPayment = async () => {  

      try{

          const userDetails = await axios.get(`${baseURL}/auth/getUserDetails`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          const {data} = await axios.post(`${baseURL}/ticket/checkout`,
          { eventId , quantity },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          
          console.log("users details : ", userDetails.data);  
          const {name, email, address} = userDetails.data.user;

          console.log("checkout response : ", data);
          const {message, razorpayKeyId, razorpayOrderId, ticketId, } = data;



              // Open Razorpay Checkout
          const options = {
            key: razorpayKeyId, 
            amount: Math.floor(totalPrice)*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: 'INR',
            name: eventName,
            description: 'Test Transaction',
            order_id: razorpayOrderId,
            // callback_url: "http://localhost:8000/ticket/verify-payment-book-ticket", // Your success URL backend url
            handler: async function (response) {
              try{
                console.log("Payment successful starting:", response);
                const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = response;
                const res = await axios.post(`${baseURL}/ticket/bookticket`, {
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                  ticketId
                }, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                  },
                });

                if(res.status === 200){
                  console.log("Payment successful with status 200:", res);
                  alert("Payment successful. Your ticket has been booked.");
                  navigate("/my-tickets");
                }
              }
              catch(error){
                console.error("Payment failed:", error);
                alert("Payment failed. Please try again.");
              }
            },
            prefill: {
              name,
              email,
              contact: 1234567890,
            },
            theme: {
              color: '#F37254'
            },
          };

          const rzp = new Razorpay(options);
          rzp.open();


      }
      catch(error){
        console.error("Payment failed:", error);
        alert("Payment failed. Please try again.");
      } 




  }




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
                <strong>Price per Ticket:</strong> ₹{Math.floor(ticketPrice)}
              </MDBTypography>
              <MDBTypography tag="h5" className="mb-3">
                <strong>Total Price:</strong> ₹{Math.floor(totalPrice)}
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
                  onClick={handleRazorPayment}
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
