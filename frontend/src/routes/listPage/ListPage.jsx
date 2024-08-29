import React, { Suspense, useEffect, useState } from "react";
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { CiFaceFrown } from "react-icons/ci";
import apiRequest from "../../lib/apiRequest";
import { IoIosArrowDown } from "react-icons/io";
const ListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useLoaderData();
  const [take, setTake] = useState(3);
  const [posts, setPosts] = useState(data.postResponse);
  useEffect(() => {
    setPosts(data.postResponse);
  } , [searchParams]);

  const handleMorePosts = async () => {
    setTake((prev) => prev + 3);
    // Atualize o parâmetro morePosts na URL com o novo valor
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('morePosts', take);
  
    setSearchParams(newParams);
  };
  console.log(searchParams.toString());
  return (
    <div className="listPage">
      <div className="listContainer">
          <Filter />
        <div className="wrapper">
          {
            posts.data.length === 0 ? <div className="post-notfound">
              <p>
              Infelizmente não encontramos nenhum imóvel com essas características.
              </p>
              <CiFaceFrown size={50} />
              </div> :
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={posts}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
          }
        </div>
        <div className="btn">
            <button onClick={handleMorePosts} className="btn">
              <IoIosArrowDown size={20} />
                </button>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={posts}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

export default ListPage;
