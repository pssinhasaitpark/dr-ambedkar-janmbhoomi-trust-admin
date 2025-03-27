import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { SlideshowLightbox } from "lightbox.js-react";
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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const TrusteeManagement = () => {
  const dispatch = useDispatch();
  const { trustees, loading, successMessage, error } = useSelector(
    (state) => state.trustee
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTrusteeId, setSelectedTrusteeId] = useState(null);
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

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const initialState = {
    user_role: "",
    user_name: "",
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    designations: "",
    image: "",
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

  const handleChange = (e, setFieldValue) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFieldValue(name, file);

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFieldValue(name, value);
    }
  };

  const handleSubmit = (values) => {
    const data = new FormData();

    Object.keys(values).forEach((key) => {
      if (["_id", "createdAt", "updatedAt", "__v"].includes(key)) {
      } else if (
        key === "image" &&
        typeof values[key] === "string" &&
        values[key].startsWith("http")
      ) {
      } else {
        data.append(key, values[key]);
      }
    });
    const action = editMode ? updateTrustee : registerTrustee;

    dispatch(action(editMode ? { _id: values._id, updatedData: data } : data))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setSnackbarMessage(
            editMode
              ? "Trustee updated successfully!"
              : "Trustee added successfully!"
          );
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          if (res.payload.image) {
            setFormData((prev) => ({ ...prev, image: res.payload.image }));
            setImagePreview(res.payload.image);
          }

          dispatch(fetchTrustees());
          handleCloseDialog();
          setFormData(initialState);
          setEditMode(false);
        } else {
          const errorMessage =
            typeof res.payload === "string"
              ? res.payload
              : "An error occurred!";
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);

          setFormData((prev) => ({ ...prev, image: "" }));
          setImagePreview("");
        }
      })
      .catch((err) => {
        console.error("Request failed:", err);
        setSnackbarMessage(err?.message || "An unexpected error occurred!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);

        setFormData((prev) => ({ ...prev, image: "" }));
        setImagePreview("");
      });
  };
  // const handleDelete = (_id) => {
  //   if (window.confirm("Are you sure you want to delete this trustee?")) {
  //     dispatch(deleteTrustee(_id));
  //   }
  // };

  const handleDelete = async () => {
    if (selectedTrusteeId) {
      try {
        await dispatch(deleteTrustee(selectedTrusteeId)).unwrap();
        setSnackbarMessage("Trustee deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting trustee:", error);
        setSnackbarMessage("Failed to delete the trustee. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      handleCloseDeleteDialog(); // Close the delete confirmation dialog
    }
  };

  // Open delete confirmation dialog
  const handleOpenDialog = (id) => {
    setSelectedTrusteeId(id);
    setOpenDialog(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
    setSelectedTrusteeId(null);
  };

  const filteredTrustees = trustees.filter((trustee) => {
    const matchesSearchQuery = trustee.full_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearchQuery;
  });

  // Validation Schema
  const validationSchema = Yup.object().shape({
    user_name: Yup.string().required("User  Name is required"),
    full_name: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]+$/, "Mobile must be a number")
      .min(10, "Mobile must be at least 10 digits")
      .max(12, "Mobile must be at most 12 digits")
      .required("Mobile is required"),
    password: Yup.string().required("Password is required"),
    designations: Yup.string().required("Designation is required"),
    image: Yup.mixed()
      .test("fileRequired", "Image is required", function (value) {
        if (!this.parent.id && !value) {
          return false;
        }
        return true;
      })
      .test("fileSize", "File too large", (value) => {
        if (!value || typeof value === "string") return true;
        return value.size <= 5000000; // 2MB limit
      })
      .test("fileType", "Unsupported File Format", (value) => {
        if (!value || typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
  });

  return (
    <>
      <div style={{ padding: "4px", marginTop: "60px" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ mb: 0, fontWeight: "bold", mt: 0 }}>
            Trustee Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Add New Trustee
          </Button>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
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
                        <SlideshowLightbox>
                          <img
                            src={trustee.image}
                            alt="Trustee"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        </SlideshowLightbox>
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
                        onClick={() => handleOpenDialog(trustee._id)}
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
        {/* Confirmation Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this trustee?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={null}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
            <Formik
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form>
                  <Field
                    as={TextField}
                    margin="dense"
                    label="User  Name"
                    name="user_name"
                    fullWidth
                  />
                  <ErrorMessage
                    name="user_name"
                    component="div"
                    style={{ color: "red" }}
                  />

                  <Field
                    as={TextField}
                    margin="dense"
                    label="Full Name"
                    name="full_name"
                    fullWidth
                  />
                  <ErrorMessage
                    name="full_name"
                    component="div"
                    style={{ color: "red" }}
                  />

                  <Field
                    as={TextField}
                    margin="dense"
                    label="Email"
                    name="email"
                    fullWidth
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{ color: "red" }}
                  />

                  <Field
                    as={TextField}
                    margin="dense"
                    label="Mobile"
                    name="mobile"
                    fullWidth
                  />
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    style={{ color: "red" }}
                  />

                  <Field
                    as={TextField}
                    margin="dense"
                    label="Password"
                    type="password"
                    name="password"
                    fullWidth
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{ color: "red" }}
                  />

                  <Field
                    as={TextField}
                    margin="dense"
                    label="Designation"
                    name="designations"
                    fullWidth
                    select
                  >
                    <MenuItem value="Management">Management</MenuItem>
                    <MenuItem value="Developer">Developer</MenuItem>
                  </Field>
                  <ErrorMessage
                    name="designations"
                    component="div"
                    style={{ color: "red" }}
                  />

                  {/* User Role Dropdown */}
                  <Field
                    as={TextField}
                    margin="dense"
                    label="User  Role"
                    name="user_role"
                    fullWidth
                    select
                  >
                    <MenuItem value="trustees">Trustee</MenuItem>
                  </Field>

                  {/* Image Upload & Preview */}
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => handleChange(e, setFieldValue)}
                    style={{ marginTop: "10px" }}
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    style={{ color: "red" }}
                  />
                  {imagePreview && (
                    <SlideshowLightbox>
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
                    </SlideshowLightbox>
                  )}

                  <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      {editMode ? "Update" : "Save"}
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default TrusteeManagement;
