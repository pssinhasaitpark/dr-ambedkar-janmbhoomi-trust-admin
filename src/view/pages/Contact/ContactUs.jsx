import React, { useEffect } from "react";
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
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

function ContactUs() {
  const dispatch = useDispatch();

  // Getting state from Redux store
  const { contacts, loading, error } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(fetchContactData());
  }, [dispatch]);

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
    <TableContainer
      component={Paper}
      sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" sx={{ p: 2, fontWeight: "bold" }}>
        Contact Inquiries
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
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
              <b>Created</b>
            </TableCell>
          </TableRow>
        </TableHead>
        {/* <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              First Name
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Last Name
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Email
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Contact No
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Location
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Created At
            </TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                No contact inquiries found.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow
                key={contact._id}

                // sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}
              >
                <TableCell>{contact.first_name}</TableCell>
                <TableCell>{contact.last_name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone_no}</TableCell>
                <TableCell>{contact.location}</TableCell>

                <TableCell>
                  {new Date(contact.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ContactUs;
