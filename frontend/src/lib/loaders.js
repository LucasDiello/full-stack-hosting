import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ _request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = ({ request }) => {
  const url = new URL(request.url);
  const queryParams = {
    city: url.searchParams.get("city") || undefined,
    type: url.searchParams.get("type") || undefined,
    property: url.searchParams.get("property") || undefined,
    bedroom: url.searchParams.get("bedroom") || undefined,
    minPrice: url.searchParams.get("minPrice") || undefined,
    maxPrice: url.searchParams.get("maxPrice") || undefined,
    page: url.searchParams.get("page") || "1",
  };

  // Remove parâmetros undefined da query
  const validParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, value]) => value !== undefined)
  );

  const queryString = new URLSearchParams(validParams).toString();

  const dataPromise = apiRequest(`/posts?${queryString}`).then((response) => {
    if (!response.data) {
      throw new Error("Erro ao carregar os posts");
    }
    return response;
  });

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
