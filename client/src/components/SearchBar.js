import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { Box, IconButton, InputBase, Select, MenuItem, FormControl } from "@mui/material";
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
  maxWidth: "500px",
  margin: "0 auto",
  height: "36px", // Shrink the height of the search bar
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flexGrow: 1,
  height: "36px", // Match the height of the container
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.5, 1, 0.5, 2), // Adjust padding to make the input smaller
    transition: theme.transitions.create("width"),
    height: "100%", // Ensure the input field takes up the full height
    width: "100%",
  },
}));

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("keyword"); // "keyword" or "tag"
  const navigate = useNavigate();

  // Handle search type change (tag or keyword)
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  // Handle search functionality
  const handleSearch = () => {
    if (query.trim()) {
      if (searchType === "keyword") {
        navigate(`/search?searchType=key&query=${encodeURIComponent(query)}&orderBy=-create_time`);
      } else {
        navigate(`/search?searchType=tag&query=${encodeURIComponent(query)}`);
      }
    } else {
      alert("Please enter a search term!");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <SearchContainer>
        {/* Search type dropdown on the left */}
        <FormControl sx={{ minWidth: 60, marginRight: 1 }}>
          <Select
            labelId="search-type-label"
            value={searchType}
            onChange={handleSearchTypeChange}
            sx={{ color: "inherit", height: "100%" }}
          >
            <MenuItem value="keyword">Keyword</MenuItem>
            <MenuItem value="tag">Tag</MenuItem>
          </Select>
        </FormControl>

        {/* Search input field on the right */}
        <StyledInputBase
          placeholder={searchType === "keyword" ? "Search keywords..." : "Search tags..."}
          inputProps={{ "aria-label": "search" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          endAdornment={
            <IconButton onClick={handleSearch} size="small" sx={{ color: "inherit", marginRight: 1 }}>
              <SearchIcon />
            </IconButton>
          }
        />
      </SearchContainer>
    </Box>
  );
};

export default SearchBar;
