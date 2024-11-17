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
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState(false); // 控制成功提示框

  // 处理表单输入
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // 点击发布按钮
  const handleSubmit = async () => {
    if (!formData.title || !formData.eventLocation || !formData.content || !formData.description) {
      alert("请填写所有必填项");
      return;
    }
  
    const token = localStorage.getItem("token"); // 获取存储的 token
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
            创建新帖子
          </Typography>

          {/* 标题和事件位置同一行 */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                required
                label="标题"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="事件位置"
                name="eventLocation"
                fullWidth
                value={formData.eventLocation}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* 内容输入框 */}
          <TextField
            required
            label="内容"
            name="content"
            margin="dense"
            fullWidth
            multiline
            rows={6} // 调整高度
            value={formData.content}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {/* 描述输入框 */}
          <TextField
            required
            label="描述"
            name="description"
            margin="dense"
            fullWidth
            multiline
            rows={4} // 调整高度
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {/* 发布按钮 */}
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
            发布
          </Button>
        </Box>
      </Modal>

      {/* 成功提示 */}
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
          帖子创建成功！
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewPostModal;