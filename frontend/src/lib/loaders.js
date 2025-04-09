import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ _request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = ({ request, _params }) => {
  const query = request.url.split("?")[1];
  const dataPromise = apiRequest("/posts?" + query);
  console.log();
  return defer({
    postResponse: dataPromise,
  });
};
export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};
