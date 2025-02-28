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

} from "@mui/material";

function ContactUs() {
  const dispatch = useDispatch();
  const { contacts, error } = useSelector((state) => state.contact);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      await dispatch(fetchContactData());

      
      setTimeout(() => {
        setLoading(false); 
      }, 500); 
    };
    fetchData();
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <Alert severity="error" style={{ margin: "20px" }}>
        {error}
      </Alert>
    );

  return (
    <TableContainer component={Paper} sx={{ mt: 8, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ p: 2, fontWeight: "bold" }}>
        Contact Inquiries
      </Typography>
  <Paper>
          {loading ? ( // Show loading indicator while fetching
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#3387e8" }}>
            <TableCell><b>First Name</b></TableCell>
            <TableCell><b>Last Name</b></TableCell>
            <TableCell><b>Email</b></TableCell>
            <TableCell><b>Contact No</b></TableCell>
            <TableCell><b>Location</b></TableCell>
            <TableCell><b>Date</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                No contact inquiries found.
              </TableCell>
            </TableRow>
          ) : (
            contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>{contact.first_name}</TableCell>
                <TableCell>{contact.last_name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone_no}</TableCell>
                <TableCell>{contact.location}</TableCell>
                <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
          )}
                    </Paper>
      <Box display="flex" justifyContent="center" width="100%" mt={2}>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={contacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </Box>
    </TableContainer>
  );
}

export default ContactUs;