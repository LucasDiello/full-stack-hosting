import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || 100,
    maxPrice: searchParams.get("maxPrice") || 100000,
    bedroom: searchParams.get("bedroom") || 3,
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="filter">
      <h1>
        Resultados da busca por <b>{searchParams.get("city")}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Localização</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Localização da Cidade"
            onChange={handleChange}
            defaultValue={query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Tipo</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
          >
            <option value="">qualquer</option>
            <option value="buy">Comprar</option>
            <option value="rent">Alugar</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Propriedade</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
          >
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
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Preço Máximo</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="qualquer"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Quartos</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="qualquer"
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
