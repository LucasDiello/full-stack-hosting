import React, { useState } from "react";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import "./newpostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import { IoIosSend, IoMdArrowDropdown } from "react-icons/io";

const NewPostPage = () => {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city.toLowerCase(),
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err);
      setCount(count + 1);
    }
  };
  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Adicionar Novo Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Título</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Preço</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Endereço</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Descrição</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">Cidade</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">N° de Quartos</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">N° de Banheiros</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Tipo</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Aluguel
                </option>
                <option value="buy">Compra</option>
              </select>
            </div>
            <div className="items">
            <div className="item">
              <label htmlFor="type">Propriedade</label>
              <select name="property">
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="condo">Condomínio</option>
                <option value="land">Terreno</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Política de Utilidades</label>
              <select name="utilities">
                <option value="owner">Responsabilidade do Proprietário</option>
                <option value="tenant">Responsabilidade do Inquilino</option>
                <option value="shared">Compartilhado</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Política de Animais de Estimação</label>
              <select name="pet">
                <option value="allowed">Permitido</option>
                <option value="not-allowed">Não Permitido</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Renda necessária</label>
              <input
                id="income"
                name="income"
                type="text"
                />
            </div>
            <div className="item">
              <label htmlFor="size">Tamanho Total (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">Escola Próx. (metros)</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">Ônibus Próx. (metros)</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurante Próx. (metros)</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
                </div>
            <button className="sendButton"><IoIosSend size={30} /></button>
            {error && <div className="error"><p>
              Alguma coisa deu errado. Tente novamente.<span>({count})</span>
              </p>
              </div>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.length > 0 ? (
          <div className="example-images">
              <div className="title">
            <p>Suas imagens </p>
            <IoMdArrowDropdown size={40} color="#f1f1f1"/>
            </div>
          {
            images.map((image, index) => <img src={image} key={index} alt="" />)
            }
        </div>) : (
          <div className="example-images">
            <div className="title">
            <p>Adicione imagens do seu imóvel. <br /> exemplo  <br /></p>
            <IoMdArrowDropdown size={40} color="#f1f1f1"/>
            </div>
            <img src="./example1.jpg" alt="example_house1" />
            <img src="./example2.jpg" alt="example_house2" />
            <img src="./example3.jpg" alt="example_house3" />
            <img src="./example4.jpg" alt="example_house4" />
          </div>
        )}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lucasdiello",
            uploadPreset: "ld_homes",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
};

export default NewPostPage;
