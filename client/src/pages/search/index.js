import React, { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Divider, FormControl, InputLabel, Select, MenuItem, Pagination, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PostSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("keyword"); // Track search type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [page, setPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [totalItems, setTotalItems] = useState(0); // Track total items
  const [pageSize, setPageSize] = useState(3); // Number of results per page
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      fetchSearchResults(query, searchType, page, pageSize);
    }
  }, [query, searchType, page, pageSize]);

  const fetchSearchResults = async (query, searchType, page, pageSize) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (searchType === "keyword") {
        response = await axios.get("http://localhost:8000/posts/full_text_search/", {
          params: { query, page, pageSize, orderBy: "-create_time" },
        });
      } else {
        response = await axios.get("http://127.0.0.1:8000/posts/list_posts_by_tag/", {
          params: { tag: query, page, pageSize },
        });
      }

      // Update search results, totalItems, and totalPages
      setSearchResults(response.data.results);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to fetch search results. Please try again. Tags must be precisely matched.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value); // Update search type based on dropdown selection
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      if (searchType === "keyword") {
        navigate(`/search?type=keyword&query=${encodeURIComponent(searchTerm)}&orderBy=-create_time&page=1`);
      } else {
        navigate(`/search?type=tag&query=${encodeURIComponent(searchTerm)}&page=1`);
      }
    } else {
      alert("Please enter a search term!");
    }
  };

  const handleNavigate = (id) => {
    navigate(`/post/${id}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    navigate(`/search?type=${searchType}&query=${encodeURIComponent(searchTerm)}&page=${value}`);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      {/* Search bar */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {/* Search type dropdown */}
        <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
          <InputLabel>Search Type</InputLabel>
          <Select
            value={searchType}
            onChange={handleSearchTypeChange}
            label="Search Type"
            sx={{ height: "100%" }}
          >
            <MenuItem value="keyword">Keyword</MenuItem>
            <MenuItem value="tag">Tag</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Search..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {/* Post list */}
      {loading ? (
        <Typography align="center">Loading...</Typography>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : searchResults.length > 0 ? (
        <List>
          {searchResults.map((post) => (
            <React.Fragment key={post.id}>
              <ListItem
                button
                onClick={() => handleNavigate(post.id)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginBottom: 2,
                  padding: 2,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  "&:hover": {
                    backgroundColor: "#eaeaea",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {post.content.substring(0, 50)}...
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Author: {post.author} | Date: {new Date(post.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          No matched posts can be found
        </Typography>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            sx={{ alignSelf: "center" }}
          />
        </Stack>
      )}
    </Box>
  );
};

export default PostSearch;
