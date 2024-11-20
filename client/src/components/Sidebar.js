import React, { useState } from "react";
import { Drawer, Box, Typography, Button, Menu, MenuItem, Collapse, List, ListItem, ListItemText} from "@mui/material";
import { useNavigate } from 'react-router-dom';

const buttonStyle = {
  justifyContent: "flex-start",
  width: "100%",
  textTransform: "none"
};

const PopularTagsDropdown = () => {
  // tags data
  const tags = ["React", "Material-UI", "JavaScript"];

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <Box>
      {/* Popular Tags button */}
      <Button
        sx={{ margin: 1 }}
        onClick={handleToggle}
        aria-expanded={open}
      >
        Popular Tags
      </Button>

      {/* Content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="nav" sx={{ marginLeft: 2 }}>
          {tags.map((tag, index) => (
            <ListItem key={index}>
              <ListItemText primary={tag} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 250, padding: 2, alignItems: "flex-left" }}>
        <Typography variant="h6" gutterBottom>
          Title
        </Typography>
        <Box mt={2}>
          <Button sx={buttonStyle} onClick={() => handleNavigation('/home')}>Homepage</Button>
          <Box sx={{ width: "100%" }}>
            <PopularTagsDropdown buttonStyle={buttonStyle} />
          </Box>
          <Button sx={buttonStyle} onClick={() => handleNavigation('/profile')}>Profile</Button>
          <Button sx={buttonStyle}>Others</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;