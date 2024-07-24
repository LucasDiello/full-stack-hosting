import React from "react";
import "./singlePage.scss";
import Map from "../../components/map/Map";
import { singlePostData, userData } from "../../lib/dummydata";
import Slider from "../../components/slider/Slider";
import { useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";

const SinglePage = () => {
  const post = useLoaderData();
  console.log(post);

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.img} alt="" />
                <span>{post.user.name}</span>
              </div>
            </div>
            <div className="bottom">
              <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.postDetail.desc)}}></p>
            </div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">Geral</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilidades</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Proprietário é responsável</p>
                ) : (
                  <p>Inquilino é responsável</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Política de Animais</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Permitidos</p>
                ) : (
                  <p>Pets Não Permitidos</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Taxas de Propriedade</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Tamanhos</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} pés quadrados</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} quartos</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} banheiro</span>
            </div>
          </div>
          <p className="title">Locais Próximos</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>Escola</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Ônibus</span>
                <p>
                  {post.postDetail.bus > 999
                    ? post.postDetail.bus / 1000 + "km"
                    : post.postDetail.bus + "m"}
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurante</span>
                <p>
                  {post.postDetail.restaurant > 999
                    ? post.postDetail.restaurant / 1000 + "km"
                    : post.postDetail.restaurant + "m"}{" "}
                </p>
              </div>
            </div>
          </div>
          <p className="title">Localização</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button>
              <img src="/chat.png" alt="" />
              Enviar uma Mensagem
            </button>
            <button>
              <img src="/save.png" alt="" />
              Salvar o Local
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
