// hooks/useSavePost.js
import { useState, useEffect, useContext, useCallback } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiRequest from "../lib/apiRequest";

const useSavePost = () => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const [saveds, setSaveds] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const fetchSavedPosts = async () => {
    if (!currentUser) return;

    try {
      const response = await apiRequest.get("/users/saves");
      setSaveds(response.data);
    } catch (error) {
      console.error("Erro ao buscar posts salvos:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSavedPosts();
    }
  }, [currentUser]);

  const handleSave = async (postId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setIsSaved((prev) => !prev);

    try {
      const response = await apiRequest.post("/users/save", { postId });
      await fetchSavedPosts();
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      throw error;
    }
  };

  const checkIfSaved = useCallback(
    (postId) => {
      return saveds.some((saved) => saved.postId === postId);
    },
    [saveds]
  );

  return {
    isSaved,
    setIsSaved,
    saveds,
    handleSave,
    checkIfSaved,
    fetchSavedPosts,
  };
};

export default useSavePost;
