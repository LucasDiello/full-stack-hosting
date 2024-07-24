import { defer } from "react-router-dom"
import apiRequest from "./apiRequest"

export const singlePageLoader = async ({request,params}) => {
    const res = await apiRequest("/posts/"+params.id)
    console.log(res)
    console.log(params.id)
    return res.data;
}

export const listPageLoader = async ({ request, params }) => {
    console.log(request)
    const query = request.url.split("?")[1];
    const postPromise = await apiRequest("/posts?" + query);
    console.log(postPromise)
    return defer({
        postResponse: postPromise,
    });
  };
  