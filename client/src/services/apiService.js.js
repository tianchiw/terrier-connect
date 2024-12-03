import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

const addAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: token };
  }
  return {};
};

export const getPostDetail = async (postId) => {
  try {
    const response = await apiClient.get(`/posts/get_post_detail/${postId}/`, {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching post detail:", error);
    throw error;
  }
};

export const getUserDetail = async (userId) => {
  try {
    const response = await apiClient.get(`/users/user/${userId}/`, {
      headers: addAuthHeader(),
    });
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user detail:", error);
    throw error;
  }
};

export const getComments = async (postId) => {
  const response = await apiClient.get(
    `/posts/${postId}/comments/?page=1&pageSize=10&orderBy=create_time`,
    {headers: addAuthHeader(),}
  );
  return response.data.results;
};
export const createPost = async (postId) => {
  const response = await apiClient.post(`/posts/add_post/`,
    {headers: addAuthHeader(),});
  return response.data;
};

export const updatePost = async (postId, data) => {
  try {
    const response = await apiClient.put(`/posts/update_post/${postId}/`, data, {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  const response = await apiClient.delete(`/posts/delete_post/${postId}/`,
    {headers: addAuthHeader(),});
  return response.data;
};

export const submitComment = async (postId, content, parentId = null) => {
  const response = await apiClient.post(
    "/posts/comments/create/",
    {
      post: postId,
      content: content,
      parent: parentId,
    },
    {
      headers: addAuthHeader(),
    }
  );
  return response.data;
};

export const getPostHashtags = async (postId) => {
  try {
    const response = await apiClient.get(
      `/hashtags/get_post_hashtags_by_post_id/${postId}/?page=1&pageSize=20`,
      {
        headers: addAuthHeader(),
      }
    );
    const hashtags = response.data.results || response.data;
    if (!Array.isArray(hashtags)) {
      throw new Error(`Expected an array but got ${typeof hashtags}`);
    }
    return hashtags.map((tag) => tag.hashtag_text);
  } catch (error) {
    console.error("Error fetching hashtags:", error);
    throw error;
  }
};

export const updateComment = async (commentId, content) => {
  const token = localStorage.getItem("token");
  const response = await apiClient.put(
    `/posts/comments/${commentId}/`,
    { content },
    {
      headers: { Authorization: token },
    }
  );
  return response.data;
};

export const deleteComment = async (commentId) => {
  const token = localStorage.getItem("token");
  const response = await apiClient.delete(`/posts/comments/${commentId}/`, {
    headers: { Authorization: token },
  });
  return response.data;
};

