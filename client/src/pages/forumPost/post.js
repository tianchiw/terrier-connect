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
} from "../../services/apiService.js.js";
import { postBoxStyle } from "./postStyles.js";
import EditPost from "./editpost.js";


const PostWithID = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [replyOpen, setReplyOpen] = useState(false);
  const [parentId, setParentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) { setCurrentUserId(user.id); }

    const fetchData = async () => {
      try {
        const postDetail = await getPostDetail(id);
        setPost(postDetail);

        const userDetail = await getUserDetail(postDetail.author);
        setAuthor(userDetail);

        const commentsData = await getComments(id);
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to load data! ");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const fetchTags = async () => {
      try {
        const tagTexts = await getPostHashtags(id);
        setTags(tagTexts);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Unable to load tag data! ");
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, [id]);

  const handleReplyClick = (commentId) => {
    setParentId(commentId);
    setReplyOpen(true);
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditedContent(comment.content);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      alert("Comment deleted!");
      // Update comment area
      const commentsData = await getComments(id);
      setComments(commentsData);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment!");
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await submitComment(id, comment);
      alert("Comment submitted successfully!");
      setComment("");
      setOpen(false);

      // Update the comments
      const commentsData = await getComments(id);
      setComments(commentsData);
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Comment submission failed, please try again later.");
    }
  };

  const handleReplySubmit = async () => {
    try {
      await submitComment(id, replyContent, parentId);
      alert("Response submitted successfully!");
      setReplyContent("");
      setReplyOpen(false);

      // update the comments
      const commentsData = await getComments(id);
      setComments(commentsData);
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Reply Submission failed, please try again later.");
    }
  };

  const fetchUserName = async (userId) => {
    if (userMap[userId]) return;

    try {
      const userDetail = await getUserDetail(userId);
      setUserMap((prev) => ({ ...prev, [userId]: userDetail.display_name || "unkonwn user" }));
    } catch (error) {
      console.error(`Error fetching user name for userId ${userId}:`, error);
    }
  };

  const renderReplies = (replies) =>
    replies.map((reply) => {
      fetchUserName(reply.author);

      return (
        <Box
          key={reply.id}
          sx={{
            paddingLeft: 4,
            marginTop: 1,
            borderLeft: "1px solid #ddd",
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            padding: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
            {reply.content}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {userMap[reply.author] ? `${userMap[reply.author]} - ` : "Loading..."}Time:{" "}
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
          {/* Render sub replies */}
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
            {userMap[comment.author] ? `${userMap[comment.author]} - ` : "Loading..."}Time:{" "}
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
      await deletePost(id);
      alert("Post deleted!");
      navigate("/home");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Deletion failed, please try again later!");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  if (loadingTags) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <CircularProgress />
        <Typography sx={{ marginTop: 2 }}>Loading tags...</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography sx={{ marginTop: 2 }}>Loading...</Typography>
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

  return (
    <Box>
      {/* Post Info Box */}
      <Box sx={postBoxStyle}>
        <Grid container spacing={2}>
          {/* Author information on the left */}
          <Grid item xs={12} md={2}>
            <Box
              sx={{
                padding: 2,
                borderRight: "1px solid #444",
                height: "100%",
              }}
            >
              <Avatar
                sx={{ width: 60, height: 60, mb: 2 }}
                src={`http://localhost:8000${author.avatar_url}`}
                alt={author.display_name}
              />

              <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Author Info
              </Typography>
              <Typography variant="body1">Name: {author.display_name || "not provided"}</Typography>
              <Typography variant="body1">Email: {author.email}</Typography>
              <Typography variant="body2" color="textSecondary">
              Profile: {author.bio || "No Profile"}
              </Typography>
            </Box>
          </Grid>

          {/* The content of the post is on the right */}
          <Grid item xs={12} md={10}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Post Details
              </Typography>
              {post.image_url && (
          <Box
            component="img"
            src={`http://localhost:8000${post.image_url}`}
            alt="Post Image"
            sx={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "300px",
              borderRadius: 2,
              marginBottom: 2,
              objectFit: "contain",
              display: post.image_url ? "block" : "none",
            }}
          />
        )}
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {post.content}
              </Typography>
              <Typography variant="caption" color="textSecondary">
              Creation time:{new Date(post.create_time).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: "block", marginTop: 1 }}>
                {post.update_time
                  ? `Last edited:${new Date(post.update_time).toLocaleString()}`
                  : "unedited"}
              </Typography>

              {/* Tag Display Area */}
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  Tags:
                </Typography>
                {loadingTags ? (
                  <Typography>Loading Tags...</Typography>
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

      {/* comment section */}
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
          comments
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {renderComments()}
      </Box>

      {/* Floating comment button */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => setOpen(true)}
      >
        <AddCommentIcon />
      </Fab>

      {/* Edit button (visible only to the author) */}
      {currentUserId === post.author && (
        <>


          <EditPost
              postId={post.id}
              
            />

          {/* Delete button */}
          <Fab
            color="error"
            sx={{ position: "fixed", bottom: 24, right: 168 }}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <DeleteIcon />
          </Fab>
        </>
      )}

      {/* Comment dialog box */}
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
          Add a comment
          </Typography>
          <TextField
            label="content"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Box sx={{ marginTop: 2, textAlign: "right" }}>
            <Button onClick={() => setOpen(false)} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Respond to the dialog box */}
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
            reply
          </Typography>
          <TextField
            label="content"
            multiline
            rows={4}
            fullWidth
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Box sx={{ marginTop: 2, textAlign: "right" }}>
            <Button onClick={() => setReplyOpen(false)} sx={{ marginRight: 1 }}>
              cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleReplySubmit}>
              submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Box */}
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
          Confirm deletion
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Sure you want to delete this post? This action cannot be undone.
          </Typography>
          <Box sx={{ textAlign: "right" }}>
            <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDeletePost}>
            Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
};

export default PostWithID;