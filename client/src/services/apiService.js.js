import axios from "axios";

// 配置 axios 实例
const apiClient = axios.create({
  baseURL: "http://localhost:8000", // 后端基地址
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加 Token 到请求头
const addAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: token };
  }
  return {};
};

// 获取帖子详情
export const getPostDetail = async (postId) => {
  try {
    const response = await apiClient.get(`/posts/get_post_detail/${postId}/`, {
      headers: addAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching post detail:", error);
    throw error; // 抛出错误以便调用处处理
  }
};

// 获取用户详情
export const getUserDetail = async (userId) => {
  try {
    const response = await apiClient.get(`/users/user/${userId}/`, {
      headers: addAuthHeader(),
    });
    return response.data.user; // 返回用户详情
  } catch (error) {
    console.error("Error fetching user detail:", error);
    throw error; // 抛出错误以便调用处处理
  }
};

// 获取评论列表
export const getComments = async (postId) => {
  const response = await axios.get(
    `http://localhost:8000/posts/${postId}/comments/?page=1&pageSize=10&orderBy=create_time`,
    {
      headers: addAuthHeader(),
    }
  );
  return response.data.results;
};

export const submitComment = async (postId, content, parentId = null) => {
  const response = await axios.post(
    "http://localhost:8000/posts/comments/create/",
    {
      post: postId,
      content: content,
      parent: parentId, // 设置父评论 ID
    },
    {
      headers: addAuthHeader(),
    }
  );
  return response.data;
};

export const deletePost = async (postId) => {
  const token = localStorage.getItem("token");
  const response = await apiClient.delete(`/posts/${postId}/`, {
    headers: { Authorization: token },
  });
  return response.data;
};

// 获取tag API
export const getPostHashtags = async (postId) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/hashtags/get_post_hashtags_by_post_id/${postId}/?page=1&pageSize=20`,
      {
        headers: addAuthHeader(),
      }
    );
    const hashtags = response.data.results || response.data; // 获取 data
    if (!Array.isArray(hashtags)) {
      throw new Error(`Expected an array but got ${typeof hashtags}`);
    }
    return hashtags.map((tag) => tag.hashtag_text); // 提取 hashtag_text
  } catch (error) {
    console.error("Error fetching hashtags:", error);
    throw error; // 抛出错误供调用方处理
  }
};

// 更新评论 API
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

// 删除评论 API
export const deleteComment = async (commentId) => {
  const token = localStorage.getItem("token");
  const response = await apiClient.delete(`/posts/comments/${commentId}/`, {
    headers: { Authorization: token },
  });
  return response.data;
};

