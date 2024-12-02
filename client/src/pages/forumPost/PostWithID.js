import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Chip,
  Fab,
  Modal,
  TextField,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getPostDetail,
  getUserDetail,
  getComments,
  submitComment,
  deletePost,
  updateComment,
  deleteComment,
  fetchTags,
  getPostHashtags,
} from "../../services/apiService.js";
import { postBoxStyle } from "./postStyles.js";
import axios from "axios";


const PostWithID = () => {
  const { id } = useParams(); // 获取帖子 ID
  const navigate = useNavigate(); // 跳转导航
  const [post, setPost] = useState(null); // 帖子详情
  const [author, setAuthor] = useState(null); // 作者信息
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误信息
  const [comment, setComment] = useState(""); // 评论内容
  const [open, setOpen] = useState(false); // 控制评论对话框
  const [comments, setComments] = useState([]); // 评论数据
  const [userMap, setUserMap] = useState({}); // 存储 userId -> display_name 的映射
  const [replyOpen, setReplyOpen] = useState(false); // 回复对话框控制
  const [parentId, setParentId] = useState(null); // 当前回复的评论 ID
  const [replyContent, setReplyContent] = useState(""); // 回复内容
  const [currentUserId, setCurrentUserId] = useState(null); // 当前用户 ID
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // 删除确认框控制
  const [editingComment, setEditingComment] = useState(null); // 当前编辑的评论
  const [editedContent, setEditedContent] = useState(""); // 编辑后的内容
  const [tags, setTags] = useState([]); // 保存 tags 数据
  const [loadingTags, setLoadingTags] = useState(true); // Tags 加载状态

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // 从 localStorage 获取用户信息
    if (user) { setCurrentUserId(user.id); }

    const fetchData = async () => {
      try {
        const postDetail = await getPostDetail(id); // 获取帖子详情
        setPost(postDetail);

        const userDetail = await getUserDetail(postDetail.author); // 获取作者详情
        setAuthor(userDetail);

        const commentsData = await getComments(id); // 获取评论列表
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("无法加载数据，请稍后重试！");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const fetchTags = async () => {
      try {
        const tagTexts = await getPostHashtags(id); // 获取 hashtag_text 列表
        setTags(tagTexts); // 保存 Tags 数据
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("无法加载标签数据！");
      } finally {
        setLoadingTags(false); // 结束加载状态
      }
    };

    fetchTags();
  }, [id]);

  const handleReplyClick = (commentId) => {
    setParentId(commentId); // 设置要回复的评论 ID
    setReplyOpen(true); // 打开回复对话框
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment); // 设置为编辑状态
    setEditedContent(comment.content); // 初始化编辑内容
  };

  const handleSaveEdit = async () => {
    try {
      await updateComment(editingComment.id, editedContent); // 调用更新 API
      alert("评论更新成功！");
      setEditingComment(null); // 退出编辑状态
      // 重新获取评论
      const commentsData = await getComments(id);
      setComments(commentsData);
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("评论更新失败！");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId); // 调用删除 API
      alert("评论已删除！");
      // 重新获取评论
      const commentsData = await getComments(id);
      setComments(commentsData);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("删除评论失败！");
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await submitComment(id, comment); // 提交评论
      alert("评论提交成功！");
      setComment(""); // 清空输入框
      setOpen(false); // 关闭对话框

      // 重新获取评论
      const commentsData = await getComments(id);
      setComments(commentsData);
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("评论提交失败，请稍后重试！");
    }
  };

  const handleReplySubmit = async () => {
    try {
      await submitComment(id, replyContent, parentId); // 调用 API 提交回复
      alert("回复提交成功！");
      setReplyContent(""); // 清空输入框
      setReplyOpen(false); // 关闭对话框

      // 刷新评论数据
      const commentsData = await getComments(id);
      setComments(commentsData);
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("回复提交失败，请稍后重试！");
    }
  };

  const fetchUserName = async (userId) => {
    if (userMap[userId]) return; // 如果已经有该用户信息，直接返回

    try {
      const userDetail = await getUserDetail(userId);
      setUserMap((prev) => ({ ...prev, [userId]: userDetail.display_name || "未知用户" }));
    } catch (error) {
      console.error(`Error fetching user name for userId ${userId}:`, error);
    }
  };

  const renderReplies = (replies) =>
    replies.map((reply) => {
      fetchUserName(reply.author); // 获取用户名称

      return (
        <Box
          key={reply.id}
          sx={{
            paddingLeft: 4,
            marginTop: 1,
            borderLeft: "1px solid #ddd",
            backgroundColor: "#f9f9f9", // 子回复的背景色
            borderRadius: 2,
            padding: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
            {reply.content}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {userMap[reply.author] ? `${userMap[reply.author]} - ` : "加载中..."}时间:{" "}
            {new Date(reply.create_time).toLocaleString()}
          </Typography>
          <Box sx={{ marginTop: 1 }}>
            <Button size="small" onClick={() => handleReplyClick(reply.id)}>
              Reply
            </Button>
            {currentUserId === reply.author && (
              <>
                <Button size="small" onClick={() => handleEditComment(reply)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => handleDeleteComment(reply.id)}>
                  Delete
                </Button>
              </>
            )}
          </Box>
          {/* 递归渲染子回复 */}
          {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies)}
        </Box>
      );
    });

  const renderComments = () =>
    comments.map((comment) => {
      fetchUserName(comment.author);

      return (
        <Box
          key={comment.id}
          sx={{
            marginBottom: 2,
            padding: 2,
            border: "2px solid #ddd",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            {comment.content}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {userMap[comment.author] ? `${userMap[comment.author]} - ` : "加载中..."}时间:{" "}
            {new Date(comment.create_time).toLocaleString()}
          </Typography>
          <Box sx={{ marginTop: 1 }}>
            <Button size="small" onClick={() => handleReplyClick(comment.id)}>
              Reply
            </Button>
            {currentUserId === comment.author && (
              <>
                <Button size="small" onClick={() => handleEditComment(comment)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </Button>
              </>
            )}
          </Box>
          {comment.replies && renderReplies(comment.replies)}
        </Box>
      );
    });

  const handleDeletePost = async () => {
    try {
      await deletePost(id); // 调用删除 API
      alert("帖子已删除！");
      navigate("/posts"); // 跳转到帖子列表页
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("删除失败，请稍后重试！");
    } finally {
      setDeleteConfirmOpen(false); // 关闭确认框
    }
  };

  if (loadingTags) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <CircularProgress />
        <Typography sx={{ marginTop: 2 }}>加载标签中...</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography sx={{ marginTop: 2 }}>加载中...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const getInitials = (name) => {
    return name ? name[0].toUpperCase() : "?";
  };

  return (
    <Box>
      {/* 帖子信息框 */}
      <Box sx={postBoxStyle}>
        <Grid container spacing={2}>
          {/* 作者信息在左侧 */}
          <Grid item xs={12} md={2}>
            <Box
              sx={{
                padding: 2,
                borderRight: "1px solid #444",
                height: "100%",
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#1976d2", // 蓝色背景
                  margin: "0 auto",
                  fontSize: "24px", // 字母大小
                }}
              >
                {getInitials(author.display_name)}
              </Avatar>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                作者信息
              </Typography>
              <Typography variant="body1">名称: {author.display_name || "未提供"}</Typography>
              <Typography variant="body1">邮箱: {author.email}</Typography>
              <Typography variant="body2" color="textSecondary">
                简介: {author.bio || "暂无简介"}
              </Typography>
            </Box>
          </Grid>

          {/* 帖子内容在右侧 */}
          <Grid item xs={12} md={10}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                帖子详情
              </Typography>
              {post.image_url && (
                <Box
                  component="img"
                  src={post.image_url}
                  alt="Post Image"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    marginBottom: 2,
                    display: post.image_url ? "block" : "none",
                  }}
                />
              )}
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {post.content}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                创建时间：{new Date(post.create_time).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: "block", marginTop: 1 }}>
                {post.update_time
                  ? `最后编辑时间：${new Date(post.update_time).toLocaleString()}`
                  : "未编辑"}
              </Typography>

              {/* 标签展示区 */}
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  标签：
                </Typography>
                {loadingTags ? (
                  <Typography>加载标签中...</Typography>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        sx={{ fontSize: "14px", backgroundColor: "#e0f7fa" }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* 评论区 */}
      <Box
        sx={{
          margin: 8,
          padding: 2,
          border: "2px solid #444",
          borderRadius: 4,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          评论
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {renderComments()}
      </Box>

      {/* 浮动评论按钮 */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => setOpen(true)}
      >
        <AddCommentIcon />
      </Fab>

      {/* 编辑按钮（仅作者可见） */}
      {currentUserId === post.author && (
        <>
          <Fab
            color="secondary"
            sx={{ position: "fixed", bottom: 24, right: 96 }}
            onClick={() => navigate(`/edit-post/${id}`)}
          >
            <EditIcon />
          </Fab>

          {/* 删除按钮 */}
          <Fab
            color="error"
            sx={{ position: "fixed", bottom: 24, right: 168 }}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <DeleteIcon />
          </Fab>
        </>
      )}

      {/* 评论对话框 */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            添加评论
          </Typography>
          <TextField
            label="评论内容"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Box sx={{ marginTop: 2, textAlign: "right" }}>
            <Button onClick={() => setOpen(false)} sx={{ marginRight: 1 }}>
              取消
            </Button>
            <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
              提交
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* 回复对话框 */}
      <Modal open={replyOpen} onClose={() => setReplyOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            回复评论
          </Typography>
          <TextField
            label="回复内容"
            multiline
            rows={4}
            fullWidth
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Box sx={{ marginTop: 2, textAlign: "right" }}>
            <Button onClick={() => setReplyOpen(false)} sx={{ marginRight: 1 }}>
              取消
            </Button>
            <Button variant="contained" color="primary" onClick={handleReplySubmit}>
              提交
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* 删除确认框 */}
      <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            确认删除
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            确定要删除此帖子吗？此操作不可撤销。
          </Typography>
          <Box sx={{ textAlign: "right" }}>
            <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ marginRight: 1 }}>
              取消
            </Button>
            <Button variant="contained" color="error" onClick={handleDeletePost}>
              确认删除
            </Button>
          </Box>
        </Box>
      </Modal>

      {editingComment && (
        <Modal open={true} onClose={() => setEditingComment(null)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              编辑评论
            </Typography>
            <TextField
              label="评论内容"
              multiline
              rows={4}
              fullWidth
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <Box sx={{ marginTop: 2, textAlign: "right" }}>
              <Button onClick={() => setEditingComment(null)} sx={{ marginRight: 1 }}>
                取消
              </Button>
              <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                保存
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

    </Box>
  );
};

export default PostWithID;