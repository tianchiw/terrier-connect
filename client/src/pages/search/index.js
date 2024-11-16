import React, { useState } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PostSearch = () => {
  // post data
  const posts = [
    { id: 1, title: "React", content: "React is what", author: "Admin", date: "2024-11-15" },
    { id: 2, title: "Material-UI", content: "Material-UI is React UI library", author: "User1", date: "2024-11-14" },
    { id: 3, title: "JavaScript", content: "JavaScript basis", author: "User2", date: "2024-11-13" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Jump to post detailed page
  const handleNavigate = (id) => {
    navigate(`/posts/${id}`);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      {/* Search bar */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          label="Search..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" onClick={() => console.log("搜索操作")}>
          Search
        </Button>
      </Box>

      {/* Post list */}
      <List>
        {filteredPosts.map((post) => (
          <React.Fragment key={post.id}>
            <ListItem
              button
              onClick={() => handleNavigate(post.id)}
              sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {post.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {post.content}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Author: {post.author} | Date: {post.date}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* No result */}
      {filteredPosts.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center">
          No matched posts can be found
        </Typography>
      )}
    </Box>
  );
};

export default PostSearch;
