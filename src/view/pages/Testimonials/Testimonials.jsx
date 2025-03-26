import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlideshowLightbox } from "lightbox.js-react";
import {
  fetchTestimonialsData,
  deleteTestimonialsData,
} from "../../redux/slice/testimonialSlice";
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
  TablePagination,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

function Testimonials() {
  const dispatch = useDispatch();
  const { testimonials, loading} = useSelector(
    (state) => state.testimonials
  );
  const [expandedRows, setExpandedRows] = useState({});
  const [showLoader, setShowLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState(null);

  useEffect(() => {
    dispatch(fetchTestimonialsData());
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (id) => {
    setSelectedTestimonialId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTestimonialId(null);
  };

  const handleDelete = async () => {
    if (selectedTestimonialId) {
      try {
        await dispatch(deleteTestimonialsData(selectedTestimonialId)).unwrap();
      } catch (error) {
        console.error("Error deleting testimonial:", error);
        alert("Failed to delete the testimonial. Please try again.");
      }
      handleCloseDialog();
    }
  };
  const toggleReadMore = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Typography variant="h5" sx={{ p: 2, fontWeight: "bold", mt: 6 }}>
        Testimonials
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ mt: 0, boxShadow: 0, borderRadius: 0 }}
      >
        <Paper>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#3387e8" }}>
                <TableCell>
                  <b>Description</b>
                </TableCell>
                <TableCell>
                  <b>Case Studies</b>
                </TableCell>
                <TableCell>
                  <b>Stories</b>
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
              {testimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                    No testimonials found.
                  </TableCell>
                </TableRow>
              ) : (
                testimonials
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((testimonial) => (
                    <TableRow key={testimonial._id}>
                      {/* <TableCell>{testimonial.description}</TableCell> */}
                      <TableCell>
                        <Box
                          sx={{
                            maxWidth: 700,
                            maxHeight: expandedRows[testimonial._id]
                              ? "none"
                              : 60, 
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: expandedRows[testimonial._id]
                              ? "none"
                              : 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {testimonial.description}
                        </Box>
                        {testimonial.description.length > 150 && (
                          <Button
                            size="small"
                            onClick={() => toggleReadMore(testimonial._id)}
                            sx={{
                              textTransform: "none",
                              color: "#007BFF",
                              display: "block",
                            }}
                          >
                            {expandedRows[testimonial._id]
                              ? "Read Less"
                              : "Read More"}
                          </Button>
                        )}
                      </TableCell>

                      <TableCell>
                        {testimonial.case_studies.map((image, index) => (
                          <SlideshowLightbox>
                          <img
                            key={index}
                            src={image}
                            alt="Case Study"
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                              marginRight: 5,
                              borderRadius: "50%",
                            }}
                          />
                          </SlideshowLightbox>
                        ))}
                      </TableCell>
                      <TableCell>
                        {testimonial.stories.map((image, index) => (
                            <SlideshowLightbox>
                          <img
                            key={index}
                            src={image}
                            alt="Story"
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                              marginRight: 5,
                              borderRadius: "50%",
                            }}
                         
                          />
                             </SlideshowLightbox>
                        ))}
                      </TableCell>
                      <TableCell>
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDialog(testimonial._id)}
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
        </Paper>
        <Box display="flex" justifyContent="center" width="100%" mt={2}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={testimonials.length}
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
          Are you sure you want to delete this testimonial?
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

export default Testimonials;
