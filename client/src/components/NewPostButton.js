import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";

const NewPostModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    eventLocation: "",
    content: "",
  });

  const [successMessage, setSuccessMessage] = useState(false);

  // Handle input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // submit button
  const handleSubmit = async () => {
    if (!formData.title || !formData.eventLocation || !formData.content) {
      alert("请填写所有必填项");
      return;
    }
  
    const token = localStorage.getItem("token"); // get stored token
    if (!token) {
      alert("用户未登录，请先登录！");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/posts/add_post/",
        {
          content: formData.content,
          hashtags: ["Ice cream"], // 示例标签，可动态生成
        },
        {
          headers: {
            Authorization: token, // 添加 Authorization 请求头
          },
        }
      );
  
      console.log("Post created successfully:", response.data);
      setSuccessMessage(true); // 显示成功消息
      setFormData({ title: "", eventLocation: "", content: "", description: "" }); // 清空表单
      handleClose(); // 关闭模态框
    } catch (error) {
      console.error("Error creating post:", error.response || error.message);
      alert("发布失败，请检查您的输入！");
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="new-post-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="new-post-modal"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            create new post
          </Typography>

          {/* Title and location should be at the same line */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                required
                label="Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="Location"
                name="eventLocation"
                fullWidth
                value={formData.eventLocation}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* content */}
          <TextField
            required
            label="Content"
            name="content"
            margin="dense"
            fullWidth
            multiline
            rows={6} // adjust height
            value={formData.content}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {/* post button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: "#42b72a",
              color: "#fff",
              padding: "10px 0",
              fontSize: "16px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#36a420",
              },
            }}
            onClick={handleSubmit}
          >
            Post
          </Button>
        </Box>
      </Modal>

      {/* success message */}
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Post created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewPostModal;