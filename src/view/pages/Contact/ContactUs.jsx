import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactData,deleteContactData } from "../../redux/slice/contactSlice";
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
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
// import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Delete } from "@mui/icons-material";
function ContactUs() {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.contact);
  const [showLoader, setShowLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
 const [openDialog, setOpenDialog] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


    const handleOpenDialog = (id) => {
      setSelectedContactId(id);
      setOpenDialog(true);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
      setSelectedContactId(null);
    };
  
    const handleDelete = async () => {
      if (selectedContactId) {
        try {
          await dispatch(deleteContactData(selectedContactId)).unwrap();
        } catch (error) {
          console.error("Error deleting testimonial:", error);
          alert("Failed to delete the testimonial. Please try again.");
        }
        handleCloseDialog();
      }
    };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", mt: 8 }}>
        Contact Inquiries
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ mt: 0, boxShadow: 0, borderRadius: 0 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3387e8" }}>
                 <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>No.</TableCell>
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
               <TableCell>
               <b>Action</b>
              </TableCell>
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
              contacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact,index) => (
                  <TableRow key={contact._id}>
                                      <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{contact.first_name}</TableCell>
                    <TableCell>{contact.last_name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone_no}</TableCell>
                    <TableCell>{contact.location}</TableCell>
                    <TableCell>
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDialog(contact._id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
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
            count={contacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Enquiries?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ContactUs;
