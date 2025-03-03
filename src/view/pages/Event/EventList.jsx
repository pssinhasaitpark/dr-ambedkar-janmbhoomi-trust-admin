import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../../redux/slice/eventlistSlice";
import JoditEditor from "jodit-react";
import {
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  Paper,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Close,
  Image as ImageIcon,
} from "@mui/icons-material";
import debounce from "lodash.debounce";

function EventList() {
  const dispatch = useDispatch();
  const { events, error } = useSelector((state) => state.eventlist);
  const [removeImages, setRemoveImages] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    event_title: "",
    organized_by: "",
    description: "",
    images: [],
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchEvents());

      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [dispatch]);

  const handleAddNew = () => {
    setEditingEvent(null);
    setFormData({
      id: null,
      event_title: "",
      organized_by: "",
      description: "",
      images: [],
    });
    setIsFormOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event.id);
    setFormData(event);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await dispatch(deleteEvent(id)).unwrap();
        alert("Event deleted successfully");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete the event. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.event_title.trim() || !formData.organized_by.trim()) {
      alert("Event Title and Organizer Name cannot be empty");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("event_title", formData.event_title);
    formDataToSend.append("organized_by", formData.organized_by);
    formDataToSend.append("description", formData.description);

    formData.images.forEach((image) => {
      if (image instanceof File) {
        formDataToSend.append("images", image);
      }
    });

    if (removeImages.length > 0) {
      formDataToSend.append("removeImages", JSON.stringify(removeImages));
    }

    try {
      if (editingEvent) {
        await dispatch(
          updateEvent({ id: editingEvent, updatedData: formDataToSend })
        ).unwrap();
      } else {
        await dispatch(addEvent(formDataToSend)).unwrap();
      }
      setIsFormOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const debouncedHandleChange = useCallback(
    debounce((content) => {
      setFormData((prev) => ({ ...prev, description: content }));
    }, 500),
    []
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = formData.images[index];
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    if (typeof imageToRemove === "string") {
      setRemoveImages((prev) => [...prev, imageToRemove]);
    }
  };

  return (
    <Container maxWidth="xlg" sx={{ mt: 10 }}>
      <Box my={3}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="400px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6">Manage Events</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
              >
                Add New Event
              </Button>
            </Box>
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, overflow: "hidden" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#3387e8" }}>
                    <TableCell
                      sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                    >
                      Event Title
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                    >
                      Organized By
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                    >
                      Event Image
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.event_title}</TableCell>
                        <TableCell>{event.organized_by}</TableCell>
                        <TableCell>
                          {event.images && event.images.length > 0 ? (
                            <img
                              src={event.images[0]} // Fetch the first image from array
                              alt="Event"
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No Image
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(event)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteConfirm(event.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="center" width="100%" mt={2}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={events.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            </TableContainer>
          </>
        )}
        <Dialog
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {editingEvent ? "Edit Event" : "Add New Event"}
            <IconButton
              onClick={() => setIsFormOpen(false)}
              size="small"
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Event Title"
              name="event_title"
              value={formData.event_title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Organized By"
              name="organized_by"
              value={formData.organized_by}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Description:
            </Typography>
            <JoditEditor
              value={formData.description}
              onChange={debouncedHandleChange}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Upload Images:</Typography>
              <Button
                component="label"
                variant="contained"
                startIcon={<ImageIcon />}
                sx={{ mt: 1 }}
              >
                Select Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                {formData.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{ position: "relative", width: 80, height: 80 }}
                  >
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt={"book-img-${index}"}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        background: "rgba(255,255,255,0.8)",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default EventList;
