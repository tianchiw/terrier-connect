import React, { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Divider } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PostSearch = () => {
  const [searchResults, setSearchResults] = useState([]); // 搜索结果
  const [searchTerm, setSearchTerm] = useState(""); // 搜索关键词
  const [loading, setLoading] = useState(false); // 加载状态
  const [error, setError] = useState(null); // 错误信息
  const navigate = useNavigate();
  const location = useLocation();

  // 从 URL 获取 query 参数
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      fetchSearchResults(query);
    }
  }, [query]);

  // 调用后端搜索 API
  const fetchSearchResults = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8000/posts/full_text_search/", {
        params: { query, page: 1, pageSize: 10 },
      });
      setSearchResults(response.data.results);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索输入
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 点击搜索按钮
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      fetchSearchResults(searchTerm);
    } else {
      alert("请输入搜索关键词！");
    }
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
          marginBottom: 2, // 设置每个 post 之间的间距
          padding: 2, // 设置内边距
          border: "1px solid #ddd", // 边框
          borderRadius: "8px", // 圆角效果
          backgroundColor: "#f9f9f9", // 背景色
          "&:hover": {
            backgroundColor: "#eaeaea", // 鼠标悬停时的背景色
          },
        }}
      >
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {post.content.substring(0, 50)}... {/* 显示内容摘要 */}
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
    </Box>
  );
};

export default PostSearch;
