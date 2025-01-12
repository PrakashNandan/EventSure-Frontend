
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";

function Billing() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
       
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={20} md={12}>
              <BillingInformation />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
     
    </DashboardLayout>
  );
}

export default Billing;
