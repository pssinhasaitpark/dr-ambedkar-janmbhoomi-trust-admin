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
  TextField,
  Button,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function Subscribers() {
  const dispatch = useDispatch();
  const { data: subscribers, loading, error } = useSelector((state) => state.subscribers);
  const [showLoader, setShowLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchSubscribers());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
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

  // Filter subscribers based on date range
  const filteredSubscribers = subscribers.filter((subscriber) => {
    if (!subscriber.createdAt) return false; // Ensure createdAt exists

    const subscribeDate = new Date(subscriber.createdAt).setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    return (!start || subscribeDate >= start) && (!end || subscribeDate <= end);
  });

  // Reset filter function
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setPage(0);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", mt: 8 }}>
        Subscribers
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ minWidth: 180 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: { max: new Date().toISOString().split("T")[0] },
              }}
            />

            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ minWidth: 180 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: { max: new Date().toISOString().split("T")[0] },
              }}
            />

            <Button
              variant="outlined"
              onClick={resetFilters}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                whiteSpace: "nowrap",
              }}
            >
              <RestartAltIcon fontSize="small" />
              Reset Filter
            </Button>
          </Box>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          p: 0,
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3387e8" }}>
              <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>No.</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubscribers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((subscriber, index) => (
                <TableRow key={subscriber._id}>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{subscriber.email}</TableCell>
                  <TableCell>{subscriber.status}</TableCell>
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
            count={filteredSubscribers.length}
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

export default Subscribers;
