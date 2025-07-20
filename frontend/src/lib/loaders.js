import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ _request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request }) => {
  const query = request.url.split("?")[1] || "";
  try {
    const {
      data: { posts, pagination },
    } = await apiRequest("/posts?" + query);
    console.log(posts, pagination);
    return defer({
      postResponse: {
        posts: posts || [],
        pagination: pagination || {},
      },
    });
  } catch (err) {
    console.error("Erro ao carregar posts:", err);
    throw new Response("Erro ao carregar os posts", { status: 500 });
  }
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};
