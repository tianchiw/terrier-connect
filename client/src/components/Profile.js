import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Email as EmailIcon } from "@mui/icons-material";
import axios from "axios";

export default function Profile() {
  const { id } = useParams(); // Get the `id` parameter from the URL
  const navigate = useNavigate(); // For navigation
  const [user, setUser] = useState(null); // User information state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // If id is undefined (e.g., for /profile/me), use the logged-in user's id
  const userId =
    id === undefined || id === "me"
      ? parseInt(localStorage.getItem("userId"), 10)
      : parseInt(id, 10);

  // Get the logged-in user's id for comparison
  const loggedInUserId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      alert("Please log in to view your profile.");
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/users/user/${userId}/`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setUser(response.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography
          variant="body1"
          color="error"
          sx={{ textAlign: "center", my: 4 }}
        >
          {error}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ width: 200, height: 200, mb: 2 }}
                src={`http://localhost:8000${user.avatar_url}`}
                alt={user.display_name}
              />
              <Typography variant="h5" gutterBottom>
                {user.display_name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon sx={{ mr: 1 }} color="action" />
                <Typography color="text.secondary">{user.email}</Typography>
              </Box>

              {/* Show Edit Button Only for Logged-In User's Profile */}
              {userId === loggedInUserId && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{ mb: 3 }}
                  fullWidth
                  onClick={() => navigate("/profile/me/edit")}
                >
                  Edit Profile
                </Button>
              )}

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 1 }}
              >
                {user.bio || "No bio available."}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
