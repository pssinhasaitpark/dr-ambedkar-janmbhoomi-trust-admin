import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
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

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    designations: "",
    user_role: "trustees",
    image: null,
  });

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

  const handleOpen = (trustee = null) => {
    setEditMode(!!trustee);
    setImagePreview(trustee?.image || null);
    setFormData(
      trustee || {
        user_name: "",
        first_name: "",
        last_name: "",
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
      first_name: "",
      last_name: "",
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
    // console.log("Form Data Before Appending to FormData:", formData);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (["_id", "createdAt", "updatedAt", "__v"].includes(key)) {
        // console.log(`Skipping ${key} field: ${formData[key]}`);
      } else if (
        key === "image" &&
        typeof formData[key] === "string" &&
        formData[key].startsWith("http")
      ) {
        // console.log(`Skipping image field since it's a URL: ${formData[key]}`);
      } else {
        data.append(key, formData[key]);
      }
    });

    // console.log("Final FormData Content Before Dispatch:");
    // for (let pair of data.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    if (editMode) {
      dispatch(updateTrustee({ _id: formData._id, updatedData: data }));
    } else {
      dispatch(registerTrustee(data));
    }

    handleClose();
  };

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this trustee?")) {
      dispatch(deleteTrustee(_id));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Trustee Management</h2>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpen()}
      >
        Add New Trustee
      </Button>

      {loading && <CircularProgress />}

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>User Name</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
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
            {trustees.map((trustee) => (
              <TableRow key={trustee._id}>
                <TableCell>{trustee.user_name}</TableCell>
                <TableCell>
                  {trustee.first_name} {trustee.last_name}
                </TableCell>
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
      </TableContainer>

      {/* Dialog for Adding/Editing Trustees */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? "Edit Trustee" : "Add New Trustee"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="User Name"
            name="user_name"
            fullWidth
            value={formData.user_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="First Name"
            name="first_name"
            fullWidth
            value={formData.first_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="last_name"
            fullWidth
            value={formData.last_name}
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
            value={formData.designations}
            onChange={handleChange}
          />

          {/* User Role Dropdown */}
          <TextField
            margin="dense"
            label="User Role"
            name="user_role"
            fullWidth
            select
            value={formData.user_role}
            onChange={handleChange}
          >
            <MenuItem value="trustees">Trustee</MenuItem>
            <MenuItem value="user">User</MenuItem>
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
