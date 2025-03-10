import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonations } from "../../redux/slice/donationcollectionSlice"; 
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

function DonationCollections() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: donations, error } = useSelector((state) => state.donations);

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
      await dispatch(fetchDonations());

      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
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
    <>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", mt: 8 }}>
        Donations
      </Typography>

      <Paper>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 0,
              boxShadow: 0,
              maxWidth: "100%",
              overflowX: "auto",
            }}
          >
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
                  OrderId
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                  PaymentStatus
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                  PaymentId
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((donation, index) => (
                    <TableRow key={donation._id}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell>{donation.full_name}</TableCell>
                      <TableCell>{donation.email}</TableCell>
                      <TableCell>{donation.phone}</TableCell>
                      <TableCell>₹{donation.amount}</TableCell>
                      <TableCell>{donation.orderId}</TableCell>
                      <TableCell>{donation.paymentStatus}</TableCell>
                      <TableCell>{donation.paymentId}</TableCell>
                      <TableCell>
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="center" width="100%" mt={2}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={donations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </TableContainer>
        )}
      </Paper>
    </>
  );
}

export default DonationCollections;
