import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTrustees,
  registerTrustee,
  updateTrustee,
  deleteTrustee,
  clearMessages,
} from "../../redux/slice/trusteeSlice";

const TrusteeManagement = () => {
  const dispatch = useDispatch();
  const { trustees, loading, successMessage, error } = useSelector(
    (state) => state.trustee
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [designationFilter, setDesignationFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [formData, setFormData] = useState({
    user_name: "",
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    designations: "",
    user_role: "trustees",
    image: null,
  });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    dispatch(fetchTrustees());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
    }
  }, [successMessage, error, dispatch]);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (trustee = null) => {
    setEditMode(!!trustee);
    setImagePreview(trustee?.image || null);
    setFormData(
      trustee || {
        user_name: "",
        full_name: "",
        email: "",
        mobile: "",
        password: "",
        designations: "",
        user_role: "trustees",
        image: null,
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setImagePreview(null);
    setFormData({
      user_name: "",
      full_name: "",
      email: "",
      mobile: "",
      password: "",
      designations: "",
      user_role: "trustees",
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (["_id", "createdAt", "updatedAt", "__v"].includes(key)) {
        // Skip these fields
      } else if (
        key === "image" &&
        typeof formData[key] === "string" &&
        formData[key].startsWith("http")
      ) {
        // Skip image field if it's a URL
      } else {
        data.append(key, formData[key]);
      }
    });

    const action = editMode ? updateTrustee : registerTrustee;
    dispatch(action(editMode ? { _id: formData._id, updatedData: data } : data))
      .then(() => {
        setSnackbarMessage(
          editMode
            ? "Trustee updated successfully!"
            : "Trustee added successfully!"
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // Do not close the form here
      })
      .catch((err) => {
        setSnackbarMessage(err.message || "An error occurred!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        // Do not close the form here
      });
  };

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this trustee?")) {
      dispatch(deleteTrustee(_id));
    }
  };

  const filteredTrustees = trustees.filter((trustee) => {
    const matchesDesignation = designationFilter
      ? trustee.designations === designationFilter
      : true;

    const matchesSearchQuery = trustee.full_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()); // Corrected line

    return matchesDesignation && matchesSearchQuery;
  });

  return (
    <div style={{ padding: "4px", marginTop: "80px" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Trustee Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add New Trustee
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          select
          label="Filter by Designation"
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
          style={{ width: "200px", marginRight: "20px" }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Management">Management</MenuItem>
          <MenuItem value="Developer">Developer</MenuItem>
        </TextField>

        {/* Search Bar */}
        <TextField
          label="Search by Full Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px" }}
        />
      </Box>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3387e8" }}>
              <TableCell>
                <b>User Name</b>
              </TableCell>
              <TableCell>
                <b>Full Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Mobile</b>
              </TableCell>
              <TableCell>
                <b>Designation</b>
              </TableCell>
              <TableCell>
                <b>Role</b>
              </TableCell>
              <TableCell>
                <b>Image</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrustees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((trustee) => (
                <TableRow key={trustee._id}>
                  <TableCell>{trustee.user_name}</TableCell>
                  <TableCell>{trustee.full_name}</TableCell>
                  <TableCell>{trustee.email}</TableCell>
                  <TableCell>{trustee.mobile}</TableCell>
                  <TableCell>{trustee.designations}</TableCell>
                  <TableCell>{trustee.user_role}</TableCell>
                  <TableCell>
                    {trustee.image && (
                      <img
                        src={trustee.image}
                        alt="Trustee"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpen(trustee)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(trustee._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Box display="flex" justifyContent="center" width="100%" mt={2}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTrustees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableContainer>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={null}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Positioning the Snackbar
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          action={
            <Button color="inherit" onClick={() => setSnackbarOpen(false)}>
              Close
            </Button>
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog for Adding/Editing Trustees */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? "Edit Trustee" : "Add New Trustee"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="User    Name"
            name="user_name"
            fullWidth
            value={formData.user_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Full Name"
            name="full_name"
            fullWidth
            value={formData.full_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Mobile"
            name="mobile"
            fullWidth
            value={formData.mobile}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            name="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Designation"
            name="designations"
            fullWidth
            select
            value={formData.designations}
            onChange={handleChange}
          >
            <MenuItem value="Management">Management</MenuItem>
            <MenuItem value="Developer">Developer</MenuItem>
          </TextField>
          {/* User Role Dropdown */}
          <TextField
            margin="dense"
            label="User    Role"
            name="user_role"
            fullWidth
            select
            value={formData.user_role}
            onChange={handleChange}
          >
            <MenuItem value="trustees">Trustee</MenuItem>
          </TextField>

          {/* Image Upload & Preview */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={{ marginTop: "10px" }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                marginTop: "10px",
                width: "100px",
                height: "100px",
                borderRadius: "10px",
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TrusteeManagement;