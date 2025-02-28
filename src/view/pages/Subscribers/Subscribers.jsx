import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscribers } from "../../redux/slice/subscribersSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  TablePagination,
} from "@mui/material";

function Subscribers() {
  const dispatch = useDispatch();
  const { data: subscribers, loading, error } = useSelector((state) => state.subscribers);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchSubscribers());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={4}>
        Error: {error}
      </Typography>
    );

  if (!Array.isArray(subscribers) || subscribers.length === 0)
    return (
      <Typography align="center" mt={4}>
        No subscribers found.
      </Typography>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 8,
        p: 2,
        maxWidth: "95%",
        overflowX: "auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Subscribers
      </Typography>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#3387e8" }}>
            <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>No.</TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscribers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subscriber, index) => (
            <TableRow key={subscriber._id}>
              <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>{new Date(subscriber.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Centered Pagination */}
      <Box display="flex" justifyContent="center" width="100%" mt={2}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={subscribers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>
  );
}

export default Subscribers;
