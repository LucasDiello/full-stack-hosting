import React, { Suspense } from "react";
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { CiFaceFrown } from "react-icons/ci";
const ListPage = () => {
  
  const data = useLoaderData();
  console.log(data);
  console.log(data.postResponse.data);
  return (
    <div className="listPage">
      <div className="listContainer">
          <Filter />
        <div className="wrapper">
          {
            data.postResponse.data.length === 0 ? <div className="post-notfound">
              <p>
              Infelizmente não encontramos nenhum imóvel com essas características.
              </p>
              <CiFaceFrown size={50} />
              </div> :
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
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
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.postResponse}
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
