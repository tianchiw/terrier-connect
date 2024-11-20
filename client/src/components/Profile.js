import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Grid,
} from "@mui/material";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Article as ArticleIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

// Custom TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box x={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Links data for different tabs
const tabLinks = {
  0: [
    // Posts
    { text: "Post 1", href: "#" },
    { text: "Post 2", href: "#" },
    { text: "Post 3", href: "#" },
  ],
  1: [
    // Comments
    { text: "Comment 1", href: "#" },
    { text: "Comment 2", href: "#" },
    { text: "Comment 3", href: "#" },
  ],
  2: [
    // Likes
    { text: "Like 1", href: "#" },
    { text: "Like 2", href: "#" },
    { text: "Like 3", href: "#" },
  ],
  3: [
    // Following
    { text: "Follow 1", href: "#" },
    { text: "Follow 2", href: "#" },
    { text: "Follow 3", href: "#" },
  ],
  4: [
    // Followers
    { text: "Follower 1", href: "#" },
    { text: "Follower 2", href: "#" },
    { text: "Follower 3", href: "#" },
  ],
};

export default function Profile() {
  const [tabValue, setTabValue] = useState(0);

  // Mock user data - replace with real data later
  const user = {
    name: "John Smith",
    email: "john.smith@bu.edu",
    bio: "Master Student of Computer Science",
    avatar: "/path-to-avatar.jpg", // Replace with actual avatar path
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
              src={user.avatar}
              alt={user.name}
            />
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmailIcon sx={{ mr: 1 }} color="action" />
              <Typography color="text.secondary">{user.email}</Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{ mb: 3 }}
              fullWidth
            >
              Edit Profile
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              {user.bio}
            </Typography>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Posts" />
              <Tab label="Comments" />
              <Tab label="Likes" />
              <Tab label="Following" />
              <Tab label="Followers" />
            </Tabs>

            {/* Tab Panels */}
            {[0, 1, 2, 3, 4].map((index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                <List>
                  {tabLinks[index].map((link, i) => (
                    <React.Fragment key={i}>
                      <ListItem button component="a" href={link.href}>
                        <ListItemIcon>{link.icon}</ListItemIcon>
                        <ListItemText primary={link.text} />
                      </ListItem>
                      {i < tabLinks[index].length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </TabPanel>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
