import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { AuthContext } from "../../context/AuthContext";
import "./homePage.scss";

function HomePage() {
  const { currentUser } = useContext(AuthContext)
  console.log(currentUser)
  return (
    <div className="homePage">
        <div className="wrapper">
          <h1 className="title">Encontre Imóveis <span>&</span> seu Lugar dos Sonhos</h1>
          <p>
           Está procurando um lugar para morar? Nós temos a solução para você!
          </p>
          <SearchBar />
        </div>
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Anos de Experiência</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Prêmios Conquistados</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Propriedades Disponíveis</h2>
            </div>
          </div>
    </div>
  );
}

export default HomePage;
