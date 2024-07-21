import React from 'react';
import "./filter.scss";

const Filter = () => {
  return (
    <div className="filter">
      <h1>
        Resultados da busca por <b>Londres</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Localização</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Localização da Cidade"
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Tipo</label>
          <select name="type" id="type">
            <option value="">qualquer</option>
            <option value="buy">Comprar</option>
            <option value="rent">Alugar</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Propriedade</label>
          <select name="property" id="property">
            <option value="">qualquer</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="condo">Condomínio</option>
            <option value="land">Terreno</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Preço Mínimo</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="qualquer"
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Preço Máximo</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="qualquer"
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Quartos</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="qualquer"
          />
        </div>
        <button>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
