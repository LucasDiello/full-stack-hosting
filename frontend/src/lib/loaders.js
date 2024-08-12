import { defer } from "react-router-dom"
import apiRequest from "./apiRequest"

export const singlePageLoader = async ({request,params}) => {
    const res = await apiRequest("/posts/"+params.id)
    console.log(res)
    console.log(params.id)
    console.log(res)
    return res.data;
}

export const listPageLoader = async ({ request, params }) => {
    const query = request.url.split("?")[1];
    const postPromise = await apiRequest("/posts?" + query);
    return defer({
        postResponse: postPromise,
    });
  };
  
  export const profilePageLoader = async () => {
    const postPromise = apiRequest("/users/profilePosts");
    const chatPromise = apiRequest("/chats");
    console.log(await chatPromise)
    return defer({
      postResponse: postPromise,
      chatResponse: chatPromise,
    });
  };