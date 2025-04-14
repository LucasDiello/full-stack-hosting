// hooks/useSavePost.js
import { useState, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiRequest from "../lib/apiRequest";

const useSavePost = () => {
  const post = useLoaderData();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [saveds, setSaveds] = useState();

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

    try {
      const res = await apiRequest.post("/users/save", {
        postId,
        tokenUserId: currentUser.id,
      });

      await fetchSavedPosts();

      return res;
    } catch (err) {
      console.error("Erro ao salvar o item:", err);
    }
  };

  return { handleSave, fetchSavedPosts, saveds, currentUser };
};

export default useSavePost;
