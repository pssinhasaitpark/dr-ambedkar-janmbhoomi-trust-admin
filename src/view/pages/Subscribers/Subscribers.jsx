import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscribers } from "../../redux/slice/subscribersSlice"; // Import the action
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
} from "@mui/material";

function Subscribers() {
  const dispatch = useDispatch();
  const { data: subscribers, loading, error } = useSelector((state) => state.subscribers);

  useEffect(() => {
    dispatch(fetchSubscribers());
  }, [dispatch]);

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
        mt: 2,
        p: 2,
        // borderRadius: 2,
        // boxShadow: 3,
        maxWidth: "95%",
        margin: "auto",
        overflowX: "auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold"}}>
        {/* Total Subscribers: {subscribers.length} */}
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
          {subscribers.map((subscriber, index) => (
            <TableRow key={subscriber._id} >
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>{new Date(subscriber.createdAt).toLocaleDateString()}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Subscribers;
