import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNews,
  addNews,
  updateNews,
  deleteNews,
} from "../../redux/slice/newslistSlice";
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

function NewsList() {
  const dispatch = useDispatch();
  const { news, loading, error } = useSelector((state) => state.newslist);
  const [removeImages, setRemoveImages] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [editingNews, setEditingNews] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    latest_news: "",
    headline: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const handleAddNew = () => {
    setEditingNews(null);
    setFormData({
      id: null,
      latest_news: "",
      headline: "",
      description: "",
      images: [],
    });
    setIsFormOpen(true);
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem.id);
    setFormData(newsItem);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        await dispatch(deleteNews(id)).unwrap();
        alert("News deleted successfully");
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("Failed to delete the news. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.headline.trim() || !formData.latest_news.trim()) {
      alert("Headline and Latest News cannot be empty");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("headline", formData.headline);
    formDataToSend.append("latest_news", formData.latest_news);
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
      if (editingNews) {
        await dispatch(
          updateNews({ id: editingNews, updatedData: formDataToSend })
        ).unwrap();
      } else {
        await dispatch(addNews(formDataToSend)).unwrap();
      }

      setIsFormOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error saving news:", error);
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
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
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
  const toggleReadMore = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle state for the row
    }));
  };

  return (
    <Container maxWidth="xlg" sx={{ mt: 8}}>
      <Box my={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6">Manage News</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNew}
          >
            Add News
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#3387e8" }}>
                <TableCell>
                  <Typography variant="subtitle1">Headline</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">Latest News</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {news.map((newsItem) => (
                <TableRow key={newsItem.id}>
                  <TableCell>
                    <Typography
                      sx={{
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "200px", // Adjust as needed
                      }}
                    >
                      {newsItem.headline}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      sx={{ maxWidth: "200px", display: "inline" }}
                    >
                      {expandedRows[newsItem.id] ||
                      newsItem.latest_news.length <= 50
                        ? newsItem.latest_news
                        : `${newsItem.latest_news.substring(0, 50)}...`}
                    </Typography>
                    {newsItem.latest_news.length > 50 && (
                      <Button
                        size="small"
                        onClick={() => toggleReadMore(newsItem.id)}
                        sx={{ textTransform: "none", color: "#007BFF" }}
                      >
                        {expandedRows[newsItem.id] ? "Read Less" : "Read More"}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(newsItem)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteConfirm(newsItem.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {editingNews ? "Edit News" : "Add New News"}
            <IconButton
              onClick={() => setIsFormOpen(false)}
              size="small"
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Latest_News"
              name="latest_news"
              value={formData.latest_news}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Headline"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
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
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default NewsList;
