import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import { Edit as EditIcon, Email as EmailIcon } from "@mui/icons-material";
import axios from "axios";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const { id } = useParams(); // Get the `id` parameter from the URL
  const navigate = useNavigate(); // For navigation
  const [user, setUser] = useState(null); // User information state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isFollowing, setIsFollowing] = useState(false); // Follow state
  const [followingList, setFollowingList] = useState([]); // Following users list
  const [tabValue, setTabValue] = useState(0); // Tab state
  const [posts, setPosts] = useState([]); // User posts
  const [comments, setComments] = useState([]); // User comments
  const [following, setFollowing] = useState([]); // User's following
  const [followers, setFollowers] = useState([]); // User's followers

  // Determine the userId based on the URL or localStorage
  const userId =
    id === undefined || id === "me"
      ? parseInt(localStorage.getItem("userId"), 10)
      : parseInt(id, 10);

  // Get the logged-in user's id for comparison
  const loggedInUserId = parseInt(localStorage.getItem("userId"), 10);
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      alert("Please log in to view your profile.");
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch the user data
        const userResponse = await axios.get(
          `http://localhost:8000/users/user/${userId}/`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setUser(userResponse.data.user);

        // Fetch the following list only if viewing another user's profile
        if (userId !== loggedInUserId) {
          const followingResponse = await axios.get(
            `http://localhost:8000/users/${loggedInUserId}/following/`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          setFollowingList(followingResponse.data.results);

          // Check if the target user is in the following list
          const isFollowingUser = followingResponse.data.results.some(
            (followedUser) => followedUser.id === userId
          );
          setIsFollowing(isFollowingUser);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, loggedInUserId, navigate, token]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/posts/comments/authors/${userId}/?page=1&pageSize=10&orderBy=-create_time`,
          {
            headers: { Authorization: token },
          }
        );
        setComments(response.data.results);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/posts/list_posts/`,
          {
            headers: { Authorization: token },
          }
        );
        setPosts(
          response.data.results.filter((post) => post.author === userId)
        );
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/users/${userId}/following/?page=1&pageSize=10`,
          {
            headers: { Authorization: token },
          }
        );
        setFollowing(response.data.results);
      } catch (err) {
        console.error("Error fetching following:", err);
      }
    };

    const fetchFollowers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/users/${userId}/followers/?page=1&pageSize=10`,
          {
            headers: { Authorization: token },
          }
        );
        setFollowers(response.data.results);
      } catch (err) {
        console.error("Error fetching followers:", err);
      }
    };

    fetchComments();
    fetchPosts();
    fetchFollowing();
    fetchFollowers();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/users/${userId}/follow/`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      setIsFollowing(true); // Update follow state
    } catch (err) {
      console.error("Error following user:", err);
      alert("Failed to follow the user.");
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/users/${userId}/unfollow/`,
        {
          headers: { Authorization: token },
        }
      );
      setIsFollowing(false); // Update follow state
    } catch (err) {
      console.error("Error unfollowing user:", err);
      alert("Failed to unfollow the user.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
              {userId === loggedInUserId ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{ mb: 3 }}
                  fullWidth
                  onClick={() => navigate("/profile/me/edit")}
                >
                  Edit Profile
                </Button>
              ) : (
                // Follow/Unfollow Button for Other Users
                <Button
                  variant={isFollowing ? "contained" : "outlined"}
                  color={isFollowing ? "error" : "primary"}
                  sx={{ mt: 3 }}
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
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

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            <Paper>
              {/* Tabs for User Information */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="Posts" />
                <Tab label="Comments" />
                <Tab label="Following" />
                <Tab label="Followers" />
              </Tabs>

              {/* Tab Panels */}
              <TabPanel value={tabValue} index={0}>
                {/* User's Posts */}
                <List>
                  {posts.map((post) => (
                    <React.Fragment key={post.id}>
                      <ListItem component={Link} to={`/post/${post.id}`} button>
                        <ListItemText
                          primary={post.title}
                          secondary={`Posted on: ${new Date(
                            post.create_time
                          ).toLocaleDateString()} | Content: ${post.content}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {posts.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No posts found.
                    </Typography>
                  )}
                </List>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                {/* User's Comments */}
                <List>
                  {comments.map((comment) => (
                    <React.Fragment key={comment.id}>
                      <ListItem
                        component={Link}
                        to={`/post/${comment.post}`}
                        button
                      >
                        <ListItemText
                          primary={comment.content}
                          secondary={`Commented on Post ID: ${
                            comment.post
                          } | Date: ${new Date(
                            comment.create_time
                          ).toLocaleDateString()}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {comments.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No comments found.
                    </Typography>
                  )}
                </List>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                {/* User's Following */}
                <List>
                  {following.map((follow) => (
                    <React.Fragment key={follow.id}>
                      <ListItem
                        component={Link}
                        to={`/profile/${follow.id}`}
                        button
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={`http://localhost:8000${follow.avatar_url}`}
                            alt={follow.display_name}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={follow.display_name || "Unnamed User"}
                          secondary={follow.email}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {following.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Not following anyone.
                    </Typography>
                  )}
                </List>
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                {/* User's Followers */}
                <List>
                  {followers.map((follower) => (
                    <React.Fragment key={follower.id}>
                      <ListItem
                        component={Link}
                        to={`/profile/${follower.id}`}
                        button
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={`http://localhost:8000${follower.avatar_url}`}
                            alt={follower.display_name}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={follower.display_name || "Unnamed User"}
                          secondary={follower.email}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {followers.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No followers yet.
                    </Typography>
                  )}
                </List>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
