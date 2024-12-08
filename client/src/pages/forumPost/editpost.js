import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Modal, Grid, Chip, Typography, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Close } from "@mui/icons-material";
import { getPostDetail } from "../../services/apiService.js";
import { updatePost } from "../../services/apiService.js";

const EditPost = ({ postId }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    hashtags: [],
    newHashtag: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (postId && open) {
      const fetchPostDetail = async () => {
        setLoading(true);
        try {
          const postData = await getPostDetail(postId);
          setFormData({
            title: postData.title || "",
            content: postData.content || "",
            hashtags: postData.hashtags || [],
            newHashtag: "",
          });
        } catch (err) {
          setError("Error fetching post detail.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPostDetail();
    }
  }, [postId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddHashtag = () => {
    if (formData.newHashtag && !formData.hashtags.includes(formData.newHashtag)) {
      setFormData((prevData) => ({
        ...prevData,
        hashtags: [...prevData.hashtags, formData.newHashtag],
        newHashtag: "",
      }));
    }
  };

  const handleRemoveHashtag = (hashtag) => {
    setFormData((prevData) => ({
      ...prevData,
      hashtags: prevData.hashtags.filter((tag) => tag !== hashtag),
    }));
  };

  const handleSubmit = async () => {
    try {
        const updatedData = {
          title: formData.title,
          content: formData.content,
          hashtags: formData.hashtags,
        };
        console.log(updatedData);
        const updatedPost = await updatePost(postId, updatedData);
        console.log(updatedPost);

        setOpen(false);
      } catch (error) {
        console.error("Error updating post:", error);
        alert("Failed to update post. Please try again."); 
      }
    };

  return (
    <>
      {/* Edit button (visible only to the author) */}
        <Fab
          color="secondary"
          sx={{ position: "fixed", bottom: 24, right: 96 }}
          onClick={() => setOpen(true)}
        >
          <EditIcon />
        </Fab>

      {/* Edit Post Modal */}
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="edit-post-modal">
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
    <Typography id="edit-post-modal" variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
      Edit Post
    </Typography>

    {loading ? (
      <Typography variant="body1">Loading...</Typography>
    ) : error ? (
      <Typography variant="body1" color="error">{error}</Typography>
    ) : (
      <>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              required
              label="Title"
              name="title"
              fullWidth
              value={formData.title}  // 表单填充标题内容
              onChange={handleChange}  // 处理标题内容变化
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              label="Content"
              name="content"
              fullWidth
              multiline
              rows={6}
              value={formData.content}  // 表单填充内容
              onChange={handleChange}  // 处理内容变化
            />
          </Grid>
        </Grid>

        {/* Hashtag Input */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={10}>
            <TextField
              label="New Hashtag"
              name="newHashtag"
              fullWidth
              value={formData.newHashtag}  // 当前新标签输入框的值
              onChange={handleChange}  // 更新新标签输入框的状态
              onKeyDown={(e) => e.key === "Enter" && handleAddHashtag()}  // 按Enter键添加标签
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary" fullWidth onClick={handleAddHashtag}>
              Add
            </Button>
          </Grid>
        </Grid>

        {/* Display selected hashtags */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginBottom: 2 }}>
          {formData.hashtags.map((hashtag, index) => (
            <Chip
              key={index}
              label={hashtag}  // 显示每个标签
              onDelete={() => handleRemoveHashtag(hashtag)}  // 删除标签的处理函数
              deleteIcon={<Close />}  // 删除图标
              color="primary"
              sx={{ fontSize: "14px", backgroundColor: "#e0f7fa" }}
            />
          ))}
        </Box>

        {/* Update button */}
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
          onClick={handleSubmit}  // 提交表单
        >
          Update Post
        </Button>
      </>
    )}
  </Box>
</Modal>

    </>
  );
};

export default EditPost;
