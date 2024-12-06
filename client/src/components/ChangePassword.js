import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to change your password.");
      navigate("/"); // Redirect to the login page
    }
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit the form to change the password
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("oldPassword", form.oldPassword);
    formData.append("newPassword", form.newPassword);
    formData.append("confirmPassword", form.confirmPassword);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.put(
        "http://localhost:8000/users/change_password/",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Password changed successfully!");
      navigate("/profile/me"); // Redirect back to the profile page
    } catch (err) {
      console.error("Error changing password:", err);
      setError(
        err.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: 3,
          p: 4,
          borderRadius: 2,
          bgcolor: "white",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Change Password
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              label="Old Password"
              name="oldPassword"
              type="password"
              value={form.oldPassword}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            {error && (
              <Typography color="error" sx={{ textAlign: "center", my: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/profile/me")}
            >
              Cancel
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ChangePassword;
