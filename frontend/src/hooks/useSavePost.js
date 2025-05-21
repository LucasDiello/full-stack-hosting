// hooks/useSavePost.js
import { useState, useEffect, useContext } from "react";
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
      const response = await apiRequest.get("/users/savedPosts");
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
      await fetchSavedPosts(); // Atualiza a lista após salvar
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      throw error;
    }
  };

  const checkIfSaved = (postId) => {
    return saveds.some((saved) => saved.postId === postId);
  };

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
