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

const EditProfile = () => {
  const [form, setForm] = useState({
    displayName: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling
  const [user, setUser] = useState(null); // For user data

  const navigate = useNavigate();

  // Fetch logged-in user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        alert("You must be logged in to edit your profile.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/users/user/${userId}/`,
          {
            headers: { Authorization: token },
          }
        );
        setUser(response.data.user);
        setForm((prevForm) => ({
          ...prevForm,
          displayName: response.data.user.display_name,
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, avatar: file });
  };

  // Submit the form to update the profile
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("display_name", form.displayName);
    formData.append("oldPassword", form.oldPassword);
    formData.append("newPassword", form.newPassword);
    formData.append("confirmPassword", form.confirmPassword);
    if (form.avatar) {
      formData.append("avatar_url", form.avatar);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8000/users/update_profile/",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully!");
      navigate("/profile/me"); // Redirect back to the profile page
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", my: 4 }}>
          {error}
        </Typography>
      ) : (
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
            Edit Profile
          </Typography>
          <TextField
            label="Display Name"
            name="displayName"
            value={form.displayName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
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
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Upload Avatar
            </Typography>
            <input
              accept="image/*"
              type="file"
              id="avatar-upload"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Button variant="outlined" component="span">
                Choose File
              </Button>
            </label>
            {form.avatar && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {form.avatar.name}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/profile/me")}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default EditProfile;
