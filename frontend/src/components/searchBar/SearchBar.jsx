import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = ["comprar", "alugar"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "comprar",
    typeQuery: "buy",
    city: "canoas",
    minPrice: 10,
    maxPrice: 100000,
  });
  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };
  
  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        <input
          type="text"
          name="city"
          placeholder="Cidade"
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Preço min"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Preço max"
          onChange={handleChange}
        />
        <Link
          to={`/list?type=${query.type === "comprar" ? "buy" : "rent"}&city=${
          query.city
          }&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
        >
          <button>
            <img src="/search.png" alt="" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
