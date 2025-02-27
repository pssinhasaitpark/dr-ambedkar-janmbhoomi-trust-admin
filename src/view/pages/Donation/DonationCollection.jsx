import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonations } from "../../redux/slice/donationcollectionSlice"; // Import the action
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

function DonationCollections() {
  const dispatch = useDispatch();
  const {
    data: donations,
    loading,
    error,
  } = useSelector((state) => state.donations);

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  if (loading)
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

  if (error)
    return (
      <Typography color="error" align="center" mt={4}>
        Error: {error}
      </Typography>
    );

  if (!Array.isArray(donations) || donations.length === 0)
    return (
      <Typography align="center" mt={4}>
        No donations found.
      </Typography>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: "95%",
        margin: "auto",
        overflowX: "auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Total Donations: {donations.length}
      </Typography>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#3387e8" }}>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              No.
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Full Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Email
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Phone
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Amount
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Created At
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {donations.map((donation, index) => (
            <TableRow key={donation._id}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{donation.full_name}</TableCell>
              <TableCell>{donation.email}</TableCell>
              <TableCell>{donation.phone}</TableCell>
              <TableCell>₹{donation.amount}</TableCell>
              <TableCell>
                {new Date(donation.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DonationCollections;
