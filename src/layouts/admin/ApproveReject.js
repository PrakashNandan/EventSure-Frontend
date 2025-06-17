import React, { useEffect, useState } from "react";
import {
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Box,
  Chip,
  TableContainer,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import baseURL from "baseurl";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/admin/getAllEvents?page=1&limit=1000`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setEvents(data.events || []);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await axios.put(`${baseURL}/admin/approveEvent/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    fetchEvents();
  };

  const handleReject = async (id) => {
    await axios.put(`${baseURL}/admin/rejectEvent/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    fetchEvents();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
  };

  const handleStatusFilter = (status) => {
    setSelectedFilter(status);
    setPage(0);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const filteredEvents =
    selectedFilter === "all"
      ? events
      : events.filter((event) => event.status === selectedFilter);

  const paginatedEvents = filteredEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    setTotalFiltered(filteredEvents.length);
  }, [filteredEvents]);

  return (
    <DashboardLayout>
      <Box p={4}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
          color={"#377df0"}
          sx={{
            background: "linear-gradient(to right, #377df0, #2575fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
          }}
        >
           Manage All Events
        </Typography>

        <FormControl
          fullWidth
          sx={{
            maxWidth: 360,
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(to right, #ffffff, #f0f8ff)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            "& .MuiInputLabel-root": {
              color: "#3f51b5",
              fontWeight: "bold",
              fontSize: "1.05rem",
            },
            "& .MuiOutlinedInput-root": {
              height: "3.25rem",
              borderRadius: 3,
              backgroundColor: "#fff",
              fontSize: "1rem",
              "& fieldset": {
                borderColor: "#d0d0d0",
              },
              "&:hover fieldset": {
                borderColor: "#3f51b5",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3f51b5",
                borderWidth: 2,
              },
            },
          }}
        >
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={selectedFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="all">All Events</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        <Paper elevation={5} sx={{ borderRadius: 4, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Event Title</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Organizer</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      <CircularProgress thickness={5} />
                    </TableCell>
                  </TableRow>
                ) : paginatedEvents.length > 0 ? (
                  paginatedEvents.map((event) => (
                    <TableRow
                      key={event._id}
                      hover
                      sx={{
                        transition: "all 0.3s",
                        "&:hover": { backgroundColor: "#f1f8ff" },
                      }}
                    >
                      <TableCell align="left">{event.name}</TableCell>
                      <TableCell align="left">{event.createdBy?.name || "N/A"}</TableCell>
                      <TableCell align="left">
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-GB")
                          : "N/A"}
                      </TableCell>
                      <TableCell align="left">
                        <Chip
                          label={event.status.toUpperCase()}
                          color={getStatusColor(event.status)}
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          gap={1.5}
                          flexWrap="wrap"
                        >
                          {event.status !== "approved" && (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleApprove(event._id)}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                minWidth: 100,
                              }}
                            >
                              Approve
                            </Button>
                          )}
                          {event.status !== "rejected" && (
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleReject(event._id)}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                minWidth: 100,
                              }}
                            >
                              Reject
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No events found for selected filter.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalFiltered}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              px: 2,
              backgroundColor: "#f5f5f5",
              borderTop: "1px solid #ddd",
            }}
          />
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default ManageEventsPage;
