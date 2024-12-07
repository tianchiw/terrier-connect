import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import NewPostModal from "./NewPostButton";
import SearchBar from "./SearchBar";
import axios from "axios";

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar control
  const [tags, setTags] = useState([]); // To store tags
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Fetch popular tags
  const fetchTags = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.get(
        "http://localhost:8000/hashtags/get_popular_hashtags/?page=1&pageSize=10",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Update tags with the response data
      setTags(response.data.results); // Access the 'results' array directly
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Toggle sidebar with tags
  const toggleSidebar = (open) => async () => {
    setSidebarOpen(open);
    if (open) {
      await fetchTags(); // Fetch tags when opening the sidebar
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleProfileClick = () => {
    handleMenuClose(); // Close the menu
    navigate("/profile/me"); // Navigate to the current user's profile
  };

  const handleLogout = () => {
    // Clear localStorage and redirect to the home page
    localStorage.clear();
    alert("You have been logged out.");
    navigate("/"); // Redirect to the login/home page
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => navigate("/home")}>Home</MenuItem>
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileClick}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Drawer Button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar(true)} // Open the sidebar
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Terrier Connect
          </Typography>

          <SearchBar />

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="new notifications"
              color="inherit"
              onClick={() => setModalOpen(true)}
            >
              <Badge>
                <NoteAddIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-label="new notifications"
              color="inherit"
              onClick={() => navigate("/post/1")}
            >
              <Badge badgeContent={17} color="error">
                <DescriptionIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-label="new mails"
              color="inherit"
              onClick={() => navigate("/follower")}
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-label="new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* New Post Modal */}
      <NewPostModal open={modalOpen} handleClose={() => setModalOpen(false)} />

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar(false)}>
        <Box
          sx={{
            width: 250,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Most Popular Tags
          </Typography>

          {/* Display the tags */}
          <List>
            {tags.map((tag) => (
              <ListItem key={tag.id} button>
                <ListItemText primary={`#${tag.hashtag_text}`} />
              </ListItem>
            ))}
          </List>

          <Button
            variant="outlined"
            sx={{ mt: "auto" }}
            onClick={toggleSidebar(false)}
          >
            Close
          </Button>
        </Box>
      </Drawer>

      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
