import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [page, setPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const navigate = useNavigate();

  // Fetch posts
  const fetchPosts = async (page) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    try {
      const response = await axios.get(
        `http://localhost:8000/posts/list_posts/?page=${page}&pageSize=10`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPosts(response.data.results); // Save the list of posts
      setTotalPages(response.data.totalPages); // Set total pages for pagination
    } catch (err) {
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false); // Turn off loading spinner
    }
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    setLoading(true);
    fetchPosts(value); // Fetch posts for the selected page
  };

  // Handle post detail navigation
  const handlePostDetail = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8000/posts/get_post_detail/${postId}/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Post Detail:", response.data);
      navigate(`/post/${postId}`); // Navigate to post detail page
    } catch (err) {
      console.error("Failed to fetch post detail:", err);
    }
  };

  useEffect(() => {
    fetchPosts(page); // Fetch posts on component mount
  }, [page]);

  return (
    <Box
      sx={{
        bgcolor: "#F4F6F8",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
        >
          Latest Posts
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography
            variant="body1"
            color="error"
            sx={{ textAlign: "center", my: 4 }}
          >
            {error}
          </Typography>
        )}

        {!loading && !error && posts.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: "center", my: 4 }}>
            No posts found.
          </Typography>
        )}

        {!loading && !error && posts.length > 0 && (
          <List>
            {posts.map((post) => (
              <ListItem
                key={post.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: "1px solid #ccc",
                  py: 2,
                }}
              >
                <Link
                  component="button"
                  variant="h6"
                  underline="hover"
                  sx={{ fontWeight: "bold", mb: 1, color: "#cc0000" }}
                  onClick={() => handlePostDetail(post.id)}
                >
                  {post.title}
                </Link>
                <Typography variant="body2" color="text.secondary">
                  {post.content.length > 200
                    ? `${post.content.slice(0, 200)}...`
                    : post.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 2, color: "gray" }}
                >
                  {new Date(post.timestamp).toLocaleString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;
