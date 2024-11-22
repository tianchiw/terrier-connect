import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { Box, IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  maxWidth: "400px", // 限制最大宽度
  margin: "0 auto", // 居中
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flexGrow: 1, // 输入框占据剩余空间
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 2), // 内边距
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const SearchBar = () => {
  const [query, setQuery] = useState(""); // 搜索关键词
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    } else {
      alert("请输入搜索关键词！");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <SearchContainer>
        <StyledInputBase
            placeholder="搜索…"
            inputProps={{ "aria-label": "search" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            endAdornment={
                <IconButton
                onClick={handleSearch}
                size="small"
                sx={{ color: "inherit", marginRight: 1 }}
                >
                <SearchIcon />
                </IconButton>
            }
            />
      </SearchContainer>
    </Box>
  );
};

export default SearchBar;
