import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const books = [
  { id: 1, title: "The Annihilation of Caste", writtenBy: "Dr. B.R. Ambedkar", description: "A book on caste system." },
  { id: 2, title: "The Buddha and His Dhamma", writtenBy: "Dr. B.R. Ambedkar", description: "A book on Buddhism." },
];

const BookList = () => {
  const navigate = useNavigate();

  const handleEdit = (book) => {
    navigate("/book-details", { state: { book, isNew: false } });
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ p: 2, textAlign: "center", fontWeight: "bold" }}>
        Book List
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Written By</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.writtenBy}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleEdit(book)}>
                  <Edit />
                </IconButton>
                <IconButton color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookList;
