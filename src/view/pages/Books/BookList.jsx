import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlideshowLightbox } from "lightbox.js-react";
import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../../redux/slice/booklistSlice";
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

function BookList() {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.booklist);
  const [removeImages, setRemoveImages] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    author: "",
    description: "",
    images: [],
    cover_image: null,
  });
  const editorRef = useRef(null);

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
      await dispatch(fetchBooks());

      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [dispatch]);

  const handleAddNew = () => {
    setEditingBook(null);
    setFormData({
      id: null,
      title: "",
      author: "",
      description: "",
      images: [],
      cover_image: null,
    });
    setPreviewImage(null);
    setSelectedFileName("");
    setIsFormOpen(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book.id);
    setFormData(book);
    setPreviewImage(book.cover_image);
    setSelectedFileName(book.cover_image.split("/").pop());
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    setBookToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (bookToDelete) {
      try {
        await dispatch(deleteBook(bookToDelete)).unwrap();
        setDeleteDialogOpen(false);
        setBookToDelete(null);
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete the book. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.author.trim()) {
      alert("Title and Author Name cannot be empty");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("book_title", formData.title);
    formDataToSend.append("author_name", formData.author);
    formDataToSend.append("description", formData.description);

    if (formData.cover_image instanceof File) {
      formDataToSend.append("cover_image", formData.cover_image);
    }

    formData.images.forEach((image) => {
      if (image instanceof File) {
        formDataToSend.append("images", image);
      }
    });
    if (removeImages.length > 0) {
      formDataToSend.append("removeImages", JSON.stringify(removeImages));
    }

    try {
      if (editingBook) {
        await dispatch(
          updateBook({ id: editingBook, updatedData: formDataToSend })
        ).unwrap();
      } else {
        await dispatch(addBook(formDataToSend)).unwrap();
      }

      setIsFormOpen(false);
      window.location.reload();
      // dispatch(fetchBooks());
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setSelectedFileName(file.name);
      setFormData({ ...formData, cover_image: file });
    }
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };
  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      const imageToRemove = updatedImages[index];
      updatedImages.splice(index, 1);

      if (typeof imageToRemove === "string") {
        setRemoveImages((prevRemoveImages) => [
          ...prevRemoveImages,
          imageToRemove,
        ]);
      }

      return { ...prev, images: updatedImages };
    });
  };

  return (
    <Container maxWidth="xlg" sx={{ mt: 8, p: 0 }} disableGutters>
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
              <Typography variant="h6">Manage Books</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
              >
                Add New Book
              </Button>
            </Box>

            {books.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  No books available
                </Typography>
              </Paper>
            ) : (
              <TableContainer component={Paper} sx={{ overflow: "hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#3387e8" }}>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Title
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Author
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Book Image
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="medium">
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {books
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((book, index) => (
                        <TableRow key={book.id}>
                          <TableCell>{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>
                            {book.cover_image && book.cover_image.length > 0 ? (
                              <SlideshowLightbox>
                                <img
                                  src={book.cover_image}
                                  alt="Book"
                                  style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                              </SlideshowLightbox>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                No Image
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(book)}
                                size="small"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteConfirm(book.id)}
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
                <Box display="flex" justifyContent="center" width="100%" mt={2}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={books.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Box>
              </TableContainer>
            )}
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
            >
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this book?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  color="error"
                  variant="contained"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        <Dialog
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {editingBook ? "Edit Book" : "Add New Book"}
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
              label="Book Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Author Name"
              name="author"
              value={formData.author}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Description:
            </Typography>
            <JoditEditor
              ref={editorRef}
              value={formData.description}
              onChange={(content) => {
                setFormData((prev) => ({ ...prev, description: content }));
              }}
              onPaste={(event) => {
                event.preventDefault();
                const text = (
                  event.clipboardData || window.clipboardData
                ).getData("text");
                const editor = editorRef.current;
                if (editor) {
                  editor.selection.insertHTML(text);
                }
              }}
            />
            <Typography variant="subtitle1">Cover Image:</Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<ImageIcon />}
            >
              Select Cover Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleCoverImageChange}
              />
            </Button>

            {/* Show selected file name */}
            {selectedFileName && (
              <Typography variant="body2">
                Selected: {selectedFileName}
              </Typography>
            )}

            {(previewImage || formData.cover_image) && (
              <Box mt={2}>
                <img
                  src={
                    previewImage ||
                    (formData.cover_image instanceof File
                      ? URL.createObjectURL(formData.cover_image)
                      : formData.cover_image)
                  }
                  alt="Cover Preview"
                  width="100"
                  height="100"
                />
              </Box>
            )}

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
                    key={`${image}-${index}`}
                    sx={{ position: "relative", width: 80, height: 80 }}
                  >
                    <SlideshowLightbox>
                      <img
                        src={
                          image instanceof File
                            ? URL.createObjectURL(image)
                            : image
                        }
                        alt={`book-img-${index}`}
                        width="100%"
                        height="100%"
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                    </SlideshowLightbox>
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

export default BookList;
