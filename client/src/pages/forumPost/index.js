import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

const ForumPost = () => {
  // Template data
  const post = {
    title: "How to learn React？",
    content:
      "React is a very prevailed JavaScript library.",
    author: {
      name: "Admin",
      avatar: "https://via.placeholder.com/150",
    },
    time: "2024-11-15 10:00",
  };

  const comments = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "https://via.placeholder.com/150",
      },
      time: "2024-11-15 11:00",
      content: "Great post！",
    },
    {
      id: 2,
      user: {
        name: "User2",
        avatar: "https://via.placeholder.com/150",
      },
      time: "2024-11-15 11:30",
      content: "thanks for sharing！",
    },
    {
      id: 3,
      user: {
        name: "User3",
        avatar: "https://via.placeholder.com/150",
      },
      time: "2024-11-15 12:00",
      content: "I recommend official instructions of React.",
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      {/* Title and content */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar src={post.author.avatar} alt={post.author.name} sx={{ mr: 2 }} />
            <Typography variant="subtitle1">{post.author.name}</Typography>
            <Typography variant="body2" sx={{ marginLeft: "auto", color: "gray" }}>
              {post.time}
            </Typography>
          </Box>
          <Typography variant="body1">{post.content}</Typography>
        </CardContent>
      </Card>

      {/* Comment space */}
      <Typography variant="h5" mt={4} mb={2}>
        Comments
      </Typography>
      <List>
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={comment.user.avatar} alt={comment.user.name} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1">{comment.user.name}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ marginLeft: "auto", color: "gray" }}
                    >
                      {comment.time}
                    </Typography>
                  </Box>
                }
                secondary={<Typography variant="body2">{comment.content}</Typography>}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ForumPost;