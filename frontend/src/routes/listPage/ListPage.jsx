import React, { Suspense, useEffect, useState, useContext } from "react";
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import apiRequest from "../../lib/apiRequest";
import useSavePost from "../../hooks/useSavePost";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

const ListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchSavedPosts, currentUser, saveds } = useSavePost();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await fetchSavedPosts();
    })();
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest.get(
          `/posts?page=${page}&${searchParams.toString()}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Erro ao carregar os posts:", error);
      }
    };
    fetchData();
  }, [page, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        Carregando imóveis...
      </div>
    );
  }
  return (
    <div className="listPage">
      <div className="listContainer">
        {console.log(data, "data on div")}
        <Filter />
        {data.posts.map((post) => (
          <Card key={post.id} post={post} saveds={saveds} />
        ))}
      </div>
    </div>
  );
};

export default ListPage;
