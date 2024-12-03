import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";

const UserMessages = () => {
  // 示例数据
  const messages = [
    {
      id: 1,
      user: {
        name: "user 1",
        avatar: "https://via.placeholder.com/150",
      },
      message: "Hello!Can we discuss this project together?",
      time: "2024-11-15 14:00",
    },
    {
      id: 2,
      user: {
        name: "user 2",
        avatar: "https://via.placeholder.com/150",
      },
      message: "I solved this problem, thank you for your help!",
      time: "2024-11-15 13:30",
    },
    {
      id: 3,
      user: {
        name: "User 3",
        avatar: "https://via.placeholder.com/150",
      },
      message: "Can you check out my new post at your convenience?",
      time: "2024-11-15 12:15",
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      {/* 页面标题 */}
      <Typography variant="h4" gutterBottom>
        我的关注者和私信
      </Typography>

      {/* 消息列表 */}
      <Card>
        <CardContent>
          <List>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={message.user.avatar} alt={message.user.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1">{message.user.name}</Typography>
                        <Typography
                          variant="body2"
                          sx={{ marginLeft: "auto", color: "gray" }}
                        >
                          {message.time}
                        </Typography>
                      </Box>
                    }
                    secondary={<Typography variant="body2">{message.message}</Typography>}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserMessages;