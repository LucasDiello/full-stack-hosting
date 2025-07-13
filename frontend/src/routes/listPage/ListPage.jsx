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
  const data = useLoaderData();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchSavedPosts, currentUser, saveds } = useSavePost();

  useEffect(() => {
    (async () => {
      await fetchSavedPosts();
    })();
  }, [currentUser]);
  console.log(data.postResponse);

  return (
    <div className="listPage">
      <div className="listContainer">
        <Filter />
        <Suspense fallback={<p>Loading...</p>}>
          {data.postResponse.posts.map((post) => {
            return (
              <Card
                key={post.id}
                post={post}
                saveds={saveds}
                currentUser={currentUser}
              />
            );
          })}
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => {
              console.log(postResponse);
              const posts = postResponse?.posts || [];
              const pageCount = postResponse?.pagination?.pageCount || 1;
              return (
                <>
                  <div className="wrapper">
                    {posts.map((post) => (
                      <Card key={post.id} post={post} saveds={saveds} />
                    ))}
                  </div>
                  <div className="btn">
                    <nav className="data-pagination">
                      <a
                        href="#"
                        disabled={page === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) {
                            setPage(page - 1);
                            setSearchParams({
                              ...Object.fromEntries(searchParams),
                              page: page - 1,
                            });
                          }
                        }}
                      >
                        <GrFormPrevious size={30} />
                      </a>
                      <ul>
                        {[...Array(pageCount)].map((_, index) => (
                          <li
                            key={index}
                            className={index + 1 === page ? "current" : ""}
                          >
                            <a
                              href={`#${index + 1}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(index + 1);
                                setSearchParams({
                                  ...Object.fromEntries(searchParams),
                                  page: index + 1,
                                });
                              }}
                            >
                              {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#"
                        disabled={page === pageCount}
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < pageCount) {
                            setPage(page + 1);
                            setSearchParams({
                              ...Object.fromEntries(searchParams),
                              page: page + 1,
                            });
                          }
                        }}
                      >
                        <GrFormNext size={30} />
                      </a>
                    </nav>
                  </div>
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          ></Await>
        </Suspense>
      </div>
      <div
        className="
      aboutContainer
      "
      >
        <div>
          <h1>
            Descubra Mais <span> Sobre nós </span>
          </h1>
          <p>
            Somos uma empresa de tecnologia que conecta pessoas que querem
            comprar ou alugar imóveis com corretores e proprietários de imóveis.
            Nossa missão é tornar o processo de compra e aluguel de imóveis mais
            fácil e seguro. Com isso em mente, criamos uma plataforma que
            permite que você encontre o imóvel dos seus sonhos de forma rápida e
            fácil. Nossa plataforma é fácil de usar e oferece uma ampla
            variedade de imóveis para você escolher.
            <Link>Ler Mais</Link>
          </p>
        </div>
        <div className="need-movel">
          <div className="highlights">
            <FaStar color="" size={30} />
            <h2>- Destaques -</h2>
            <div className="why">
              <h3>Por que você vai amar este lugar</h3>
              <p>
                Este é um lugar incrível para se viver, com uma localização
                privilegiada e uma vista maravilhosa.
              </p>
            </div>
            <div className="why">
              <h3>O que você precisa saber</h3>
              <p>
                Este lugar é perfeito para você, com uma localização
                privilegiada e uma vista maravilhosa.
              </p>
            </div>

            <button className="contact-we">Contate-nos</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPage;
