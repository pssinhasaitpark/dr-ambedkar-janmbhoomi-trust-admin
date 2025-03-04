import React, { useEffect, useState, useCallback,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import debounce from "lodash.debounce";

function BookList() {
  const dispatch = useDispatch();
  const { books, error } = useSelector((state) => state.booklist);
  const [removeImages, setRemoveImages] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
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
    setIsFormOpen(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book.id);
    setFormData(book);
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
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCoverImageChange = (e) => {
    setFormData({ ...formData, cover_image: e.target.files[0] });
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

    // If the image is from the backend (string URL), store it in `removeImages`
    if (typeof imageToRemove === "string") {
      setRemoveImages((prev) => [...prev, imageToRemove]);
    }
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

            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            {books.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  No books available
                </Typography>
              </Paper>
            ) : (
              <TableContainer
                component={Paper}
                sx={{overflow: "hidden" }}
              >
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
                              <img
                                src={book.cover_image} // Fetch the first image from array
                                alt="Book"
                                style={{
                                  width: 60,
                                  height: 60,
                                  objectFit: "cover",
                                  borderRadius: "5px",
                                }}
                              />
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
              ref={editorRef} // Pass the ref to the editor
              value={formData.description}
              onChange={(content) => {
                setFormData((prev) => ({ ...prev, description: content }));
              }}
              onPaste={(event) => {
                // Prevent default paste behavior
                event.preventDefault();

                // Get the pasted data
                const text = (event.clipboardData || window.clipboardData).getData('text');

                // Insert the text at the current cursor position
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
            {formData.cover_image && (
              <Box mt={2}>
                <img
                  src={
                    formData.cover_image instanceof File
                      ? URL.createObjectURL(formData.cover_image)
                      : formData.cover_image
                  }
                  alt="Cover"
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

export default BookList;
