import React, { useState } from "react";
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
  const handleSubmit = () => {
    if (!formData.title || !formData.eventLocation || !formData.content || !formData.description) {
      alert("请填写所有必填项");
      return;
    }

    console.log("发布的内容:", formData);

    setSuccessMessage(true);
    setFormData({ title: "", eventLocation: "", content: "", description: "" });
    handleClose();
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