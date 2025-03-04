import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactData } from "../../redux/slice/contactSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  TablePagination,
  TextField,
  Button,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function ContactUs() {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.contact);
  const [showLoader, setShowLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchContactData());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" style={{ margin: "20px" }}>
        {error}
      </Alert>
    );

  // Filter contacts based on date range
  const filteredContacts = contacts.filter((contact) => {
    const contactDate = new Date(contact.createdAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (
      (!startDate || contactDate >= start) && (!endDate || contactDate <= end)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset filter function
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setPage(0); // Reset to first page when resetting filters
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", mt: 8 }}>
        Contact Inquiries
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
        <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
  <TextField
    type="date"
    label="Start Date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    sx={{ minWidth: 180 }}
    InputLabelProps={{ shrink: true }}
    InputProps={{
      inputProps: { max: new Date().toISOString().split("T")[0] },
    }}
  />

  <TextField
    type="date"
    label="End Date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    sx={{ minWidth: 180 }}
    InputLabelProps={{ shrink: true }}
    InputProps={{
      inputProps: { max: new Date().toISOString().split("T")[0] },
    }}
  />

  <Button
    variant="outlined"
    onClick={resetFilters}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      whiteSpace: "nowrap",
    }}
  >
    <RestartAltIcon fontSize="small" />
    Reset Filter
  </Button>
</Box>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ mt: 0, boxShadow: 0, borderRadius: 0 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3387e8" }}>
              <TableCell>
                <b>First Name</b>
              </TableCell>
              <TableCell>
                <b>Last Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Contact No</b>
              </TableCell>
              <TableCell>
                <b>Location</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                  No contact inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>{contact.first_name}</TableCell>
                    <TableCell>{contact.last_name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone_no}</TableCell>
                    <TableCell>{contact.location}</TableCell>
                    <TableCell>
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="center" width="100%" mt={2}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredContacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableContainer>
    </>
  );
}

export default ContactUs;
