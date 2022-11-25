import React from "react";
import "./Header.css";
import gifmovie from "../components/img/funmoviegif.gif";

export default ({ black, setSearchItem }) => {
  return (
    <header className={black ? "black" : ""}>
      <div className="header--logo">
        <a href="/">
          <img src={gifmovie} alt="FunMovie" />
        </a>
      </div>

      <input
        className="search"
        type="text"
        placeholder="Pesquisa🔎"
        onChange={(e) => {
          setSearchItem(e.target.value);
        }}
      />
    </header>
  );
};
