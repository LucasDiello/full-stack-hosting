import React, { Suspense, useEffect, useState } from "react";
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { CiFaceFrown } from "react-icons/ci";
import apiRequest from "../../lib/apiRequest";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Footer from "../../components/footer/Footer";
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
      <div className="
      aboutContainer
      ">
          <div>
            <h1>Descubra Mais <span> Sobre nós </span></h1>
            <p>
              Somos uma empresa de tecnologia que conecta pessoas que querem comprar ou alugar imóveis com corretores e proprietários de imóveis. Nossa missão é tornar o processo de compra e aluguel de imóveis mais fácil e seguro.
              Com isso em mente, criamos uma plataforma que permite que você encontre o imóvel dos seus sonhos de forma rápida e fácil. Nossa plataforma é fácil de usar e oferece uma ampla variedade de imóveis para você escolher.
              <Link>
              Ler Mais
              </Link>
              </p>
          </div>
          <div className="need-movel">
          <div className="highlights">
            <FaStar color="" size={30} />
            <h2>
            - Destaques -
            </h2>
            <div className="why">
              <h3>Por que você vai amar este lugar</h3> 
              <p>
                Este é um lugar incrível para se viver, com uma localização
                privilegiada e uma vista maravilhosa.
              </p>
            </div>
            <div className="why">
              <h3>
                O que você precisa saber
              </h3>
              <p>
                Este lugar é perfeito para você, com uma localização privilegiada
                e uma vista maravilhosa.
              </p>
            </div>

            <button className="contact-we">
              Contate-nos
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListPage;
