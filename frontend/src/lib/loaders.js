import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ _request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request }) => {
  const query = request.url.split("?")[1] || "";
  try {
    const response = await apiRequest("/posts?" + query);

    return defer({
      postResponse: response.data,
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
