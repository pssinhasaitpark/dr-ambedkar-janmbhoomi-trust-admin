import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import JoditEditor from "jodit-react";

const BookDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editor = useRef(null);

  // Ensure book data is available
  const isNew = location.state?.isNew || false;
  const initialBook = location.state?.book || { id: Date.now(), title: "", writtenBy: "", description: "" };

  const [book, setBook] = useState(initialBook);
  const [isEditable, setIsEditable] = useState(isNew);

  if (!book.title) return <Typography sx={{ p: 3 }}>Book not found!</Typography>;

  const handleChange = (field, value) => {
    setBook((prevBook) => ({
      ...prevBook,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Updated Book:", book);
    navigate("/"); // Redirect to book list
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        {isNew ? "Add New Book" : "Edit Book Details"}
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <TextField
          fullWidth
          label="Title"
          value={book.title}
          onChange={(e) => handleChange("title", e.target.value)}
          disabled={!isEditable}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Written By"
          value={book.writtenBy}
          onChange={(e) => handleChange("writtenBy", e.target.value)}
          disabled={!isEditable}
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>
          Description
        </Typography>
        <JoditEditor
          ref={editor}
          value={book.description}
          config={{
            readonly: !isEditable,
            placeholder: "Write about the book...",
            height: 300,
          }}
          onBlur={(newContent) => handleChange("description", newContent)}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          {!isEditable ? (
            <Button variant="contained" color="primary" onClick={() => setIsEditable(true)}>
              Edit
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSave}>
              Save
            </Button>
          )}
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to List
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default BookDetails;
