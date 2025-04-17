// hooks/useSavePost.js
import { useState, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiRequest from "../lib/apiRequest";

const useSavePost = () => {
  const { currentUser } = useContext(AuthContext);
  const data = useLoaderData();
  const post = data.postResponse.data;
  const navigate = useNavigate();
  const [saveds, setSaveds] = useState();
  const [isSaved, setIsSaved] = useState(false);
  if (saveds) {
  }

  const fetchSavedPosts = async () => {
    if (!currentUser) return;
    try {
      const response = await apiRequest.get("/users/saves");
      setSaveds(response.data);
    } catch (error) {
      console.error("Erro ao buscar posts salvos:", error);
    }
  };

  const handleSave = async (postId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setIsSaved((prev) => !prev);

    try {
      const res = await apiRequest.post("/users/save", {
        postId,
        tokenUserId: currentUser.id,
      });

      return res;
    } catch (err) {
      console.log(err);
    }
  };
  console.log(saveds);
  return {
    handleSave,
    fetchSavedPosts,
    saveds,
    currentUser,
    setSaveds,
    isSaved,
    setIsSaved,
  };
};

export default useSavePost;
