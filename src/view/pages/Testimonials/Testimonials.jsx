import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestimonialsData } from "../../redux/slice/testimonialSlice";
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
} from "@mui/material";

function Testimonials() {
  const dispatch = useDispatch();
  const { testimonials, loading, error } = useSelector(
    (state) => state.testimonials
  );
  const [showLoader, setShowLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
  if (error)
    return (
      <Alert severity="error" style={{ margin: "20px" }}>
        {error}
      </Alert>
    );

  return (
    <>
      <Typography variant="h5" sx={{ p: 2, fontWeight: "bold", mt: 6 }}>
        Testimonials
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ mt: 0, boxShadow: 3, borderRadius: 2 }}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                    No testimonials found.
                  </TableCell>
                </TableRow>
              ) : (
                testimonials
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((testimonial) => (
                    <TableRow key={testimonial._id}>
                      <TableCell>{testimonial.description}</TableCell>
                      <TableCell>
                        {testimonial.case_studies.map((image, index) => (
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
                        ))}
                      </TableCell>

                      <TableCell>
                        {testimonial.stories.map((image, index) => (
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
                        ))}
                      </TableCell>
                      <TableCell>
                        {new Date(testimonial.createdAt).toLocaleDateString()}
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
    </>
  );
}

export default Testimonials;
