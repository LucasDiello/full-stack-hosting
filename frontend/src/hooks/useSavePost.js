// hooks/useSavePost.js
import { useState, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiRequest from "../lib/apiRequest";

const useSavePost = () => {
  const post = useLoaderData();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(post.isSaved);

  const handleSave = async (postId) => {
    setSaved((prev) => !prev);
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await apiRequest.post("/users/save", {
        postId,
        tokenUserId: currentUser.id,
      });
      console.log(res);
    } catch (err) {
      setSaved((prev) => !prev);
      console.log(err);
    }
  };

  return { saved, setSaved, handleSave };
};

export default useSavePost;
